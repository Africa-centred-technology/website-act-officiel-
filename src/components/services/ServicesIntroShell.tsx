"use client";

/**
 * ServicesIntroShell — Expérience d'entrée des services ACT.
 *
 * Phases :
 *  "logo"     → Streaks lumineuses depuis les 4 bords → forment ACT → dispersent
 *  "services" → 8 cards avec images, sans numérotation
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SERVICES, type Service } from "@/lib/data/services";
import LogoPhase from "./LogoPhase";
import FooterStrip from "@/components/layout/FooterStrip";

const ORANGE = "#D35400";
const GOLD = "#F39C12";

/* ── Background layers (same as SecteursShell for uniformity) ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

/* ── Tokens ───────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;

type Phase = "logo" | "services";

/* LogoPhase, useParticleCanvas, sampleOffscreenText → ./LogoPhase.tsx */

/* ══════════════════════════════════════════════════════════
   SERVICE CARD — entrée staggerée + hover CSS natif
   ══════════════════════════════════════════════════════════ */
function ServiceCard({
  svc, index, onEnter,
}: {
  svc: Service; index: number;
  onEnter: (i: number) => void;
}) {
  return (
    <motion.div
      className="svc-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.4 },
        y: { duration: 0.55, delay: index * 0.07, ease: [...BURST] },
      }}
      onClick={() => onEnter(index)}
      style={{
        "--svc-accent": svc.accent,
        position: "relative", overflow: "hidden",
        borderRadius: "0.8rem", cursor: "pointer",
        minHeight: "clamp(180px, 22vh, 270px)",
        display: "flex", flexDirection: "column",
      } as React.CSSProperties}
    >
      {/* Image */}
      <div className="svc-card__img" aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${svc.heroImage})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Gradient de profondeur */}
      <div className="svc-card__depth" aria-hidden style={{ position: "absolute", inset: 0 }} />

      {/* Halo accent */}
      <div className="svc-card__halo" aria-hidden style={{ position: "absolute", inset: 0 }} />

      {/* Barre top */}
      <div className="svc-card__topbar" aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${svc.accent}, transparent 65%)`,
      }} />

      {/* Icône filigrane */}
      <div className="svc-card__icon" aria-hidden style={{
        position: "absolute", right: "1rem", bottom: "1rem",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke={svc.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={svc.icon} />
        </svg>
      </div>

      {/* Contenu */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "1.4rem 1.5rem 1.2rem",
        display: "flex", flexDirection: "column", flex: 1, gap: "0.65rem",
      }}>
        <h3 style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(1rem, 1.3vw, 1.4rem)",
          fontWeight: 500, color: "#fff",
          lineHeight: 1.22, whiteSpace: "pre-line", flex: 1,
        }}>{svc.title}</h3>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <p className="svc-card__tagline" style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1.15rem)",
            color: "#ffffff",
            fontStyle: "italic", lineHeight: 1.35, maxWidth: "82%",
          }}>{svc.tagline}</p>
          <svg className="svc-card__arrow" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={svc.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICES OVERVIEW
   ══════════════════════════════════════════════════════════ */
function ServicesOverview({ onEnter }: { onEnter: (i: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "absolute", inset: 0, zIndex: 8,
        display: "flex", flexDirection: "column",
        overflowY: "auto", overflowX: "hidden",
      }}
    >
      {/* ── Hero Header (identique Secteurs) ── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        paddingTop: "clamp(7rem, 11vw, 10rem)",
        paddingBottom: "clamp(3rem, 4vw, 4.5rem)",
        paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
        paddingRight: "clamp(1.5rem, 6vw, 8rem)",
        flexShrink: 0,
      }}>
        {/* Radial glow orange */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 72% 56% at 50% -8%, rgba(211,84,0,0.13) 0%, transparent 68%)" }} />

        {/* Orange rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [...EASE] }}
          style={{ height: 1, background: "rgba(211,84,0,0.38)", marginBottom: "2.5rem", originX: 0 }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.2rem" }}
        >
          <motion.div
            style={{ width: 28, height: 1, background: ORANGE, originX: 0 }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.45 }}
          />
          <span style={{ color: "#ffffff", fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            Africa Centred Technology
          </span>
          <span style={{ color: ORANGE, fontWeight: 900, fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            — Services
          </span>
        </motion.div>

        {/* Grand titre */}
        <div style={{ overflow: "hidden", marginBottom: "1.25rem" }}>
          <motion.h1
            initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [...EASE] }}
            style={{ fontWeight: 900, fontSize: "clamp(3rem, 8vw, 10rem)", lineHeight: 0.92, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#fff", margin: 0 }}
          >
            NOS PÔLES
            <br />
            <span style={{ color: ORANGE }}>D&apos;EXPERTISE</span>
          </motion.h1>
        </div>

        {/* Sous-titre + légende pôles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}
        >
          <p style={{ color: "#ffffff", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", lineHeight: 1.65, maxWidth: "680px", margin: 0, textAlign: "justify", flex: 1 }}>
            ACT déploie deux pôles complémentaires — Ingénierie Technologique &amp; Conseil — pour couvrir l&apos;intégralité des besoins de transformation digitale des entreprises africaines.
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[{ label: "Pôle I · Ingénierie", color: ORANGE }, { label: "Pôle II · Conseil", color: GOLD }].map(p => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: `0 0 7px ${p.color}` }} />
                <span style={{ fontSize: "clamp(1rem, 1.2vw, 1.2rem)", color: "#ffffff", letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Grille ── */}
      <div style={{
        padding: "0 clamp(1.5rem, 6vw, 8rem) 4rem",
        display: "flex", flexDirection: "column", gap: "2.5rem",
        flexShrink: 0,
      }}>

        {/* ── Pôle I ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.2rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ORANGE, flexShrink: 0, boxShadow: `0 0 6px ${ORANGE}` }} />
            <span style={{ fontSize: "clamp(1rem, 1.1vw, 1.1rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: `${ORANGE}CC`, whiteSpace: "nowrap" }}>
              Pôle I — Ingénierie Technologique
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ORANGE}50, transparent)` }} />
          </div>
          <div className="svc-overview-grid" style={{ gap: "1.2rem" }}>
            {SERVICES.filter(s => s.poleN === "I").map(svc => (
              <ServiceCard key={svc.slug} svc={svc} index={SERVICES.indexOf(svc)} onEnter={onEnter} />
            ))}
          </div>
        </div>

        {/* ── Pôle II ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.2rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, flexShrink: 0, boxShadow: `0 0 6px ${GOLD}` }} />
            <span style={{ fontSize: "clamp(1rem, 1.1vw, 1.1rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: `${GOLD}CC`, whiteSpace: "nowrap" }}>
              Pôle II — Conseil &amp; Formation
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD}50, transparent)` }} />
          </div>
          <div className="svc-overview-grid" style={{ gap: "1.2rem" }}>
            {SERVICES.filter(s => s.poleN === "II").map(svc => (
              <ServiceCard key={svc.slug} svc={svc} index={SERVICES.indexOf(svc)} onEnter={onEnter} />
            ))}
          </div>
        </div>

      </div>

      {/* Footer dans le flux scrollable — identique à SecteursShell */}
      <FooterStrip />

      <style>{`
        /* ── Grid responsive ── */
        .svc-overview-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1100px) { .svc-overview-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .svc-overview-grid { grid-template-columns: 1fr !important; } }

        /* ── Card base ── */
        .svc-card {
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          min-height: clamp(200px, 26vh, 300px) !important;
        }
        .svc-card__img {
          opacity: 0.62;
          transition: opacity 0.5s ease, transform 0.65s ease;
        }
        .svc-card__depth {
          background: linear-gradient(to bottom, rgba(7,14,28,0.22) 0%, rgba(7,14,28,0.72) 52%, rgba(7,14,28,0.97) 100%);
          transition: background 0.5s ease;
        }
        .svc-card__halo {
          background: radial-gradient(ellipse 80% 70% at 15% 80%, color-mix(in srgb, var(--svc-accent) 13%, transparent) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .svc-card__topbar {
          transform: scaleX(0.15);
          transform-origin: left;
          transition: transform 0.45s ease;
        }
        .svc-card__icon { opacity: 0.05; transition: opacity 0.35s ease; }
        .svc-card__dot  { box-shadow: 0 0 4px var(--svc-accent); transition: box-shadow 0.35s ease; }
        .svc-card__tagline { transition: color 0.35s ease; }
        .svc-card__arrow {
          opacity: 0.25;
          transform: translateX(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        /* ── Hover state ── */
        .svc-overview-grid:has(.svc-card:hover) .svc-card:not(:hover) {
          opacity: 0.4;
          transform: scale(0.97);
        }
        .svc-card:hover {
          transform: scale(1.025);
          border-color: color-mix(in srgb, var(--svc-accent) 50%, transparent);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--svc-accent) 18%, transparent),
                      0 0 0 1px color-mix(in srgb, var(--svc-accent) 22%, transparent);
        }
        .svc-card:hover .svc-card__img {
          opacity: 0.85;
          transform: scale(1.06);
        }
        .svc-card:hover .svc-card__depth {
          background: linear-gradient(to bottom, rgba(7,14,28,0.08) 0%, rgba(7,14,28,0.60) 55%, rgba(7,14,28,0.93) 100%);
        }
        .svc-card:hover .svc-card__halo   { opacity: 1; }
        .svc-card:hover .svc-card__topbar { transform: scaleX(1); }
        .svc-card:hover .svc-card__icon   { opacity: 0.20; }
        .svc-card:hover .svc-card__dot    { box-shadow: 0 0 10px var(--svc-accent); }
        .svc-card:hover .svc-card__tagline { color: rgba(255,255,255,0.55); }
        .svc-card:hover .svc-card__arrow {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export default function ServicesIntroShell() {
  const [phase, setPhase] = useState<Phase>("logo");
  const router = useRouter();

  const handleLogoDone = useCallback(() => setPhase("services"), []);

  const handleEnterService = useCallback((idx: number) => {
    const svc = SERVICES[idx];
    router.push(`/services/${svc.slug}`);
  }, [router]);

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative", background: "#070E1C",
      paddingTop: "5rem",   /* clear the fixed navbar */
    }}>
      {/* ── Background layers (même fond que Secteurs) ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* Phases */}
      <AnimatePresence mode="wait">

        {phase === "logo" && (
          <motion.div key="logo" style={{ position: "absolute", inset: 0, zIndex: 10 }}
            initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [...EASE] }}>
            <LogoPhase onDone={handleLogoDone} />
          </motion.div>
        )}

        {phase === "services" && (
          <motion.div key="services" style={{ position: "absolute", inset: 0, zIndex: 8 }}>
            <ServicesOverview onEnter={handleEnterService} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
