"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES, POLE_I, POLE_II, type Service } from "@/lib/data/services";

/* ── Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, 0.08, 0.02, 0.99] } },
};
const stagger = (delay = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: delay } },
});

/* ── Icône SVG inline ─────────────────────────────── */
function SvcIcon({ path, color }: { path: string; color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

/* ── Carte service ────────────────────────────────── */
function ServiceCard({ svc, index }: { svc: Service; index: number }) {
  const isGold = svc.poleN === "II";

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/services/${svc.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <motion.article
          whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.6, 0.08, 0.02, 0.99] } }}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1.2rem",
            padding: "2.4rem 2.4rem 2rem",
            cursor: "pointer",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
            transition: "border-color 0.3s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `${svc.accent}55`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          }}
        >
          {/* Glow de fond au hover */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, borderRadius: "1.2rem",
            background: `radial-gradient(ellipse 60% 50% at 20% 80%, ${svc.accent}0D 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Ligne accent top */}
          <div aria-hidden style={{
            position: "absolute", top: 0, left: "2.4rem", right: "2.4rem", height: "1px",
            background: `linear-gradient(90deg, ${svc.accent}80, transparent)`,
          }} />

          {/* Header : numéro + icône */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(11px, 0.9rem, 1rem)",
              letterSpacing: "0.2em",
              color: `${svc.accent}CC`,
              fontWeight: 500,
            }}>
              {svc.n}
            </span>
            <div style={{
              width: 40, height: 40, borderRadius: "0.6rem",
              background: `${svc.accent}12`,
              border: `1px solid ${svc.accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SvcIcon path={svc.icon} color={svc.accent} />
            </div>
          </div>

          {/* Titre */}
          <h3 style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(16px, 1.35rem, 1.5rem)",
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.25,
            whiteSpace: "pre-line",
            flex: 1,
          }}>
            {svc.title}
          </h3>

          {/* Tagline */}
          <p style={{
            fontSize: "clamp(12px, 0.85rem, 0.95rem)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.04em",
            fontStyle: "italic",
          }}>
            {svc.tagline}
          </p>

          {/* Bénéfices pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {svc.benefits.slice(0, 3).map(b => (
              <span key={b} style={{
                fontSize: "clamp(10px, 0.72rem, 0.78rem)",
                letterSpacing: "0.06em",
                color: `${svc.accent}CC`,
                background: `${svc.accent}12`,
                border: `1px solid ${svc.accent}25`,
                borderRadius: "2rem",
                padding: "0.25rem 0.75rem",
                whiteSpace: "nowrap",
              }}>
                {b}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            marginTop: "0.4rem",
            fontSize: "clamp(11px, 0.78rem, 0.85rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: svc.accent,
            fontFamily: "Futura, system-ui, sans-serif",
          }}>
            <span>Découvrir</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={svc.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}

/* ── Section pôle ─────────────────────────────────── */
function PoleSection({
  number, label, accent, services, delay,
}: {
  number: string; label: string; accent: string; services: Service[]; delay: number;
}) {
  return (
    <section style={{ marginBottom: "5rem" }}>
      {/* En-tête du pôle */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
        variants={stagger(delay)}
        style={{ marginBottom: "2.5rem" }}
      >
        <motion.div variants={fadeUp} style={{
          display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `${accent}20`, border: `1px solid ${accent}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(10px, 0.75rem, 0.8rem)",
            letterSpacing: "0.15em", color: accent,
          }}>
            {number}
          </div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
        </motion.div>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(13px, 0.85rem, 0.95rem)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: `${accent}BB`,
        }}>
          Pôle {number} — {label}
        </motion.h2>
      </motion.div>

      {/* Grille */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
        variants={stagger(delay + 0.1)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
          gap: "1.25rem",
        }}
      >
        {services.map((svc, i) => (
          <ServiceCard key={svc.slug} svc={svc} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════ */
export default function ServicesGrid() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A1410",
      paddingTop: "clamp(6rem, 10vw, 9rem)",
      paddingBottom: "6rem",
    }}>
      <div style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "0 clamp(1.2rem, 5vw, 3rem)",
      }}>

        {/* ── Hero header ── */}
        <motion.header
          initial="hidden" animate="show"
          variants={stagger(0)}
          style={{ marginBottom: "5rem" }}
        >
          <motion.p variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(11px, 0.8rem, 0.85rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "1.2rem",
          }}>
            Africa Centred Technology
          </motion.p>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(36px, 5vw, 5.5rem)",
            fontWeight: 500,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            marginBottom: "1.8rem",
          }}>
            Nos Services
          </motion.h1>

          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "flex-start", gap: "1.5rem",
            flexWrap: "wrap",
          }}>
            <p style={{
              maxWidth: 560,
              fontSize: "clamp(14px, 1rem, 1.05rem)",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.55)",
            }}>
              Deux pôles d'expertise complémentaires — l'ingénierie technologique pour construire,
              le conseil et la formation pour durer. Ensemble, ils forment une proposition unique
              taillée pour les organisations africaines.
            </p>

            <div style={{
              display: "flex", flexDirection: "column", gap: "0.75rem",
              paddingLeft: "1.5rem",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D35400" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  Pôle I — Ingénierie Technologique
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F39C12" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  Pôle II — Conseil & Formation
                </span>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} style={{
            marginTop: "3rem", height: 1,
            background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
          }} />
        </motion.header>

        {/* ── Pôle I ── */}
        <PoleSection
          number="I" label="Ingénierie Technologique"
          accent="#D35400" services={POLE_I} delay={0.1}
        />

        {/* ── Pôle II ── */}
        <PoleSection
          number="II" label="Conseil & Formation"
          accent="#F39C12" services={POLE_II} delay={0.15}
        />

        {/* ── CTA bas de page ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{
            marginTop: "2rem",
            padding: "3rem",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <p style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(18px, 1.6rem, 1.8rem)",
              color: "#fff", fontWeight: 500, marginBottom: "0.5rem",
            }}>
              Un projet en tête ?
            </p>
            <p style={{ fontSize: "clamp(13px, 0.9rem, 0.95rem)", color: "rgba(255,255,255,0.45)" }}>
              Discutons de vos besoins et construisons ensemble la solution adaptée.
            </p>
          </div>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            padding: "0.9rem 2rem",
            background: "#D35400",
            color: "#fff",
            borderRadius: "0.6rem",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(12px, 0.82rem, 0.88rem)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
            transition: "background 0.2s",
          }}>
            Démarrer un projet
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
