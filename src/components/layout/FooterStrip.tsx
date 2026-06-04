"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

const ORANGE = "#D35400";
const BG     = "#080f0c";
const LINE   = "rgba(255,255,255,0.07)";

const SOCIALS = [
  { Icon: Linkedin,  href: "https://www.linkedin.com/company/103580441/",                                            label: "LinkedIn"  },
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@AfricaCentredTechnology",                                       label: "YouTube"   },
  { Icon: Facebook,  href: "https://web.facebook.com/profile.php?id=61585541019830",                                 label: "Facebook"  },
];

const COLS = [
  {
    title: "Industries",
    links: [
      { label: "Industrie",       href: "/secteurs/industrie"       },
      { label: "Finance & Banque",href: "/secteurs/finance"         },
      { label: "E-commerce",      href: "/secteurs/ecommerce"       },
      { label: "Éducation",       href: "/secteurs/education"       },
      { label: "Santé",           href: "/secteurs/sante"           },
      { label: "Télécoms & Médias",href: "/secteurs/telecoms-medias"},
    ],
  },
  {
    title: "Expertises",
    links: [
      { label: "IA & Agentique",          href: "/services"                          },
      { label: "Développement logiciel",  href: "/poles/developpement-technologique" },
      { label: "Conseil IT & Stratégie",  href: "/poles/conseil-strategie-it"        },
      { label: "Data & BI",               href: "/services"                          },
      { label: "Formation pro",           href: "/poles/formation"                   },
      { label: "ACT University",          href: "https://elearning.africacentredtechnology.com/" },
    ],
  },
  {
    title: "Réalisations",
    links: [
      { label: "Nos projets",     href: "/projects"    },
      { label: "Études de cas",   href: "/cas-etudes/ecommerce-logistique" },
      { label: "Nos secteurs",    href: "/secteurs"    },
      { label: "Nos services",    href: "/services"    },
    ],
  },
  {
    title: "Perspectives",
    links: [
      { label: "Articles & Analyses",    href: "/blog"       },
      { label: "Tendances Africa Tech",  href: "/blog"       },
      { label: "Cas d'usage IA",         href: "/cas-etudes/ia-documentaire" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos",        href: "/about"     },
      { label: "Notre équipe",    href: "/about#equipe" },
      { label: "Carrières",       href: "/carrieres" },
      { label: "Contact",         href: "/contact"   },
      { label: "Politique de confidentialité", href: "/privacy" },
      { label: "CGU",             href: "/terms"     },
    ],
  },
];

interface FooterStripProps {
  style?: React.CSSProperties;
}

export default function FooterStrip({ style }: FooterStripProps = {}) {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      aria-label="Footer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      style={{ background: BG, color: "#fff", fontFamily: "var(--font-body)", ...style }}
    >
      {/* ── Top border ── */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${ORANGE}60, transparent)` }} />

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(3rem,5vw,5rem) clamp(1.5rem,4vw,5rem)" }}>

        {/* Logo + tagline + columns */}
        <div className="footer-main-grid">

          {/* Brand block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "2.2rem",
                letterSpacing: "0.06em",
                color: "#fff",
              }}>
                ACT<span style={{ color: ORANGE }}>.</span>
              </span>
            </Link>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: "22ch" }}>
              Africa Centred Technology — Ingénierie, Conseil & Formation au service de la transformation digitale africaine.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.5rem" }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: "2rem", height: "2rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.55)",
                    transition: "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background   = `${ORANGE}22`;
                    e.currentTarget.style.color        = ORANGE;
                    e.currentTarget.style.borderColor  = `${ORANGE}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background   = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color        = "rgba(255,255,255,0.55)";
                    e.currentTarget.style.borderColor  = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Icon size={14} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p style={{
                fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                marginBottom: "1.4rem",
              }}>
                {col.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "1.05rem",
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          marginTop: "2.5rem",
          paddingTop: "1.5rem",
          borderTop: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <span style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
            © {year} Africa Centred Technology. Tous droits réservés.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {[
              { label: "Confidentialité", href: "/privacy" },
              { label: "CGU",             href: "/terms"   },
              { label: "Contact",         href: "/contact" },
            ].map((l) => (
              <Link key={l.label} href={l.href}
                style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 640px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1.4fr repeat(5, 1fr);
            gap: 2rem;
          }
        }
      `}</style>
    </motion.footer>
  );
}
