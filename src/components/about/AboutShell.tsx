"use client";

import React, {
  useState, useMemo, useRef, useCallback,
} from "react";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue, useSpring,
} from "framer-motion";
import TeamSection from "./TeamSection";
import PolesSection from "@/components/home/sections/PolesSection";
import CTASection from "@/components/layout/CTASection";
import { type TeamMember } from "./TeamMemberCard";
import FooterStrip from "@/components/layout/FooterStrip";
import { useTranslations } from "next-intl";

/* ── Background layers (comme SecteursShell) ─────────────────── */
const WaveTerrain = dynamic(() => import("@/components/background/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/background/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/background/Cursor"), { ssr: false });


/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS & DATA
   ══════════════════════════════════════════════════════════════════════ */

const EASE3D  = [0.6, 0.08, 0.02, 0.99] as const;
const BURST   = [0.04, 0.72, 0.08, 1.0] as const;

/* ── Static structural data (colours, numbers) — text sourced from t() at usage ── */
const STATS_STRUCT = [
  { n: "01", value: "15",  suffix: "+", key: "projects" },
  { n: "02", value: "100", suffix: "%", key: "satisfaction" },
  { n: "03", value: "2",   suffix: "",  key: "countries" },
];


const TEAM_STRUCT = [
  { key: "sohaib",  img: "/images/equipe/sohaib-baroud.jpg" },
  { key: "mpiga",   img: "/images/equipe/mpiga.png" },
  { key: "aldrin",  img: "/images/equipe/aldrin.png" },
  { key: "elvis",   img: "/images/equipe/elvis.png" },
];



/* ══════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ══════════════════════════════════════════════════════════════════════ */

