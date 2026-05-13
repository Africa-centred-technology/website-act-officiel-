import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { locale: string; namespace: string }) => {
    return (key: string) => {
      const dict: Record<string, Record<string, string>> = {
        "metadata.about": {
          title: "À Propos — ACT",
          description: "Découvrez l'histoire d'ACT.",
        },
      };
      return dict[namespace]?.[key] ?? `[missing:${namespace}.${key}]`;
    };
  },
}));

import { buildPageMetadata, buildDynamicPageMetadata } from "@/i18n/seo";

describe("buildPageMetadata", () => {
  it("returns title + description from translations", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    expect(meta.title).toBe("À Propos — ACT");
    expect(meta.description).toBe("Découvrez l'histoire d'ACT.");
  });

  it("sets canonical to /<locale>/<path>", async () => {
    const meta = await buildPageMetadata({
      locale: "en",
      namespace: "metadata.about",
      path: "/about",
    });
    expect(meta.alternates?.canonical).toBe("https://www.a-ct.ma/en/about");
  });

  it("includes alternates.languages for fr/en/ar + x-default", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    const langs = meta.alternates?.languages ?? {};
    expect(langs["fr"]).toBe("https://www.a-ct.ma/fr/about");
    expect(langs["en"]).toBe("https://www.a-ct.ma/en/about");
    expect(langs["ar"]).toBe("https://www.a-ct.ma/ar/about");
    expect(langs["x-default"]).toBe("https://www.a-ct.ma/fr/about");
  });

  it("sets og:locale to fr_MA / en_US / ar_MA correctly", async () => {
    const meta = await buildPageMetadata({ locale: "fr", namespace: "metadata.about", path: "/about" });
    expect(meta.openGraph?.locale).toBe("fr_MA");
    const metaEn = await buildPageMetadata({ locale: "en", namespace: "metadata.about", path: "/about" });
    expect(metaEn.openGraph?.locale).toBe("en_US");
    const metaAr = await buildPageMetadata({ locale: "ar", namespace: "metadata.about", path: "/about" });
    expect(metaAr.openGraph?.locale).toBe("ar_MA");
  });

  it("falls back og image to /api/og?title=...", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    const og = meta.openGraph?.images;
    const img = Array.isArray(og) ? og[0] : og;
    const url = typeof img === "object" && img && "url" in img ? img.url : img;
    expect(String(url)).toContain("/api/og?title=");
    expect(String(url)).toContain(encodeURIComponent("À Propos — ACT"));
  });
});

describe("buildDynamicPageMetadata", () => {
  it("uses explicit title and description, not translations", async () => {
    const meta = await buildDynamicPageMetadata({
      locale: "fr",
      path: "/formations/intro-ia",
      title: "Formation Intro IA",
      description: "Découvrir l'IA en 2 jours.",
    });
    expect(meta.title).toBe("Formation Intro IA");
    expect(meta.description).toBe("Découvrir l'IA en 2 jours.");
    expect(meta.alternates?.canonical).toBe("https://www.a-ct.ma/fr/formations/intro-ia");
  });
});
