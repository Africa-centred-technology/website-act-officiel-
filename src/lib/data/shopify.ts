/**
 * Shopify Data Integration — Unified
 * Centralise toute la logique Shopify (Config, Client, Formations) pour ACT
 */

// ── CONFIGURATION ──────────────────────────────────────────────────────────

const getEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    return (process.env as any)[key] || '';
  }
  return process.env[key] || '';
};

export const SHOPIFY_CONFIG = {
  domain: getEnv('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN') || '',
  accessToken: getEnv('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN') || '',
  clientId: getEnv('NEXT_PUBLIC_SHOPIFY_CLIENT_ID') || '',
  apiVersion: '2024-01',
};

export const isShopifyConfigured = 
  !!SHOPIFY_CONFIG.domain && 
  !!SHOPIFY_CONFIG.accessToken && 
  SHOPIFY_CONFIG.domain !== 'votre-boutique.myshopify.com' &&
  SHOPIFY_CONFIG.domain !== '';

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

// ── CLIENT ─────────────────────────────────────────────────────────────────

/**
 * Fonction générique pour effectuer des requêtes GraphQL vers Shopify
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
}): Promise<T> {
  if (!isShopifyConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('Shopify non configuré.');
      return { products: { edges: [] } } as any;
    }
    throw new Error('Shopify n\'est pas configuré.');
  }

  try {
    const isBrowser = typeof window !== 'undefined';
    const options: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.accessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    };

    if (!isBrowser) {
      options.cache = cache;
      options.next = { revalidate: 3600 };
    } else {
      options.cache = 'no-store';
    }

    const result = await fetch(SHOPIFY_GRAPHQL_URL, options);
    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }
    return body.data;
  } catch (error) {
    console.error('Erreur Shopify API:', error);
    throw error;
  }
}

// ── FORMATIONS ─────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string;
  title: string;
  descriptionHtml: string;
  handle: string;
  tags: string[];
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  secteur?: { value: string };
  categorie?: { value: string };
  niveau?: { value: string };
  duree?: { value: string };
  format?: { value: string };
  accroche?: { value: string };
  public_cible?: { value: string };
  prerequis?: { value: string };
  methode?: { value: string };
  objectifs?: { value: string };
  programme?: { value: string };
  livrables?: { value: string };
}

const PRODUCT_FRAGMENT = `
  id
  title
  descriptionHtml
  handle
  tags
  vendor
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url
    altText
  }
  variants(first: 1) {
    edges {
      node {
        id
        title
        price {
          amount
          currencyCode
        }
      }
    }
  }
  secteur: metafield(namespace: "custom", key: "secteur") { value }
  categorie: metafield(namespace: "custom", key: "categorie") { value }
  niveau: metafield(namespace: "custom", key: "niveau") { value }
  duree: metafield(namespace: "custom", key: "duree") { value }
  format: metafield(namespace: "custom", key: "format") { value }
  accroche: metafield(namespace: "custom", key: "accroche") { value }
  public_cible: metafield(namespace: "custom", key: "public_cible") { value }
  prerequis: metafield(namespace: "custom", key: "prerequis") { value }
  methode: metafield(namespace: "custom", key: "methode") { value }
  objectifs: metafield(namespace: "custom", key: "objectifs") { value }
  programme: metafield(namespace: "custom", key: "programme") { value }
  livrables: metafield(namespace: "custom", key: "livrables") { value }
`;

export async function getFormationsFromShopify(first = 50): Promise<ShopifyProduct[]> {
  const query = `
    query getFormations($first: Int!) {
      products(first: $first, query: "tag:formation") {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
      query,
      variables: { first },
    });
    return data.products.edges.map(e => e.node);
  } catch (error) {
    console.error('Erreur getFormationsFromShopify:', error);
    return [];
  }
}

export async function getFormationBySlug(slug: string): Promise<ShopifyProduct | null> {
  const query = `
    query getFormationByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FRAGMENT}
      }
    }
  `;
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct }>({
      query,
      variables: { handle: slug },
    });
    return data.product;
  } catch (error) {
    console.error('Erreur getFormationBySlug:', error);
    return null;
  }
}

export function mapShopifyProductToFormation(product: ShopifyProduct): any {
  return {
    id: product.id,
    slug: product.handle,
    title: product.title,
    secteur: product.secteur?.value || "Transversal",
    categorie: product.categorie?.value || "Intelligence Artificielle",
    niveau: product.niveau?.value || "Initiation",
    duree: product.duree?.value || "7h",
    format: product.format?.value || "Présentiel",
    prix: formatPrice(
      product.priceRange.minVariantPrice.amount,
      product.priceRange.minVariantPrice.currencyCode
    ),
    accroche: product.accroche?.value || "",
    publicCible: product.public_cible?.value || "",
    prerequis: product.prerequis?.value || "",
    methode: product.methode?.value || "",
    objectifs: parseJsonMetafield(product.objectifs?.value, []),
    programme: parseJsonMetafield(product.programme?.value, []),
    livrables: parseJsonMetafield(product.livrables?.value, []),
    image: product.featuredImage?.url || ""
  };
}

function parseJsonMetafield(value: string | undefined, fallback: any) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

function formatPrice(amount: string, currency: string) {
  const value = parseFloat(amount);
  if (isNaN(value) || value === 0) return "Nous consulter";
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(value);
}
