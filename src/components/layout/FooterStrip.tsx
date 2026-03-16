"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

const ORANGE = "#D35400";
const BG = "#070E1C";

const FOOTER_SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@AfricaCentredTechnology",                                           label: "YouTube"   },
  { Icon: Facebook,  href: "https://web.facebook.com/profile.php?id=61585541019830",                                    label: "Facebook"  },
];

interface FooterStripProps {
  style?: React.CSSProperties;
}

export default function FooterStrip({ style }: FooterStripProps = {}) {
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 4vw, 4rem)", marginBottom: "2.8rem" }}>

        {/* Col 1 — Contact */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <a href="mailto:contact@act.africa"
              style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
              <Mail size={18} strokeWidth={1.6} />contact@act.africa
            </a>
            <a href="tel:+212694528498"
              style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", textDecoration: "none", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", transition: "color 0.2s", opacity: 0.85 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}>
              <Phone size={18} strokeWidth={1.6} />+212 694-528498
            </a>
            <span style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.6rem", color: "#ffffff", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", opacity: 0.7 }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Réseaux Sociaux */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.6rem", opacity: 0.9 }}>
            Réseaux Sociaux
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

        {/* Col 3 — Carrières */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "1.2rem", opacity: 0.9 }}>
            Carrières
          </p>
          <p style={{ fontFamily: "var(--font-body)", color: "#ffffff", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", lineHeight: 1.6, marginBottom: "0.9rem", maxWidth: "300px", opacity: 0.85 }}>
            Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
          </p>
          <Link href="/careers"
            style={{ fontFamily: "var(--font-display)", color: ORANGE, textDecoration: "none", fontSize: "clamp(0.95rem, 1.2vw, 1.2rem)", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s", fontWeight: 600 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#F39C12")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = ORANGE)}>
            Postuler maintenant →
          </Link>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
        <span style={{ fontFamily: "var(--font-body)", color: "#ffffff", textTransform: "uppercase", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", letterSpacing: "0.06em", opacity: 0.65 }}>
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <Link href="/privacy" style={{ fontFamily: "var(--font-body)", color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", textTransform: "uppercase", transition: "color 0.2s, opacity 0.2s", opacity: 0.65 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.color = ORANGE; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}>
            Politique de Confidentialité
          </Link>
          <span style={{ color: "#ffffff", opacity: 0.3 }}>•</span>
          <Link href="/terms" style={{ fontFamily: "var(--font-body)", color: "#ffffff", textDecoration: "none", fontSize: "clamp(0.85rem, 1.1vw, 1.1rem)", textTransform: "uppercase", transition: "color 0.2s, opacity 0.2s", opacity: 0.65 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.color = ORANGE; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}>
            CGU
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
