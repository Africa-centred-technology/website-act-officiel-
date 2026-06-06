import { test, expect } from "@playwright/test";

test.describe("Content FR — no regression after externalization", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/shopify/formations*", (route) => {
      if (route.request().url().includes("/api/shopify/formations/")) return route.fallback();
      return route.fulfill({ json: { formations: [] } });
    });
    await page.route("**/api/shopify/blog*", (route) => {
      if (route.request().url().includes("/api/shopify/blog/")) return route.fallback();
      return route.fulfill({ json: { posts: [] } });
    });
  });

  const PAGES = [
    { path: "/fr/", contains: ["Africa Centred Technology"] },
    { path: "/fr/about", contains: ["Africa Centred Technology", "À propos"] },
    { path: "/fr/services", contains: ["Services"] },
    { path: "/fr/formations", contains: ["Formations"] },
    { path: "/fr/poles", contains: ["Pôles"] },
    { path: "/fr/secteurs", contains: ["Secteurs"] },
    { path: "/fr/projects", contains: ["Réalisations"] },
    { path: "/fr/blog", contains: ["Blog"] },
    { path: "/fr/contact", contains: ["Contact"] },
    // Detail pages — added in C2 to validate i18n migration
    { path: "/fr/poles/developpement-technologique", contains: ["Développement Technologique"] },
    { path: "/fr/poles/conseil-strategie-it", contains: ["Conseil"] },
    { path: "/fr/poles/formation", contains: ["Formation"] },
    { path: "/fr/secteurs/industrie", contains: ["Industrie"] },
    { path: "/fr/services/ingenierie-logicielle", contains: ["Ingénierie Logicielle"] },
    { path: "/fr/projects/rag", contains: ["Système RAG Multi-sources"] },
  ];

  for (const { path, contains } of PAGES) {
    test(`${path} renders FR critical strings`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      const html = await page.content();
      for (const expectedString of contains) {
        expect(html).toContain(expectedString);
      }
    });
  }

  test("Breadcrumb JSON-LD on /fr/formations/[slug] contains Accueil + Formations", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/formations");
    const list = await apiRes.json().catch(() => []);
    const firstSlug = Array.isArray(list) ? list?.[0]?.slug : undefined;
    test.skip(!firstSlug, "No formation available");

    await page.goto(`/fr/formations/${firstSlug}`);
    const html = await page.content();
    expect(html).toContain('"name":"Accueil"');
    expect(html).toContain('"name":"Formations"');
  });
});
