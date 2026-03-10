"use client";

/**
 * Room 04 — LE MANIFESTE
 * Word-by-word staggered reveal (time-based, not scroll-based)
 * since the room fills the full viewport with no scrolling.
 */

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ease3D = [0.6, 0.08, 0.02, 0.99] as const;
import RoomBackground from "@/components/home2/RoomBackground";

const MANIFESTO =
  "Nous ne nous contentons pas d'implémenter des technologies. Nous créons les moteurs de croissance de demain en intégrant l'IA générative, l'analyse prédictive et l'automatisation intelligente au cœur de votre métier africain. L'Afrique ne suit pas la révolution technologique — elle la dirige.";

const words = MANIFESTO.split(/\s+/).filter(Boolean);

/**
 * Each word materialises from an inclined plane:
 * orange → white color, scale 0.88 → 1, rotateX 10 → 0° (depth fold).
 * Creates the sensation of words rising from a reclined surface.
 */
function Word({ word, index, total }: { word: string; index: number; total: number }) {
  const delay = 0.28 + index * (1.55 / total);
  return (
    <motion.span
      className="inline-block mr-[0.28em] mb-[0.16em]"
      style={{ transformOrigin: "50% 100%" }}
      initial={{ opacity: 0.05, color: "#D35400bb", scale: 0.86, rotateX: 12, y: 8 }}
      animate={{ opacity: 1,    color: "#ffffff",   scale: 1,    rotateX: 0,  y: 0 }}
      transition={{ delay, duration: 0.62, ease: "easeOut" }}
    >
      {word}
    </motion.span>
  );
}

export default function RoomManifeste() {
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  /* 3-layer parallax */
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
      className="relative flex flex-col justify-center overflow-hidden room-pad"
      style={{ width: "100%", height: "100%" }}
    >
      <RoomBackground variant="maison" />

      {/* ── Header split gauche/droite : 04 ← | → LE MANIFESTE ── */}
      <motion.div
        className="flex items-center gap-6 mb-12"
        style={{ x: midX, y: midY }}
      >
        {/* Left: eyebrow + "04" */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="diamond diamond--sm" />
            <span className="text-white/55 uppercase tracking-[0.3em]" style={{ fontSize: "1.15rem" }}>
              Notre Manifeste
            </span>
          </motion.div>
        </div>

        {/* Séparateur vertical */}
        <motion.div
          style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.3)", flexShrink: 0, originY: 0.5 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        />

        {/* Right: "LE MANIFESTE" — 3D depth rotateX par mot, aligné droite */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {(["LE", "MANIFESTE"] as const).map((word, wi) => (
            <motion.span
              key={wi}
              className="font-black uppercase block"
              style={{
                fontSize:        wi === 0 ? "clamp(1.5rem, 3vw, 4rem)" : "clamp(2.8rem, 6.5vw, 9.5rem)",
                lineHeight:      1,
                letterSpacing:   "-0.03em",
                color:           wi === 0 ? "rgba(255,255,255,0.4)" : "#ffffff",
                transformOrigin: "50% 100%",
              }}
              initial={{ opacity: 0, scale: 0.82, rotateX: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1,    rotateX: 0,  filter: "blur(0px)"  }}
              transition={{ duration: 0.8, delay: 0.2 + wi * 0.18, ease: ease3D }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Word-by-word reveal — mid layer — perspective donne le plan incliné */}
      <motion.div style={{ maxWidth: "90rem", x: midX, perspective: "1100px" }}>
        <p
          className="font-black uppercase leading-tight"
          style={{ fontSize: "clamp(2rem, 3.6vw, 4.8rem)", lineHeight: 1.22 }}
        >
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} />
          ))}
        </p>
      </motion.div>

      {/* Attribution — foreground accent */}
      <motion.div
        className="flex items-center gap-4 mt-14"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + words.length * (1.6 / words.length) + 0.4, duration: 0.7 }}
        style={{ x: fgX }}
      >
        <div style={{ width: 36, height: 1, background: "#D35400" }} />
        <span className="text-white/55 uppercase" style={{ fontSize: "1.15rem", letterSpacing: "0.2em" }}>
          SOHIAB BAROUD — Fondateur &amp; CEO, ACT
        </span>
      </motion.div>
    </div>
  );
}
