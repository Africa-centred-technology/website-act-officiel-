"use client";

/**
 * Room 02 — L'ATELIER
 * Service cards enter from depth: each card rises from rotateX perspective
 * as if emerging from beneath a surface.  The further left the card,
 * the deeper its depth origin — creating a wave of emergence.
 * 3-layer parallax gives the workshop its spatial volume.
 */

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { POLES } from "@/lib/data/poles";


// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

const services = POLES.map(p => ({
  n: p.n,
  title: p.titleWithBreaks,
  tag: p.tag,
  desc: p.desc,
  href: p.href,
  img: p.img,
}));


/* Stagger offset + internal column proportions — asymétrie délibérée par carte */
const LAYOUT = [
  { delay: 0.06, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: false },
  { delay: 0.18, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: true },
  { delay: 0.30, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: false },
];

function NumBlock({ n, hovered, size, img, href }: { n: string; hovered: boolean; size: string; img: string; href: string }) {
  return (
    <Link href={href} aria-label="Voir le pôle" style={{ display: "block", position: "relative", flexShrink: 0, width: "clamp(7rem,11vw,13rem)", textDecoration: "none" }}>
      {/* Thumbnail */}
      <div style={{
        width: "100%",
        aspectRatio: "3/4",
        overflow: "hidden",
        borderRadius: "3px",
        border: hovered ? "1px solid rgba(211,84,0,0.45)" : "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.35s",
      }}>
        <img
          src={img}
          alt=""
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: hovered ? "grayscale(0%) brightness(0.85)" : "grayscale(100%) brightness(0.45)",
            transition: "filter 0.5s",
            display: "block",
          }}
        />
        {/* Orange overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(211,84,0,0.12)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }} />
      </div>

      {/* Ghost number bleeding over bottom-right corner */}
      <span style={{
        position: "absolute",
        bottom: "-0.3em",
        right: "-0.25em",
        fontWeight: 900,
        lineHeight: 1,
        userSelect: "none",
        fontSize: size,
        color: hovered ? "rgba(211,84,0,0.55)" : "rgba(255,255,255,0.10)",
        transition: "color 0.35s",
        letterSpacing: "-0.04em",
        pointerEvents: "none",
      }}>
        {n}
      </span>
    </Link>
  );
}

