"use client";
import { useLocale } from "next-intl";

/**
 * Retourne 1 en LTR, -1 en RTL.
 * Sert à inverser les translations Framer Motion (ex. x: 100 * useDirection())
 * sans réécrire chaque animation pour le RTL.
 */
export function useDirection(): 1 | -1 {
  const locale = useLocale();
  return locale === "ar" ? -1 : 1;
}
