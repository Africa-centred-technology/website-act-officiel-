"use client";

/**
 * Room 01 — LE CONTINENT
 *
 * Particularité unique : les trois mots du nom éclatent depuis l'infini du Z-axis.
 * scale 0.04 → 1.0 + blur 32px → 0 + ease explosif = "big bang" typographique.
 * Chaque mot surgit 240 ms après le précédent : AFRICA → CENTRED → TECHNOLOGY.
 *
 * Éléments exclusifs à cette room :
 *  1. Arc de texte en orbite lente (SVG textPath sur cercle + Framer rotate)
 *  2. Mots qui éclatent depuis l'infini (scale 0.04 → 1, blur 32px → 0)
 *  3. Scan-line horizontale orange qui traverse la room toutes les ~10 s
 *  4. Sun pulse radial orange animé derrière le titre
 *  5. 3-layer parallax + RoomBackground savane (Ken Burns)
 */

import React, { useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";
import RoomBackground from "@/components/home2/RoomBackground";

const BURST = [0.04, 0.72, 0.08, 1.0] as const;
const EASE3D = [0.6, 0.08, 0.02, 0.99] as const;

/* ── Arc de texte en orbite (SVG textPath) ──────────────────────────── */
function OrbitArc() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 90, ease: "linear", repeat: Infinity }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <defs>
          <path
            id="orbitPath01"
            d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text
          style={{
            fontSize:      "3.0",
            fill:          "rgba(255,255,255,0.07)",
            fontWeight:    900,
            letterSpacing: "1.2",
            textTransform: "uppercase",
            fontFamily:    "inherit",
          }}
        >
          <textPath href="#orbitPath01">
            {"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}
            {"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}

/* ── Scan-line horizontale orange (toutes les ~10 s) ────────────────── */
function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 w-full pointer-events-none"
      style={{
        height:     "2px",
        background:
          "linear-gradient(to right, transparent 0%, rgba(211,84,0,0.50) 25%, rgba(255,130,30,0.90) 50%, rgba(211,84,0,0.50) 75%, transparent 100%)",
        boxShadow:  "0 0 28px 5px rgba(211,84,0,0.28)",
        zIndex:     4,
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["−4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration:    2.6,
        ease:        "easeInOut",
        repeat:      Infinity,
        repeatDelay: 8.5,
        times:       [0, 0.06, 0.92, 1],
      }}
    />
  );
}

/* ── Char-split 3D reveal — 3 signatures distinctes ─────────────── */
type CharFx = "rollIn" | "burstOut" | "riseUp";

function WordChars({
  text, delay = 0, color = "#ffffff", indent = "0%", mt,
  fx, stagger = 0.033,
  size = "clamp(4.2rem, 10.5vw, 13.5rem)",
}: {
  text: string; delay?: number; color?: string;
  indent?: string; mt?: string; fx: CharFx; stagger?: number;
  size?: string;
}) {
  const chars = text.split("");
  const mid   = Math.floor(chars.length / 2);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginLeft: indent, marginTop: mt }}>
      {chars.map((ch, i) => {
        const ord       = fx === "burstOut" ? Math.abs(i - mid) : i;
        const charDelay = delay + ord * stagger;

        const initial =
          fx === "rollIn"
            ? { y: "-108%", opacity: 0, filter: "blur(4px)" }
            : fx === "burstOut"
            ? { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" }
            : { y: "108%",  opacity: 0 };

        const target =
          fx === "rollIn"
            ? { y: "0%",  opacity: 1, filter: "blur(0px)" }
            : fx === "burstOut"
            ? { scale: 1, opacity: 1, filter: "blur(0px) brightness(1.0)" }
            : { y: "0%", opacity: 1 };

        const inner = (
          <motion.span
            className="font-black uppercase"
            style={{
              display:       "inline-block",
              color,
              fontSize:      size,
              lineHeight:    1,
              letterSpacing: "-0.03em",
            }}
            initial={initial}
            animate={target}
            transition={{
              duration: fx === "burstOut" ? 1.1 : 0.74,
              delay:    charDelay,
              ease:     [...BURST],
            }}
          >
            {ch}
          </motion.span>
        );

        return fx !== "burstOut" ? (
          <div key={i} style={{ overflow: "hidden" }}>{inner}</div>
        ) : (
          <div key={i}>{inner}</div>
        );
      })}
    </div>
  );
}

