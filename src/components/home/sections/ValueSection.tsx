"use client";

/**
 * ValueSection — scroll-hijack pinned animation.
 *
 * Behaviour (like Moon Mansion / premium Webflow sites):
 *  • When the section snaps to the viewport top, the PAGE scroll is LOCKED.
 *  • Every wheel / touch / arrow event advances an INTERNAL progress [0 → 1].
 *  • As progress grows, the 4 cards lift from a staircase to a single row.
 *  • When progress reaches 1 (or 0), body scroll is unlocked — the page
 *    continues / goes back naturally.
 *
 * Card content: Moon-Mansion-style mask reveal on number + text.
 *
 * Responsive:
 *  • mobile (<640px) → no hijack, plain stacked grid, animation via inView
 *  • tablet (≥640px) → 2×2, hijack active
 *  • desktop (≥1024px) → 4 cols, hijack active
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Vertical offset (px) between consecutive cards at the start of the scroll. */
const DIAGONAL_STEP = 240;

/** How sensitive the hijack is. Lower = more wheel needed to complete.        */
const WHEEL_SENSITIVITY = 1500;
const TOUCH_SENSITIVITY = 400;

type Stat = {
  number: string;
  text: string;
  bg: string;
};

const STATS: Stat[] = [
  { number: "185",   text: "Brands we've helped build their digital presence.",          bg: "#DCEBFB" },
  { number: "63",    text: "Long-term partnerships with companies worldwide.",           bg: "#E8E2F5" },
  { number: "2.5M+", text: "Users reached through platforms we designed.",               bg: "#DEEFE0" },
  { number: "96%",   text: "Clients who continue working with us on future projects.",   bg: "#F7EFCF" },
];

/* ── Mask reveal variants ───────────────────────────────────────────── */

const contentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const maskInnerVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.95, ease: EASE } },
};

function MaskReveal({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
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
      <motion.div variants={maskInnerVariants} style={{ display: "block" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Single card ────────────────────────────────────────────────────── */

function StatCard({
  stat,
  index,
  progress,
}: {
  stat: Stat;
  index: number;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [index * DIAGONAL_STEP, 0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      className="value-card"
      style={{
        y,
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
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <MaskReveal
          style={{
            fontSize: "clamp(48px, 5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {stat.number}
        </MaskReveal>

        <MaskReveal
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
    </motion.div>
  );
}

/* ── Main — scroll-hijack logic ─────────────────────────────────────── */

export default function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);

  /** Raw progress, driven by wheel/touch/keyboard delta */
  const rawProgress = useMotionValue(0);
  /** Smoothed progress — what the cards actually interpolate on */
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 90,
    damping: 20,
    mass: 0.6,
  });

  /** Hijack active = section is pinned and intercepting input */
  const [hijacked, setHijacked] = useState(false);
  /** true if viewport width ≥ 640px (hijack disabled on mobile) */
  const [hijackAllowed, setHijackAllowed] = useState(false);

  /* Disable hijack on small screens (where cards are stacked) */
  useEffect(() => {
    const check = () => setHijackAllowed(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Activate the hijack as soon as the section's top enters the top half
     of the viewport. Uses a plain scroll listener — far more reliable than
     IntersectionObserver with a narrow threshold band, which fast-scrolling
     trackpads/wheels can skip over between frames.                         */
  useEffect(() => {
    if (!hijackAllowed) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (hijacked) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = rawProgress.get();

      // Scrolling DOWN into section (top is near viewport top, not past it yet)
      if (rect.top <= 80 && rect.top >= -vh * 0.5 && prog < 1) {
        setHijacked(true);
        return;
      }
      // Scrolling UP back into section (bottom approaching viewport bottom)
      if (
        rect.bottom >= vh - 80 &&
        rect.bottom <= vh + vh * 0.5 &&
        prog > 0
      ) {
        setHijacked(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once at mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [hijackAllowed, hijacked, rawProgress]);

  /* Release the hijack + resync the document scroll so the user lands
     cleanly at the next / previous section boundary.                     */
  const releaseHijack = useCallback((direction: "down" | "up") => {
    setHijacked(false);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    if (direction === "down") {
      // land with section bottom just above viewport top
      const y = window.scrollY + rect.bottom;
      window.scrollTo({ top: y, behavior: "auto" });
    } else {
      // land with section top just below viewport top
      const y = window.scrollY + rect.top - window.innerHeight;
      window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    }
  }, []);

  /* While hijacked: lock body scroll + intercept wheel/touch/keyboard. */
  useEffect(() => {
    if (!hijacked) return;

    // Lock body scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Snap section top to viewport top (in case user was mid-scroll)
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top,
        behavior: "auto",
      });
    }

    const advance = (delta: number) => {
      const cur = rawProgress.get();
      const next = cur + delta;
      if (next >= 1) {
        rawProgress.set(1);
        releaseHijack("down");
      } else if (next <= 0) {
        rawProgress.set(0);
        releaseHijack("up");
      } else {
        rawProgress.set(next);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      advance(e.deltaY / WHEEL_SENSITIVITY);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const cy = e.touches[0].clientY;
      const delta = (touchStartY - cy) / TOUCH_SENSITIVITY;
      touchStartY = cy;
      advance(delta);
    };

    const onKey = (e: KeyboardEvent) => {
      const keysDown = ["ArrowDown", "PageDown", " "];
      const keysUp = ["ArrowUp", "PageUp"];
      if (keysDown.includes(e.key)) { e.preventDefault(); advance(0.08); }
      else if (keysUp.includes(e.key)) { e.preventDefault(); advance(-0.08); }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [hijacked, rawProgress, releaseHijack]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
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
          <StatCard key={i} stat={stat} index={i} progress={smoothProgress} />
        ))}
      </div>

      {/* Responsive grid. On mobile, cards stack and the staircase transform
          is overridden to 0 (hijack is disabled there anyway).               */}
      <style jsx>{`
        .value-grid {
          grid-template-columns: 1fr;
        }
        @media (max-width: 639px) {
          :global(.value-card) {
            transform: none !important;
          }
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
