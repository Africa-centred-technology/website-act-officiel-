"use client";

/**
 * ServiceRoom — Une room immersive par service ACT.
 *
 * Architecture visuelle (bas → haut) :
 *   0. Gradient bg unique au service (Ken Burns + parallax BG)
 *   1. Orbit arc SVG en rotation lente
 *   2. Scan-line colorée (accent)
 *   3. Ghost number décoratif (profondeur)
 *   4. Sun pulse radial
 *   5. Particules flottantes (accent)
 *   6. Lignes ambiantes horizontales
 *   7. Contenu — 3 couches parallax (bg / mid / fg)
 *      · Gauche  : Image Hero (4/3, cadre accent)
 *      · Droite  : header, titre char-split, tagline, benefits, CTA
 *
 * Chaque service a :
 *  - Son propre gradient (service.bg)
 *  - Accent orange (Pôle I) ou gold (Pôle II)
 *  - Char-fx alternés selon l'index
 */

import React, { useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/lib/data/services";

/* ── Constants ──────────────────────────────────────── */
const BURST = [0.04, 0.72, 0.08, 1.0] as const;
const EASE3D = [0.6, 0.08, 0.02, 0.99] as const;

type CharFx = "rollIn" | "burstOut" | "riseUp";
const FX_CYCLE: CharFx[] = ["rollIn", "burstOut", "riseUp"];

/* ═══════════════════════════════════════════════════════
   SCAN-LINE
   ═══════════════════════════════════════════════════════ */
function ScanLine({ accent }: { accent: string }) {
  const hex = accent;
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 w-full pointer-events-none"
      style={{
        height: "2px",
        background: `linear-gradient(to right, transparent 0%, ${hex}88 25%, ${hex}EE 50%, ${hex}88 75%, transparent 100%)`,
        boxShadow: `0 0 28px 5px ${hex}44`,
        zIndex: 4,
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["-4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 9, times: [0, 0.06, 0.92, 1] }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   ORBIT ARC
   ═══════════════════════════════════════════════════════ */
function OrbitArc({ label, accent }: { label: string; accent: string }) {
  const text = `${label} · `;
  const repeated = text.repeat(6);
  return (
    <motion.div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 0 }}
      animate={{ rotate: 360 }} transition={{ duration: 110, ease: "linear", repeat: Infinity }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
        <defs>
          <path id="orbitSvcPath" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text style={{ fontSize: "2.8", fill: `${accent}18`, fontWeight: 700, letterSpacing: "1.0" }}>
          <textPath href="#orbitSvcPath">{repeated}</textPath>
        </text>
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   WORD CHARS — char-by-char 3D animation
   ═══════════════════════════════════════════════════════ */
function WordChars({
  text, delay = 0, color = "#ffffff", fx, stagger = 0.033,
  size = "clamp(3rem, 6vw, 8rem)",
}: {
  text: string; delay?: number; color?: string;
  fx: CharFx; stagger?: number; size?: string;
}) {
  const chars = text.split("");
  const mid = Math.floor(chars.length / 2);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "nowrap" }}>
      {chars.map((ch, i) => {
        const ord = fx === "burstOut" ? Math.abs(i - mid) : i;
        const charDelay = delay + ord * stagger;

        const initial =
          fx === "rollIn" ? { y: "-108%", opacity: 0, filter: "blur(4px)" }
            : fx === "burstOut" ? { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" }
              : { y: "108%", opacity: 0 };

        const target =
          fx === "rollIn" ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : fx === "burstOut" ? { scale: 1, opacity: 1, filter: "blur(0px) brightness(1.0)" }
              : { y: "0%", opacity: 1 };

        const inner = (
          <motion.span className="font-black uppercase" style={{
            display: "inline-block", color, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em",
          }}
            initial={initial} animate={target}
            transition={{ duration: fx === "burstOut" ? 1.1 : 0.72, delay: charDelay, ease: [...BURST] }}>
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        );

        return fx !== "burstOut"
          ? <div key={i} style={{ overflow: "hidden" }}>{inner}</div>
          : <div key={i}>{inner}</div>;
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN — SERVICE ROOM
   ═══════════════════════════════════════════════════════ */
export default function ServiceRoom({ svc, index }: { svc: Service; index: number }) {
  /* 3-layer parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 22, damping: 18 });
  const bgY = useSpring(my, { stiffness: 22, damping: 18 });
  const midX = useSpring(mx, { stiffness: 55, damping: 22 });
  const midY = useSpring(my, { stiffness: 55, damping: 22 });
  const fgX = useSpring(mx, { stiffness: 105, damping: 24 });
  const fgY = useSpring(my, { stiffness: 105, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Particules déterministes par service */
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: ((i * 53 + index * 7 + 11) % 100),
      y: ((i * 71 + index * 13 + 23) % 100),
      size: 1.0 + (i % 3) * 0.7,
      dur: 4.5 + (i % 5) * 1.3,
      delay: (i % 7) * 0.6,
    })), [index]);

  /* Char-fx cyclé par index */
  const titleLines = svc.title.split("\n");
  const baseFx = FX_CYCLE[index % 3];
  const altFx = FX_CYCLE[(index + 1) % 3];
  const alt2Fx = FX_CYCLE[(index + 2) % 3];
  const fxList = [baseFx, altFx, alt2Fx];

  /* Couleurs de titre : alternance blanc / accent / blanc */
  const titleColors = ["#ffffff", svc.accent, "#ffffff"];

  return (
    <div
      onMouseMove={onMouseMove}
      style={{
        position: "relative", width: "100%", height: "100%",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        padding: "clamp(3rem, 4vw, 4rem) clamp(1.5rem, 4vw, 5.5rem) clamp(5rem, 8vw, 9rem)",
        justifyContent: "center",
      }}
    >
      {/* ── Gradient BG unique au service (layer 0) ── */}
      <motion.div aria-hidden style={{
        position: "absolute", inset: "-10%",
        background: svc.bg,
        x: bgX, y: bgY, zIndex: 0,
      }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [...EASE3D] }}
      />

      {/* Overlay sombre pour lisibilité */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(160deg, rgba(3,5,8,0.88) 0%, rgba(3,5,8,0.30) 50%, rgba(3,5,8,0.92) 100%)",
      }} />

      {/* ── Orbit arc ── */}
      <OrbitArc label={svc.tagline.toUpperCase()} accent={svc.accent} />

      {/* ── Scan-line ── */}
      <ScanLine accent={svc.accent} />

      {/* ── Ghost number ── */}
      <motion.div aria-hidden className="absolute select-none pointer-events-none font-black" style={{
        right: "-1%", top: "4%",
        fontSize: "clamp(11rem, 20vw, 26rem)",
        lineHeight: 1, color: `${svc.accent}07`,
        letterSpacing: "-0.04em",
        x: bgX, y: bgY, zIndex: 0,
      }}
        initial={{ scale: 1.22, opacity: 0, filter: "blur(22px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.0, ease: [...EASE3D] }}
      >
        {svc.n}
      </motion.div>

      {/* ── Sun pulse radial ── */}
      <motion.div aria-hidden style={{
        position: "absolute",
        width: "80vw", height: "50vw",
        background: `radial-gradient(ellipse, ${svc.accent}18 0%, ${svc.accent}07 45%, transparent 72%)`,
        borderRadius: "50%",
        top: "50%", left: "50%",
        translateX: "-50%", translateY: "-50%",
        x: bgX, y: bgY, zIndex: 0,
      }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Particules flottantes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 1 }}>
        {particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: svc.accent,
            boxShadow: `0 0 ${p.size * 7}px ${svc.accent}77`,
          }}
            animate={{ y: [0, -44, 0], opacity: [0, 0.55, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Lignes ambiantes horizontales ── */}
      {(["12%", "86%"] as const).map(pos => (
        <motion.div key={pos} aria-hidden style={{
          position: "absolute", left: 0, width: "100%",
          height: 1, background: "rgba(255,255,255,0.04)",
          top: pos, originX: 0.5, zIndex: 1,
        }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8 }}
        />
      ))}

      {/* ══ CONTENU PRINCIPAL ══════════════════════════ */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center",
        gap: "4rem",
        width: "100%",
        marginTop: "3rem",
      }}>

        {/* ── COLONNE GAUCHE — Hero Image ── */}
        <motion.div
          style={{ flex: "1", position: "relative", x: bgX, y: bgY }}
          initial={{ opacity: 0, x: -60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.35, ease: [...EASE3D] }}
        >
          {/* Cadre accent coin haut-gauche */}
          <motion.div aria-hidden style={{
            position: "absolute", top: -10, left: -10, zIndex: 3,
            width: 48, height: 48,
            borderTop: `2px solid ${svc.accent}`,
            borderLeft: `2px solid ${svc.accent}`,
          }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
          {/* Cadre accent coin bas-droite */}
          <motion.div aria-hidden style={{
            position: "absolute", bottom: -10, right: -10, zIndex: 3,
            width: 48, height: 48,
            borderBottom: `2px solid ${svc.accent}`,
            borderRight: `2px solid ${svc.accent}`,
          }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          />

          {/* Conteneur image avec ratio 4/3 */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            border: `1px solid ${svc.accent}22`,
          }}>
            <Image
              src={svc.heroImage}
              alt={svc.title.replace(/\n/g, " ")}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 1200px) 45vw, 38vw"
              priority
            />
            {/* Overlay gradient sombre sur les bords */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(225deg, rgba(3,5,8,0.55) 0%, transparent 45%, rgba(3,5,8,0.70) 100%)`,
            }} />
            {/* Overlay couleur accent subtil */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to top, ${svc.accent}22 0%, transparent 50%)`,
            }} />
            {/* Numéro du service en surimpression */}
            <div aria-hidden style={{
              position: "absolute", bottom: "1.2rem", right: "1.4rem",
              fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: svc.accent,
              fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              {svc.n} — {svc.tagline}
              <span style={{ display: "inline-block", width: 24, height: 1, background: svc.accent }} />
            </div>
          </div>
        </motion.div>

        {/* ── COLONNE DROITE — titre + info ── */}
        <motion.div style={{ flex: "0 0 52%", x: midX, y: midY }}
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.35, ease: [...EASE3D] }}
        >

          {/* Eyebrow */}
          <motion.div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.8rem" }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.04 }}>
            <span className="diamond diamond--sm" style={{ background: svc.accent }} />
            <span style={{ color: "#ffffff", fontSize: "clamp(1rem, 1.3vw, 1.25rem)", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>
              Pôle {svc.poleN} · {svc.pole}
            </span>
          </motion.div>

          {/* Titre chars */}
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", gap: "0.1em" }}>
            {titleLines.map((line, li) => (
              <WordChars
                key={li}
                text={line}
                delay={0.10 + li * 0.22}
                color={titleColors[li % 3]}
                fx={fxList[li % 3]}
                stagger={0.034}
                size="clamp(2.2rem, 4.2vw, 5.5rem)"
              />
            ))}
          </div>

          {/* Règle accent */}
          <motion.div style={{
            height: 1, background: `${svc.accent}77`,
            originX: 0, marginTop: "2rem", marginBottom: "1.5rem",
          }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.95, duration: 0.9, ease: [...EASE3D] }}
          />

          {/* Intro */}
          <motion.p style={{
            fontSize: "clamp(1.05rem, 1.4vw, 1.45rem)",
            lineHeight: 1.72, color: "#ffffffCC",
            maxWidth: "34rem",
          }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.62 }}>
            {svc.intro.split(".")[0]}.
          </motion.p>

          {/* Benefits pills */}
          <motion.div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "1.4rem" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.12, duration: 0.55 }}>
            {svc.benefits.map(b => (
              <span key={b} style={{
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                letterSpacing: "0.08em",
                color: svc.accent,
                background: `${svc.accent}12`,
                border: `1px solid ${svc.accent}30`,
                borderRadius: "2rem",
                padding: "0.3rem 0.85rem",
                fontWeight: 700,
              }}>
                {b}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "2rem" }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.22, duration: 0.58 }}>
            <Link href={`/services/${svc.slug}`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.65rem",
              padding: "0.85rem 2rem",
              background: svc.accent,
              color: "#fff",
              borderRadius: "0.4rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Détails complets
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/contact" style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "clamp(0.9rem, 1.1vw, 1.15rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}>
              <span className="diamond diamond--sm" style={{ background: svc.accent }} />
              Démarrer un projet
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
