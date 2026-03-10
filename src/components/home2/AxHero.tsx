"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function scramble(s: string) {
  return s
    .split("")
    .map((c) => (c === " " || c === "'" ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join("");
}

/** Character-scramble text reveal — Awwwards signature effect */
function GlitchText({
  text,
  delay = 0,
  className,
  style,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref       = useRef<HTMLSpanElement>(null);
  const inView    = useInView(ref, { once: true });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    const tid = setTimeout(() => {
      let frame = 0;
      const TOTAL = 40;
      const iid = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / TOTAL) * text.length);
        let res = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " " || text[i] === "'") { res += text[i]; continue; }
          if (i < revealed) {
            res += (Math.random() < 0.06 && i < revealed - 2)
              ? CHARS[Math.floor(Math.random() * CHARS.length)]
              : text[i];
          } else {
            res += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setOut(res);
        if (frame >= TOTAL) { setOut(text); clearInterval(iid); }
      }, 32);
    }, delay * 1000);
    return () => clearTimeout(tid);
  }, [inView, text, delay]);

  return <span ref={ref} className={className} style={style}>{out}</span>;
}

const ease = [0.6, 0.08, 0.02, 0.99] as const;

export default function AxHero() {
  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ height: "100vh", minHeight: 620, zIndex: 2 }}
    >
      {/* Bottom vignette — blends hero into next section */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to top, #03060A 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* Left vignette — keeps text readable */}
      <div
        className="absolute top-0 left-0 h-full pointer-events-none"
        style={{
          width: "55%",
          background: "linear-gradient(to right, rgba(3,6,10,0.85) 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      <div className="relative" style={{ padding: "0 clamp(1.5rem, 5vw, 6rem)", zIndex: 4 }}>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <motion.div
            style={{ width: 28, height: 1, background: "#D35400", originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          />
          <span className="text-white/40 uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.35em" }}>
            Africa Centred Technology
          </span>
          <span className="text-[#D35400] font-black uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.25em" }}>
            — IA & Ingénierie
          </span>
        </motion.div>

        {/* Giant title line 1 */}
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="font-black uppercase leading-none text-white"
            style={{ fontSize: "clamp(5rem, 13.5vw, 17rem)", letterSpacing: "-0.03em", lineHeight: 0.86 }}
            initial={{ y: "108%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.08, duration: 1.1, ease: [...ease] }}
          >
            <GlitchText text="L'AFRIQUE" delay={0.45} />
          </motion.h1>
        </div>

        {/* Accent row */}
        <motion.div
          className="flex items-center gap-5 my-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <span className="diamond" style={{ width: "1rem", height: "1rem" }} />
          <div style={{ width: 160, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </motion.div>

        {/* Giant title line 2 */}
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            className="font-black uppercase leading-none text-[#D35400]"
            style={{ fontSize: "clamp(5rem, 13.5vw, 17rem)", letterSpacing: "-0.03em", lineHeight: 0.86 }}
            initial={{ y: "108%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.2, duration: 1.1, ease: [...ease] }}
          >
            <GlitchText text="DE DEMAIN" delay={0.75} />
          </motion.h1>
        </div>

        {/* Tagline + CTA */}
        <motion.div
          className="flex flex-col gap-7 mt-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <p
            className="text-white/38"
            style={{ fontSize: "var(--font-20)", lineHeight: 1.68, maxWidth: "44rem" }}
          >
            ACT fusionne l&apos;intelligence artificielle et l&apos;ingénierie de pointe
            pour propulser les entreprises africaines au sommet de l&apos;innovation mondiale.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <CTAButton href="/contact">Démarrer votre transformation</CTAButton>
            <div className="flex items-center gap-2 text-white/25 uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
              <span className="diamond diamond--sm" />
              <span>Scroll to explore</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated scroll pulse */}
      <motion.div
        className="absolute"
        style={{ bottom: "3.5rem", right: "clamp(1.5rem, 4vw, 5rem)", zIndex: 4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <motion.div
          style={{ width: 1, height: 58, background: "rgba(211,84,0,0.55)", margin: "0 auto", originY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-white/20 uppercase block mt-2 text-center"
          style={{ fontSize: "0.85rem", letterSpacing: "0.4em" }}
        >
          01
        </span>
      </motion.div>
    </section>
  );
}
