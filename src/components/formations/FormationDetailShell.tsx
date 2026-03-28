"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Formation, FORMATIONS } from "@/lib/data/formations";
import { Clock, Users, BarChart3, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";

const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

const ORANGE = "#D35400";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

/* ── Main Component ─────────────────────────────────── */
export default function FormationDetailShell({ formation }: { formation: Formation }) {
  const accent = ORANGE;

  // Trouver 3 formations similaires (même secteur ou catégorie)
  const formationsSimilaires = FORMATIONS
    .filter(f => f.id !== formation.id && (f.secteur === formation.secteur || f.categorie === formation.categorie))
    .slice(0, 3);

  return (
    <div style={{ background: "#070E1C", minHeight: "100vh", color: "#fff", position: "relative" }}>
      {/* Background layers */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>

      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [...EASE] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: accent, originX: 0, zIndex: 100 }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", padding: "clamp(6rem, 10vw, 9rem) clamp(1.5rem, 5vw, 3rem) 6rem" }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem", flexWrap: "wrap" }}
        >
          <Link href="/services" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.1em" }}>
            Services
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <Link href="/services" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.1em" }}>
            Catalogue de Formations
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: accent, fontSize: "0.9rem", letterSpacing: "0.1em" }}>{formation.secteur}</span>
        </motion.div>

        {/* Hero Section avec Image et Caractéristiques */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", marginBottom: "5rem", alignItems: "start" }}>

          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative",
              width: "100%",
              height: "500px",
              borderRadius: "1rem",
              overflow: "hidden",
              border: `1px solid ${accent}33`,
            }}>
              <img
                src="/images/poles/pole-formation.jpg"
                alt={formation.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.3) 50%, rgba(7,14,28,0.9) 100%)",
              }} />

              {/* Secteur badge sur l'image */}
              <div style={{
                position: "absolute",
                top: "1.5rem",
                left: "1.5rem",
                padding: "0.6rem 1.2rem",
                background: accent,
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}>
                {formation.secteur}
              </div>
            </div>
          </motion.div>

          {/* Right — Caractéristiques */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Catégorie + niveau */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}` }} />
              <span style={{ fontSize: "0.9rem", color: accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                Pôle III · Formation
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "var(--font-40)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: "2rem",
              fontFamily: "var(--font-display)",
            }}>
              {formation.title}
            </h1>

            {/* Accroche */}
            <p style={{
              fontSize: "var(--font-20)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: "3rem",
              fontFamily: "var(--font-body)",
            }}>
              {formation.accroche}
            </p>

            {/* Caractéristiques Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}>
              {[
                { icon: Clock, label: "Durée", value: formation.duree },
                { icon: BookOpen, label: "Format", value: formation.format },
                { icon: BarChart3, label: "Niveau", value: formation.niveau },
                { icon: Users, label: "Catégorie", value: formation.categorie },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${accent}33`,
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <item.icon size={24} color={accent} />
                    <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontFamily: "var(--font-body)" }}>
                      {item.label}
                    </p>
                  </div>
                  <p style={{ fontSize: "var(--font-18)", color: "#fff", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>{item.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Prix si disponible */}
            {formation.prix && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                style={{
                  background: `linear-gradient(135deg, ${accent}22, ${accent}11)`,
                  border: `2px solid ${accent}`,
                  borderRadius: "0.75rem",
                  padding: "2rem",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <p style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-body)",
                }}>
                  Tarif
                </p>
                <p style={{
                  fontSize: "var(--font-40)",
                  fontWeight: 900,
                  color: accent,
                  lineHeight: 1,
                  fontFamily: "var(--font-display)",
                  marginBottom: "0.5rem",
                }}>
                  {formation.prix}
                </p>
                <p style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-body)",
                }}>
                  par participant
                </p>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link href="/contact" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1.2rem 2rem",
                background: accent,
                color: "#fff",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 10px 30px ${accent}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                S'inscrire à cette formation
                <ArrowRight size={20} />
              </Link>
              <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                Réponse sous 48h ouvrées
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.9, ease: [...EASE] }}
          style={{ height: 1, background: `linear-gradient(90deg, ${accent}55, transparent)`, originX: 0, marginBottom: "5rem" }}
        />

        {/* Content Sections - Plus de listes déroulantes, tout affiché */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "4rem", marginBottom: "5rem" }}>

          {/* Left — Contenu principal */}
          <div>
            {/* Public cible */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "4rem" }}
            >
              <h2 style={{
                fontSize: "var(--font-35)",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: "#fff",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>
                <span style={{ color: accent }}>Public</span> cible
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "var(--font-18)", fontFamily: "var(--font-body)" }}>
                {formation.publicCible}
              </p>
            </motion.section>

            {/* Prérequis */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "4rem" }}
            >
              <h2 style={{
                fontSize: "var(--font-35)",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: "#fff",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>
                <span style={{ color: accent }}>Prérequis</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "var(--font-18)", fontFamily: "var(--font-body)" }}>
                {formation.prerequis}
              </p>
            </motion.section>

            {/* Objectifs */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "4rem" }}
            >
              <h2 style={{
                fontSize: "var(--font-35)",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: "#fff",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>
                Objectifs <span style={{ color: accent }}>pédagogiques</span>
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {formation.objectifs.map((obj, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
                  >
                    <CheckCircle2 size={24} color={accent} style={{ flexShrink: 0, marginTop: "0.2em" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "var(--font-18)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{obj}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            {/* Programme */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "4rem" }}
            >
              <h2 style={{
                fontSize: "var(--font-35)",
                fontWeight: 900,
                marginBottom: "2rem",
                color: "#fff",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>
                Programme <span style={{ color: accent }}>& modules</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {formation.programme.map((mod, mi) => (
                  <motion.div
                    key={mi}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: mi * 0.1 }}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${accent}33`,
                      borderRadius: "0.75rem",
                      padding: "2rem",
                    }}
                  >
                    <h3 style={{ fontWeight: 800, color: accent, fontSize: "var(--font-20)", marginBottom: "1rem", letterSpacing: "0.02em", fontFamily: "var(--font-display)" }}>
                      {mod.module}
                    </h3>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {mod.details.map((d, di) => (
                        <li key={di} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <span style={{ color: accent, fontSize: "1.2rem", marginTop: "0.2em", flexShrink: 0 }}>•</span>
                          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "var(--font-18)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Méthode pédagogique */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "4rem" }}
            >
              <h2 style={{
                fontSize: "var(--font-35)",
                fontWeight: 900,
                marginBottom: "1.5rem",
                color: "#fff",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}>
                Méthode <span style={{ color: accent }}>pédagogique</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "var(--font-18)", fontFamily: "var(--font-body)" }}>
                {formation.methode}
              </p>
            </motion.section>
          </div>

          {/* Right — Sidebar sticky */}
          <div style={{ position: "sticky", top: "7rem" }}>

            {/* Ce que vous repartez avec */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.55 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${accent}33`,
                borderRadius: "0.75rem",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", color: accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-body)" }}>
                Ce que vous repartez avec
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {formation.livrables.map((l, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <CheckCircle2 size={22} color={accent} style={{ flexShrink: 0, marginTop: "0.1em" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "var(--font-18)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <Link href="/contact" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1rem 1.5rem",
                background: accent,
                color: "#fff",
                textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                width: "100%",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 20px ${accent}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                Demander cette formation
              </Link>
            </motion.div>

            {/* Parcours si disponible */}
            {formation.parcours && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${accent}22`,
                  borderRadius: "0.75rem",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  🎓 Parcours
                </p>
                <p style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 600, margin: 0 }}>{formation.parcours}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Formations similaires */}
        {formationsSimilaires.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginTop: "6rem" }}
          >
            <h2 style={{
              fontSize: "var(--font-40)",
              fontWeight: 900,
              marginBottom: "3rem",
              color: "#fff",
              textTransform: "uppercase",
              textAlign: "center",
              fontFamily: "var(--font-display)",
            }}>
              Formations qui pourraient <span style={{ color: accent }}>vous intéresser</span>
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}>
              {formationsSimilaires.map((f, i) => (
                <motion.article
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${accent}33`,
                    borderRadius: "1rem",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 15px 40px ${accent}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${accent}33`;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Link href={`/formations/${f.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      position: "relative",
                      height: "220px",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.3)",
                    }}>
                      <img
                        src="/images/poles/pole-formation.jpg"
                        alt={f.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.7)",
                        }}
                      />
                      <div style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        padding: "0.4rem 0.8rem",
                        background: accent,
                        borderRadius: "0.25rem",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        {f.niveau}
                      </div>
                    </div>

                    <div style={{ padding: "2rem" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.5)",
                      }}>
                        <Clock size={14} />
                        <span>{f.duree}</span>
                        <span>•</span>
                        <span>{f.format}</span>
                      </div>

                      <h3 style={{
                        fontSize: "var(--font-20)",
                        fontWeight: 800,
                        marginBottom: "1rem",
                        color: "#fff",
                        lineHeight: 1.3,
                        fontFamily: "var(--font-display)",
                      }}>
                        {f.title}
                      </h3>

                      <p style={{
                        fontSize: "var(--font-18)",
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "1.5rem",
                        fontFamily: "var(--font-body)",
                      }}>
                        {f.accroche.slice(0, 120)}...
                      </p>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: accent,
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      }}>
                        En savoir plus
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ marginTop: "6rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link href="/services" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.9rem",
            textDecoration: "none",
            letterSpacing: "0.1em",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour au catalogue de formations
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <FooterStrip />
    </div>
  );
}
