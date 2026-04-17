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
            { namespace: "custom", key: "format_suported" }
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

/** Extrait la valeur scalaire d'un metafield (pour niveau, secteur, duree, etc.).
 *  Gère automatiquement les valeurs stockées comme tableau JSON (ex: ["Intermédiaire "]) */
function extractMeta(metafields: { key: string; value: string }[], key: string): string {
  const mf = metafields?.find((m) => m?.key?.toLowerCase() === key.toLowerCase());
  if (!mf?.value) return "";
  const raw = mf.value.trim();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((s: unknown) => String(s).trim()).filter(Boolean).join(", ");
    }
    if (typeof parsed === "string") return parsed.trim();
  } catch {
    // valeur scalaire non-JSON, on retourne telle quelle
  }
  return raw;
}

/** Extrait la valeur brute d'un metafield JSON sans la toucher (pour objectifs, programme, livrables) */
function extractRawMeta(metafields: { key: string; value: string }[], key: string): string {
  const mf = metafields?.find((m) => m?.key?.toLowerCase() === key.toLowerCase());
  return mf?.value?.trim() ?? "";
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
        { namespace: "custom", key: "public_cible_act" }
        { namespace: "custom", key: "prerequis_" }
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

/** Traite les objectifs pédagogiques avec le nouveau format JSON */
function parseObjectifs(value: string): string[] {
  if (!value) return [];
  
  try {
    const parsed = JSON.parse(value);
    
    // Gère deux formats : objet avec clé "objectifs" ou tableau direct
    const objectifs = Array.isArray(parsed) ? parsed : parsed.objectifs;
    
    if (!Array.isArray(objectifs)) {
      console.warn("Objectifs n'est pas un tableau:", parsed);
      return [];
    }
    
    // Filtre les objectifs vides et valides
    return objectifs.filter((obj: any) => typeof obj === "string" && obj.trim());
  } catch (error) {
    console.warn(`Impossible de parser les objectifs: ${error instanceof Error ? error.message : String(error)}`);
    console.debug(`Valeur reçue: ${value}`);
    return [];
  }
}

/** Parse le metafield public_cible_act : {"metiers": [...]} ou tableau direct ou texte brut */
function parsePublicCible(value: string): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : (parsed.metiers ?? parsed.public_cible ?? []);
    if (Array.isArray(list) && list.length > 0) {
      return list.map((s: any) => String(s).trim()).filter(Boolean).join(",");
    }
    return String(parsed).trim();
  } catch {
    return value.trim();
  }
}

/** Traite les livrables avec le même robustesse que parseObjectifs */
function parseLivrables(value: string): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    // Gère deux formats : tableau direct ou objet avec clé "livrables"
    const livrables = Array.isArray(parsed) ? parsed : parsed.livrables;

    if (!Array.isArray(livrables)) {
      console.warn("Livrables n'est pas un tableau:", parsed);
      return [];
    }

    return livrables.filter((item: any) => typeof item === "string" && item.trim());
  } catch {
    // Fallback : texte brut séparé par des sauts de ligne
    return value.split("\n").map((l) => l.trim()).filter(Boolean);
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

  const publicCible = parsePublicCible(extractRawMeta(metafields, "public_cible_act"));
  const prerequis   = extractMeta(metafields, "prerequis")    || "";
  const methode     = extractMeta(metafields, "methode")      || "";

  const objectifs = parseObjectifs(extractRawMeta(metafields, "objectifs_pedagogiques"));
  const livrables = parseLivrables(extractRawMeta(metafields, "livrables"));
  const programme = parseProgramme(extractRawMeta(metafields, "programme"));

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
