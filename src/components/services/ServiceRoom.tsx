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
 *      · Gauche  : header, titre char-split, tagline, benefits, CTA
 *      · Droite  : sous-services (cards 3D tilt, depth-entry)
 *
 * Chaque service a :
 *  - Son propre gradient (service.bg)
 *  - Accent orange (Pôle I) ou gold (Pôle II)
 *  - Char-fx alternés selon l'index
 */

import React, { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { Service, ServiceSub } from "@/lib/data/services";

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
   SUB-SERVICE CARD (tilt 3D + depth-entry)
   ═══════════════════════════════════════════════════════ */
const CARD_DEPTH = [
  { rotateX: 14, scale: 0.76, blur: 12, delay: 0.08 },
  { rotateX: 8, scale: 0.86, blur: 7, delay: 0.20 },
  { rotateX: 4, scale: 0.94, blur: 3, delay: 0.32 },
];

function SubCard({ sub, index, accent }: { sub: ServiceSub; index: number; accent: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const depth = CARD_DEPTH[Math.min(index, 2)];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (py - 0.5) * 18, ry: (px - 0.5) * -18, gx: px * 100, gy: py * 100, on: true });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 52, scale: depth.scale, rotateX: depth.rotateX, filter: `blur(${depth.blur}px)` }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.92, delay: depth.delay, ease: [0.6, 0.08, 0.02, 0.99] }}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          padding: "1.8rem 2rem",
          background: "rgba(8,18,32,0.72)",
          border: `1px solid ${tilt.on ? accent + "66" : "rgba(255,255,255,0.08)"}`,
          overflow: "hidden",
          transition: "border-color 0.28s",
        }}
      >
        {/* Scanlines CSS */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }} />
        {/* Glow cursor */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: tilt.on
            ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, ${accent}18 0%, transparent 65%)`
            : "none",
          transition: "background 0.22s",
        }} />
        {/* Accent bar top */}
        <motion.div aria-hidden style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: accent, originX: 0,
        }}
          animate={{ scaleX: tilt.on ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        />

        <div style={{ position: "relative", zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.18em", color: `${accent}88` }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <motion.div style={{
              flex: 1, height: 1, background: accent, originX: 0,
            }}
              animate={{ scaleX: tilt.on ? 1 : 0.15 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            />
          </div>
          <h4 style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(13px, 1rem, 1.08rem)",
            fontWeight: 500, color: "#fff", marginBottom: "0.6rem", lineHeight: 1.2,
          }}>
            {sub.title}
          </h4>
          <p style={{
            fontSize: "clamp(11px, 0.82rem, 0.88rem)",
            lineHeight: 1.65, color: "rgba(255,255,255,0.45)",
          }}>
            {sub.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
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
        gap: "3rem",
        width: "100%",
        marginTop: "3rem", /* Push content entirely below the 12% ambient line */
      }}>

        {/* ── COLONNE GAUCHE — titre + info ── */}
        <motion.div style={{ flex: "0 0 55%", x: midX, y: midY }}>

          {/* Eyebrow */}
          <motion.div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.8rem" }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.04 }}>
            <span className="diamond diamond--sm" style={{ background: svc.accent }} />
            <span style={{ color: "rgba(255,255,255,0.32)", fontSize: "1rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
              Pôle {svc.poleN} · {svc.pole}
            </span>
          </motion.div>

          {/* Split : numéro ghost | titre chars */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>

            {/* Lignes du titre */}
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
            fontSize: "clamp(1.1rem, 1.4vw, 1.55rem)",
            lineHeight: 1.72, color: "rgba(255,255,255,0.56)",
            maxWidth: "36rem",
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
                fontSize: "clamp(0.8rem, 0.9vw, 0.95rem)",
                letterSpacing: "0.08em",
                color: `${svc.accent}CC`,
                background: `${svc.accent}12`,
                border: `1px solid ${svc.accent}30`,
                borderRadius: "2rem",
                padding: "0.3rem 0.85rem",
              }}>
                {b}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "2rem", x: fgX, y: fgY }}
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
              fontSize: "clamp(0.78rem, 0.9vw, 0.95rem)",
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
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
              fontSize: "clamp(0.78rem, 0.9vw, 0.92rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}>
              <span className="diamond diamond--sm" style={{ background: svc.accent }} />
              Démarrer un projet
            </Link>
          </motion.div>
        </motion.div>

        {/* ── COLONNE DROITE — sous-services cards ── */}
        <div style={{
          flex: "0 0 42%",
          display: "flex", flexDirection: "column",
          gap: "0.85rem",
          maxHeight: "68vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          {svc.subs.map((sub, i) => (
            <SubCard key={i} sub={sub} index={i} accent={svc.accent} />
          ))}
          {/* Livrable hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              padding: "1.2rem 1.6rem",
              background: `${svc.accent}0A`,
              border: `1px dashed ${svc.accent}30`,
              borderRadius: "0.4rem",
            }}
          >
            <p style={{
              fontSize: "clamp(10px, 0.72rem, 0.78rem)",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: `${svc.accent}AA`, marginBottom: "0.6rem",
            }}>
              Livrables inclus
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {svc.deliverables.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke={svc.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.45)" }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
