import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing config", () => {
  it("exposes fr, en, ar as locales", () => {
    expect(routing.locales).toEqual(["fr", "en", "ar"]);
  });

  it("uses fr as defaultLocale", () => {
    expect(routing.defaultLocale).toBe("fr");
  });

  it("prefixes all locales (localePrefix='always')", () => {
    expect(routing.localePrefix).toBe("always");
  });
});
