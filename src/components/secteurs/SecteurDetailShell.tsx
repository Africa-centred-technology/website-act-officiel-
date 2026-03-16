"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Settings, Wifi, Leaf, TrendingUp, ShoppingCart, Building2, Landmark } from "lucide-react";
import type { Secteur } from "@/lib/secteurs-data";
import FooterStrip from "@/components/layout/FooterStrip";

/* ── Tokens ─────────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const ORANGE = "#D35400";
const BG = "#070E1C";

/* ── Icônes secteurs ─────────────────────────────────────── */
const SECTEUR_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  "industrie":       Settings,
  "telecoms-medias": Wifi,
  "agriculture":     Leaf,
  "finance":         TrendingUp,
  "ecommerce":       ShoppingCart,
  "gestion-urbaine": Building2,
  "secteur-public":  Landmark,
};


/* ══════════════════════════════════════════════════════════
   MAIN DETAIL SHELL
   ══════════════════════════════════════════════════════════ */
export default function SecteurDetailShell({ secteur }: { secteur: Secteur }) {
  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "Futura, system-ui, sans-serif",
        color: "#fff",
      }}
    >
      {/* ── Hero plein écran ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Image
            src={secteur.image}
            alt={secteur.label}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
          />
        </div>

        {/* Dark overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,14,28,0.55) 0%, rgba(7,14,28,0.45) 40%, rgba(7,14,28,0.88) 75%, rgba(7,14,28,1) 100%)",
          }}
        />

        {/* Accent color glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${secteur.color}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Back breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            position: "absolute",
            top: "clamp(5rem, 8vw, 7rem)",
            left: "clamp(1.5rem, 6vw, 8rem)",
            zIndex: 10,
          }}
        >
          <Link
            href="/secteurs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transition: "color 0.2s",
              opacity: 0.8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#ffffff")
            }
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Secteurs
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span style={{ color: secteur.color }}>{secteur.label}</span>
          </Link>
        </motion.div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            padding:
              "0 clamp(1.5rem, 6vw, 8rem) clamp(4rem, 6vw, 6rem)",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [...EASE] }}
            style={{ marginBottom: "1.5rem" }}
          >
            {(() => {
              const Icon = SECTEUR_ICONS[secteur.slug];
              return Icon ? <Icon size={52} strokeWidth={1.2} color={secteur.color} /> : null;
            })()}
          </motion.div>

          {/* Label badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.9rem",
              border: `1px solid ${secteur.color}55`,
              borderRadius: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: secteur.color,
                flexShrink: 0,
              }}
            />
              <span
                style={{
                  color: secteur.color,
                  fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {secteur.label}
              </span>
          </motion.div>

          {/* Title */}
          <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.32, ease: [...EASE] }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(3.5rem, 9vw, 12rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#fff",
                margin: 0,
              }}
            >
              {secteur.label}
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontFamily: "var(--font-body)",
              color: "#ffffff",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontStyle: "italic",
              marginBottom: secteur.chiffre ? "2.5rem" : "0",
              letterSpacing: "0.01em",
            }}
          >
            {secteur.tagline}
          </motion.p>

          {/* Chiffre clé */}
          {secteur.chiffre && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              style={{
                display: "inline-block",
                borderLeft: `3px solid ${secteur.color}`,
                paddingLeft: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  color: secteur.color,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {secteur.chiffre.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#ffffff",
                  fontSize: "clamp(1rem, 1.4vw, 1.4rem)",
                  letterSpacing: "0.08em",
                  marginTop: "0.35rem",
                  maxWidth: "280px",
                  opacity: 0.85,
                }}
              >
                {secteur.chiffre.label}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Section "Notre approche" ── */}
      <section
        style={{
          padding:
            "clamp(5rem, 8vw, 9rem) clamp(1.5rem, 6vw, 8rem)",
          position: "relative",
        }}
      >
        {/* Subtle divider rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [...EASE] }}
          style={{
            height: 1,
            background: `linear-gradient(to right, ${secteur.color}55, rgba(255,255,255,0.06), transparent)`,
            marginBottom: "4rem",
            originX: 0,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(2rem, 5vw, 6rem)",
            alignItems: "start",
          }}
        >
          {/* Left — section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}
          >
            <span className="diamond diamond--sm" />
            <span
              style={{
                color: "#ffffff",
                fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              Notre approche
            </span>
          </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                textTransform: "uppercase",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: 0,
              }}
            >
              <span style={{ color: secteur.color }}>ACT</span>
              {" "}dans ce secteur
            </h2>
          </motion.div>

          {/* Right — description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "#ffffff",
                fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                lineHeight: 1.75,
                letterSpacing: "0.01em",
                textAlign: "justify",
              }}
            >
              {secteur.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section "Ce que nous faisons" ── */}
      <section
        style={{
          padding:
            "clamp(3rem, 6vw, 6rem) clamp(1.5rem, 6vw, 8rem) clamp(5rem, 8vw, 8rem)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "3rem" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.2rem" }}
          >
            <span className="diamond diamond--sm" />
            <span
              style={{
                color: "#ffffff",
                fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              Nos solutions
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 4vw, 4.5rem)",
              textTransform: "uppercase",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: 0,
            }}
          >
            Ce que nous
            <br />
            <span style={{ color: secteur.color }}>faisons</span>
          </h2>
        </motion.div>

        {/* Services cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {secteur.services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [...EASE] }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.06)`,
                borderRadius: "0.65rem",
                borderLeft: `3px solid ${secteur.color}`,
              }}
            >
              <CheckCircle
                size={20}
                strokeWidth={1.5}
                style={{ color: secteur.color, flexShrink: 0, marginTop: "0.1rem" }}
              />
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#ffffff",
                  fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)",
                  lineHeight: 1.55,
                  margin: 0,
                  letterSpacing: "0.01em",
                  opacity: 0.95,
                }}
              >
                {service}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA section ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          padding: "clamp(5rem, 8vw, 8rem) clamp(1.5rem, 6vw, 8rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow bg */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${secteur.color}10 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <p
            style={{
              color: "#ffffff",
              fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              opacity: 0.85,
            }}
          >
            Passons à l&apos;action
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(3rem, 7vw, 8rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: "2rem",
            }}
          >
            Votre projet
            <br />
            <span style={{ color: secteur.color }}>nous intéresse</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#ffffff",
              fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)",
              lineHeight: 1.65,
              maxWidth: "600px",
              margin: "0 auto 3rem",
              textAlign: "justify",
              opacity: 0.9,
            }}
          >
            Discutons de votre contexte et explorons ensemble comment la technologie peut créer de la valeur dans votre organisation.
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "1rem 2.25rem",
                background: ORANGE,
                color: "#fff",
                borderRadius: "0.6rem",
                textDecoration: "none",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "#b84700")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = ORANGE)
              }
            >
              Démarrer un projet
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/secteurs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "1rem 2.25rem",
                background: "transparent",
                color: "#ffffff",
                borderRadius: "0.6rem",
                border: "1px solid rgba(255,255,255,0.15)",
                textDecoration: "none",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.4)";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.15)";
                el.style.color = "rgba(255,255,255,0.65)";
              }}
            >
              <ArrowLeft size={14} />
              Tous les secteurs
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <FooterStrip />
    </div>
  );
}
