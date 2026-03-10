"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

/* ── Data ──────────────────────────────────────────────── */
const CONTACT_INFO = [
  {
    label: "Téléphone",
    lines: ["+212 694-528498", "+212 662-777507", "+212 779-635687"],
    href: "tel:+212694528498",
    cta: "Appeler →",
    Icon: Phone,
  },
  {
    label: "Email",
    lines: ["contact@act.africa", "support@act.africa"],
    href: "mailto:contact@act.africa",
    cta: "Écrire →",
    Icon: Mail,
  },
  {
    label: "Adresse",
    lines: ["Mer Sultan, 6e Rue château", "Casablanca, Maroc 🇲🇦"],
    href: "#",
    cta: "Voir →",
    Icon: MapPin,
  },
  {
    label: "Horaires",
    lines: ["Lun – Ven : 8h – 18h", "Sam : 9h – 13h"],
    href: "#form",
    cta: "Planifier →",
    Icon: Clock,
  },
];

const FAQS = [
  {
    q: "Comment démarrer un projet avec ACT ?",
    a: "Contactez-nous via le formulaire ou par téléphone. Notre équipe vous recontactera sous 24h pour une première consultation gratuite où nous analyserons vos besoins.",
  },
  {
    q: "Quels sont vos délais de livraison ?",
    a: "Un MVP est livré en moyenne en 8–12 semaines avec des sprints de 2 semaines. Nous vous fournirons une estimation précise après analyse de votre projet.",
  },
  {
    q: "Proposez-vous un support après livraison ?",
    a: "Oui, avec différentes formules de 3 mois à plusieurs années. Chaque projet inclut une période de garantie de 3 mois minimum.",
  },
  {
    q: "Travaillez-vous avec des entreprises internationales ?",
    a: "Absolument. Nous collaborons avec des entreprises du monde entier souhaitant s'implanter ou opérer en Afrique.",
  },
  {
    q: "Quelles technologies utilisez-vous ?",
    a: "Nous utilisons les technologies les plus adaptées à chaque projet : React, Next.js, Django, Python, IA/ML, SIG… Notre approche est technology-agnostic.",
  },
];

const ENGAGEMENTS = [
  "Réponse garantie sous 24h ouvrées",
  "Première consultation 100% gratuite",
  "Devis détaillé et transparent",
  "Confidentialité assurée (NDA disponible)",
];

/* ── Grain ─────────────────────────────────────────────── */
function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px",
      }}
    />
  );
}

/* ── Section label ─────────────────────────────────────── */
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
      <span className="diamond diamond--sm" />
      <span
        style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#D35400",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════ */