function TitleBlock({ svc, width }: { svc: (typeof services)[0]; width: string }) {
  return (
    <Link href={svc.href} style={{ width, flexShrink: 0, display: "block", textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span className="diamond diamond--sm" />
        <span style={{ color: "#D35400", fontSize: "0.95rem", letterSpacing: "0.20em", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-display)" }}>
          {svc.tag}
        </span>
      </div>
      <h3 style={{ fontWeight: 900, textTransform: "uppercase", color: "#fff", lineHeight: 1.05, whiteSpace: "pre-line", fontSize: "clamp(1.5rem, 2.5vw, 3rem)", fontFamily: "var(--font-display)", cursor: "pointer" }}>
        {svc.title}
      </h3>
    </Link>
  );
}

function DescBlock({ svc, hovered, width }: { svc: (typeof services)[0]; hovered: boolean; width: string }) {
  return (
    <div style={{ width, flexShrink: 0 }}>
      <p style={{
        fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)",
        lineHeight: 1.65,
        color: hovered ? "#ffffff" : "rgba(255,255,255,0.45)",
        marginBottom: "0.7rem",
        fontFamily: "var(--font-body)",
        transition: "color 0.4s ease, font-size 0.4s ease"
      }}>
        {svc.desc}
      </p>
      <Link href={svc.href} style={{
        display: "inline-flex", alignItems: "center", gap: "0.6rem",
        color: hovered ? "#D35400" : "rgba(255,255,255,0.28)",
        fontSize: "0.90rem", letterSpacing: "0.18em", textTransform: "uppercase",
        textDecoration: "none", transition: "color 0.25s", fontWeight: 600,
      }}>
        <span style={{ width: "2rem", height: "1px", background: "currentColor", display: "block", flexShrink: 0 }} />
        Découvrir
      </Link>
    </div>
  );
}

function ServiceCard({ svc, index, screenSize }: { svc: (typeof services)[0]; index: number; screenSize: 'mobile' | 'tablet' | 'desktop' }) {
  const [hovered, setHovered] = useState(false);
  const layout = LAYOUT[index];

  // Version simplifiée pour mobile et tablette
  if (screenSize !== 'desktop') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        style={{
          padding: screenSize === 'mobile' ? '1.5rem 0' : '2rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: screenSize === 'mobile' ? '1rem' : '1.5rem',
          padding: '0', // Full width container
        }}>
          {/* Numéro + Tag — Padding left for alignment */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '3rem',
            paddingRight: '2rem'
          }}>
            <span style={{
              fontSize: screenSize === 'mobile' ? '3rem' : '3.5rem',
              fontWeight: 900,
              color: 'rgba(211,84,0,0.3)',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
              paddingLeft: '0.2rem',
            }}>
              {svc.n}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="diamond diamond--sm" />
              <span style={{
                color: '#D35400',
                fontSize: screenSize === 'mobile' ? '0.7rem' : '0.8rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}>
                {svc.tag}
              </span>
            </div>
          </div>

          {/* Image — Shorter left margin, fills more on the right */}
          <Link href={svc.href} style={{
            display: 'block',
            width: 'calc(100% - 1rem)',
            marginLeft: '1rem',
            height: screenSize === 'mobile' ? '200px' : '240px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none',
          }}>
            <img
              src={svc.img}
              alt={svc.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(60%) brightness(0.7)',
              }}
            />
          </Link>

          {/* Titre — Aligned with the stack margin */}
          <Link href={svc.href} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.1,
              fontSize: screenSize === 'mobile' ? 'clamp(1.2rem, 5vw, 1.8rem)' : 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontFamily: 'var(--font-display)',
              paddingLeft: '3rem',
              paddingRight: '1.5rem',
              cursor: 'pointer',
            }}>
              {svc.title.replace(/\n/g, ' ')}
            </h3>
          </Link>

          {/* Description — Aligned with the stack margin */}
          <p style={{
            fontSize: screenSize === 'mobile' ? 'clamp(0.9rem, 3.5vw, 1.1rem)' : 'clamp(1rem, 2.5vw, 1.3rem)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-body)',
            paddingLeft: '3rem',
            paddingRight: '1.5rem', // Reduced to avoid too much empty space
          }}>
            {svc.desc}
          </p>

          {/* Lien — Aligned with the stack margin */}
          <Link href={svc.href} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#D35400',
            fontSize: screenSize === 'mobile' ? '0.75rem' : '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: 600,
            marginTop: '0.5rem',
            paddingLeft: '3rem',
          }}>
            <span style={{ width: '1.5rem', height: '1px', background: 'currentColor', display: 'block' }} />
            Découvrir
          </Link>
        </div>
      </motion.div>
    );
  }

  // Version desktop (originale)
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.80, delay: layout.delay, ease: [0.6, 0.08, 0.02, 0.99] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ marginLeft: layout.marginLeft, position: "relative" }}
    >
      {/* Ligne de séparation pleine largeur */}
      <div style={{
        position: "absolute", top: 0, left: `-${layout.marginLeft}`, right: 0,
        height: "2px",
        background: hovered
          ? "linear-gradient(to right, rgba(211,84,0,0.8), rgba(211,84,0,0.2))"
          : "rgba(255,255,255,0.2)",
        transition: "background 0.4s",
      }} />

      {/* Accent bar gauche au hover */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.6, 0.08, 0.02, 0.99] }}
        style={{
          position: "absolute", left: "-1.5rem", top: 0, bottom: 0,
          width: "2px", background: "#D35400",
          originY: 0, transformOrigin: "top",
        }}
      />

      {/* Contenu asymétrique */}
      <div className="mobile-flex-col" style={{
        display: "flex", alignItems: "center",
        gap: "2rem",
        padding: "2.5rem 0 2.5rem 0",
        cursor: "default",
      }}>

        {/* Numéro — gauche si normal, droite si flip */}
        {!layout.flip && (
          <NumBlock n={svc.n} hovered={hovered} size={layout.numSize} img={svc.img} href={svc.href} />
        )}

        {/* Bloc titre */}
        {layout.flip && (
          <DescBlock svc={svc} hovered={hovered} width={layout.descW} />
        )}

        {!layout.flip && (
          <TitleBlock svc={svc} width={layout.titleW} />
        )}

        {/* Ligne de connexion extensible */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.4, opacity: hovered ? 1 : 0.25 }}
          transition={{ duration: 0.4, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{
            flex: 1, height: "1px",
            background: layout.flip
              ? "linear-gradient(to left, #D35400, rgba(211,84,0,0.1))"
              : "linear-gradient(to right, #D35400, rgba(211,84,0,0.1))",
            originX: layout.flip ? 1 : 0,
          }}
        />

        {!layout.flip && (
          <DescBlock svc={svc} hovered={hovered} width={layout.descW} />
        )}

        {/* flip: image d'abord, titre immédiatement à sa droite (Excentré vers la droite) */}
        {layout.flip && (
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginLeft: "clamp(2rem, 10vw, 15rem)" }}>
            <NumBlock n={svc.n} hovered={hovered} size={layout.numSize} img={svc.img} href={svc.href} />
            <TitleBlock svc={svc} width={layout.titleW} />
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function RoomAtelier() {
  const screenSize = useMediaQuery();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative flex flex-col overflow-hidden room-pad"
      style={{
        width: "100%",
        height: "100%",
        // Mobile padding is now handled by individual cards for better precision
      }}
    >



      {/* ── Section header — split gauche/droite ── */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
        style={{ x: midX, y: midY, fontFamily: "var(--font-display)" }}
      >
        {/* Left: eyebrow + label */}
        <div style={{ flexShrink: 0, paddingBottom: screenSize === 'mobile' ? '0.5rem' : '1rem' }}>
          <motion.div
            className="flex items-center gap-3 mb-2"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: screenSize === 'mobile' ? '0.65rem' : screenSize === 'tablet' ? '0.75rem' : '0.85rem',
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 500
            }}>
              Audit & Ingénierie
            </span>
          </motion.div>
        </div>

        {/* Right: "Ce que nous proposons" chars */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: screenSize === 'desktop' ? 'flex-end' : 'flex-start',
          alignItems: "baseline",
          flex: 1,
          textAlign: screenSize === 'desktop' ? 'right' : 'left',
          gap: "0.1em"
        }}>
          {"Ce que nous proposons".split("").map((ch, ci) => {
            const isOrange = ci >= 12;
            return (
              <motion.span
                key={ci}
                className="font-black uppercase"
                style={{
                  display: "inline-block",
                  fontSize: screenSize === 'mobile'
                    ? "clamp(1.5rem, 6vw, 2.5rem)"
                    : screenSize === 'tablet'
                      ? "clamp(2rem, 5vw, 3.5rem)"
                      : "clamp(2rem, 4.5vw, 5.5rem)",
                  lineHeight: 0.9,
                  color: isOrange ? "#D35400" : "#ffffff",
                  letterSpacing: "-0.04em",
                }}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, delay: 0.15 + ci * 0.015, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            );
          })}
        </div>
      </motion.div>

      {/* Règle orange */}
      <motion.div
        style={{ height: 1, background: "rgba(211,84,0,0.45)", originX: 0.5, marginBottom: "1.8rem" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.78, duration: 1.0, ease: [0.6, 0.08, 0.02, 0.99] }}
      />

      {/* ── 3 bandes verticales ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {services.map((svc, i) => (
          <ServiceCard key={svc.n} svc={svc} index={i} screenSize={screenSize} />
        ))}
      </div>
    </div>
  );
}
