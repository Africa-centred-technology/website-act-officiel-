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

import React, { useMemo, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";

const BURST = [0.04, 0.72, 0.08, 1.0] as const;

/* ── Stats bar items are now localised inside the component via useTranslations ── */

/* ── Arc de texte en orbite (SVG textPath) — CSS animation, off main thread ── */
function OrbitArc() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 0, animation: "orbitRotate 90s linear infinite", transformOrigin: "center" }}
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
    </div>
  );
}

/* ── Scan-line horizontale orange — CSS animation, off main thread ────── */
function ScanLine() {
  return (
    <div
      aria-hidden
      className="absolute w-full pointer-events-none"
      style={{
        height: "2px",
        background:
          "linear-gradient(to right, transparent 0%, rgba(211,84,0,0.50) 25%, rgba(255,130,30,0.90) 50%, rgba(211,84,0,0.50) 75%, transparent 100%)",
        boxShadow: "0 0 28px 5px rgba(211,84,0,0.28)",
        zIndex: 4,
        insetInlineStart: 0,
        animation: "scanLine 11.1s ease-in-out infinite",
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
export default function HeroSection() {
  const t = useTranslations("home.hero");

  const STATS = [
    { n: "2026", label: t("stats.founded") },
    { n: "8",    label: t("stats.collaborators") },
    { n: "5+",   label: t("stats.domains") },
    { n: "∞",    label: t("stats.ambition") },
  ];

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

  /* Typewriter tagline */
  const tagline = t("tagline");
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTyped(tagline.slice(0, i));
        if (i >= tagline.length) clearInterval(iv);
      }, 48);
      return () => clearInterval(iv);
    }, 1400);
    return () => clearTimeout(t0);
  }, [tagline]);

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
          className="absolute start-0 w-full pointer-events-none"
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
        <div className="mobile-flex-col" style={{ display: "flex", alignItems: "center", gap: "4rem", justifyContent: "space-between", width: "100%" }}>

          {/* Left — Logo Continent */}
          <motion.div
            layoutId="logo-continent"
            style={{ x: bgX, y: bgY, flexShrink: 0, zIndex: 10 }}
            initial={{ scale: 0.7, x: -80, rotate: -3 }}
            animate={{ scale: 1, x: 0, rotate: 0 }}
            exit={{ scale: 0.2, x: 400, y: 400, opacity: 0, rotate: 10 }}
            transition={{ duration: 1.8, delay: 0.1, ease: BURST }}
          >
            <Link href="/">
              <img
                src="/logo/logo_continent.png"
                alt="ACT - Africa Centred Technology"
                width={1200}
                height={900}
                fetchPriority="high"
                decoding="async"
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


           {/* Right — mots empilés, alignés à droite, perspective 3D */}
          <div className="mobile-txt-center" style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1, minWidth: 0 }}>
            <WordChars text="AFRICA" delay={0.10} fx="rollIn" stagger={0.040} size="clamp(3.5rem, 7.5vw, 11rem)" />
            <WordChars text="CENTRED" delay={0.30} fx="burstOut" color="#FF6B00" stagger={0.044} mt="0.15em" size="clamp(2.4rem, 4.2vw, 6rem)" />
            <WordChars text="TECHNOLOGY" delay={0.52} fx="riseUp" stagger={0.020} mt="0.10em" size="clamp(2.8rem, 5.8vw, 8rem)" />

            <p
              style={{
                marginTop: "2.5rem",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontSize: "clamp(0.75rem, 1.5vw, 1.15rem)",
                textShadow: "0px 4px 15px rgba(0,0,0,0.5)",
                fontFamily: "var(--font-body)",
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              {/* Reserve full width so the block stays right-aligned like the title */}
              <span style={{ visibility: "hidden" }}>{tagline}</span>
              {/* Typed text overlaid left-to-right */}
              <span style={{ position: "absolute", left: 0, top: 0, display: "inline-flex", alignItems: "center" }}>
                {typed}
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "clamp(0.75rem, 1.5vw, 1.15rem)",
                    backgroundColor: "#D35400",
                    marginLeft: "3px",
                    verticalAlign: "middle",
                    animation: "cursorBlink 0.8s linear infinite",
                  }}
                />
              </span>
            </p>
          </div>

        </div>

      </motion.div>

      {/* ── Stats marquee — infinite scroll strip raised above the hero's
            bottom edge so it sits visually higher, with breathing room
            between it and the next section.                                 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "5rem",
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "1.4rem 0",
          background: "rgba(10,20,16,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "3.5rem",
            width: "max-content",
            animation: "heroStatsMarquee 32s linear infinite",
            alignItems: "center",
            paddingLeft: "3.5rem",
          }}
        >
          {Array.from({ length: 8 }).flatMap((_, copyIdx) =>
            STATS.map((s, i) => (
              <div
                key={`${copyIdx}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)",
                    fontStyle: "italic",
                    color: "#D35400",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: "6px",
                    height: "6px",
                    background: "#D35400",
                    transform: "rotate(-43.264deg)",
                    marginLeft: "2.2rem",
                    flexShrink: 0,
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
