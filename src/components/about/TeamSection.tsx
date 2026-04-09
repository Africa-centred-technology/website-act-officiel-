"use client";

import React, { useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";

interface TeamSectionProps {
  team: TeamMember[];
}

/** 3-layer parallax hook */
function useParallax() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    },
    [mx, my]
  );

  return { midX, midY, onMouseMove };
}

/** Section header */
function SectionHeader({
  midX,
  midY,
}: {
  midX: ReturnType<typeof useSpring>;
  midY: ReturnType<typeof useSpring>;
}) {
  const EASE3D = [0.6, 0.08, 0.02, 0.99] as const;
  const eyebrow = "Le conseil d'administration de ACT";
  const title = "LE CONSEIL D'ADMINISTRATION";

  return (
    <motion.div
      className="flex items-center gap-6 mb-12"
      style={{ x: midX, y: midY, position: "relative", zIndex: 3 }}
    >
      {/* Left: eyebrow */}
      <div style={{ flexShrink: 0 }}>
        <motion.div
          className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.04 }}
        >
          <span className="diamond diamond--sm" />
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.99rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "var(--font-display)",
            }}
          >
            {eyebrow}
          </span>
        </motion.div>
      </div>

      {/* Right: title chars */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          flex: 1,
          gap: "0 0",
        }}
      >
        {title.split("").map((ch, ci) => (
          <div key={ci} style={{ overflow: "hidden" }}>
            <motion.span
              className="font-black uppercase inline-block"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 9rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                fontFamily: "var(--font-display)",
              }}
              initial={{ y: "110%", skewX: 10 }}
              whileInView={{ y: "0%", skewX: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.65,
                delay: 0.12 + ci * 0.038,
                ease: [...EASE3D],
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/** Orange rule */
function OrangeRule() {
  const EASE3D = [0.6, 0.08, 0.02, 0.99] as const;
  return (
    <motion.div
      style={{
        height: 1,
        background: "rgba(211,84,0,0.45)",
        originX: 0.5,
        marginBottom: "4rem",
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 1.0, ease: [...EASE3D] }}
    />
  );
}

/** Scan-line horizontale */
function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 w-full pointer-events-none"
      style={{
        height: "2px",
        zIndex: 4,
        background:
          "linear-gradient(to right, transparent, rgba(211,84,0,0.6) 30%, rgba(255,130,30,0.95) 50%, rgba(211,84,0,0.6) 70%, transparent)",
        boxShadow: "0 0 28px 5px rgba(211,84,0,0.28)",
      }}
      initial={{ top: "-4px", opacity: 0 }}
      animate={{ top: ["-4px", "102%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 9,
        times: [0, 0.06, 0.92, 1],
      }}
    />
  );
}

export default function TeamSection({ team }: TeamSectionProps) {
  const { midX, midY, onMouseMove } = useParallax();

  return (
    <section
      id="equipe"
      onMouseMove={onMouseMove}
      className="relative overflow-hidden about-sec-pad"
      style={{ minHeight: "100vh", paddingTop: "clamp(4rem, 8vw, 8rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)" }}
    >
      {/* Glow radial orange */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(211,84,0,0.09) 0%, transparent 65%)",
        }}
      />

      <ScanLine />

      <div className="relative" style={{ zIndex: 2 }}>
        <SectionHeader midX={midX} midY={midY} />
        <OrangeRule />

        {/* Grid 2 colonnes responsive */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          }}
        >
          {team.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
