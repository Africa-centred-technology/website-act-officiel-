"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { blogPosts, categories } from "@/lib/blog-data";

const ease = [0.6, 0.08, 0.02, 0.99] as const;

/* ─── Design tokens ─── */
export const V = {
  bg:        "#070E1C",
  surface:   "#0d1b2e",
  surface2:  "#122340",
  border:    "rgba(255,255,255,0.08)",
  orange:    "#e85c1a",
  orangeLt:  "rgba(232,92,26,0.15)",
  orangeGlow:"rgba(232,92,26,0.35)",
  cream:     "#f0ead8",
  muted:     "rgba(240,234,216,0.5)",
  dim:       "rgba(240,234,216,0.25)",
  green:     "#52c97a",
};

export const FONT_DISPLAY = "var(--font-display)";
export const FONT_SERIF   = "var(--font-display)";
export const FONT_BODY    = "var(--font-body)";

const AFRICA_PATH = "M50 5C35 5 22 12 18 22c-4 10-2 20-6 28-4 8-7 14-4 24 3 10 12 16 18 26 6 10 10 18 18 23 8 5 16 2 22-5 6-7 8-16 14-24 6-8 12-14 12-24 0-10-6-18-8-26-2-8 0-18-6-26C72 10 62 5 50 5Z";

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

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
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

/* ═══════════════════════════════════════════════ */
/* ═══ Custom Cursor Component ═══ */
/* ═══════════════════════════════════════════════ */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + "px";
      cursorRef.current.style.top = e.clientY + "px";
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll("button, a, .topic, .av, .cta-main, .cta-secondary");
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [onMove]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        width: hovering ? "40px" : "10px",
        height: hovering ? "40px" : "10px",
        borderRadius: "50%",
        background: hovering ? V.orangeLt : V.orange,
        border: hovering ? `1px solid ${V.orange}` : "none",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        transition: "transform 0.1s, width 0.25s, height 0.25s, background 0.25s",
        mixBlendMode: "screen" as const,
      }}
    />
  );
}



