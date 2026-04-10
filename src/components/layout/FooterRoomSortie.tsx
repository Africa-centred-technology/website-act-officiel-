"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin, Code2, Briefcase, GraduationCap } from "lucide-react";

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@AfricaCentredTechnology", label: "YouTube" },
  { Icon: Facebook, href: "https://web.facebook.com/profile.php?id=61585541019830", label: "Facebook" },
];

export default function FooterRoomSortie() {
  const ORANGE = "#D35400";
  return (
    <motion.div
      aria-label="Footer"
      className="relative md:absolute pointer-events-auto mt-16 md:mt-0 md:bottom-28 w-full left-0 right-0"
      style={{ zIndex: 10, padding: "clamp(2rem,3vw,3rem) clamp(1.5rem, 6vw, 8rem) clamp(2rem, 4vw, 3rem)", textAlign: "left" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "2rem" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 4vw, 4rem)", marginBottom: "2rem" }}>

        {/* Col 1 — Contact */}
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "0.6rem", opacity: 0.9 }}>
            Contact
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
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "0.6rem", opacity: 0.9 }}>
            Navigation
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { href: "/", label: "Accueil" },
              { href: "/about", label: "À Propos" },
              { href: "/services", label: "Nos Services" },
              { href: "/formations", label: "Catalogue de Formations" },
              { href: "/projects", label: "Réalisations" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
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
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "0.6rem", opacity: 0.9 }}>
            Réseaux Sociaux
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {SOCIALS.map(({ Icon, href, label }) => (
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
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem, 1.4vw, 1.4rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#ffffff", marginBottom: "0.6rem", opacity: 0.9 }}>
            Nos Pôles
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { href: "/poles/developpement-technologique", label: "Développement Technologique", Icon: Code2 },
              { href: "/poles/conseil-strategie-it", label: "Conseil & Stratégie IT", Icon: Briefcase },
              { href: "/poles/formation", label: "Formation & Développement", Icon: GraduationCap },
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
