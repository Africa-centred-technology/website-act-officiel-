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
import FooterRoomSortie from "@/components/layout/FooterRoomSortie";

const NAV_LINKS = [
  { href: "/about", label: "À Propos" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Réalisations" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/** Button drifts toward cursor, snaps back on leave */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.32);
    y.set((e.clientY - r.top - r.height / 2) * 0.32);
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
            delay: i * 0.55,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function RoomSortie() {
  /* ── 3-layer parallax ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX = useSpring(mx, { stiffness: 110, damping: 24 });
  const fgY = useSpring(my, { stiffness: 110, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Deterministic particles - more variety */
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: (i * 47 + 11) % 100,
        y: (i * 67 + 23) % 100,
        size: 1 + (i % 4) * 0.5,
        dur: 3.5 + (i % 7) * 1.5,
        delay: (i % 8) * 0.6,
        opacity: 0.4 + (i % 3) * 0.2,
      })),
    []
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className="room-container relative flex flex-col items-center justify-center text-center room-pad w-full min-h-screen md:h-full"
    >


      {/* ── Portal rings — expanding from centre on arrival ── */}
      <PortalRing />



      {/* ── Breathing ambient glow — bg layer ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "70vw",
          height: "40vw",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.12) 0%, rgba(211,84,0,0.05) 40%, transparent 70%)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          x: bgX,
          y: bgY,
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Secondary glow — adds depth ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 60%)",
          borderRadius: "50%",
          top: "30%",
          left: "30%",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating particles — enhanced with variety ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.id % 2 === 0 ? "#D35400" : "#FF8C00",
              boxShadow: `0 0 ${p.size * 6}px ${p.id % 2 === 0 ? 'rgba(211,84,0,0.7)' : 'rgba(255,140,0,0.5)'}`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, (p.id % 3 - 1) * 15, 0],
              opacity: [0, p.opacity, 0],
              scale: [0.8, 1, 0.8]
            }}
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
          className="flex items-center justify-center gap-3 mb-10 w-full"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.10 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.88rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>
            L&apos;Horizon
          </span>
          <span className="diamond diamond--sm" />
        </motion.div>

        {/* ── Split gauche/droite : Logo ← | → Contenu ── */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-between w-full md:translate-y-[-8vh]">

          {/* Left — Logo Continent */}
          <motion.div
            layoutId="logo-continent"
            style={{ x: bgX, y: bgY, flexShrink: 0, zIndex: 10, paddingLeft: "clamp(2rem, 5vw, 6rem)" }}
            initial={{ opacity: 0, scale: 0.7, x: -80, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            exit={{ scale: 0.2, x: 400, y: 400, opacity: 0, rotate: 10 }}
            transition={{ duration: 1.8, delay: 0.1, ease: [0.04, 0.72, 0.08, 1.0] }}
          >
            <Link href="/">
              <img
                src="/logo/logo_continent.png"
                alt="ACT - Africa Centred Technology"
                style={{
                  width: "clamp(30rem, 65vw, 75rem)",
                  height: "auto",
                  filter: "drop-shadow(0 40px 100px rgba(211,84,0,0.35)) brightness(1.1)",
                  opacity: 0.99,
                  pointerEvents: "none",
                  userSelect: "none",
                  cursor: "pointer",
                }}
              />
            </Link>
          </motion.div>

          {/* Right — Bloc aligné à droite pour le reste du contenu */}
          <div
            className="flex flex-col items-center md:items-end text-center md:text-right flex-1 md:pr-[clamp(2rem,5vw,6rem)]"
          >
            {/* Titre principal avec effet depth */}
            <motion.h1
              className="text-white font-black uppercase mb-8"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 6.5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxWidth: "60rem",
                background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease }}
            >
              Le changement de demain commence <span style={{ color: "#D35400", WebkitTextFillColor: "#D35400" }}>Maintenant</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-white/65 mb-12"
              style={{ fontSize: "clamp(1.5rem, 2vw, 1.35rem)", lineHeight: 1.7, maxWidth: "50rem", fontFamily: "var(--font-body)" }}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Prêt à transformer vos défis en opportunités technologiques ?
              <br />
              ACT accompagne entreprises et organisations dans la création de solutions innovantes et intelligentes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{ marginTop: "2.5rem" }}
            >
              <CTAButton href="/contact">Démarrez un projet</CTAButton>
            </motion.div>
          </div>
        </div>
      </motion.div>


      {/* ── Footer strip — navigation, contact, socials ── */}
      <FooterRoomSortie />
    </div>
  );
}