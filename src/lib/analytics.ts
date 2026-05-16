"use client";

/**
 * Consent-aware analytics initializers.
 * Scripts are injected dynamically ONLY after the user grants consent.
 * Called by CookieBanner.tsx on accept and on returning-visitor mount.
 *
 * Configure via environment variables:
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID  — Microsoft Clarity project ID
 *   NEXT_PUBLIC_HOTJAR_SITE_ID      — Hotjar site ID
 */

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
    hj?:      ((...args: unknown[]) => void) & { q?: unknown[] };
    _hjSettings?: { hjid: string; hjsv: number };
  }
}

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";
const HOTJAR_ID  = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID  ?? "";

/* ── Microsoft Clarity ───────────────────────────────────────────────────── */

export function initClarity(): void {
  if (!CLARITY_ID || typeof window === "undefined" || window.clarity) return;

  // Queue stub — receives calls before the real script loads
  const stub = function (...args: unknown[]) {
    stub.q = stub.q ?? [];
    stub.q.push(args);
  };
  stub.q = [] as unknown[];
  window.clarity = stub;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(s);
}

/* ── Hotjar ──────────────────────────────────────────────────────────────── */

export function initHotjar(): void {
  if (!HOTJAR_ID || typeof window === "undefined" || window.hj) return;

  // Queue stub
  const stub = function (...args: unknown[]) {
    stub.q = stub.q ?? [];
    stub.q.push(args);
  };
  stub.q = [] as unknown[];
  window.hj = stub;
  window._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
  document.head.appendChild(s);
}

/* ── Aggregated init — call this on "granted" consent ───────────────────── */

export function initAnalytics(): void {
  initClarity();
  initHotjar();
}
