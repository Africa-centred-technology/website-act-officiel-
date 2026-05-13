import { test, expect } from "@playwright/test";

test.describe("i18n routing", () => {
  test("/ redirects to /fr (or detected locale)", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/\/(fr|en|ar)(\/|$)/);
  });

  test("/fr/services renders 200 with lang=fr dir=ltr", async ({ page }) => {
    await page.goto("/fr/services");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "fr");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  test("/ar/services renders 200 with lang=ar dir=rtl", async ({ page }) => {
    await page.goto("/ar/services");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/services returns 308 redirect to /fr/services", async ({ request }) => {
    const res = await request.get("/services", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/fr/services");
  });

  test("LanguageSwitcher preserves path when switching locale", async ({ page }) => {
    await page.goto("/fr/services");
    await page.selectOption("select[aria-label='Change language']", "en");
    await expect(page).toHaveURL(/\/en\/services$/);
  });

  test("NEXT_LOCALE cookie set after switch", async ({ page, context }) => {
    await page.goto("/fr");
    await page.selectOption("select[aria-label='Change language']", "en");
    await page.waitForURL(/\/en/);
    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === "NEXT_LOCALE");
    expect(cookie?.value).toBe("en");
  });
});
