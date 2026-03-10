"use client";

/**
 * ServicesIntroShell — Expérience d'entrée des services ACT.
 *
 * Phases :
 *  "logo"     → Streaks lumineuses depuis les 4 bords → forment ACT → dispersent
 *  "services" → 8 cards avec images, sans numérotation
 *  "entering" → Portail zoom sur le service sélectionné
 *  "room"     → ServiceRoomShell
 *
 * Particle system (v2) :
 *  - 300 particules en forme de comètes (ellipses allongées dans le sens du vecteur)
 *  - Entrée depuis les 4 bords (pas depuis le centre)
 *  - Trail effect : canvas semi-transparent entre chaque frame
 *  - 3 phases accélérées : stream (0-1s) → glow (1-1.7s) → disperse (1.7-2.5s)
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { SERVICES, type Service } from "@/lib/data/services";
import LogoPhase from "./LogoPhase";

/* ── Footer strip (même contenu que RoomSortie) ─────────────────── */
const FOOTER_SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube,   href: "https://www.youtube.com/@AfricaCentredTechnology",                                           label: "YouTube"   },
  { Icon: Facebook,  href: "https://web.facebook.com/profile.php?id=61585541019830",                                    label: "Facebook"  },
];

function FooterStrip() {
  return (
    <motion.div
      aria-label="Footer"
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 20, padding: "0 clamp(2rem, 5vw, 6rem) 1.8rem",
        pointerEvents: "auto",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7 }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem", marginBottom: "2.8rem" }}>

        {/* Col 1 — Contact */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href="mailto:contact@act.africa"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Mail size={18} strokeWidth={1.6} />contact@act.africa
            </a>
            <a href="tel:+212694528498"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Phone size={18} strokeWidth={1.6} />+212 694-528498
            </a>
            <span className="flex items-center gap-3 text-white/35" style={{ fontSize: "1.15rem" }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Réseaux Sociaux */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Réseaux Sociaux</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {FOOTER_SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/60 hover:text-[#D35400] transition-colors"
                style={{ fontSize: "1.15rem" }}>
                <Icon size={20} strokeWidth={1.5} />{label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3 — Carrières + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <div>
            <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.2rem" }}>Carrières</p>
            <p className="text-white/45" style={{ fontSize: "1.1rem", lineHeight: 1.55, marginBottom: "0.9rem", maxWidth: "240px" }}>
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
            </p>
            <Link href="/careers"
              className="text-[#D35400] hover:text-[#F39C12] transition-colors uppercase"
              style={{ fontSize: "1rem", letterSpacing: "0.08em" }}>
              Postuler maintenant →
            </Link>
          </div>
          <Link href="/contact" className="text-white/60 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1rem", letterSpacing: "0.08em" }}>
            Un projet en tête ? →
          </Link>
        </div>

      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.2rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
        <span className="text-white/40 uppercase" style={{ fontSize: "0.92rem", letterSpacing: "0.08em" }}>
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/privacy" className="text-white/40 hover:text-white/70 transition-colors uppercase" style={{ fontSize: "0.92rem" }}>
            Politique de Confidentialité
          </Link>
          <span className="text-white/25">/</span>
          <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors uppercase" style={{ fontSize: "0.92rem" }}>
            CGU
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const ServiceRoomShell = dynamic(() => import("./ServiceRoomShell"), { ssr: false });

/* ── Tokens ───────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;
const ORANGE = "#D35400";
const GOLD = "#F39C12";

type Phase = "logo" | "services" | "entering" | "room";

/* LogoPhase, useParticleCanvas, sampleOffscreenText → ./LogoPhase.tsx */

/* ══════════════════════════════════════════════════════════
   SERVICE CARD — entrée staggerée + hover CSS natif
   ══════════════════════════════════════════════════════════ */
function ServiceCard({
  svc, index, onEnter,
}: {
  svc: Service; index: number;
  onEnter: (i: number) => void;
}) {
  return (
    <motion.div
      className="svc-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.4 },
        y: { duration: 0.55, delay: index * 0.07, ease: [...BURST] },
      }}
      onClick={() => onEnter(index)}
      style={{
        "--svc-accent": svc.accent,
        position: "relative", overflow: "hidden",
        borderRadius: "0.8rem", cursor: "pointer",
        minHeight: "clamp(180px, 22vh, 270px)",
        display: "flex", flexDirection: "column",
      } as React.CSSProperties}
    >
      {/* Image */}
      <div className="svc-card__img" aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${svc.heroImage})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Gradient de profondeur */}
      <div className="svc-card__depth" aria-hidden style={{ position: "absolute", inset: 0 }} />

      {/* Halo accent */}
      <div className="svc-card__halo" aria-hidden style={{ position: "absolute", inset: 0 }} />

      {/* Barre top */}
      <div className="svc-card__topbar" aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${svc.accent}, transparent 65%)`,
      }} />

      {/* Icône filigrane */}
      <div className="svc-card__icon" aria-hidden style={{
        position: "absolute", right: "1rem", bottom: "1rem",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke={svc.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={svc.icon} />
        </svg>
      </div>

      {/* Contenu */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "1.4rem 1.5rem 1.2rem",
        display: "flex", flexDirection: "column", flex: 1, gap: "0.65rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="svc-card__dot" style={{
            width: 5, height: 5, borderRadius: "50%",
            background: svc.accent, flexShrink: 0, display: "inline-block",
          }} />
          <span style={{
            fontSize: "clamp(9px, 0.6rem, 0.64rem)", letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
          }}>Pôle {svc.poleN} · {svc.pole}</span>
        </div>

        <h3 style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(13px, 0.98rem, 1.08rem)",
          fontWeight: 500, color: "#fff",
          lineHeight: 1.22, whiteSpace: "pre-line", flex: 1,
        }}>{svc.title}</h3>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <p className="svc-card__tagline" style={{
            fontSize: "clamp(10px, 0.68rem, 0.74rem)",
            color: "rgba(255,255,255,0.30)",
            fontStyle: "italic", lineHeight: 1.35, maxWidth: "82%",
          }}>{svc.tagline}</p>
          <svg className="svc-card__arrow" width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={svc.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICES OVERVIEW
   ══════════════════════════════════════════════════════════ */
function ServicesOverview({ onEnter }: { onEnter: (i: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "absolute", inset: 0, zIndex: 8,
        display: "flex", flexDirection: "column",
        padding: "clamp(5.5rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3.5rem) clamp(22rem, 28vw, 26rem)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [...EASE] }}
        style={{
          marginBottom: "1.5rem",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.8rem",
        }}
      >
        <div>
          <p style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(10px, 0.70rem, 0.76rem)",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)", marginBottom: "0.4rem",
          }}>Africa Centred Technology</p>
          <h1 style={{
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(22px, 3.2vw, 3.8rem)",
            fontWeight: 500, color: "#fff", lineHeight: 1,
          }}>Nos Services</h1>
        </div>

        {/* Légende pôles */}
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[{ label: "Pôle I · Ingénierie", color: ORANGE }, { label: "Pôle II · Conseil", color: GOLD }].map(p => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: p.color, flexShrink: 0,
                boxShadow: `0 0 5px ${p.color}`,
              }} />
              <span style={{
                fontSize: "clamp(10px, 0.66rem, 0.70rem)",
                color: "rgba(255,255,255,0.32)", letterSpacing: "0.1em",
              }}>{p.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid 4 colonnes */}
      <div className="room-grid-4 svc-overview-grid" style={{ gap: "0.8rem", flex: 1 }}>
        {SERVICES.map((svc, i) => (
          <ServiceCard key={svc.slug} svc={svc} index={i} onEnter={onEnter} />
        ))}
      </div>

      <FooterStrip />

      <style>{`
        /* ── Grid responsive ── */
        @media (max-width: 1024px) { .svc-overview-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px)  { .svc-overview-grid { grid-template-columns: 1fr !important; } }

        /* ── Card base ── */
        .svc-card {
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .svc-card__img {
          opacity: 0.62;
          transition: opacity 0.5s ease, transform 0.65s ease;
        }
        .svc-card__depth {
          background: linear-gradient(to bottom, rgba(7,14,28,0.22) 0%, rgba(7,14,28,0.72) 52%, rgba(7,14,28,0.97) 100%);
          transition: background 0.5s ease;
        }
        .svc-card__halo {
          background: radial-gradient(ellipse 80% 70% at 15% 80%, color-mix(in srgb, var(--svc-accent) 13%, transparent) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .svc-card__topbar {
          transform: scaleX(0.15);
          transform-origin: left;
          transition: transform 0.45s ease;
        }
        .svc-card__icon { opacity: 0.05; transition: opacity 0.35s ease; }
        .svc-card__dot  { box-shadow: 0 0 4px var(--svc-accent); transition: box-shadow 0.35s ease; }
        .svc-card__tagline { transition: color 0.35s ease; }
        .svc-card__arrow {
          opacity: 0.25;
          transform: translateX(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        /* ── Hover state ── */
        .svc-overview-grid:has(.svc-card:hover) .svc-card:not(:hover) {
          opacity: 0.4;
          transform: scale(0.97);
        }
        .svc-card:hover {
          transform: scale(1.025);
          border-color: color-mix(in srgb, var(--svc-accent) 50%, transparent);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--svc-accent) 18%, transparent),
                      0 0 0 1px color-mix(in srgb, var(--svc-accent) 22%, transparent);
        }
        .svc-card:hover .svc-card__img {
          opacity: 0.85;
          transform: scale(1.06);
        }
        .svc-card:hover .svc-card__depth {
          background: linear-gradient(to bottom, rgba(7,14,28,0.08) 0%, rgba(7,14,28,0.60) 55%, rgba(7,14,28,0.93) 100%);
        }
        .svc-card:hover .svc-card__halo   { opacity: 1; }
        .svc-card:hover .svc-card__topbar { transform: scaleX(1); }
        .svc-card:hover .svc-card__icon   { opacity: 0.20; }
        .svc-card:hover .svc-card__dot    { box-shadow: 0 0 10px var(--svc-accent); }
        .svc-card:hover .svc-card__tagline { color: rgba(255,255,255,0.55); }
        .svc-card:hover .svc-card__arrow {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   PORTAL TRANSITION
   ══════════════════════════════════════════════════════════ */
function PortalTransition({ svc }: { svc: Service }) {
  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#070E1C", overflow: "hidden",
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Burst radial */}
      <motion.div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 55% at 50% 50%, ${svc.accent}55 0%, transparent 70%)`,
      }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 3], opacity: [0, 0.9, 0] }}
        transition={{ duration: 1.0, ease: [...BURST] }}
      />

      {/* Vignette tunnel */}
      <motion.div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 90% 88% at 50% 50%, transparent 14%, rgba(0,0,0,0.88) 100%)",
      }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 0] }}
        transition={{ duration: 1.2, times: [0, 0.08, 0.5, 1] }}
      />

      {/* Titre du service qui zoome */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.1, 18], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, ease: [...BURST] }}
        style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(28px, 5vw, 6rem)",
          fontWeight: 500, color: svc.accent,
          letterSpacing: "0.06em", lineHeight: 1,
          textAlign: "center", whiteSpace: "pre-line",
          userSelect: "none",
        }}
      >{svc.title}</motion.div>

      {/* Particules burst */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 200 + Math.random() * 180;
        return (
          <motion.div key={i} aria-hidden style={{
            position: "absolute", width: 3, height: 3,
            borderRadius: "50%", background: svc.accent,
            left: "50%", top: "50%",
          }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0, scale: 0,
            }}
            transition={{ duration: 0.85, delay: 0.05, ease: "easeOut" }}
          />
        );
      })}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export default function ServicesIntroShell() {
  const [phase, setPhase] = useState<Phase>("logo");
  const [selected, setSelected] = useState(0);

  const handleLogoDone = useCallback(() => setPhase("services"), []);

  const handleEnterService = useCallback((idx: number) => {
    setSelected(idx);
    setPhase("entering");
    setTimeout(() => setPhase("room"), 1400);
  }, []);

  const svc = SERVICES[selected];

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      position: "relative", background: "#070E1C",
      paddingTop: "5rem",   /* clear the fixed navbar */
    }}>
      {/* Fond ambiant */}
      {(phase === "logo" || phase === "services") && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 80%, #0D1F0A 0%, #050C18 60%, #030810 100%)",
            opacity: 0.4,
          }} />
        </div>
      )}

      {/* Grain */}
      <div className="grain-overlay" aria-hidden />

      {/* Phases */}
      <AnimatePresence mode="wait">

        {phase === "logo" && (
          <motion.div key="logo" style={{ position: "absolute", inset: 0, zIndex: 10 }}
            initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [...EASE] }}>
            <LogoPhase onDone={handleLogoDone} />
          </motion.div>
        )}

        {phase === "services" && (
          <motion.div key="services" style={{ position: "absolute", inset: 0, zIndex: 8 }}>
            <ServicesOverview onEnter={handleEnterService} />
          </motion.div>
        )}

        {phase === "entering" && (
          <motion.div key="entering" style={{ position: "absolute", inset: 0, zIndex: 20 }}>
            <PortalTransition svc={svc} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Room */}
      {(phase === "entering" || phase === "room") && (
        <motion.div
          style={{ position: "absolute", inset: 0, zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "room" ? 1 : 0 }}
          transition={{ duration: 0.5, delay: phase === "room" ? 0.1 : 0 }}>
          <ServiceRoomShell initialIndex={selected} />
        </motion.div>
      )}
    </div>
  );
}
