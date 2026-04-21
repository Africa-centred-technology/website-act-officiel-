"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { blogPosts, categories } from "@/lib/blog-data";

const ease = [0.6, 0.08, 0.02, 0.99] as const;

const ORANGE      = "#D35400";
const ORANGE_LT   = "rgba(211,84,0,0.12)";
const ORANGE_GLOW = "rgba(211,84,0,0.3)";

/* Re-exported so other blog components (BlogShell, etc.) can consume them */
export const V = {
  bg:        "var(--bg-primary)",
  surface:   "var(--bg-secondary)",
  surface2:  "var(--bg-tertiary)",
  border:    "var(--border-color)",
  orange:    ORANGE,
  orangeLt:  ORANGE_LT,
  orangeGlow: ORANGE_GLOW,
  cream:     "var(--text-primary)",
  muted:     "var(--text-muted)",
  dim:       "var(--text-muted)",
  green:     "#52c97a",
};

export const FONT_DISPLAY = "var(--font-display)";
export const FONT_SERIF   = "var(--font-display)";
export const FONT_BODY    = "var(--font-body)";

function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  return screenSize;
}


export default function BlogHero() {
  const screenSize = useMediaQuery();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [activeTopic, setActiveTopic] = useState(0);
  const [topCategories, setTopCategories] = useState<{ label: string; value: string; count: number }[]>([]);

  useEffect(() => {
    const available = categories.filter((c) => c.value !== "all");
    const counted = available.map((c) => ({
      ...c,
      count: blogPosts.filter((p) => p.category === c.label).length,
    }));
    setTopCategories(counted.sort((a, b) => b.count - a.count).slice(0, 5));
  }, []);

const isMobile = screenSize === "mobile";
  const isTablet = screenSize === "tablet";

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={ref}
        style={{
          position: "relative",
          minHeight: isMobile ? "auto" : "100vh",
          display: "grid",
          gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 1fr",
          overflow: "hidden",
        }}
      >
        {/* ── Background orange glow ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 20% 60%, ${ORANGE_GLOW} 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ══════════ LEFT PANEL ══════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRight: !isMobile && !isTablet ? "1px solid rgba(255,255,255,0.07)" : "none",
            borderBottom: isMobile || isTablet ? "1px solid rgba(255,255,255,0.07)" : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "7rem 2rem 4rem" : isTablet ? "8rem 3.5rem 5rem" : "10rem 6rem 6rem",
            gap: "3rem",
            overflow: "hidden",
          }}
        >
          {/* Fine grid overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 90% 90% at 30% 50%, black 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 30% 50%, black 30%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Person reading — occupe tout le panneau */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Image
              src="/images/blog/reader.png"
              alt="Personne lisant un journal"
              width={600}
              height={780}
              style={{
                width: isMobile ? "75%" : isTablet ? "60%" : "82%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "bottom center",
                pointerEvents: "none",
                userSelect: "none",
              }}
              priority
            />
          </motion.div>
        </div>

        {/* ══════════ RIGHT PANEL ══════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isMobile ? "4rem 2rem 5rem" : isTablet ? "5rem 3.5rem" : "10rem 6rem 6rem",
            gap: isMobile ? "2rem" : "2.8rem",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: ORANGE_LT,
              border: `1px solid rgba(211,84,0,0.3)`,
              borderRadius: "999px",
              padding: "0.35rem 1rem 0.35rem 0.6rem",
              width: "fit-content",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0, boxShadow: `0 0 8px ${ORANGE}` }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: ORANGE }}>
              Veille & Insights
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isMobile ? "clamp(24px, 6vw, 34px)" : isTablet ? "clamp(28px, 4vw, 42px)" : "clamp(32px, 3vw, 48px)",
              lineHeight: 1.15,
              color: "#fff",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Décoder le présent pour
            <br />
            <em style={{ fontStyle: "italic", color: ORANGE }}>
              bâtir l&apos;avenir numérique
            </em>
            <br />
            de l&apos;Afrique.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            style={{
              fontSize: isMobile ? "14px" : "15px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.45)",
              maxWidth: "440px",
              margin: 0,
              fontFamily: "var(--font-body)",
            }}
          >
            Nos experts décryptent les grandes tendances qui façonnent le numérique africain — IA,
            souveraineté des données, cloud et Smart Cities.
          </motion.p>

          {/* Topic selector */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34, ease }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-body)",
            }}>
              Explorer par thème
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {topCategories.map((cat, i) => {
                const active = activeTopic === i;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveTopic(i)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: isMobile ? "6px 12px" : "8px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${active ? `rgba(211,84,0,0.5)` : "rgba(255,255,255,0.08)"}`,
                      background: active ? ORANGE_LT : "rgba(255,255,255,0.02)",
                      fontSize: isMobile ? "12px" : "13px",
                      fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "rgba(255,255,255,0.45)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "var(--font-body)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      }
                    }}
                  >
                    <span style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: active ? ORANGE : "rgba(255,255,255,0.2)",
                      flexShrink: 0,
                      boxShadow: active ? `0 0 6px ${ORANGE}` : "none",
                      transition: "background 0.2s",
                    }} />
                    {cat.label}
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: "4px",
                      background: active ? `rgba(211,84,0,0.2)` : "rgba(255,255,255,0.06)",
                      color: active ? ORANGE : "rgba(255,255,255,0.25)",
                    }}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.42, ease }}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}
          >
            <Link
              href={`/blog/articles?cat=${topCategories[activeTopic]?.value || ""}`}
              className="cta-btn"
            >
              <div className="cta-btn__border" />
              <div className="cta-btn__blur" />
              <div className="cta-btn__background" />
              <div className="cta-btn__inner">
                <span className="cta-btn__icon" />
                <span className="cta-btn__text">
                  Voir les articles · {topCategories[activeTopic]?.label || "Tech Trends"}
                </span>
              </div>
            </Link>

            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Contacter un expert
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  );
}
