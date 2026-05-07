/**
 * Blog — module partagé.
 *
 * - `BlogPost` : alias vers `ShopifyBlogPost` pour minimiser les changements
 *   d'import dans les composants.
 * - `Category` : type d'une rubrique (label, slug, image, description).
 * - `deriveCategoriesFromPosts` : dérive la liste des rubriques à partir
 *   des articles Shopify (plus de liste hardcodée).
 * - Helpers : filtrage / lookup utilisés par plusieurs composants.
 *
 * Le contenu éditorial (articles ET rubriques) vient désormais de Shopify et
 * est récupéré via `fetchShopifyBlogPosts` / `fetchShopifyBlogPostByHandle`
 * de `@/lib/shopify/blog`, ou via la route `/api/shopify/blog` côté client.
 */

import type { ShopifyBlogPost } from "@/lib/shopify/blog";

export type BlogPost = ShopifyBlogPost;

export type Category = {
  label: string;
  value: string;
  image?: string;
  description?: string;
};

/** Slug stable pour une catégorie : "Tech Trends" → "tech-trends",
 *  "Carrière & Skills" → "carriere-skills". */
export function slugifyCategory(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Sentinelle « Tous » utilisée par les filtres. Toujours premier de la liste. */
export const ALL_CATEGORY: Category = { label: "Tous", value: "all" };

/**
 * Dérive la liste des rubriques à partir des articles Shopify.
 *  - Toujours « Tous » en premier
 *  - Chaque rubrique reprend l'image featured du 1er article correspondant
 *  - Triée par nombre d'articles décroissant
 *  - Tolère les catégories vides ou en doublon (fusion par slug)
 */
export function deriveCategoriesFromPosts(posts: BlogPost[]): Category[] {
  const map = new Map<string, { label: string; image?: string; count: number }>();

  for (const p of posts) {
    const label = p.category?.trim();
    if (!label) continue;
    const value = slugifyCategory(label);
    const existing = map.get(value);
    if (existing) {
      existing.count++;
      if (!existing.image && p.image) existing.image = p.image;
    } else {
      map.set(value, { label, image: p.image || undefined, count: 1 });
    }
  }

  const sorted: Category[] = Array.from(map.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([value, { label, image }]) => ({ label, value, image }));

  return [ALL_CATEGORY, ...sorted];
}

/** Filtre par catégorie. "all" retourne tout. Tolère le slug (kebab) ou le label. */
export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  if (category === "all") return posts;
  return posts.filter(
    (p) => slugifyCategory(p.category) === category || p.category === category
  );
}

/** Trouve un article par slug dans une liste donnée. */
export function getPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
