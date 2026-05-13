import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("contains a /fr/services entry as canonical url", () => {
    const svc = entries.find((e) => e.url === "https://www.a-ct.ma/fr/services");
    expect(svc).toBeDefined();
  });

  it("each entry has alternates.languages with fr/en/ar", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringContaining("/fr"),
        en: expect.stringContaining("/en"),
        ar: expect.stringContaining("/ar"),
      });
    }
  });

  it("no longer references obsolete /nous-decouvrir or /notre-savoir-faire", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("nous-decouvrir");
      expect(entry.url).not.toContain("notre-savoir-faire");
      for (const v of Object.values(entry.alternates!.languages!)) {
        expect(v).not.toContain("nous-decouvrir");
        expect(v).not.toContain("notre-savoir-faire");
      }
    }
  });

  it("home entry uses /fr as canonical (no trailing slash)", () => {
    const home = entries.find((e) => e.url === "https://www.a-ct.ma/fr");
    expect(home).toBeDefined();
  });
});
