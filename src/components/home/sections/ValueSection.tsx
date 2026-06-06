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
    bg: "#F5E6D3", // ACT cream — neutralité chaleureuse
  },
  {
    num: "02",
    titre: "Transmission",
    desc: "Nous formons, accompagnons et développons les talents technologiques africains.",
    bg: "#D8E8D4", // ACT green tinté — Pôle Formation
  },
  {
    num: "03",
    titre: "Excellence",
    desc: "Des standards élevés de qualité, de fiabilité et de rigueur dans chaque projet.",
    bg: "#FBE3C2", // ACT gold tinté — Pôle Conseil
  },
  {
    num: "04",
    titre: "Innovation utile",
    desc: "Une innovation ancrée dans les réalités africaines, qui répond à des besoins concrets.",
    bg: "#F4D4B8", // ACT orange tinté — Pôle Ingénierie Technologique
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

      /* Descriptions toujours visibles — pas d'animation conditionnelle
         pour éviter qu'elles disparaissent quand on scrolle dans l'autre
         sens ou qu'elles ne s'affichent jamais sur certaines vues. */
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
        position: "relative",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        /* Bottom padding reserves vertical space for the initial
           staircase so it doesn't bleed into the next section before
           the scroll-triggered alignment kicks in. Reduced now that
           the cards are flatter (aspectRatio 1/0.7).                  */
        padding: isMobile
          ? "3rem 1.5rem"
          : "5rem clamp(1.5rem, 3vw, 3rem) 9rem",
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
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          Ce qui nous{" "}
          <span style={{ fontStyle: "italic", color: "#D35400" }}>
            guide.
          </span>
        </h2>

        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
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
              aspectRatio: isMobile ? undefined : "1 / 0.7",
              minHeight: isMobile ? undefined : undefined,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: isMobile ? "1.5rem 1.5rem" : "clamp(1.25rem, 1.8vw, 2rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: isMobile ? "flex-start" : "space-between",
              gap: isMobile ? "0.75rem" : 0,
              position: "relative",
              color: "#fff",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              willChange: "transform",
            }}
          >
            <span
              className="value-number"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: isMobile ? "1.75rem" : "clamp(20px, 2vw, 30px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textTransform: "none",
              }}
            >
              {v.titre}
            </span>

            <p
              className="value-desc"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? "1.15rem" : "clamp(13px, 0.85vw, 14.5px)",
                lineHeight: isMobile ? 1.55 : 1.55,
                maxWidth: isMobile ? "100%" : "26ch",
                opacity: isMobile ? 0.9 : 0.7,
                margin: 0,
                color: "rgba(255,255,255,0.92)",
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
