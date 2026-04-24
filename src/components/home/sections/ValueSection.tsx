"use client";

/**
 * ValueSection — Staircase reveal (Moon-Mansion pattern).
 *
 * The 4 cards start offset in a staircase (y: i * 140px).
 * As the user scrolls NATURALLY (no scroll hijack, no page lock), the
 * cards animate up to align on the same baseline — driven by GSAP
 * ScrollTrigger with `scrub`, so the animation is tied 1:1 to scroll
 * progress. Once the cards settle, the descriptions fade in.
 *
 * Key points from the reference :
 *   • `gsap.set` establishes the initial staircase (NOT CSS transform —
 *     avoids the conflict that broke an earlier version)
 *   • `gsap.to` animates y → 0, scrub-linked to viewport progress
 *   • Large `padding-bottom` on the section reserves visual space so the
 *     initial staircase doesn't bleed into the next section
 *   • Mobile : staircase disabled, cards stack in 1/2 columns
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Vertical offset between consecutive cards at the staircase start */
const STEP = 140; // px

type Valeur = {
  num: string;
  titre: string;
  desc: string;
  bg: string;
};

const VALEURS: Valeur[] = [
  {
    num: "01",
    titre: "Collaboration",
    desc: "Les meilleures solutions naissent de l'intelligence collective et du partage de compétences.",
    bg: "#DCEBFB", // soft sky blue
  },
  {
    num: "02",
    titre: "Transmission",
    desc: "Nous formons, accompagnons et développons les talents technologiques africains.",
    bg: "#E8E2F5", // soft lavender
  },
  {
    num: "03",
    titre: "Excellence",
    desc: "Des standards élevés de qualité, de fiabilité et de rigueur dans chaque projet.",
    bg: "#DEEFE0", // soft mint green
  },
  {
    num: "04",
    titre: "Innovation utile",
    desc: "Une innovation ancrée dans les réalités africaines, qui répond à des besoins concrets.",
    bg: "#F7EFCF", // soft pale yellow
  },
];

export default function ValueSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
      gsap.from(".value-header > *", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".value-header", start: "top 80%" },
      });

      if (isMobile) return;

      const cards = gsap.utils.toArray<HTMLElement>(".value-card");

      /* ── Staircase : set initial y offset via GSAP ── */
      cards.forEach((card, i) => {
        gsap.set(card, { y: i * STEP });
      });

      /* ── Animate UP to aligned row, scrub-linked to scroll ── */
      gsap.to(cards, {
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".value-grid",
          start: "top 85%",
          end: "top 15%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      /* ── Fade descriptions in after cards settle ── */
      gsap.from(".value-desc", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".value-grid",
          start: "top 15%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        /* Large bottom padding on desktop reserves vertical space for
           the initial staircase so it doesn't bleed into the next
           section before the scroll-triggered alignment kicks in.      */
        padding: isMobile
          ? "4rem 1.5rem"
          : "6rem clamp(1.5rem, 3vw, 3rem) 26rem",
      }}
    >
      {/* ── Header ── */}
      <div
        className="value-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1.5rem",
          flexWrap: "wrap",
          paddingBottom: isMobile ? "2rem" : "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: isMobile ? "3rem" : "7rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: "#fff",
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          Ce qui nous{" "}
          <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>
            guide.
          </span>
        </h2>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <span>(Valeurs)</span>
          <span style={{ color: "#fff" }}>04 Piliers fondamentaux</span>
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div
        className="value-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(16px, 1.5vw, 24px)",
        }}
      >
        {VALEURS.map((v, i) => (
          <article
            key={v.num}
            className="value-card"
            style={{
              aspectRatio: "1 / 1.15",
              background: v.bg,
              borderRadius: 28,
              padding: "clamp(1.5rem, 2vw, 2.25rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              color: "#141412",
              willChange: "transform",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.75rem",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "0.85rem",
                opacity: 0.4,
              }}
            >
              ({v.num})
            </span>

            <span
              className="value-number"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(28px, 3vw, 44px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                textTransform: "none",
              }}
            >
              {v.titre}
            </span>

            <p
              className="value-desc"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 0.95vw, 15px)",
                lineHeight: 1.5,
                maxWidth: "24ch",
                opacity: 0.85,
                margin: 0,
              }}
            >
              {v.desc}
            </p>
          </article>
        ))}
      </div>

      {/* Responsive grid.
          Mobile (<900px) : GSAP staircase is disabled, grid falls back
          to 2 cols (or 1 below 600px) with the cards in their natural
          positions.                                                      */}
      <style jsx>{`
        @media (max-width: 900px) {
          .value-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .value-card {
            aspect-ratio: 1 / 1.1 !important;
          }
        }
        @media (max-width: 600px) {
          .value-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
