"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { secteurs } from "@/lib/secteurs-data";

const ORANGE = "#D35400";
const ELEARNING = "https://elearning.africacentredtechnology.com/";

/* ─────────────────────────────────────────────────────────────
   MEGA-MENU WRAPPER
───────────────────────────────────────────────────────────── */
function MegaMenu({ isOpen, wide = false, children }: { isOpen: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "calc(100% + 1.25rem)",
            left: wide ? 0 : "50%",
            right: wide ? "auto" : "auto",
            translateX: wide ? "0" : "-50%",
            background: "#0c1a14",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.75rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            zIndex: 300,
            overflow: "hidden",
            minWidth: wide ? 680 : 380,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   INDUSTRIES MEGA-MENU  (2 colonnes, style Luxoft)
───────────────────────────────────────────────────────────── */
function IndustriesMega({ isOpen, t }: { isOpen: boolean; t: ReturnType<typeof useTranslations<"common.nav">> }) {
  const sectorKeys: Record<string, { label: string; tagline: string }> = {
    "industrie":      { label: t("industrie"),      tagline: "Moderniser les opérations & la production" },
    "finance":        { label: t("finance"),         tagline: "Accélérer la digitalisation des services" },
    "ecommerce":      { label: t("ecommerce"),       tagline: "Booster la conversion & la logistique"    },
    "education":      { label: t("education"),       tagline: "Transformer l'apprentissage par le digital"},
    "sante":          { label: t("sante"),            tagline: "Optimiser les processus de soins"         },
    "telecoms-medias":{ label: t("telecomsMedias"),  tagline: "Innover les plateformes & services"       },
    "immobilier":     { label: "Immobilier",          tagline: "Digitaliser la gestion des actifs"        },
  };

  return (
    <MegaMenu isOpen={isOpen} wide>
      <div style={{ padding: "1.75rem 2rem 1.25rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 1rem 0.25rem", fontFamily: "var(--font-body)" }}>
          {t("industries")}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 2.5rem" }}>
          {secteurs.map((s) => {
            const info = sectorKeys[s.slug];
            if (!info) return null;
            return (
              <Link
                key={s.slug}
                href={`/secteurs/${s.slug}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0.75rem 0.85rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
                  {info.label}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4, marginTop: "0.2rem" }}>
                  {info.tagline}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <MegaFooter href="/secteurs" label={t("voirSecteurs")} />
    </MegaMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPERTISES MEGA-MENU  (3 colonnes par pôle)
───────────────────────────────────────────────────────────── */
function ExpertisesMega({ isOpen, t }: { isOpen: boolean; t: ReturnType<typeof useTranslations<"common.nav">> }) {
  const poles = [
    {
      label: t("poleIngenierie"),
      color: "#D35400",
      items: [
        { label: t("expertiseDev"),   href: "/poles/developpement-technologique" },
        { label: t("expertiseIA"),    href: "/services" },
        { label: t("expertiseArchi"), href: "/services" },
        { label: t("expertiseData"),  href: "/services" },
      ],
    },
    {
      label: t("poleConseil"),
      color: "#F39C12",
      items: [
        { label: t("expertiseConseilStrat"), href: "/services/conseil-strategique" },
        { label: t("expertiseConseilOps"),   href: "/services/conseil-operationnel" },
      ],
    },
    {
      label: t("poleFormation"),
      color: "#16a34a",
      items: [
        { label: t("expertiseFormation"), href: "/poles/formation" },
        { label: "ACT University",        href: ELEARNING },
      ],
    },
  ];

  return (
    <MegaMenu isOpen={isOpen} wide>
      <div style={{ padding: "2rem 2.25rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0 2.5rem" }}>
        {poles.map((pole) => (
          <div key={pole.label}>
            <p style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: pole.color,
              margin: "0 0 1rem", fontFamily: "var(--font-body)",
              borderBottom: `1px solid ${pole.color}30`, paddingBottom: "0.65rem",
            }}>
              {pole.label}
            </p>
            {pole.items.map((item) => {
              const isExt = item.href.startsWith("http");
              const linkStyle = {
                display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.75rem 0.65rem", borderRadius: "0.5rem",
                textDecoration: "none", color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-body)", fontSize: "1.2rem",
                fontWeight: 500, transition: "color 0.15s, background 0.15s",
              } as React.CSSProperties;
              const handlers = {
                onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; },
                onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent"; },
              };
              const inner = <><span style={{ width: 6, height: 6, borderRadius: "50%", background: pole.color, flexShrink: 0 }} />{item.label}</>;
              return isExt
                ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" style={linkStyle} {...handlers}>{inner}</a>
                : <Link key={item.label} href={item.href} style={linkStyle} {...handlers}>{inner}</Link>;
            })}
          </div>
        ))}
      </div>
      <MegaFooter href="/services" label={t("voirServices")} />
    </MegaMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
   PERSPECTIVES MEGA-MENU  (2 colonnes : Lire / Apprendre)
───────────────────────────────────────────────────────────── */
function PerspectivesMega({ isOpen, t }: { isOpen: boolean; t: ReturnType<typeof useTranslations<"common.nav">> }) {
  return (
    <MegaMenu isOpen={isOpen}>
      <div>
        <div style={{ padding: "2.25rem 2.5rem" }}>
          {[
            { label: t("perspArticles"),  href: "/blog",       icon: "📝" },
            { label: t("perspTendances"), href: "/blog",       icon: "🌍" },
            { label: t("perspCasIA"),     href: "/cas-etudes", icon: "💡" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "1rem 1rem", borderRadius: "0.5rem",
                textDecoration: "none", color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-body)", fontSize: "1.2rem",
                fontWeight: 500, transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent"; }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </MegaMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
   MEGA-MENU FOOTER LINK
───────────────────────────────────────────────────────────── */
function MegaFooter({ href, label }: { href: string; label: string }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "0.85rem 1.75rem" }}>
      <Link
        href={href}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: ORANGE, textDecoration: "none", transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        {label} <ArrowUpRight size={12} strokeWidth={2} />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE ACCORDION
───────────────────────────────────────────────────────────── */
type MobileItem = { href: string; label: string; icon?: string };

function MobileSection({ label, items, footerHref, footerLabel, delay, onClose }: {
  label: string; items: MobileItem[];
  footerHref?: string; footerLabel?: string;
  delay: number; onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.3rem 0", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 500 }}
      >
        {label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} strokeWidth={2} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: "1rem" }}>
              {items.map((item, i) => {
                const isExt = item.href.startsWith("http");
                const s = { display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.65rem 0", textDecoration: "none", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)", fontSize: "1rem", borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "color 0.2s" } as React.CSSProperties;
                const inner = <><span style={{ width: 4, height: 4, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />{item.label}</>;
                return isExt
                  ? <a key={item.label + i} href={item.href} target="_blank" rel="noopener noreferrer" style={s} onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>{inner}</a>
                  : <Link key={item.label + i} href={item.href} onClick={onClose} style={s} onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>{inner}</Link>;
              })}
              {footerHref && footerLabel && (
                <Link href={footerHref} onClick={onClose}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.6rem", fontSize: "0.75rem", color: ORANGE, textDecoration: "none", fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  {footerLabel} <ArrowUpRight size={11} strokeWidth={2} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MobileLink({ label, href, delay, onClose }: { label: string; href: string; delay: number; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <Link href={href} onClick={onClose}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.3rem 0", textDecoration: "none", color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)", fontSize: "1.2rem", fontWeight: 500, transition: "color 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
      >
        {label}
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HEADER PRINCIPAL
───────────────────────────────────────────────────────────── */
export default function Header({ hidden = false }: { hidden?: boolean }) {
  const t    = useTranslations("common.nav");
  const tCta = useTranslations("common.cta");
  const locale  = useLocale();
  const pathname = usePathname();
  const router   = useRouter();
  const targetLocale = locale === "fr" ? "en" : "fr";

  const [scrolled, setScrolled]         = useState(false);
  const [scrolledPast120, setSP120]     = useState(false);
  const [progress, setProgress]         = useState(0);
  const [openMenu, setOpenMenu]         = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* scroll */
  useEffect(() => {
    let raf = 0;
    const fn = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 40);
        setSP120(y > 120);
        setProgress(max > 0 ? y / max : 0);
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); if (raf) cancelAnimationFrame(raf); };
  }, []);

  function active(key: string) {
    const p = pathname ?? "/";
    if (key === "index") return p === "/" || p === "";
    return p.startsWith(`/${key}`);
  }

  const isFormDetail = /^\/formations\/[^/]+/.test(pathname ?? "");
  if (hidden || (isFormDetail && scrolledPast120)) return null;

  /* hover helpers with small delay to avoid flicker */
  const enter = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(id);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  /* Data for mobile menus */
  const industriesItems: MobileItem[] = secteurs.map((s) => ({
    href: `/secteurs/${s.slug}`,
    label: s.slug === "industrie" ? t("industrie")
         : s.slug === "finance"   ? t("finance")
         : s.slug === "ecommerce" ? t("ecommerce")
         : s.slug === "education" ? t("education")
         : s.slug === "sante"     ? t("sante")
         : s.slug === "telecoms-medias" ? t("telecomsMedias")
         : "Immobilier",
    icon: s.icon,
  }));

  const expertisesItems: MobileItem[] = [
    { label: t("expertiseIA"),        href: "/services" },
    { label: t("expertiseDev"),       href: "/poles/developpement-technologique" },
    { label: t("expertiseIA"),        href: "/services" },
    { label: t("expertiseArchi"),     href: "/services" },
    { label: t("expertiseData"),      href: "/services" },
    { label: t("expertiseConseilStrat"), href: "/services/conseil-strategique" },
    { label: t("expertiseConseilOps"),   href: "/services/conseil-operationnel" },
    { label: t("expertiseFormation"), href: "/poles/formation" },
  ];

  const perspectivesItems: MobileItem[] = [
    { label: t("perspArticles"),  href: "/blog",       icon: "📝" },
    { label: t("perspTendances"), href: "/blog",       icon: "🌍" },
    { label: t("perspCasIA"),     href: "/cas-etudes", icon: "💡" },
    { label: t("perspUniversite"),href: ELEARNING,     icon: "🎓" },
    { label: t("perspCours"),     href: ELEARNING,     icon: "📚" },
  ];

  return (
    <>
      {/* Progress bar */}
      <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 202, background: "rgba(255,255,255,0.04)" }}>
        <motion.div style={{ height: "100%", background: ORANGE, originX: 0 }}
          animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 280, damping: 38 }} />
      </div>

      {/* NAV */}
      <nav
        className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99999 }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "0 clamp(1.5rem, 4vw, 4rem)", height: "clamp(56px, 7vh, 72px)", gap: "clamp(0.5rem, 1.5vw, 1rem)" }}>

          {/* Logo */}
          <Link href="/" className={`navbar-navigation__link${active("index") ? " --is-active" : ""}`}
            style={{ position: "relative", marginRight: "clamp(1rem, 2vw, 2rem)", flexShrink: 0 }}
          >
            ACT
            {active("index") && <motion.span layoutId="nav-dot" style={{ position: "absolute", bottom: -5, left: "50%", translateX: "-50%", width: 3, height: 3, borderRadius: "50%", background: ORANGE, display: "block" }} />}
          </Link>

          {/* Desktop — primary items */}
          <div className="hidden lg:flex items-center" style={{ gap: "clamp(0.25rem, 1vw, 0.5rem)", flex: 1, justifyContent: "flex-end" }}>

            {/* 1. Industries */}
            <div style={{ position: "relative" }} onMouseEnter={() => enter("industries")} onMouseLeave={leave}>
              <NavBtn label={t("industries")} isOpen={openMenu === "industries"} isActive={active("secteurs")} />
              <IndustriesMega isOpen={openMenu === "industries"} t={t} />
            </div>

            {/* 2. Expertises */}
            <div style={{ position: "relative" }} onMouseEnter={() => enter("expertises")} onMouseLeave={leave}>
              <NavBtn label={t("expertises")} isOpen={openMenu === "expertises"} isActive={active("services") || active("poles")} />
              <ExpertisesMega isOpen={openMenu === "expertises"} t={t} />
            </div>

            {/* 3. Réalisations — flat */}
            <NavFlatLink href="/projects" isActive={active("projects") || active("cas-etudes")}>
              {t("realisations")}
            </NavFlatLink>

            {/* 4. Perspectives */}
            <div style={{ position: "relative" }} onMouseEnter={() => enter("perspectives")} onMouseLeave={leave}>
              <NavBtn label={t("perspectives")} isOpen={openMenu === "perspectives"} isActive={active("blog") || active("cas-etudes")} />
              <PerspectivesMega isOpen={openMenu === "perspectives"} t={t} />
            </div>

            {/* 5. Carrières — flat */}
            <NavFlatLink href="/carrieres" isActive={active("carrieres")}>
              {t("carrieres")}
            </NavFlatLink>

            {/* 6. À propos — flat */}
            <NavFlatLink href="/about" isActive={active("about")}>
              {t("aPropos")}
            </NavFlatLink>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0, marginLeft: "auto" }}>

            {/* CTA Nous contacter */}
            <Link href="/contact" className="hidden lg:inline-flex"
              style={{ alignItems: "center", padding: "0.6rem 1.4rem", background: ORANGE, borderRadius: "0.4rem", textDecoration: "none", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.92rem", fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {t("nousContacter")}
            </Link>

            {/* Language */}
            <button
              onClick={() => router.replace(pathname, { locale: targetLocale })}
              aria-label={`Switch to ${targetLocale.toUpperCase()}`}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "4px", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-display)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.28rem 0.5rem", textTransform: "uppercase", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = ORANGE; e.currentTarget.style.borderColor = ORANGE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
            >
              {targetLocale.toUpperCase()}
            </button>

            {/* Hamburger — mobile only, right side */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#fff", padding: "0.25rem", alignItems: "center", flexShrink: 0 }}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }} transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: "fixed", inset: 0, background: "#0c1a14", zIndex: 100000, display: "flex", flexDirection: "column", overflowY: "auto" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.8rem", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              <Link href="/" onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff", textDecoration: "none" }}
              >
                ACT<span style={{ color: ORANGE }}>.</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: "0.4rem", display: "flex" }}>
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <nav style={{ flex: 1, padding: "0.5rem 1.8rem" }}>
              <MobileSection label={t("industries")} items={industriesItems} footerHref="/secteurs" footerLabel={t("voirSecteurs")} delay={0.08} onClose={() => setMobileOpen(false)} />
              <MobileSection label={t("expertises")} items={expertisesItems} footerHref="/services" footerLabel={t("voirServices")} delay={0.13} onClose={() => setMobileOpen(false)} />
              <MobileLink label={t("realisations")} href="/projects" delay={0.18} onClose={() => setMobileOpen(false)} />
              <MobileSection label={t("perspectives")} items={perspectivesItems} delay={0.23} onClose={() => setMobileOpen(false)} />
              <MobileLink label={t("carrieres")} href="/carrieres" delay={0.28} onClose={() => setMobileOpen(false)} />
              <MobileLink label={t("aPropos")} href="/about" delay={0.33} onClose={() => setMobileOpen(false)} />
            </nav>

            {/* Footer */}
            <div style={{ padding: "1.5rem 1.8rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
              <Link href="/contact" onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.8rem", background: ORANGE, borderRadius: "0.4rem", textDecoration: "none", color: "#fff", fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {t("nousContacter")}
              </Link>
              <button
                onClick={() => { router.replace(pathname, { locale: targetLocale }); setMobileOpen(false); }}
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.4rem", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-display)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.55rem 1rem", alignSelf: "flex-start" }}
              >
                {targetLocale === "en" ? "Switch to English" : "Passer en Français"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop t={tCta} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────────────────────── */
function NavBtn({ label, isOpen, isActive }: { label: string; isOpen: boolean; isActive: boolean }) {
  return (
    <button
      className={`navbar-navigation__link${isActive ? " --is-active" : ""}`}
      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", position: "relative", padding: "0.5rem 0.6rem", whiteSpace: "nowrap" }}
    >
      {label}
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
        <ChevronDown size={13} strokeWidth={2} style={{ opacity: 0.6 }} />
      </motion.div>
      {isActive && <motion.span layoutId="nav-dot" style={{ position: "absolute", bottom: -4, left: "50%", translateX: "-50%", width: 3, height: 3, borderRadius: "50%", background: ORANGE, display: "block" }} />}
    </button>
  );
}

function NavFlatLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <Link href={href} className={`navbar-navigation__link${isActive ? " --is-active" : ""}`}
        style={{ padding: "0.5rem 0.6rem", whiteSpace: "nowrap", display: "block" }}
      >
        {children}
        {isActive && <motion.span layoutId="nav-dot" style={{ position: "absolute", bottom: -4, left: "50%", translateX: "-50%", width: 3, height: 3, borderRadius: "50%", background: ORANGE, display: "block" }} />}
      </Link>
    </div>
  );
}

function ScrollToTop({ t }: { t: ReturnType<typeof useTranslations<"common.cta">> }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position: "fixed", bottom: "2rem", right: "2rem", width: "3.25rem", height: "3.25rem", borderRadius: "50%", background: ORANGE, color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 999, boxShadow: "0 4px 16px rgba(211,84,0,0.35)", transition: "transform 0.2s" }}
      aria-label={t("scrollToTop")} className="scroll-to-top-btn"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
