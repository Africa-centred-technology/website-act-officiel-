"use client";

/**
 * Room 03 — LA GALERIE
 * 2×2 project grid — each photo enters from a different corner/depth:
 *   TL: from left + far depth    TR: from right + far depth
 *   BL: from bottom + mid depth  BR: from below + near depth (last)
 * Creates a "cards being laid on a table" perspective sensation.
 * Hover reveals project details via clip-path wipe.
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: "rag",
    index: "01",
    title: "Système RAG Multi-sources",
    category: "Intelligence Artificielle",
    year: "2024–25",
    desc: "Système de récupération augmentée multimodal intégrant documents, images, audio et vidéo pour opérer en environnement à faible connectivité.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "cod",
    index: "02",
    title: "CODRescue Platform",
    category: "E-commerce & Logistique",
    year: "2024",
    desc: "Plateforme complète de gestion e-commerce avec dashboards en temps réel, intégrations multi-transporteurs et optimisation des coûts.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "sig",
    index: "03",
    title: "GreenSIG V1",
    category: "SIG & IoT",
    year: "2026",
    desc: "Application de gestion des espaces verts avec cartographie interactive, suivi temps réel des interventions et capteurs IoT terrain.",
    image: "https://images.unsplash.com/photo-1542601906897-a1cf845e6ed6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "gam",
    index: "04",
    title: "GAM — Génies Afrique Médias",
    category: "Média & Éditorial",
    year: "2026",
    desc: "Web TV panafricaine avec architecture headless, gestion éditoriale avancée et diffusion multi-canal pour 15 pays africains.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
];

/**
 * Entry vectors per grid position — each photo comes from its own corner
 * with a distinct depth (scale) to suggest stacking from 3D space.
 */
const PHOTO_ENTRY = [
  { x: "-18%", y: "8%", scale: 0.80, blur: 10, delay: 0.05 }, // TL — from left, deepest
  { x: "18%", y: "8%", scale: 0.82, blur: 8, delay: 0.18 }, // TR — from right
  { x: "-10%", y: "14%", scale: 0.87, blur: 5, delay: 0.30 }, // BL — from below-left
  { x: "10%", y: "14%", scale: 0.92, blur: 3, delay: 0.42 }, // BR — shallowest, last
];

export default function RoomGalerie() {
  const [hovered, setHovered] = useState<string | null>(null);

  /* ── 3-layer parallax ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX = useSpring(mx, { stiffness: 110, damping: 24 });

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


      {/* ── Header split gauche/droite : 03 ← | → LA GALERIE ── */}
      <motion.div
        className="flex items-center gap-6 mb-5"
        style={{ x: midX, y: midY, position: "relative", zIndex: 3 }}
      >
        {/* Left: eyebrow + "03" */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Portfolio · Nos Réalisations
            </span>
          </motion.div>
        </div>

        {/* Séparateur vertical */}
        <motion.div
          style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.3)", flexShrink: 0, originY: 0.5 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        />

        {/* Right: "LA GALERIE" — skewX slide depuis le bas, aligné à droite */}
        <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
          {"LA GALERIE".split("").map((ch, ci) => (
            <div key={ci} style={{ overflow: "hidden" }}>
              <motion.span
                className="font-black uppercase inline-block"
                style={{
                  fontSize: "clamp(2.8rem, 6.5vw, 9.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
                initial={{ y: "110%", skewX: 10 }}
                animate={{ y: "0%", skewX: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + ci * 0.040, ease: [0.6, 0.08, 0.02, 0.99] }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 2 × 2 grid — each photo from its own corner depth ── */}
      <div
        className="grid flex-1"
        style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "0.6rem", minHeight: 0 }}
      >
        {projects.map((p, i) => {
          const entry = PHOTO_ENTRY[i];
          return (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                x: entry.x,
                y: entry.y,
                scale: entry.scale,
                filter: `blur(${entry.blur}px)`,
              }}
              animate={{
                opacity: 1,
                x: "0%",
                y: "0%",
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.85,
                delay: entry.delay,
                ease: [0.6, 0.08, 0.02, 0.99],
              }}
              className="relative overflow-hidden"
              style={{}}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Photo */}
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 1400px) 50vw, 700px"
                className="object-cover"
                style={{
                  transition: "transform 0.75s ease",
                  transform: hovered === p.id ? "scale(1.07)" : "scale(1.0)",
                }}
              />

              {/* Permanent gradient overlay */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(3,6,10,0.92) 0%, rgba(3,6,10,0.22) 60%, transparent 100%)",
                }}
              />

              {/* Default info bar */}
              <div className="absolute bottom-0 left-0 right-0" style={{ padding: "1.8rem 2rem" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className="block text-white/28 uppercase"
                      style={{ fontSize: "0.85rem", letterSpacing: "0.22em", marginBottom: "0.3rem" }}
                    >
                      {p.index} — {p.category}
                    </span>
                    <h3
                      className="font-black uppercase text-white"
                      style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.9rem)", lineHeight: 1.1 }}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <span
                    className="text-white/18 font-black uppercase"
                    style={{ fontSize: "0.95rem", letterSpacing: "0.2em" }}
                  >
                    {p.year}
                  </span>
                </div>
              </div>

              {/* Hover overlay — clip-path wipe from bottom */}
              <AnimatePresence>
                {hovered === p.id && (
                  <motion.div
                    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    transition={{ duration: 0.45, ease: [0.6, 0.08, 0.02, 0.99] }}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ background: "rgba(3,6,10,0.88)", padding: "2.2rem" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="diamond diamond--sm" />
                      <span className="text-[#D35400] uppercase" style={{ fontSize: "0.9rem", letterSpacing: "0.2em" }}>
                        {p.category}
                      </span>
                    </div>
                    <h3
                      className="font-black uppercase text-white mb-3"
                      style={{ fontSize: "clamp(1.3rem, 2.2vw, 2.3rem)", lineHeight: 1.05 }}
                    >
                      {p.title}
                    </h3>
                    <div style={{ width: 28, height: 1, background: "#D35400", marginBottom: "1rem" }} />
                    <p className="text-white/68" style={{ fontSize: "clamp(1rem, 1.3vw, 1.3rem)", lineHeight: 1.68 }}>
                      {p.desc}
                    </p>
                    <span
                      className="flex items-center gap-2 text-white/55 uppercase mt-5"
                      style={{ fontSize: "0.95rem", letterSpacing: "0.12em" }}
                    >
                      <span className="diamond diamond--sm" />
                      Voir le projet →
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
