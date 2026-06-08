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

import type { Locale } from "@/i18n/routing";
import { toShopifyLanguage } from "@/lib/shopify/locale";

// ── GraphQL query ─────────────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query GetFormations($first: Int!, $after: String, $lang: LanguageCode!) @inContext(language: $lang) {
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
            { namespace: "custom", key: "pricing_plans" }
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

export interface PricingPlan {
  title: string;
  description: string;
  amount: string;
  currency?: string;
  old_price?: string;
  badge?: string;
  featured?: boolean;
  cta_label: string;
  cta_type: "inscription" | "contact" | "external";
  cta_url?: string;
  features: string[];
}

export interface ShopifyFormationCard {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  prix: string;
  accroche: string;
  imageUrl?: string;
  shopifyId: string;
  pricingPlans?: PricingPlan[];
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

/** Extrait l'URL d'un metafield de type File / MediaImage en utilisant la `reference`.
 *  Si le metafield est une simple URL string, on la retourne telle quelle. */
type MetafieldWithReference = {
  key: string;
  value: string;
  reference?: { url?: string; image?: { url?: string } } | null;
};
function extractFileMeta(metafields: MetafieldWithReference[], key: string): string {
  const mf = metafields?.find((m) => m?.key?.toLowerCase() === key.toLowerCase());
  if (!mf) return "";
  // File metafield → resolved via reference
  if (mf.reference?.url) return mf.reference.url;
  if (mf.reference?.image?.url) return mf.reference.image.url;
  // Fallback : value est déjà une URL (pour les metafields type single_line_text_field ou url)
  const raw = mf.value?.trim() ?? "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return "";
}

/** Formate le prix depuis Shopify */
function formatShopifyPrice(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (isNaN(value) || value === 0) return "Nous consulter";
  if (currencyCode === "MAD") return `${Math.round(value)} MAD`;
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
  const prix      = formatShopifyPrice(price?.amount ?? "0", price?.currencyCode ?? "MAD");

  const pricingPlans = parsePricingPlans(extractRawMeta(metafields, "pricing_plans"));

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
    prix,
    accroche,
    imageUrl:   firstImage?.url,
    pricingPlans: pricingPlans.length > 0 ? pricingPlans : undefined,
  };
}

