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

const BURST = [0.04, 0.72, 0.08, 1.0] as const;

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
            fontSize: "3.0",
            fill: "rgba(255,255,255,0.07)",
            fontWeight: 900,
            letterSpacing: "1.2",
            textTransform: "uppercase",
            fontFamily: "inherit",
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
        height: "2px",
        background:
          "linear-gradient(to right, transparent 0%, rgba(211,84,0,0.50) 25%, rgba(255,130,30,0.90) 50%, rgba(211,84,0,0.50) 75%, transparent 100%)",
        boxShadow: "0 0 28px 5px rgba(211,84,0,0.28)",
        zIndex: 4,
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["−4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 8.5,
        times: [0, 0.06, 0.92, 1],
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
  const mid = Math.floor(chars.length / 2);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginLeft: indent, marginTop: mt }}>
      {chars.map((ch, i) => {
        const ord = fx === "burstOut" ? Math.abs(i - mid) : i;
        const charDelay = delay + ord * stagger;

        const initial =
          fx === "rollIn"
            ? { y: "-108%", opacity: 0, filter: "blur(4px)" }
            : fx === "burstOut"
              ? { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" }
              : { y: "108%", opacity: 0 };

        const target =
          fx === "rollIn"
            ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : fx === "burstOut"
              ? { scale: 1, opacity: 1, filter: "blur(0px) brightness(1.0)" }
              : { y: "0%", opacity: 1 };

        const inner = (
          <motion.span
            className="font-black uppercase"
            style={{
              display: "inline-block",
              color,
              fontSize: size,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textShadow: "0px 12px 40px rgba(0,0,0,0.6)",
              fontFamily: "var(--font-display)",
            }}
            initial={initial}
            animate={target}
            transition={{
              duration: fx === "burstOut" ? 1.1 : 0.74,
              delay: charDelay,
              ease: [...BURST],
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
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 22, damping: 18 });
  const bgY = useSpring(my, { stiffness: 22, damping: 18 });
  const midX = useSpring(mx, { stiffness: 55, damping: 22 });
  const midY = useSpring(my, { stiffness: 55, damping: 22 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Particules flottantes déterministes */
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (i * 53 + 7) % 100,
        y: (i * 71 + 19) % 100,
        size: 1.1 + (i % 3) * 0.65,
        dur: 4.8 + (i % 5) * 1.2,
        delay: (i % 7) * 0.55,
      })),
    []
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative overflow-hidden flex flex-col justify-center room-pad"
      style={{ width: "100%", height: "100%" }}
    >

      {/* ── Arc de texte en orbite ── */}
      <OrbitArc />

      {/* ── Scan-line horizontale ── */}
      <ScanLine />


      {/* ── Sun pulse radial orange ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "85vw",
          height: "52vw",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.14) 0%, rgba(211,84,0,0.05) 45%, transparent 72%)",
          borderRadius: "50%",
          top: "50%",
          left: "48%",
          translateX: "-50%",
          translateY: "-50%",
          x: bgX,
          y: bgY,
          zIndex: 0,
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
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: "#D35400",
              boxShadow: `0 0 ${p.size * 6}px rgba(211,84,0,0.55)`,
            }}
            animate={{ y: [0, -42, 0], opacity: [0, 0.58, 0] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
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
            height: 1,
            background: "rgba(255,255,255,0.05)",
            top: pos,
            originX: 0.5,
            zIndex: 1,
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
        </motion.div>

        {/* ── Split gauche/droite : Logo ← | → AFRICA / CENTRED / TECHNOLOGY ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "4rem", justifyContent: "space-between", width: "100%" }}>

          {/* Left — Logo Continent */}
          <motion.div
            layoutId="logo-continent"
            style={{ x: bgX, y: bgY, flexShrink: 0, zIndex: 10 }}
            initial={{ opacity: 0, scale: 0.7, x: -80, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            exit={{ scale: 0.2, x: 400, y: 400, opacity: 0, rotate: 10 }}
            transition={{ duration: 1.8, delay: 0.1, ease: BURST }}
          >
            <img
              src="/logo/logo_continent.png"
              alt="Africa Continent Logo"
              style={{
                width: "clamp(30rem, 65vw, 75rem)",
                height: "auto",
                filter: "drop-shadow(0 40px 100px rgba(211,84,0,0.35)) brightness(1.1)",
                opacity: 0.99,
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </motion.div>


          {/* Right — mots empilés, alignés à droite, perspective 3D */}
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
            <WordChars text="AFRICA" delay={0.10} fx="rollIn" stagger={0.040} size="clamp(4rem, 9vw, 13rem)" />
            <WordChars text="CENTRED" delay={0.30} fx="burstOut" color="#FF6B00" stagger={0.044} mt="0.15em" size="clamp(2.5rem, 5vw, 7rem)" />
            <WordChars text="TECHNOLOGY" delay={0.52} fx="riseUp" stagger={0.020} mt="0.10em" size="clamp(3.5rem, 8vw, 11.5rem)" />

            <motion.p
              style={{
                marginTop: "2.5rem",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontSize: "clamp(0.75rem, 1.5vw, 1.15rem)",
                textShadow: "0px 4px 15px rgba(0,0,0,0.5)",
                fontFamily: "var(--font-body)",
                textAlign: "right",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {"Innovating Today, Transforming Tomorrow".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.05, duration: 0 }}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              {/* Le curseur clignotant de la machine à écrire */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  delay: 1.4,
                  duration: 0.8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "clamp(0.75rem, 1.5vw, 1.15rem)",
                  backgroundColor: "#D35400",
                  marginLeft: "8px",
                  verticalAlign: "middle"
                }}
              />
            </motion.p>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
