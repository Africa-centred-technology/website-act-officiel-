"use client";

/**
 * Room 02 — L'ATELIER
 * Service cards enter from depth: each card rises from rotateX perspective
 * as if emerging from beneath a surface.  The further left the card,
 * the deeper its depth origin — creating a wave of emergence.
 * 3-layer parallax gives the workshop its spatial volume.
 */

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import RoomBackground from "@/components/home2/RoomBackground";

const services = [
  {
    n:     "01",
    title: "Intelligence\nArtificielle",
    tag:   "IA & ML",
    desc:  "LLMs locaux, RAG multimodal, agents autonomes et IA générative taillés pour les réalités africaines.",
    href:  "/services#ia",
  },
  {
    n:     "02",
    title: "Transformation\nDigitale",
    tag:   "Cloud & DevOps",
    desc:  "Architectures micro-services, DevOps et migration cloud-native pour accélérer votre time-to-market.",
    href:  "/services#transformation",
  },
  {
    n:     "03",
    title: "Data &\nSouveraineté",
    tag:   "Data Engineering",
    desc:  "Pipelines sécurisés, gouvernance et analytique avancée pour maîtriser vos actifs stratégiques.",
    href:  "/services#data",
  },
];

/** Depth-entry parameters per card — farther left = deeper origin */
const CARD_DEPTH = [
  { rotateX: 14, scale: 0.78, blur: 10, delay: 0.06 }, // 01 — deepest
  { rotateX: 9,  scale: 0.86, blur: 6,  delay: 0.20 }, // 02 — mid
  { rotateX: 5,  scale: 0.93, blur: 3,  delay: 0.34 }, // 03 — shallowest
];

