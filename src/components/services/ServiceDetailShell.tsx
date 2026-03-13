"use client";

/**
 * ServiceDetailShell — Page de détail immersive d'un service ACT.
 *
 * Images animées :
 *  · Hero        — heroImage Ken Burns derrière le gradient, bloom au scroll
 *  · Intro       — heroImage en panneau latéral avec parallax scroll
 *  · Sub-panels  — subImages[i] Ken Burns dans le panneau coloré
 *  · Bénéfices   — heroImage en fond très sombre avec bloom
 *  · CTA         — heroImage pleine largeur + gradient overlay
 */

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll, useTransform,
  useMotionValue, useSpring,
} from "framer-motion";

/* Background layers */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });
import { SERVICES, type Service } from "@/lib/data/services";
import FooterStrip from "@/components/layout/FooterStrip";

const EASE  = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = (d = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: 0.10, delayChildren: d } },
});

/* ═══════════════════════════════════════════════════════
   COMPOSANTS UTILITAIRES
   ═══════════════════════════════════════════════════════ */

/** Image Ken Burns — zoom lent déterministe */
function KenBurns({
  src, alt = "", duration = 20, fromScale = 1.0, toScale = 1.12,
  fromX = "0%", toX = "0%", fromY = "0%", toY = "-4%",
  style,
}: {
  src: string; alt?: string; duration?: number;
  fromScale?: number; toScale?: number;
  fromX?: string; toX?: string; fromY?: string; toY?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.img
      src={src} alt={alt} loading="lazy"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
        ...style,
      }}
      initial={{ scale: fromScale, x: fromX, y: fromY }}
      animate={{ scale: toScale,   x: toX,   y: toY   }}
      transition={{ duration, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
    />
  );
}

