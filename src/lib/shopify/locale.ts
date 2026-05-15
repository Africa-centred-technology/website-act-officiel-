export type ShopifyLanguageCode = "FR" | "EN" | "AR";

const LOCALE_MAP: Record<string, ShopifyLanguageCode> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

/** Maps an app locale string to a Shopify Storefront LanguageCode. */
export function toShopifyLanguage(locale?: string): ShopifyLanguageCode {
  if (!locale) return "FR";
  const code = LOCALE_MAP[locale];
  if (!code) throw new Error(`Unsupported locale: "${locale}"`);
  return code;
}
