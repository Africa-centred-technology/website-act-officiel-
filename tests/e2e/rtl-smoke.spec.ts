import { test, expect } from "@playwright/test";

const AR_PAGES = ["", "/about", "/services", "/formations", "/blog"] as const;

for (const path of AR_PAGES) {
  test(`/ar${path} loads with dir=rtl, lang=ar, and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto(`/ar${path}`, { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    expect(errors, `Console errors on /ar${path}:\n${errors.join("\n")}`).toEqual([]);
  });
}
