"use client";

/**
 * ServiceDetailShell — Page de détail d'un service ACT.
 *
 * Structure :
 *   1. Hero 100vh — gradient unique + scan-line + orbit + ghost number
 *      + particules + char-split title (même DNA que ServiceRoom)
 *   2. Intro — texte complet + icône
 *   3. Sous-services — panels larges alternés avec fond accentué
 *   4. Bénéfices — grille 2×2 avec icônes animées au scroll
 *   5. Livrables — timeline verticale avec progress line animée
 *   6. Services connexes — cards du même pôle
 *   7. CTA — pleine largeur avec gradient service
 */

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  useScroll, useTransform,
  useMotionValue, useSpring,
} from "framer-motion";
import { SERVICES, type Service } from "@/lib/data/services";

/* ── Tokens ────────────────────────────────────────── */
const EASE  = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;

/* ── Variants ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = (delay = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: 0.10, delayChildren: delay } },
});

/* ═══════════════════════════════════════════════════════
   HERO IMMERSIF — 100vh, même ADN que ServiceRoom
   ═══════════════════════════════════════════════════════ */

function ScanLine({ accent }: { accent: string }) {
  return (
    <motion.div aria-hidden className="absolute left-0 w-full pointer-events-none"
      style={{
        height: "2px",
        background: `linear-gradient(to right, transparent 0%, ${accent}88 25%, ${accent}EE 50%, ${accent}88 75%, transparent 100%)`,
        boxShadow: `0 0 28px 5px ${accent}44`,
        zIndex: 5,
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["-4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 11, times: [0, 0.05, 0.93, 1] }}
    />
  );
}

function OrbitArc({ label, accent }: { label: string; accent: string }) {
  const text = `${label.toUpperCase()} · `;
  return (
    <motion.div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 0 }}
      animate={{ rotate: 360 }} transition={{ duration: 120, ease: "linear", repeat: Infinity }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
        <defs>
          <path id="heroOrbit" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text style={{ fontSize: "2.6", fill: `${accent}14`, fontWeight: 700, letterSpacing: "0.8" }}>
          <textPath href="#heroOrbit">{text.repeat(6)}</textPath>
        </text>
      </svg>
    </motion.div>
  );
}

type CharFx = "rollIn" | "burstOut" | "riseUp";

function WordChars({ text, delay = 0, color = "#fff", fx, stagger: s = 0.034, size }: {
  text: string; delay?: number; color?: string; fx: CharFx; stagger?: number; size: string;
}) {
  const chars = text.split("");
  const mid   = Math.floor(chars.length / 2);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "nowrap" }}>
      {chars.map((ch, i) => {
        const ord = fx === "burstOut" ? Math.abs(i - mid) : i;
        const d   = delay + ord * s;
        const ini = fx === "rollIn"   ? { y: "-108%", opacity: 0, filter: "blur(4px)" }
                  : fx === "burstOut" ? { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" }
                  :                     { y: "108%", opacity: 0 };
        const tgt = fx === "rollIn"   ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                  : fx === "burstOut" ? { scale: 1, opacity: 1, filter: "blur(0px) brightness(1)" }
                  :                     { y: "0%", opacity: 1 };
        const inner = (
          <motion.span className="font-black uppercase" style={{
            display: "inline-block", color, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em",
          }} initial={ini} animate={tgt}
            transition={{ duration: fx === "burstOut" ? 1.1 : 0.72, delay: d, ease: [...BURST] }}>
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

function HeroSection({ svc, index }: { svc: Service; index: number }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 22, damping: 18 });
  const bgY = useSpring(my, { stiffness: 22, damping: 18 });
  const midX = useSpring(mx, { stiffness: 55, damping: 22 });
  const midY = useSpring(my, { stiffness: 55, damping: 22 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOp  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, x: ((i * 57 + index * 11) % 100), y: ((i * 73 + index * 17) % 100),
      size: 1.0 + (i % 3) * 0.7, dur: 4.5 + (i % 5) * 1.2, delay: (i % 7) * 0.55,
    })), [index]);

  const fxCycle: CharFx[] = ["rollIn", "burstOut", "riseUp"];
  const titleLines   = svc.title.split("\n");
  const titleColors  = ["#ffffff", svc.accent, "#ffffff"];

  return (
    <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      onMouseMove={onMouseMove}>

      {/* Gradient bg */}
      <motion.div aria-hidden style={{
        position: "absolute", inset: "-10%",
        background: svc.bg, x: bgX, y: bgY, zIndex: 0,
      }}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 1.8, ease: [...EASE] }}
      />
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(170deg, rgba(3,5,8,0.92) 0%, rgba(3,5,8,0.28) 50%, rgba(3,5,8,0.95) 100%)",
      }} />

      {/* Orbit arc */}
      <OrbitArc label={`${svc.n} · ${svc.tagline}`} accent={svc.accent} />

      {/* Scan-line */}
      <ScanLine accent={svc.accent} />

      {/* Ghost number */}
      <motion.div aria-hidden className="absolute select-none pointer-events-none font-black" style={{
        right: "-2rem", top: "50%", translateY: "-50%",
        fontSize: "clamp(130px, 24vw, 320px)",
        color: `${svc.accent}07`,
        letterSpacing: "-0.04em", lineHeight: 1,
        x: bgX, y: bgY, zIndex: 0,
      }}
        initial={{ scale: 1.2, opacity: 0, filter: "blur(24px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.0, ease: [...EASE] }}
      >{svc.n}</motion.div>

      {/* Sun pulse */}
      <motion.div aria-hidden style={{
        position: "absolute",
        width: "80vw", height: "50vw",
        background: `radial-gradient(ellipse, ${svc.accent}18 0%, ${svc.accent}07 45%, transparent 72%)`,
        borderRadius: "50%", top: "50%", left: "50%",
        translateX: "-50%", translateY: "-50%",
        x: bgX, y: bgY, zIndex: 0,
      }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particules */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 1 }}>
        {particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: svc.accent, boxShadow: `0 0 ${p.size * 7}px ${svc.accent}77`,
          }}
            animate={{ y: [0, -44, 0], opacity: [0, 0.55, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Lignes ambiantes */}
      {(["12%", "87%"] as const).map(pos => (
        <motion.div key={pos} aria-hidden style={{
          position: "absolute", left: 0, width: "100%",
          height: 1, background: "rgba(255,255,255,0.04)", top: pos, zIndex: 1,
          originX: "0.5",
        } as React.CSSProperties}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8 }}
        />
      ))}

      {/* Contenu hero — parallax au scroll */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(2rem, 6vw, 6rem)",
        y: heroY, opacity: heroOp,
        x: midX,
      }}>

        {/* Breadcrumb + badge */}
        <motion.div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem",
            fontSize: "clamp(11px, 0.75rem, 0.8rem)", letterSpacing: "0.14em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
            <Link href="/services" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Services</Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
            <span style={{ color: svc.accent }}>{svc.n}</span>
          </nav>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: `${svc.accent}16`, border: `1px solid ${svc.accent}40`,
            borderRadius: "2rem", padding: "0.3rem 1rem",
            fontSize: "clamp(10px, 0.72rem, 0.76rem)", letterSpacing: "0.18em",
            textTransform: "uppercase", color: svc.accent,
            fontFamily: "Futura, system-ui, sans-serif",
          }}>
            Pôle {svc.poleN} · {svc.pole}
          </span>
        </motion.div>

        {/* Titre char-split */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginBottom: "2rem" }}>
          <motion.div style={{ flexShrink: 0 }}
            initial={{ x: -50, opacity: 0, filter: "blur(18px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.0, ease: [...BURST] }}>
            <span aria-hidden className="font-black select-none" style={{
              fontSize: "clamp(5rem, 10vw, 15rem)",
              color: `${svc.accent}22`,
              letterSpacing: "-0.04em", lineHeight: 1, display: "block",
            }}>{svc.n}</span>
          </motion.div>

          <motion.div style={{
            width: 1, alignSelf: "stretch", background: `${svc.accent}55`,
            flexShrink: 0, originY: "0.5",
          } as React.CSSProperties}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.22 }}
          />

          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", gap: "0.05em" }}>
            {titleLines.map((line, li) => (
              <WordChars key={li} text={line}
                delay={0.12 + li * 0.22}
                color={titleColors[li % 3]}
                fx={fxCycle[li % 3]}
                stagger={0.032}
                size="clamp(2.4rem, 4.8vw, 6.2rem)"
              />
            ))}
          </div>
        </div>

        {/* Règle + tagline */}
        <motion.div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}>
          <motion.div style={{ width: 50, height: 2, background: svc.accent, borderRadius: 1 }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.05, duration: 0.7, ease: [...EASE] }}
          />
          <p style={{
            fontSize: "clamp(1.1rem, 1.4vw, 1.6rem)",
            color: "rgba(255,255,255,0.55)", fontStyle: "italic", letterSpacing: "0.02em",
          }}>{svc.tagline}</p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "3.5rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}>
          <motion.div style={{
            width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${svc.accent}CC, transparent)`,
            originY: 0,
          }}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{
            fontSize: "clamp(10px, 0.7rem, 0.75rem)", letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
          }}>Défiler</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTRO SECTION
   ═══════════════════════════════════════════════════════ */
function IntroSection({ svc }: { svc: Service }) {
  return (
    <motion.section
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
      variants={stagger(0)}
      style={{
        maxWidth: "1180px", margin: "0 auto",
        padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 5vw, 5rem)",
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <motion.div variants={fadeUp}>
          <p style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(10px, 0.72rem, 0.78rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: `${svc.accent}99`, marginBottom: "1.5rem",
          }}>
            Notre approche
          </p>
          <p style={{
            fontSize: "clamp(1.15rem, 1.5vw, 1.7rem)",
            lineHeight: 1.78, color: "rgba(255,255,255,0.72)",
            fontStyle: "italic",
          }}>
            "{svc.intro}"
          </p>
        </motion.div>

        <motion.div variants={fadeUp} style={{
          display: "flex", flexDirection: "column", gap: "1.5rem",
          paddingLeft: "2rem", borderLeft: `1px solid ${svc.accent}30`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 52, height: 52, flexShrink: 0,
              background: `${svc.accent}14`, border: `1px solid ${svc.accent}35`,
              borderRadius: "0.8rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={svc.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={svc.icon} />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(13px, 0.88rem, 0.95rem)", color: "#fff", marginBottom: "0.2rem" }}>
                {svc.title.replace(/\n/g, " ")}
              </p>
              <p style={{ fontSize: "clamp(11px, 0.75rem, 0.78rem)",
                color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
                Pôle {svc.poleN} — {svc.pole}
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          <p style={{ fontSize: "clamp(12px, 0.82rem, 0.88rem)",
            color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
            {svc.subs.length} domaines d'intervention · {svc.benefits.length} avantages clés · {svc.deliverables.length} livrables concrets
          </p>
        </motion.div>
      </div>

      <style>{`@media (max-width: 768px) { .intro-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }`}</style>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════
   SOUS-SERVICES — panels immersifs alternés
   ═══════════════════════════════════════════════════════ */
function SubServicePanel({ sub, index, accent, svcN }: {
  sub: { title: string; desc: string }; index: number; accent: string; svcN: string;
}) {
  const isEven = index % 2 === 0;
  const ref    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const panelY  = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const numberY = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <motion.div ref={ref}
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
      variants={stagger(0)}
      style={{
        position: "relative", overflow: "hidden",
        display: "grid",
        gridTemplateColumns: isEven ? "1fr 1fr" : "1fr 1fr",
        gap: 0,
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
      className="sub-panel"
    >
      {/* Numéro décoratif */}
      <motion.div aria-hidden style={{
        position: "absolute",
        [isEven ? "right" : "left"]: "2%",
        top: "50%", translateY: "-50%",
        fontFamily: "Futura, system-ui, sans-serif",
        fontSize: "clamp(80px, 16vw, 220px)",
        fontWeight: 700, color: `${accent}05`,
        letterSpacing: "-0.04em", lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
        y: numberY, zIndex: 0,
      }}>
        {String(index + 1).padStart(2, "0")}
      </motion.div>

      {/* Panneau coloré */}
      <motion.div style={{
        order: isEven ? 1 : 2,
        background: `radial-gradient(ellipse 80% 80% at ${isEven ? "80%" : "20%"} 50%, ${accent}18 0%, ${accent}05 60%, transparent 100%)`,
        borderRight: isEven ? `1px solid ${accent}18` : "none",
        borderLeft:  isEven ? "none" : `1px solid ${accent}18`,
        minHeight: "320px",
        display: "flex", alignItems: "center", justifyContent: "center",
        y: panelY,
      }}>
        <motion.div variants={fadeUp} style={{
          textAlign: "center", padding: "3rem",
        }}>
          <span style={{
            display: "block",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(50px, 9vw, 120px)",
            fontWeight: 700, color: `${accent}30`,
            letterSpacing: "-0.04em", lineHeight: 1,
            marginBottom: "1rem",
          }}>
            {svcN}.{String(index + 1).padStart(2, "0")}
          </span>
          <motion.div style={{
            width: 40, height: 2, background: accent,
            borderRadius: 1, margin: "0 auto",
          }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [...EASE] }}
          />
        </motion.div>
      </motion.div>

      {/* Contenu texte */}
      <div style={{
        order: isEven ? 2 : 1,
        padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4vw, 4rem)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", zIndex: 1,
      }}>
        <motion.div variants={fadeUp} style={{
          display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem",
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `${accent}18`, border: `1px solid ${accent}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(10px, 0.65rem, 0.7rem)",
            fontFamily: "Futura, system-ui, sans-serif",
            color: accent, letterSpacing: "0.1em", flexShrink: 0,
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ flex: 1, height: 1, background: `${accent}40` }} />
        </motion.div>

        <motion.h3 variants={fadeUp} style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(18px, 1.6rem, 2rem)",
          fontWeight: 500, color: "#fff", lineHeight: 1.2,
          marginBottom: "1.2rem",
        }}>
          {sub.title}
        </motion.h3>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(13px, 0.95rem, 1.05rem)",
          lineHeight: 1.8, color: "rgba(255,255,255,0.52)",
        }}>
          {sub.desc}
        </motion.p>
      </div>

      <style>{`@media (max-width: 768px) { .sub-panel { grid-template-columns: 1fr !important; } }`}</style>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   BÉNÉFICES — grille 2×2 immersive
   ═══════════════════════════════════════════════════════ */
