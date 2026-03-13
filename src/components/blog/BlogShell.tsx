"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { blogPosts, categories } from "@/lib/blog-data";
import BlogHero, { V, FONT_BODY } from "./BlogHero";
import FooterStrip from "@/components/layout/FooterStrip";

export default function BlogShell() {
  const containerRef = useRef(null);
  
  // Parallax Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero fades and shrinks slightly faster (0.15 range)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Spacer line grows based on scroll
  const lineScaleY = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  return (
    <div ref={containerRef} style={{ background: V.bg, minHeight: "100vh", position: "relative" }}>
      
      {/* ── HERO ── 
          Wrapped in a motion div for parallax exit
      */}
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          scale: heroScale,
          y: heroY,
          position: "sticky",
          top: 0,
          zIndex: 1
        }}
      >
        <BlogHero />
      </motion.div>


      {/* ── IMMERSIVE SPACER ── 
          Acts as the bridge between Vision and Content
      */}
      <section
        style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          marginTop: "-10vh",
        }}
      >
        {/* The growing vertical line */}
        <motion.div 
          style={{ 
            width: "1px", 
            height: "15rem", 
            background: `linear-gradient(to bottom, transparent, ${V.orange}, transparent)`,
            scaleY: lineScaleY,
            originY: 0,
            boxShadow: `0 0 15px ${V.orange}44`
          }} 
        />

        {/* Discreet bridge text */}
        <motion.div
          style={{ 
            opacity: textOpacity,
            marginTop: "3rem",
            textAlign: "center"
          }}
        >
          <span style={{
            color: V.dim,
            fontSize: "11px",
            fontFamily: FONT_BODY,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            fontWeight: 600
          }}>
            Explorez nos expertises
          </span>
          <div style={{ 
            marginTop: "1.5rem", 
            fontSize: "2rem", 
            color: V.orange,
            animation: "bounce 2s infinite"
          }}>
            ↓
          </div>
        </motion.div>

        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-5px);}
            60% {transform: translateY(-3px);}
          }
        `}</style>
      </section>


      {/* ── CATEGORIES HUB ── 
          Z-Index is higher so it slides "over" the fading hero
      */}
      <section
        style={{
          padding: "12rem 0",
          borderTop: `1px solid ${V.border}`,
          borderBottom: `1px solid ${V.border}`,
          background: V.bg,
          position: "relative",
          overflow: "hidden",
          zIndex: 10,
          boxShadow: "0 -30px 60px rgba(0,0,0,0.04)"
        }}
      >
        {/* Subtle gradient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,92,26,0.06) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.6, 0.08, 0.02, 0.99] }}
            style={{ textAlign: "center", marginBottom: "8rem" }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "2.5rem",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: V.orange,
              fontFamily: FONT_BODY,
            }}>
              <span style={{ width: "32px", height: "1px", background: V.orange, opacity: 0.6 }} />
              Dossiers & Thématiques
              <span style={{ width: "32px", height: "1px", background: V.orange, opacity: 0.6 }} />
            </div>

            <h2
              className="section-header-title"
              style={{
                fontSize: "clamp(3.5rem, 5vw, 5.5rem)",
                fontFamily: "'Bebas Neue', Futura, sans-serif",
                fontWeight: 400,
                color: V.cream,
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
                margin: 0,
                lineHeight: 1,
              }}
            >
              L'écosystème <span style={{ color: V.orange }}>par Rubriques</span>
            </h2>

            <p style={{
              color: V.muted,
              fontSize: "16px",
              maxWidth: "58rem",
              margin: "2rem auto 0",
              lineHeight: 1.8,
              fontFamily: FONT_BODY,
            }}>
              Naviguez à travers nos piliers stratégiques pour accéder aux analyses approfondies de nos consultants et experts métiers.
            </p>
          </motion.div>

          <style>{`
            .categories-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 3.2rem;
            }
            @media (max-width: 992px) {
              .categories-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 768px) {
              .categories-grid { grid-template-columns: 1fr; gap: 2rem; }
              .section-header-title { font-size: clamp(3rem, 8vw, 4rem) !important; }
            }
          `}</style>

          {/* Responsive grid with enhanced staggered reveal */}
          <div className="categories-grid">
            {categories.filter(c => c.value !== "all").map((cat, i) => {
              const articleCount = blogPosts.filter(p => p.category === cat.label).length;

              return (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, y: 60, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1], // Custom easeOutExpo
                  }}
                >
                  <Link
                    href={`/blog/articles?cat=${cat.value}`}
                    style={{
                      display: "block",
                      position: "relative",
                      height: "38rem",
                      borderRadius: "24px",
                      overflow: "hidden",
                      textDecoration: "none",
                      border: `1px solid ${V.border}`,
                      background: V.surface,
                      transition: "transform 0.7s cubic-bezier(0.2, 1, 0.2, 1), border-color 0.4s, box-shadow 0.7s",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translateY(-18px) scale(1.02)";
                      el.style.borderColor = `${V.orange}66`;
                      el.style.boxShadow = `0 40px 80px -20px rgba(0,0,0,0.9), 0 0 30px ${V.orange}15`;
                      const img = el.querySelector('.cat-img') as HTMLImageElement;
                      if (img) img.style.transform = "scale(1.18) rotate(1deg)";
                      const exploreBtn = el.querySelector('.explore-btn') as HTMLElement;
                      if (exploreBtn) { exploreBtn.style.transform = "translateY(0)"; exploreBtn.style.opacity = "1"; }
                      const line = el.querySelector('.accent-line') as HTMLDivElement;
                      if (line) line.style.width = "100%";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform = "translateY(0) scale(1)";
                      el.style.borderColor = V.border;
                      el.style.boxShadow = "0 25px 50px -12px rgba(0,0,0,0.5)";
                      const img = el.querySelector('.cat-img') as HTMLImageElement;
                      if (img) img.style.transform = "scale(1) rotate(0deg)";
                      const exploreBtn = el.querySelector('.explore-btn') as HTMLElement;
                      if (exploreBtn) { exploreBtn.style.transform = "translateY(20px)"; exploreBtn.style.opacity = "0"; }
                      const line = el.querySelector('.accent-line') as HTMLDivElement;
                      if (line) line.style.width = "40px";
                    }}
                  >
                    {/* Background Image */}
                    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
                      <Image
                        src={cat.image || "/blog/default-cat.jpg"}
                        alt={cat.label}
                        fill
                        className="cat-img"
                        style={{
                          objectFit: "cover",
                          transition: "transform 1.4s cubic-bezier(0.2, 1, 0.2, 1)",
                          opacity: 0.45,
                        }}
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(12,8,4,0.92) 0%, rgba(12,8,4,0.72) 40%, rgba(12,8,4,0.15) 100%)",
                      zIndex: 2,
                    }} />
                    
                    {/* Content */}
                    <div style={{ 
                      position: "absolute", 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      padding: "4.8rem 4rem 4rem", 
                      zIndex: 3, 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "1.4rem"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "0.6rem 1.4rem",
                        background: "rgba(0,0,0,0.25)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "100px",
                        backdropFilter: "blur(12px)",
                        width: "fit-content"
                      }}>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: V.orange, fontFamily: FONT_BODY }}>{articleCount}</span>
                        <span style={{ fontSize: "1rem", fontWeight: 500, color: V.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONT_BODY }}>Analyses</span>
                      </div>

                      <h3 style={{ 
                        fontSize: "3.4rem", 
                        fontFamily: "'Bebas Neue', Futura, sans-serif", 
                        fontWeight: 400, 
                        color: V.cream, 
                        margin: 0,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        lineHeight: 1,
                      }}>{cat.label}</h3>
                      
                      {cat.description && (
                        <p style={{ 
                          color: V.muted, 
                          fontSize: "1.5rem", 
                          lineHeight: 1.6, 
                          margin: 0,
                          maxWidth: "90%",
                          display: "-webkit-box", 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: "vertical", 
                          overflow: "hidden",
                          fontFamily: FONT_BODY,
                          fontWeight: 400
                        }}>{cat.description}</p>
                      )}

                      {/* Explore badge — appears on hover */}
                      <div 
                        className="explore-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginTop: "0.8rem",
                          transform: "translateY(20px)",
                          opacity: 0,
                          transition: "all 0.6s cubic-bezier(0.2, 1, 0.2, 1)",
                        }}
                      >
                        <span style={{ color: V.orange, fontSize: "1.2rem", fontWeight: 700, fontFamily: FONT_BODY, letterSpacing: "0.05em", textTransform: "uppercase" }}>Explorer</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={V.orange} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Dynamic Accent Line */}
                      <div 
                        className="accent-line"
                        style={{
                          width: "40px",
                          height: "3px",
                          background: V.orange,
                          marginTop: "0.8rem",
                          transition: "width 0.6s cubic-bezier(0.2, 1, 0.2, 1)",
                          boxShadow: `0 0 15px ${V.orange}55`
                        }} 
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── CTA: Voir tous les articles ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.6, 0.08, 0.02, 0.99] }}
            style={{ textAlign: "center", marginTop: "5rem" }}
          >
            <Link
              href="/blog/articles"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "18px 40px",
                background: "transparent",
                border: `1px solid ${V.orange}`,
                borderRadius: "12px",
                color: V.orange,
                fontFamily: FONT_BODY,
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = V.orange;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.boxShadow = `0 8px 32px ${V.orangeGlow}`;
                e.currentTarget.style.transform = "translateY(-2px)";
                const arrow = e.currentTarget.querySelector('.cta-arrow') as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = V.orange;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
                const arrow = e.currentTarget.querySelector('.cta-arrow') as HTMLElement;
                if (arrow) arrow.style.transform = "translateX(0)";
              }}
            >
              Voir tous les articles
              <svg className="cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.3s" }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ── NEWSLETTER CTA ── */}
      <section
        style={{
          padding: "8rem 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <div
            className="section-label"
            style={{ justifyContent: "center", marginBottom: "3rem" }}
          >
            <span className="diamond diamond--sm" />
            <span>Restez informé</span>
          </div>
          <h2
            style={{
              fontSize: "var(--font-50)",
              fontFamily: "Futura, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: "2rem",
              lineHeight: 1,
            }}
          >
            La veille tech africaine,
            <br />
            <span style={{ color: "#D35400" }}>chaque semaine</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "var(--font-18)",
              maxWidth: "48rem",
              margin: "0 auto 4rem",
              lineHeight: 1.7,
            }}
          >
            Recevez nos analyses sur l&apos;IA, le cloud, la cybersécurité et
            l&apos;innovation digitale en Afrique directement dans votre boîte mail.
          </p>
          <Link href="/contact" className="cta-btn">
            <div className="cta-btn__border" />
            <div className="cta-btn__blur" />
            <div className="cta-btn__background" />
            <div className="cta-btn__inner">
              <span className="cta-btn__icon" />
              <span className="cta-btn__text">S&apos;abonner à la veille</span>
            </div>
          </Link>
        </div>
      </section>

      <FooterStrip />
    </div>
  );
}

/* ─── Featured Card ─── */
function FeaturedCard({
  post,
  index,
}: {
  post: (typeof blogPosts)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.6, 0.08, 0.02, 0.99] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <div
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "4rem",
            height: "100%",
            minHeight: "36rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "border-color 0.4s ease, background 0.4s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "#D35400";
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(211,84,0,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(255,255,255,0.03)";
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              opacity: 0.15,
              pointerEvents: "none",
              maskImage: "linear-gradient(to left, black, transparent)",
              WebkitMaskImage: "linear-gradient(to left, black, transparent)",
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* Glow corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "20rem",
              height: "20rem",
              background: `radial-gradient(circle at top right, ${post.categoryColor}18, transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          <div>
            {/* Category + featured badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                marginBottom: "2.5rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "0.5rem 1.2rem",
                  background: `${post.categoryColor}22`,
                  border: `1px solid ${post.categoryColor}55`,
                  color: post.categoryColor,
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {post.category}
              </span>
              <span
                style={{
                  padding: "0.5rem 1.2rem",
                  background: "rgba(243,156,18,0.12)",
                  border: "1px solid rgba(243,156,18,0.4)",
                  color: "#F39C12",
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                ★ À la une
              </span>
            </div>

            <h2
              style={{
                fontSize: "var(--font-25)",
                fontFamily: "Futura, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: "2rem",
                letterSpacing: "-0.01em",
              }}
            >
              {post.title}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "1.4rem",
                lineHeight: 1.7,
              }}
            >
              {post.excerpt}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "3rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: "2rem" }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "1.1rem",
                  fontFamily: "Futura, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {post.date}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "1.1rem",
                  fontFamily: "Futura, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {post.readTime} de lecture
              </span>
            </div>
            <span
              style={{
                color: "#D35400",
                fontFamily: "Futura, sans-serif",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Lire →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Article Card ─── */
function ArticleCard({
  post,
  index,
}: {
  post: (typeof blogPosts)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.6, 0.08, 0.02, 0.99] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: "block", textDecoration: "none", height: "100%" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "1.2rem",
            transition: "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = `${post.categoryColor}66`;
            el.style.background = "rgba(255,255,255,0.04)";
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = "rgba(255,255,255,0.07)";
            el.style.background = "rgba(255,255,255,0.025)";
            el.style.transform = "translateY(0)";
          }}
        >
          {/* Article Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "22rem",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, rgba(10,20,16,0.9))",
              }}
            />
          </div>
          {/* Card Content */}
          <div style={{ padding: "2.5rem 3rem 3rem", display: "flex", flexDirection: "column", flex: 1 }}>
          <div>
            {/* Category */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  padding: "0.4rem 1rem",
                  background: `${post.categoryColor}18`,
                  border: `1px solid ${post.categoryColor}44`,
                  borderRadius: "2rem",
                  color: post.categoryColor,
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {post.category}
              </span>
            </div>

            <h3
              style={{
                fontSize: "var(--font-20)",
                fontFamily: "Futura, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.15,
                color: "#fff",
                marginBottom: "1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              {post.title}
            </h3>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "1.3rem",
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "1.1rem",
                  fontFamily: "Futura, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {post.readTime}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "1.1rem",
                  fontFamily: "Futura, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {post.format}
              </span>
            </div>
            <span
              style={{
                color: post.categoryColor,
                fontFamily: "Futura, sans-serif",
                fontSize: "1.1rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: 0.8,
              }}
            >
              Lire →
            </span>
          </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
