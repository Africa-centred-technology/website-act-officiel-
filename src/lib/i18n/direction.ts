import type { Locale } from "@/i18n/routing";

export function isRtl(_locale: Locale): boolean {
  return false;
}

export function directionalArrows(_locale: Locale): { previous: string; next: string } {
  return { previous: "←", next: "→" };
}
