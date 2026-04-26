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
import Link from "next/link";

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

export default function HorizonSection() {
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
      className="room-container relative flex flex-col w-full"
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

      {/* ── Content wrapper — focus CTA "Démarrer un projet" ── */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center text-center"
        style={{
          x: midX,
          y: midY,
          padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 5.5rem)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8 w-full"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.10 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}>
            Démarrons ensemble
          </span>
          <span className="diamond diamond--sm" />
        </motion.div>

        {/* Titre principal — échelle h2 unifiée */}
        <motion.h1
          className="text-white uppercase"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "22ch",
            marginBottom: "1.5rem",
            background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease }}
        >
          Vous avez un projet ?
          <br />
          <span style={{ color: "#D35400", WebkitTextFillColor: "#D35400" }}>Donnons-lui vie.</span>
        </motion.h1>

        {/* Sous-texte */}
        <motion.p
          className="text-white/70"
          style={{
            fontSize: "clamp(1.05rem, 1.4vw, 1.35rem)",
            lineHeight: 1.65,
            maxWidth: "56ch",
            fontFamily: "var(--font-body)",
            marginBottom: "3rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Que ce soit une idée à valider, une solution à bâtir, ou une équipe à former — nos experts vous répondent sous 24 h pour transformer votre ambition en réalité.
        </motion.p>

        {/* CTA principal + secondaire */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ marginBottom: "3.5rem" }}
        >
          <Magnetic>
            <Link href="/contact" className="cta-btn" style={{ textDecoration: "none" }}>
              <span className="cta-btn__border" aria-hidden />
              <span className="cta-btn__blur" aria-hidden />
              <span className="cta-btn__background" aria-hidden />
              <span className="cta-btn__inner">
                <span className="cta-btn__icon" aria-hidden />
                <span className="cta-btn__text">Démarrer un projet</span>
              </span>
            </Link>
          </Magnetic>

          <Link
            href="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.78)",
              textDecoration: "none",
              padding: "0.6rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.25)",
              transition: "color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#D35400";
              e.currentTarget.style.borderColor = "#D35400";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.78)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
          >
            Voir nos réalisations →
          </Link>
        </motion.div>

        {/* Trois engagements rassurants */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(1rem, 2vw, 2.5rem)",
            width: "100%",
            maxWidth: "780px",
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            { val: "24h", label: "Réponse garantie" },
            { val: "Gratuit", label: "Premier échange" },
            { val: "100%", label: "Sur-mesure" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.4vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#D35400",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.val}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>


    </div>
  );
}