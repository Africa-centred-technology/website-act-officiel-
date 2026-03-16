"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import DropdownMenu from "./DropdownMenu";

/* ── Tokens ─────────────────────────────────────────────── */
const ORANGE = "#D35400";

/* ── Data ───────────────────────────────────────────────── */
const SAVOIR_FAIRE_MENU = [
  { href: "/secteurs", label: "Nos Secteurs d'Activité", key: "secteurs", description: "" },
  { href: "/services", label: "Nos Services", key: "services", description: "" },
  { href: "/about#partenaires", label: "Nos Partenaires", key: "partenaires", description: "" },
];

const NOUS_DECOUVRIR_MENU = [
  { href: "/about", label: "À Propos", key: "about", description: "" },
  { href: "/about#equipe", label: "Notre Équipe", key: "equipe", description: "" },
  { href: "/about#valeurs", label: "Nos Valeurs", key: "valeurs", description: "" },
  { href: "/projects", label: "Réalisations", key: "projects", description: "" },
];

const NAV_LINKS = [
  { href: "/blog", label: "Blog", key: "blog" },
  { href: "/universite", label: "ACT-université", key: "universite" },
  { href: "/contact", label: "Contactez-nous", key: "contact" },
];

/* ══════════════════════════════════════════════════════════
   MAIN HEADER
   ══════════════════════════════════════════════════════════ */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savoirFaireOpen, setSavoirFaireOpen] = useState(false);
  const [nousDecouvrirOpen, setNousDecouvrirOpen] = useState(false);

  /* Scroll tracking */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? y / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(key: string) {
    const p = pathname ?? "/";
    if (key === "index") return p === "/" || p === "";
    return p.startsWith(`/${key}`);
  }

  const isSavoirFaireActive = SAVOIR_FAIRE_MENU.some(item => isActive(item.key));
  const isNousDecouvrirActive = NOUS_DECOUVRIR_MENU.some(item => isActive(item.key));

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div aria-hidden style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "1.5px", zIndex: 202,
        background: "rgba(255,255,255,0.04)",
      }}>
        <motion.div
          style={{ height: "100%", background: ORANGE, originX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ type: "spring", stiffness: 280, damping: 38 }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-flex" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "clamp(1.5rem, 3vw, 3rem)",
          padding: "clamp(1.2rem, 2vh, 1.8rem) clamp(1.5rem, 4vw, 4rem)",
        }}>

          {/* Logo / Accueil */}
          <Link
            href="/"
            className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
            style={{
              position: "relative",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            ACT
            {isActive("index") && (
              <motion.span layoutId="nav-dot"
                style={{
                  position: "absolute", bottom: "-5px", left: "50%",
                  translateX: "-50%",
                  width: 3, height: 3, borderRadius: "50%", background: ORANGE,
                  display: "block",
                }}
              />
            )}
          </Link>

          {/* Notre savoir-faire - Menu dropdown */}
          <div
            style={{ position: "relative", marginLeft: "auto" }}
            onMouseEnter={() => setSavoirFaireOpen(true)}
            onMouseLeave={() => setSavoirFaireOpen(false)}
          >
            <button
              className={`navbar-navigation__link${isSavoirFaireActive ? " --is-active" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              Notre savoir-faire
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                animate={{ rotate: savoirFaireOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
              {isSavoirFaireActive && (
                <motion.span layoutId="nav-dot"
                  style={{
                    position: "absolute", bottom: "-5px", left: "50%",
                    translateX: "-50%",
                    width: 3, height: 3, borderRadius: "50%", background: ORANGE,
                    display: "block",
                  }}
                />
              )}
            </button>

            <DropdownMenu items={SAVOIR_FAIRE_MENU} isOpen={savoirFaireOpen} />
          </div>

          {/* Nous découvrir - Menu dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setNousDecouvrirOpen(true)}
            onMouseLeave={() => setNousDecouvrirOpen(false)}
          >
            <button
              className={`navbar-navigation__link${isNousDecouvrirActive ? " --is-active" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              Nous découvrir
              <motion.svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                animate={{ rotate: nousDecouvrirOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
              {isNousDecouvrirActive && (
                <motion.span layoutId="nav-dot"
                  style={{
                    position: "absolute", bottom: "-5px", left: "50%",
                    translateX: "-50%",
                    width: 3, height: 3, borderRadius: "50%", background: ORANGE,
                    display: "block",
                  }}
                />
              )}
            </button>

            <DropdownMenu items={NOUS_DECOUVRIR_MENU} isOpen={nousDecouvrirOpen} />
          </div>

          {/* Navigation links */}
          <ul className="navbar-navigation" style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1.2rem, 2.5vw, 2.5rem)",
          }}>
            {NAV_LINKS.map((link) => (
              <li key={link.key} style={{ position: "relative" }}>
                <Link href={link.href}
                  className={`navbar-navigation__link${isActive(link.key) ? " --is-active" : ""}`}>
                  {link.label}
                  {isActive(link.key) && (
                    <motion.span layoutId="nav-dot"
                      style={{
                        position: "absolute", bottom: "-5px", left: "50%",
                        translateX: "-50%",
                        width: 3, height: 3, borderRadius: "50%", background: ORANGE,
                        display: "block",
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
