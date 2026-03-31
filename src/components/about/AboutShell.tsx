"use client";

import React, {
  useEffect, useState, useMemo, useRef, useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useInView,
} from "framer-motion";
import TeamSection from "./TeamSection";
import { type TeamMember } from "./TeamMemberCard";
import CTAButton from "@/components/ui/CTAButton";
import FooterStrip from "@/components/layout/FooterStrip";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

/* ── Background layers (comme SecteursShell) ─────────────────── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

/* ── Réseaux sociaux ─────────────────────────────────────── */
const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@AfricaCentredTechnology", label: "YouTube" },
  { Icon: Facebook, href: "https://web.facebook.com/profile.php?id=61585541019830", label: "Facebook" },
];

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS & DATA
   ══════════════════════════════════════════════════════════════════════ */

const EASE3D  = [0.6, 0.08, 0.02, 0.99] as const;
const BURST   = [0.04, 0.72, 0.08, 1.0] as const;

const STATS = [
  { n: "01", value: "15",  suffix: "+", label: "Projets",     sub: "Solutions déployées avec succès" },
  { n: "02", value: "100", suffix: "%", label: "Satisfaction", sub: "Clients satisfaits" },
  { n: "03", value: "2",   suffix: "",  label: "Pays",         sub: "Maroc et au-delà" },
];

const MANIFESTO =
  "La technologie n'a de valeur que lorsqu'elle crée un impact concret et mesurable. Chez ACT, nous ne nous contentons pas d'implémenter des outils : nous concevons des architectures systèmes qui optimisent le ROI et soutiennent la scalabilité des organisations. En combinant Intelligence Artificielle avancée, Ingénierie de Données et Automatisation Industrielle, nous transformons les défis technologiques complexes en avantages compétitifs durables.";

const VALUES = [
  { n: "01", title: "Collaboration",    color: "#D35400",
    desc: "Les meilleures solutions naissent de l'intelligence collective et du partage de compétences." },
  { n: "02", title: "Transmission",    color: "#F39C12",
    desc: "Nous partageons nos connaissances et nos compétences pour renforcer les capacités locales et favoriser l'autonomie des entreprises." },
  { n: "03", title: "Excellence", color: "#2C4A35",
    desc: "Des standards élevés de qualité, de fiabilité et de rigueur dans chaque projet." },
  { n: "04", title: "Innovation",     color: "#D35400",
    desc: "Une innovation ancrée dans les réalités africaines, qui répond à des besoins concrets." },
];

const TIMELINE = [
  { year: "2023", title: "Naissance",     color: "#D35400",
    desc: "Création d'Africa Centred Technology comme startup d'ingénierie tech portée par une équipe soudée autour d'une vision commune." },
  { year: "2024", title: "Premiers POC",  color: "#F39C12",
    desc: "Déploiement des premiers prototypes IA et data pour des entreprises africaines, validation du modèle et des expertises." },
  { year: "2025", title: "Accélération",  color: "#2C4A35",
    desc: "Déploiement du Système RAG Multi-sources et montée en puissance des missions de conseil pour l'écosystème africain." },
  { year: "2026", title: "Cap 2030",      color: "#D35400",
    desc: "Consolidation de notre vision pan-africaine avec une équipe dynamique, agile et résolument tournée vers l'avenir du continent." },
];


const TEAM: TeamMember[] = [
  {
    name: "SOHAIB BAROUD",
    role: "Fondateur & CEO",
    img: "/images/Equipe/sohaib_baroud.jpg",
    bio: "Visionnaire et leader de l'ingénierie technologique en Afrique. Sohaib a fondé ACT avec la mission de transformer les entreprises africaines en leaders technologiques mondiaux."
  },
  {
    name: "MPIGA-ODOUMBA JESSE",
    role: "Membre fondateur",
    img: "/images/Equipe/MPIGA.png",
    bio: "Co-créateur d'ACT, engagé pour l'innovation africaine et l'impact technologique à l'échelle continentale."
  },
  {
    name: "Aldrin DJOUROBI",
    role: "Membre fondateur",
    img: "/images/Equipe/Aldrin.png",
    bio: "Co-créateur d'ACT, porté par l'ingénierie de pointe et la croissance des startups africaines."
  },
  {
    name: "ELVIS-THEO AKIEME OYONO",
    role: "Membre fondateur",
    img: "/images/Equipe/elvis.png",
    bio: "Co-créateur d'ACT, passionné par les solutions IA et l'excellence produit au service du continent."
  },
];

