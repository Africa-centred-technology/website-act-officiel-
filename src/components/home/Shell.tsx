"use client";

/**
 * Home Shell — Single-page architecture.
 * All page sections are declared in the SECTIONS table and rendered in one pass.
 * To add / remove / reorder a section: edit the SECTIONS array only.
 */

import React from "react";
import dynamic from "next/dynamic";

import HeroSection from "@/components/home/sections/HeroSection";
import AboutSection from "@/components/home/sections/AboutSection";
import PolesSection from "@/components/home/sections/PolesSection";
import ManifesteSection from "@/components/home/sections/ManifesteSection";
import ProjectsSection from "@/components/home/sections/ProjectsSection";
import BlogSection from "@/components/home/sections/BlogSection";
import HorizonSection from "@/components/home/sections/HorizonSection";
import FooterStrip from "@/components/layout/FooterStrip";

/* Canvas / window-dependent — client only */
const WaveTerrain = dynamic(() => import("@/components/background/WaveTerrain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/background/Cursor"), { ssr: false });
const Grain = dynamic(() => import("@/components/background/Grain"), { ssr: false });

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
  { id: "hero",       label: "LE CONTINENT",    number: "01", Component: HeroSection },
  { id: "about",      label: "QUI SOMMES-NOUS", number: "02", Component: AboutSection },
  { id: "poles",      label: "LA CITÉ",         number: "03", Component: PolesSection },
  { id: "manifeste",  label: "LA MAISON",       number: "04", Component: ManifesteSection },
  { id: "projects",   label: "LE PORTAIL",      number: "05", Component: ProjectsSection },
  { id: "blog",       label: "LE BLOG",         number: "06", Component: BlogSection },
  { id: "horizon",    label: "L'HORIZON",       number: "07", Component: HorizonSection, flush: true, ownsFooter: true },
];

/* ─────────────────────────────────────────────────────────────────
   SHARED SECTION SHELL
───────────────────────────────────────────────────────────────── */
function PageSection({ section }: { section: Section }) {
  const { id, Component, flush } = section;
  return (
    <section
      id={id}
      data-section={id}
      className="page-section"
      style={{
        borderBottom: flush ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Component />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function HomeShell() {
  const lastOwnsFooter = SECTIONS[SECTIONS.length - 1]?.ownsFooter;

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        minHeight: "100vh",
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
        .page-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }
        .page-section > * {
          flex: 1 1 auto;
          width: 100%;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .page-section { min-height: auto; }
          .page-section > * { min-height: auto; }
          .page-section [style*="gridTemplateColumns"] {
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

      {/* ── Sections stacked — data-driven from SECTIONS table ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {SECTIONS.map((section) => (
          <PageSection key={section.id} section={section} />
        ))}

        {!lastOwnsFooter && <FooterStrip />}
      </div>
    </div>
  );
}
