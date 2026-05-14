import { describe, it, expect } from "vitest";
import {
  organizationJsonLd,
  breadcrumbJsonLd,
  courseJsonLd,
  articleJsonLd,
} from "@/i18n/seo-jsonld";

describe("organizationJsonLd", () => {
  it("returns correct @context and @type", () => {
    const o = organizationJsonLd("fr") as Record<string, any>;
    expect(o["@context"]).toBe("https://schema.org");
    expect(o["@type"]).toBe("Organization");
  });

  it("uses locale-prefixed url", () => {
    const o = organizationJsonLd("en") as Record<string, any>;
    expect(o.url).toBe("https://www.a-ct.ma/en");
  });
});

describe("breadcrumbJsonLd", () => {
  it("produces ListItem entries with correct positions", () => {
    const b = breadcrumbJsonLd([
      { name: "Accueil", url: "https://www.a-ct.ma/fr" },
      { name: "Services", url: "https://www.a-ct.ma/fr/services" },
    ]) as Record<string, any>;
    expect(b["@type"]).toBe("BreadcrumbList");
    const items = b.itemListElement as Array<{ position: number; name: string; item: string }>;
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe("Accueil");
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe("https://www.a-ct.ma/fr/services");
  });
});

describe("courseJsonLd", () => {
  it("produces Course with provider and url", () => {
    const c = courseJsonLd({
      locale: "fr",
      slug: "intro-ia",
      title: "Intro IA",
      description: "Découvrir l'IA",
    }) as Record<string, any>;
    expect(c["@type"]).toBe("Course");
    expect(c.name).toBe("Intro IA");
    expect(c.url).toBe("https://www.a-ct.ma/fr/formations/intro-ia");
    expect(c.inLanguage).toBe("fr");
  });

  it("includes offers when price+currency provided", () => {
    const c = courseJsonLd({
      locale: "fr",
      slug: "intro-ia",
      title: "Intro IA",
      description: "Découvrir l'IA",
      price: 1500,
      currency: "MAD",
    }) as Record<string, any>;
    expect((c as { offers?: { price: number; priceCurrency: string } }).offers).toEqual(
      expect.objectContaining({ price: 1500, priceCurrency: "MAD" })
    );
  });
});

describe("articleJsonLd", () => {
  it("produces Article with author and publisher", () => {
    const a = articleJsonLd({
      locale: "fr",
      slug: "test-article",
      title: "Test Article",
      excerpt: "Excerpt here",
      author: "Aldrin Djourobi",
      publishedAt: "2026-04-12T17:06:44Z",
    }) as Record<string, any>;
    expect(a["@type"]).toBe("Article");
    expect(a.headline).toBe("Test Article");
    expect((a.author as { name: string }).name).toBe("Aldrin Djourobi");
    expect(a.datePublished).toBe("2026-04-12T17:06:44Z");
    expect(a.url).toBe("https://www.a-ct.ma/fr/blog/test-article");
  });
});
