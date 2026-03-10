"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { blogPosts, categories } from "@/lib/blog-data";

export default function BlogArticlesShell() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const filtered = blogPosts.filter((p) => {
    const cat = p.category
      .toLowerCase()
      .replace(/\s*&\s*/g, "-")
      .replace(/\s+/g, "-");
    const matchesCategory = activeCategory === "all" || cat === activeCategory;

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm) ||
      p.excerpt.toLowerCase().includes(searchTerm) ||
      p.keywords.some((kw) => kw.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filtered.slice(startIndex, startIndex + postsPerPage);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const activeCatLabel =
    categories.find((c) => c.value === activeCategory)?.label || "Tous les articles";

  return (
    <div style={{ background: "#0A1410", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <section
        ref={headerRef}
        style={{
          paddingTop: "14rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "30%",
            width: "50vw",
            height: "50vh",
            background:
              "radial-gradient(ellipse at center, rgba(211,84,0,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "#D35400",
                fontFamily: "Futura, sans-serif",
                fontSize: "1.4rem",
                textDecoration: "none",
                marginBottom: "3rem",
                transition: "opacity 0.3s",
              }}
            >
              ← Retour aux rubriques
            </Link>

            <h1
              style={{
                fontSize: "clamp(3.5rem, 5vw, 6rem)",
                fontFamily: "Futura, sans-serif",
                fontWeight: 900,
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              {activeCategory === "all" ? (
                <>
                  Tous les{" "}
                  <span style={{ color: "#D35400" }}>articles</span>
                </>
              ) : (
                <>
                  <span style={{ color: "#D35400" }}>{activeCatLabel}</span>
                </>
              )}
            </h1>

            <p
              style={{
                fontSize: "1.5rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.7,
                maxWidth: "50rem",
              }}
            >
              {activeCategory === "all"
                ? "Explorez l'ensemble de nos analyses, tendances et décryptages sur la tech africaine."
                : `Découvrez tous nos articles dans la rubrique ${activeCatLabel}.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS + ARTICLES ── */}
      <section style={{ paddingBottom: "8rem" }}>
        <div className="container">
          {/* Filter bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "4rem",
              flexWrap: "wrap",
            }}
          >
            {/* Category pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                flex: "1 1 auto",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  style={{
                    padding: "0.7rem 1.6rem",
                    border: `1px solid ${
                      activeCategory === cat.value
                        ? "#D35400"
                        : "rgba(255,255,255,0.12)"
                    }`,
                    background:
                      activeCategory === cat.value
                        ? "rgba(211,84,0,0.15)"
                        : "rgba(255,255,255,0.04)",
                    borderRadius: "2.5rem",
                    color:
                      activeCategory === cat.value
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    fontFamily: "Futura, sans-serif",
                    fontSize: "1.15rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "36rem",
              }}
            >
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1.8rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1.2rem 1.8rem 1.2rem 4.6rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "3rem",
                  color: "#fff",
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.3rem",
                  outline: "none",
                  transition: "border-color 0.3s ease, background 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D35400";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              />
            </div>
          </div>

          {/* Posts grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 34rem), 1fr))",
              gap: "3rem",
            }}
          >
            {paginatedPosts.map((post, i) => (
              <ArticleCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: "6rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: "4.4rem",
                  height: "4.4rem",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color:
                    currentPage === 1 ? "rgba(255,255,255,0.1)" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentPage === 1 ? "default" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  alignItems: "center",
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: "4.4rem",
                        height: "4.4rem",
                        borderRadius: "50%",
                        border: `1px solid ${
                          currentPage === page
                            ? "#D35400"
                            : "rgba(255,255,255,0.08)"
                        }`,
                        background:
                          currentPage === page
                            ? "rgba(211,84,0,0.15)"
                            : "rgba(255,255,255,0.03)",
                        color:
                          currentPage === page
                            ? "#fff"
                            : "rgba(255,255,255,0.4)",
                        fontSize: "1.3rem",
                        fontFamily: "Futura, sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  width: "4.4rem",
                  height: "4.4rem",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color:
                    currentPage === totalPages
                      ? "rgba(255,255,255,0.1)"
                      : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    currentPage === totalPages ? "default" : "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "8rem 0",
                color: "rgba(255,255,255,0.3)",
                fontSize: "var(--font-18)",
                fontFamily: "Futura, sans-serif",
                textTransform: "uppercase",
              }}
            >
              Aucun article dans cette catégorie pour l&apos;instant.
            </div>
          )}
        </div>
      </section>
    </div>
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
