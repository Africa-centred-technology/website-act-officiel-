"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();

  const ordered = routing.locales as readonly string[];
  const idx = ordered.indexOf(current);
  const next = ordered[(idx + 1) % ordered.length] as (typeof routing.locales)[number];

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${LOCALE_LABELS[next]}`}
      className="inline-flex items-center gap-1.5 bg-transparent text-sm font-medium hover:opacity-80 transition-opacity"
    >
      <Globe size={14} aria-hidden="true" />
      <span>{current.toUpperCase()}</span>
    </button>
  );
}
