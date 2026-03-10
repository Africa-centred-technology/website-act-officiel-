"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Star, Clock, Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { blogPosts, categories } from "@/lib/blog-data";

/* ── Footer strip ────────────────────────────────────── */
const FOOTER_SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@AfricaCentredTechnology",                                           label: "YouTube"   },
  { Icon: Facebook,  href: "https://web.facebook.com/profile.php?id=61585541019830",                                    label: "Facebook"  },
];

function FooterStrip() {
  return (
    <motion.div
      aria-label="Footer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      style={{ padding: "0 clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vw, 6rem)" }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem", marginBottom: "2.8rem" }}>
        <div>
          <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "1.6rem" }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href="mailto:contact@act.africa" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}>
              <Mail size={18} strokeWidth={1.6} />contact@act.africa
            </a>
            <a href="tel:+212694528498" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}>
              <Phone size={18} strokeWidth={1.6} />+212 694-528498
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.35)", fontSize: "1.15rem" }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "1.6rem" }}>Réseaux Sociaux</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {FOOTER_SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#D35400"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}>
                <Icon size={20} strokeWidth={1.5} />{label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "1.2rem" }}>Carrières</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem", lineHeight: 1.55, marginBottom: "0.9rem", maxWidth: "240px" }}>
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
            </p>
            <Link href="/careers" style={{ color: "#D35400", fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#F39C12"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#D35400"}>
              Postuler maintenant →
            </Link>
          </div>
          <Link href="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.9rem", background: "#D35400", color: "#fff", fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "1.1rem 2.5rem", borderRadius: "0.5rem", textDecoration: "none", transition: "background 0.25s, transform 0.25s", alignSelf: "flex-start" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#b84a00"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#D35400"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
            Un projet en tête ? →
          </Link>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.2rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.92rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.92rem", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}>
            Politique de Confidentialité
          </Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.92rem", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}>
            CGU
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogArticlesShell() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const postsIncrement = 6;
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
    if (val === "all") return blogPosts.length;
    return blogPosts.filter((p) => {
      const cat = p.category
        .toLowerCase()
        .replace(/\s*&\s*/g, "-")
        .replace(/\s+/g, "-");
      return cat === val;
    }).length;
  };

  return (
    <div style={{ background: "#070E1C", minHeight: "100vh" }}>
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
                fontFamily: "Futura, sans-serif",
                fontSize: "1.2rem",
                textDecoration: "none",
                marginBottom: "2rem",
                transition: "opacity 0.3s",
              }}
            >
              ← Retour aux rubriques
            </Link>

            <h1
              style={{
                fontSize: "clamp(4rem, 8vw, 7rem)",
                fontFamily: "'Bebas Neue', sans-serif",
                lineHeight: 0.9,
                color: "#fff",
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
                fontSize: "1.3rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                maxWidth: "50rem",
                marginBottom: "4rem",
              }}
            >
              {activeCategory === "all"
                ? "Explorez l'ensemble de nos analyses, tendances et décryptages sur la tech africaine."
                : `Découvrez tous nos articles dans la rubrique ${activeCatLabel}.`}
            </p>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", width: "100%", marginBottom: "4rem" }} />
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
                  padding: "1rem 1.2rem 1rem 3.8rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.6rem",
                  color: "#fff",
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease, background 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#e85c1a";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
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
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.3rem",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  ⌘
                </span>
                <span
                  style={{
                    padding: "0.2rem 0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.3rem",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                >
                  K
                </span>
              </div>
            </div>

            {/* Category Tabs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "3.5rem",
                paddingBottom: "1.8rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
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
                      gap: "1rem",
                      background: "none",
                      border: "none",
                      color: isActive ? "#e85c1a" : "rgba(255,255,255,0.45)",
                      fontFamily: "Futura, sans-serif",
                      fontSize: "1.35rem",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    }}
                  >
                    {cat.label}
                    <span
                      style={{
                        padding: "0.25rem 0.8rem",
                        background: isActive ? "rgba(232,92,26,0.15)" : "rgba(255,255,255,0.05)",
                        color: isActive ? "#e85c1a" : "rgba(255,255,255,0.3)",
                        borderRadius: "1.5rem",
                        fontSize: "1.05rem",
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

            {/* Found Articles Count */}
            <div
              style={{
                paddingTop: "0",
                paddingBottom: "1rem",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Futura, sans-serif",
                fontSize: "1.1rem",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>{filtered.length}</span> articles trouvés
            </div>

            {/* Small divider line under found articles count */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", width: "100%", marginBottom: "1rem" }} />

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
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.2rem",
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
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "Futura, sans-serif",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Clock size={14} /> {post.readTime}
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
                    fontFamily: "Futura, sans-serif",
                    fontSize: "0.95rem",
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
                  fontSize: "1.8rem",
                  fontFamily: "Futura, sans-serif",
                  fontWeight: 800,
                  color: "#fff",
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
            background: "#0d1b2e",
            border: "1px solid rgba(255,255,255,0.05)",
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
            el.style.borderColor = "rgba(255,255,255,0.05)";
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
                background: `linear-gradient(to right, transparent 30%, #0d1b2e)`,
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
                fontSize: "1rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "Futura, sans-serif",
                boxShadow: "0 4px 12px rgba(232,92,26,0.3)",
              }}
            >
              <Star size={14} fill="#fff" /> À LA UNE
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
                  fontFamily: "Futura, sans-serif",
                  fontSize: "0.95rem",
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
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2.8rem, 4vw, 4rem)",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "2rem",
              }}
            >
              {post.title}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "1.2rem",
                lineHeight: 1.6,
                marginBottom: "4rem",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "Futura, sans-serif",
              }}
            >
              {post.excerpt}
            </p>

            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(255,255,255,0.06)",
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
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "1.05rem",
                  fontFamily: "Futura, sans-serif",
                }}
              >
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime} de lecture</span>
              </div>
              <span
                style={{
                  color: "#e85c1a",
                  fontFamily: "Futura, sans-serif",
                  fontSize: "1.1rem",
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
