import type messages from "./i18n/messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: "fr" | "en" | "ar";
  }
}
