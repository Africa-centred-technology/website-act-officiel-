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
const GOLD = "#D35400";
const GREEN = "#D35400";

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
   SERVICE CARD — Design avec Titre qui dépasse sur les côtés
   ══════════════════════════════════════════════════════════ */
function ServiceCard({
  svc, index, onEnter,
}: {
  svc: Service; index: number;
  onEnter: (i: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.05 },
        scale: { duration: 0.55, delay: index * 0.05, ease: [...BURST] },
      }}
      className="group"
      style={{
        position: "relative",
        cursor: "pointer",
        padding: "0 24px", // Augmentation pour réduire la carte et espacer les titres
      }}
      onClick={() => onEnter(index)}
    >
      {/* Conteneur Image (avec overflow:hidden) */}
      <div style={{
        position: "relative",
        borderRadius: "1rem",
        overflow: "hidden",
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#0a0a0a",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        transition: "transform 0.5s ease",
        maxWidth: "300px",
        margin: "0 auto",
      }} className="group-hover:scale-[1.02]">

        {/* Image de fond avec effet Ken Burns au hover */}
        <motion.div
          className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: `url(${svc.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.75,
            filter: "brightness(0.85)",
          }}
        />

        {/* Overlay dégradé pour la profondeur */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(3,10,24,0.95) 0%, transparent 66%)",
            pointerEvents: "none",
          }}
        />

        {/* Halo d'accentuation subtil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${svc.accent}88 0%, transparent 60%)`,
          }}
        />

        {/* Cadre de focus et numéro */}
        <div className="absolute inset-3 border border-white/0 group-hover:border-white/10 rounded-lg transition-all duration-500 pointer-events-none" />
        <div className="absolute top-4 left-4 font-bold text-white/5 group-hover:text-white/20 transition-colors duration-500 text-5xl select-none" style={{ fontFamily: "Futura" }}>
          {svc.n}
        </div>

        {/* Reflet lumineux furtif */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      </div>

      {/* Le bloc de titre décalé */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%", // Largeur plus réduite
          maxWidth: "260px",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
        className="transition-transform duration-500 group-hover:-translate-y-2"
      >
        <div
          style={{
            background: "#20232A",
            padding: "1.5rem 1rem",
            borderRadius: "0.25rem 0.25rem 0 0",
            boxShadow: "0 -5px 20px rgba(0,0,0,0.3)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "9.5rem", // Beaucoup plus haut
          }}
        >

          <h2 style={{
            fontFamily: "var(--font-heading), system-ui, sans-serif",
            fontSize: "2rem",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.3,
            textAlign: "center",
            margin: 0,
          }}>
            {svc.title}
          </h2>
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
        paddingTop: "max(72px, clamp(7rem, 11vw, 10rem))",
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
            NOS SERVICES
            <br />
            <span style={{ color: ORANGE }}>&amp; SOLUTIONS</span>
          </motion.h1>
        </div>

        {/* Sous-titre + légende pôles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}
        >
          <p style={{ color: "#ffffff", fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", lineHeight: 1.65, maxWidth: "680px", margin: 0, textAlign: "justify", flex: 1 }}>
            ACT déploie des services complémentaires pour couvrir l&apos;intégralité des besoins de transformation digitale des entreprises.
          </p>
            {[
              { label: "Pôle I · Ingénierie", color: ORANGE },
              { label: "Pôle II · Conseil", color: GOLD },
              { label: "Pôle III · Formation", color: GREEN }
            ].map(p => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: `0 0 7px ${p.color}` }} />
                <span style={{ fontSize: "clamp(1rem, 1.2vw, 1.2rem)", color: "#ffffff", letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.label}</span>
              </div>
            ))}
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
          <div className="svc-overview-grid" style={{ gap: "3.5rem 2.5rem" }}>
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
              Pôle II — Conseil
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD}50, transparent)` }} />
          </div>
          <div className="svc-overview-grid" style={{ gap: "2.5rem 1rem" }}>
            {SERVICES.filter(s => s.poleN === "II").map(svc => (
              <ServiceCard key={svc.slug} svc={svc} index={SERVICES.indexOf(svc)} onEnter={onEnter} />
            ))}
          </div>
        </div>

        {/* ── Pôle III ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.2rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, flexShrink: 0, boxShadow: `0 0 6px ${GREEN}` }} />
            <span style={{ fontSize: "clamp(1rem, 1.1vw, 1.1rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: `${GREEN}CC`, whiteSpace: "nowrap" }}>
              Pôle III — Formation
            </span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GREEN}50, transparent)` }} />
          </div>
          <div className="svc-overview-grid" style={{ gap: "2.5rem 1rem" }}>
            {SERVICES.filter(s => s.poleN === "III").map(svc => (
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
        @media (max-width: 900px) { .svc-overview-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .svc-overview-grid { grid-template-columns: 1fr !important; } }
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
      paddingTop: "max(72px, clamp(5rem, 8vw, 8rem))",   /* clear the fixed navbar; max() garantit ≥72px avec root 8px */
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