const BENEFIT_ICONS = [
  "M13 10V3L4 14h7v7l9-11h-7z",
  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
];

function BenefitsSection({ svc }: { svc: Service }) {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${svc.accent}08 0%, transparent 50%)`,
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 5vw, 3rem)",
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}
        >
          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem",
          }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${svc.accent}60)` }} />
            <span style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(10px, 0.72rem, 0.78rem)",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: `${svc.accent}AA`,
            }}>Ce que vous gagnez</span>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${svc.accent}60, transparent)` }} />
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "1.5rem",
          }}>
            {svc.benefits.map((b, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [...EASE] } }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${svc.accent}20`,
                  borderTop: `2px solid ${svc.accent}`,
                  borderRadius: "0.8rem",
                  padding: "2rem 1.8rem",
                  position: "relative", overflow: "hidden",
                }}>
                <div aria-hidden style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${svc.accent}0A 0%, transparent 70%)`,
                }} />
                <div style={{
                  width: 44, height: 44, marginBottom: "1.2rem",
                  background: `${svc.accent}14`, border: `1px solid ${svc.accent}30`,
                  borderRadius: "0.6rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={svc.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} />
                  </svg>
                </div>
                <p style={{
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontSize: "clamp(14px, 1.05rem, 1.12rem)",
                  fontWeight: 500, color: "#fff", position: "relative", zIndex: 1,
                }}>{b}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   LIVRABLES — timeline verticale animée
   ═══════════════════════════════════════════════════════ */
function DeliverablesSection({ svc }: { svc: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={ref} style={{ padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 5vw, 3rem)" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}>

          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(10px, 0.72rem, 0.78rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", marginBottom: "3rem",
          }}>Ce que vous recevez</motion.p>

          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Ligne de timeline */}
            <div style={{
              position: "absolute", left: "22px", top: 0, bottom: 0, width: 1,
              background: "rgba(255,255,255,0.06)", overflow: "hidden",
            }}>
              <motion.div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                background: `linear-gradient(to bottom, ${svc.accent}, ${svc.accent}44)`,
                height: lineH,
              }} />
            </div>

            {svc.deliverables.map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [...EASE] }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "1.75rem",
                  padding: "1.5rem 0",
                  borderBottom: i < svc.deliverables.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                {/* Dot */}
                <div style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                  background: `${svc.accent}14`, border: `1px solid ${svc.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: "Futura, system-ui, sans-serif",
                    fontSize: "clamp(10px, 0.7rem, 0.75rem)",
                    color: svc.accent, letterSpacing: "0.1em",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ paddingTop: "0.7rem" }}>
                  <p style={{
                    fontSize: "clamp(14px, 1rem, 1.05rem)",
                    color: "rgba(255,255,255,0.75)", lineHeight: 1.5,
                  }}>{d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SERVICES CONNEXES — même pôle
   ═══════════════════════════════════════════════════════ */
function RelatedServices({ svc }: { svc: Service }) {
  const related = SERVICES.filter(s => s.poleN === svc.poleN && s.slug !== svc.slug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section style={{
      background: "rgba(255,255,255,0.015)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "clamp(3.5rem, 6vw, 6rem) clamp(1.5rem, 5vw, 3rem)",
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}>

          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem",
          }}>
            <p style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(10px, 0.72rem, 0.78rem)",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}>Services du Pôle {svc.poleN}</p>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${related.length}, 1fr)`,
            gap: "1rem",
          }} className="related-grid">
            {related.map(r => (
              <motion.div key={r.slug} variants={fadeUp}>
                <Link href={`/services/${r.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div whileHover={{ y: -5, borderColor: `${r.accent}55` }}
                    transition={{ duration: 0.28, ease: [...EASE] }}
                    style={{
                      padding: "1.8rem",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "0.8rem",
                      cursor: "pointer",
                    }}>
                    <span style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(10px, 0.7rem, 0.74rem)",
                      letterSpacing: "0.2em", color: `${r.accent}AA`, display: "block", marginBottom: "0.7rem",
                    }}>{r.n}</span>
                    <p style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(13px, 0.95rem, 1rem)",
                      fontWeight: 500, color: "#fff", whiteSpace: "pre-line", lineHeight: 1.2, marginBottom: "0.6rem",
                    }}>{r.title}</p>
                    <p style={{
                      fontSize: "clamp(11px, 0.75rem, 0.8rem)",
                      color: "rgba(255,255,255,0.35)", fontStyle: "italic",
                    }}>{r.tagline}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:768px){.related-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA SECTION — pleine largeur avec gradient service
   ═══════════════════════════════════════════════════════ */
function CtaSection({ svc }: { svc: Service }) {
  const prev = SERVICES[SERVICES.findIndex(s => s.slug === svc.slug) - 1];
  const next = SERVICES[SERVICES.findIndex(s => s.slug === svc.slug) + 1];

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      padding: "clamp(5rem, 9vw, 9rem) clamp(1.5rem, 5vw, 3rem)",
    }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: svc.bg, opacity: 0.35,
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.6) 50%, rgba(3,5,8,0.97) 100%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1180px", margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}
          style={{ textAlign: "center" }}>

          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(10px, 0.72rem, 0.78rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: `${svc.accent}99`, marginBottom: "1.2rem",
          }}>Travaillons ensemble</motion.p>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(28px, 4.5vw, 5.5rem)",
            fontWeight: 500, color: "#fff", lineHeight: 1.1,
            marginBottom: "1.2rem",
          }}>
            Intéressé par ce service ?
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: "clamp(14px, 1rem, 1.1rem)",
            color: "rgba(255,255,255,0.45)", marginBottom: "3rem", maxWidth: "520px", margin: "0 auto 3rem",
          }}>
            Parlons de votre projet en 30 minutes — sans engagement.
          </motion.p>

          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "1.25rem", flexWrap: "wrap",
          }}>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              padding: "1rem 2.5rem",
              background: svc.accent, color: "#fff", borderRadius: "0.5rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(12px, 0.82rem, 0.88rem)",
              letterSpacing: "0.14em", textTransform: "uppercase",
              textDecoration: "none", fontWeight: 500,
            }}>
              Démarrer un projet
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              padding: "1rem 2rem",
              background: "transparent", color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.5rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(12px, 0.82rem, 0.88rem)",
              letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
            }}>
              ← Tous les services
            </Link>
          </motion.div>
        </motion.div>

        {/* Nav prev/next service */}
        {(prev || next) && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "5rem", paddingTop: "2.5rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              gap: "1rem",
            }}>
            {prev ? (
              <Link href={`/services/${prev.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.25 }}
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.25)" }}>←</span>
                  <div>
                    <p style={{ fontSize: "clamp(10px, 0.68rem, 0.72rem)",
                      color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                      Service précédent
                    </p>
                    <p style={{ fontSize: "clamp(12px, 0.85rem, 0.9rem)",
                      color: "rgba(255,255,255,0.55)", fontFamily: "Futura, system-ui, sans-serif" }}>
                      {prev.title.replace(/\n/g, " ")}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/services/${next.slug}`} style={{ textDecoration: "none", flex: 1, textAlign: "right" }}>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.25 }}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "flex-end" }}>
                  <div>
                    <p style={{ fontSize: "clamp(10px, 0.68rem, 0.72rem)",
                      color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                      Service suivant
                    </p>
                    <p style={{ fontSize: "clamp(12px, 0.85rem, 0.9rem)",
                      color: "rgba(255,255,255,0.55)", fontFamily: "Futura, system-ui, sans-serif" }}>
                      {next.title.replace(/\n/g, " ")}
                    </p>
                  </div>
                  <span style={{ fontSize: "1.2rem", color: svc.accent }}>→</span>
                </motion.div>
              </Link>
            ) : <div />}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STICKY HEADER — apparaît après le hero
   ═══════════════════════════════════════════════════════ */
function StickyHeader({ svc }: { svc: Service }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [...EASE] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(7,14,28,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${svc.accent}30`,
        padding: "0.9rem clamp(1.5rem, 4vw, 3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        <Link href="/services" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          textDecoration: "none", color: "rgba(255,255,255,0.4)",
          fontSize: "clamp(10px, 0.72rem, 0.76rem)", letterSpacing: "0.14em",
        }}>
          ← Services
        </Link>
        <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
        <span style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(12px, 0.82rem, 0.88rem)",
          color: "#fff", letterSpacing: "0.1em",
        }}>
          {svc.title.replace(/\n/g, " ")}
        </span>
      </div>
      <span style={{
        background: `${svc.accent}18`, border: `1px solid ${svc.accent}35`,
        borderRadius: "2rem", padding: "0.25rem 0.8rem",
        fontSize: "clamp(10px, 0.68rem, 0.72rem)",
        letterSpacing: "0.16em", textTransform: "uppercase", color: svc.accent,
        fontFamily: "Futura, system-ui, sans-serif",
      }}>
        Pôle {svc.poleN}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════════ */
export default function ServiceDetailShell({ svc }: { svc: Service }) {
  const index = SERVICES.findIndex(s => s.slug === svc.slug);

  return (
    <div style={{ minHeight: "100vh", background: "#070E1C", color: "#fff" }}>
      {/* Header sticky */}
      <StickyHeader svc={svc} />

      {/* 1 — Hero */}
      <HeroSection svc={svc} index={index} />

      {/* 2 — Intro */}
      <IntroSection svc={svc} />

      {/* 3 — Sous-services */}
      <div>
        {svc.subs.map((sub, i) => (
          <SubServicePanel key={i} sub={sub} index={i} accent={svc.accent} svcN={svc.n} />
        ))}
      </div>

      {/* 4 — Bénéfices */}
      <BenefitsSection svc={svc} />

      {/* 5 — Livrables */}
      <DeliverablesSection svc={svc} />

      {/* 6 — Services connexes */}
      <RelatedServices svc={svc} />

      {/* 7 — CTA */}
      <CtaSection svc={svc} />
    </div>
  );
}
