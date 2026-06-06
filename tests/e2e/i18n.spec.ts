import { test, expect } from "@playwright/test";

test.describe("i18n routing", () => {
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

  test("/ redirects to /fr (or detected locale)", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/\/(fr|en)(\/|$)/);
  });

  test("/fr/services renders 200 with lang=fr dir=ltr", async ({ page }) => {
    await page.goto("/fr/services");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "fr");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  test("/services returns 307 redirect to /fr/services", async ({ request }) => {
    const res = await request.get("/services", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toBe("/fr/services");
  });

  test("LanguageSwitcher preserves path when switching locale", async ({ page }) => {
    await page.goto("/fr/services");
    await page.getByRole("button", { name: /switch to/i }).click();
    await expect(page).toHaveURL(/\/en\/services$/);
  });

  test("NEXT_LOCALE cookie set after switch", async ({ page, context }) => {
    await page.goto("/fr");
    await page.getByRole("button", { name: /switch to/i }).click();
    await page.waitForURL(/\/en/);
    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === "NEXT_LOCALE");
    expect(cookie?.value).toBe("en");
  });
});
