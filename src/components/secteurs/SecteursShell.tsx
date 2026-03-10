"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { secteurs } from "@/lib/secteurs-data";

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

/* ── Secteur Card ────────────────────────────────────────── */
function SecteurCard({
  secteur,
  index,
}: {
  secteur: (typeof secteurs)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [...EASE] }}
      style={{ position: "relative" }}
    >
      <Link
        href={`/secteurs/${secteur.slug}`}
        style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "0.75rem",
            border: `1px solid ${hovered ? secteur.color + "55" : "rgba(255,255,255,0.07)"}`,
            transition: "border-color 0.35s ease, transform 0.35s ease",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
            <Image
              src={secteur.image}
              alt={secteur.label}
              fill
              style={{
                objectFit: "cover",
                transition: "transform 0.6s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, rgba(7,14,28,0.35) 0%, rgba(7,14,28,0.82) 100%)`,
                transition: "background 0.35s ease",
              }}
            />
            {/* Accent overlay on hover */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `${secteur.color}15`,
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            />
            {/* Icon */}
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "1.25rem",
                fontSize: "2rem",
                filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))",
              }}
            >
              {secteur.icon}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              background: "rgba(7,14,28,0.95)",
              padding: "1.5rem",
              borderTop: `1px solid ${secteur.color}22`,
            }}
          >
            {/* Label */}
            <p
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: secteur.color,
                marginBottom: "0.6rem",
                fontWeight: 500,
              }}
            >
              {secteur.label}
            </p>
            {/* Tagline */}
            <h3
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: "0.85rem",
                letterSpacing: "-0.01em",
              }}
            >
              {secteur.tagline}
            </h3>
            {/* Description short */}
            <p
              style={{
                color: "rgba(255,255,255,0.50)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "1.25rem",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
                overflow: "hidden",
              }}
            >
              {secteur.description}
            </p>
            {/* CTA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: hovered ? secteur.color : "rgba(255,255,255,0.45)",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "color 0.25s ease",
              }}
            >
              Explorer
              <motion.span
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.25 }}
              >
                →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SHELL
   ══════════════════════════════════════════════════════════ */
export default function SecteursShell() {
  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "Futura, system-ui, sans-serif",
        color: "#fff",
      }}
    >
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "clamp(8rem, 12vw, 12rem)",
          paddingBottom: "clamp(4rem, 6vw, 7rem)",
          paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
          paddingRight: "clamp(1.5rem, 6vw, 8rem)",
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(211,84,0,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [...EASE] }}
          style={{
            height: 1,
            background: "rgba(211,84,0,0.35)",
            marginBottom: "2.5rem",
            originX: 0,
          }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}
        >
          <span className="diamond diamond--sm" />
          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            Secteurs d&apos;activité
          </span>
        </motion.div>

        {/* Title */}
        <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [...EASE] }}
            style={{
              fontWeight: 900,
              fontSize: "clamp(3rem, 8vw, 11rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
            }}
          >
            NOS DOMAINES
            <br />
            <span style={{ color: ORANGE }}>D&apos;EXPERTISE</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.42 }}
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
            lineHeight: 1.65,
            maxWidth: "640px",
          }}
        >
          ACT intervient dans les secteurs stratégiques de l&apos;économie africaine,
          apportant expertise technologique et vision locale pour transformer les
          défis du continent en opportunités concrètes.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "7", label: "Secteurs couverts" },
            { value: "15+", label: "Projets déployés" },
            { value: "100%", label: "Impact africain" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 900,
                  color: ORANGE,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "0.4rem",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Grid ── */}
      <section
        style={{
          padding:
            "clamp(3rem,5vw,5rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vw, 6rem)",
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
          <p
            style={{
              color: "rgba(255,255,255,0.30)",
              fontSize: "0.8rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: "0.6rem",
            }}
          >
            — Nos domaines d&apos;intervention
          </p>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginTop: "1.5rem",
            }}
          />
        </motion.div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: "1.75rem",
          }}
        >
          {secteurs.map((secteur, i) => (
            <SecteurCard key={secteur.slug} secteur={secteur} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA band ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 6vw, 8rem)",
          background: "rgba(211,84,0,0.06)",
          borderTop: "1px solid rgba(211,84,0,0.18)",
          borderBottom: "1px solid rgba(211,84,0,0.18)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.8rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          Votre secteur, notre expertise
        </p>
        <h2
          style={{
            fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 5rem)",
            textTransform: "uppercase",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          Parlons de votre projet
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.50)",
            fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "0 auto 2.5rem",
          }}
        >
          Quelle que soit votre industrie, ACT dispose de l&apos;expertise
          technologique pour vous accompagner dans votre transformation digitale.
        </p>
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
      </motion.section>

      {/* ── Footer ── */}
      <FooterStrip />
    </div>
  );
}
