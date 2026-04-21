"use client";

/**
 * PoleFormationShell — Page de détail pour le Pôle III - Formation & Compétences
 *
 * Design spécifique avec thématique formation/éducation
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
import CTASection from "@/components/layout/CTASection";
import FormationsCarousel from "@/components/formations/FormationsCarousel";

const ORANGE = "#D35400";

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
  const titleColors = ["#ffffff", ORANGE, "#ffffff"];

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
      <OrbitArc label={svc.tagline} accent={ORANGE} />

      {/* Scan-line */}
      <ScanLine accent={ORANGE} />


      {/* Sun pulse */}
      <motion.div aria-hidden style={{
        position: "absolute", width: "80vw", height: "50vw",
        background: `radial-gradient(ellipse, ${ORANGE}18 0%, ${ORANGE}06 45%, transparent 72%)`,
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
            background: ORANGE, boxShadow: `0 0 ${p.size * 7}px ${ORANGE}77`,
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
            background: `${ORANGE}16`, border: `1px solid ${ORANGE}40`,
            borderRadius: "2rem", padding: "0.28rem 0.9rem",
            fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", letterSpacing: "0.18em",
            textTransform: "uppercase", color: ORANGE,
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
          <motion.div style={{ width: 50, height: 2, background: ORANGE, borderRadius: 1 }}
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
            background: `linear-gradient(to bottom, transparent, ${ORANGE}CC, transparent)`,
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

     
        </motion.div>
      </motion.div>

      {/* Image animée */}
      <motion.div style={{
        position: "relative", overflow: "hidden", minHeight: "520px",
        borderLeft: `1px solid ${ORANGE}18`,
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
          background: `radial-gradient(ellipse 70% 60% at 60% 50%, ${ORANGE}20 0%, transparent 70%)`,
          zIndex: 2, mixBlendMode: "screen",
        }} />
        {/* Grain texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 3,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }} />
        {/* Scan-line miniature */}
        <motion.div aria-hidden style={{
          position: "absolute", left: 0, right: 0, height: 1, zIndex: 4,
          background: `linear-gradient(to right, transparent, ${ORANGE}AA, transparent)`,
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

      {/* ── Panneau IMAGE ── */}
      <div 
        className="sub-panel-image"
        style={{
          order: isEven ? 1 : 2,
          position: "relative", overflow: "hidden",
          minHeight: "440px",
        }}
      >
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
          </>
        ) : (
          /* Fallback gradient si pas d'image */
          <>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 90% 80% at ${isEven ? "80%" : "20%"} 50%, ${accent}20 0%, ${accent}06 55%, transparent 100%)`,
            }} />
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
      <motion.div 
        className="sub-panel-content"
        style={{
          order: isEven ? 2 : 1,
          padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4vw, 4.5rem)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", zIndex: 1,
          x: textX,
        }}
      >
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

      <style>{`
        @media(max-width:768px){
          .sub-panel{grid-template-columns:1fr!important}
          .sub-panel-content{order:1!important}
          .sub-panel-image{order:2!important}
        }
      `}</style>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   4 · BÉNÉFICES — image en fond avec bloom
   ═══════════════════════════════════════════════════════ */
const BENEFIT_ICONS = [
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zM12 15a3 3 0 100-6 3 3 0 000 6z", // Target
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm1-10V7h-2v7h6v-2h-4z", // Clock
  "M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z", // Briefcase
  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75", // Users
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
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${ORANGE}12 0%, transparent 70%)`,
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
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${ORANGE}60)` }} />
              <span style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", color: ORANGE, fontWeight: 700,
              }}>Pourquoi opter pour nos services</span>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${ORANGE}60, transparent)` }} />
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
                    border: `1px solid ${ORANGE}22`,
                    borderTop: `2px solid ${ORANGE}`,
                    borderRadius: "0.8rem",
                    padding: "2rem 1.8rem",
                    position: "relative", overflow: "hidden",
                    backdropFilter: "blur(8px)",
                  }}>
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse 70% 70% at 50% 110%, ${ORANGE}0E 0%, transparent 70%)`,
                  }} />
                  <div style={{
                    width: 44, height: 44, marginBottom: "1.2rem",
                    background: `${ORANGE}16`, border: `1px solid ${ORANGE}35`,
                    borderRadius: "0.6rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        background: "rgba(10,20,16,0.92)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${ORANGE}30`,
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
        background: `${ORANGE}18`, border: `1px solid ${ORANGE}35`,
        borderRadius: "2rem", padding: "0.25rem 0.8rem",
        fontSize: "clamp(10px, 0.68rem, 0.72rem)",
        letterSpacing: "0.16em", textTransform: "uppercase", color: ORANGE,
        fontFamily: "Futura, system-ui, sans-serif",
      }}>Pôle {svc.poleN}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT PRINCIPAL
   ═══════════════════════════════════════════════════════ */
export default function PoleFormationShell({ svc }: { svc: Service }) {
  const index = SERVICES.findIndex(s => s.slug === svc.slug);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1410", color: "#fff", position: "relative" }}>
      {/* Background layers */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#0A1410" }}>
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
              accent={ORANGE} svcN={svc.n}
              img={svc.subImages[i]}
            />
          ))}
        </div>
        <BenefitsSection svc={svc} />
        <FormationsCarousel />
        <FooterStrip />
      </div>
    </div>
  );
}
