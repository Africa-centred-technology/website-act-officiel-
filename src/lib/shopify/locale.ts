import type { Locale } from "@/i18n/routing";

export type ShopifyLanguageCode = "FR" | "EN" | "AR";

/**
 * Map the next-intl Locale to a Shopify Storefront LanguageCode.
 * Used at the i18n→Shopify boundary to feed @inContext(language: $lang).
 */
export function toShopifyLanguage(locale: Locale): ShopifyLanguageCode {
  switch (locale) {
    case "fr": return "FR";
    case "en": return "EN";
    case "ar": return "AR";
    default: {
      const exhaustive: never = locale;
      throw new Error(`Unsupported locale for Shopify: ${exhaustive as string}`);
    }
  }
}
