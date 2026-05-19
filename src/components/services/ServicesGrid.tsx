"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SERVICES, POLE_I, POLE_II, POLE_III, type Service } from "@/lib/data/services";
import { useDataMessages } from "@/i18n/data-i18n";

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
function ServiceCard({ svc }: { svc: Service }) {
  const msg = useDataMessages();
  const i18n = msg.services.items[svc.slug];
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/services/${svc.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <motion.article
          whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${svc.accent}30` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative group overflow-hidden rounded-2xl"
          style={{
            aspectRatio: "1 / 1",
            background: "#0a0a0a",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Image — 60% haut */}
          <div style={{ flex: "0 0 60%", position: "relative", overflow: "hidden" }}>
            <motion.img
              src={svc.heroImage}
              alt={i18n?.title ?? svc.slug}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              style={{ opacity: 0.9 }}
            />
            {/* Fondu bas vers le panel */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "50%",
                background: "linear-gradient(to bottom, transparent 0%, #20232A 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Halo accent subtil */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 80%, ${svc.accent}88 0%, transparent 65%)` }}
            />
          </div>

          {/* Panel titre — 40% bas */}
          <div
            style={{
              flex: "0 0 40%",
              background: "#20232A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem 1.6rem",
            }}
          >
            <h3 style={{
              fontFamily: "var(--font-heading), Futura, 'Century Gothic', system-ui, sans-serif",
              fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.3,
              textAlign: "center",
              margin: 0,
            }}>
              {i18n?.title ?? svc.slug}
            </h3>
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
  const t = useTranslations("services.grid");
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
          {t("poleLabel", { number, label })}
        </motion.h2>
      </motion.div>

      {/* Grille */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
        variants={stagger(delay + 0.1)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {services.map((svc) => (
          <ServiceCard key={svc.slug} svc={svc} />
        ))}
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════ */
export default function ServicesGrid() {
  const t = useTranslations("services.grid");
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A1410",
      paddingTop: "max(72px, clamp(6rem, 10vw, 9rem))",
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
            {t("eyebrow")}
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
            {t("h1")}
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
              {t("description")}
            </p>

            <div style={{
              display: "flex", flexDirection: "column", gap: "0.75rem",
              paddingLeft: "1.5rem",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D35400" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  {t("poleI")}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D35400" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  {t("poleII")}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D35400" }} />
                <span style={{ fontSize: "clamp(11px, 0.78rem, 0.82rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  {t("poleIII")}
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
          number="I" label={t("poleI").replace(/Pôle I[^—]*— ?/, "")}
          accent="#D35400" services={POLE_I} delay={0.1}
        />

        {/* ── Pôle II ── */}
        <PoleSection
          number="II" label={t("poleII").replace(/Pôle II[^—]*— ?/, "")}
          accent="#D35400" services={POLE_II} delay={0.15}
        />

        {/* ── Pôle III ── */}
        <PoleSection
          number="III" label={t("poleIII").replace(/Pôle III[^—]*— ?/, "")}
          accent="#D35400" services={POLE_III} delay={0.2}
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
              {t("ctaTitle")}
            </p>
            <p style={{ fontSize: "clamp(13px, 0.9rem, 0.95rem)", color: "rgba(255,255,255,0.45)" }}>
              {t("ctaDesc")}
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
            {t("ctaButton")}
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
