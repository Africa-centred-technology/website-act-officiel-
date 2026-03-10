"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const MANIFESTO =
  "La technologie n'a de valeur que lorsqu'elle crée un impact réel. Nous ne nous contentons pas d'implémenter des technologies. Nous concevons des solutions qui créent de la valeur durable pour les organisations. En combinant intelligence artificielle, analyse de données et automatisation, nous aidons les entreprises à transformer leurs défis en opportunités et à construire les systèmes qui soutiendront leur croissance de demain.";

/* ── Curseur clignotant ─────────────────────────────────────────── */
function BlinkCursor() {
  return (
    <motion.span
      aria-hidden
      style={{
        display:       "inline-block",
        width:         "4px",
        height:        "0.82em",
        background:    "#D35400",
        marginLeft:    "0.15em",
        verticalAlign: "middle",
        borderRadius:  1,
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: [0, 0, 1, 1, 0, 0] }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{
        duration: 1.05,
        repeat:   Infinity,
        ease:     "linear",
        times:    [0, 0.04, 0.06, 0.5, 0.52, 1],
      }}
    />
  );
}

/* Each word is its own component to keep hooks at the top level */
function Word({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const color   = useTransform(progress, [start, end], ["#ffffff33", "#ffffff"]);
  return (
    <motion.span
      className="inline-block mr-[0.32em] mb-[0.2em]"
      style={{ opacity, color }}
    >
      {children}
    </motion.span>
  );
}

export default function AxManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });

  const words = MANIFESTO.split(/\s+/).filter(Boolean);
  const n     = words.length;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ background: "#040A06", minHeight: "160vh", padding: "clamp(5rem, 10vw, 12rem) clamp(1.5rem, 5vw, 6rem) clamp(4rem, 8vw, 10rem)" }}
    >
      {/* Eyebrow */}
      <motion.div
        className="flex items-center gap-3 mb-14"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="diamond diamond--sm" />
        <span
          className="text-white/30 uppercase tracking-[0.3em]"
          style={{ fontSize: "1.2rem" }}
        >
          Notre Manifeste
        </span>
      </motion.div>

      {/* Revealed text block */}
      <div style={{ maxWidth: "88rem" }}>
        <p
          className="font-black uppercase"
          style={{ fontSize: "clamp(2.0rem, 3.2vw, 4.2rem)", lineHeight: 1.48 }}
        >
          {words.map((word, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              start={(i / n) * 0.78}
              end={((i + 1) / n) * 0.78 + 0.22}
            >
              {word}
            </Word>
          ))}
          <BlinkCursor />
        </p>
      </div>

      {/* Attribution */}
      <motion.div
        className="flex items-center gap-4 mt-16"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ width: 36, height: 1, background: "#D35400" }} />
        <span
          className="text-white/35 uppercase"
          style={{ fontSize: "1.2rem", letterSpacing: "0.2em" }}
        >
          SOHIAB BAROUD — Fondateur &amp; CEO, ACT
        </span>
      </motion.div>
    </section>
  );
}