function ServiceCard({ svc, index }: { svc: (typeof services)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const depth = CARD_DEPTH[index];

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    setTilt({ rx: (py - 0.5) * 20, ry: (px - 0.5) * -20, gx: px * 100, gy: py * 100, on: true });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <motion.div
      initial={{
        opacity: 0,
        y:       58,
        scale:   depth.scale,
        rotateX: depth.rotateX,
        filter:  `blur(${depth.blur}px)`,
      }}
      animate={{
        opacity: 1,
        y:       0,
        scale:   1,
        rotateX: 0,
        filter:  "blur(0px)",
      }}
      transition={{
        duration: 0.95,
        delay:    depth.delay,
        ease:     [0.6, 0.08, 0.02, 0.99],
      }}
      style={{ perspective: "1200px", cursor: "none", height: "100%" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          transformStyle: "preserve-3d",
          position:       "relative",
          padding:        "3.5rem 3rem",
          height:         "100%",
          display:        "flex",
          flexDirection:  "column",
          background:     "rgba(8,18,32,0.70)",
          border:         `1px solid rgba(211,84,0,${tilt.on ? 0.5 : 0.12})`,
          overflow:       "hidden",
          transition:     "border-color 0.28s",
        }}
      >
        {/* CSS scanlines */}
        <div
          aria-hidden
          style={{
            position:        "absolute",
            inset:           0,
            pointerEvents:   "none",
            zIndex:          1,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.015) 3px, rgba(211,84,0,0.015) 4px)",
          }}
        />
        {/* Radial cursor glow */}
        <div
          aria-hidden
          style={{
            position:      "absolute",
            inset:         0,
            pointerEvents: "none",
            zIndex:        2,
            background:    tilt.on
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(211,84,0,0.09) 0%, transparent 65%)`
              : "none",
            transition: "background 0.22s",
          }}
        />

        <div className="relative flex flex-col" style={{ zIndex: 3, flex: 1 }}>
          <span
            aria-hidden
            className="font-black block select-none"
            style={{ fontSize: "clamp(3rem, 5vw, 7rem)", lineHeight: 1, marginBottom: "2rem", color: "rgba(255,255,255,0.04)" }}
          >
            {svc.n}
          </span>

          <div className="flex items-center gap-2 mb-4">
            <span className="diamond diamond--sm" />
            <span className="text-[#D35400] uppercase" style={{ fontSize: "1rem", letterSpacing: "0.2em" }}>
              {svc.tag}
            </span>
          </div>

          <h3
            className="font-black uppercase text-white"
            style={{ fontSize: "clamp(2rem, 2.8vw, 3.2rem)", lineHeight: 1.05, whiteSpace: "pre-line", marginBottom: "1.5rem", flex: 1 }}
          >
            {svc.title}
          </h3>

          <motion.div
            style={{ height: 1, background: "rgba(211,84,0,0.5)", originX: 0, marginBottom: "1.5rem" }}
            animate={{ scaleX: tilt.on ? 1 : 0.18 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          />

          <p className="text-white/60 mb-6" style={{ fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)", lineHeight: 1.72 }}>
            {svc.desc}
          </p>

          <Link
            href={svc.href}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.05rem", letterSpacing: "0.12em" }}
          >
            <span className="diamond diamond--sm" />
            Découvrir
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RoomAtelier() {
  /* ── 3-layer parallax ── */
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const bgX  = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY  = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX  = useSpring(mx, { stiffness: 110, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative flex flex-col overflow-hidden"
      style={{ width: "100%", height: "100%", padding: "4.5rem 5rem 10rem" }}
    >
      <RoomBackground variant="cite" />

      {/* ── Deep BG: room number — blur-focus entry from distance ── */}
      <motion.div
        aria-hidden
        className="absolute select-none pointer-events-none font-black"
        style={{
          right:         "2%",
          top:           "6%",
          fontSize:      "clamp(12rem, 20vw, 26rem)",
          lineHeight:    1,
          color:         "rgba(211,84,0,0.055)",
          letterSpacing: "-0.04em",
          x: bgX,
          y: bgY,
        }}
        initial={{ scale: 1.18, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1,    opacity: 1, filter: "blur(0px)"  }}
        transition={{ duration: 1.9, ease: [0.6, 0.08, 0.02, 0.99] }}
      >
        02
      </motion.div>

      {/* ── Section header — split gauche/droite ── */}
      <motion.div
        className="flex items-center gap-6 mb-6"
        style={{ x: midX, y: midY }}
      >
        {/* Left: eyebrow + "02" */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "1rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
              Ce que nous fabriquons
            </span>
          </motion.div>
          <motion.span
            aria-hidden
            className="font-black select-none block"
            style={{ fontSize: "clamp(5rem, 11vw, 15rem)", color: "rgba(211,84,0,0.20)", letterSpacing: "-0.04em", lineHeight: 1 }}
            initial={{ x: -50, opacity: 0, filter: "blur(18px)" }}
            animate={{ x: 0,   opacity: 1, filter: "blur(0px)"  }}
            transition={{ duration: 1.0, ease: [0.6, 0.08, 0.02, 0.99] }}
          >
            02
          </motion.span>
        </div>

        {/* Séparateur vertical */}
        <motion.div
          style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.3)", flexShrink: 0, originY: 0.5 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        />

        {/* Right: CONSTRUISONS chars, alignés à droite */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "flex-end", flex: 1 }}>
          {"CONSTRUISONS".split("").map((ch, ci) => (
            <motion.span
              key={ci}
              className="font-black uppercase"
              style={{
                display:       "inline-block",
                fontSize:      "clamp(2.5rem, 5.5vw, 8rem)",
                lineHeight:    0.9,
                color:         ci < 4 ? "#ffffff" : ci < 8 ? "#D35400" : "#ffffff",
                letterSpacing: "-0.04em",
              }}
              initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
              transition={{ duration: 0.62, delay: 0.18 + ci * 0.030, ease: [0.6, 0.08, 0.02, 0.99] }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Règle orange */}
      <motion.div
        style={{ height: 1, background: "rgba(211,84,0,0.45)", originX: 0.5, marginBottom: "1.8rem" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.78, duration: 1.0, ease: [0.6, 0.08, 0.02, 0.99] }}
      />

      {/* ── 3-column cards from depth ── */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", flex: 1, minHeight: 0 }}
      >
        {services.map((svc, i) => (
          <ServiceCard key={svc.n} svc={svc} index={i} />
        ))}
      </div>
    </div>
  );
}
