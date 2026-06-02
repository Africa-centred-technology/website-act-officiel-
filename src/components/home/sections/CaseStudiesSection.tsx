"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CASE_STUDIES } from "@/lib/data/case-studies";

const ORANGE = "#D35400";
const EASE = [0.22, 1, 0.36, 1] as const;
const GAP = 16;

/* Peek factor : how much of the next card is visible on the right */
const PEEK = 0.18; // 18% of one card width bleeds past the container

type CaseStudyItem = {
  sector: string;
  tagline: string;
  title: string;
};

function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w < 640 ? 1 : w < 1100 ? 2 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function CaseStudiesSection() {
  const t = useTranslations("home.caseStudies");
  const visibleCount = useVisibleCount();
  const maxIndex = CASE_STUDIES.length - visibleCount;
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(maxIndex, c + 1)), [maxIndex]);

  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, maxIndex)));
  }, [maxIndex]);

  /*
    Each card width = (containerWidth - gaps) / (visibleCount + PEEK)
    Expressed as % : cardW% = 100 / (visibleCount + PEEK)
    Slide offset per step = cardW% + gapAsFraction
  */
  const cardWidthPct = 100 / (visibleCount + PEEK);

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Header — padded ── */}
      <div
        style={{
          padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 5.5rem)",
          paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        {/* Title */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: ORANGE,
              margin: "0 0 0.75rem",
            }}
          >
            {t("eyebrow")}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: 0,
            }}
          >
            {t("title")}{" "}
            <span style={{ color: ORANGE, fontStyle: "italic" }}>
              {t("titleAccent")}
            </span>
            .
          </h2>
        </div>

        {/* Arrows only */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <ArrowBtn onClick={prev} disabled={current === 0} label="Précédent">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </ArrowBtn>
          <ArrowBtn onClick={next} disabled={current >= maxIndex} label="Suivant">
            <ArrowRight size={20} strokeWidth={1.75} />
          </ArrowBtn>
        </div>
      </div>

      {/* ── Carousel — left-padded, right bleeds to edge ── */}
      <div
        style={{
          paddingLeft: "clamp(1.5rem, 4vw, 5.5rem)",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ display: "flex", gap: GAP }}
          animate={{
            x: `calc(-${current * cardWidthPct}% - ${current * GAP}px)`,
          }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {CASE_STUDIES.map((cs) => {
            const item = t.raw(`items.${cs.id}`) as CaseStudyItem;
            return (
              <div
                key={cs.id}
                style={{
                  flex: `0 0 calc(${cardWidthPct}% - ${(GAP * PEEK) / (visibleCount + PEEK)}px)`,
                  minWidth: 0,
                }}
              >
                <CaseStudyCard id={cs.id} color={cs.color} image={cs.image} item={item} t={t} />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Bottom padding ── */}
      <div style={{ height: "clamp(3rem, 6vw, 6rem)" }} />
    </div>
  );
}

/* ── Arrow button ──────────────────────────────────────────────── */

function ArrowBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.85)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.color = ORANGE;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = disabled
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.85)";
      }}
    >
      {children}
    </button>
  );
}

/* ── Card ─────────────────────────────────────────────────────── */

type CardProps = {
  id: string;
  color: string;
  image: string;
  item: CaseStudyItem;
  t: ReturnType<typeof useTranslations<"home.caseStudies">>;
};

function CaseStudyCard({ id, color, image, item, t }: CardProps) {
  return (
    <Link
      href={`/cas-etudes/${id}`}
      className="cs-card"
      style={{
        position: "relative",
        aspectRatio: "3 / 4",
        borderRadius: "0.75rem",
        overflow: "hidden",
        cursor: "pointer",
        display: "block",
        textDecoration: "none",
      }}
    >
      {/* Background image */}
      <img
        src={image}
        alt={item.title}
        className="cs-img"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Gradient — transparent top, dark bottom */}
      <div
        className="cs-gradient"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
          transition: "background 0.4s",
        }}
      />

      {/* Text content — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        <h3
          className="cs-title"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "#fff",
            margin: 0,
            transition: "color 0.3s",
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.8)",
            margin: 0,
          }}
        >
          {item.tagline}
        </p>

        <div
          className="cs-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            transition: "color 0.3s",
            marginTop: "0.25rem",
          }}
        >
          <FileText size={13} strokeWidth={2} />
          {t("readMore")}
        </div>
      </div>

      <style jsx>{`
        .cs-card:hover :global(.cs-img) {
          transform: scale(1.05);
        }
        .cs-card:hover :global(.cs-gradient) {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.94) 0%,
            rgba(0, 0, 0, 0.65) 45%,
            rgba(0, 0, 0, 0.2) 75%,
            transparent 100%
          ) !important;
        }
        .cs-card:hover :global(.cs-title) {
          color: ${color} !important;
        }
        .cs-card:hover :global(.cs-cta) {
          color: ${color} !important;
        }
      `}</style>
    </Link>
  );
}
