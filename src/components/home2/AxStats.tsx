"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const stats = [
  { value: 15,  suffix: "+",  label: "Projets Exécutés",    desc: "Livrés en temps & en forme" },
  { value: 100, suffix: "%",  label: "Satisfaction Client",  desc: "Clients qui reviennent" },
  { value: 25,  suffix: "+",  label: "Experts Dédiés",       desc: "Ingénieurs & Data Scientists" },
  { value: 6,   suffix: "",   label: "Secteurs Couverts",    desc: "IA · SIG · FinTech · Média" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref     = useRef<HTMLSpanElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-60px" });
  const mv      = useMotionValue(0);
  const spring  = useSpring(mv, { duration: 2400, bounce: 0.02 });
  const display = useTransform(spring, (v) => Math.round(v).toString());
  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);
  return (
    <span ref={ref} className="font-black text-white leading-none">
      <motion.span>{display}</motion.span>
      <span className="text-[#D35400]">{suffix}</span>
    </span>
  );
}

export default function AxStats() {
  return (
    <section
      className="relative"
      style={{ background: "rgba(3,6,10,0.88)", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Section label */}
      <div
        className="flex items-center gap-4"
        style={{ padding: "3rem 6rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="diamond diamond--sm" />
        <span className="text-white/25 uppercase tracking-[0.3em]" style={{ fontSize: "1.1rem" }}>
          Chiffres Clés
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
        <span className="text-white/15 font-black uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
          02 / AXIOMS
        </span>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="relative flex flex-col"
            style={{
              padding: "5rem 4.5rem",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : undefined,
            }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.13 }}
          >
            {/* Large number */}
            <div style={{ fontSize: "clamp(3.5rem, 7.5vw, 9rem)", marginBottom: "1.5rem" }}>
              <Counter to={s.value} suffix={s.suffix} />
            </div>

            {/* Separator */}
            <motion.div
              style={{ height: 1, background: "#D35400", originX: 0 }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12 }}
            />

            {/* Label */}
            <p
              className="font-black uppercase text-white mt-5"
              style={{ fontSize: "var(--font-18)", letterSpacing: "0.05em", lineHeight: 1.2 }}
            >
              {s.label}
            </p>
            <p className="text-white/30 mt-2" style={{ fontSize: "1.2rem" }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