/** Scan-line horizontale (borrowed from RoomEntree) */
function ScanLine() {
  return (
    <motion.div aria-hidden className="absolute start-0 w-full pointer-events-none"
      style={{ height: "2px", zIndex: 4,
        background: "linear-gradient(to right, transparent, rgba(211,84,0,0.6) 30%, rgba(255,130,30,0.95) 50%, rgba(211,84,0,0.6) 70%, transparent)",
        boxShadow: "0 0 28px 5px rgba(211,84,0,0.28)" }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["-4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 9, times: [0, 0.06, 0.92, 1] }} />
  );
}

/** Floating particles (deterministic) */
function ParticleField({ count = 18, color = "#D35400" }: { count?: number; color?: string }) {
  const ps = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: (i * 53 + 7) % 100, y: (i * 71 + 19) % 100,
      size: 1.1 + (i % 3) * 0.65, dur: 4.8 + (i % 5) * 1.2, delay: (i % 7) * 0.55,
    }))
  , [count]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 1 }}>
      {ps.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            background: color, boxShadow: `0 0 ${p.size * 6}px ${color}88` }}
          animate={{ y: [0, -42, 0], opacity: [0, 0.58, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

/** Horizontal ambiance lines */
function AmbiantLines({ positions = ["14%", "84%"] }: { positions?: string[] }) {
  return (
    <>
      {positions.map(pos => (
        <motion.div key={pos} aria-hidden className="absolute start-0 w-full pointer-events-none"
          style={{ height: 1, background: "rgba(255,255,255,0.05)", top: pos, originX: 0.5, zIndex: 1 }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.7 }} />
      ))}
    </>
  );
}

/**
 * Split section header — room pattern:
 * [GHOST_NUM] | [EYEBROW / TITLE chars animated]
 */
function SectionHeader({
  eyebrow, title, titleColor = "#ffffffff", midX, midY,
}: {
  eyebrow:    string;
  title:      string;
  titleColor?: string;
  midX:       ReturnType<typeof useSpring>;
  midY:       ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div className="flex items-center gap-6" style={{ x: midX, y: midY, marginBottom: "3.5rem", position: "relative", zIndex: 3 }}>
      {/* Left: eyebrow */}
      <div style={{ flexShrink: 0 }}>
        <motion.div className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.04 }}>
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.99rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
            {eyebrow}
          </span>
        </motion.div>
      </div>

      {/* Right: title chars */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "flex-end", flex: 1, gap: "0 0" }}>
        {title.split("").map((ch, ci) => (
          <div key={ci} style={{ overflow: "hidden" }}>
            <motion.span className="font-black uppercase inline-block"
              style={{ fontSize: "clamp(2.5rem, 6vw, 9rem)", lineHeight: 1, letterSpacing: "-0.03em", color: titleColor }}
              initial={{ y: "110%", skewX: 10 }} whileInView={{ y: "0%", skewX: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.12 + ci * 0.038, ease: [...EASE3D] }}>
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/** Orange rule */
function OrangeRule({ delay = 0.6 }: { delay?: number }) {
  return (
    <motion.div style={{ height: 1, background: "rgba(211,84,0,0.45)", originX: 0.5, marginBottom: "2.5rem" }}
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
      transition={{ delay, duration: 1.0, ease: [...EASE3D] }} />
  );
}

/** 3-layer parallax hook (same as rooms) */
function useParallax() {
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const bgX  = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY  = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX  = useSpring(mx, { stiffness: 110, damping: 24 });
  const fgY  = useSpring(my, { stiffness: 110, damping: 24 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  }, [mx, my]);

  return { bgX, bgY, midX, midY, fgX, fgY, onMouseMove };
}


/* ══════════════════════════════════════════════════════════════════════
   SECTION 01 — NOTRE HISTOIRE  (RoomEntree pattern)
   ══════════════════════════════════════════════════════════════════════ */
function SectionHero() {
  const t = useTranslations("about.hero");
  const { bgX, bgY, midX, midY, fgX, fgY, onMouseMove } = useParallax();

  return (
    <section onMouseMove={onMouseMove} className="relative overflow-hidden flex flex-col justify-center about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <ScanLine />
      <ParticleField />
      <AmbiantLines positions={["14%", "84%"]} />

      {/* Ambient glow */}
      <motion.div aria-hidden className="absolute pointer-events-none"
        style={{ width: "90vw", height: "55vw", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.12) 0%, rgba(211,84,0,0.04) 45%, transparent 72%)",
          top: "50%", left: "50%", translateX: "-50%", translateY: "-50%", x: bgX, y: bgY, zIndex: 0 }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

      {/* Orbit arc */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 0 }}
        animate={{ rotate: 360 }} transition={{ duration: 90, ease: "linear", repeat: Infinity }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <defs><path id="op01" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" /></defs>
          <text style={{ fontSize: "3.0", fill: "rgba(255,255,255,0.06)", fontWeight: 900, letterSpacing: "1.2", textTransform: "uppercase", fontFamily: "inherit" }}>
            <textPath href="#op01">{"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}{" ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}</textPath>
          </text>
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div className="relative" style={{ x: midX, y: midY, zIndex: 2 }}>

        {/* Eyebrow */}
        <motion.div className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.04 }}>
          <span className="diamond diamond--sm" />
          <span className="text-white/40 uppercase" style={{ fontSize: "1rem", letterSpacing: "0.32em" }}>
            {t("eyebrow")}
          </span>
        </motion.div>

        {/* Mission title */}
        <h1 style={{ margin: 0, padding: 0, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          {/* Line 1 — white, chars roll in */}
          <div style={{ display: "flex", overflow: "hidden" }}>
            {t("line1").split("").map((ch, i) => (
              <motion.span key={i} className="font-black uppercase inline-block"
                style={{ color: "#ffffff", fontSize: "clamp(3rem, 7.5vw, 10.5rem)", lineHeight: 1 }}
                initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.10 + i * 0.032, ease: [...EASE3D] }}>
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </div>
          {/* Line 2 — orange, burst from center */}
          <div style={{ display: "flex" }}>
            {t("line2").split("").map((ch, i) => {
              const mid = Math.floor(t("line2").length / 2);
              return (
                <motion.span key={i} className="font-black uppercase inline-block"
                  style={{ color: "#D35400", fontSize: "clamp(3rem, 7.5vw, 10.5rem)", lineHeight: 1 }}
                  initial={{ scale: 0.05, opacity: 0, filter: "blur(20px) brightness(3)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px) brightness(1)" }}
                  transition={{ duration: 1.1, delay: 0.35 + Math.abs(i - mid) * 0.038, ease: [...BURST] }}>
                  {ch === " " ? " " : ch}
                </motion.span>
              );
            })}
          </div>
        </h1>

        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.90, duration: 0.65 }}
          style={{ marginTop: "2rem", display: "inline-flex", alignItems: "center", gap: "1rem" }}
        >
          <div style={{ width: 28, height: 1, background: "#D35400" }} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(0.95rem, 1.2vw, 1.35rem)",
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.75)",
            fontStyle: "italic",
          }}>
            {t("slogan")}
          </span>
          <div style={{ width: 28, height: 1, background: "#D35400" }} />
        </motion.div>

        {/* Orange rule */}
        <motion.div style={{ height: 1, background: "rgba(211,84,0,0.35)", originX: 0, marginTop: "1.8rem", marginBottom: "1.8rem" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.0, duration: 0.9, ease: [...EASE3D] }} />

        {/* Subtitle */}
        <motion.p className="text-white/60"
          style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.65rem)", lineHeight: 1.75, maxWidth: "55rem", margin: "1.5rem 0 0" }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.65 }}>
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-wrap items-center gap-8 mt-10"
          style={{ x: fgX, y: fgY }}
          initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.20, duration: 0.60 }}>
          <a href="#equipe" className="cta-btn">
            <div className="cta-btn__border" /><div className="cta-btn__blur" />
            <div className="cta-btn__background" />
            <div className="cta-btn__inner"><span className="cta-btn__icon" /><span className="cta-btn__text">{t("ctaTeam")}</span></div>
          </a>
          <a href="#expertise"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              border: "1px solid rgba(255,255,255,0.22)", borderRadius: "4px",
              padding: "0.85rem 1.6rem", color: "rgba(255,255,255,0.70)",
              textDecoration: "none", fontSize: "1.05rem", letterSpacing: "0.14em",
              textTransform: "uppercase", fontFamily: "var(--font-display)", fontWeight: 700,
              transition: "border-color 0.22s, color 0.22s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D35400"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "rgba(255,255,255,0.70)"; }}
          >
            <span className="diamond diamond--sm" />{t("ctaApproach")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 02 — NOS CHIFFRES  (même style que SectionValues)
   ══════════════════════════════════════════════════════════════════════ */
const STAT_ENTRY = [
  { x: "-16%", y: "10%", scale: 0.80, blur: 10, delay: 0.05 },
  { x:   "0%", y: "14%", scale: 0.86, blur: 6,  delay: 0.20 },
  { x:  "16%", y: "10%", scale: 0.80, blur: 10, delay: 0.34 },
];

function StatCard({ stat, index }: { stat: typeof STATS_STRUCT[0]; index: number }) {
  const t = useTranslations("about.stats");
  const [hovered, setHovered] = useState(false);
  const entry = STAT_ENTRY[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: entry.x, y: entry.y, scale: entry.scale, filter: `blur(${entry.blur}px)` }}
      whileInView={{ opacity: 1, x: "0%", y: "0%", scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, delay: entry.delay, ease: [...EASE3D] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        borderTop: "3px solid #D35400",
        borderRight: `1px solid rgba(255,255,255,${hovered ? 0.18 : 0.12})`,
        borderBottom: `1px solid rgba(255,255,255,${hovered ? 0.18 : 0.12})`,
        borderLeft: `1px solid rgba(255,255,255,${hovered ? 0.18 : 0.12})`,
        borderRadius: 16,
        padding: "1.6rem",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "border-color 0.28s",
        cursor: "default",
      }}
    >
      {/* Scanlines overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.012) 3px, rgba(211,84,0,0.012) 4px)",
      }} />

      {/* Hover glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit",
        background: hovered ? "radial-gradient(circle at 50% 100%, rgba(211,84,0,0.10) 0%, transparent 70%)" : "none",
        transition: "background 0.3s",
      }} />

      <div style={{ 
        position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>

        {/* Big value */}
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 900,
          fontSize: "clamp(2.4rem, 4vw, 4rem)", lineHeight: 1,
          color: "#fff", display: "block", marginBottom: "0.3rem",
        }}>
          {stat.value}<span style={{ color: "#F39C12" }}>{stat.suffix}</span>
        </span>

        {/* Separator */}
        <div style={{ width: 24, height: 1, background: "#D35400", margin: "1rem 0" }} />

        {/* Label */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 900,
          textTransform: "uppercase", color: "#fff",
          fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)", lineHeight: 1.05, marginBottom: "0.6rem",
        }}>
          {t(`items.${stat.key}.label` as Parameters<typeof t>[0])}
        </h3>

        {/* Description */}
        <p style={{ color: "rgba(255,255,255,0.60)", fontSize: "clamp(0.9rem, 1.1vw, 1.2rem)", lineHeight: 1.6, margin: 0 }}>
          {t(`items.${stat.key}.sub` as Parameters<typeof t>[0])}
        </p>

      </div>
    </motion.div>
  );
}

