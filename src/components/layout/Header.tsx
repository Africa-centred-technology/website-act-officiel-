"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Youtube, Instagram } from "lucide-react";

/* ── Tokens ─────────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;
const ORANGE = "#D35400";
const GOLD = "#F39C12";

/* ── Data ───────────────────────────────────────────────── */
const LEFT_NAV = [
  { href: "/about", label: "À Propos", key: "about" },
  { href: "/services", label: "Services", key: "services" },
  { href: "/secteurs", label: "Secteurs", key: "secteurs" },
];

const RIGHT_NAV = [
  { href: "/projects", label: "Réalisations", key: "projects" },
  { href: "/blog", label: "Blog", key: "blog" },
  { href: "/contact", label: "Contact", key: "contact" },
];

const MENU_LINKS = [
  { href: "/", label: "Accueil", n: "01", key: "index" },
  { href: "/about", label: "À Propos", n: "02", key: "about" },
  { href: "/services", label: "Services", n: "03", key: "services" },
  { href: "/secteurs", label: "Secteurs", n: "04", key: "secteurs" },
  { href: "/projects", label: "Réalisations", n: "05", key: "projects" },
  { href: "/blog", label: "Blog", n: "06", key: "blog" },
  { href: "/contact", label: "Contact", n: "07", key: "contact" },
];

