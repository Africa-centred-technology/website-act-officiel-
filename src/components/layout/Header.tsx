"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DropdownMenu from "./DropdownMenu";
import { Menu, X } from "lucide-react";

const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });

/* ── Tokens ─────────────────────────────────────────────── */
const ORANGE = "#D35400";
const BG_DARK = "#070E1C";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Mobile detection */
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999, display: "block" }}>
        <div className="navbar-flex" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1rem, 2vw, 2rem)",
          padding: "clamp(1rem, 2vh, 1.8rem) clamp(1.5rem, 4vw, 4rem)",
          width: "100%",
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

          {/* Notre savoir-faire - Menu dropdown - hidden on mobile */}
          <div
            className="hidden md:block relative ml-auto"
            onMouseEnter={() => setSavoirFaireOpen(true)}
            onMouseLeave={() => setSavoirFaireOpen(false)}
          >
            <button
              className={`navbar-navigation__link${isSavoirFaireActive ? " --is-active" : ""}`}
              style={{
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
            className="hidden md:block relative"
            onMouseEnter={() => setNousDecouvrirOpen(true)}
            onMouseLeave={() => setNousDecouvrirOpen(false)}
          >
            <button
              className={`navbar-navigation__link${isNousDecouvrirActive ? " --is-active" : ""}`}
              style={{
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

          {/* Navigation links - hidden on mobile */}
          <ul className="navbar-navigation hidden md:flex items-center" style={{
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

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative p-2 bg-transparent border-none cursor-pointer flex items-center justify-center text-white z-[301]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={32} color="#fff" /> : <Menu size={32} color="#fff" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "calc(clamp(1rem, 2vh, 1.8rem) * 2 + 50px)", // Just below navbar (rough estimate based on padding + font size)
              left: 0,
              right: 0,
              minHeight: "100vh",
              maxHeight: "100vh",
              background: "rgba(7, 14, 28, 0.98)",
              backdropFilter: "blur(20px)",
              zIndex: 300,
              paddingBottom: "10rem",
              overflowY: "auto",
            }}
          >
            <Grain />
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", zIndex: 1, minHeight: "85vh" }}>

              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.8rem", color: "#fff", textDecoration: "none", fontWeight: 700, textTransform: "uppercase" }}>
                Accueil
              </Link>
              
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                <p style={{ fontSize: "1rem", color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Notre Savoir-Faire</p>
                {SAVOIR_FAIRE_MENU.map(item => (
                  <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "0.8rem 0", fontSize: "1.4rem", color: "#fff", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                <p style={{ fontSize: "1rem", color: ORANGE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Nous Découvrir</p>
                {NOUS_DECOUVRIR_MENU.map(item => (
                  <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "0.8rem 0", fontSize: "1.4rem", color: "#fff", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                {NAV_LINKS.map(item => (
                  <Link key={item.key} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "0.8rem 0", fontSize: "1.4rem", color: "#fff", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Logo in Menu Mobile - Centered Bottom & Large */}
              <div style={{ marginTop: "auto", paddingTop: "4rem", display: "flex", justifyContent: "center", width: "100%" }}>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image 
                    src="/logo/logo_continent.png" 
                    alt="ACT Logo Continent" 
                    width={260} 
                    height={260}
                    style={{ 
                      objectFit: "contain",
                      opacity: 0.9,
                      filter: "brightness(1.1)"
                    }}
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
    </>
  );
}

/* ── Scroll to Top Button ── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down a bit
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        background: '#D35400',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 999,
        boxShadow: '0 4px 12px rgba(211, 84, 0, 0.4)',
        transition: 'transform 0.2s, background 0.2s',
      }}
      aria-label="Remonter en haut"
      className="scroll-to-top-btn"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
