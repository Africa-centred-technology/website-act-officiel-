"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Briefcase, ChevronDown, ChevronUp, ArrowRight, Sparkles, Target, Zap, BookOpen } from "lucide-react";

const DARK    = "#0A1410";
const ORANGE  = "#D35400";
const GOLD    = "#F39C12";
const GREEN   = "#16a34a";
const LINE    = "rgba(255,255,255,0.07)";
const TXT     = "#FFFFFF";
const TXT_SOFT = "rgba(255,255,255,0.70)";
const TXT_MUTED = "rgba(255,255,255,0.42)";
const FONT_HEAD = "Futura, var(--font-display), 'Century Gothic', sans-serif";
const FONT_BODY = "var(--font-body), 'Poppins', system-ui, sans-serif";

const DOMAIN_COLOR: Record<string, string> = {
  "Ingénierie IA":       ORANGE,
  "Data & IA":           GOLD,
  "Ingénierie Logicielle": "#60a5fa",
  "Conseil":             GREEN,
};

const VALUE_ICONS = [Target, Zap, Sparkles, BookOpen];

/* ── Job card ─────────────────────────────────────────── */
function JobCard({ job }: { job: any }) {
  const [open, setOpen] = useState(false);
  const accent = DOMAIN_COLOR[job.domain] ?? ORANGE;

  return (
    <motion.div
      layout
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${LINE}`,
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      whileHover={{ borderColor: `${accent}44` }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "1.8rem 2rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Domain badge */}
          <span style={{
            display: "inline-block",
            fontFamily: FONT_HEAD,
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accent,
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            borderRadius: "99px",
            padding: "0.2rem 0.7rem",
            marginBottom: "0.7rem",
          }}>
            {job.domain}
          </span>

          {/* Title */}
          <h3 style={{
            fontFamily: FONT_HEAD,
            fontWeight: 800,
            fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
            color: TXT,
            margin: "0 0 0.6rem",
            letterSpacing: "0.02em",
          }}>
            {job.title}
          </h3>

          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: FONT_BODY, fontSize: "0.82rem", color: TXT_MUTED }}>
              <MapPin size={13} /> {job.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: FONT_BODY, fontSize: "0.82rem", color: TXT_MUTED }}>
              <Briefcase size={13} /> {job.type}
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.8rem" }}>
            {job.tags.map((tag: string) => (
              <span key={tag} style={{
                fontFamily: FONT_BODY,
                fontSize: "0.72rem",
                color: TXT_MUTED,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${LINE}`,
                borderRadius: "6px",
                padding: "0.15rem 0.55rem",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron */}
        <div style={{ flexShrink: 0, color: accent, marginTop: "0.2rem" }}>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: `1px solid ${LINE}`,
              padding: "1.8rem 2rem 2rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
            className="job-detail-grid"
            >
              {/* Summary */}
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.92rem", color: TXT_SOFT, lineHeight: 1.75, margin: 0 }}>
                  {job.summary}
                </p>
              </div>

              {/* Missions */}
              <div>
                <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: accent, marginBottom: "0.9rem" }}>
                  Missions
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {job.missions.map((m: string, i: number) => (
                    <li key={i} style={{ display: "flex", gap: "0.6rem", fontFamily: FONT_BODY, fontSize: "0.85rem", color: TXT_SOFT, lineHeight: 1.55 }}>
                      <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: accent, marginTop: "0.45rem" }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Profil */}
              <div>
                <p style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: "0.9rem" }}>
                  Profil recherché
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {job.profil.map((p: string, i: number) => (
                    <li key={i} style={{ display: "flex", gap: "0.6rem", fontFamily: FONT_BODY, fontSize: "0.85rem", color: TXT_SOFT, lineHeight: 1.55 }}>
                      <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: GOLD, marginTop: "0.45rem" }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA postuler */}
              <div style={{ gridColumn: "1 / -1" }}>
                <a
                  href={`mailto:carrieres@a-ct.ma?subject=Candidature — ${job.title}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: accent,
                    color: "#fff",
                    fontFamily: FONT_BODY,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
                    padding: "0.85rem 1.8rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                >
                  Postuler à ce poste <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main shell ───────────────────────────────────────── */
export default function CarrieresShell() {
  const t = useTranslations("carrieres");

  const why: Array<{ title: string; desc: string }> = t.raw("whyAct.items");
  const values: Array<{ title: string; desc: string }> = t.raw("values.items");
  const jobs: any[] = t.raw("openings.jobs");

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: TXT, fontFamily: FONT_BODY, paddingTop: "clamp(4rem, 7vh, 5.5rem)" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "56vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "clamp(6rem, 12vh, 10rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vh, 6rem)",
        overflow: "hidden",
      }}>
        {/* Grid bg */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(211,84,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.03) 1px,transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        {/* Glow */}
        <div aria-hidden style={{
          position: "absolute", top: "30%", left: "60%",
          width: "50vw", height: "50vw",
          background: `radial-gradient(circle, ${ORANGE}18 0%, transparent 65%)`,
          pointerEvents: "none",
        }} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: FONT_HEAD, fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: ORANGE, marginBottom: "1.4rem" }}
        >
          {t("hero.eyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{ fontFamily: FONT_HEAD, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(3.5rem, 7vw, 7rem)", lineHeight: 0.95, marginBottom: "2rem" }}
        >
          <span style={{ color: TXT }}>{t("hero.titleLine1")}</span><br />
          <span style={{ color: ORANGE }}>{t("hero.titleLine2")}</span><br />
          <span style={{ color: TXT }}>{t("hero.titleLine3")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ fontFamily: FONT_BODY, fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", color: TXT_SOFT, lineHeight: 1.75, maxWidth: "650px" }}
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Orange rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.5 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${ORANGE}, transparent)`, transformOrigin: "left" }}
        />
      </section>

      {/* ── WHY ACT ───────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 8rem)" }}>
        <p style={{ fontFamily: FONT_HEAD, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: ORANGE, marginBottom: "1rem" }}>
          {t("whyAct.label")}
        </p>
        <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(2.5rem, 4vw, 4rem)", marginBottom: "3rem" }}>
          {t("whyAct.title")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {why.map((item, i) => {
            const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE}`, borderRadius: "1rem", padding: "1.8rem" }}
              >
                <div style={{ width: 42, height: 42, borderRadius: "10px", background: `${ORANGE}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <Icon size={20} color={ORANGE} />
                </div>
                <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: "1rem", color: TXT, marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: "0.85rem", color: TXT_SOFT, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── OFFRES ────────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 8rem)", borderTop: `1px solid ${LINE}` }}>
        <p style={{ fontFamily: FONT_HEAD, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: ORANGE, marginBottom: "1rem" }}>
          {t("openings.label")}
        </p>
        <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(2.5rem, 4vw, 4rem)", marginBottom: "3rem" }}>
          {t("openings.title")} <span style={{ color: ORANGE }}>{t("openings.titleAccent")}</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "900px" }}>
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* ── VALEURS ───────────────────────────────────────── */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 8rem)", borderTop: `1px solid ${LINE}` }}>
        <p style={{ fontFamily: FONT_HEAD, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: "1rem" }}>
          {t("values.label")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: "1.2rem" }}
            >
              <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: "0.95rem", color: GOLD, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{v.title}</h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: "0.83rem", color: TXT_SOFT, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CANDIDATURE SPONTANEE ─────────────────────────── */}
      <section style={{
        margin: "0 clamp(1.5rem, 6vw, 8rem) clamp(4rem, 8vw, 7rem)",
        background: `linear-gradient(135deg, ${ORANGE}12, ${GOLD}08)`,
        border: `1px solid ${ORANGE}30`,
        borderRadius: "1.2rem",
        padding: "clamp(2.5rem, 5vw, 4rem)",
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ flex: "1 1 380px" }}>
          <p style={{ fontFamily: FONT_HEAD, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: ORANGE, marginBottom: "0.8rem" }}>
            {t("spontaneous.label")}
          </p>
          <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 900, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", color: TXT, marginBottom: "0.8rem", textTransform: "uppercase" }}>
            {t("spontaneous.title")}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.92rem", color: TXT_SOFT, lineHeight: 1.75, margin: 0 }}>
            {t("spontaneous.desc")}
          </p>
        </div>
        <a
          href={`mailto:${t("spontaneous.email")}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: ORANGE,
            color: "#fff",
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.04em",
            padding: "1rem 2.2rem",
            borderRadius: "8px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
        >
          {t("spontaneous.cta")} <ArrowRight size={18} />
        </a>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section style={{
        padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 8rem)",
        borderTop: `1px solid ${LINE}`,
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: "1rem", color: TXT_SOFT, margin: 0 }}>
          {t("cta.title")} <span style={{ color: TXT_MUTED }}>{t("cta.desc")}</span>
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            color: ORANGE,
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: "0.9rem",
            padding: "0.75rem 1.5rem",
            border: `1.5px solid ${ORANGE}55`,
            borderRadius: "8px",
            textDecoration: "none",
            transition: "background 0.2s, border-color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {t("cta.button")} <ArrowRight size={15} />
        </Link>
      </section>

      <style jsx global>{`
        @media (max-width: 640px) {
          .job-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
