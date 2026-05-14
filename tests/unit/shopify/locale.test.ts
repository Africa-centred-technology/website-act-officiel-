import { describe, it, expect } from "vitest";
import { toShopifyLanguage } from "@/lib/shopify/locale";

describe("toShopifyLanguage", () => {
  it("maps fr → FR", () => {
    expect(toShopifyLanguage("fr")).toBe("FR");
  });
  it("maps en → EN", () => {
    expect(toShopifyLanguage("en")).toBe("EN");
  });
  it("maps ar → AR", () => {
    expect(toShopifyLanguage("ar")).toBe("AR");
  });
  it("throws on unknown locale", () => {
    // @ts-expect-error — testing runtime guard
    expect(() => toShopifyLanguage("de")).toThrow(/unsupported locale/i);
  });
});