function ScanLine({ accent }: { accent: string }) {
  return (
    <motion.div aria-hidden className="absolute left-0 w-full pointer-events-none"
      style={{
        height: "2px",
        background: `linear-gradient(to right, transparent 0%, ${accent}88 25%, ${accent}EE 50%, ${accent}88 75%, transparent 100%)`,
        boxShadow: `0 0 28px 5px ${accent}44`, zIndex: 5,
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["-4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 11, times: [0, 0.05, 0.93, 1] }}
    />
  );
}

function OrbitArc({ label, accent }: { label: string; accent: string }) {
  return (
    <motion.div aria-hidden className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 1 }}
      animate={{ rotate: 360 }} transition={{ duration: 120, ease: "linear", repeat: Infinity }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
        <defs><path id="heroOrbitD" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" /></defs>
        <text style={{ fontSize: "2.6", fill: `${accent}14`, fontWeight: 700, letterSpacing: "0.8" }}>
          <textPath href="#heroOrbitD">{`${label.toUpperCase()} · `.repeat(6)}</textPath>
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

/* ═══════════════════════════════════════════════════════
   1 · HERO 100vh — image Ken Burns + gradient + effets
   ═══════════════════════════════════════════════════════ */
function HeroSection({ svc, index }: { svc: Service; index: number }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const bgX  = useSpring(mx, { stiffness: 22, damping: 18 });
  const bgY  = useSpring(my, { stiffness: 22, damping: 18 });
  const midX = useSpring(mx, { stiffness: 55, damping: 22 });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  /* L'image brille légèrement quand on commence à scroller */
  const imgBrightness = useTransform(scrollYProgress, [0, 0.3], [1, 1.18]);

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, x: ((i * 57 + index * 11) % 100), y: ((i * 73 + index * 17) % 100),
      size: 1.0 + (i % 3) * 0.7, dur: 4.5 + (i % 5) * 1.2, delay: (i % 7) * 0.55,
    })), [index]);

  const fxCycle: CharFx[] = ["rollIn", "burstOut", "riseUp"];
  const titleLines  = svc.title.split("\n");
  const titleColors = ["#ffffff", svc.accent, "#ffffff"];

  return (
    <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      onMouseMove={e => {
        mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}>

      {/* ── Photo Ken Burns (couche 0) ── */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 0,
        filter: `brightness(${imgBrightness.get()})`,
      }}>
        <KenBurns
          src={svc.heroImage} alt=""
          duration={22}
          fromScale={1.0} toScale={1.14}
          fromX="-1%" toX="1%" fromY="0%" toY="-3%"
        />
      </motion.div>

      {/* Gradient service sur l'image */}
      <motion.div aria-hidden style={{
        position: "absolute", inset: "-10%",
        background: svc.bg, opacity: 0.55,
        x: bgX, y: bgY, zIndex: 1,
      }} />

      {/* Overlay sombre */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(170deg, rgba(3,5,8,0.88) 0%, rgba(3,5,8,0.22) 52%, rgba(3,5,8,0.96) 100%)",
      }} />

      {/* Vignette bords */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(3,5,8,0.55) 100%)",
      }} />

      {/* Orbit arc */}
      <OrbitArc label={svc.tagline} accent={svc.accent} />

      {/* Scan-line */}
      <ScanLine accent={svc.accent} />


      {/* Sun pulse */}
      <motion.div aria-hidden style={{
        position: "absolute", width: "80vw", height: "50vw",
        background: `radial-gradient(ellipse, ${svc.accent}18 0%, ${svc.accent}06 45%, transparent 72%)`,
        borderRadius: "50%", top: "50%", left: "50%",
        translateX: "-50%", translateY: "-50%",
        x: bgX, y: bgY, zIndex: 2,
      }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particules */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 3 }}>
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
          height: 1, background: "rgba(255,255,255,0.04)", top: pos, zIndex: 3,
          originX: "0.5",
        } as React.CSSProperties}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8 }}
        />
      ))}

      {/* Contenu hero — parallax sortie */}
      <motion.div style={{
        position: "absolute", inset: 0, zIndex: 4,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(2rem, 6vw, 6rem)",
        y: heroY, opacity: heroOp, x: midX,
      }}>
        {/* Breadcrumb */}
        <motion.nav style={{
          display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem",
          fontSize: "clamp(11px, 0.75rem, 0.8rem)", letterSpacing: "0.14em", flexWrap: "wrap",
        }}
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.04 }}>
          <Link href="/" style={{ color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.95rem, 1.2vw, 1.2rem)" }}>Accueil</Link>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>›</span>
          <Link href="/services" style={{ color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.95rem, 1.2vw, 1.2rem)" }}>Services</Link>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>›</span>
          <span style={{
            marginLeft: "auto",
            background: `${svc.accent}16`, border: `1px solid ${svc.accent}40`,
            borderRadius: "2rem", padding: "0.28rem 0.9rem",
            fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", letterSpacing: "0.18em",
            textTransform: "uppercase", color: svc.accent,
          }}>
            Pôle {svc.poleN} · {svc.pole}
          </span>
        </motion.nav>

        {/* Titre */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginBottom: "2rem" }}>
          <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", gap: "0.05em" }}>
            {titleLines.map((line, li) => (
              <WordChars key={li} text={line}
                delay={0.12 + li * 0.22} color={titleColors[li % 3]}
                fx={fxCycle[li % 3]} stagger={0.032}
                size="clamp(2.4rem, 4.8vw, 6.2rem)"
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}>
          <motion.div style={{ width: 50, height: 2, background: svc.accent, borderRadius: 1 }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 1.05, duration: 0.7, ease: [...EASE] }} />
          <p style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.6rem)",
            color: "rgba(255,255,255,0.55)", fontStyle: "italic", letterSpacing: "0.02em" }}>
            {svc.tagline}
          </p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "3.5rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}>
          <motion.div style={{
            width: 1, height: 48,
            background: `linear-gradient(to bottom, transparent, ${svc.accent}CC, transparent)`,
          }}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <span style={{ fontSize: "clamp(10px, 0.7rem, 0.74rem)", letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Défiler</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2 · INTRO — image latérale animée avec parallax scroll
   ═══════════════════════════════════════════════════════ */
function IntroSection({ svc }: { svc: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const textX   = useTransform(scrollYProgress, [0, 1], ["-2%", "0%"]);
  const imgReveal = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      maxWidth: "1400px", margin: "0 auto",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      overflow: "hidden",
    }} className="intro-grid">

      {/* Texte */}
      <motion.div style={{
        padding: "clamp(4rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        x: textX,
      }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}>
          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(0.85rem, 1vw, 1rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#ffffff", marginBottom: "1.8rem", fontWeight: 700,
          }}>Notre approche</motion.p>

          <motion.p variants={fadeUp} style={{
            fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)",
            lineHeight: 1.8, color: "#ffffff",
            fontStyle: "italic", marginBottom: "2.5rem",
          }}>
            "{svc.intro}"
          </motion.p>

          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "1.5rem 1.8rem",
            background: `${svc.accent}0C`,
            border: `1px solid ${svc.accent}25`, borderRadius: "0.8rem",
          }}>
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              background: `${svc.accent}18`, border: `1px solid ${svc.accent}35`,
              borderRadius: "0.7rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={svc.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={svc.icon} />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(14px, 1.1vw, 1.2rem)", color: "#fff", marginBottom: "0.2rem" }}>
                {svc.subs.length} sous-services · {svc.benefits.length} avantages · {svc.deliverables.length} livrables
              </p>
              <p style={{ fontSize: "clamp(12px, 0.95vw, 1.05rem)",
                color: svc.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                Pôle {svc.poleN} — {svc.pole}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image animée */}
      <motion.div style={{
        position: "relative", overflow: "hidden", minHeight: "520px",
        borderLeft: `1px solid ${svc.accent}18`,
        opacity: imgReveal,
      }}>
        {/* Image Ken Burns */}
        <motion.div style={{ position: "absolute", inset: 0, y: imgY }}>
          <KenBurns
            src={svc.heroImage} alt={svc.title.replace(/\n/g, " ")}
            duration={24} fromScale={1.0} toScale={1.1}
            fromX="0%" toX="-3%" fromY="0%" toY="-4%"
          />
        </motion.div>
        {/* Overlay gradient */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(105deg, rgba(3,5,8,0.82) 0%, rgba(3,5,8,0.25) 50%, rgba(3,5,8,0.72) 100%)`,
          zIndex: 1,
        }} />
        {/* Teinte accent */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 60% 50%, ${svc.accent}20 0%, transparent 70%)`,
          zIndex: 2, mixBlendMode: "screen",
        }} />
        {/* Grain texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 3,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }} />
        {/* Badge numéro service */}
        <div style={{
          position: "absolute", top: "2rem", right: "2rem", zIndex: 4,
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(60px, 10vw, 130px)",
          fontWeight: 700, color: `${svc.accent}18`,
          letterSpacing: "-0.04em", lineHeight: 1,
          userSelect: "none",
        }} aria-hidden>{svc.n}</div>
        {/* Scan-line miniature */}
        <motion.div aria-hidden style={{
          position: "absolute", left: 0, right: 0, height: 1, zIndex: 4,
          background: `linear-gradient(to right, transparent, ${svc.accent}AA, transparent)`,
        }}
          initial={{ top: "-2px" }}
          animate={{ top: ["−2px", "102%"] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 6 }}
        />
      </motion.div>

      <style>{`@media(max-width:768px){.intro-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   3 · SOUS-SERVICES — panels alternés avec image Ken Burns
   ═══════════════════════════════════════════════════════ */
function SubServicePanel({ sub, index, accent, svcN, img }: {
  sub: { title: string; desc: string }; index: number;
  accent: string; svcN: string; img?: string;
}) {
  const isEven = index % 2 === 0;
  const ref    = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgParallaxY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const numberY      = useTransform(scrollYProgress, [0, 1], [60, -20]);
  const textX        = useTransform(scrollYProgress, [0, 1], [isEven ? "2%" : "-2%", "0%"]);

  return (
    <motion.div ref={ref}
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
      variants={stagger(0)}
      style={{
        position: "relative", overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        minHeight: "440px",
      }}
      className="sub-panel"
    >
      {/* Numéro fantôme derrière */}
      <motion.div aria-hidden style={{
        position: "absolute",
        [isEven ? "right" : "left"]: "1%",
        top: "50%", translateY: "-50%",
        fontFamily: "Futura, system-ui, sans-serif",
        fontSize: "clamp(80px, 16vw, 220px)",
        fontWeight: 700, color: `${accent}04`,
        letterSpacing: "-0.04em", lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
        y: numberY, zIndex: 0,
      }}>{String(index + 1).padStart(2, "0")}</motion.div>

      {/* ── Panneau IMAGE ── */}
      <div style={{
        order: isEven ? 1 : 2,
        position: "relative", overflow: "hidden",
        minHeight: "440px",
      }}>
        {img ? (
          <>
            {/* Photo Ken Burns avec parallax */}
            <motion.div style={{ position: "absolute", inset: 0, y: imgParallaxY }}>
              <KenBurns
                src={img} alt={sub.title}
                duration={20 + index * 2}
                fromScale={1.0} toScale={1.12}
                fromX={isEven ? "1%" : "-1%"} toX={isEven ? "-2%" : "2%"}
                fromY="0%" toY="-3%"
              />
            </motion.div>
            {/* Overlay sombre */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: isEven
                ? "linear-gradient(to right, rgba(3,5,8,0.15) 0%, rgba(3,5,8,0.72) 100%)"
                : "linear-gradient(to left,  rgba(3,5,8,0.15) 0%, rgba(3,5,8,0.72) 100%)",
              zIndex: 1,
            }} />
            {/* Teinte marque */}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 80% 70% at ${isEven ? "30%" : "70%"} 50%, ${accent}22 0%, transparent 70%)`,
              zIndex: 2, mixBlendMode: "screen",
            }} />
            {/* Code service */}
            <div style={{
              position: "absolute", zIndex: 3,
              [isEven ? "right" : "left"]: "2rem",
              bottom: "2rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(40px, 7vw, 100px)",
              fontWeight: 700, color: `${accent}28`,
              letterSpacing: "-0.04em", lineHeight: 1,
              userSelect: "none",
            }} aria-hidden>
            </div>
          </>
        ) : (
          /* Fallback gradient si pas d'image */
          <>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 90% 80% at ${isEven ? "80%" : "20%"} 50%, ${accent}20 0%, ${accent}06 55%, transparent 100%)`,
            }} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            </div>
          </>
        )}
        {/* Barre accent latérale */}
        <motion.div aria-hidden style={{
          position: "absolute",
          [isEven ? "right" : "left"]: 0,
          top: 0, bottom: 0, width: 2,
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
          zIndex: 4,
        }}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [...EASE] }}
        />
      </div>

      {/* ── Panneau CONTENU ── */}
      <motion.div style={{
        order: isEven ? 2 : 1,
        padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4vw, 4.5rem)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", zIndex: 1,
        x: textX,
      }}>
        <motion.div variants={fadeUp} style={{
          display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem",
        }}>
          <motion.div style={{ flex: 1, height: 1, background: accent, originX: 0 }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [...EASE] }} />
        </motion.div>

        <motion.h3 variants={fadeUp} style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(18px, 1.7rem, 2.1rem)",
          fontWeight: 500, color: "#fff", lineHeight: 1.2, marginBottom: "1.2rem",
        }}>{sub.title}</motion.h3>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(14px, 1.1vw, 1.2rem)",
          lineHeight: 1.82, color: "#ffffff",
        }}>{sub.desc}</motion.p>
      </motion.div>

      <style>{`@media(max-width:768px){.sub-panel{grid-template-columns:1fr!important}}`}</style>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   4 · BÉNÉFICES — image en fond avec bloom
   ═══════════════════════════════════════════════════════ */
const BENEFIT_ICONS = [
  "M13 10V3L4 14h7v7l9-11h-7z",
  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
];

function BenefitsSection({ svc }: { svc: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      {/* Image de fond très sombre */}
      <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, y: imgY }}>
        <KenBurns
          src={svc.heroImage} alt=""
          duration={28} fromScale={1.05} toScale={1.0}
          fromX="0%" toX="2%"
        />
      </motion.div>
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(3,5,8,0.88)",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${svc.accent}12 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 3,
        padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 5vw, 3rem)",
      }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            variants={stagger(0)}>

            <motion.div variants={fadeUp} style={{
              display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem",
            }}>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${svc.accent}60)` }} />
              <span style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", color: svc.accent, fontWeight: 700,
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
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${svc.accent}22`,
                    borderTop: `2px solid ${svc.accent}`,
                    borderRadius: "0.8rem",
                    padding: "2rem 1.8rem",
                    position: "relative", overflow: "hidden",
                    backdropFilter: "blur(8px)",
                  }}>
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse 70% 70% at 50% 110%, ${svc.accent}0E 0%, transparent 70%)`,
                  }} />
                  <div style={{
                    width: 44, height: 44, marginBottom: "1.2rem",
                    background: `${svc.accent}16`, border: `1px solid ${svc.accent}35`,
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
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   5 · LIVRABLES — timeline avec image d'ambiance
   ═══════════════════════════════════════════════════════ */
function DeliverablesSection({ svc }: { svc: Service }) {
  const ref  = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineH = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);
  const imgY  = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  /* Image latérale (subImages[0] si disponible) */
  const sideImg = svc.subImages[svc.subImages.length - 1] ?? svc.heroImage;

  return (
    <section ref={ref} style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      overflow: "hidden",
    }} className="deliv-grid">

      {/* Timeline */}
      <div style={{ padding: "clamp(4rem, 7vw, 7rem) clamp(2rem, 5vw, 5rem)" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}>
          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(0.85rem, 1vw, 1rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#ffffff", marginBottom: "3rem", fontWeight: 700,
          }}>Ce que vous recevez</motion.p>

          <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
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
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [...EASE] }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "1.75rem",
                  padding: "1.5rem 0",
                  borderBottom: i < svc.deliverables.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                <div style={{
                  flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                  background: `${svc.accent}14`, border: `1px solid ${svc.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: "Futura, system-ui, sans-serif",
                    fontSize: "clamp(10px, 0.7rem, 0.74rem)", color: svc.accent, letterSpacing: "0.1em",
                  }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div style={{ paddingTop: "0.7rem" }}>
                  <p style={{ fontSize: "clamp(15px, 1.2vw, 1.3rem)",
                    color: "#ffffff", lineHeight: 1.55 }}>{d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Image d'ambiance avec parallax */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "400px" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: imgY }}>
          <KenBurns
            src={sideImg} alt=""
            duration={26} fromScale={1.0} toScale={1.1}
            fromX="2%" toX="-2%"
          />
        </motion.div>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(3,5,8,0.8) 0%, rgba(3,5,8,0.2) 60%, rgba(3,5,8,0.6) 100%)",
          zIndex: 1,
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: `radial-gradient(ellipse 60% 55% at 70% 50%, ${svc.accent}1A 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }} />
        {/* Texte flottant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [...EASE] }}
          style={{
            position: "absolute", bottom: "3rem", left: "2.5rem", right: "2.5rem", zIndex: 3,
          }}>
          <p style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(22px, 2.5vw, 3rem)",
            fontWeight: 500, color: "#fff", lineHeight: 1.1,
            marginBottom: "0.8rem",
          }}>
            {svc.deliverables.length} livrables<br />
            <span style={{ color: svc.accent }}>concrets</span>
          </p>
          <p style={{ fontSize: "clamp(13px, 1vw, 1.15rem)",
            color: "#ffffff", letterSpacing: "0.06em" }}>
            Documentation · Formation · Support
          </p>
        </motion.div>
      </div>

      <style>{`@media(max-width:768px){.deliv-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   6 · SERVICES CONNEXES
   ═══════════════════════════════════════════════════════ */
function RelatedServices({ svc }: { svc: Service }) {
  const related = SERVICES.filter(s => s.poleN === svc.poleN && s.slug !== svc.slug).slice(0, 3);
  if (!related.length) return null;

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
              fontSize: "clamp(0.85rem, 1vw, 1rem)",
              letterSpacing: "0.28em", textTransform: "uppercase", color: "#ffffff", fontWeight: 700,
            }}>Services du Pôle {svc.poleN}</p>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </motion.div>

          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${related.length}, 1fr)`,
            gap: "1.25rem",
          }} className="related-grid">
            {related.map(r => (
              <motion.div key={r.slug} variants={fadeUp}>
                <Link href={`/services/${r.slug}`} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div whileHover={{ y: -5, borderColor: `${r.accent}55` }}
                    transition={{ duration: 0.28, ease: [...EASE] }}
                    style={{
                      position: "relative", overflow: "hidden",
                      padding: "1.8rem",
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "0.8rem", cursor: "pointer",
                    }}>
                    {/* Mini image de fond */}
                    <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
                      <KenBurns src={r.heroImage} alt="" duration={30} fromScale={1.0} toScale={1.08} />
                    </div>
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      background: "rgba(3,5,8,0.75)",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <span style={{
                        fontFamily: "Futura, system-ui, sans-serif",
                        fontSize: "clamp(0.8rem, 1vw, 1rem)",
                        letterSpacing: "0.2em", color: r.accent, display: "block", marginBottom: "0.7rem", fontWeight: 700,
                      }}>{r.n}</span>
                      <p style={{
                        fontFamily: "Futura, system-ui, sans-serif",
                        fontSize: "clamp(13px, 0.95rem, 1rem)",
                        fontWeight: 500, color: "#fff", whiteSpace: "pre-line",
                        lineHeight: 1.2, marginBottom: "0.6rem",
                      }}>{r.title}</p>
                      <p style={{ fontSize: "clamp(11px, 0.75rem, 0.8rem)",
                        color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{r.tagline}</p>
                    </div>
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
   7 · CTA — image pleine largeur + gradient fort
   ═══════════════════════════════════════════════════════ */
function CtaSection({ svc }: { svc: Service }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const prev = SERVICES[SERVICES.findIndex(s => s.slug === svc.slug) - 1];
  const next = SERVICES[SERVICES.findIndex(s => s.slug === svc.slug) + 1];

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden",
      padding: "clamp(5rem, 9vw, 9rem) clamp(1.5rem, 5vw, 3rem)" }}>

      {/* Image pleine largeur Ken Burns */}
      <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, y: imgY }}>
        <KenBurns
          src={svc.heroImage} alt=""
          duration={30} fromScale={1.0} toScale={1.08}
          fromX="-2%" toX="2%"
        />
      </motion.div>

      {/* Overlay gradient service */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: svc.bg, opacity: 0.6,
        mixBlendMode: "multiply",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(160deg, rgba(3,5,8,0.95) 0%, rgba(3,5,8,0.65) 50%, rgba(3,5,8,0.97) 100%)",
      }} />
      {/* Bloom accent centré */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 3,
        background: `radial-gradient(ellipse 55% 50% at 50% 40%, ${svc.accent}22 0%, transparent 70%)`,
      }} />

      <div style={{ position: "relative", zIndex: 4, maxWidth: "1180px", margin: "0 auto" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)} style={{ textAlign: "center" }}>

          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(0.85rem, 1vw, 1rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: svc.accent, marginBottom: "1.2rem", fontWeight: 700,
          }}>Travaillons ensemble</motion.p>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(28px, 4.5vw, 5.5rem)",
            fontWeight: 500, color: "#fff", lineHeight: 1.1, marginBottom: "1.2rem",
          }}>Intéressé par ce service ?</motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: "clamp(15px, 1.2vw, 1.35rem)",
            color: "#ffffff", maxWidth: "520px",
            margin: "0 auto 3rem",
          }}>Parlons de votre projet en 30 minutes — sans engagement.</motion.p>

          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "1.25rem", flexWrap: "wrap",
          }}>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              padding: "1rem 2.5rem",
              background: svc.accent, color: "#fff", borderRadius: "0.5rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
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
              background: "transparent", color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: "0.5rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
              letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
            }}>← Tous les services</Link>
          </motion.div>
        </motion.div>

        {/* Nav prev / next */}
        {(prev || next) && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: "5rem", paddingTop: "2.5rem",
              borderTop: "1px solid rgba(255,255,255,0.07)", gap: "1rem",
            }}>
            {prev ? (
              <Link href={`/services/${prev.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.25 }}
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.25)" }}>←</span>
                  <div>
                    <p style={{ fontSize: "clamp(10px, 0.68rem, 0.72rem)",
                      color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em",
                      textTransform: "uppercase", marginBottom: "0.2rem" }}>Service précédent</p>
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
                      color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em",
                      textTransform: "uppercase", marginBottom: "0.2rem" }}>Service suivant</p>
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
   STICKY HEADER
   ═══════════════════════════════════════════════════════ */
