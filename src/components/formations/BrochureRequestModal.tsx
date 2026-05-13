"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ACT_DARK   = "#0A1410";
const ACT_GREEN  = "#1B3022";
const ACT_ORANGE = "#D35400";
const ACT_GOLD   = "#F39C12";
const ACT_CREAM  = "#FCF9F2";

const FONT_DISPLAY = "'Lora', 'Times New Roman', serif";
const FONT_LABEL   = "'Poppins', system-ui, sans-serif";

interface BrochureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  formationTitle: string;
  formationSlug: string;
  brochureUrl?: string;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function trackBrochureLead(formationTitle: string, formationSlug: string) {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "generate_lead",
    lead_type: "brochure",
    formation_slug: formationSlug,
    formation_title: formationTitle,
  });
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", {
      content_name: formationTitle,
      content_category: "brochure",
      content_ids: [formationSlug],
    });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", {
      lead_type: "brochure",
      items: [{ item_id: formationSlug, item_name: formationTitle }],
    });
  }
}

export default function BrochureRequestModal({
  isOpen,
  onClose,
  formationTitle,
  formationSlug,
  brochureUrl,
}: BrochureRequestModalProps) {
  const t = useTranslations("formations.brochure");
  const locale = useLocale();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [company, setCompany] = useState("");
  const [state, setState]     = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setState("idle");
      setErrorMsg("");
      setDownloadUrl(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          formationSlug,
          formationTitle,
          brochureUrl,
          locale,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erreur d'envoi");
      }
      trackBrochureLead(formationTitle, formationSlug);
      const url: string | undefined = json.brochureUrl;
      if (url) {
        setDownloadUrl(url);
        // Ouvre la brochure dans un nouvel onglet (déclenche le download pour PDF)
        window.open(url, "_blank", "noopener,noreferrer");
      }
      setState("success");
    } catch (err) {
      console.error("Brochure submit error:", err);
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur d'envoi");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9998 }}
          />
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999, overflow: "auto",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem 1rem",
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%", maxWidth: 520,
                background: ACT_DARK,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <button
                onClick={onClose}
                aria-label={t("ariaClose")}
                style={{
                  position: "absolute", top: 16, right: 16, zIndex: 2,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>

              {state === "success" ? (
                <div style={{ padding: "56px 36px 44px", textAlign: "center", color: "#fff" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${ACT_ORANGE}, ${ACT_GOLD})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                  }}>
                    <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
                  </div>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY, fontSize: 28, lineHeight: 1.2,
                    fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 12px",
                  }}>
                    {t("successTitle")}
                  </h3>
                  <p style={{
                    fontFamily: FONT_LABEL, fontSize: 14, lineHeight: 1.6,
                    color: "rgba(255,255,255,0.65)", margin: "0 auto 28px", maxWidth: 380,
                  }}>
                    {t("successMessage")}
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: ACT_ORANGE, color: "#fff",
                          border: "none", padding: "14px 28px",
                          textDecoration: "none",
                          fontFamily: FONT_LABEL, fontSize: 12, fontWeight: 600,
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          display: "inline-flex", alignItems: "center", gap: 10,
                        }}
                      >
                        {t("openBrochure")}
                      </a>
                    )}
                    <button
                      onClick={onClose}
                      style={{
                        background: "transparent", color: ACT_CREAM,
                        border: `1px solid rgba(255,255,255,0.2)`,
                        padding: "14px 28px", cursor: "pointer",
                        fontFamily: FONT_LABEL, fontSize: 12, fontWeight: 600,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                      }}
                    >
                      {t("close")}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: "44px 36px 36px", color: "#fff" }}>
                  <div style={{
                    fontFamily: FONT_LABEL, fontSize: 11, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: ACT_ORANGE, fontWeight: 600,
                    marginBottom: 12,
                  }}>
                    {t("eyebrow")}
                  </div>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1.2,
                    fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px",
                  }}>
                    {t("title")}
                  </h3>
                  <p style={{
                    fontFamily: FONT_LABEL, fontSize: 13, lineHeight: 1.55,
                    color: "rgba(255,255,255,0.6)", margin: "0 0 28px",
                  }}>
                    {t("subtitle")}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <input
                      type="text" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      disabled={state === "submitting"}
                      style={inputStyle}
                    />
                    <input
                      type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      disabled={state === "submitting"}
                      style={inputStyle}
                    />
                    <input
                      type="text" value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t("companyPlaceholder")}
                      disabled={state === "submitting"}
                      style={inputStyle}
                    />
                  </div>

                  {state === "error" && (
                    <div style={{
                      marginTop: 16, padding: "10px 14px",
                      background: "rgba(220,38,38,0.1)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      color: "#fca5a5", fontSize: 13,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <AlertCircle size={16} /> {errorMsg || t("errorDefault")}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    style={{
                      marginTop: 24, width: "100%",
                      background: state === "submitting" ? "rgba(211,84,0,0.6)" : ACT_ORANGE,
                      color: "#fff", border: "none",
                      padding: "16px 28px", cursor: state === "submitting" ? "wait" : "pointer",
                      fontFamily: FONT_LABEL, fontSize: 12, fontWeight: 600,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                      transition: "background 0.2s",
                    }}
                  >
                    {state === "submitting" ? (
                      <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> {t("submitting")}</>
                    ) : (
                      <>{t("submitIdle")}</>
                    )}
                  </button>

                  <p style={{
                    margin: "16px 0 0", fontSize: 11, lineHeight: 1.5,
                    color: "rgba(255,255,255,0.4)", textAlign: "center",
                  }}>
                    {t("noSpam")}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
          <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontFamily: "'Poppins', system-ui, sans-serif",
  fontSize: 14,
  padding: "14px 16px",
  outline: "none",
  width: "100%",
  borderRadius: 2,
};