/** Parse le metafield pricing_plans : tableau de PricingPlan ou objet {pricing: [...]} */
function parsePricingPlans(value: string): PricingPlan[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : (parsed.pricing || parsed.plans || parsed.formules);
    if (!Array.isArray(list)) return [];
    return list
      .map((p: any): PricingPlan | null => {
        const title = String(p?.title || p?.titre || "").trim();
        if (!title) return null;
        const ctaType = p?.cta_type === "contact" || p?.cta_type === "external" ? p.cta_type : "inscription";
        return {
          title,
          description: String(p?.description || "").trim(),
          amount:      String(p?.amount || p?.prix || "").trim(),
          currency:    p?.currency ? String(p.currency).trim() : undefined,
          old_price:   p?.old_price ? String(p.old_price).trim() : undefined,
          badge:       p?.badge ? String(p.badge).trim() : undefined,
          featured:    p?.featured === true,
          cta_label:   String(p?.cta_label || "Réserver").trim(),
          cta_type:    ctaType,
          cta_url:     p?.cta_url ? String(p.cta_url).trim() : undefined,
          features:    Array.isArray(p?.features) ? p.features.map((f: any) => String(f).trim()).filter(Boolean) : [],
        };
      })
      .filter((p): p is PricingPlan => p !== null);
  } catch (error) {
    console.warn(`Impossible de parser pricing_plans: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// ── Main fetcher ──────────────────────────────────────────────────────────────

export async function fetchShopifyFormations(locale: Locale): Promise<ShopifyFormationCard[]> {
  const lang = toShopifyLanguage(locale);
  const all: ShopifyFormationCard[] = [];
  let after: string | null = null;

  // Pagination : récupère jusqu'à 250 produits (5 × 50)
  for (let page = 0; page < 5; page++) {
    const variables: Record<string, any> = { first: 50, lang };
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
  query GetFormationByHandle($handle: String!, $lang: LanguageCode!) @inContext(language: $lang) {
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
        { namespace: "custom", key: "public_cible_act" }
        { namespace: "custom", key: "prerequis_" }
        { namespace: "custom", key: "Objectifs_pedagogiques" }
        { namespace: "custom", key: "programme" }
        { namespace: "custom", key: "livrables" }
        { namespace: "custom", key: "methode" }
        { namespace: "custom", key: "pricing_plans" }
        { namespace: "custom", key: "experts_concepteurs" }
        { namespace: "custom", key: "outils_couverts" }
        { namespace: "custom", key: "brochure" }
        { namespace: "custom", key: "hook_pain" }
        { namespace: "custom", key: "hook_pain_question" }
        { namespace: "custom", key: "promesse_titre" }
        { namespace: "custom", key: "session_date" }
        { namespace: "custom", key: "session_lieu" }
        { namespace: "custom", key: "session_date_courte" }
        { namespace: "custom", key: "pain_points" }
        { namespace: "custom", key: "announcement_items" }
        { namespace: "custom", key: "faq_items" }
      ]) {
        id
        key
        value
        namespace
        type
        reference {
          ... on GenericFile {
            url
            mimeType
          }
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
    }
  }
`;

export interface Expert {
  nom: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
}

export interface OutilCouvert {
  name: string;
  color?: "gold" | "orange";
}

export interface PainPoint {
  title: string;
  text: string;
  image_url?: string;
}

export interface ShopifyFormationDetail extends ShopifyFormationCard {
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: { module: string; description: string }[];
  livrables: string[];
  methode: string;
  images?: string[];
  descriptionHtml?: string;
  experts?: Expert[];
  outilsCouverts?: OutilCouvert[];
  brochureUrl?: string;
  hookPain?: string;
  hookPainQuestion?: string;
  promesseTitre?: string;
  sessionDate?: string;
  sessionLieu?: string;
  sessionDateCourte?: string;
  painPoints?: PainPoint[];
  announcementItems?: string[];
  faqItems?: { question: string; answer: string }[];
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

/** Parse le metafield experts_concepteurs : tableau JSON ou objet { experts: [...] } */
function parseExperts(value: string): Expert[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : parsed.experts;
    if (!Array.isArray(list)) return [];
    return list
      .map((e: any) => ({
        nom: String(e.nom || e.name || "").trim(),
        role: String(e.role || e.titre || e.title || "").trim(),
        bio: e.bio ? String(e.bio).trim() : undefined,
        photo: e.photo ? String(e.photo).trim() : undefined,
        linkedin: e.linkedin ? String(e.linkedin).trim() : undefined,
      }))
      .filter((e) => e.nom);
  } catch (error) {
    console.warn(`Impossible de parser les experts: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/** Parse le metafield faq_items : tableau d'objets {question, answer} */
function parseFaqItems(value: string): { question: string; answer: string }[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : (parsed.faq || parsed.faq_items || parsed.items);
    if (!Array.isArray(list)) return [];
    return list
      .map((f: any) => ({
        question: String(f?.question || f?.q || "").trim(),
        answer:   String(f?.answer || f?.reponse || f?.a || "").trim(),
      }))
      .filter((f) => f.question && f.answer);
  } catch (error) {
    console.warn(`Impossible de parser faq_items: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/** Parse le metafield announcement_items : tableau de strings (ou objet {items: [...]}) */
function parseAnnouncementItems(value: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : parsed.items;
    if (!Array.isArray(list)) return [];
    return list
      .map((item: any) => String(item || "").trim())
      .filter((s) => s.length > 0);
  } catch {
    return value.split("\n").map((l) => l.trim()).filter(Boolean);
  }
}

/** Parse le metafield pain_points : tableau d'objets {title, text, image_url?} */
function parsePainPoints(value: string): PainPoint[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : parsed.pain_points;
    if (!Array.isArray(list)) return [];
    return list
      .map((p: any): PainPoint | null => {
        const title = String(p?.title || p?.titre || "").trim();
        const text  = String(p?.text || p?.texte || "").trim();
        if (!title || !text) return null;
        return {
          title,
          text,
          image_url: p?.image_url || p?.image || undefined,
        };
      })
      .filter((p): p is PainPoint => p !== null);
  } catch (error) {
    console.warn(`Impossible de parser les pain_points: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/** Parse le metafield outils_couverts : tableau de strings ou tableau d'objets {name, color?} */
function parseOutilsCouverts(value: string): OutilCouvert[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : parsed.outils;
    if (!Array.isArray(list)) return [];
    return list
      .map((item: any, i: number): OutilCouvert | null => {
        if (typeof item === "string") {
          const name = item.trim();
          return name ? { name, color: i % 2 === 0 ? "orange" : "gold" } : null;
        }
        if (item && typeof item === "object" && item.name) {
          return {
            name: String(item.name).trim(),
            color: item.color === "gold" ? "gold" : "orange",
          };
        }
        return null;
      })
      .filter((x): x is OutilCouvert => x !== null);
  } catch (error) {
    console.warn(`Impossible de parser les outils: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/** Parse le metafield programme.
 *  Nouveau format : [{ module, description }]
 *  Ancien format  : [{ module, details: string[] }] — converti en description par jointure */
function parseProgramme(value: string): { module: string; description: string }[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    const programmes = Array.isArray(parsed) ? parsed : parsed.programme;
    if (!Array.isArray(programmes)) return [];
    return programmes
      .map((item: any) => {
        const module = String(item.module || item.titre || item.title || "").trim();
        if (!module) return null;
        // Nouveau format : champ description directement
        if (typeof item.description === "string" && item.description.trim()) {
          return { module, description: item.description.trim() };
        }
        // Ancien format : details[]  → on joint en paragraphe
        const details: string[] = Array.isArray(item.details)
          ? item.details.map((d: any) => String(d).trim()).filter(Boolean)
          : Array.isArray(item.contenu)
          ? item.contenu.map((d: any) => String(d).trim()).filter(Boolean)
          : [];
        return { module, description: details.join(" · ") };
      })
      .filter((m): m is { module: string; description: string } => m !== null);
  } catch (error) {
    console.warn(`Impossible de parser le programme: ${error instanceof Error ? error.message : String(error)}`);
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
  const experts        = parseExperts(extractRawMeta(metafields, "experts_concepteurs"));
  const outilsCouverts = parseOutilsCouverts(extractRawMeta(metafields, "outils_couverts"));
  const brochureUrl    = extractFileMeta(metafields, "brochure") || undefined;

  const hookPain          = extractMeta(metafields, "hook_pain")          || undefined;
  const hookPainQuestion  = extractMeta(metafields, "hook_pain_question") || undefined;
  const promesseTitre     = extractMeta(metafields, "promesse_titre")     || undefined;
  const sessionDate       = extractMeta(metafields, "session_date")       || undefined;
  const sessionLieu       = extractMeta(metafields, "session_lieu")       || undefined;
  const sessionDateCourte = extractMeta(metafields, "session_date_courte") || undefined;
  const painPoints        = parsePainPoints(extractRawMeta(metafields, "pain_points"));
  const announcementItems = parseAnnouncementItems(extractRawMeta(metafields, "announcement_items"));
  const faqItems          = parseFaqItems(extractRawMeta(metafields, "faq_items"));

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
    experts,
    outilsCouverts,
    brochureUrl,
    hookPain,
    hookPainQuestion,
    promesseTitre,
    sessionDate,
    sessionLieu,
    sessionDateCourte,
    painPoints,
    announcementItems: announcementItems.length > 0 ? announcementItems : undefined,
    faqItems: faqItems.length > 0 ? faqItems : undefined,
  };
}

export async function fetchShopifyFormationByHandle(handle: string, locale: Locale): Promise<ShopifyFormationDetail | null> {
  const lang = toShopifyLanguage(locale);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle, lang },
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
