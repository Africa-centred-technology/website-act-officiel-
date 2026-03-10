"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import type { Secteur } from "@/lib/secteurs-data";

/* ── Tokens ─────────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const ORANGE = "#D35400";
const BG = "#070E1C";

/* ── Footer socials ─────────────────────────────────────── */
const FOOTER_SOCIALS = [
  {
    Icon: Instagram,
    href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==",
    label: "Instagram",
  },
  {
    Icon: Youtube,
    href: "https://www.youtube.com/@AfricaCentredTechnology",
    label: "YouTube",
  },
  {
    Icon: Facebook,
    href: "https://web.facebook.com/profile.php?id=61585541019830",
    label: "Facebook",
  },
];

/* ── FooterStrip ─────────────────────────────────────────── */
function FooterStrip() {
  return (
    <motion.div
      aria-label="Footer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      style={{
        background: BG,
        padding:
          "clamp(3rem,5vw,5rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vw, 6rem)",
      }}
    >
      <div
        style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4rem",
          marginBottom: "2.8rem",
        }}
      >
        {/* Col 1 — Contact */}
        <div>
          <p
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 900,
              color: "rgba(255,255,255,0.55)",
              marginBottom: "1.6rem",
            }}
          >
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a
              href="mailto:contact@act.africa"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "rgba(255,255,255,0.60)",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.60)")
              }
            >
              <Mail size={16} strokeWidth={1.6} />
              contact@act.africa
            </a>
            <a
              href="tel:+212694528498"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "rgba(255,255,255,0.60)",
                textDecoration: "none",
                fontSize: "1.1rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.60)")
              }
            >
              <Phone size={16} strokeWidth={1.6} />
              +212 694-528498
            </a>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "rgba(255,255,255,0.35)",
                fontSize: "1.1rem",
              }}
            >
              <MapPin size={16} strokeWidth={1.6} />
              Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Réseaux Sociaux */}
        <div>
          <p
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 900,
              color: "rgba(255,255,255,0.55)",
              marginBottom: "1.6rem",
            }}
          >
            Réseaux Sociaux
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {FOOTER_SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "rgba(255,255,255,0.60)",
                  textDecoration: "none",
                  fontSize: "1.1rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.60)")
                }
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3 — Carrières + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <p
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "1rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: "rgba(255,255,255,0.55)",
                marginBottom: "1.2rem",
              }}
            >
              Carrières
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "1.1rem",
                lineHeight: 1.55,
                marginBottom: "0.9rem",
                maxWidth: "240px",
              }}
            >
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de
              demain.
            </p>
            <Link
              href="/careers"
              style={{
                color: ORANGE,
                textDecoration: "none",
                fontSize: "1rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#F39C12")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = ORANGE)
              }
            >
              Postuler maintenant →
            </Link>
          </div>
          <Link href="/contact" className="cta-btn" style={{ marginTop: "0.4rem" }}>
            <div className="cta-btn__border" />
            <div className="cta-btn__blur" />
            <div className="cta-btn__background" />
            <div className="cta-btn__inner">
              <span className="cta-btn__icon" />
              <span className="cta-btn__text">Un projet en tête ?</span>
            </div>
          </Link>
        </div>
      </div>

      <div
        style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.2rem" }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.8rem",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.40)",
            textTransform: "uppercase",
            fontSize: "0.92rem",
            letterSpacing: "0.08em",
          }}
        >
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/privacy"
            style={{
              color: "rgba(255,255,255,0.40)",
              textDecoration: "none",
              fontSize: "0.92rem",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
          >
            Politique de Confidentialité
          </Link>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
          <Link
            href="/terms"
            style={{
              color: "rgba(255,255,255,0.40)",
              textDecoration: "none",
              fontSize: "0.92rem",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
          >
            CGU
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

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
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              fontSize: "0.78rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
            }
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
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
            style={{ fontSize: "4rem", marginBottom: "1.5rem" }}
          >
            {secteur.icon}
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
                fontSize: "0.72rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 500,
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
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 7vw, 9rem)",
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
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
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
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  marginTop: "0.35rem",
                  maxWidth: "280px",
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
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}
            >
              <span className="diamond diamond--sm" />
              <span
                style={{
                  color: "rgba(255,255,255,0.30)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                }}
              >
                Notre approche
              </span>
            </div>
            <h2
              style={{
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
                color: "rgba(255,255,255,0.65)",
                fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                lineHeight: 1.75,
                letterSpacing: "0.01em",
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
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}
          >
            <span className="diamond diamond--sm" />
            <span
              style={{
                color: "rgba(255,255,255,0.30)",
                fontSize: "0.75rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              Nos solutions
            </span>
          </div>
          <h2
            style={{
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
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  margin: 0,
                  letterSpacing: "0.01em",
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
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.78rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Passons à l&apos;action
          </p>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 6vw, 7rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            Votre projet
            <br />
            <span style={{ color: secteur.color }}>nous intéresse</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.50)",
              fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
            }}
          >
            Discutons de votre contexte et explorons ensemble comment la technologie
            peut créer de la valeur dans votre organisation.
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
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
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
                width="12"
                height="12"
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
                color: "rgba(255,255,255,0.65)",
                borderRadius: "0.5rem",
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
