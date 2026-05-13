import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchShopifyFormations } from "@/lib/shopify/formations";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "",            changeFrequency: "weekly",  priority: 1.0 },
  { path: "/formations", changeFrequency: "weekly",  priority: 0.9 },
  { path: "/poles",      changeFrequency: "monthly", priority: 0.8 },
  { path: "/services",   changeFrequency: "monthly", priority: 0.8 },
  { path: "/secteurs",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/about",      changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog",       changeFrequency: "daily",   priority: 0.7 },
  { path: "/contact",    changeFrequency: "monthly", priority: 0.6 },
];

function entry(path: string, opts: {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
}): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}/${routing.defaultLocale}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
      ]),
    },
  };
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) =>
    entry(path, { changeFrequency, priority })
  );

  // Enumerate slugs once using the default locale — handles are shared across locales.
  // (Multi-locale canonical URLs are emitted in Task 9 by iterating routing.locales for each slug.)
  const [formations, posts] = await Promise.allSettled([
    fetchShopifyFormations(routing.defaultLocale),
    fetchShopifyBlogPosts(routing.defaultLocale),
  ]);

  const formationEntries =
    formations.status === "fulfilled"
      ? formations.value.map((f) =>
          entry(`/formations/${f.slug}`, {
            changeFrequency: "weekly",
            priority: 0.7,
          })
        )
      : [];

  const blogEntries =
    posts.status === "fulfilled"
      ? posts.value.map((p) =>
          entry(`/blog/${p.slug}`, {
            changeFrequency: "monthly",
            priority: 0.6,
            lastModified: p.date ? new Date(p.date) : undefined,
          })
        )
      : [];

  return [...staticEntries, ...formationEntries, ...blogEntries];
}