/* ═══════════════════════════════════════════════ */
/* ═══ BlogHero ═══ */
/* ═══════════════════════════════════════════════ */
export default function BlogHero() {
  const screenSize = useMediaQuery();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [activeTopic, setActiveTopic] = useState(0);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [topCategories, setTopCategories] = useState<{label: string; value: string; count: number}[]>([]);

  useEffect(() => {
    const available = categories.filter((c) => c.value !== "all");
    const counted = available.map((c) => ({
      ...c,
      count: blogPosts.filter((p) => p.category === c.label).length,
    }));
    const sorted = counted.sort((a, b) => b.count - a.count);
    setTopCategories(sorted.slice(0, 4));
  }, []);

  const domainesCount = categories.filter((c) => c.value !== "all").length;
  const activeLabel = topCategories[activeTopic]?.label || "Tech Trends";

  return (
    <>
    <CustomCursor />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        className="hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: screenSize === 'desktop' ? "1fr 1fr" : "1fr",
          minHeight: screenSize === 'mobile' ? "auto" : "calc(100vh - 6rem)",
        }}
      >
        {/* ═══ LEFT: Giant title + stats ═══ */}
        <div
          className="hero-left"
          style={{
            position: "relative",
            borderRight: screenSize === 'desktop' ? `1px solid ${V.border}` : "none",
            borderBottom: screenSize !== 'desktop' ? `1px solid ${V.border}` : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: screenSize === 'mobile' ? "6rem 2rem 4rem 2rem" : screenSize === 'tablet' ? "6rem 3rem 4rem 3rem" : "8rem 6.4rem",
            overflow: "hidden",
          }}
        >
          {/* Grid lines background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(${V.border} 1px, transparent 1px),
                linear-gradient(90deg, ${V.border} 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              opacity: 0.4,
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* BLOG giant text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="title-display"
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: screenSize === 'mobile' ? "clamp(50px, 12vw, 90px)" : screenSize === 'tablet' ? "clamp(60px, 10vw, 110px)" : "clamp(70px, 11vw, 140px)",
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: V.cream,
              position: "relative",
              zIndex: 1,
              WebkitTextStroke: "1px rgba(240,234,216,0.1)",
              display: "flex",
              flexWrap: "wrap",
              columnGap: "0.25em"
            }}
          >
            <span style={{ whiteSpace: "nowrap", display: "inline-flex" }}>
              BL
              {/* O with Africa SVG inside */}
              <span style={{ display: "inline-block", position: "relative" }}>
                O
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -52%)",
                    width: "55%",
                    height: "62%",
                    background: "linear-gradient(135deg, #1e2d1e, #2d1e10)",
                    border: "1px solid rgba(232,92,26,0.4)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(232,92,26,0.15)",
                  }}
                >
                  <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" style={{ width: "45%", fill: V.orange }}>
                    <path d={AFRICA_PATH} />
                  </svg>
                </div>
              </span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `2px ${V.orange}`,
                  filter: `drop-shadow(0 0 30px ${V.orangeGlow})`,
                }}
              >
                G
              </span>
            </span>
            <span style={{ whiteSpace: "nowrap", display: "inline-flex" }}>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `2px ${V.orange}`,
                  filter: `drop-shadow(0 0 30px ${V.orangeGlow})`,
                }}
              >
                A
              </span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `2px ${V.orange}`,
                  filter: `drop-shadow(0 0 30px ${V.orangeGlow})`,
                }}
              >
                C
              </span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: `2px ${V.orange}`,
                  filter: `drop-shadow(0 0 30px ${V.orangeGlow})`,
                }}
              >
                T
              </span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="stats-container"
            style={{
              display: "flex",
              gap: 0,
              marginTop: screenSize === 'mobile' ? "2rem" : "clamp(2rem, 5vw, 52px)",
              position: "relative",
              zIndex: 1,
              border: `1px solid ${V.border}`,
              borderRadius: "12px",
              overflow: "hidden",
              background: V.surface,
              width: "fit-content",
              flexWrap: screenSize === 'mobile' ? 'wrap' : 'nowrap',
            }}
          >
            {[
              { num: blogPosts.length.toString(), label: "Articles" },
              { num: "+15", label: "Experts" },
              { num: domainesCount.toString(), label: "Domaines" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="stat-item"
                style={{
                  padding: screenSize === 'mobile' ? "15px 20px" : "20px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  position: "relative",
                  width: screenSize === 'mobile' && i < 2 ? 'calc(50% - 0.5px)' : 'auto',
                }}
              >
                {i > 0 && (
                  <div
                    className="stat-divider"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: "1px",
                      background: V.border,
                    }}
                  />
                )}
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 4vw, 38px)", color: V.orange, lineHeight: 1 }}>
                  {stat.num}
                </span>
                <span
                  style={{
                    fontSize: "clamp(12px, 2vw, 15px)",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: V.muted,
                    fontFamily: FONT_BODY,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ═══ RIGHT: Content + actions ═══ */}
        <div
          className="hero-right"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: screenSize === 'mobile' ? "4rem 2rem" : screenSize === 'tablet' ? "6rem 3rem" : "8rem 7.2rem",
            gap: screenSize === 'mobile' ? "24px" : "32px",
          }}
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px",
              fontSize: "13px",
              color: V.dim,
              letterSpacing: "0.08em",
              fontFamily: FONT_BODY,
            }}
          >
            <span style={{ color: V.cream, fontWeight: 600 }}>Accueil</span>
            <span style={{ color: V.dim }}> › </span>
            <span>Blog</span>
            <span style={{ color: V.dim }}> › </span>
            <span style={{ color: hasUserSelected && topCategories[activeTopic]?.label ? V.orange : V.dim }}>
               {hasUserSelected && topCategories[activeTopic]?.label ? topCategories[activeTopic].label : "Toutes les rubriques"}
            </span>
          </motion.nav>

        

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            style={{
              fontFamily: FONT_SERIF,
              fontSize: screenSize === 'mobile' ? "clamp(22px, 5vw, 32px)" : screenSize === 'tablet' ? "clamp(26px, 4vw, 38px)" : "clamp(28px, 3vw, 44px)",
              lineHeight: 1.2,
              color: V.cream,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Décoder le présent pour<br />
            <em style={{ fontStyle: "italic", color: V.orange }}>bâtir l&apos;avenir numérique</em>
            <br />
            de l&apos;Afrique.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            style={{
              fontSize: screenSize === 'mobile' ? "14px" : "16px",
              lineHeight: 1.75,
              color: V.muted,
              maxWidth: "500px",
              margin: 0,
              fontFamily: FONT_BODY,
            }}
          >
            Chez{" "}
            <strong style={{ color: V.cream, fontWeight: 600 }}>
              Africa Centred Technology (ACT)
            </strong>
            , nos experts décryptent les grandes tendances qui façonnent le numérique africain — IA,
            souveraineté des données, cloud et Smart Cities.
          </motion.p>

          {/* Topic selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45, ease }}
          >
            <div
              style={{
                fontSize: screenSize === 'mobile' ? "12px" : "15px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: V.dim,
                marginBottom: "10px",
                fontFamily: FONT_BODY,
              }}
            >
              Explorer par thème
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: screenSize === 'mobile' ? "6px" : "8px" }}>
              {topCategories.map((cat, i) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveTopic(i);
                    setHasUserSelected(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: screenSize === 'mobile' ? "5px" : "7px",
                    padding: screenSize === 'mobile' ? "7px 12px" : "9px 16px",
                    borderRadius: "8px",
                    border: activeTopic === i ? `1px solid ${V.orange}` : `1px solid ${V.border}`,
                    background: activeTopic === i ? V.orangeLt : V.surface,
                    fontSize: screenSize === 'mobile' ? "12px" : "14px",
                    fontWeight: 500,
                    color: activeTopic === i ? V.cream : V.muted,
                    cursor: "none",
                    transition: "all 0.2s",
                    userSelect: "none" as const,
                    fontFamily: FONT_BODY,
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: activeTopic === i ? V.orange : V.muted,
                      boxShadow: activeTopic === i ? `0 0 8px ${V.orange}` : "none",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  />
                  {cat.label}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      background: activeTopic === i ? "rgba(232,92,26,0.2)" : "rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      color: activeTopic === i ? V.orange : V.dim,
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Link
              href={`/blog/articles?cat=${topCategories[activeTopic]?.value || ""}`}
              className="cta-main"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: V.orange,
                color: "white",
                fontFamily: FONT_BODY,
                fontSize: screenSize === 'mobile' ? "13px" : "15px",
                fontWeight: 600,
                padding: screenSize === 'mobile' ? "14px 22px" : "16px 28px",
                border: "none",
                borderRadius: "10px",
                textDecoration: "none",
                transition: "all 0.3s",
                width: "fit-content",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff6d2b";
                e.currentTarget.style.boxShadow = `0 8px 32px ${V.orangeGlow}`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = V.orange;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Voir les articles · {activeLabel}
              <svg
                width={screenSize === 'mobile' ? "14" : "16"}
                height={screenSize === 'mobile' ? "14" : "16"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/contact"
              className="cta-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: V.muted,
                fontFamily: FONT_BODY,
                fontSize: "12px",
                fontWeight: 500,
                padding: 0,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = V.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = V.muted;
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Contacter un expert
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65, ease }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingTop: "24px",
              borderTop: `1px solid ${V.border}`,
            }}
          >
            <div style={{ display: "flex" }}>
              {["AT", "BK", "CM"].map((initials, i) => (
                <div
                  key={initials}
                  className="av"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: `2px solid ${V.bg}`,
                    background: V.surface2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    fontWeight: 700,
                    marginLeft: i === 0 ? 0 : "-8px",
                    color: V.orange,
                    transition: "transform 0.2s",
                    fontFamily: FONT_BODY,
                    position: "relative",
                    zIndex: 4 - i,
                  }}
                >
                  {initials}
                </div>
              ))}
              <div
                className="av"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: `2px solid ${V.bg}`,
                  background: V.surface2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 700,
                  marginLeft: "-8px",
                  color: V.orange,
                  fontFamily: FONT_BODY,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                +12
              </div>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: V.muted,
                lineHeight: 1.5,
                fontFamily: FONT_BODY,
                margin: 0,
              }}
            >
              Rédigé par{" "}
              <strong style={{ color: V.cream, fontWeight: 600 }}>+15 experts africains</strong>
              <br />
              en technologie et innovation.
            </p>
          </motion.div>


        </div>
      </section>
    </>
  );
}
