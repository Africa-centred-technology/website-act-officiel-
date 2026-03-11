"use client";

/**
 * Room 06 — LA SORTIE
 * CTA / exit room: magnetic button, floating particles, ambient glow.
 * Portal entry ring expands from centre on arrival.
 * Headings enter with depth-scale compression (far → near).
 * 3-layer parallax gives the horizon its infinite feel.
 */

import React, { useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import Link from "next/link";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "À Propos" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Réalisations" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@AfricaCentredTechnology", label: "YouTube" },
  { Icon: Facebook, href: "https://web.facebook.com/profile.php?id=61585541019830", label: "Facebook" },
];

function FooterStrip() {
  return (
    <motion.div
      aria-label="Footer"
      className="absolute left-0 right-0 pointer-events-auto"
      style={{ bottom: "5rem", zIndex: 10, padding: "0 clamp(2rem, 5vw, 6rem)" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
    >
      <div style={{ height: 1, background: "rgba(211,84,0,0.4)", marginBottom: "3rem" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4rem", marginBottom: "2.8rem" }}>

        {/* Col 1 — Contact */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Contact</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <a href="mailto:contact@act.africa"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Mail size={18} strokeWidth={1.6} />contact@act.africa
            </a>
            <a href="tel:+212694528498"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              style={{ fontSize: "1.15rem" }}>
              <Phone size={18} strokeWidth={1.6} />+212 694-528498
            </a>
            <span className="flex items-center gap-3 text-white/40" style={{ fontSize: "1.15rem" }}>
              <MapPin size={18} strokeWidth={1.6} />Casablanca, Maroc
            </span>
          </div>
        </div>

        {/* Col 2 — Réseaux Sociaux */}
        <div>
          <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.6rem" }}>Réseaux Sociaux</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#D35400] transition-colors"
                style={{ fontSize: "1.15rem" }}>
                <Icon size={20} strokeWidth={1.5} />{label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3 — Carrières + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
          <div>
            <p className="uppercase font-black text-white/55" style={{ fontSize: "1rem", letterSpacing: "0.3em", marginBottom: "1.2rem" }}>Carrières</p>
            <p className="text-white/60" style={{ fontSize: "1.1rem", lineHeight: 1.65, marginBottom: "1rem", maxWidth: "240px" }}>
              Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
            </p>
            <Link href="/careers"
              className="text-[#D35400] hover:text-[#F39C12] transition-colors uppercase font-black"
              style={{ fontSize: "1.05rem", letterSpacing: "0.1em" }}>
              Postuler maintenant →
            </Link>
          </div>
          <CTAButton href="/contact">Un projet en tête ?</CTAButton>
        </div>

      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: "1.4rem" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <span className="text-white/40 uppercase" style={{ fontSize: "0.92rem", letterSpacing: "0.08em" }}>
          © 2026 Africa Centred Technology. Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
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

/** Button drifts toward cursor, snaps back on leave */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.32);
    y.set((e.clientY - r.top - r.height / 2) * 0.32);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-hover
    >
      {children}
    </motion.div>
  );
}

const ease = [0.6, 0.08, 0.02, 0.99] as const;

/** Expanding portal ring that greets the visitor on arrival */
function PortalRing() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: "1px solid rgba(211,84,0,0.18)" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: "80vmin", height: "80vmin", opacity: 0 }}
          transition={{
            duration: 2.8,
            delay: i * 0.55,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export default function RoomSortie() {
  /* ── 3-layer parallax ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX = useSpring(mx, { stiffness: 110, damping: 24 });
  const fgY = useSpring(my, { stiffness: 110, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  /* Deterministic particles */
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: (i * 47 + 11) % 100,
        y: (i * 67 + 23) % 100,
        size: 1.5 + (i % 2),
        dur: 4.5 + (i % 5) * 1.2,
        delay: (i % 6) * 0.8,
      })),
    []
  );

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative overflow-hidden flex flex-col items-center justify-center text-center room-pad"
      style={{ width: "100%", height: "100%" }}
    >


      {/* ── Portal rings — expanding from centre on arrival ── */}
      <PortalRing />

      {/* ── Deep BG: room label — blur-focus entry ── */}
      <motion.span
        className="block text-white/10 font-black uppercase absolute"
        style={{ fontSize: "1.1rem", letterSpacing: "0.2em", top: "6%", x: bgX, y: bgY }}
        initial={{ scale: 1.14, opacity: 0, filter: "blur(14px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.9, ease: [0.6, 0.08, 0.02, 0.99] }}
      >
        LA SORTIE
      </motion.span>

      {/* ── Breathing ambient glow — bg layer ── */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: "70vw",
          height: "40vw",
          background: "radial-gradient(ellipse, rgba(211,84,0,0.09) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          x: bgX,
          y: bgY,
        }}
        animate={{ scale: [1, 1.22, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: "#D35400",
              boxShadow: `0 0 ${p.size * 5}px rgba(211,84,0,0.6)`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 0.65, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Horizontal rule lines — extend from centre ── */}
      {(["18%", "82%"] as const).map((pos) => (
        <motion.div
          key={pos}
          aria-hidden
          className="absolute left-0 w-full pointer-events-none"
          style={{ height: 1, background: "rgba(255,255,255,0.04)", top: pos, originX: 0.5 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4 }}
        />
      ))}

      {/* ── Content — mid layer ── */}
      <motion.div className="relative z-10 w-full" style={{ x: midX, y: midY }}>

        {/* Eyebrow centré */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.10 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.88rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>
            Passez à l&apos;action
          </span>
          <span className="diamond diamond--sm" />
        </motion.div>


        {/* Subtext */}
        <motion.p
          className="text-white/65 mx-auto mb-12"
          style={{ fontSize: "var(--font-20)", lineHeight: 1.7, maxWidth: "50rem" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Prêt à transformer vos défis en opportunités technologiques ?
          ACT accompagne entreprises et organisations dans la création de solutions technologiques innovantes et intelligentes.
        </motion.p>

        {/* CTAs — foreground, last to appear */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          style={{ x: fgX, y: fgY }}
        >
          <Magnetic>
            <CTAButton href="/contact">Démarrer un projet</CTAButton>
          </Magnetic>
          <Link
            href="/services"
            className="flex items-center gap-3 text-white/55 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.2rem", letterSpacing: "0.12em" }}
          >
            <span className="diamond diamond--sm" />
            Nos expertises IA
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Footer strip — navigation, contact, socials ── */}
      <FooterStrip />
    </div>
  );
}
