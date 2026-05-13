import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES = [
  { path: "",            changeFrequency: "weekly"  as const, priority: 1.0 },
  { path: "/formations", changeFrequency: "weekly"  as const, priority: 0.9 },
  { path: "/poles",      changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/services",   changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/secteurs",   changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/projects",   changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/about",      changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/blog",       changeFrequency: "daily"   as const, priority: 0.7 },
  { path: "/contact",    changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}/${routing.defaultLocale}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
      ),
    },
  }));
}
