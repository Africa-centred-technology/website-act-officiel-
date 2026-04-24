"use client";

/**
 * ValueSection — diagonal staircase that flattens as the user scrolls.
 *
 * On first view, the 4 cards are arranged diagonally (each one sits lower
 * than the previous). As the user scrolls through the section, cards 2/3/4
 * rise to align horizontally with card 1.
 *
 * Mechanics:
 *  • useScroll() tracks the section's scroll progress (0 → 1)
 *  • useTransform() maps progress to a descending Y-offset for each card,
 *    with card 0 always at 0
 *  • Mask-reveal on the text blocks stays as a subtle entry flourish
 *
 * Responsive: 1 col mobile → 2×2 tablet → 4 cols desktop
 */

import React, { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Base vertical offset between consecutive cards (desktop pixels). */
const DIAGONAL_STEP = 80;

type Stat = {
  number: string;
  text: string;
  /** Background color (pastel) */
  bg: string;
};

const STATS: Stat[] = [
  {
    number: "185",
    text: "Brands we've helped build their digital presence.",
    bg: "#DCEBFB",
  },
  {
    number: "63",
    text: "Long-term partnerships with companies worldwide.",
    bg: "#E8E2F5",
  },
  {
    number: "2.5M+",
    text: "Users reached through platforms we designed.",
    bg: "#DEEFE0",
  },
  {
    number: "96%",
    text: "Clients who continue working with us on future projects.",
    bg: "#F7EFCF",
  },
];

/* ── Mask reveal variants (text entry) ──────────────────────────────── */

const maskInnerVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

function MaskReveal({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div
      style={{
        overflow: "hidden",
        display: "block",
        paddingBottom: "0.08em",
        ...style,
      }}
    >
      <motion.div
        variants={maskInnerVariants}
        transition={{ duration: 0.95, ease: EASE, delay }}
        style={{ display: "block" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */

export default function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll progress within the section:
  //   0  → section's TOP hits viewport BOTTOM (section enters)
  //   1  → section's BOTTOM hits viewport TOP  (section leaves)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Cards flatten between progress 0.15 (in view) and 0.55 (middle of scroll).
  // Card 0 never moves; cards 1/2/3 start at +n·STEP and rise to 0.
  const y1 = useTransform(scrollYProgress, [0.15, 0.55], [DIAGONAL_STEP * 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.15, 0.55], [DIAGONAL_STEP * 2, 0]);
  const y3 = useTransform(scrollYProgress, [0.15, 0.55], [DIAGONAL_STEP * 3, 0]);
  const yOffsets = [null, y1, y2, y3] as const;

  // Mask-reveal trigger (for the text inside each card)
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="value-grid"
        style={{
          width: "100%",
          maxWidth: 1280,
          display: "grid",
          gap: "clamp(16px, 2vw, 24px)",
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            style={{
              // Each non-first card gets its own scroll-driven Y offset.
              // Card 0 stays flat — it's the anchor line.
              y: yOffsets[i] ?? undefined,
              background: stat.bg,
              borderRadius: 24,
              padding: 32,
              aspectRatio: "1 / 1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              color: "#1A1A1A",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              willChange: "transform",
            }}
          >
            {/* Big number — mask reveal */}
            <MaskReveal
              delay={i * 0.08}
              style={{
                fontSize: "clamp(48px, 5vw, 72px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {stat.number}
            </MaskReveal>

            {/* Descriptive line — mask reveal one beat later */}
            <MaskReveal
              delay={i * 0.08 + 0.12}
              style={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.45,
                maxWidth: "90%",
              }}
            >
              {stat.text}
            </MaskReveal>
          </motion.div>
        ))}
      </div>

      {/* Responsive grid:
          • mobile (<640px)   → 1 column   (diagonal offset is visually tiny — fine)
          • tablet (≥640px)   → 2×2 grid
          • desktop (≥1024px) → 4 columns in a row (full staircase effect)      */}
      <style jsx>{`
        .value-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .value-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .value-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