/* ── Room ────────────────────────────────────────────────────────────── */
export default function RoomEntree() {
  /* 3-layer parallax */
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const bgX  = useSpring(mx, { stiffness: 22, damping: 18 });
  const bgY  = useSpring(my, { stiffness: 22, damping: 18 });
  const midX = useSpring(mx, { stiffness: 55, damping: 22 });
  const midY = useSpring(my, { stiffness: 55, damping: 22 });
  const fgX  = useSpring(mx, { stiffness: 105, damping: 24 });
  const fgY  = useSpring(my, { stiffness: 105, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Particules flottantes déterministes */
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id:    i,
        x:     (i * 53 + 7)  % 100,
        y:     (i * 71 + 19) % 100,
        size:  1.1 + (i % 3) * 0.65,
        dur:   4.8 + (i % 5) * 1.2,
        delay: (i % 7) * 0.55,
      })),
    []
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative overflow-hidden flex flex-col justify-center"
      style={{ width: "100%", height: "100%", padding: "4rem 5.5rem 10rem" }}
    >
      {/* ── Photo savane + Ken Burns ── */}
      <RoomBackground variant="continent" />

      {/* ── Arc de texte en orbite ── */}
      <OrbitArc />

      {/* ── Scan-line horizontale ── */}
      <ScanLine />

      {/* ── Grand "01" en arrière-plan profond ── */}
      <motion.div
        aria-hidden
        className="absolute select-none pointer-events-none font-black"
        style={{
          right:         "-1%",
          top:           "2%",
          fontSize:      "clamp(12rem, 22vw, 28rem)",
          lineHeight:    1,
          color:         "rgba(211,84,0,0.05)",
          letterSpacing: "-0.04em",
          x:             bgX,
          y:             bgY,
          zIndex:        0,
        }}
        initial={{ scale: 1.22, opacity: 0, filter: "blur(22px)" }}
        animate={{ scale: 1,    opacity: 1, filter: "blur(0px)"  }}
        transition={{ duration: 2.0, ease: [...EASE3D] }}
      >
        01
      </motion.div>

      {/* ── Sun pulse radial orange ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width:        "85vw",
          height:       "52vw",
          background:   "radial-gradient(ellipse, rgba(211,84,0,0.14) 0%, rgba(211,84,0,0.05) 45%, transparent 72%)",
          borderRadius: "50%",
          top:          "50%",
          left:         "48%",
          translateX:   "-50%",
          translateY:   "-50%",
          x:            bgX,
          y:            bgY,
          zIndex:       0,
        }}
        animate={{ scale: [1, 1.40, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Particules montantes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 1 }}>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              width:      p.size,
              height:     p.size,
              background: "#D35400",
              boxShadow:  `0 0 ${p.size * 6}px rgba(211,84,0,0.55)`,
            }}
            animate={{ y: [0, -42, 0], opacity: [0, 0.58, 0] }}
            transition={{
              duration: p.dur,
              repeat:   Infinity,
              delay:    p.delay,
              ease:     "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Lignes horizontales d'ambiance ── */}
      {(["14%", "84%"] as const).map(pos => (
        <motion.div
          key={pos}
          aria-hidden
          className="absolute left-0 w-full pointer-events-none"
          style={{
            height:     1,
            background: "rgba(255,255,255,0.05)",
            top:        pos,
            originX:    0.5,
            zIndex:     1,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.7 }}
        />
      ))}

      {/* ── Contenu — mid layer ── */}
      <motion.div className="relative" style={{ x: midX, y: midY, zIndex: 2 }}>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.60, delay: 0.04 }}
        >
          <span className="diamond diamond--sm" />
          <span
            className="text-white/40 uppercase tracking-[0.32em]"
            style={{ fontSize: "1.05rem" }}
          >
            Vue Satellite — Afrique
          </span>
          <span
            className="hidden md:block text-white/10 font-black uppercase ml-auto"
            style={{ fontSize: "1.05rem", letterSpacing: "0.2em" }}
          >
            01 / LE CONTINENT
          </span>
        </motion.div>

        {/* ── Split gauche/droite : 01 ← | → AFRICA / CENTRED / TECHNOLOGY ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>

          {/* Left — "01" : ancre orange ghost, entre de gauche */}
          <motion.div
            style={{ flexShrink: 0 }}
            initial={{ x: -60, opacity: 0, filter: "blur(18px)" }}
            animate={{ x: 0,   opacity: 1, filter: "blur(0px)"  }}
            transition={{ duration: 1.1, delay: 0.04, ease: [...BURST] }}
          >
            <span
              aria-hidden
              className="font-black select-none"
              style={{
                fontSize:      "clamp(7rem, 16vw, 22rem)",
                color:         "rgba(211,84,0,0.22)",
                letterSpacing: "-0.04em",
                lineHeight:    1,
                display:       "block",
              }}
            >
              01
            </span>
          </motion.div>

          {/* Séparateur vertical — grandit depuis le centre */}
          <motion.div
            style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.35)", flexShrink: 0, originY: 0.5 }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.22 }}
          />

          {/* Right — mots empilés, alignés à droite, perspective 3D */}
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
            <WordChars text="AFRICA"     delay={0.10} fx="rollIn"   stagger={0.040} size="clamp(3rem, 7.5vw, 10.5rem)" />
            <WordChars text="CENTRED"    delay={0.30} fx="burstOut" color="#D35400" stagger={0.044} mt="0.15em" size="clamp(1.8rem, 3.5vw, 5rem)" />
            <WordChars text="TECHNOLOGY" delay={0.52} fx="riseUp"   stagger={0.020} mt="0.10em"    size="clamp(2.8rem, 7vw, 9.5rem)" />
          </div>

        </div>

        {/* Règle orange */}
        <motion.div
          style={{ height: 1, background: "rgba(211,84,0,0.55)", originX: 0, marginTop: "2.8rem", marginBottom: "2rem" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [...EASE3D] }}
        />

        {/* Sous-titre */}
        <motion.p
          className="text-white/60"
          style={{ fontSize: "var(--font-20)", lineHeight: 1.72, maxWidth: "44rem" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.65 }}
        >
          Votre partenaire stratégique pour l&apos;ère de l&apos;Intelligence Artificielle
          africaine — où la technologie rencontre le continent.
        </motion.p>

        {/* CTAs — foreground layer */}
        <motion.div
          className="flex flex-wrap items-center gap-8 mt-10"
          style={{ x: fgX, y: fgY }}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ delay: 1.15, duration: 0.60 }}
        >
          <CTAButton href="/contact">Démarrer un projet</CTAButton>
          <Link
            href="/services"
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.15rem", letterSpacing: "0.12em" }}
          >
            <span className="diamond diamond--sm" />
            Nos expertises
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