const STAT_DEPTH = [
  { rotateX: 14, scale: 0.78, blur: 10, delay: 0.06 },
  { rotateX: 9,  scale: 0.86, blur: 6,  delay: 0.20 },
  { rotateX: 5,  scale: 0.93, blur: 3,  delay: 0.34 },
];


/* ══════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ══════════════════════════════════════════════════════════════════════ */

/** Scan-line horizontale (borrowed from RoomEntree) */
function ScanLine() {
  return (
    <motion.div aria-hidden className="absolute left-0 w-full pointer-events-none"
      style={{ height: "2px", zIndex: 4,
        background: "linear-gradient(to right, transparent, rgba(211,84,0,0.6) 30%, rgba(255,130,30,0.95) 50%, rgba(211,84,0,0.6) 70%, transparent)",
        boxShadow: "0 0 28px 5px rgba(211,84,0,0.28)" }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["−4px", "102%"], opacity: [0, 1, 1, 0] }}
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
        <motion.div key={pos} aria-hidden className="absolute left-0 w-full pointer-events-none"
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
  eyebrow, title, titleColor = "#ffffff", midX, midY,
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
          <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "0.95rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
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

/** Portal rings (from RoomSortie) */
function PortalRings() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ border: "1px solid rgba(211,84,0,0.18)" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: "80vmin", height: "80vmin", opacity: 0 }}
          transition={{ duration: 2.8, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }} />
      ))}
    </div>
  );
}

/** Magnetic wrapper (from RoomSortie) */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 220, damping: 20 });
  const sy  = useSpring(y, { stiffness: 220, damping: 20 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.32);
    y.set((e.clientY - r.top  - r.height / 2) * 0.32);
  };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 01 — NOTRE HISTOIRE  (RoomEntree pattern)
   ══════════════════════════════════════════════════════════════════════ */
