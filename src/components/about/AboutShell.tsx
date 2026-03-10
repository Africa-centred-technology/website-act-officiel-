"use client";

import React, {
  useEffect, useState, useMemo, useRef, useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useInView,
} from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import RoomBackground from "@/components/home2/RoomBackground";
import LogoPhase from "@/components/services/LogoPhase";

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
  "La technologie n'a de valeur que lorsqu'elle crée un impact réel. Nous ne nous contentons pas d'implémenter des technologies. Nous concevons des solutions qui créent de la valeur durable pour les organisations. En combinant intelligence artificielle, analyse de données et automatisation, nous aidons les entreprises à transformer leurs défis en opportunités et à construire les systèmes qui soutiendront leur croissance de demain.";

const VALUES = [
  { n: "01", title: "Innovation",    color: "#D35400",
    desc: "Nous repoussons constamment les limites pour créer des solutions avant-gardistes qui anticipent les besoins de demain." },
  { n: "02", title: "Excellence",    color: "#F39C12",
    desc: "Chaque projet bénéficie de notre engagement indéfectible envers la qualité et les standards les plus élevés de l'industrie." },
  { n: "03", title: "Impact Global", color: "#2C4A35",
    desc: "Nous connectons l'Afrique au monde en exportant l'innovation africaine à l'échelle internationale." },
  { n: "04", title: "Intégrité",     color: "#D35400",
    desc: "Transparence, honnêteté et éthique guident chacune de nos interactions, construisant des partenariats durables." },
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

const TEAM = [
  { name: "SOHAIB BAROUD",           role: "Fondateur & CEO",  img: "/Sohaid.png",
    bio: "Visionnaire et leader de l'ingénierie technologique en Afrique. Sohaib a fondé ACT avec la mission de transformer les entreprises africaines en leaders technologiques mondiaux." },
  { name: "MPIGA-ODOUMBA JESSE",     role: "Membre fondateur", img: "/MPIGA.png",
    bio: "Co-créateur d'ACT, engagé pour l'innovation africaine et l'impact technologique à l'échelle continentale." },
  { name: "A. B. DJOUROBI OMANDA",   role: "Membre fondateur", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    bio: "Co-créateur d'ACT, porté par l'ingénierie de pointe et la croissance des startups africaines." },
  { name: "ELVIS-THEO AKIEME OYONO", role: "Membre fondateur", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Co-créateur d'ACT, passionné par les solutions IA et l'excellence produit au service du continent." },
];

/* Photo entry vectors (same as RoomGalerie) */
const PHOTO_ENTRY = [
  { x: "-18%", y: "8%",  scale: 0.80, blur: 10, delay: 0.05 },
  { x:  "18%", y: "8%",  scale: 0.82, blur: 8,  delay: 0.18 },
  { x: "-10%", y: "14%", scale: 0.87, blur: 5,  delay: 0.30 },
  { x:  "10%", y: "14%", scale: 0.92, blur: 3,  delay: 0.42 },
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
      <RoomBackground variant="about-histoire" />
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
            <textPath href="#op01">{"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}{" ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}</textPath>
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
            Africa Centred Technology · Fondée en 2023
          </span>
        </motion.div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
            {[
              { word: "NOTRE",   color: "#ffffff",  size: "clamp(3.5rem, 8vw, 11rem)", fx: "rollIn",   delay: 0.10, stagger: 0.040 },
              { word: "HISTOIRE",color: "#D35400",  size: "clamp(2rem,  4.5vw, 6.5rem)", fx: "burstOut", delay: 0.30, stagger: 0.032 },
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
        <motion.p className="text-white/60" style={{ fontSize: "var(--font-20)", lineHeight: 1.72, maxWidth: "44rem" }}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.65 }}>
          Depuis 2023, nous accompagnons les entreprises africaines pour en faire
          des leaders technologiques mondiaux — avec l&apos;énergie d&apos;une startup et
          une compréhension profonde du continent.
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
          <a href="#parcours" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.15rem", letterSpacing: "0.12em" }}>
            <span className="diamond diamond--sm" />Notre parcours
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
      <RoomBackground variant="about-chiffres" />
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
      <RoomBackground variant="about-adn" />
      <ScanLine />
      <AmbiantLines positions={["12%", "88%"]} />

      <SectionHeader eyebrow="Notre ADN · Notre Mission" title="NOTRE ADN" midX={midX} midY={midY} />
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
      <RoomBackground variant="about-valeurs" />
      <ScanLine />

      <SectionHeader eyebrow="Ce qui nous anime" title="NOS VALEURS" midX={midX} midY={midY} />
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
                    Valeur ACT
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
   SECTION 05 — NOTRE PARCOURS  (musée / timeline)
   ══════════════════════════════════════════════════════════════════════ */
function SectionTimeline() {
  const { bgX, bgY, midX, midY, onMouseMove } = useParallax();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="parcours" onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh" }}>
      <RoomBackground variant="about-parcours" />
      <ScanLine />
      <AmbiantLines positions={["10%", "90%"]} />

      <SectionHeader eyebrow="Notre parcours · 2023–2026" title="LE PARCOURS" midX={midX} midY={midY} />
      <OrangeRule />

      {/* Timeline — accordion accordion style (expand on hover/click) */}
      <div className="flex-1 flex flex-col gap-2" style={{ minHeight: 0 }}>
        {TIMELINE.map((item, i) => (
          <motion.div key={item.year}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.06 * i, duration: 0.7, ease: [...EASE3D] }}
            onClick={() => setActive(active === item.year ? null : item.year)}
            className="relative overflow-hidden cursor-pointer flex-1"
            style={{ minHeight: active === item.year ? "auto" : "auto",
              background: "rgba(8,18,32,0.72)", border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: `3px solid ${item.color}`,
              transition: "flex 0.6s cubic-bezier(0.6,0.08,0.02,0.99)" }}>
            {/* Scanner */}
            <motion.div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%",
              background: `linear-gradient(to right, transparent, ${item.color}, transparent)`,
              boxShadow: `0 0 18px ${item.color}88` }}
              animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: i * 0.6 }} />

            <div className="flex items-center gap-6" style={{ padding: "2rem 3rem" }}>
              {/* Year */}
              <motion.span className="font-black select-none flex-shrink-0"
                style={{ fontSize: "clamp(3rem, 5vw, 7rem)", color: item.color, lineHeight: 1,
                  opacity: active === item.year ? 1 : 0.35, transition: "opacity 0.4s" }}>
                {item.year}
              </motion.span>

              {/* Separator */}
              <div style={{ width: 1, height: "3rem", background: `${item.color}44`, flexShrink: 0 }} />

              {/* Title */}
              <div style={{ flex: 1 }}>
                <span className="font-black uppercase text-white" style={{ fontSize: "clamp(1.5rem, 2.5vw, 3rem)", letterSpacing: "0.06em" }}>
                  {item.title}
                </span>
                <AnimatePresence>
                  {active === item.year && (
                    <motion.p initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-white/60" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.6rem)", lineHeight: 1.7, marginTop: "0.8rem" }}>
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Arrow indicator */}
              <motion.div animate={{ rotate: active === item.year ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "1.4rem", height: "1.4rem", background: item.color, transform: "rotate(-43deg)", flexShrink: 0 }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION 06 — L'ÉQUIPE  (RoomGalerie photo-grid pattern)
   ══════════════════════════════════════════════════════════════════════ */
function SectionTeam() {
  const { bgX, bgY, midX, midY, onMouseMove } = useParallax();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="equipe" onMouseMove={onMouseMove} className="relative flex flex-col overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh" }}>
      {/* Dark textured bg (no photo bg — team photos would clash) */}
      <div className="absolute inset-0" style={{ background: "#070E1C", zIndex: 0 }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
        background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(211,84,0,0.09) 0%, transparent 65%)" }} />
      {/* Mashrabiya-style canvas pattern */}
      <MashrabiyaCanvas />
      <ScanLine />
      <ParticleField count={14} />
      <AmbiantLines positions={["8%", "92%"]} />

      <div className="relative" style={{ zIndex: 2 }}>
        <SectionHeader eyebrow="Les fondateurs ACT" title="L'ÉQUIPE" midX={midX} midY={midY} />
        <OrangeRule />
      </div>

      {/* 2×2 photo grid — each from its corner like RoomGalerie */}
      <div className="about-2col-grid flex-1 relative" style={{ minHeight: "60vh", zIndex: 2 }}>
        {TEAM.map((member, i) => {
          const entry = PHOTO_ENTRY[i];
          return (
            <motion.div key={member.name}
              initial={{ opacity: 0, x: entry.x, y: entry.y, scale: entry.scale, filter: `blur(${entry.blur}px)` }}
              whileInView={{ opacity: 1, x: "0%", y: "0%", scale: 1, filter: "blur(0px)" }} viewport={{ once: true }}
              transition={{ duration: 0.85, delay: entry.delay, ease: [...EASE3D] }}
              className="relative overflow-hidden"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <Image src={member.img} alt={member.name} fill sizes="(max-width: 1400px) 50vw, 700px"
                className="object-cover object-center"
                style={{ transition: "transform 0.75s ease", transform: hovered === i ? "scale(1.07)" : "scale(1.0)" }} />
              <div aria-hidden className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(3,6,10,0.94) 0%, rgba(3,6,10,0.22) 60%, transparent 100%)" }} />

              {/* Default info bar */}
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "1.8rem 2.2rem" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="block text-white/28 uppercase" style={{ fontSize: "0.85rem", letterSpacing: "0.22em", marginBottom: "0.3rem" }}>
                      {member.role}
                    </span>
                    <h3 className="font-black uppercase text-white" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.9rem)", lineHeight: 1.1 }}>
                      {member.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Hover overlay — clip-path wipe */}
              <AnimatePresence>
                {hovered === i && (
                  <motion.div initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    transition={{ duration: 0.45, ease: [...EASE3D] }}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ background: "rgba(3,6,10,0.88)", padding: "2.2rem" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="diamond diamond--sm" />
                      <span className="text-[#D35400] uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.2em" }}>
                        {member.role}
                      </span>
                    </div>
                    <h3 className="font-black uppercase text-white mb-3" style={{ fontSize: "clamp(1.3rem, 2.2vw, 2.3rem)", lineHeight: 1.05 }}>
                      {member.name}
                    </h3>
                    <div style={{ width: 28, height: 1, background: "#D35400", marginBottom: "1rem" }} />
                    <p className="text-white/68" style={{ fontSize: "clamp(1rem, 1.3vw, 1.4rem)", lineHeight: 1.68 }}>
                      {member.bio}
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

/** Mashrabiya CSS canvas (client-only) */
function MashrabiyaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cell = 44;
      ctx.strokeStyle = "rgba(211,84,0,0.045)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < H + cell; y += cell) {
        for (let x = 0; x < W + cell; x += cell) {
          const d = cell * 0.32;
          ctx.beginPath(); ctx.moveTo(x, y - d); ctx.lineTo(x + d, y); ctx.lineTo(x, y + d); ctx.lineTo(x - d, y); ctx.closePath(); ctx.stroke();
        }
      }
      const gA = 0.10 + Math.sin(t * 0.32) * 0.04;
      const g = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.5);
      g.addColorStop(0, `rgba(211,84,0,${gA})`); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };
    const loop = () => { t += 0.016; draw(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0" style={{ width: "100%", height: "100%", zIndex: 1 }} />;
}

/* ── Footer strip partagé avec RoomSortie ───────────────────────── */
const ABOUT_NAV_LINKS = [
  { href: "/",         label: "Accueil"     },
  { href: "/services", label: "Services"    },
  { href: "/projects", label: "Réalisations"},
  { href: "/blog",     label: "Blog"        },
  { href: "/contact",  label: "Contact"     },
];

const ABOUT_SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@AfricaCentredTechnology",                                           label: "YouTube"   },
  { Icon: Facebook,  href: "https://web.facebook.com/profile.php?id=61585541019830",                                    label: "Facebook"  },
];

