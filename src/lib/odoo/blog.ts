/**
 * Odoo — Blog fetcher
 * Mappe `blog.post` Odoo → mêmes types que ShopifyBlogPost
 *
 * Convention Odoo (module Website Blog) :
 *   blog.post           → article
 *   blog.tag            → tags / catégories
 *   blog.blog           → groupes (Veille, Insights…)
 *
 * Custom fields optionnels sur blog.post (à créer si besoin) :
 *   x_format        Char       → "Article de fond", "Tribune", …
 *   x_word_count    Integer    → nombre de mots
 *   x_target        Char       → "DSI, entrepreneurs, …"
 *   x_featured      Boolean    → article à la une
 *   x_category_color Char      → couleur hex pour le badge front
 */

import { odoo, odooSearchRead } from "./client";

// ── Type miroir du type Shopify ──────────────────────────────────────────────

export interface OdooBlogPost {
  id: string;            // odoo id en string pour compat avec ShopifyBlogPost
  slug: string;          // website_url ou name slugifié
  blogHandle: string;    // nom du blog parent
  title: string;
  category: string;
  categoryColor: string;
  format: string;
  wordCount: string;
  keywords: string[];
  target: string;
  excerpt: string;
  date: string;          // "avril 2026"
  readTime: string;      // "8 min"
  image: string;
  featured?: boolean;
  contentHtml: string;
  sections: never[];
  authorName: string;
  odooId: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | false): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  } catch {
    return String(iso);
  }
}

function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function buildPostImage(postId: number): string {
  const base = process.env.ODOO_URL ?? "";
  // Odoo blog.post stocke la cover dans `cover_properties` (Odoo 17) ou `content_image` legacy
  return `${base}/web/image/blog.post/${postId}/cover_properties`;
}

function readScalar(v: unknown): string {
  if (v == null || v === false) return "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && v.length === 2 && typeof v[1] === "string") return v[1].trim();
  return String(v);
}

function readBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

function readInt(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

/**
 * Récupère les noms des tags d'un article — Odoo renvoie tag_ids comme [id, id, …]
 * On fait un read groupé pour résoudre les noms.
 */
async function resolveTagNames(allTagIds: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  if (!allTagIds.length) return map;
  const tags = await odoo<any[]>(
    "blog.tag",
    "read",
    [Array.from(new Set(allTagIds))],
    { fields: ["id", "name"] }
  );
  for (const t of tags) map.set(t.id, t.name);
  return map;
}

/** Mappe un node Odoo blog.post → OdooBlogPost */
function mapArticle(node: any, blogName: string, tagNames: Map<number, string>): OdooBlogPost {
  const tagIds: number[] = Array.isArray(node.tag_ids) ? node.tag_ids : [];
  const allTags: string[] = tagIds.map((id) => tagNames.get(id) ?? "").filter(Boolean);

  // Première tag = catégorie principale (ou fallback sur le nom du blog)
  const category = allTags[0] || blogName || "Non classé";
  const keywords = allTags.slice(1);

  const contentHtml = node.content || node.teaser || "";
  const wordCount   = readInt(node.x_word_count);
  const readTime    = wordCount > 0 ? `${Math.max(1, Math.ceil(wordCount / 200))} min` : estimateReadTime(contentHtml);

  return {
    odooId:        node.id,
    id:            String(node.id),
    slug:          node.website_url
      ? String(node.website_url).split("/").pop()!
      : (node.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    blogHandle:    blogName,
    title:         node.name ?? "",
    category,
    categoryColor: readScalar(node.x_category_color) || "#D35400",
    format:        readScalar(node.x_format) || "Article",
    wordCount:     wordCount > 0 ? String(wordCount) : "",
    keywords,
    target:        readScalar(node.x_target),
    excerpt:       node.subtitle || node.teaser || "",
    date:          formatDate(node.published_date || node.create_date),
    readTime,
    image:         node.cover_properties ? buildPostImage(node.id) : "",
    featured:      readBool(node.x_featured),
    contentHtml,
    sections:      [],
    authorName:    Array.isArray(node.author_id) ? readScalar(node.author_id) : "",
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

const POST_FIELDS = [
  "id", "name", "subtitle", "teaser", "content",
  "blog_id", "tag_ids", "author_id",
  "published_date", "create_date",
  "website_url", "is_published", "cover_properties",
  // Custom fields (ignorés silencieusement par Odoo s'ils n'existent pas)
  "x_format", "x_word_count", "x_target", "x_featured", "x_category_color",
];

/**
 * Récupère tous les articles publiés sur les blogs Odoo.
 * Trié par date de publication décroissante.
 */
export async function fetchOdooBlogPosts(): Promise<OdooBlogPost[]> {
  // 1. On charge les posts publiés en une seule requête
  const posts = await odooSearchRead<any>(
    "blog.post",
    [["is_published", "=", true]],
    {
      fields: POST_FIELDS,
      order: "published_date desc, create_date desc",
      limit: 250,
    }
  );

  if (!posts.length) return [];

  // 2. Résolution des noms de blog parent
  const blogIds: number[] = Array.from(
    new Set(posts.map((p) => (Array.isArray(p.blog_id) ? p.blog_id[0] : p.blog_id)).filter(Boolean))
  );
  const blogs = blogIds.length
    ? await odoo<any[]>("blog.blog", "read", [blogIds], { fields: ["id", "name"] })
    : [];
  const blogNameById = new Map<number, string>(blogs.map((b: any) => [b.id, b.name]));

  // 3. Résolution des noms de tags
  const allTagIds: number[] = posts.flatMap((p) => (Array.isArray(p.tag_ids) ? p.tag_ids : []));
  const tagNames = await resolveTagNames(allTagIds);

  // 4. Mapping
  return posts.map((p) => {
    const blogName = Array.isArray(p.blog_id) ? blogNameById.get(p.blog_id[0]) ?? "" : "";
    return mapArticle(p, blogName, tagNames);
  });
}

/** Récupère un seul article par son slug (segment final de website_url) */
export async function fetchOdooBlogPostBySlug(slug: string): Promise<OdooBlogPost | null> {
  const all = await fetchOdooBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
