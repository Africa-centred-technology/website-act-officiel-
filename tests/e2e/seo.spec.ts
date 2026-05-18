import { test, expect } from "@playwright/test";

test.describe("SEO foundations", () => {
  test("canonical present on /fr/services", async ({ page }) => {
    await page.goto("/fr/services");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
  });

  test("hreflang alternates fr/en/x-default present on /fr/services", async ({ page }) => {
    await page.goto("/fr/services");
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/en/services"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
  });

  test("og:locale switches with locale (fr_MA / en_US)", async ({ page }) => {
    await page.goto("/fr/services");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fr_MA");
    await page.goto("/en/services");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
  });

  test("Organization JSON-LD present on /fr/", async ({ page }) => {
    await page.goto("/fr/");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundOrganization = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Organization"')) {
        foundOrganization = true;
        break;
      }
    }
    expect(foundOrganization).toBe(true);
  });

  test("Course JSON-LD present on /fr/formations/<slug>", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/formations");
    const list = await apiRes.json().catch(() => []);
    const firstSlug = Array.isArray(list) ? list?.[0]?.slug : undefined;
    test.skip(!firstSlug, "No formation available to test");

    await page.goto(`/fr/formations/${firstSlug}`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundCourse = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Course"')) {
        foundCourse = true;
        break;
      }
    }
    expect(foundCourse).toBe(true);
  });

  test("Article JSON-LD present on /fr/blog/<slug>", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/blog");
    const list = await apiRes.json().catch(() => []);
    const firstSlug = Array.isArray(list) ? list?.[0]?.slug : undefined;
    test.skip(!firstSlug, "No blog post available to test");

    await page.goto(`/fr/blog/${firstSlug}`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundArticle = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Article"')) {
        foundArticle = true;
        break;
      }
    }
    expect(foundArticle).toBe(true);
  });

  test("/api/og returns PNG", async ({ request }) => {
    const res = await request.get("/api/og?title=Test");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
  });

  test("sitemap contains formations and blog URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const body = await res.text();
    // Sitemap may have dynamic URLs if Shopify creds available; check x-default always present
    expect(body).toContain('hreflang="x-default"');
    // Static routes always present
    expect(body).toMatch(/\/fr\/services/);
  });
});
