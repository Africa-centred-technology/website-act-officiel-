"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import DropdownMenu from "./DropdownMenu";
import { Menu, X } from "lucide-react";

const Grain = dynamic(() => import("@/components/background/Grain"), { ssr: false });

const ORANGE = "#D35400";

/* ══════════════════════════════════════════════════════════
   MOBILE ACCORDION
   ══════════════════════════════════════════════════════════ */
type MobileNavItem = { href: string; label: string; key: string; subItems?: { href: string; label: string; key: string }[] };

function MobileAccordion({
  label,
  items,
  delay,
  onClose,
}: {
  label: string;
  items: MobileNavItem[];
  delay: number;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.4rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.80)",
          fontFamily: "var(--font-body)",
          fontSize: "1.35rem",
          transition: "color 0.2s",
        }}
      >
        {label}
        <motion.svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M9 6l6 6-6 6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: "1rem" }}>
              <p style={{
                fontSize: "0.75rem",
                color: "#D35400",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                marginBottom: "0.8rem",
                paddingTop: "0.2rem",
              }}>
                {label}
              </p>
              {items.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: "block",
                      padding: "0.75rem 0",
                      fontSize: "1.15rem",
                      color: "#fff",
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      transition: "color 0.2s, padding-left 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#D35400"; e.currentTarget.style.paddingLeft = "0.5rem"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = "0"; }}
                  >
                    {item.label}
                  </Link>
                  {item.subItems?.map((sub) => (
                    <Link
                      key={sub.key}
                      href={sub.href}
                      onClick={onClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0 0.5rem 1rem",
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.55)",
                        textDecoration: "none",
                        fontFamily: "var(--font-body)",
                        fontWeight: 400,
                        borderLeft: "1px solid rgba(211,84,0,0.3)",
                        marginLeft: "0.5rem",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#D35400"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                    >
                      <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#D35400", flexShrink: 0 }} />
                      {sub.label}
                    </Link>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Header({ hidden = false }: { hidden?: boolean }) {
  const t = useTranslations("common.nav");
  const locale = useLocale();
  const pathname = usePathname(); // locale-stripped path from @/i18n/navigation
  const router = useRouter();     // locale-aware router from @/i18n/navigation

  const targetLocale = locale === "fr" ? "en" : "fr";

  const SAVOIR_FAIRE_MENU = [
    {
      href: "/poles" as const,
      label: t("polesExcellence"),
      key: "poles",
      description: "",
      subItems: [
        { href: "/poles/developpement-technologique", label: t("poleIngenierie"), key: "pole-ingenierie" },
        { href: "/poles/conseil-strategie-it",        label: t("poleConseil"),    key: "pole-conseil"    },
        { href: "/poles/formation",                   label: t("poleFormation"),  key: "pole-formation"  },
      ],
    },
    { href: "/secteurs" as const, label: t("secteursActivite"), key: "secteurs", description: "" },
    { href: "/services" as const, label: t("nosServices"),      key: "services", description: "" },
    {
      href: "/formations" as const,
      label: t("catalogueFormations"),
      key: "formations",
      description: "",
      subItems: [
        { href: "/formations/all", label: t("catalogueComplet"), key: "formations-all" },
      ],
    },
  ];

  const NOUS_DECOUVRIR_MENU = [
    { href: "/about" as const,     label: t("aPropos"),    key: "about",     description: "" },
    { href: "/about#equipe",        label: t("equipe"),     key: "equipe",    description: "" },
    { href: "/projects" as const,  label: t("realisations"), key: "projects", description: "" },
    { href: "/carrieres" as const, label: t("carrieres"),  key: "carrieres", description: "" },
  ];

  const NAV_LINKS = [
    { href: "/blog" as const,    label: t("blog"),       key: "blog"      },
    { href: "https://elearning.africacentredtechnology.com/", label: t("universite"), key: "universite" },
    { href: "/contact" as const, label: t("contact"),    key: "contact"   },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [scrolledPast120, setScrolledPast120] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savoirFaireOpen, setSavoirFaireOpen] = useState(false);
  const [nousDecouvrirOpen, setNousDecouvrirOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Scroll tracking — RAF-throttled */
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 40);
        setScrolledPast120(y > 120);
        setProgress(max > 0 ? y / max : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* pathname from @/i18n/navigation is already locale-stripped */
  function isActive(key: string) {
    const p = pathname ?? "/";
    if (key === "index") return p === "/" || p === "";
    return p.startsWith(`/${key}`);
  }

  const isSavoirFaireActive = SAVOIR_FAIRE_MENU.some(item => isActive(item.key));
  const isNousDecouvrirActive = NOUS_DECOUVRIR_MENU.some(item => isActive(item.key));

  const isFormationDetail = /^\/formations\/[^/]+/.test(pathname ?? "");
  if (hidden || (isFormationDetail && scrolledPast120)) return null;

  return (
    <>
      {/* Scroll progress bar */}
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

      {/* Navbar */}
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999 }}>
        <div className="navbar-flex" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1rem, 2vw, 2rem)",
          padding: "clamp(1rem, 2vh, 1.8rem) clamp(1.5rem, 4vw, 4rem)",
          width: "100%",
        }}>

          {/* Logo */}
          <Link
            href="/"
            className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
            style={{ position: "relative" }}
          >
            ACT
            {isActive("index") && (
              <motion.span
                layoutId="nav-dot"
                style={{
                  position: "absolute", bottom: "-5px", left: "50%",
                  translateX: "-50%",
                  width: 3, height: 3, borderRadius: "50%", background: ORANGE,
                  display: "block",
                }}
              />
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center" style={{ gap: "clamp(1.5rem, 2.5vw, 2.5rem)", marginLeft: "auto" }}>

            {/* Notre savoir-faire */}
            <div
              className="relative"
              onMouseEnter={() => setSavoirFaireOpen(true)}
              onMouseLeave={() => setSavoirFaireOpen(false)}
            >
              <button
                className={`navbar-navigation__link${isSavoirFaireActive ? " --is-active" : ""}`}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}
              >
                {t("savoirFaire")}
                <motion.svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  animate={{ rotate: savoirFaireOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
                {isSavoirFaireActive && (
                  <motion.span
                    layoutId="nav-dot"
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

            {/* Nous découvrir */}
            <div
              className="relative"
              onMouseEnter={() => setNousDecouvrirOpen(true)}
              onMouseLeave={() => setNousDecouvrirOpen(false)}
            >
              <button
                className={`navbar-navigation__link${isNousDecouvrirActive ? " --is-active" : ""}`}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}
              >
                {t("nousDecouvrir")}
                <motion.svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  animate={{ rotate: nousDecouvrirOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
                {isNousDecouvrirActive && (
                  <motion.span
                    layoutId="nav-dot"
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

            {/* Flat nav links */}
            <ul className="navbar-navigation flex items-center" style={{ gap: "clamp(1.5rem, 2.5vw, 2.5rem)" }}>
              {NAV_LINKS.map((link) => (
                <li key={link.key} style={{ position: "relative" }}>
                  <Link
                    href={link.href}
                    className={`navbar-navigation__link${isActive(link.key) ? " --is-active" : ""}`}
                  >
                    {link.label}
                    {isActive(link.key) && (
                      <motion.span
                        layoutId="nav-dot"
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

          {/* Language switcher */}
          <button
            onClick={() => router.replace(pathname, { locale: targetLocale })}
            aria-label={`Switch to ${targetLocale === "en" ? "English" : "Français"}`}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "4px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-display)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "0.3rem 0.6rem",
              textTransform: "uppercase",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = ORANGE; e.currentTarget.style.borderColor = ORANGE; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
          >
            {targetLocale.toUpperCase()}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative p-2 bg-transparent border-none cursor-pointer flex items-center justify-center text-white z-301"
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            {mobileMenuOpen ? <X size={32} color="#fff" /> : <Menu size={32} color="#fff" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,20,16, 0.98)",
              zIndex: 100000,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Header: Logo + X */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.4rem 1.8rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                ACT<span style={{ color: ORANGE }}>.</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label={t("closeMenu")}
              >
                <X size={28} />
              </button>
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, padding: "0 1.8rem" }}>
              <MobileAccordion
                label={t("savoirFaire")}
                items={SAVOIR_FAIRE_MENU}
                delay={0.15}
                onClose={() => setMobileMenuOpen(false)}
              />
              <MobileAccordion
                label={t("nousDecouvrir")}
                items={NOUS_DECOUVRIR_MENU}
                delay={0.22}
                onClose={() => setMobileMenuOpen(false)}
              />
              {[
                { label: t("blog"),       href: "/blog" as const },
                { label: t("universite"), href: "https://elearning.africacentredtechnology.com/" },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.29 + i * 0.07, duration: 0.35 }}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1.4rem 0", fontSize: "1.35rem", color: "rgba(255,255,255,0.80)",
                      textDecoration: "none", fontFamily: "var(--font-body)",
                      borderBottom: "1px solid rgba(255,255,255,0.08)", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer — Contact + Language switcher */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                padding: "2rem 1.8rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                flexShrink: 0,
              }}
            >
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  fontSize: "0.95rem",
                  color: ORANGE,
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.82 19.79 19.79 0 01.14 2.18 2 2 0 012.12 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                </svg>
                {t("contactUs")}
              </Link>

              {/* Language switcher in mobile */}
              <button
                onClick={() => { router.replace(pathname, { locale: targetLocale }); setMobileMenuOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.6rem 1rem",
                  alignSelf: "flex-start",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = ORANGE; e.currentTarget.style.borderColor = ORANGE; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                </svg>
                {targetLocale === "en" ? "Switch to English" : "Passer en Français"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
    </>
  );
}

/* ── Scroll to Top ── */
function ScrollToTop() {
  const t = useTranslations("common.cta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "3.5rem",
        height: "3.5rem",
        borderRadius: "50%",
        background: "#D35400",
        color: "#fff",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(211, 84, 0, 0.4)",
        transition: "transform 0.2s, background 0.2s",
      }}
      aria-label={t("scrollToTop")}
      className="scroll-to-top-btn"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
