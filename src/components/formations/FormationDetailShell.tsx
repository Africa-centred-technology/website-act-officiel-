"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Formation } from "@/lib/data/formations";

const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

const GREEN = "#16a34a";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

/* ── Accordion Item ─────────────────────────────────── */
function AccordionItem({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "1rem",
          padding: "1.1rem 0", textAlign: "left",
        }}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 24, height: 24, flexShrink: 0,
            border: `1.5px solid ${accent}`,
            borderRadius: "50%",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
        <span style={{
          fontWeight: 700, fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
          color: open ? accent : "rgba(255,255,255,0.9)",
          letterSpacing: "0.02em", transition: "color 0.2s",
        }}>
          {title}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: "1.5rem", paddingLeft: "2.5rem" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────── */
function Badge({ label, accent }: { label: string; accent: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      padding: "0.3rem 0.75rem",
      border: `1px solid ${accent}44`,
      borderRadius: "0.25rem",
      fontSize: "0.78rem", color: accent,
      letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function FormationDetailShell({ formation }: { formation: Formation }) {
  const accent = GREEN;

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
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "clamp(6rem, 10vw, 9rem) clamp(1.5rem, 5vw, 3rem) 6rem" }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}
        >
          <Link href="/services" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.1em" }}>
            Services
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <Link href="/services" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", textDecoration: "none", letterSpacing: "0.1em" }}>
            Catalogue de Formations
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: accent, fontSize: "0.82rem", letterSpacing: "0.1em" }}>{formation.secteur}</span>
        </motion.div>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "start", marginBottom: "4rem" }}>
          <div>
            {/* Secteur + niveau */}
            <motion.div
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span style={{ fontSize: "0.82rem", color: accent, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700 }}>
                Pôle III · Formation
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
                {formation.secteur}
              </span>
            </motion.div>

            {/* Title */}
            <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
              <motion.h1
                initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [...EASE] }}
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3.8rem)", fontWeight: 900,
                  lineHeight: 1.05, letterSpacing: "-0.02em",
                  textTransform: "uppercase", color: "#fff", margin: 0,
                }}
              >
                {formation.title}
              </motion.h1>
            </div>

            {/* Accroche */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.2rem)", color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7, maxWidth: "640px",
              }}
            >
              {formation.accroche}
            </motion.p>
          </div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${accent}33`,
              borderRadius: "0.75rem",
              padding: "1.5rem",
              minWidth: "200px",
              flexShrink: 0,
            }}
          >
            {[
              { icon: "⏱", label: "Durée", value: formation.duree },
              { icon: "📍", label: "Format", value: formation.format },
              { icon: "📊", label: "Niveau", value: formation.niveau },
              ...(formation.parcours ? [{ icon: "🎓", label: "Parcours", value: formation.parcours }] : []),
            ].map(item => (
              <div key={item.label} style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                  {item.icon} {item.label}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 600 }}>{item.value}</p>
              </div>
            ))}
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: `1px solid ${accent}22` }}>
              <Link href="/contact" style={{
                display: "block", textAlign: "center",
                padding: "0.75rem 1rem",
                background: accent,
                color: "#fff", textDecoration: "none",
                borderRadius: "0.4rem",
                fontSize: "0.82rem", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                S'inscrire
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [...EASE] }}
          style={{ height: 1, background: `linear-gradient(90deg, ${accent}55, transparent)`, originX: 0, marginBottom: "3rem" }}
        />

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "4rem", alignItems: "start" }}>

          {/* Left — accordion details */}
          <div>
            {/* Public cible */}
            <AccordionItem title="Public cible" accent={accent}>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {formation.publicCible}
              </p>
            </AccordionItem>

            {/* Objectifs */}
            <AccordionItem title="Objectifs pédagogiques" accent={accent}>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {formation.objectifs.map((obj, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "0.45em" }} />
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.92rem", lineHeight: 1.6 }}>{obj}</span>
                  </li>
                ))}
              </ul>
            </AccordionItem>

            {/* Programme */}
            <AccordionItem title="Programme et modules" accent={accent}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {formation.programme.map((mod, mi) => (
                  <div key={mi}>
                    <p style={{ fontWeight: 700, color: accent, fontSize: "0.88rem", marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
                      {mod.module}
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {mod.details.map((d, di) => (
                        <li key={di} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start" }}>
                          <span style={{ color: `${accent}88`, fontSize: "0.8rem", marginTop: "0.3em", flexShrink: 0 }}>—</span>
                          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", lineHeight: 1.55 }}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionItem>

            {/* Prérequis */}
            <AccordionItem title="Prérequis" accent={accent}>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {formation.prerequis}
              </p>
            </AccordionItem>

            {/* Méthode */}
            <AccordionItem title="Méthode pédagogique" accent={accent}>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                {formation.methode}
              </p>
            </AccordionItem>

            {/* S'inscrire */}
            <AccordionItem title="S'inscrire" accent={accent}>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1rem" }}>
                Pour vous inscrire ou obtenir plus d'informations sur cette formation, contactez notre équipe.
              </p>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.7rem 1.5rem",
                background: accent, color: "#fff", textDecoration: "none",
                borderRadius: "0.4rem", fontSize: "0.85rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Nous contacter
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </AccordionItem>
          </div>

          {/* Right — livrables + contact */}
          <div style={{ position: "sticky", top: "7rem" }}>

            {/* Ce que vous repartez avec */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${accent}33`,
                borderRadius: "0.75rem",
                padding: "1.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "0.8rem", color: accent, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.2rem" }}>
                Ce que vous repartez avec
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {formation.livrables.map((l, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "0.2em" }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem", lineHeight: 1.55 }}>{l}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}
            >
              <Badge label={formation.niveau} accent={accent} />
              <Badge label={formation.format} accent={accent} />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.5 }}
            >
              <Link href="/contact" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                padding: "1rem 1.5rem",
                background: accent, color: "#fff", textDecoration: "none",
                borderRadius: "0.5rem",
                fontSize: "0.88rem", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                width: "100%",
              }}>
                Demander cette formation
              </Link>
              <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                Réponse sous 48h ouvrées
              </p>
            </motion.div>
          </div>
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link href="/services" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            color: "rgba(255,255,255,0.4)", fontSize: "0.82rem",
            textDecoration: "none", letterSpacing: "0.1em",
            transition: "color 0.2s",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour au catalogue
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
