"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Settings2, BarChart2, Megaphone, ChevronDown, ChevronUp } from "lucide-react";
import { startSession, declineConsent, needsConsent, getConsent } from "@/lib/session";
import { initAnalytics } from "@/lib/analytics";

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const ACT_DARK    = "#0A1410";
const ACT_GREEN   = "#0d1a14";
const ACT_ORANGE  = "#D35400";
const ACT_GOLD    = "#F39C12";
const LINE        = "rgba(255,255,255,0.08)";
const TXT         = "#FFFFFF";
const TXT_SOFT    = "rgba(255,255,255,0.72)";
const TXT_MUTED   = "rgba(255,255,255,0.42)";
const FONT_HEAD   = "Futura, var(--font-display), 'Century Gothic', sans-serif";
const FONT_BODY   = "var(--font-body), 'Poppins', system-ui, sans-serif";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function applyConsent(choice: "granted" | "denied") {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
  window.fbq?.("consent", choice === "granted" ? "grant" : "revoke");
  if (choice === "granted") initAnalytics();
}

/* ── Cookie category card ─────────────────────────────────────────────────── */
function Category({
  icon, title, desc, badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        display: "flex",
        gap: "0.9rem",
        padding: "1.1rem 1.2rem",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${LINE}`,
        borderRadius: "10px",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "2px" }}>{icon}</div>
      <div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: "0.85rem", color: TXT }}>
            {title}
          </span>
          {badge && (
            <span
              style={{
                fontSize: "0.58rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "rgba(22,163,74,0.14)",
                color: "#4ade80",
                border: "1px solid rgba(74,222,128,0.22)",
                borderRadius: "99px",
                padding: "0.1rem 0.5rem",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: "0.78rem", color: TXT_MUTED, lineHeight: 1.65, margin: 0 }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function CookieBanner() {
  const t = useTranslations("common.cookies");
  const [visible,     setVisible]     = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      // Consentement accordé par défaut (site Maroc — pas de RGPD)
      applyConsent("granted");
      startSession();
    }
  }, []);

  function handle(choice: "granted" | "denied") {
    applyConsent(choice);
    if (choice === "granted") {
      startSession();
    } else {
      declineConsent();
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          style={{
            position:   "fixed",
            bottom:     0,
            left:       0,
            right:      0,
            zIndex:     9999,
            background: `linear-gradient(160deg, ${ACT_DARK} 0%, ${ACT_GREEN} 100%)`,
            borderTop:  `3px solid ${ACT_ORANGE}`,
            boxShadow:  "0 -12px 60px rgba(0,0,0,0.7), 0 -1px 0 rgba(211,84,0,0.15)",
          }}
        >
          {/* Orange top glow line */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, ${ACT_ORANGE} 40%, ${ACT_GOLD} 60%, transparent 100%)`,
              opacity: 0.5,
            }}
          />

          <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "2.8rem 3rem" }}>

            {/* ══ Main row: left text + right buttons ══════════════════════ */}
            <div
              style={{
                display:        "flex",
                gap:            "4rem",
                alignItems:     "flex-start",
                flexWrap:       "wrap",
              }}
            >
              {/* ── Left: Brand label + text ─────────────────────────────── */}
              <div style={{ flex: "1 1 420px", minWidth: 0 }}>

                {/* ACT label */}
                <div
                  style={{
                    display:        "inline-flex",
                    alignItems:     "center",
                    gap:            "0.6rem",
                    marginBottom:   "1.2rem",
                  }}
                >
                  <div
                    style={{
                      width: "3px", height: "18px",
                      background: `linear-gradient(to bottom, ${ACT_ORANGE}, ${ACT_GOLD})`,
                      borderRadius: "2px",
                    }}
                  />
                  <span
                    style={{
                      fontFamily:    FONT_HEAD,
                      fontWeight:    800,
                      fontSize:      "0.7rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         ACT_ORANGE,
                    }}
                  >
                    Africa Centred Technology — Confidentialité
                  </span>
                </div>

                {/* Main paragraph */}
                <p
                  style={{
                    fontFamily:   FONT_BODY,
                    fontSize:     "0.95rem",
                    color:        TXT_SOFT,
                    lineHeight:   1.8,
                    margin:       "0 0 1rem",
                    maxWidth:     "640px",
                  }}
                >
                  <strong style={{ color: TXT, fontWeight: 700 }}>ACT</strong> se soucie de votre vie privée
                  et vous permet de choisir les types de cookies utilisés lors de votre visite. Nous utilisons
                  des cookies pour améliorer votre expérience, analyser notre audience et vous proposer des
                  contenus adaptés.{" "}
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    style={{
                      background:    "none",
                      border:        "none",
                      padding:       0,
                      cursor:        "pointer",
                      color:         ACT_ORANGE,
                      fontFamily:    FONT_BODY,
                      fontSize:      "inherit",
                      fontWeight:    600,
                      textDecoration:"underline",
                      textUnderlineOffset: "3px",
                    }}
                    aria-expanded={showDetails}
                  >
                    Gérer mes préférences
                  </button>
                  .
                </p>

                {/* Secondary paragraph */}
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize:   "0.82rem",
                    color:      TXT_MUTED,
                    lineHeight: 1.7,
                    margin:     0,
                    maxWidth:   "580px",
                  }}
                >
                  Vos choix seront enregistrés pour une durée de 6 mois. Si vous souhaitez consulter la liste
                  détaillée des cookies utilisés, référez-vous à notre{" "}
                  <a
                    href="/politique-confidentialite"
                    style={{ color: "rgba(255,255,255,0.55)", textDecoration: "underline", textUnderlineOffset: "2px" }}
                  >
                    {t("policy")}
                  </a>
                  .
                </p>
              </div>

              {/* ── Right: 3 stacked buttons ──────────────────────────────── */}
              <div
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  gap:            "0.65rem",
                  minWidth:       "220px",
                  flexShrink:     0,
                  alignSelf:      "center",
                }}
              >
                {/* Accept — filled orange (primary CTA) */}
                <button
                  onClick={() => handle("granted")}
                  style={{
                    padding:       "0.85rem 1.8rem",
                    background:    ACT_ORANGE,
                    color:         TXT,
                    border:        `1.5px solid ${ACT_ORANGE}`,
                    borderRadius:  "8px",
                    fontSize:      "0.92rem",
                    fontWeight:    700,
                    fontFamily:    FONT_BODY,
                    letterSpacing: "0.04em",
                    cursor:        "pointer",
                    transition:    "background 0.2s, transform 0.15s",
                    textAlign:     "center",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#B84600";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#B84600";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = ACT_ORANGE;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = ACT_ORANGE;
                  }}
                >
                  {t("accept")}
                </button>

                {/* Manage Settings — outlined orange */}
                <button
                  onClick={() => setShowDetails(v => !v)}
                  aria-expanded={showDetails}
                  style={{
                    padding:        "0.85rem 1.8rem",
                    background:     "transparent",
                    color:          ACT_ORANGE,
                    border:         `1.5px solid rgba(211,84,0,0.55)`,
                    borderRadius:   "8px",
                    fontSize:       "0.92rem",
                    fontWeight:     600,
                    fontFamily:     FONT_BODY,
                    letterSpacing:  "0.03em",
                    cursor:         "pointer",
                    transition:     "background 0.2s, border-color 0.2s",
                    textAlign:      "center",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "0.5rem",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(211,84,0,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = ACT_ORANGE;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(211,84,0,0.55)";
                  }}
                >
                  Gérer mes préférences
                  {showDetails
                    ? <ChevronUp  size={15} aria-hidden />
                    : <ChevronDown size={15} aria-hidden />}
                </button>

                {/* Decline — outlined muted */}
                <button
                  onClick={() => handle("denied")}
                  style={{
                    padding:       "0.85rem 1.8rem",
                    background:    "transparent",
                    color:         TXT_SOFT,
                    border:        "1.5px solid rgba(255,255,255,0.22)",
                    borderRadius:  "8px",
                    fontSize:      "0.92rem",
                    fontWeight:    500,
                    fontFamily:    FONT_BODY,
                    letterSpacing: "0.02em",
                    cursor:        "pointer",
                    transition:    "background 0.2s, border-color 0.2s",
                    textAlign:     "center",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.22)";
                  }}
                >
                  {t("decline")}
                </button>
              </div>
            </div>

            {/* ══ Expandable cookie categories ═══════════════════════════ */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "2rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      height: "1px",
                      background: `linear-gradient(90deg, ${ACT_ORANGE}44, ${LINE}, transparent)`,
                      marginBottom: "1.6rem",
                    }}
                  />
                  <p
                    style={{
                      fontFamily:    FONT_HEAD,
                      fontWeight:    700,
                      fontSize:      "0.72rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color:         TXT_MUTED,
                      marginBottom:  "1rem",
                    }}
                  >
                    Détail des catégories
                  </p>
                  <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                    <Category
                      icon={<ShieldCheck size={20} color="#4ade80" />}
                      title={t("essentialTitle")}
                      desc={t("essentialDesc")}
                      badge="Toujours actif"
                    />
                    <Category
                      icon={<Settings2 size={20} color="#a78bfa" />}
                      title={t("functionalTitle")}
                      desc={t("functionalDesc")}
                    />
                    <Category
                      icon={<BarChart2 size={20} color="#60a5fa" />}
                      title={t("analyticsTitle")}
                      desc={t("analyticsDesc")}
                    />
                    <Category
                      icon={<Megaphone size={20} color={ACT_ORANGE} />}
                      title={t("marketingTitle")}
                      desc={t("marketingDesc")}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
