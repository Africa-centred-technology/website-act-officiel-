import { vi } from "vitest";

vi.mock("@/lib/shopify/formations", () => ({
  fetchShopifyFormations: vi.fn(async () => [
    { slug: "test-formation", title: "Test", accroche: "T", id: "1", secteur: "", categorie: "", niveau: "", duree: "", format: "", prix: "0", shopifyId: "1" },
  ]),
}));
vi.mock("@/lib/shopify/blog", () => ({
  fetchShopifyBlogPosts: vi.fn(async () => [
    { slug: "test-article", title: "T", excerpt: "E", id: "1", blogHandle: "news", category: "", categoryColor: "", wordCount: "", keywords: [], target: "", date: "2026-01-01T00:00:00Z", readTime: "", image: "", contentHtml: "", sections: [] as never[], authorName: "X" },
  ]),
}));

import { describe, it, expect } from "vitest";

describe("sitemap", () => {
  it("contains a /fr/services entry as canonical url", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    const svc = entries.find((e) => e.url === "https://www.a-ct.ma/fr/services");
    expect(svc).toBeDefined();
  });

  it("each entry has alternates.languages with fr/en", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    for (const entry of entries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringContaining("/fr"),
        en: expect.stringContaining("/en"),
      });
    }
  });

  it("no longer references obsolete /nous-decouvrir or /notre-savoir-faire", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    for (const entry of entries) {
      expect(entry.url).not.toContain("nous-decouvrir");
      expect(entry.url).not.toContain("notre-savoir-faire");
      for (const v of Object.values(entry.alternates!.languages!)) {
        expect(v).not.toContain("nous-decouvrir");
        expect(v).not.toContain("notre-savoir-faire");
      }
    }
  });

  it("home entry uses /fr as canonical (no trailing slash)", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    const home = entries.find((e) => e.url === "https://www.a-ct.ma/fr");
    expect(home).toBeDefined();
  });

  it("contains /fr/formations/<slug> entry from Shopify mock", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    const formationEntry = entries.find((e) =>
      e.url === "https://www.a-ct.ma/fr/formations/test-formation"
    );
    expect(formationEntry).toBeDefined();
  });

  it("contains /fr/blog/<slug> entry from Shopify mock", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    const blogEntry = entries.find((e) =>
      e.url === "https://www.a-ct.ma/fr/blog/test-article"
    );
    expect(blogEntry).toBeDefined();
  });

  it("each entry has x-default alternate", async () => {
    const entries = await (await import("@/app/sitemap")).default();
    for (const entry of entries) {
      expect(entry.alternates!.languages!["x-default"]).toBeDefined();
    }
  });

  it("emits a canonical /en/formations/<slug> entry (not just hreflang alternates)", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    // Mock provides at least one formation slug
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/en/formations/"))).toBe(true);
  });

  it("emits a canonical /en/blog/<slug> entry", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/en/blog/"))).toBe(true);
  });
});
