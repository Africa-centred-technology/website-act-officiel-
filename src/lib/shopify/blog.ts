/**
 * Shopify Storefront API — Blog Articles fetcher
 * Mappe les articles Shopify → BlogPost compatible
 *
 * Tags Shopify attendus sur chaque article :
 *   category:Tech Trends
 *   readTime:10 min
 *   target:DSI, entrepreneurs
 *   featured:true
 *   wordCount:~2500
 *   (autres tags non préfixés → keywords)
 */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_VERSION   = "2024-01";
const ENDPOINT      = `https://${SHOPIFY_STORE}/api/${API_VERSION}/graphql.json`;

import type { Locale } from "@/i18n/routing";
import { toShopifyLanguage } from "@/lib/shopify/locale";

// ── GraphQL query ────────────────────────────────────────────────────────────

const ALL_ARTICLES_QUERY = `
  query GetAllBlogArticles($lang: LanguageCode!) @inContext(language: $lang) {
    blogs(first: 20) {
      edges {
        node {
          handle
          articles(first: 100) {
            edges {
              node {
                id
                title
                handle
                excerpt
                contentHtml
                publishedAt
                tags
                image {
                  url
                  altText
                }
                author {
                  name
                }
                metafields(identifiers: [
                  { namespace: "custom", key: "categories" }
                ]) {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyBlogPost {
  id: string;
  slug: string;
  blogHandle: string;
  title: string;
  category: string;
  categoryColor: string;
  wordCount: string;
  keywords: string[];
  target: string;
  excerpt: string;
  date: string;
  publishedAtIso: string;
  readTime: string;
  image: string;
  featured?: boolean;
  contentHtml: string;
  sections: never[];
  authorName: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PREFIXED_KEYS = ["category", "readtime", "target", "featured", "wordcount"];

/** Extrait la valeur d'un tag préfixé "key:value" (insensible à la casse) */
function extractTag(tags: string[], key: string): string {
  const prefix = `${key.toLowerCase()}:`;
  const tag = tags.find((t) => t.toLowerCase().startsWith(prefix));
  return tag ? tag.slice(tag.indexOf(":") + 1).trim() : "";
}

/** Retourne les tags qui ne sont pas des méta-tags préfixés (→ keywords) */
function extractKeywords(tags: string[]): string[] {
  return tags.filter((t) => {
    const lower = t.toLowerCase();
    return !PREFIXED_KEYS.some((k) => lower.startsWith(`${k}:`));
  });
}

/**
 * Ajoute le paramètre width= à une URL Shopify CDN.
 * Shopify redimensionne côté serveur → Next.js reçoit une image déjà petite.
 */
function shopifySizedUrl(url: string, maxWidth = 1400): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(maxWidth));
    return u.toString();
  } catch {
    return url;
  }
}

/** Formate une date ISO en "Mois YYYY" en français */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Estime le temps de lecture (~200 mots/min) si non défini dans les tags */
function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

/** Extrait la valeur brute d'un metafield par clé */
function extractMeta(metafields: { key: string; value: string }[] | null | undefined, key: string): string {
  const mf = metafields?.find((m) => m?.key?.toLowerCase() === key.toLowerCase());
  return mf?.value?.trim() ?? "";
}

/**
 * Parse un metafield "categories" qui peut être :
 *   - JSON array  : ["Data & IA"]  → "Data & IA"
 *   - JSON array multi : ["Data & IA", "Tech Trends"] → "Data & IA" (premier)
 *   - Texte brut : "Data & IA" → "Data & IA"
 */
function parseCategoryMeta(value: string): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return String(parsed[0]).trim();
    }
    return String(parsed).trim();
  } catch {
    // Texte brut sans JSON
    return value.trim();
  }
}

/** Mappe un node article Shopify → ShopifyBlogPost */
function mapArticle(node: any, blogHandle: string): ShopifyBlogPost {
  const tags: string[]       = node.tags ?? [];
  const metafields: any[]    = node.metafields ?? [];

  // Priorité : metafield "categories" > tag "category:" > défaut
  const category    = parseCategoryMeta(extractMeta(metafields, "categories")) || extractTag(tags, "category") || "Non classé";
  const wordCount   = extractTag(tags, "wordCount")  || "";
  const target      = extractTag(tags, "target")     || "";
  const featuredRaw = extractTag(tags, "featured");
  const readTimeTag = extractTag(tags, "readTime");
  const readTime    = readTimeTag || estimateReadTime(node.contentHtml ?? "");
  const keywords    = extractKeywords(tags);

  return {
    id:             node.id,
    slug:           node.handle,
    blogHandle,
    title:          node.title,
    category,
    categoryColor:  "#D35400",
    wordCount,
    keywords,
    target,
    excerpt:        node.excerpt ?? "",
    date:           formatDate(node.publishedAt),
    publishedAtIso: node.publishedAt ?? "",
    readTime,
    image:          shopifySizedUrl(node.image?.url ?? "", 1400),
    featured:       featuredRaw === "true",
    contentHtml:    node.contentHtml ?? "",
    sections:       [],
    authorName:     node.author?.name ?? "",
  };
}

// ── Fetchers ─────────────────────────────────────────────────────────────────

/** Récupère tous les articles de tous les blogs Shopify */
export async function fetchShopifyBlogPosts(locale: Locale): Promise<ShopifyBlogPost[]> {
  const lang = toShopifyLanguage(locale);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query: ALL_ARTICLES_QUERY, variables: { lang } }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Shopify Blog API error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error("Shopify GraphQL error: " + JSON.stringify(json.errors));

  const blogs: any[] = json.data?.blogs?.edges ?? [];
  const all: ShopifyBlogPost[] = [];

  for (const { node: blog } of blogs) {
    for (const { node: article } of blog.articles?.edges ?? []) {
      all.push(mapArticle(article, blog.handle));
    }
  }

  // Tri par date décroissante — on utilise publishedAtIso (ISO 8601) et non date (texte formaté)
  return all.sort((a, b) => new Date(b.publishedAtIso).getTime() - new Date(a.publishedAtIso).getTime());
}

/** Récupère un seul article par son handle (cherche dans tous les blogs) */
export async function fetchShopifyBlogPostByHandle(handle: string, locale: Locale): Promise<ShopifyBlogPost | null> {
  const all = await fetchShopifyBlogPosts(locale);
  return all.find((p) => p.slug === handle) ?? null;
}
