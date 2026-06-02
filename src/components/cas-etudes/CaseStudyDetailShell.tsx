"use client";

import React, { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "lucide-react";
import type { CaseStudy } from "@/lib/data/case-studies";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";

const EASE = [0.22, 1, 0.36, 1] as const;

type FullItem = {
  sector: string;
  tagline: string;
  title: string;
  context: string;
  problem: string;
  solution: string;
  heroValue: string;
  heroLabel: string;
  results: { value: string; label: string }[];
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function CaseStudyDetailShell({ caseStudy }: { caseStudy: CaseStudy }) {
  const t = useTranslations("home.caseStudies");
  const tCta = useTranslations("home.cta");
  const item = t.raw(`items.${caseStudy.id}`) as FullItem;

  const currentIdx = CASE_STUDIES.findIndex((c) => c.id === caseStudy.id);
  const prev = currentIdx > 0 ? CASE_STUDIES[currentIdx - 1] : null;
  const next = currentIdx < CASE_STUDIES.length - 1 ? CASE_STUDIES[currentIdx + 1] : null;

  const LINE = "rgba(255,255,255,0.08)";

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        color: "#fff",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          height: "clamp(420px, 65vh, 700px)",
          overflow: "hidden",
        }}
      >
        <img
          src={caseStudy.image}
          alt={item.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Back link */}
        <div
          style={{
            position: "absolute",
            top: "clamp(5rem, 8vw, 7rem)",
            left: "clamp(1.5rem, 5vw, 5.5rem)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Retour
          </Link>
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(2rem, 5vw, 4rem)",
            left: "clamp(1.5rem, 5vw, 5.5rem)",
            right: "clamp(1.5rem, 5vw, 5.5rem)",
            maxWidth: 900,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* Badges */}
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: caseStudy.color,
                  background: `${caseStudy.color}20`,
                  border: `1px solid ${caseStudy.color}40`,
                  padding: "0.25rem 0.7rem",
                  borderRadius: "99px",
                }}
              >
                {item.sector}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "0.25rem 0.7rem",
                  borderRadius: "99px",
                }}
              >
                Pôle {t(`poleLabels.${caseStudy.pole}`)}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: "0 0 1rem",
              }}
            >
              {item.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
                maxWidth: "60ch",
              }}
            >
              {item.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Hero stat band ── */}
      <div
        style={{
          background: caseStudy.color,
          padding: "clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 5vw, 5.5rem)",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {item.heroValue}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.4,
            maxWidth: "40ch",
          }}
        >
          {item.heroLabel}
        </span>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(3rem, 7vw, 6rem) clamp(1.5rem, 5vw, 5.5rem)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {/* Context */}
        <Reveal>
          <div
            style={{
              padding: "1.5rem 2rem",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${LINE}`,
              borderLeft: `3px solid ${caseStudy.color}`,
              borderRadius: "0.75rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: caseStudy.color,
                margin: "0 0 0.6rem",
              }}
            >
              Contexte
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
              }}
            >
              {item.context}
            </p>
          </div>
        </Reveal>

        {/* Problem / Solution */}
        <div className="ps-grid">
          <Reveal delay={0}>
            <NarrativeBlock
              label={t("problemLabel")}
              text={item.problem}
              color="rgba(255,100,100,0.7)"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <NarrativeBlock
              label={t("solutionLabel")}
              text={item.solution}
              color={caseStudy.color}
            />
          </Reveal>
        </div>

        {/* Results */}
        <Reveal>
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 1.5rem",
              }}
            >
              {t("resultsLabel")}
            </p>
            <div className="results-grid">
              {item.results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${LINE}`,
                    borderRadius: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                      fontWeight: 700,
                      color: caseStudy.color,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {r.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.4,
                    }}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Prev / Next nav ── */}
      {(prev || next) && (
        <div
          style={{
            borderTop: `1px solid ${LINE}`,
            padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 5.5rem)",
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {prev ? (
            <Link
              href={`/cas-etudes/${prev.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Étude précédente
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/cas-etudes/${next.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              Étude suivante
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>
          )}
        </div>
      )}

      {/* ── CTA ── */}
      <CTASection
        eyebrow={tCta("eyebrow")}
        title={tCta("title")}
        description={tCta("description")}
        buttonText={tCta("buttonText")}
        buttonHref="/contact"
      />

      <FooterStrip />

      <style jsx global>{`
        .ps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .ps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}

function NarrativeBlock({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "1.75rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.75rem",
        height: "100%",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color,
          margin: "0 0 0.75rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
