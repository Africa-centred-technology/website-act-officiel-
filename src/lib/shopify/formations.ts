/**
 * Shopify Storefront API — Formations fetcher
 * Maps Shopify products → Formation interface
 *
 * Variables d'environnement requises (côté serveur uniquement) :
 *   SHOPIFY_STORE_DOMAIN=act-formation.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN=<votre token>
 *
 * Convention de tags Shopify sur chaque produit :
 *   niveau:Initiation
 *   secteur:Santé
 *   categorie:Intelligence artificielle
 *   duree:1 journée (7h)
 *   format:Présentiel ou distanciel
 */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_VERSION   = "2024-01";
const ENDPOINT      = `https://${SHOPIFY_STORE}/api/${API_VERSION}/graphql.json`;

// ── GraphQL query ─────────────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query GetFormations($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          description
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "niveau" }
            { namespace: "custom", key: "secteur" }
            { namespace: "custom", key: "categorie" }
            { namespace: "custom", key: "duree" }
            { namespace: "custom", key: "format" }
            { namespace: "custom", key: "accroche" }
            { namespace: "custom", key: "parcours" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

// ── Type helpers ──────────────────────────────────────────────────────────────

export interface ShopifyFormationCard {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  prix: string;
  accroche: string;
  imageUrl?: string;
  shopifyId: string;
}

/** Extrait une valeur d'un tag de la forme "key:value" */
function extractTag(tags: string[], key: string): string {
  const prefix = `${key}:`;
  const tag = tags.find((t) => t.toLowerCase().startsWith(prefix.toLowerCase()));
  return tag ? tag.slice(prefix.length).trim() : "";
}

/** Extrait la valeur d'un metafield par clé et nettoie le format */
function extractMeta(metafields: { key: string; value: string }[], key: string): string {
  const mf = metafields?.find((m) => m?.key === key);
  if (!mf?.value) return "";
  
  let value = mf.value.trim();
  
  // Si la valeur commence par [ ou {, essaie de la parser comme JSON
  if ((value.startsWith("[") || value.startsWith("{")) && value.endsWith("]") || value.endsWith("}")) {
    try {
      const parsed = JSON.parse(value);
      // Si c'est un tableau, prend le premier élément
      if (Array.isArray(parsed)) {
        value = parsed[0]?.toString() || "";
      } else {
        // Si c'est un objet, retourne la chaîne brute (déjà stringifiée)
        return value;
      }
    } catch {
      // Si le parsing échoue, garde la valeur originale
    }
  }
  
  return value.trim();
}

/** Formate le prix depuis Shopify */
function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (isNaN(value) || value === 0) return "Nous consulter";
  if (currencyCode === "MAD") return `${Math.round(value)} dhs`;
  return `${Math.round(value)} ${currencyCode}`;
}

/** Mappe un node produit Shopify → ShopifyFormationCard */
function mapProduct(node: any): ShopifyFormationCard {
  const tags: string[] = node.tags ?? [];
  const metafields: { key: string; value: string }[] = node.metafields ?? [];
  const price = node.priceRange?.minVariantPrice;
  const firstImage = node.images?.edges?.[0]?.node;

  // Priorité : metafield > tag > valeur par défaut
  const niveau    = extractMeta(metafields, "niveau")    || extractTag(tags, "niveau")    || "";
  const secteur   = extractMeta(metafields, "secteur")   || extractTag(tags, "secteur")   || "";
  const categorie = extractMeta(metafields, "categorie") || extractTag(tags, "categorie") || "";
  const duree     = extractMeta(metafields, "duree")     || extractTag(tags, "duree")     || "";
  const format    = extractMeta(metafields, "format")    || extractTag(tags, "format")    || "";
  const accroche  = extractMeta(metafields, "accroche")  || node.description              || "";
  const parcours  = extractMeta(metafields, "parcours")  || extractTag(tags, "parcours")  || undefined;
  const prix      = formatShopifyPrice(price?.amount ?? "0", price?.currencyCode ?? "MAD");

  return {
    shopifyId:  node.id,
    id:         node.handle,
    slug:       node.handle,
    title:      node.title,
    secteur,
    categorie,
    niveau,
    duree,
    format,
    parcours:   parcours || undefined,
    prix,
    accroche,
    imageUrl:   firstImage?.url,
  };
}

// ── Main fetcher ──────────────────────────────────────────────────────────────

