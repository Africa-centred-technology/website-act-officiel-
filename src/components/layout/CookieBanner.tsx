"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, BarChart2, Megaphone, X } from "lucide-react";
import { startSession } from "@/lib/session";

const CONSENT_KEY = "act_cookie_consent";

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
  if (choice === "granted") {
    window.fbq?.("consent", "grant");
  } else {
    window.fbq?.("consent", "revoke");
  }
}

function CookieCategory({
  icon,
  title,
  desc,
  always,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  always?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.85rem",
        alignItems: "flex-start",
        padding: "1rem 1.1rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "0.6rem",
        flex: "1 1 260px",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>{icon}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "#fff",
            }}
          >
            {title}
          </span>
          {always && (
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: "rgba(22,163,74,0.18)",
                color: "#4ade80",
                border: "1px solid rgba(74,222,128,0.3)",
                borderRadius: "99px",
                padding: "0.1rem 0.55rem",
                textTransform: "uppercase",
              }}
            >
              Toujours actif
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function CookieBanner() {
  const t = useTranslations("common.cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as "granted" | "denied" | null;
    if (!stored) {
      setVisible(true);
    } else {
      applyConsent(stored);
    }
  }, []);

  function handle(choice: "granted" | "denied") {
    localStorage.setItem(CONSENT_KEY, choice);
    applyConsent(choice);
    if (choice === "granted") startSession();
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 220, damping: 30 }}
          role="dialog"
          aria-label={t("title")}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(to top, #0a1410 0%, #0f1f18 100%)",
            borderTop: "1px solid rgba(211,84,0,0.4)",
            boxShadow: "0 -8px 48px rgba(0,0,0,0.6)",
            padding: "2rem 2rem 2.25rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => handle("denied")}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.3)",
              padding: "0.25rem",
              lineHeight: 1,
            }}
          >
            <X size={20} />
          </button>

          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h3
                style={{
                  fontFamily: "Futura, var(--font-display), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  color: "#fff",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                🍪 {t("title")}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.65,
                  maxWidth: "720px",
                }}
              >
                {t("intro")}
              </p>
            </div>

            {/* Cookie categories */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <CookieCategory
                icon={<ShieldCheck size={20} color="#4ade80" />}
                title={t("essentialTitle")}
                desc={t("essentialDesc")}
                always
              />
              <CookieCategory
                icon={<BarChart2 size={20} color="#60a5fa" />}
                title={t("analyticsTitle")}
                desc={t("analyticsDesc")}
              />
              <CookieCategory
                icon={<Megaphone size={20} color="#f97316" />}
                title={t("marketingTitle")}
                desc={t("marketingDesc")}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handle("granted")}
                style={{
                  padding: "0.75rem 2.2rem",
                  background: "#D35400",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {t("accept")}
              </button>
              <button
                onClick={() => handle("denied")}
                style={{
                  padding: "0.75rem 2rem",
                  background: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}
              >
                {t("decline")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