function SectionStats() {
  const t = useTranslations("about.stats");
  const { midX, midY, onMouseMove } = useParallax();

  return (
    <section id="expertise" onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad">
      <ScanLine />

      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} midX={midX} midY={midY} />
      <OrangeRule />

      <div className="room-grid-3 gap-4" style={{ flex: "unset" }}>
        {STATS_STRUCT.map((s, i) => <StatCard key={s.n} stat={s} index={i} />)}
      </div>
    </section>
  );
}



/* ══════════════════════════════════════════════════════════════════════
   SECTION 04 — POURQUOI ACT
   ══════════════════════════════════════════════════════════════════════ */
const WHY_KEYS = ["africa", "price", "local", "team"] as const;

function SectionWhyACT() {
  const t = useTranslations("about.whyact");
  const { midX, midY, onMouseMove } = useParallax();

  return (
    <section onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad">
      <ScanLine />
      <AmbiantLines positions={["10%", "90%"]} />

      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} midX={midX} midY={midY} />
      <OrangeRule />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1.5rem",
      }}
        className="why-act-grid"
      >
        {WHY_KEYS.map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [...EASE3D] }}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderLeft: "3px solid #D35400",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0 12px 12px 0",
              padding: "2rem 2rem 2rem 2.4rem",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <span style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.8rem",
              letterSpacing: "0.28em",
              color: "#D35400",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}>
              {t(`items.${key}.n` as Parameters<typeof t>[0])}
            </span>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#fff",
              fontSize: "clamp(1.3rem, 1.8vw, 2rem)",
              lineHeight: 1.1,
              marginBottom: "0.9rem",
            }}>
              {t(`items.${key}.title` as Parameters<typeof t>[0])}
            </h3>
            <p style={{
              color: "rgba(255,255,255,0.58)",
              fontSize: "clamp(0.95rem, 1.1vw, 1.25rem)",
              lineHeight: 1.7,
              margin: 0,
            }}>
              {t(`items.${key}.desc` as Parameters<typeof t>[0])}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════════════
   MAIN SHELL — Page scrollable normale avec toutes les sections
   ══════════════════════════════════════════════════════════════════════ */
export default function AboutShell() {
  const t = useTranslations("about.team");
  const team: TeamMember[] = TEAM_STRUCT.map((m) => ({
    name: t(`members.${m.key}.name` as Parameters<typeof t>[0]),
    role: t(`members.${m.key}.role` as Parameters<typeof t>[0]),
    img:  m.img,
    bio:  t(`members.${m.key}.bio`  as Parameters<typeof t>[0]),
  }));

  return (
    <div style={{ background: "#0A1410", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      {/* ── Background layers globaux ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* Toutes les sections empilées verticalement */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionHero />
        <SectionStats />
        <SectionWhyACT />
        <div style={{ marginBottom: "-6rem" }}>
          <PolesSection />
        </div>
        <TeamSection team={team} />
        <CTASection />
        <FooterStrip />
      </div>
    </div>
  );
}