function StickyHeader({ svc }: { svc: Service }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.div
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [...EASE] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(7,14,28,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${svc.accent}30`,
        padding: "0.9rem clamp(1.5rem, 4vw, 3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        <Link href="/services" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          textDecoration: "none", color: "rgba(255,255,255,0.4)",
          fontSize: "clamp(10px, 0.72rem, 0.76rem)", letterSpacing: "0.14em",
        }}>← Services</Link>
        <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
        <span style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(12px, 0.82rem, 0.88rem)", color: "#fff", letterSpacing: "0.1em",
        }}>{svc.title.replace(/\n/g, " ")}</span>
      </div>
      <span style={{
        background: `${svc.accent}18`, border: `1px solid ${svc.accent}35`,
        borderRadius: "2rem", padding: "0.25rem 0.8rem",
        fontSize: "clamp(10px, 0.68rem, 0.72rem)",
        letterSpacing: "0.16em", textTransform: "uppercase", color: svc.accent,
        fontFamily: "Futura, system-ui, sans-serif",
      }}>Pôle {svc.poleN}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════════ */
export default function ServiceDetailShell({ svc }: { svc: Service }) {
  const index = SERVICES.findIndex(s => s.slug === svc.slug);

  return (
    <div style={{ minHeight: "100vh", background: "#070E1C", color: "#fff", position: "relative" }}>
      {/* Background layers */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#070E1C" }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <StickyHeader svc={svc} />
        <HeroSection svc={svc} index={index} />
        <IntroSection svc={svc} />
        <div>
          {svc.subs.map((sub, i) => (
            <SubServicePanel
              key={i} sub={sub} index={i}
              accent={svc.accent} svcN={svc.n}
              img={svc.subImages[i]}
            />
          ))}
        </div>
        <BenefitsSection svc={svc} />
        <DeliverablesSection svc={svc} />
        <RelatedServices svc={svc} />
        <CtaSection svc={svc} />
        <FooterStrip />
      </div>
    </div>
  );
}
