"use client";

/**
 * Home Shell — Single-page architecture.
 * Navigation / layout pattern aligned with FormationDetailShell.tsx:
 *   • First section rendered as <header> (hero)
 *   • Subsequent sections as <section style={secStyle}>
 *   • Natural flow (no forced 100vh), consistent vertical rhythm
 *   • Thin border-bottom separators between sections
 *   • <FooterStrip /> at the end
 */

import React from "react";
import dynamic from "next/dynamic";

import HeroSection from "@/components/home/sections/HeroSection";
import AboutSection from "@/components/home/sections/AboutSection";
import ValueSection from "@/components/home/sections/ValueSection";
import PolesSection from "@/components/home/sections/PolesSection";
import ManifesteSection from "@/components/home/sections/ManifesteSection";
import ProjectsSection from "@/components/home/sections/ProjectsSection";
import BlogShowcaseSection from "@/components/home/sections/BlogShowcaseSection";
import CTASection from "@/components/layout/CTASection";
import FooterStrip from "@/components/layout/FooterStrip";

/* ─────────────────────────────────────────────────────────────────
   Wrapper — CTA final de la home, prêt-à-l'emploi avec textes
   orientés "démarrer un projet".
───────────────────────────────────────────────────────────────── */
function HomeCTASection() {
  return (
    <CTASection
      eyebrow="Démarrons ensemble"
      title="Vous avez un projet ?"
      description="Que ce soit une idée à valider, une solution à bâtir ou une équipe à former — nos experts vous répondent sous 24 h pour transformer votre ambition en réalité."
      buttonText="Démarrer un projet"
      buttonHref="/contact"
    />
  );
}

/* Canvas / window-dependent — client only */
const WaveTerrain = dynamic(() => import("@/components/background/WaveTerrain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/background/Cursor"), { ssr: false });
const Grain = dynamic(() => import("@/components/background/Grain"), { ssr: false });

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS — mirror FormationDetailShell
───────────────────────────────────────────────────────────────── */
const LINE      = "rgba(255,255,255,0.10)";
const LINE_SOFT = "rgba(255,255,255,0.06)";

const heroHeaderStyle: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderBottom: `1px solid ${LINE}`,
};

const secStyle: React.CSSProperties = {
  position: "relative",
  /* 60vh baseline — enough for sections that use height:100% internally
     to render without collapsing, but no huge empty gap around centred
     content. Sections with heavier content (Poles panels, Hero) still
     grow beyond this via their own internal heights.                     */
  minHeight: "60vh",
  padding: 0,
  borderBottom: `1px solid ${LINE_SOFT}`,
  display: "flex",
  flexDirection: "column",
};

const secFlushStyle: React.CSSProperties = {
  ...secStyle,
  borderBottom: "none",
};

/* ─────────────────────────────────────────────────────────────────
   SECTION REGISTRY — single source of truth
───────────────────────────────────────────────────────────────── */
export interface Section {
  id: string;
  label: string;
  number: string;
  Component: React.ComponentType;
  /** Hide the bottom border (use on the last section) */
  flush?: boolean;
  /** The section renders its own footer — skip the global one */
  ownsFooter?: boolean;
}

export const SECTIONS: Section[] = [
  { id: "about",     label: "QUI SOMMES-NOUS", number: "02", Component: AboutSection },
  { id: "values",    label: "NOS CHIFFRES",    number: "03", Component: ValueSection },
  { id: "poles",     label: "LA CITÉ",         number: "04", Component: PolesSection },
  { id: "manifeste", label: "LA MAISON",       number: "05", Component: ManifesteSection },
  { id: "projects",  label: "LE PORTAIL",      number: "07", Component: ProjectsSection },
  { id: "blog",      label: "LE BLOG",         number: "08", Component: BlogShowcaseSection },
  { id: "cta",       label: "DÉMARRONS",       number: "09", Component: HomeCTASection, flush: true },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function HomeShell() {
  const lastOwnsFooter = SECTIONS[SECTIONS.length - 1]?.ownsFooter;

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        color: "#fff",
        fontFamily: "var(--font-body)",
        /* `clip` prevents horizontal overflow WITHOUT creating a scroll
           context — preserves `position: sticky` on nested descendants
           (used by BlogShowcaseSection's stacking cards).                 */
        overflowX: "clip",
        position: "relative",
      }}
    >
      {/* ── Fixed animated background layers ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <WaveTerrain />
        <Grain />
      </div>

      <Cursor />

      <style>{`
        /* Let each section's inner component fill the flex column so
           children that use height:100% (e.g. PolesSection panels) render. */
        [data-section] > * {
          flex: 1 1 auto;
          width: 100%;
        }

        /* CTA section (last) — content-sized, no forced 100vh / 60vh.
           Avoids the big empty area between the CTA content and the footer. */
        [data-section="cta"] {
          min-height: 0 !important;
        }
        [data-section="cta"] > * {
          flex: 0 0 auto !important;
        }

        @media (max-width: 900px) {
          [data-section] > * { min-height: 0; }
          [data-section] [style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .mobile-flex-col {
            flex-direction: column !important;
            gap: 3rem !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            transform: none !important;
          }
          .mobile-txt-center {
            text-align: center !important;
            align-items: center !important;
          }
          .footer-container {
            position: relative !important;
            bottom: auto !important;
            margin-top: 4rem !important;
            padding: 0 1rem !important;
          }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO — rendered as <header>, mirrors FormationDetailShell's hero ── */}
        <header id="hero" data-section="hero" style={heroHeaderStyle}>
          <HeroSection />
        </header>

        {/* ── Subsequent sections — uniform flow, natural height ── */}
        {SECTIONS.map((section) => {
          const { id, Component, flush } = section;
          return (
            <section
              key={id}
              id={id}
              data-section={id}
              style={flush ? secFlushStyle : secStyle}
            >
              <Component />
            </section>
          );
        })}

        {!lastOwnsFooter && <FooterStrip />}
      </div>
    </div>
  );
}
