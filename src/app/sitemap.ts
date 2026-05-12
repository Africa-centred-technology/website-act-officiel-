import type { MetadataRoute } from "next";

const BASE_URL = "https://www.a-ct.ma";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/formations`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/contact`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`,          lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/nous-decouvrir`,lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/notre-savoir-faire`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  return staticRoutes;
}
