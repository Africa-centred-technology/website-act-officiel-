"use client";

/**
 * Room 02 — L'ATELIER
 * Service cards enter from depth: each card rises from rotateX perspective
 * as if emerging from beneath a surface.  The further left the card,
 * the deeper its depth origin — creating a wave of emergence.
 * 3-layer parallax gives the workshop its spatial volume.
 */

import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

const services = [
  {
    n: "01",
    title: "Pôle\nDéveloppement\nTechnologique",
    tag: "Ingénierie",
    desc: "Solutions sur mesure, plateformes robustes et développement logiciel adapté aux enjeux du continent africain.",
    href: "/services#dev",
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
  },
  {
    n: "02",
    title: "Pôle\nConseil",
    tag: "Stratégie IT",
    desc: "Accompagnement stratégique, audit technologique et transformation globale pour accélérer votre croissance.",
    href: "/services#conseil",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  },
  {
    n: "03",
    title: "Pôle\nFormation",
    tag: "Transmission",
    desc: "Montée en compétences, ateliers spécialisés et parcours de formation pour développer les talents de demain.",
    href: "/services#formation",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
];

/* Stagger offset + internal column proportions — asymétrie délibérée par carte */
const LAYOUT = [
  { delay: 0.06, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: false },
  { delay: 0.18, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: true },
  { delay: 0.30, marginLeft: "0%", titleW: "38%", descW: "36%", numSize: "clamp(4rem,7vw,8rem)", flip: false },
];

function NumBlock({ n, hovered, size, img }: { n: string; hovered: boolean; size: string; img: string }) {
  return (
    <div aria-hidden style={{ position: "relative", flexShrink: 0, width: "clamp(7rem,11vw,13rem)" }}>
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
    </div>
  );
}

function TitleBlock({ svc, width }: { svc: (typeof services)[0]; width: string }) {
  return (
    <div style={{ width, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span className="diamond diamond--sm" />
        <span style={{ color: "#D35400", fontSize: "0.95rem", letterSpacing: "0.20em", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-display)" }}>
          {svc.tag}
        </span>
      </div>
      <h3 style={{ fontWeight: 900, textTransform: "uppercase", color: "#fff", lineHeight: 1.05, whiteSpace: "pre-line", fontSize: "clamp(1.5rem, 2.5vw, 3rem)", fontFamily: "var(--font-display)" }}>
        {svc.title}
      </h3>
    </div>
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

function ServiceCard({ svc, index }: { svc: (typeof services)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const layout = LAYOUT[index];

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
        height: "1px",
        background: hovered
          ? "linear-gradient(to right, rgba(211,84,0,0.6), rgba(211,84,0,0.1))"
          : "rgba(255,255,255,0.06)",
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
      <div style={{
        display: "flex", alignItems: "center",
        gap: "2rem",
        padding: "2.5rem 0 2.5rem 0",
        cursor: "default",
      }}>

        {/* Numéro — gauche si normal, droite si flip */}
        {!layout.flip && (
          <NumBlock n={svc.n} hovered={hovered} size={layout.numSize} img={svc.img} />
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
            <NumBlock n={svc.n} hovered={hovered} size={layout.numSize} img={svc.img} />
            <TitleBlock svc={svc} width={layout.titleW} />
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function RoomAtelier() {
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
      style={{ width: "100%", height: "100%" }}
    >



      {/* ── Section header — split gauche/droite ── */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
        style={{ x: midX, y: midY, fontFamily: "var(--font-display)" }}
      >
        {/* Left: eyebrow + label */}
        <div style={{ flexShrink: 0, paddingBottom: "1rem" }}>
          <motion.div
            className="flex items-center gap-3 mb-2"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500 }}>
              Audit & Ingénierie
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 300, letterSpacing: "0.05em", opacity: 0.8 }}
          >
            Nos expertises sectorielles
          </motion.h2>
        </div>

        {/* Right: "Ce que nous proposons" chars */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "baseline", flex: 1, textAlign: "right", gap: "0.1em" }}>
          {"Ce que nous proposons".split("").map((ch, ci) => {
            const isOrange = ci >= 12;
            return (
              <motion.span
                key={ci}
                className="font-black uppercase"
                style={{
                  display: "inline-block",
                  fontSize: "clamp(2rem, 4.5vw, 5.5rem)",
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
          <ServiceCard key={svc.n} svc={svc} index={i} />
        ))}
      </div>
    </div>
  );
}
