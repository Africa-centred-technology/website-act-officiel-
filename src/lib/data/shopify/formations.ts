/**
 * Fonctions spécifiques pour récupérer les formations via l'API Shopify Storefront
 */
import { shopifyFetch } from './client';

/**
 * Interface pour un produit Shopify (Formation)
 */
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
  /* Metafields correspondants aux formations */
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

/**
 * GraphQL Fragment pour les détails d'un produit
 */
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

/**
 * Récupérer toutes les formations (produits avec tag 'formation')
 */
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

  const variables = { first };
  
  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
      query,
      variables,
    });
    
    return data.products.edges.map(e => e.node);
  } catch (error) {
    console.error('Erreur getFormationsFromShopify:', error);
    return [];
  }
}

/**
 * Récupérer une formation par son slug
 */
export async function getFormationBySlug(slug: string): Promise<ShopifyProduct | null> {
  const query = `
    query getFormationByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FRAGMENT}
      }
    }
  `;

  const variables = { handle: slug };
  
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct }>({
      query,
      variables,
    });
    
    return data.product;
  } catch (error) {
    console.error('Erreur getFormationBySlug:', error);
    return null;
  }
}

/**
 * Mappe un produit Shopify vers le format interne Formation
 */
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
    /* Fallbacks pour les champs non encore gérés par Shopify Metafields */
    objectifs: parseJsonMetafield(product.objectifs?.value, []),
    programme: parseJsonMetafield(product.programme?.value, []),
    livrables: parseJsonMetafield(product.livrables?.value, []),
    image: product.featuredImage?.url || ""
  };
}

/**
 * Helper pour parser les metafields JSON
 */
function parseJsonMetafield(value: string | undefined, fallback: any) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

/**
 * Helper pour formater le prix
 */
function formatPrice(amount: string, currency: string) {
  const value = parseFloat(amount);
  if (isNaN(value) || value === 0) return "Nous consulter";
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(value);
}
