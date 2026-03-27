"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES, POLE_I, POLE_II, POLE_III, type Service } from "@/lib/data/services";

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
function ServiceCard({ svc, index }: { svc: Service; index: number }) {
  return (
    <motion.div variants={fadeUp} style={{ position: "relative", padding: "0 12px", marginBottom: "4rem" }}>
      <Link href={`/services/${svc.slug}`} style={{ textDecoration: "none", display: "block", position: "relative" }}>
        {/* Conteneur Image avec overflow controlé */}
        <motion.article
          whileHover={{ scale: 1.02 }}
          className="relative group overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500"
          style={{
            aspectRatio: "1 / 1",
            background: "#0a0a0a",
            cursor: "pointer",
            maxWidth: "300px",
            margin: "0 auto",
          }}
        >
          {/* Image de fond avec effet Ken Burns au hover */}
          <motion.img
            src={svc.heroImage}
            alt={svc.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            style={{
              opacity: 0.75,
              filter: "brightness(0.85)",
            }}
          />

          {/* Overlay dégradé pour la profondeur */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(3,10,24,0.95) 0%, transparent 100%)",
            }}
          />

          {/* Halo d'accentuation subtil */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${svc.accent}88 0%, transparent 60%)`,
            }}
          />

          <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-500 pointer-events-none" />
          
          {/* Reflet lumineux furtif */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        </motion.article>

        {/* Le bloc de titre (Exactement comme sur la capture) */}
        <div
          style={{
            position: "absolute",
            bottom: "0", // Calé complètement bas
            left: "50%",
            transform: "translateX(-50%)",
            width: "70%", // Largeur encore plus réduite
            maxWidth: "260px",
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
          }}
          className="transition-transform duration-500 group-hover:-translate-y-1"
        >
          <div
            style={{
              background: "#20232A", // Gris sombre uni sans effet blur
              padding: "1.5rem 1rem", // Plus haut
              borderRadius: "0.25rem 0.25rem 0 0", // Coins arrondis seulement en haut
              boxShadow: "0 -5px 20px rgba(0,0,0,0.3)",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "12rem", // Encore plus haut
            }}
          >

            <h1 style={{
              fontFamily: "var(--font-heading), system-ui, sans-serif",
              fontSize: "2rem",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.3,
              textAlign: "center",
              margin: 0,
            }}>
              {svc.title}
            </h1>


          </div>
        </div>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{
          gap: "2rem 2rem",
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
              Trois pôles d'expertise complémentaires — l'ingénierie technologique pour construire,
              le conseil pour structurer et la formation pour durer. Ensemble, ils forment une proposition unique
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
                  Pôle II — Conseil
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  Pôle III — Formation
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
          number="II" label="Conseil"
          accent="#F39C12" services={POLE_II} delay={0.15}
        />

        {/* ── Pôle III ── */}
        <PoleSection
          number="III" label="Formation"
          accent="#16a34a" services={POLE_III} delay={0.2}
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
