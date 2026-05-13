"use client";

/**
 * ProjectsSection — Editorial 2-column showcase.
 *
 * Layout (matches the user's reference screenshot) :
 *   ┌──────────────────────────────────────┐
 *   │ Nos dernières réalisations.  VOIR + │
 *   ├─────────────────┬────────────────────┤
 *   │  [ image 1 ]    │   [ image 2 ]      │
 *   │  Title 1   CAT  │   Title 2   CAT    │
 *   ├─────────────────┼────────────────────┤
 *   │  [ image 3 ]    │   [ image 4 ]      │
 *   │  Title 3   CAT  │   Title 4   CAT    │
 *   └──────────────────────────────────────┘
 *
 * Responsive : 2 cols desktop / tablet, 1 col mobile.
 * Subtle entry animation (fade + lift) on viewport enter,
 * + image scale + title color shift on hover.
 */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";
import { useTranslations } from "next-intl";

const ORANGE = "#D35400";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectsSection() {
  const t = useTranslations("home.projects");
  const featured = PROJECTS.slice(0, 4);

  return (
    <div
      style={{
        width: "100%",
        padding: "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 5.5rem)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ── Header : title left / "voir plus" right ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1.5rem",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            flexWrap: "wrap",
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
              maxWidth: "32ch",
            }}
          >
            {t("title")}{" "}
            <span style={{ color: ORANGE, fontStyle: "italic" }}>
              {t("titleAccent")}
            </span>
            .
          </h2>

          <Link
            href="/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              padding: "0.5rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.25)",
              transition: "color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = ORANGE;
              e.currentTarget.style.borderColor = ORANGE;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
          >
            {t("viewMore")}
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
        </motion.div>

        {/* ── Editorial 2-column grid — no row gap so TALL cards can
              visually bleed into the next row via negative margins below ── */}
        <div
          className="projects-grid"
          style={{
            display: "grid",
            columnGap: "clamp(1.5rem, 2.5vw, 2.5rem)",
            rowGap: 0,
          }}
        >
          {featured.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .projects-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

/* ── Single card ──────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  /* Asymmetric editorial grid — pattern flipped row-by-row :
       row 0 :  [ TALL  ]  [ short ]    tops aligned — TALL overflows into row 1
       row 1 :  [ short ]  [ TALL  ]    short card bottom-aligned
     `(row + col)` parity controls which side is tall.
     IMPORTANT : all TALL cards share the same aspect ratio, and all SHORT
     cards share the same aspect ratio — so img1 ≈ img4 and img2 ≈ img3.   */
  const row = Math.floor(index / 2);
  const col = index % 2;
  const isTall = (row + col) % 2 === 0;
  const isLargerRow = row % 2 === 1;

  // Uniform aspect ratios across all rows
  const imgAspect = isTall ? "4 / 4" : "4 / 3";

  // Tall cards on row 0 bleed downward into row 1's area (magazine overlap).
  // z-index raises them above the next row so the overlap reads clearly.
  const isBleedingTall = row === 0 && isTall;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: col * 0.1, // micro-stagger left/right of the same row
        ease: EASE,
      }}
      style={{
        position: "relative",
        // Short cards on a larger row sit at the bottom of the grid track
        alignSelf: isLargerRow && !isTall ? "end" : undefined,
        // Row-0 TALL card : negative margin-bottom creates the visual "bleed"
        // into row 1. Positive z-index so it paints OVER the row below.
        marginBottom: isBleedingTall ? "clamp(-6rem, -6vw, -3rem)" : undefined,
        zIndex: isBleedingTall ? 2 : 1,
        // Mirror top padding on row-1 short cards so the layout stays balanced
        paddingTop:
          isLargerRow && !isTall ? "clamp(3rem, 5vw, 5rem)" : undefined,
      }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="project-card"
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {/* Image — aspect ratio varies by column for an editorial rhythm */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: imgAspect,
            overflow: "hidden",
            borderRadius: "1.5rem",
            background: "rgba(255,255,255,0.03)",
            marginBottom: "1.25rem",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="project-image"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        {/* Footer row : title left + category tag right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
          }}
        >
          <h3
            className="project-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
              transition: "color 0.3s ease",
              flex: 1,
              minWidth: 0,
            }}
          >
            {project.title}
          </h3>

          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {project.category}
          </span>
        </div>
      </Link>

      <style jsx>{`
        .project-card:hover :global(.project-image) {
          transform: scale(1.04);
        }
        .project-card:hover :global(.project-title) {
          color: ${ORANGE};
        }
      `}</style>
    </motion.div>
  );
}