export default function ContactShell() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", subject: "", budget: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", company: "", phone: "", subject: "", budget: "", message: "" });
    }, 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1.2rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "0.5rem",
    color: "#fff",
    fontFamily: "Futura, system-ui, sans-serif",
    fontSize: "var(--font-18)",
    outline: "none",
    transition: "border-color 0.25s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070e1c", color: "#fff", overflowX: "hidden" }}>
      <Grain />

      {/* ── HERO ───────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="contact-hero"
        style={{
          position: "relative",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(9rem, 16vh, 14rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 8vh, 7rem)",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
        {/* Glow */}
        <div aria-hidden style={{ position: "absolute", top: "35%", left: "60%", width: "60vw", height: "50vw", background: "radial-gradient(ellipse,rgba(211,84,0,0.07) 0%,transparent 65%)", transform: "translate(-50%,-50%)" }} />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", position: "relative", zIndex: 1 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "1rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Consultation Gratuite
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "var(--font-90)", lineHeight: 0.95, marginBottom: "2.5rem", position: "relative", zIndex: 1 }}
        >
          <span style={{ color: "rgba(255,255,255,0.9)" }}>Construisons</span>
          <br />
          <span style={{ color: "#D35400" }}>Ensemble</span>
        </motion.h1>

        {/* Sub + contact info row */}
        <div className="contact-hero-bottom" style={{ position: "relative", zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "var(--font-20)", lineHeight: 1.72, maxWidth: 500 }}
          >
            Vous avez une vision ? Nous avons l'expertise pour la concrétiser. Discutons de votre
            projet et découvrez comment ACT peut transformer vos ambitions en réalité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flexShrink: 0 }}
          >
            {[
              { Icon: Phone, val: "+212 694-528498", href: "tel:+212694528498" },
              { Icon: Mail,  val: "contact@act.africa", href: "mailto:contact@act.africa" },
            ].map((c) => (
              <a
                key={c.val}
                href={c.href}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontSize: "var(--font-20)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D35400")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
              >
                <c.Icon size={18} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                {c.val}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Orange rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.6 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#D35400,#F39C12,#D35400)", transformOrigin: "left", zIndex: 1 }}
        />
      </section>

      {/* ── CONTACT INFO CARDS ──────────────────────────── */}
      <section style={{ padding: "clamp(4rem,7vw,7rem) clamp(1.5rem,6vw,8rem)" }}>
        <div className="contact-cards-grid">
          {CONTACT_INFO.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: i * 0.08 }}
              style={{
                display: "block",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem,3vw,2.2rem)",
                textDecoration: "none",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(211,84,0,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  background: "rgba(211,84,0,0.1)",
                  border: "1px solid rgba(211,84,0,0.2)",
                  borderRadius: "0.6rem",
                  marginBottom: "1.2rem",
                  color: "#D35400",
                }}
              >
                <c.Icon size={20} strokeWidth={1.8} />
              </div>
              <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#D35400", marginBottom: "0.8rem" }}>
                {c.label}
              </p>
              {c.lines.map((l) => (
                <p key={l} style={{ color: "rgba(255,255,255,0.55)", fontSize: "var(--font-18)", lineHeight: 1.6 }}>{l}</p>
              ))}
              <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D35400", marginTop: "1.2rem" }}>
                {c.cta}
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── FORM + SIDEBAR ──────────────────────────────── */}
      <section
        id="form"
        ref={formRef}
        style={{
          padding: "0 clamp(1.5rem,6vw,8rem) clamp(5rem,9vw,9rem)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ paddingTop: "clamp(4rem,7vw,7rem)" }}>
          <SLabel>Formulaire de contact</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "var(--font-50)", lineHeight: 1.05, marginBottom: "clamp(3rem,5vw,5rem)" }}
          >
            Décrivez votre <span style={{ color: "#D35400" }}>Projet</span>
          </motion.h2>
        </div>

        <div className="contact-form-layout">
          {/* ─── FORM ─── */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1 }}
            onSubmit={handleSubmit}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1rem",
              padding: "clamp(2rem,4vw,3.5rem)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right,#D35400,#F39C12)" }} />

            {/* Row 1 */}
            <div className="form-row" style={{ marginBottom: "1.4rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Nom complet *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom complet"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="votre@entreprise.com"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row" style={{ marginBottom: "1.4rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Entreprise</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Nom de votre entreprise"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+212 XX XXX XX XX"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="form-row" style={{ marginBottom: "1.4rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Type de projet *</label>
                <select
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => ((e.target as HTMLSelectElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.09)")}
                >
                  <option value="" style={{ background: "#070e1c" }}>Sélectionnez un type</option>
                  <option value="web" style={{ background: "#070e1c" }}>Application Web</option>
                  <option value="mobile" style={{ background: "#070e1c" }}>Application Mobile</option>
                  <option value="ia" style={{ background: "#070e1c" }}>IA & Data</option>
                  <option value="sig" style={{ background: "#070e1c" }}>SIG & Cartographie</option>
                  <option value="media" style={{ background: "#070e1c" }}>Plateforme Média</option>
                  <option value="conseil" style={{ background: "#070e1c" }}>Conseil Stratégique</option>
                  <option value="autre" style={{ background: "#070e1c" }}>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Budget estimé</label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => ((e.target as HTMLSelectElement).style.borderColor = "#D35400")}
                  onBlur={(e) => ((e.target as HTMLSelectElement).style.borderColor = "rgba(255,255,255,0.09)")}
                >
                  <option value="" style={{ background: "#070e1c" }}>Sélectionnez une fourchette</option>
                  <option value="small" style={{ background: "#070e1c" }}>5 000 – 15 000 MAD</option>
                  <option value="medium" style={{ background: "#070e1c" }}>15 000 – 50 000 MAD</option>
                  <option value="large" style={{ background: "#070e1c" }}>50 000 – 150 000 MAD</option>
                  <option value="enterprise" style={{ background: "#070e1c" }}>150 000 MAD +</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem" }}>Votre projet *</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                placeholder="Décrivez votre projet, vos objectifs et vos contraintes..."
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "#D35400")}
                onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            {/* Submit */}
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: "rgba(39,174,96,0.12)",
                    border: "1px solid rgba(39,174,96,0.3)",
                    borderRadius: "0.6rem",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700, fontSize: "var(--font-20)", color: "#2ecc71", marginBottom: "0.3rem" }}>
                    ✓ Message envoyé !
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "var(--font-18)" }}>
                    Nous vous recontacterons sous 24h.
                  </p>
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  type="submit"
                  disabled={sending}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    background: sending ? "rgba(211,84,0,0.6)" : "#D35400",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "1.2rem",
                    color: "#fff",
                    fontFamily: "Futura, system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor: sending ? "wait" : "pointer",
                    transition: "background 0.25s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.8rem",
                    minHeight: 48,
                  }}
                  onMouseEnter={(e) => { if (!sending) (e.currentTarget as HTMLElement).style.background = "#b84a00"; }}
                  onMouseLeave={(e) => { if (!sending) (e.currentTarget as HTMLElement).style.background = "#D35400"; }}
                >
                  {sending ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                      />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer ma demande →"
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.form>

          {/* ─── SIDEBAR ─── */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.25 }}
            className="contact-sidebar"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Engagements */}
            <div
              style={{
                background: "rgba(211,84,0,0.05)",
                border: "1px solid rgba(211,84,0,0.15)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem,3vw,2.2rem)",
              }}
            >
              <SLabel>Nos engagements</SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {ENGAGEMENTS.map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
                    <span style={{ color: "#D35400", fontWeight: 900, flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "var(--font-18)", lineHeight: 1.6 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appel direct */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem,3vw,2.2rem)",
              }}
            >
              <SLabel>Préférez-vous appeler ?</SLabel>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "var(--font-18)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Parlez directement à un expert ACT. Disponible du Lun au Ven de 8h à 18h.
              </p>
              <a
                href="tel:+212694528498"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  background: "#D35400",
                  color: "#fff",
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "1rem 1.5rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "background 0.25s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#b84a00")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#D35400")}
              >
                <Phone size={16} strokeWidth={1.8} /> +212 694-528498
              </a>
            </div>

            {/* Réseaux */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem,3vw,2.2rem)",
              }}
            >
              <SLabel>Suivez-nous</SLabel>
              <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                {[
                  { label: "LinkedIn", href: "https://linkedin.com/company/africa-centred-technology", abbr: "in" },
                  { label: "Facebook", href: "https://facebook.com/actafrica", abbr: "fb" },
                  { label: "YouTube", href: "https://youtube.com/@actafrica", abbr: "yt" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.5rem",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      transition: "background 0.25s, color 0.25s, border-color 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(211,84,0,0.12)";
                      (e.currentTarget as HTMLElement).style.color = "#D35400";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(211,84,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {s.abbr}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(5rem,9vw,9rem) clamp(1.5rem,6vw,8rem)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SLabel>FAQ</SLabel>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "var(--font-50)", lineHeight: 1.05, marginBottom: "clamp(3rem,5vw,5rem)" }}
        >
          Questions <span style={{ color: "#D35400" }}>Fréquentes</span>
        </motion.h2>

        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.8rem", textAlign: "left" }}>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                style={{
                  background: isOpen ? "rgba(211,84,0,0.05)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isOpen ? "rgba(211,84,0,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  transition: "background 0.3s, border-color 0.3s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "clamp(1.1rem,2vw,1.5rem) clamp(1.2rem,2.5vw,1.8rem)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700, fontSize: "var(--font-20)", color: isOpen ? "#D35400" : "#fff", lineHeight: 1.4, transition: "color 0.25s" }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 32, height: 32, background: isOpen ? "#D35400" : "rgba(255,255,255,0.07)", borderRadius: "0.35rem", color: "#fff", fontWeight: 900, fontSize: "1.3rem", lineHeight: 1, transition: "background 0.25s" }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.6, 0.08, 0.02, 0.99] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ padding: "0 clamp(1.2rem,2.5vw,1.8rem) clamp(1.1rem,2vw,1.5rem)", color: "rgba(255,255,255,0.5)", fontSize: "var(--font-18)", lineHeight: 1.78, borderLeft: "2px solid #D35400", marginLeft: "clamp(1.2rem,2.5vw,1.8rem)" }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(6rem,12vw,12rem) clamp(1.5rem,6vw,8rem)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%,rgba(211,84,0,0.06) 0%,transparent 65%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span className="diamond diamond--sm" />
            <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "1rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
              Transformation digitale
            </span>
            <span className="diamond diamond--sm" />
          </div>
          <h2 style={{ fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "var(--font-50)", lineHeight: 1.05, color: "#fff", marginBottom: "1.2rem" }}>
            Prêt à Transformer <br /><span style={{ color: "#D35400" }}>Votre Entreprise ?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "var(--font-20)", lineHeight: 1.72, maxWidth: 520, margin: "0 auto 3rem" }}>
            Rejoignez les entreprises africaines qui ont fait confiance à ACT pour leur transformation digitale.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <a
              href="tel:+212694528498"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.7rem",
                background: "#D35400", color: "#fff",
                fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700,
                fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "1.1rem 2.5rem", borderRadius: "0.5rem", textDecoration: "none",
                transition: "background 0.25s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#b84a00")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#D35400")}
            >
              <Phone size={17} strokeWidth={1.8} /> +212 694-528498
            </a>
            <a
              href="mailto:contact@act.africa"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.7rem",
                background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700,
                fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "1.1rem 2.5rem", borderRadius: "0.5rem", textDecoration: "none",
                transition: "border-color 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#D35400";
                (e.currentTarget as HTMLElement).style.color = "#D35400";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
            >
              <Mail size={17} strokeWidth={1.8} /> contact@act.africa
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