const SOCIALS = [
  { icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@AfricaCentredTechnology", label: "YouTube" },
  { icon: Facebook, href: "https://web.facebook.com/profile.php?id=61585541019830", label: "Facebook" },
];

/* ── Orbiting dot helper ────────────────────────────────── */
function OrbitDot({
  duration, radius, color, delay = 0, size = 7,
}: { duration: number; radius: number; color: string; delay?: number; size?: number }) {
  return (
    <motion.div
      style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity, delay }}
    >
      <div style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 14px 4px ${color}cc, 0 0 28px 8px ${color}44`,
        top: -radius, left: -(size / 2),
      }} />
    </motion.div>
  );
}

/* ── Right-panel visual ─────────────────────────────────── */
function VisualPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;

      /* Subtle grid */
      ctx.strokeStyle = "rgba(211,84,0,0.04)";
      ctx.lineWidth = 0.5;
      const cell = 38;
      for (let y = 0; y < H + cell; y += cell) {
        for (let x = 0; x < W + cell; x += cell) {
          const d = cell * 0.3;
          ctx.beginPath();
          ctx.moveTo(x, y - d); ctx.lineTo(x + d, y);
          ctx.lineTo(x, y + d); ctx.lineTo(x - d, y);
          ctx.closePath(); ctx.stroke();
        }
      }

      /* Pulsing radial glow */
      const a = 0.06 + Math.sin(t * 0.8) * 0.03;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.45);
      g.addColorStop(0, `rgba(211,84,0,${a})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* Slow rotating lines from center */
      for (let i = 0; i < 6; i++) {
        const angle = t * 0.15 + (i / 6) * Math.PI * 2;
        const len = Math.min(W, H) * 0.38;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(211,84,0,${0.05 + (i % 2) * 0.02})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={canvasRef} aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* Orbital rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[120, 195, 268].map((r, i) => (
          <motion.div key={i}
            style={{
              position: "absolute",
              width: r * 2, height: r * 2,
              borderRadius: "50%",
              border: `1px solid rgba(211,84,0,${[0.45, 0.28, 0.18][i]})`,
              boxShadow: `0 0 ${[18, 10, 6][i]}px rgba(211,84,0,${[0.18, 0.10, 0.06][i]})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 28 + i * 12, ease: "linear", repeat: Infinity }}
          />
        ))}

        {/* Tick marks on inner ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <motion.div key={deg}
            style={{
              position: "absolute", top: "50%", left: "50%", width: 0, height: 0,
              rotate: deg,
            }}
          >
            <div style={{
              position: "absolute",
              width: 1, height: 7,
              background: `rgba(211,84,0,0.55)`,
              top: -120, left: -0.5,
            }} />
          </motion.div>
        ))}

        {/* Orbiting dots */}
        <OrbitDot duration={9} radius={120} color={ORANGE} size={8} />
        <OrbitDot duration={15} radius={195} color={GOLD} delay={1.5} size={7} />
        <OrbitDot duration={22} radius={268} color={ORANGE} delay={3} size={6} />

        {/* Center glow disc */}
        <div style={{
          position: "absolute",
          width: 160, height: 160,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.18) 0%, rgba(211,84,0,0.06) 40%, transparent 70%)",
          filter: "blur(8px)",
        }} />

        {/* Center logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [...BURST] }}
          style={{ position: "relative", zIndex: 2 }}
        >
          {/* Subtle halo ring */}
          <div style={{
            position: "absolute",
            inset: "-28px",
            borderRadius: "50%",
            border: "1px solid rgba(211,84,0,0.35)",
            boxShadow: "0 0 20px rgba(211,84,0,0.15)",
          }} />
          <Image
            src="/logo/logo.png" alt="ACT"
            width={130} height={52}
            style={{ objectFit: "contain", opacity: 0.95, filter: "brightness(1.15) drop-shadow(0 0 12px rgba(211,84,0,0.5))" }}
          />
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{ position: "absolute", bottom: "3.5rem", left: "2rem", right: "2rem" }}
      >
        <Link href="/contact"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.65rem",
            padding: "0.9rem 1.5rem",
            background: ORANGE,
            color: "#fff",
            borderRadius: "0.5rem",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Démarrer un projet
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>

      {/* Left accent border */}
      <motion.div
        style={{
          position: "absolute", left: 0, top: "15%", bottom: "15%", width: "1px",
          background: `linear-gradient(to bottom, transparent, ${ORANGE}55, transparent)`,
        }}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [...EASE] }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN HEADER
   ══════════════════════════════════════════════════════════ */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  /* Scroll tracking */
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      setProgress(max > 0 ? y / max : 0);
      document.body.setAttribute("data-scrolling-direction", y > lastY ? "down" : "up");
      document.body.setAttribute("data-scrolling-started", y > 80 ? "true" : "false");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  function isActive(key: string) {
    const p = pathname ?? "/";
    if (key === "index") return p === "/" || p === "";
    return p.startsWith(`/${key}`);
  }

  /* ── Hamburger button (shared JSX) ── */
  const HamburgerBtn = ({ className = "" }: { className?: string }) => (
    <button
      className={`navbar-hamburger${open ? " navbar-hamburger--open" : ""} ${className}`}
      onClick={() => setOpen(v => !v)}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
    >
      <span className="navbar-hamburger__lines" aria-hidden>
        <motion.span className="navbar-hamburger__line navbar-hamburger__line-top"
          animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.35, ease: [...EASE] }}
        />
        <motion.span className="navbar-hamburger__line navbar-hamburger__line-bottom"
          animate={open ? { y: -4, rotate: -45, width: "2.4rem" } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.35, ease: [...EASE] }}
        />
      </span>
      <motion.span
        className="navbar-hamburger__label"
        key={open ? "close" : "menu"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22 }}
      >
        {open ? "CLOSE" : "MENU"}
      </motion.span>
    </button>
  );

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

      {/* ── Navbar — desktop only (hidden on mobile via CSS) ── */}
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-flex">

          {/* LEFT — nav links */}
          <ul className="navbar-navigation" style={{ display: "flex" }}>
            {LEFT_NAV.map((link) => (
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

          {/* CENTER — Accueil */}
          <Link
            href="/"
            className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
            style={{ justifySelf: "center", position: "relative", fontFamily: "Futura, sans-serif", fontWeight: 500, fontSize: "clamp(1.2rem, 1.4vw, 1.55rem)", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Accueil
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

          {/* RIGHT — secondary links + hamburger */}
          <div style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "2rem" }}>
            <ul className="navbar-navigation hidden xl:flex" style={{ gap: "2.5rem" }}>
              {RIGHT_NAV.map((link) => (
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
            <HamburgerBtn />
          </div>
        </div>
      </nav>

      {/* ── Mobile floating menu button — only visible below 1024px ── */}
      <div className="mobile-menu-btn">
        <HamburgerBtn />
      </div>

      {/* ── Fullscreen menu overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [...EASE] }}
          >
            {/* ── LEFT: navigation ── */}
            <div style={{
              flex: "1 1 0",
              background: "#06090F",
              display: "flex",
              flexDirection: "column",
              padding: "clamp(4.5rem, 8vw, 7rem) clamp(1.8rem, 5vw, 5rem) clamp(2rem, 4vw, 3rem)",
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Grain */}
              <div className="grain-overlay" aria-hidden />

              {/* Eyebrow */}
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.5rem, 3vh, 3rem)" }}
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <span className="diamond diamond--sm" />
                <span style={{
                  fontFamily: "Futura, system-ui",
                  fontSize: "0.72rem", letterSpacing: "0.38em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
                }}>Navigation</span>
                <span style={{
                  marginLeft: "auto",
                  fontFamily: "Futura, system-ui",
                  fontSize: "0.72rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.12)",
                }}>
                  ACT · {new Date().getFullYear()}
                </span>
              </motion.div>

              {/* Links */}
              <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0" }}>
                {MENU_LINKS.map((link, i) => {
                  const active = isActive(link.key);
                  const dimmed = hovered !== null && hovered !== link.key;
                  return (
                    <div
                      key={link.key}
                      className="nav-link-row"
                      style={{ position: "relative" }}
                      onMouseEnter={() => setHovered(link.key)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <motion.div
                        initial={{ x: -70, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.08 + i * 0.055, duration: 0.65, ease: [...EASE] }}
                      >
                        <Link href={link.href} onClick={close} style={{ display: "block", textDecoration: "none" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", padding: "0.15rem 0", position: "relative" }}>

                            {/* Accent bar */}
                            <div style={{
                              position: "absolute", left: 0, top: "12%", bottom: "12%",
                              width: "2px", background: ORANGE,
                              transform: "scaleY(0)", transformOrigin: "top",
                              opacity: 0,
                              transition: "transform 0.28s cubic-bezier(0.6,0.08,0.02,0.99), opacity 0.2s",
                            }} className="nav-accent-bar" />

                            {/* Number */}
                            <span className="nav-link-num" style={{
                              fontFamily: "Futura, system-ui, sans-serif",
                              fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
                              letterSpacing: "0.25em",
                              color: active ? GOLD : ORANGE,
                              minWidth: "2.2rem",
                              paddingLeft: "0.85rem",
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                              userSelect: "none",
                              flexShrink: 0,
                            }}>
                              {link.n}
                            </span>

                            {/* Label */}
                            <span style={{
                              fontFamily: "Futura, system-ui, sans-serif",
                              fontWeight: 900,
                              fontSize: "clamp(2.2rem, 5vw, 7rem)",
                              lineHeight: 0.92,
                              letterSpacing: "-0.025em",
                              textTransform: "uppercase",
                              color: dimmed
                                ? "rgba(255,255,255,0.04)"
                                : active ? ORANGE : "rgba(255,255,255,0.82)",
                              transition: "color 0.3s ease",
                              userSelect: "none",
                            }}>
                              {link.label}
                            </span>
                          </div>
                          {/* Thin separator */}
                          <div style={{ height: "1px", background: "rgba(255,255,255,0.04)", marginLeft: "0.85rem" }} />
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              {/* Bottom bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "1.5rem",
                  display: "flex", flexDirection: "column", gap: "0.85rem",
                }}
              >
                {/* Socials */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <motion.a key={label} href={href} aria-label={label}
                      target="_blank" rel="noopener noreferrer"
                      whileHover={{ y: -2, color: ORANGE }}
                      style={{ color: "rgba(255,255,255,0.22)", transition: "color 0.2s" }}>
                      <Icon size={15} />
                    </motion.a>
                  ))}
                </div>
                {/* Contacts */}
                <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                  {[
                    { label: "contact@act.africa", href: "mailto:contact@act.africa" },
                    { label: "+212 694-528498", href: "tel:+212694528498" },
                  ].map(({ label, href }) => (
                    <a key={href} href={href} style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontSize: "clamp(0.68rem, 0.85vw, 0.9rem)",
                      letterSpacing: "0.05em",
                      color: "rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                    >{label}</a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: visual panel (hidden on mobile) ── */}
            <div className="hidden md:block" style={{
              width: "clamp(280px, 30vw, 440px)",
              flexShrink: 0,
              background: "#050810",
              position: "relative",
              overflow: "hidden",
            }}>
              <VisualPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
