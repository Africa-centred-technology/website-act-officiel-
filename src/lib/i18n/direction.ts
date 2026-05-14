import type { Locale } from "@/i18n/routing";

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function directionalArrows(locale: Locale): { previous: string; next: string } {
  return isRtl(locale)
    ? { previous: "→", next: "←" }
    : { previous: "←", next: "→" };
}
