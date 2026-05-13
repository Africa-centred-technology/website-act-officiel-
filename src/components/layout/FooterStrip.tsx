"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, LinkedinIcon, Mail, Phone, MapPin, Code2, Briefcase, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";

const ORANGE = "#D35400";

const BG = "#0A1410";

const FOOTER_SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@AfricaCentredTechnology", label: "YouTube" },
  { Icon: Facebook, href: "https://web.facebook.com/profile.php?id=61585541019830", label: "Facebook" },
  { Icon: LinkedinIcon, href: "https://www.linkedin.com/company/103580441/", label: "LinkedIn" },
];

interface FooterStripProps {
  style?: React.CSSProperties;
}

export default function FooterStrip({ style }: FooterStripProps = {}) {
  const t = useTranslations("common");
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe() {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/shopify/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.div
      aria-label="Footer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      style={{ background: BG, padding: "clamp(3rem,5vw,5rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vw, 6rem)", ...style }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,320px)] gap-8 lg:gap-16 mb-8">

        {/* Colonnes principales à gauche */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Col 1 — Contact */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            {t("footer.contactTitle")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <a href="mailto:sohaib.baroud@a-ct.ma"
              style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
              <Mail size={18} strokeWidth={1.6} />sohaib.baroud@a-ct.ma
            </a>
            <a href="tel:+212662777507"
              style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
              <Phone size={18} strokeWidth={1.6} />+212 662-777507
            </a>
            <span style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", opacity: 0.7 }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
           {t("footer.navTitle")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { href: "/", label: t("nav.home") },
              { href: "/about", label: t("nav.aPropos") },
              { href: "/services", label: t("nav.nosServices") },
              { href: "/formations", label: t("nav.catalogueFormations") },
              { href: "/projects", label: t("nav.realisations") },
              { href: "/blog", label: t("nav.blog") },
              { href: "/contact", label: t("nav.contact") },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                style={{ fontFamily: "var(--font-body)", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3 — Réseaux Sociaux */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            {t("footer.socialTitle")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FOOTER_SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
                <Icon size={20} strokeWidth={1.5} />{label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 4 — Nos Pôles */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            {t("footer.polesTitle")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { href: "/poles/developpement-technologique", label: t("footer.poleDev"), Icon: Code2 },
              { href: "/poles/conseil-strategie-it", label: t("footer.poleConseil"), Icon: Briefcase },
              { href: "/poles/formation", label: t("footer.poleFormation"), Icon: GraduationCap },
            ].map((link) => (
              <Link key={link.label} href={link.href}
                style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
                <link.Icon size={18} strokeWidth={1.6} />{link.label}
              </Link>
            ))}
          </div>
        </div>
        </div>

        {/* Col 5 — Newsletter à droite */}
        <div className="order-last lg:order-0">
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            {t("footer.newsletterTitle")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {status === "success" ? (
              <p style={{ fontFamily: "var(--font-body)", color: "#4ade80", fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)" }}>
                {t("footer.subscribeSuccess")}
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  disabled={status === "loading"}
                  style={{
                    fontFamily: "var(--font-body)",
                    padding: "0.9rem 1.2rem",
                    fontSize: "clamp(1rem, 1.1vw, 1.1rem)",
                    background: "rgba(255,255,255,0.08)",
                    border: `1px solid ${status === "error" ? "#ef4444" : `${ORANGE}44`}`,
                    borderRadius: "8px",
                    color: "#ffffff",
                    transition: "all 0.2s",
                    opacity: status === "loading" ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.background = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLInputElement).style.borderColor = ORANGE;
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLInputElement).style.borderColor = status === "error" ? "#ef4444" : `${ORANGE}44`;
                  }}
                />
                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-body)", color: "#ef4444", fontSize: "clamp(0.85rem, 1vw, 1rem)", margin: 0 }}>
                    {t("footer.subscribeError")}
                  </p>
                )}
                <button
                  onClick={handleSubscribe}
                  disabled={status === "loading" || !email}
                  style={{
                    fontFamily: "var(--font-body)",
                    padding: "0.9rem 1.5rem",
                    fontSize: "clamp(1rem, 1.1vw, 1.1rem)",
                    background: ORANGE,
                    border: "none",
                    borderRadius: "8px",
                    color: "#000",
                    fontWeight: 700,
                    cursor: status === "loading" || !email ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    opacity: status === "loading" || !email ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading" && email) {
                      (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = status === "loading" || !email ? "0.6" : "1";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  {status === "loading" ? t("footer.subscribing") : t("cta.register")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", color: "#ffffff", textTransform: "uppercase", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", letterSpacing: "0.06em", opacity: 0.65 }}>
          {t("footer.copyright", { year })}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <Link href="/privacy" style={{ fontFamily: "var(--font-body)", color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", textTransform: "uppercase", transition: "color 0.2s, opacity 0.2s", opacity: 0.65 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.color = ORANGE; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}>
            {t("footer.privacyPolicy")}
          </Link>
          <span style={{ color: "#ffffff", opacity: 0.3 }}>•</span>
          <Link href="/terms" style={{ fontFamily: "var(--font-body)", color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", textTransform: "uppercase", transition: "color 0.2s, opacity 0.2s", opacity: 0.65 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.color = ORANGE; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}>
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
