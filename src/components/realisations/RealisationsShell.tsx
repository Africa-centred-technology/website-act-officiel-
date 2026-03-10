"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { PROJECTS, CATEGORIES } from "@/lib/data/projects";

/* ── Footer socials ─────────────────────────────────── */
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

        {/* Col 1 — Contact */}
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

        {/* Col 2 — Réseaux Sociaux */}
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

        {/* Col 3 — Carrières + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "1.2rem" }}>Carrières</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem", lineHeight: 1.55, marginBottom: "0.9rem", maxWidth: "240px" }}>
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
            </p>
            <Link href="/careers"
              style={{ color: "#D35400", fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
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

/* ── Grain ───────────────────────────────────────────── */
function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px",
      }}
    />
  );
}

/* ── Project Card ────────────────────────────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.6, 0.08, 0.02, 0.99] }}
    >
      <Link
        href={`/projects/${project.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${hovered ? "rgba(211,84,0,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "1rem",
          overflow: "hidden",
          textDecoration: "none",
          transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 24px 60px rgba(211,84,0,0.08)" : "0 0 0 transparent",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            height: "clamp(180px, 22vw, 280px)",
            background: "#0a1520",
            overflow: "hidden",
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            style={{
              padding: "1.2rem",
              transition: "transform 0.6s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: hovered
                ? "linear-gradient(to bottom, rgba(7,14,28,0.1), rgba(7,14,28,0.55))"
                : "linear-gradient(to bottom, rgba(7,14,28,0.05), rgba(7,14,28,0.4))",
              transition: "background 0.4s",
            }}
          />

          {/* Index */}
          <span
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
            }}
          >
            {project.index}
          </span>

          {/* Category badge on hover */}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "#D35400",
              color: "#fff",
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.35rem 0.85rem",
              borderRadius: "0.3rem",
            }}
          >
            {project.category}
          </motion.span>

          {/* Tech tags */}
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              display: "flex",
              gap: "0.4rem",
              flexWrap: "wrap",
            }}
          >
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.09)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.62rem",
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "0.25rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "clamp(1.2rem, 2.5vw, 1.8rem)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.7rem",
            }}
          >
            <span
              style={{
                color: "#D35400",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              {project.categoryFull}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
              }}
            >
              {project.year}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              color: hovered ? "#D35400" : "#fff",
              fontSize: "var(--font-25)",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
              transition: "color 0.3s",
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "var(--font-18)",
              lineHeight: 1.65,
              marginBottom: "1.2rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
              }}
            >
              {project.client}
            </span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              style={{
                color: "#D35400",
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Lire →
            </motion.span>
          </div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          style={{
            height: 2,
            background: "linear-gradient(to right, #D35400, #F39C12)",
            originX: 0,
          }}
          transition={{ duration: 0.35 }}
        />
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   SHELL PRINCIPAL
   ══════════════════════════════════════════════════════ */
export default function RealisationsShell() {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const filtered =
    activeCategory === "Tous"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070e1c",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <Grain />

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding:
            "clamp(8rem, 15vh, 14rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 8vh, 7rem)",
          overflow: "hidden",
        }}
      >
        {/* BG grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(211,84,0,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(211,84,0,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            zIndex: 0,
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vw",
            height: "60vw",
            background: "radial-gradient(ellipse, rgba(211,84,0,0.07) 0%, transparent 65%)",
            zIndex: 0,
          }}
        />
        {/* Counter décoratif */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            top: "clamp(7rem, 12vh, 10rem)",
            right: "clamp(1.5rem, 6vw, 8rem)",
            zIndex: 1,
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: "var(--font-90)",
              color: "rgba(255,255,255,0.04)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            04
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span className="diamond diamond--sm" />
          <span
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Portfolio · Africa Centred Technology
          </span>
        </motion.div>

        {/* Heading */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.6, 0.08, 0.02, 0.99] }}
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.95,
              fontSize: "var(--font-90)",
              marginBottom: "3rem",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Nos</span>
            <br />
            <span style={{ color: "#D35400" }}>Réali-</span>
            <br />
            <span style={{ color: "#D35400" }}>sations</span>
          </motion.h1>

          {/* Description + stats */}
          <div className="real-hero-bottom">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "var(--font-20)",
                lineHeight: 1.72,
                maxWidth: "520px",
              }}
            >
              Découvrez nos projets qui transforment les entreprises africaines et créent un impact
              durable sur le continent. Technologies de pointe, résultats mesurables.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
              style={{ display: "flex", gap: "clamp(2rem, 4vw, 4rem)", flexShrink: 0 }}
            >
              {[
                { v: "04", l: "Projets" },
                { v: "2+", l: "Pays" },
                { v: "100%", l: "Satisfaction" },
              ].map((s) => (
                <div key={s.l}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: "var(--font-40)",
                      color: "#D35400",
                      lineHeight: 1,
                    }}
                  >
                    {s.v}
                  </span>
                  <span
                    style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {s.l}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Orange bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(to right, #D35400, #F39C12, #D35400)",
            transformOrigin: "left",
            zIndex: 1,
          }}
        />
      </section>

      {/* ── FILTER BAR ───────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7,14,28,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "1.2rem clamp(1.5rem, 6vw, 8rem)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(0.5rem, 1.5vw, 1rem)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginRight: "0.5rem",
          }}
        >
          Filtrer
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count =
            cat === "Tous"
              ? PROJECTS.length
              : PROJECTS.filter((p) => p.category === cat).length;
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileTap={{ scale: 0.94 }}
              style={{
                background: isActive ? "#D35400" : "rgba(255,255,255,0.04)",
                border: isActive ? "1px solid #D35400" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2rem",
                padding: "0.5rem 1.3rem",
                color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                minHeight: 40,
              }}
            >
              {cat}
              <span
                style={{
                  background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                  borderRadius: "1rem",
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.65rem",
                  lineHeight: 1.4,
                }}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── GRID ─────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 6vw, 8rem)",
        }}
      >
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 2rem)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "6rem 0",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Aucun projet dans cette catégorie
            </span>
          </motion.div>
        )}
      </section>

      <FooterStrip />
    </div>
  );
}