function FooterStrip() {
  return (
    <motion.div
      aria-label="Footer"
      className="absolute left-0 right-0 pointer-events-auto"
      style={{ bottom: "5rem", zIndex: 10, padding: "0 clamp(2rem, 5vw, 6rem)" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.0, duration: 0.7 }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem", marginBottom: "2.8rem" }}>

        {/* Col 1 — Contact */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href="mailto:contact@act.africa"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Mail size={18} strokeWidth={1.6} />contact@act.africa
            </a>
            <a href="tel:+212694528498"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Phone size={18} strokeWidth={1.6} />+212 694-528498
            </a>
            <span className="flex items-center gap-3 text-white/35" style={{ fontSize: "1.15rem" }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Réseaux Sociaux */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Réseaux Sociaux</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {ABOUT_SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 hover:text-[#D35400] transition-colors"
                style={{ fontSize: "1.15rem" }}>
                <Icon size={20} strokeWidth={1.5} />{label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3 — Carrières + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.2rem" }}>Carrières</p>
            <p className="text-white/45" style={{ fontSize: "1.1rem", lineHeight: 1.55, marginBottom: "0.9rem", maxWidth: "240px" }}>
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
            </p>
            <Link href="/careers"
              className="text-[#D35400] hover:text-[#F39C12] transition-colors uppercase"
              style={{ fontSize: "1rem", letterSpacing: "0.08em" }}>
              Postuler maintenant →
            </Link>
          </div>
          <Link href="/contact" className="cta-btn" style={{ marginTop: "0.4rem" }}>
            <div className="cta-btn__border" /><div className="cta-btn__blur" />
            <div className="cta-btn__background" />
            <div className="cta-btn__inner"><span className="cta-btn__icon" /><span className="cta-btn__text">Un projet en tête ?</span></div>
          </Link>
        </div>

      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.2rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
        <span className="text-white/40 uppercase" style={{ fontSize: "0.92rem", letterSpacing: "0.08em" }}>
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/privacy" className="text-white/40 hover:text-white/70 transition-colors uppercase" style={{ fontSize: "0.92rem" }}>
            Politique de Confidentialité
          </Link>
          <span className="text-white/25">/</span>
          <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors uppercase" style={{ fontSize: "0.92rem" }}>
            CGU
          </Link>
        </div>
      </div>

    </motion.div>
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
      <RoomBackground variant="about-cta" />
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

      {/* ── Footer strip ── */}
      <FooterStrip />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOMS — liste des sections About (même pattern que Shell.tsx home)
   ══════════════════════════════════════════════════════════════════════ */
const ABOUT_ROOMS = [
  { id: "histoire", label: "NOTRE HISTOIRE", number: "01", Component: SectionHero     },
  { id: "chiffres", label: "NOS CHIFFRES",   number: "02", Component: SectionStats    },
  { id: "adn",      label: "NOTRE ADN",       number: "03", Component: SectionADN     },
  { id: "valeurs",  label: "NOS VALEURS",     number: "04", Component: SectionValues  },
  { id: "parcours", label: "LE PARCOURS",     number: "05", Component: SectionTimeline},
  { id: "equipe",   label: "L'ÉQUIPE",        number: "06", Component: SectionTeam    },
  { id: "horizon",  label: "L'HORIZON",       number: "07", Component: SectionCTA     },
];

const THROTTLE_MS = 1300;

/* ── Navigation basse (calquée sur SpatialNav) ──────────────────── */
function AboutNav({
  rooms, current, onGoTo,
}: { rooms: typeof ABOUT_ROOMS; current: number; onGoTo: (i: number) => void }) {
  const total = rooms.length;
  return (
    <div className="fixed bottom-0 left-0 w-full" style={{ zIndex: 50, pointerEvents: "none" }}>
      {/* Barre de progression */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: "2rem", position: "relative" }}>
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "#D35400", originX: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 24 }}
        />
      </div>
      {/* Rangée : spacer | points | flèches */}
      <div className="flex items-end justify-between"
        style={{ padding: "0 clamp(1.5rem, 4vw, 5rem) 2.5rem" }}>
        <div style={{ minWidth: "clamp(8rem, 25vw, 14rem)" }} />

        {/* Points centrés */}
        <div className="flex items-center gap-2"
          style={{ position: "absolute", left: "50%", bottom: "3.2rem", transform: "translateX(-50%)", pointerEvents: "auto" }}>
          {rooms.map((r, i) => (
            <button key={r.id} onClick={() => onGoTo(i)} aria-label={r.label}
              style={{ padding: "10px 6px", background: "none", border: "none" }}>
              <motion.div
                animate={{ width: i === current ? 28 : 5, background: i === current ? "#D35400" : "rgba(255,255,255,0.15)" }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                style={{ height: 4, borderRadius: 99 }}
              />
            </button>
          ))}
        </div>

        {/* Flèches */}
        <div className="flex items-center gap-1" style={{ pointerEvents: "auto" }}>
          <button onClick={() => onGoTo(current - 1)} disabled={current === 0}
            style={{ background: "none", border: "none", padding: "12px 16px", fontSize: "1.5rem",
              fontWeight: 900, lineHeight: 1, transition: "color 0.2s",
              color: current === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)" }}>←</button>
          <button onClick={() => onGoTo(current + 1)} disabled={current === total - 1}
            style={{ background: "none", border: "none", padding: "12px 16px", fontSize: "1.5rem",
              fontWeight: 900, lineHeight: 1, transition: "color 0.2s",
              color: current === total - 1 ? "rgba(255,255,255,0.1)" : "#D35400" }}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN SHELL — rooms fullscreen avec navigation roue / clavier / touch
   ══════════════════════════════════════════════════════════════════════ */
export default function AboutShell() {
  const [current, setCurrent]     = useState(0);
  const [portalDone, setPortalDone] = useState(false);
  const throttleRef  = useRef(false);
  const currentRef   = useRef(0);
  const touchStartY  = useRef(0);
  const total        = ABOUT_ROOMS.length;

  const goTo = useCallback((i: number) => {
    if (throttleRef.current) return;
    const clamped = Math.max(0, Math.min(total - 1, i));
    if (clamped === currentRef.current) return;
    throttleRef.current = true;
    currentRef.current  = clamped;
    setCurrent(clamped);
    setTimeout(() => { throttleRef.current = false; }, THROTTLE_MS);
  }, [total]);

  /* Roue souris */
  useEffect(() => {
    if (!portalDone) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      goTo(currentRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [portalDone, goTo]);

  /* Clavier */
  useEffect(() => {
    if (!portalDone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(currentRef.current + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   goTo(currentRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [portalDone, goTo]);

  /* Touch swipe */
  useEffect(() => {
    if (!portalDone) return;
    const onStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onEnd   = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) goTo(currentRef.current + (diff > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [portalDone, goTo]);

  return (
    <>
      {/* Intro LogoPhase */}
      <AnimatePresence>
        {!portalDone && (
          <motion.div key="logo-intro"
            style={{ position: "fixed", inset: 0, background: "#070E1C", zIndex: 9998 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}>
            <LogoPhase onDone={() => setPortalDone(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {portalDone && (
        <>
          {/* Conteneur rooms fullscreen */}
          <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#070E1C" }}>
            <AnimatePresence mode="wait">
              {ABOUT_ROOMS.map((room, i) => i === current && (
                <motion.div key={room.id}
                  style={{ position: "absolute", inset: 0 }}
                  initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1,    filter: "blur(0px)" }}
                  exit={{    opacity: 0, scale: 0.97,  filter: "blur(5px)" }}
                  transition={{ duration: 0.62, ease: [0.6, 0.08, 0.02, 0.99] }}>
                  <room.Component />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation basse */}
          <AboutNav rooms={ABOUT_ROOMS} current={current} onGoTo={goTo} />
        </>
      )}
    </>
  );
}