export async function fetchShopifyFormations(): Promise<ShopifyFormationCard[]> {
  const all: ShopifyFormationCard[] = [];
  let after: string | null = null;

  // Pagination : récupère jusqu'à 250 produits (5 × 50)
  for (let page = 0; page < 5; page++) {
    const variables: Record<string, any> = { first: 50 };
    if (after) variables.after = after;

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables }),
      next: { revalidate: 300 }, // Cache 5 min (Next.js fetch cache)
    });

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("Shopify GraphQL errors:", json.errors);
      throw new Error("Shopify GraphQL error: " + JSON.stringify(json.errors));
    }

    const { edges, pageInfo } = json.data?.products ?? {};
    if (!edges?.length) break;

    for (const { node } of edges) {
      all.push(mapProduct(node));
    }

    if (!pageInfo?.hasNextPage) break;
    after = pageInfo.endCursor;
  }

  return all;
}

// ── Single product query ───────────────────────────────────────────────────────

const PRODUCT_BY_HANDLE_QUERY = `
  query GetFormationByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      description
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "niveau" }
        { namespace: "custom", key: "secteur" }
        { namespace: "custom", key: "categorie" }
        { namespace: "custom", key: "duree" }
        { namespace: "custom", key: "format" }
        { namespace: "custom", key: "accroche" }
        { namespace: "custom", key: "parcours" }
        { namespace: "custom", key: "public_cible" }
        { namespace: "custom", key: "prerequis" }
        { namespace: "custom", key: "Objectifs_pedagogiques" }
        { namespace: "custom", key: "programme" }
        { namespace: "custom", key: "livrables" }
        { namespace: "custom", key: "methode" }
      ]) {
        id
        key
        value
        namespace
        type
      }
    }
  }
`;

export interface ShopifyFormationDetail extends ShopifyFormationCard {
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: { module: string; details: string[]; duree?: string }[];
  livrables: string[];
  methode: string;
  images?: string[];
  descriptionHtml?: string;
}

/** Parse une valeur JSON metafield de manière sécurisée */
function parseJsonMeta<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed;
  } catch (error) {
    console.warn(`Failed to parse metafield JSON: ${error instanceof Error ? error.message : String(error)}`);
    console.debug(`Raw value: ${value}`);
    
    // Si c'est du texte brut (pas du JSON), transforme en tableau si applicable
    if (Array.isArray(fallback)) {
      return value.split("\n").filter(Boolean) as unknown as T;
    }
    return value as unknown as T;
  }
}

/** Traite spécifiquement le programme avec validation de structure */
function parseProgramme(value: string): { module: string; details: string[]; duree?: string }[] {
  if (!value) return [];
  
  try {
    const parsed = JSON.parse(value);
    
    // Gère deux formats : objet avec clé "programme" ou tableau direct
    const programmes = Array.isArray(parsed) ? parsed : parsed.programme;
    
    if (!Array.isArray(programmes)) {
      console.warn("Programme n'est pas un tableau:", parsed);
      return [];
    }
    
    // Normalise chaque module
    return programmes
      .map((item: any) => ({
        module: item.module || item.titre || item.title || "",
        details: Array.isArray(item.details) 
          ? item.details.filter((d: any) => d)
          : Array.isArray(item.contenu)
          ? item.contenu.filter((d: any) => d)
          : (typeof item.details === "string" ? item.details.split("\n").filter(Boolean) : []),
        duree: item.duree || item.duration || undefined,
      }))
      .filter((m: any) => m.module); // Filtre les modules vides
  } catch (error) {
    console.warn(`Impossible de parser le programme: ${error instanceof Error ? error.message : String(error)}`);
    console.debug(`Valeur reçue: ${value}`);
    return [];
  }
}

/** Mappe un node produit Shopify → ShopifyFormationDetail */
function mapProductDetail(node: any): ShopifyFormationDetail {
  const base = mapProduct(node);
  const tags: string[] = node.tags ?? [];
  const metafields: { key: string; value: string }[] = node.metafields ?? [];

  const publicCible = extractMeta(metafields, "public_cible") || "";
  const prerequis   = extractMeta(metafields, "prerequis")    || "";
  const methode     = extractMeta(metafields, "methode")      || "";

  const objectifs = parseJsonMeta<string[]>(
    extractMeta(metafields, "objectifs"), []
  );
  const livrables = parseJsonMeta<string[]>(
    extractMeta(metafields, "livrables"), []
  );
  const programme = parseProgramme(extractMeta(metafields, "programme"));

  const images = node.images?.edges?.map((edge: any) => edge.node.url) || [];

  return {
    ...base,
    publicCible,
    prerequis,
    objectifs,
    programme,
    livrables,
    methode,
    images,
    descriptionHtml: node.descriptionHtml,
  };
}

export async function fetchShopifyFormationByHandle(handle: string): Promise<ShopifyFormationDetail | null> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCT_BY_HANDLE_QUERY,

      variables: { handle },
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error("Shopify GraphQL errors:", json.errors);
    throw new Error("Shopify GraphQL error: " + JSON.stringify(json.errors));
  }

  const product = json.data?.product;
  if (!product) return null;

  return mapProductDetail(product);
}
