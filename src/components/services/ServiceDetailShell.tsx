"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Service } from "@/lib/data/services";

/* ── Variants ─────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = (delay = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: delay } },
});

/* ── Icône SVG ──────────────────────────────────────── */
function SvcIcon({ path, color, size = 28 }: { path: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

/* ── Check icon ─────────────────────────────────────── */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════ */
export default function ServiceDetailShell({ svc }: { svc: Service }) {
  const isGold = svc.poleN === "II";

  return (
    <div style={{ minHeight: "100vh", background: "#0A1410" }}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "clamp(7rem, 12vw, 11rem)",
        paddingBottom: "clamp(4rem, 7vw, 7rem)",
      }}>
        {/* Fond gradient propre au service */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: svc.bg,
          opacity: 0.65,
        }} />
        {/* Numéro décoratif géant */}
        <div aria-hidden style={{
          position: "absolute",
          right: "-2rem", top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(120px, 22vw, 280px)",
          fontWeight: 700,
          color: `${svc.accent}08`,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
        }}>
          {svc.n}
        </div>

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "1180px", margin: "0 auto",
          padding: "0 clamp(1.2rem, 5vw, 3rem)",
        }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "2.5rem",
              fontSize: "clamp(11px, 0.75rem, 0.8rem)",
              letterSpacing: "0.12em",
            }}
          >
            <Link href="/services" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
              Services
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: svc.accent }}>
              {svc.title.replace(/\n/g, " ")}
            </span>
          </motion.nav>

          <motion.div
            initial="hidden" animate="show"
            variants={stagger(0.05)}
          >
            {/* Badge pôle */}
            <motion.div variants={fadeUp} style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: `${svc.accent}18`, border: `1px solid ${svc.accent}40`,
                borderRadius: "2rem",
                padding: "0.3rem 0.9rem",
                fontSize: "clamp(10px, 0.72rem, 0.78rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: svc.accent,
                fontFamily: "Futura, system-ui, sans-serif",
              }}>
                <span style={{
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontSize: "0.65em",
                }}>
                  Pôle {svc.poleN}
                </span>
                <span style={{ width: 1, height: 10, background: `${svc.accent}50` }} />
                {svc.pole}
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1 variants={fadeUp} style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(32px, 5.5vw, 6rem)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
              marginBottom: "1.5rem",
              letterSpacing: "-0.01em",
            }}>
              {svc.title}
            </motion.h1>

            {/* Ligne accent + tagline */}
            <motion.div variants={fadeUp} style={{
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{ width: 40, height: 2, background: svc.accent, borderRadius: 1 }} />
              <p style={{
                fontSize: "clamp(15px, 1.1rem, 1.2rem)",
                color: "rgba(255,255,255,0.6)",
                fontStyle: "italic",
                letterSpacing: "0.02em",
              }}>
                {svc.tagline}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ══ CONTENU ═══════════════════════════════════════ */}
      <div style={{
        maxWidth: "1180px", margin: "0 auto",
        padding: "0 clamp(1.2rem, 5vw, 3rem)",
        paddingBottom: "6rem",
      }}>

        {/* ── Intro ── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          variants={stagger(0)}
          style={{
            maxWidth: 760,
            padding: "4rem 0 4rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <motion.div variants={fadeUp} style={{
            display: "flex", alignItems: "flex-start", gap: "1rem",
          }}>
            <div style={{
              flexShrink: 0, marginTop: "0.2rem",
              width: 44, height: 44,
              background: `${svc.accent}12`,
              border: `1px solid ${svc.accent}30`,
              borderRadius: "0.75rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SvcIcon path={svc.icon} color={svc.accent} size={22} />
            </div>
            <p style={{
              fontSize: "clamp(15px, 1.05rem, 1.12rem)",
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.65)",
            }}>
              {svc.intro}
            </p>
          </motion.div>
        </motion.section>

        {/* ── Grille principale : sous-services + bénéfices ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr min(380px, 35%)",
          gap: "3rem",
          marginTop: "3.5rem",
          alignItems: "start",
        }}
          className="detail-grid"
        >
          {/* ── Colonne gauche : sous-services ── */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            variants={stagger(0)}
          >
            <motion.p variants={fadeUp} style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(10px, 0.72rem, 0.78rem)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: `${svc.accent}AA`,
              marginBottom: "1.75rem",
            }}>
              Ce que nous faisons
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {svc.subs.map((sub, i) => (
                <motion.div key={i} variants={fadeUp} style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderLeft: `3px solid ${svc.accent}`,
                  borderRadius: "0 0.9rem 0.9rem 0",
                  padding: "1.75rem 2rem",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}>
                    <span style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(10px, 0.72rem, 0.76rem)",
                      color: `${svc.accent}80`,
                      letterSpacing: "0.15em",
                    }}>
                      0{i + 1}
                    </span>
                    <h3 style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(14px, 1rem, 1.05rem)",
                      fontWeight: 500, color: "#fff",
                    }}>
                      {sub.title}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: "clamp(13px, 0.88rem, 0.93rem)",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    {sub.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Colonne droite : bénéfices + livrables ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Bénéfices */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              variants={stagger(0.1)}
              style={{
                background: `${svc.accent}0C`,
                border: `1px solid ${svc.accent}25`,
                borderRadius: "1rem",
                padding: "2rem",
              }}
            >
              <motion.p variants={fadeUp} style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(10px, 0.72rem, 0.78rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: `${svc.accent}BB`,
                marginBottom: "1.25rem",
              }}>
                Ce que vous gagnez
              </motion.p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {svc.benefits.map((b, i) => (
                  <motion.div key={i} variants={fadeUp} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                  }}>
                    <div style={{
                      flexShrink: 0,
                      width: 24, height: 24,
                      borderRadius: "50%",
                      background: `${svc.accent}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <CheckIcon color={svc.accent} />
                    </div>
                    <span style={{
                      fontSize: "clamp(13px, 0.9rem, 0.95rem)",
                      color: "rgba(255,255,255,0.75)",
                    }}>
                      {b}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Livrables */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              variants={stagger(0.15)}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "2rem",
              }}
            >
              <motion.p variants={fadeUp} style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(10px, 0.72rem, 0.78rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "1.25rem",
              }}>
                Ce que vous recevez
              </motion.p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {svc.deliverables.map((d, i) => (
                  <motion.div key={i} variants={fadeUp} style={{
                    display: "flex", alignItems: "flex-start", gap: "0.75rem",
                  }}>
                    <span style={{
                      flexShrink: 0,
                      marginTop: "0.15rem",
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(10px, 0.68rem, 0.72rem)",
                      color: "rgba(255,255,255,0.25)",
                      letterSpacing: "0.1em",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontSize: "clamp(13px, 0.88rem, 0.92rem)",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.5,
                    }}>
                      {d}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── CTA bas ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
          style={{
            marginTop: "4rem",
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
              Intéressé par ce service ?
            </p>
            <p style={{ fontSize: "clamp(13px, 0.88rem, 0.93rem)", color: "rgba(255,255,255,0.4)" }}>
              Parlons de votre projet — sans engagement, en 30 minutes.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.85rem 1.75rem",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0.6rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(11px, 0.78rem, 0.84rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}>
              ← Tous les services
            </Link>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.65rem",
              padding: "0.85rem 1.75rem",
              background: svc.accent,
              color: "#fff",
              borderRadius: "0.6rem",
              fontFamily: "Futura, system-ui, sans-serif",
              fontSize: "clamp(11px, 0.78rem, 0.84rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Démarrer un projet
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Responsive two-column → one-column */}
      <style>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
