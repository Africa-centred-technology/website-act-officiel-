"use client";

/**
 * BlogShowcaseSection — Sticky-stacking blog cards.
 *
 * Replicates the Moon-Mansion services pattern :
 *   • Each card uses `position: sticky` with a progressive top offset
 *     (via --i), so cards stack on top of each other as the user scrolls
 *   • Pure CSS effect — GSAP only adds the reveal animation + parallax
 *   • Requires `overflow-x: clip` (not hidden) on any ancestor so sticky
 *     keeps working — already set on Home.tsx's outer div.
 *
 * Responsive : on < 900px we disable the sticky stacking and fall back
 * to a normal vertical stack with simple card-by-card fade-in.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type BlogPost } from "@/lib/blog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const COLOR = "#D35400";

/** Offset applied from the viewport top to ALL sticky cards */
const STICKY_TOP_BASE = 80; // px
/** 0 = every card sticks at the same top → next card fully covers the
    previous one (no staircase reveal). Set to 44 for a staircase effect. */
const STICKY_STEP = 0; // px

/* ── Screen-size hook ─────────────────────────────────────────── */
function useScreenSize() {
  const [size, setSize] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const check = () => setSize(window.innerWidth < 900 ? "mobile" : "desktop");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return size;
}

/* ────────────────────────────────────────────────────────────── */

export default function BlogShowcaseSection() {
  const screenSize = useScreenSize();
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = screenSize === "mobile";
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shopify/blog")
      .then((r) => r.json())
      .then(({ posts }) => {
        if (!cancelled && Array.isArray(posts)) setPosts(posts);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const articles = posts.slice(0, 8);

  /* ── GSAP : reveal + parallax per card ───────────────────────── */
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

      cards.forEach((card) => {
        /* Reveal : staggered in-content fade + lift */
        gsap.fromTo(
          card.querySelectorAll<HTMLElement>(".reveal"),
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        /* Parallax : the image moves at a slower pace than the card */
        const img = card.querySelector<HTMLElement>(".card-image");
        if (img && !isMobile) {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
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
      className="blog-stack"
      style={{
        position: "relative",
        padding: isMobile ? "3rem 1.25rem" : "4rem clamp(1.5rem, 4vw, 4rem)",
        maxWidth: 1400,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Header ── */}
      <Header />

      {/* ── Mini section head (count) ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "1.5rem 0",
          fontSize: "0.75rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "2rem",
        }}
      >
        <span>(Blog)</span>

      </div>

      {/* ── Sticky stack of cards ── */}
      <div>
        {articles.map((post, i) => (
          <StackCard
            key={post.slug}
            post={post}
            index={i}
            total={articles.length}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────────── */
function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "1.5rem",
        flexWrap: "wrap",
        marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
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
          maxWidth: "30ch",
        }}
      >
        Nos Dernières{" "}
        <span style={{ color: COLOR, fontStyle: "italic" }}>publications</span>
      </h2>

      <Link
        href="/blog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
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
          e.currentTarget.style.color = COLOR;
          e.currentTarget.style.borderColor = COLOR;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
        }}
      >
        Voir le blog
        <ArrowUpRight size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STACK CARD — sticky with progressive top offset
───────────────────────────────────────────────────────────── */

type Post = BlogPost;

function StackCard({
  post,
  index,
  total,
  isMobile,
}: {
  post: Post;
  index: number;
  total: number;
  isMobile: boolean;
}) {
  /* Fallback-safe reads — Shopify posts may not have every field */
  const format = (post as unknown as { format?: string }).format ?? post.category;
  const readTime = (post as unknown as { readTime?: string }).readTime;
  const date = (post as unknown as { date?: string }).date;

  const stickyTop = STICKY_TOP_BASE + STICKY_STEP * index;

  return (
    <article
      className="stack-card"
      style={{
        position: isMobile ? "relative" : "sticky",
        top: isMobile ? undefined : `${stickyTop}px`,
        height: isMobile ? "auto" : "clamp(22rem, 52vh, 32rem)",
        maxWidth: isMobile ? "100%" : "2500px",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: isMobile ? "2rem" : "2rem",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5)",
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "0.65fr 1fr",
            gap: isMobile ? 0 : "clamp(1.5rem, 3vw, 3rem)",
            height: "100%",
            padding: isMobile ? 0 : "clamp(1.25rem, 2vw, 2rem)",
          }}
        >
          {/* ── Image ── */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: isMobile ? 0 : "1.25rem",
              height: isMobile ? "240px" : "100%",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="card-image"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.75)",
                transform: isMobile ? "none" : "scale(1.12)",
                willChange: "transform",
              }}
            />
            {format && (
              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  left: "1.25rem",
                  padding: "0.4rem 0.8rem",
                  background: COLOR,
                  color: "#fff",
                  borderRadius: "0.3rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  zIndex: 2,
                }}
              >
                {format}
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div
            style={{
              padding: isMobile ? "1.5rem" : "1.25rem 1rem 0.5rem 0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
          

            <div>
              {/* Meta row */}
              <div
                className="reveal"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.65)",
                  flexWrap: "wrap",
                }}
              >
                {readTime && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: COLOR,
                      }}
                    />
                    {readTime}
                  </span>
                )}
                {readTime && date && <span>•</span>}
                {date && <span>{date}</span>}
              </div>

              {/* Title */}
              <h3
                className="reveal"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile
                    ? "1.4rem"
                    : "clamp(1.5rem, 2.6vw, 2.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  margin: "0 0 1rem",
                  textTransform: "uppercase",
                }}
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              <p
                className="reveal"
                style={{
                  fontSize: isMobile ? "1.05rem" : "clamp(1.1rem, 1.3vw, 1.35rem)",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.78)",
                  margin: 0,
                  maxWidth: "100%",
                  width: "100%",
                }}
              >
                {post.excerpt}
              </p>
            </div>

            {/* Footer : CTA */}
            <div
              className="reveal"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginTop: "2rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: COLOR,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Lire l'article complet
                <ArrowRight size={18} />
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 500,
                }}
              >
                {post.category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
