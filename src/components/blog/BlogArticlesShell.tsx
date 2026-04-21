"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Star, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { blogPosts, categories, type BlogPost } from "@/lib/blog-data";
import FooterStrip from "@/components/layout/FooterStrip";

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1280) {
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

export default function BlogArticlesShell() {
  const screenSize = useMediaQuery();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const postsIncrement = 6;
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fusion articles statiques + Shopify
  const [allPosts, setAllPosts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    fetch("/api/shopify/blog")
      .then((r) => r.json())
      .then(({ posts }) => {
        if (!Array.isArray(posts) || posts.length === 0) return;
        // Les articles Shopify remplacent les statiques du même slug, les nouveaux s'ajoutent en tête
        const staticSlugs = new Set(blogPosts.map((p) => p.slug));
        const shopifyNew  = posts.filter((p: BlogPost) => !staticSlugs.has(p.slug));
        const merged = [...shopifyNew, ...blogPosts];
        setAllPosts(merged);
      })
      .catch(() => { /* garde les données statiques en cas d'erreur */ });
  }, []);

  const filtered = allPosts.filter((p) => {
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

  const paginatedPosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(postsIncrement);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(postsIncrement);
  };

  const activeCatLabel =
    categories.find((c) => c.value === activeCategory)?.label || "Tous les articles";

  const getCategoryCount = (val: string) => {
    if (val === "all") return allPosts.length;
    return allPosts.filter((p) => {
      const cat = p.category
        .toLowerCase()
        .replace(/\s*&\s*/g, "-")
        .replace(/\s+/g, "-");
      return cat === val;
    }).length;
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <section
        ref={headerRef}
        style={{
          paddingTop: "12rem",
          paddingBottom: "1.5rem",
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
              "radial-gradient(ellipse at center, rgba(232,92,26,0.06) 0%, transparent 70%)",
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
                color: "#e85c1a",
                fontFamily: "var(--font-body)",
                fontSize: "1.8rem",
                textDecoration: "none",
                marginBottom: "2rem",
                transition: "opacity 0.3s",
              }}
            >
              ← Retour aux rubriques
            </Link>

            <h1
              style={{
                fontSize: screenSize === 'mobile' ? "clamp(3rem, 10vw, 5rem)" : screenSize === 'tablet' ? "clamp(4rem, 8vw, 7rem)" : "clamp(5rem, 10vw, 9rem)",
                fontFamily: "var(--font-display)",
                lineHeight: 0.9,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              {activeCategory === "all" ? (
                <>
                  TOUS LES <span style={{ color: "#e85c1a" }}>ARTICLES</span>
                </>
              ) : (
                <>
                  ARTICLES <span style={{ color: "#e85c1a" }}>{activeCatLabel}</span>
                </>
              )}
            </h1>

            <p
              style={{
                fontSize: screenSize === 'mobile' ? '1.4rem' : screenSize === 'tablet' ? '1.7rem' : '2rem',
                color: "var(--text-muted)",
                lineHeight: 1.6,
                maxWidth: "50rem",
                marginBottom: screenSize === 'mobile' ? '3rem' : '4rem',
              }}
            >
              {activeCategory === "all"
                ? "Explorez l'ensemble de nos analyses, tendances et décryptages sur la tech africaine."
                : `Découvrez tous nos articles dans la rubrique ${activeCatLabel}.`}
            </p>

            <div style={{ height: "1px", background: "var(--border-color)", width: "100%", marginBottom: "4rem" }} />
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS + ARTICLES ── */}
      <section style={{ paddingBottom: "8rem" }}>
        <div className="container">
          
          {/* Filter bar */}
          <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Search */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "40rem",
              }}
            >
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1.2rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
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
                  padding: "1rem 1.2rem 1rem 3.8rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.6rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "1.7rem",
                  outline: "none",
                  transition: "border-color 0.3s ease, background 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#e85c1a";
                  e.currentTarget.style.background = "var(--bg-glass)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.background = "var(--bg-card)";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "0.8rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  gap: "0.3rem",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    padding: "0.2rem 0.5rem",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.3rem",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  ⌘
                </span>
                <span
                  style={{
                    padding: "0.2rem 0.5rem",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.3rem",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  K
                </span>
              </div>
            </div>

            {/* Category Tabs / Filters */}
            {screenSize === 'mobile' ? (
              <div style={{ position: "relative", marginBottom: "1rem", zIndex: 10 }}>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.4rem",
                    background: "var(--bg-card)",
                    border: showMobileFilters ? "1px solid #e85c1a" : "1px solid var(--border-color)",
                    borderRadius: "0.8rem",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>Filtre :</span>
                    <span style={{ color: "#e85c1a" }}>{activeCatLabel}</span>
                  </span>
                  <motion.svg 
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e85c1a" strokeWidth="2.5"
                    animate={{ rotate: showMobileFilters ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>

                {/* Dropdown list */}
                <motion.div
                  initial={false}
                  animate={{ height: showMobileFilters ? "auto" : 0, opacity: showMobileFilters ? 1 : 0 }}
                  style={{
                    overflow: "hidden",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "var(--bg-secondary)",
                    borderBottom: showMobileFilters ? "1px solid var(--border-color)" : "none",
                    borderLeft: showMobileFilters ? "1px solid var(--border-color)" : "none",
                    borderRight: showMobileFilters ? "1px solid var(--border-color)" : "none",
                    borderRadius: "0 0 0.8rem 0.8rem",
                    marginTop: "-0.2rem",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", padding: "1rem" }}>
                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.value;
                      const count = getCategoryCount(cat.value);
                      return (
                        <button
                          key={cat.value}
                          onClick={() => {
                            handleCategoryChange(cat.value);
                            setShowMobileFilters(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1.2rem",
                            background: isActive ? "rgba(232,92,26,0.1)" : "transparent",
                            border: "none",
                            borderRadius: "0.4rem",
                            color: isActive ? "#e85c1a" : "var(--text-primary)",
                            fontFamily: "var(--font-body)",
                            fontSize: "1.4rem",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          {cat.label}
                          <span style={{
                            background: isActive ? "rgba(232,92,26,0.2)" : "var(--bg-glass)",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "1rem",
                            fontSize: "1.1rem",
                            color: isActive ? "#e85c1a" : "var(--text-muted)",
                          }}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: '3.5rem',
                  paddingBottom: '1.8rem',
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.value;
                  const count = getCategoryCount(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: '1rem',
                        background: "none",
                        border: "none",
                        color: isActive ? "#e85c1a" : "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                        fontSize: screenSize === 'tablet' ? '1.7rem' : '2rem',
                        fontWeight: isActive ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = "var(--text-muted)";
                      }}
                    >
                      {cat.label}
                      <span
                        style={{
                          padding: "0.25rem 0.8rem",
                          background: isActive ? "rgba(232,92,26,0.15)" : "var(--bg-glass)",
                          color: isActive ? "#e85c1a" : "var(--text-muted)",
                          borderRadius: "1.5rem",
                          fontSize: "1.6rem",
                          fontWeight: 600,
                        }}
                      >
                        {count}
                      </span>
                      {/* Active Line under the tab */}
                      {isActive && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-1.6rem",
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "#e85c1a",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Found Articles Count */}
            <div
              style={{
                paddingTop: "0",
                paddingBottom: "1rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "1.7rem",
              }}
            >
              <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.9rem" }}>{filtered.length}</span> articles trouvés
            </div>

            {/* Small divider line under found articles count */}
            <div style={{ height: "1px", background: "var(--border-color)", width: "100%", marginBottom: "1rem" }} />

          </div>

          {/* Posts grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {searchQuery === "" && paginatedPosts.length > 0 && (
              <FeaturedArticleCard post={paginatedPosts[0]} />
            )}
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 32rem), 1fr))",
                gap: "2.5rem",
              }}
            >
              {(searchQuery === "" 
                  ? paginatedPosts.slice(1) 
                  : paginatedPosts
              ).map((post, i) => (
                <ArticleCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div
              style={{
                marginTop: "6rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setVisibleCount((prev) => prev + postsIncrement)}
                style={{
                  padding: "1rem 3rem",
                  background: "transparent",
                  border: "1px solid #e85c1a",
                  borderRadius: "3rem",
                  color: "#e85c1a",
                  fontFamily: "var(--font-body)",
                  fontSize: "1.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(232,92,26,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Voir plus d&apos;articles
              </button>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "8rem 0",
                color: "var(--text-muted)",
                fontSize: "var(--font-18)",
                fontFamily: "var(--font-body)",
                textTransform: "uppercase",
              }}
            >
              Aucun article dans cette catégorie pour l&apos;instant.
            </div>
          )}
        </div>
      </section>

      <FooterStrip />
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
            background: "transparent",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "translateY(0)";
          }}
        >
          {/* Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "24rem",
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: "1rem",
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover", opacity: 0.5 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, transparent 20%, ${post.categoryColor}2B)`,
              }}
            />
            {/* Read Time Badge inside Image */}
            <div
              style={{
                position: "absolute",
                bottom: "1.2rem",
                right: "1.2rem",
                background: "rgba(0,0,0,0.6)",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.4rem",
                color: "var(--text-inverse)",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-body)",
                border: "1px solid var(--border-light)",
              }}
            >
              <Clock size={18} /> {post.readTime}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "1.5rem 0 3rem 0",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div>
              {/* Category */}
              <div style={{ marginBottom: "1.2rem" }}>
                <span
                  style={{
                    padding: "0.3rem 0.8rem",
                    border: `1px solid ${post.categoryColor}55`,
                    borderRadius: "0.4rem",
                    color: post.categoryColor,
                    fontFamily: "var(--font-body)",
                    fontSize: "1.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  {post.category}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "2.2rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Featured Article Card ─── */
function FeaturedArticleCard({ post }: { post: (typeof blogPosts)[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.6, 0.08, 0.02, 0.99] }}
      style={{ marginBottom: "2rem" }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-light)",
            borderRadius: "1.2rem",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 40rem), 1fr))",
            transition: "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
            minHeight: "35rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = `${post.categoryColor}66`;
            el.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = "var(--border-light)";
            el.style.transform = "translateY(0)";
          }}
        >
          {/* Left: Image Container */}
          <div style={{ position: "relative", width: "100%", minHeight: "35rem" }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: "cover", opacity: 0.8 }}
            />
            {/* The gradient overlay to smooth transition to right side */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to right, transparent 30%, var(--bg-secondary))`,
              }}
            />
            {/* Top Left Badge */}
            <div
              style={{
                position: "absolute",
                top: "2.5rem",
                left: "2.5rem",
                background: "#e85c1a",
                color: "#fff",
                padding: "0.6rem 1.4rem",
                borderRadius: "0.4rem",
                fontSize: "1.3rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-body)",
                boxShadow: "0 4px 12px rgba(232,92,26,0.3)",
              }}
            >
              <Star size={16} fill="#fff" /> À LA UNE
            </div>
          </div>

          {/* Right: Content Container */}
          <div
            style={{
              padding: "4rem 4rem 4rem 2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "transparent",
            }}
          >
            <div style={{ marginBottom: "2.5rem" }}>
              <span
                style={{
                  padding: "0.4rem 1.2rem",
                  background: `${post.categoryColor}15`,
                  border: `1px solid ${post.categoryColor}55`,
                  borderRadius: "0.4rem",
                  color: post.categoryColor,
                  fontFamily: "var(--font-body)",
                  fontSize: "1.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {post.category}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.2rem, 5vw, 5rem)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                marginBottom: "2rem",
              }}
            >
              {post.title}
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.8rem",
                lineHeight: 1.6,
                marginBottom: "4rem",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "var(--font-body)",
              }}
            >
              {post.excerpt}
            </p>

            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  color: "var(--text-muted)",
                  fontSize: "1.6rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime} de lecture</span>
              </div>
              <span
                style={{
                  color: "#e85c1a",
                  fontFamily: "var(--font-body)",
                  fontSize: "1.7rem",
                  fontWeight: 600,
                }}
              >
                Lire l&apos;article →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
