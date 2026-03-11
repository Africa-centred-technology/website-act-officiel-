"use client";

/**
 * Room 05 — LES AXIOMES
 * Four animated counter stats in a full-width grid.
 * Spring counters fire on mount since the element is always in-viewport.
 */

import React, { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";

const stats = [
  { value: 15, suffix: "+", label: "Projets Exécutés", desc: "Livrés en temps & en forme" },
  { value: 100, suffix: "%", label: "Satisfaction Client", desc: "Clients qui reviennent" },
  { value: 25, suffix: "+", label: "Experts Dédiés", desc: "Ingénieurs & Data Scientists" },
  { value: 6, suffix: "", label: "Secteurs Couverts", desc: "IA · SIG · FinTech · Média" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2200, bounce: 0.02 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);

  return (
    <span ref={ref} className="font-black text-white leading-none">
      <motion.span>{display}</motion.span>
      <span className="text-[#D35400]">{suffix}</span>
    </span>
  );
}

export default function RoomAxiomes() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  /* 3-layer parallax */
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
      className="relative flex flex-col justify-center overflow-hidden room-pad"
      style={{ width: "100%", height: "100%" }}
    >



      {/* ── Header split gauche/droite : 05 ← | → LES AXIOMES ── */}
      <motion.div
        className="flex items-center gap-6 mb-8"
        style={{ x: midX, y: midY }}
      >
        {/* Left: eyebrow + "05" */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Chiffres Clés · Nos Axiomes
            </span>
          </motion.div>
        </div>

        {/* Séparateur vertical */}
        <motion.div
          style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.3)", flexShrink: 0, originY: 0.5 }}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        />

        {/* Right: "LES AXIOMES" — rise up + chars convergence, aligné droite */}
        <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
          {["LES AXIOMES"].join("").split("").map((ch, ci) => (
            <div key={ci} style={{ overflow: "hidden" }}>
              <motion.span
                className="font-black uppercase inline-block"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 9rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: ch === " " ? "transparent" : (ci >= 4 ? "#D35400" : "#ffffff"),
                }}
                initial={{ y: "108%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.68, delay: 0.12 + ci * 0.038, ease: [0.6, 0.08, 0.02, 0.99] }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Stats 4-column grid — "AXIOMES" fragmenté comme tâches de peinture ── */}
      {/* AX · IO · ME · S — un fragment par colonne, ghost en arrière-plan */}
      <div className="room-grid-4">
        {stats.map((s, i) => {
          const depthScale = 0.72 + i * 0.07;
          const depthBlur = 12 - i * 3;
          const depthY = 55 - i * 8;
          return (
            <motion.div
              key={s.label}
              className="relative flex flex-col"
              style={{
                padding: "4rem 3.5rem",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, y: depthY, scale: depthScale, filter: `blur(${depthBlur}px)` }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.88, delay: 0.12 + i * 0.15, ease: [0.6, 0.08, 0.02, 0.99] }}
            >

              {/* Counter */}
              <div style={{ fontSize: "clamp(3rem, 6.5vw, 8.5rem)", marginBottom: "1.2rem" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>

              {/* Orange line — scales in */}
              <motion.div
                style={{ height: 1, background: "#D35400", originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.13 }}
              />

              <p
                className="font-black uppercase text-white mt-5"
                style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.7rem)", letterSpacing: "0.05em", lineHeight: 1.2 }}
              >
                {s.label}
              </p>
              <p className="text-white/55 mt-2" style={{ fontSize: "1.1rem" }}>
                {s.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
