"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Share2, Linkedin, Twitter, Link2, Facebook } from "lucide-react";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

const ease = [0.6, 0.08, 0.02, 0.99] as const;

export default function BlogPostShell({ post }: { post: BlogPost }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const recentPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 2;
      const commonKeywords = p.keywords.filter(kw => post.keywords.includes(kw));
      score += commonKeywords.length;
      return { post: p, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((p) => p.post)
    .slice(0, 3);

  return (
    <div style={{ background: "#06120e", minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          paddingTop: "14rem",
          paddingBottom: "8rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "75vh",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Full Image Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover", opacity: 0.75 }}
            priority
          />
        </div>

        {/* Dark Gradient Overlay for Readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(6,18,14,0.9) 85%, #06120e 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            style={{ marginBottom: "3rem" }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontFamily: "Futura, sans-serif",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255,255,255,0.4)")
              }
            >
              ← Retour au Blog
            </Link>
          </motion.div>

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            style={{ marginBottom: "2.5rem" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 1.6rem",
                background: `${post.categoryColor}20`,
                border: `1px solid ${post.categoryColor}55`,
                borderRadius: "2rem",
                color: post.categoryColor,
                fontFamily: "Futura, sans-serif",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            style={{
              fontSize: "var(--font-50)",
              fontFamily: "Futura, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: "3rem",
              maxWidth: "90rem",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {post.title}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <MetaItem label="Date" value={post.date} />
            <MetaItem label="Lecture" value={post.readTime} />
            <MetaItem label="Format" value={post.format} />
            <MetaItem label="Cible" value={post.target} />
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ paddingBottom: "10rem" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 34rem",
            gap: "8rem",
          }}
        >
          {/* Article body */}
          <article style={{ maxWidth: "100%" }}>
            {/* Keywords (mobile/top) */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                marginBottom: "5rem",
                paddingBottom: "3rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {post.keywords.map((kw) => (
                <span
                  key={kw}
                  style={{
                    padding: "0.4rem 1.2rem",
                    background: "rgba(211,84,0,0.08)",
                    border: "1px solid rgba(211,84,0,0.2)",
                    borderRadius: "2rem",
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Futura, sans-serif",
                    fontSize: "1.1rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  #{kw}
                </span>
              ))}
            </div>

            {/* Sections */}
            {post.sections.map((section, i) => (
              <ContentSection key={i} section={section} index={i} categoryColor={post.categoryColor} />
            ))}

            {/* Back + Share row */}
            <div
              style={{
                marginTop: "8rem",
                paddingTop: "4rem",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "2rem",
              }}
            >
              <Link href="/blog" className="cta-btn">
                <div className="cta-btn__border" />
                <div className="cta-btn__blur" />
                <div className="cta-btn__background" />
                <div className="cta-btn__inner">
                  <span className="cta-btn__icon" />
                  <span className="cta-btn__text">Tous les articles</span>
                </div>
              </Link>

              <Link href="/contact" className="cta-btn">
                <div className="cta-btn__border" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                <div className="cta-btn__blur" />
                <div className="cta-btn__background" />
                <div className="cta-btn__inner">
                  <span className="cta-btn__icon" />
                  <span className="cta-btn__text">Un projet ? Parlons-en</span>
                </div>
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div
              style={{
                position: "sticky",
                top: "12rem",
                display: "flex",
                flexDirection: "column",
                gap: "4rem",
              }}
            >
              {/* Share Section */}
              <div
                style={{
                  padding: "3rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.2rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Futura, sans-serif",
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: "2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  <Share2 size={14} /> Partager l&apos;article
                </p>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <ShareIcon icon={<Linkedin size={18} />} label="LinkedIn" />
                  <ShareIcon icon={<Twitter size={18} />} label="Twitter" />
                  <ShareIcon icon={<Facebook size={18} />} label="Facebook" />
                  <ShareIcon icon={<Link2 size={18} />} label="Copier" />
                </div>
              </div>

              {/* Other Articles Section */}
              <div
                style={{
                  padding: "3rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.2rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Futura, sans-serif",
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: "2.5rem",
                  }}
                >
                  Articles récents
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2.5rem",
                  }}
                >
                  {recentPosts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "8rem",
                          height: "6rem",
                          position: "relative",
                          flexShrink: 0,
                          borderRadius: "0.8rem",
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Image
                          src={rp.image}
                          alt={rp.title}
                          fill
                          style={{ objectFit: "cover", opacity: 0.8 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            color: "rgba(255,255,255,0.8)",
                            fontSize: "1.25rem",
                            fontFamily: "Futura, sans-serif",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            marginBottom: "0.5rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {rp.title}
                        </h4>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "1rem",
                            fontFamily: "Futura, sans-serif",
                            textTransform: "uppercase",
                          }}
                        >
                          {rp.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Keywords (Sidebar version) */}
              <div
                style={{
                  padding: "3rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "1.2rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "Futura, sans-serif",
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.35)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Mots-clés
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
                  {post.keywords.map((kw) => (
                    <span
                      key={kw}
                      style={{
                        padding: "0.4rem 1rem",
                        background: "rgba(211,84,0,0.1)",
                        border: "1px solid rgba(211,84,0,0.25)",
                        borderRadius: "2rem",
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Futura, sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      {relatedPosts.length > 0 && (
        <section style={{ paddingBottom: "10rem" }}>
          <div className="container">
            <h2
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontFamily: "Futura, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "#fff",
                marginBottom: "4rem",
                textAlign: "center",
              }}
            >
              Articles <span style={{ color: post.categoryColor }}>Connexes</span>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 34rem), 1fr))",
                gap: "3rem",
              }}
            >
              {relatedPosts.map((rp, i) => (
                <RelatedArticleCard key={rp.slug} relatedPost={rp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── Meta Item ─── */
function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Futura, sans-serif",
          fontSize: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.3)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "Futura, sans-serif",
          fontSize: "1.3rem",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── Share Icon ─── */
function ShareIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      style={{
        width: "4rem",
        height: "4rem",
        borderRadius: "1rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(211,84,0,0.15)";
        e.currentTarget.style.borderColor = "rgba(211,84,0,0.4)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
      }}
    >
      {icon}
    </button>
  );
}

/* ─── Content Section ─── */
function ContentSection({
  section,
  index,
  categoryColor,
}: {
  section: BlogPost["sections"][0];
  index: number;
  categoryColor: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.6, 0.08, 0.02, 0.99] }}
      style={{
        marginBottom: "5rem",
        ...(section.isConclusion
          ? {
            padding: "3rem 3.5rem",
            background: `${categoryColor}0D`,
            borderLeft: `3px solid ${categoryColor}`,
          }
          : {}),
      }}
    >
      {section.title && (
        <h2
          style={{
            fontSize: "var(--font-25)",
            fontFamily: "Futura, sans-serif",
            fontWeight: 900,
            textTransform: "uppercase",
            color: section.isConclusion ? categoryColor : "#fff",
            marginBottom: "2rem",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {section.title}
        </h2>
      )}

      {section.content && (
        <div>
          {section.content.split("\n\n").map((para, pi) => (
            <p
              key={pi}
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "1.5rem",
                lineHeight: 1.8,
                marginBottom: "1.8rem",
                fontFamily: "Futura, sans-serif",
              }}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {section.list && (
        <ul
          style={{
            listStyle: "none",
            margin: "2rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          {section.list.map((item, li) => (
            <li
              key={li}
              style={{
                display: "flex",
                gap: "1.5rem",
                color: "rgba(255,255,255,0.6)",
                fontSize: "1.45rem",
                lineHeight: 1.7,
                fontFamily: "Futura, sans-serif",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: "0.55rem",
                  width: "0.6rem",
                  height: "0.6rem",
                  background: categoryColor,
                  transform: "rotate(45deg)",
                  display: "inline-block",
                }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.code && (
        <div
          style={{
            marginTop: "2rem",
            background: "#060D0A",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "auto",
          }}
        >
          <div
            style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "1.1rem",
                color: categoryColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {section.code.lang}
            </span>
          </div>
          <pre
            style={{
              padding: "2.5rem",
              fontFamily: "'Courier New', monospace",
              fontSize: "1.25rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              overflowX: "auto",
              margin: 0,
            }}
          >
            <code>{section.code.content}</code>
          </pre>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Related Article Card ─── */
function RelatedArticleCard({
  relatedPost: post,
  index,
}: {
  relatedPost: BlogPost;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.6, 0.08, 0.02, 0.99],
      }}
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
            transition:
              "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
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
          {/* Image */}
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
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(10,20,16,0.9))",
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              padding: "2.5rem 3rem 3rem",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
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
                  fontSize: "1.8rem",
                  fontFamily: "Futura, sans-serif",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: "1.2rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.title}
              </h3>

              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "1.3rem",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
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
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "1.1rem",
                    fontFamily: "Futura, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {post.date}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "1.1rem",
                    fontFamily: "Futura, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {post.readTime}
                </span>
              </div>
              <span
                style={{
                  color: "#D35400",
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
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