function SectionHero() {
  const { bgX, bgY, midX, midY, fgX, fgY, onMouseMove } = useParallax();

  return (
    <section onMouseMove={onMouseMove} className="relative overflow-hidden flex flex-col justify-center about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <ScanLine />
      <ParticleField />
      <AmbiantLines positions={["14%", "84%"]} />

      {/* Sun pulse */}
      <motion.div aria-hidden className="absolute pointer-events-none"
        style={{ width: "85vw", height: "52vw", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.14) 0%, rgba(211,84,0,0.05) 45%, transparent 72%)",
          top: "50%", left: "48%", translateX: "-50%", translateY: "-50%", x: bgX, y: bgY, zIndex: 0 }}
        animate={{ scale: [1, 1.40, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />

      {/* Orbit arc SVG */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 0 }}
        animate={{ rotate: 360 }} transition={{ duration: 90, ease: "linear", repeat: Infinity }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <defs><path id="op01" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" /></defs>
          <text style={{ fontSize: "3.0", fill: "rgba(255,255,255,0.07)", fontWeight: 900, letterSpacing: "1.2", textTransform: "uppercase", fontFamily: "inherit" }}>
          <textPath href="#op01">{"ACT · AFRICA CENTRED TECHNOLOGY · GLOBAL EXCELLENCE · "}{" ACT · AFRICA CENTRED TECHNOLOGY · GLOBAL EXCELLENCE · "}</textPath>
          </text>
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div className="relative" style={{ x: midX, y: midY, zIndex: 2 }}>
        {/* Eyebrow */}
        <motion.div className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.60, delay: 0.04 }}>
          <span className="diamond diamond--sm" />
          <span className="text-white/40 uppercase" style={{ fontSize: "1.05rem", letterSpacing: "0.32em" }}>
            Africa Centred Technology · Expertise & Ingénierie
          </span>
        </motion.div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
            {[
              { word: "NOTRE",   color: "#ffffff",            size: "clamp(2rem, 4.5vw, 6.5rem)",  fx: "rollIn",   delay: 0.10, stagger: 0.040 },
              { word: "EXPERTISE",color: "#D35400",           size: "clamp(3.5rem, 8vw, 11rem)", fx: "burstOut", delay: 0.30, stagger: 0.032 },
            ].map(({ word, color, size, fx, delay, stagger }) => (
              <div key={word} style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
                {word.split("").map((ch, i) => {
                  const mid = Math.floor(word.length / 2);
                  const ord = fx === "burstOut" ? Math.abs(i - mid) : i;
                  const charDelay = delay + ord * stagger;
                  const initial = fx === "rollIn" ? { y: "-108%", opacity: 0, filter: "blur(4px)" } : { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" };
                  const target  = fx === "rollIn" ? { y: "0%", opacity: 1, filter: "blur(0px)" }     : { scale: 1, opacity: 1, filter: "blur(0px) brightness(1.0)" };
                  const inner = (
                    <motion.span className="font-black uppercase" key={i}
                      style={{ display: "inline-block", color, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em" }}
                      initial={initial} animate={target}
                      transition={{ duration: fx === "burstOut" ? 1.1 : 0.74, delay: charDelay, ease: [...BURST] }}>
                      {ch}
                    </motion.span>
                  );
                  return fx !== "burstOut" ? <div key={i} style={{ overflow: "hidden" }}>{inner}</div> : <div key={i}>{inner}</div>;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Rule + subtitle + CTAs */}
        <motion.div style={{ height: 1, background: "rgba(211,84,0,0.55)", originX: 0, marginTop: "2.8rem", marginBottom: "2rem" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.0, duration: 0.9, ease: [...EASE3D] }} />
        <motion.p className="text-white/60" style={{ fontSize: "var(--font-20)", lineHeight: 1.6, maxWidth: "42rem" }}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.65 }}>
          Nous accompagnons les organisations dans leur transformation numérique
          en déployant des solutions d&apos;intelligence artificielle et d&apos;ingénierie de données
          de haut niveau — conçues pour la performance et le passage à l&apos;échelle.
        </motion.p>
        <motion.div className="flex flex-wrap items-center gap-8 mt-10"
          style={{ x: fgX, y: fgY }}
          initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.15, duration: 0.60 }}>
          <a href="#equipe" className="cta-btn">
            <div className="cta-btn__border" /><div className="cta-btn__blur" />
            <div className="cta-btn__background" />
            <div className="cta-btn__inner"><span className="cta-btn__icon" /><span className="cta-btn__text">L'Équipe</span></div>
          </a>
          <a href="#expertise" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.15rem", letterSpacing: "0.12em" }}>
            <span className="diamond diamond--sm" />Notre approche
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 02 — NOS CHIFFRES  (RoomAtelier card pattern)
   ══════════════════════════════════════════════════════════════════════ */
function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const depth = STAT_DEPTH[index];

  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    setTilt({ rx: (py - 0.5) * 20, ry: (px - 0.5) * -20, gx: px * 100, gy: py * 100, on: true });
  };

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 58, scale: depth.scale, rotateX: depth.rotateX, filter: `blur(${depth.blur}px)` }}
        animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.95, delay: depth.delay, ease: [...EASE3D] }}
        style={{ perspective: "1200px", height: "100%" }}>
        <motion.div ref={cardRef} onMouseMove={onMove} onMouseLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          style={{ transformStyle: "preserve-3d", position: "relative", padding: "4rem 3rem",
            background: "rgba(8,18,32,0.70)", border: `1px solid rgba(211,84,0,${tilt.on ? 0.5 : 0.12})`,
            overflow: "hidden", transition: "border-color 0.28s", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* CSS scanlines */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.015) 3px, rgba(211,84,0,0.015) 4px)" }} />
          {/* Cursor glow */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: tilt.on ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(211,84,0,0.09) 0%, transparent 65%)` : "none",
            transition: "background 0.22s" }} />
          {/* Scanner bottom */}
          <motion.div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%",
            background: "linear-gradient(to right, transparent, #D35400, transparent)",
            boxShadow: "0 0 18px rgba(211,84,0,0.8)", zIndex: 3 }}
            animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: index * 0.7 }} />

          <div className="relative flex flex-col" style={{ zIndex: 3, flex: 1 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="diamond diamond--sm" />
              <span className="text-[#D35400] uppercase" style={{ fontSize: "1rem", letterSpacing: "0.2em" }}>Indicateur</span>
            </div>
            <span className="font-black text-white" style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)", lineHeight: 1, marginBottom: "0.5rem" }}>
              {stat.value}<span style={{ color: "#F39C12" }}>{stat.suffix}</span>
            </span>
            <motion.div style={{ height: 1, background: "rgba(211,84,0,0.5)", originX: 0, margin: "1.5rem 0" }}
              animate={{ scaleX: tilt.on ? 1 : 0.18 }} transition={{ type: "spring", stiffness: 280, damping: 24 }} />
            <h3 className="font-black uppercase text-white" style={{ fontSize: "clamp(1.8rem, 2.5vw, 2.8rem)", lineHeight: 1.05, marginBottom: "0.8rem" }}>
              {stat.label}
            </h3>
            <p className="text-white/60" style={{ fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)", lineHeight: 1.72 }}>
              {stat.sub}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SectionStats() {
  const { bgX, bgY, midX, midY, onMouseMove } = useParallax();

  return (
    <section onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <ScanLine />

      <SectionHeader eyebrow="Les chiffres qui parlent" title="NOS CHIFFRES" midX={midX} midY={midY} />
      <OrangeRule />

      <div className="room-grid-3 gap-4">
        {STATS.map((s, i) => <StatCard key={s.n} stat={s} index={i} />)}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 03 — NOTRE ADN  (RoomManifeste pattern)
   ══════════════════════════════════════════════════════════════════════ */
function ManifestoWord({ word, index, total, inView }: { word: string; index: number; total: number; inView: boolean }) {
  const delay = 0.28 + index * (1.55 / total);
  return (
    <motion.span
      style={{ display: "inline-block", marginRight: "0.28em", marginBottom: "0.16em", transformOrigin: "50% 100%" }}
      initial={{ opacity: 0.05, color: "#D35400bb", scale: 0.86, rotateX: 12, y: 8 }}
      animate={inView ? { opacity: 1, color: "#ffffff", scale: 1, rotateX: 0, y: 0 } : {}}
      transition={{ delay, duration: 0.62, ease: "easeOut" }}>
      {word}
    </motion.span>
  );
}

function BlinkCursor({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      style={{
        display:       "inline-block",
        width:         "3px",
        height:        "0.82em",
        background:    "#D35400",
        marginLeft:    "0.15em",
        verticalAlign: "middle",
        borderRadius:  1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{
        delay,
        duration: 1.05,
        repeat:   Infinity,
        ease:     "linear",
        times:    [0, 0.04, 0.06, 0.5, 0.52, 1],
      }}
    />
  );
}

function SectionADN() {
  const { bgX, bgY, midX, midY, fgX, onMouseMove } = useParallax();
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const words  = useMemo(() => MANIFESTO.split(/\s+/).filter(Boolean), []);

  return (
    <section onMouseMove={onMouseMove} className="relative flex flex-col justify-center overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <ScanLine />
      <AmbiantLines positions={["12%", "88%"]} />

      <SectionHeader eyebrow="Vision · Impact · Expertise" title="NOTRE ADN" midX={midX} midY={midY} />
      <OrangeRule />

      {/* Word-by-word manifesto */}
      <div ref={ref}>
        <motion.div style={{ maxWidth: "90rem", x: midX, perspective: "1100px" }}>
          <p className="font-black uppercase" style={{ fontSize: "clamp(1.25rem, 2.0vw, 2.8rem)", lineHeight: 1.55, letterSpacing: "0.01em" }}>
            {words.map((w, i) => <ManifestoWord key={i} word={w} index={i} total={words.length} inView={inView} />)}
            <BlinkCursor delay={0.28 + (words.length - 1) * (1.55 / words.length) + 0.65} />
          </p>
        </motion.div>
      </div>

      {/* Attribution */}
      <motion.div className="flex items-center gap-4 mt-14"
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.28 + (words.length - 1) * (1.55 / words.length) + 1.1, duration: 0.7 }} style={{ x: fgX }}>
        <div style={{ width: 36, height: 1, background: "#D35400" }} />
        <span className="text-white/55 uppercase" style={{ fontSize: "1.15rem", letterSpacing: "0.2em" }}>
          SOHAIB BAROUD — Fondateur &amp; CEO, ACT
        </span>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 04 — NOS VALEURS  (RoomGalerie card pattern)
   ══════════════════════════════════════════════════════════════════════ */
function SectionValues() {
  const { bgX, bgY, midX, midY, onMouseMove } = useParallax();
  const [hovered, setHovered] = useState<string | null>(null);

  const ENTRY = [
    { x: "-16%", y: "10%", scale: 0.80, blur: 10, delay: 0.05 },
    { x:  "16%", y: "10%", scale: 0.82, blur: 8,  delay: 0.18 },
    { x: "-10%", y: "12%", scale: 0.87, blur: 5,  delay: 0.30 },
    { x:  "10%", y: "12%", scale: 0.92, blur: 3,  delay: 0.42 },
  ];

  return (
    <section onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <ScanLine />

      <SectionHeader eyebrow="Nos piliers d'excellence" title="NOS STANDARDS" midX={midX} midY={midY} />
      <OrangeRule />

      {/* 2×2 grid — each card from its own corner like RoomGalerie */}
      <div className="about-2col-grid flex-1" style={{ minHeight: 0 }}>
        {VALUES.map((v, i) => {
          const entry = ENTRY[i];
          return (
            <motion.div key={v.n}
              initial={{ opacity: 0, x: entry.x, y: entry.y, scale: entry.scale, filter: `blur(${entry.blur}px)` }}
              whileInView={{ opacity: 1, x: "0%", y: "0%", scale: 1, filter: "blur(0px)" }} viewport={{ once: true }}
              transition={{ duration: 0.85, delay: entry.delay, ease: [...EASE3D] }}
              className="relative overflow-hidden"
              style={{ background: "rgba(8,18,32,0.75)", border: `1px solid rgba(255,255,255,0.06)`, borderTop: `3px solid ${v.color}` }}
              onMouseEnter={() => setHovered(v.n)} onMouseLeave={() => setHovered(null)}>
              {/* CSS scanlines */}
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.012) 3px, rgba(211,84,0,0.012) 4px)" }} />

              {/* Default info */}
              <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: "2.5rem" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="diamond diamond--sm" style={{ background: v.color }} />
                    <span className="uppercase" style={{ color: v.color, fontSize: "0.9rem", letterSpacing: "0.2em" }}>
                      Standard ACT
                    </span>
                </div>
                <h3 className="font-black uppercase text-white" style={{ fontSize: "clamp(1.8rem, 3vw, 3.5rem)", lineHeight: 1.05 }}>
                  {v.title}
                </h3>
              </div>

              {/* Hover overlay — clip-path wipe from bottom */}
              <AnimatePresence>
                {hovered === v.n && (
                  <motion.div initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    transition={{ duration: 0.45, ease: [...EASE3D] }}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ background: "rgba(3,6,10,0.92)", padding: "2.5rem" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="diamond diamond--sm" style={{ background: v.color }} />
                      <span className="uppercase" style={{ color: v.color, fontSize: "0.9rem", letterSpacing: "0.2em" }}>
                        Valeur ACT
                      </span>
                    </div>
                    <h3 className="font-black uppercase text-white mb-4" style={{ fontSize: "clamp(2rem, 3.2vw, 4rem)", lineHeight: 1.05 }}>
                      {v.title}
                    </h3>
                    <div style={{ width: 32, height: 1, background: v.color, marginBottom: "1.2rem" }} />
                    <p className="text-white/68" style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.5rem)", lineHeight: 1.7 }}>
                      {v.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}



/* ══════════════════════════════════════════════════════════════════════
   SECTION 07 — L'HORIZON  (RoomSortie CTA pattern)
   ══════════════════════════════════════════════════════════════════════ */
function SectionCTA() {
  const { bgX, bgY, midX, midY, fgX, fgY, onMouseMove } = useParallax();

  return (
    <section onMouseMove={onMouseMove} className="relative overflow-hidden flex flex-col items-center justify-center text-center about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <PortalRings />
      <ParticleField count={22} />
      <AmbiantLines positions={["18%", "82%"]} />

      {/* Ambient glow */}
      <motion.div aria-hidden className="absolute pointer-events-none"
        style={{ width: "70vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.09) 0%, transparent 70%)",
          top: "50%", left: "50%", translateX: "-50%", translateY: "-50%", x: bgX, y: bgY }}
        animate={{ scale: [1, 1.22, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />

      {/* Content */}
      <motion.div className="relative z-10 w-full" style={{ x: midX, y: midY }}>
        {/* Eyebrow */}
        <motion.div className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.10 }}>
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.88rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>
            Passez à l&apos;action
          </span>
          <span className="diamond diamond--sm" />
        </motion.div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "3rem", marginBottom: "3rem" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <motion.p className="font-black uppercase leading-none"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 3.5rem)", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15, ease: [...EASE3D] }}>
              REJOIGNEZ LA
            </motion.p>
            <div style={{ perspective: "1400px" }}>
              <motion.h2 className="font-black uppercase leading-none"
                style={{ fontSize: "clamp(3.5rem, 10vw, 14rem)", letterSpacing: "-0.04em", color: "#D35400", transformOrigin: "100% 80%", lineHeight: 0.9 }}
                initial={{ scale: 0.04, opacity: 0, rotateX: 30, filter: "blur(44px) brightness(0.08)" }}
                whileInView={{ scale: 1, opacity: 1, rotateX: 0, filter: "blur(0px) brightness(1.0)" }} viewport={{ once: true }}
                transition={{ duration: 1.22, ease: [0.04, 0.72, 0.08, 1.0], delay: 0.12 }}>
                RÉVOLUTION
              </motion.h2>
            </div>
            <motion.p className="font-black uppercase leading-none"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 5rem)", letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)" }}
              initial={{ opacity: 0, scale: 0.08, rotateX: -22, filter: "blur(28px)" }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }} viewport={{ once: true }}
              transition={{ duration: 0.95, ease: [0.04, 0.72, 0.08, 1.0], delay: 0.38 }}>
              TECH
            </motion.p>
          </div>
        </div>

        <motion.p className="text-white/65 mx-auto mb-12"
          style={{ fontSize: "var(--font-20)", lineHeight: 1.7, maxWidth: "50rem" }}
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7 }}>
          Prêt à transformer vos défis en opportunités technologiques ?
          ACT accompagne entreprises et organisations dans la création de solutions technologiques innovantes et intelligentes.
        </motion.p>

        <motion.div className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0, y: 18, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }} style={{ x: fgX, y: fgY }}>
          <Magnetic>
            <Link href="/contact" className="cta-btn">
              <div className="cta-btn__border" /><div className="cta-btn__blur" />
              <div className="cta-btn__background" />
              <div className="cta-btn__inner"><span className="cta-btn__icon" /><span className="cta-btn__text">Démarrer un projet</span></div>
            </Link>
          </Magnetic>
          <Link href="/services" className="flex items-center gap-3 text-white/55 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.2rem", letterSpacing: "0.12em" }}>
            <span className="diamond diamond--sm" />Nos expertises IA
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN SHELL — Page scrollable normale avec toutes les sections
   ══════════════════════════════════════════════════════════════════════ */
export default function AboutShell() {
  return (
    <div style={{ background: "#070E1C", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      {/* ── Background layers globaux ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* Toutes les sections empilées verticalement */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionHero />
        <SectionStats />
        <SectionADN />
        <SectionValues />
        <TeamSection team={TEAM} />
        <SectionCTA />
        <FooterStrip />
      </div>
    </div>
  );
}
