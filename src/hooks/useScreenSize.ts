"use client";

import { useState, useEffect } from "react";

export type ScreenSize = "mobile" | "tablet" | "desktop";

/**
 * Hook SSR-safe centralisé pour la détection de la taille d'écran.
 *
 * Breakpoints officiels ACT :
 *   mobile  : < 768px
 *   tablet  : 768px – 1279px
 *   desktop : >= 1280px
 *
 * Initialisation SSR : "desktop" par défaut pour éviter le flash
 * de contenu mobile lors de l'hydratation (les composants sont
 * principalement pensés pour desktop-first).
 *
 * NOTE : Shell.tsx utilise 900px comme seuil custom pour les rooms —
 * ce hook ne doit PAS être utilisé à sa place dans Shell.tsx.
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setScreenSize("mobile");
      else if (w < 1280) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return screenSize;
}

/**
 * Raccourci booléen : retourne true si < 768px.
 * SSR-safe : false par défaut (desktop-first).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
