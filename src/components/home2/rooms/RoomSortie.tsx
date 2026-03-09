"use client";

/**
 * Room 06 — LA SORTIE
 * CTA / exit room: magnetic button, floating particles, ambient glow.
 * Portal entry ring expands from centre on arrival.
 * Headings enter with depth-scale compression (far → near).
 * 3-layer parallax gives the horizon its infinite feel.
 */

import React, { useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import Link from "next/link";
import RoomBackground from "@/components/home2/RoomBackground";

/** Button drifts toward cursor, snaps back on leave */
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
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-hover
    >
      {children}
    </motion.div>
  );
}

const ease = [0.6, 0.08, 0.02, 0.99] as const;

/** Expanding portal ring that greets the visitor on arrival */
function PortalRing() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: "1px solid rgba(211,84,0,0.18)" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: "80vmin", height: "80vmin", opacity: 0 }}
          transition={{
            duration: 2.8,
            delay:    i * 0.55,
            repeat:   Infinity,
            ease:     "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function RoomSortie() {
  /* ── 3-layer parallax ── */
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const bgX  = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY  = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX  = useSpring(mx, { stiffness: 110, damping: 24 });
  const fgY  = useSpring(my, { stiffness: 110, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Deterministic particles */
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id:    i,
        x:     (i * 47 + 11) % 100,
        y:     (i * 67 + 23) % 100,
        size:  1.5 + (i % 2),
        dur:   4.5 + (i % 5) * 1.2,
        delay: (i % 6) * 0.8,
      })),
    []
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ width: "100%", height: "100%", padding: "4rem 6rem 10rem" }}
    >
      <RoomBackground variant="horizon" />

      {/* ── Portal rings — expanding from centre on arrival ── */}
      <PortalRing />

      {/* ── Deep BG: room label — blur-focus entry ── */}
      <motion.span
        className="block text-white/10 font-black uppercase absolute"
        style={{ fontSize: "1.1rem", letterSpacing: "0.2em", top: "6%", x: bgX, y: bgY }}
        initial={{ scale: 1.14, opacity: 0, filter: "blur(14px)" }}
        animate={{ scale: 1,    opacity: 1, filter: "blur(0px)"  }}
        transition={{ duration: 1.9, ease: [0.6, 0.08, 0.02, 0.99] }}
      >
        06 / LA SORTIE
      </motion.span>

      {/* ── Breathing ambient glow — bg layer ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width:        "70vw",
          height:       "40vw",
          background:   "radial-gradient(ellipse, rgba(211,84,0,0.09) 0%, transparent 70%)",
          borderRadius: "50%",
          top:          "50%",
          left:         "50%",
          translateX:   "-50%",
          translateY:   "-50%",
          x: bgX,
          y: bgY,
        }}
        animate={{ scale: [1, 1.22, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              width:      p.size,
              height:     p.size,
              background: "#D35400",
              boxShadow:  `0 0 ${p.size * 5}px rgba(211,84,0,0.6)`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 0.65, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Horizontal rule lines — extend from centre ── */}
      {(["18%", "82%"] as const).map((pos) => (
        <motion.div
          key={pos}
          aria-hidden
          className="absolute left-0 w-full pointer-events-none"
          style={{ height: 1, background: "rgba(255,255,255,0.04)", top: pos, originX: 0.5 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4 }}
        />
      ))}

      {/* ── Content — mid layer ── */}
      <motion.div className="relative z-10 w-full" style={{ x: midX, y: midY }}>

        {/* Eyebrow centré */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.10 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.88rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>
            Passez à l&apos;action
          </span>
          <span className="diamond diamond--sm" />
        </motion.div>

        {/* ── Split gauche/droite : 06 ← | → RÉVOLUTION TECH ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "3rem", marginBottom: "3rem" }}>

          {/* Left: "06" */}
          <motion.div
            style={{ flexShrink: 0 }}
            initial={{ x: -60, opacity: 0, filter: "blur(18px)" }}
            animate={{ x: 0,   opacity: 1, filter: "blur(0px)"  }}
            transition={{ duration: 1.1, delay: 0.04, ease: [0.04, 0.72, 0.08, 1.0] }}
          >
            <span
              aria-hidden
              className="font-black select-none"
              style={{
                fontSize:      "clamp(6rem, 14vw, 19rem)",
                color:         "rgba(211,84,0,0.20)",
                letterSpacing: "-0.04em",
                lineHeight:    1,
                display:       "block",
              }}
            >
              06
            </span>
          </motion.div>

          {/* Séparateur vertical */}
          <motion.div
            style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.35)", flexShrink: 0, originY: 0.5 }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.22 }}
          />

          {/* Right: titre empilé, aligné droite */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {/* "REJOIGNEZ LA" */}
            <motion.p
              className="font-black uppercase leading-none"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 3.5rem)", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.6, 0.08, 0.02, 0.99] }}
            >
              REJOIGNEZ LA
            </motion.p>

            {/* "RÉVOLUTION" — scale depuis l'infini */}
            <div style={{ perspective: "1400px" }}>
              <motion.h2
                className="font-black uppercase leading-none"
                style={{
                  fontSize:        "clamp(3.5rem, 10vw, 14rem)",
                  letterSpacing:   "-0.04em",
                  color:           "#D35400",
                  transformOrigin: "100% 80%",
                  lineHeight:      0.9,
                }}
                initial={{ scale: 0.04, opacity: 0, rotateX: 30, filter: "blur(44px) brightness(0.08)" }}
                animate={{ scale: 1,    opacity: 1, rotateX: 0,  filter: "blur(0px)  brightness(1.0)"  }}
                transition={{ duration: 1.22, ease: [0.04, 0.72, 0.08, 1.0], delay: 0.12 }}
              >
                RÉVOLUTION
              </motion.h2>
            </div>

            {/* "TECH" */}
            <motion.p
              className="font-black uppercase leading-none"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 5rem)", letterSpacing: "0.12em", color: "rgba(255,255,255,0.85)" }}
              initial={{ opacity: 0, scale: 0.08, rotateX: -22, filter: "blur(28px)" }}
              animate={{ opacity: 1, scale: 1,    rotateX: 0,   filter: "blur(0px)"  }}
              transition={{ duration: 0.95, ease: [0.04, 0.72, 0.08, 1.0], delay: 0.38 }}
            >
              TECH
            </motion.p>
          </div>
        </div>

        {/* Subtext */}
        <motion.p
          className="text-white/65 mx-auto mb-12"
          style={{ fontSize: "var(--font-20)", lineHeight: 1.7, maxWidth: "50rem" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Prêt à transformer vos défis en opportunités technologiques ?
          ACT est votre partenaire stratégique pour l&apos;ère de
          l&apos;Intelligence Artificielle africaine.
        </motion.p>

        {/* CTAs — foreground, last to appear */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ x: fgX, y: fgY }}
        >
          <Magnetic>
            <CTAButton href="/contact">Démarrer un projet</CTAButton>
          </Magnetic>
          <Link
            href="/services"
            className="flex items-center gap-3 text-white/55 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.2rem", letterSpacing: "0.12em" }}
          >
            <span className="diamond diamond--sm" />
            Nos expertises IA
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
