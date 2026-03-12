"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Youtube, Instagram, ArrowUp } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { usePathname } from "next/navigation";

/* Pages en rooms fullscreen — le footer global y est masqué */
const ROOMS_PAGES = ["/", "/about", "/services", "/projects", "/contact", "/blog", "/blog/articles", "/secteurs"];

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À Propos", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Réalisations", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/africacentredtechnology?utm_source=qr&igsh=MWU1bzQ4d3Jmdnk3ZQ==",
    label: "Instagram",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@AfricaCentredTechnology",
    label: "YouTube",
  },
  {
    icon: Facebook,
    href: "https://web.facebook.com/profile.php?id=61585541019830",
    label: "Facebook",
  },
];

const marqueeItems = [
  "ACT",
  "×",
  "AFRIQUE",
  "×",
  "TECHNOLOGIE",
  "×",
  "INTELLIGENCE ARTIFICIELLE",
  "×",
  "INNOVATION",
  "×",
  "TRANSFORMATION DIGITALE",
  "×",
  "INGÉNIERIE",
  "×",
  "ACT",
  "×",
  "AFRIQUE",
  "×",
  "TECHNOLOGIE",
  "×",
  "INTELLIGENCE ARTIFICIELLE",
  "×",
  "INNOVATION",
  "×",
  "TRANSFORMATION DIGITALE",
  "×",
  "INGÉNIERIE",
  "×",
];

export default function Footer() {
  const pathname = usePathname();

  if (ROOMS_PAGES.some(p => pathname === p || pathname.startsWith(p + "/"))) return null;

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#0A1410", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* ── Marquee band ── */}
      <div
        className="overflow-hidden py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="marquee-scroll flex items-center gap-0">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className={`whitespace-nowrap px-5 ${
                item === "×"
                  ? "text-[#D35400] text-[1.8rem]"
                  : "text-white/25 font-black uppercase"
              }`}
              style={{
                fontSize: item === "×" ? "1.8rem" : "1.7rem",
                letterSpacing: "0.15em",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer grid (clone named areas) ── */}
      <div className="footer-grid">
        {/* Navigation */}
        <div style={{ gridArea: "nav" }}>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <motion.div key={link.href} whileHover={{ x: 6 }}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 group"
                  style={{ fontSize: "1.9rem" }}
                >
                  <span className="diamond diamond--sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-white/40 hover:text-white transition-colors uppercase tracking-wide font-black">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div style={{ gridArea: "contact" }}>
          <p
            className="text-white/30 uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "1.5rem" }}
          >
            Contact
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:contact@act.africa"
              className="text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.9rem" }}
            >
              contact@act.africa
            </a>
            <a
              href="tel:+212694528498"
              className="text-white/60 hover:text-white transition-colors"
              style={{ fontSize: "1.9rem" }}
            >
              +212 694-528498
            </a>
            <p className="text-white/40 mt-2" style={{ fontSize: "1.7rem" }}>
              Casablanca, Maroc
            </p>
          </div>
        </div>

        {/* Social */}
        <div style={{ gridArea: "socials" }}>
          <p
            className="text-white/30 uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "1.5rem" }}
          >
            Réseaux Sociaux
          </p>
          <div className="flex flex-col gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <Icon size={22} />
                <span style={{ fontSize: "1.7rem" }}>{label}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Careers */}
        <div style={{ gridArea: "careers" }}>
          <p
            className="text-white/30 uppercase tracking-[0.2em] mb-4"
            style={{ fontSize: "1.5rem" }}
          >
            Carrières
          </p>
          <p
            className="text-white/50 mb-4 max-w-[320px]"
            style={{ fontSize: "1.7rem", lineHeight: 1.6 }}
          >
            Rejoignez l&apos;équipe qui construit l&apos;Afrique technologique de demain.
          </p>
          <Link
            href="/careers"
            className="text-[#D35400] hover:text-[#F39C12] transition-colors uppercase tracking-wide"
            style={{ fontSize: "1.5rem" }}
          >
            Postuler maintenant →
          </Link>
        </div>

        {/* CTA */}
        <div style={{ gridArea: "cta" }} className="flex items-center">
          <CTAButton href="/contact">Un projet en tête ?</CTAButton>
        </div>

        {/* Copyright */}
        <div
          style={{
            gridArea: "copy",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "2rem",
          }}
        >
          <p
            className="text-white/25 uppercase"
            style={{ fontSize: "1.4rem", letterSpacing: "0.08em" }}
          >
            © 2026 Africa Centred Technology.{" "}
            <span>Tous droits réservés</span>
          </p>
        </div>

        {/* Terms */}
        <div
          style={{
            gridArea: "terms",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "2rem",
          }}
          className="flex items-center gap-4"
        >
          <Link
            href="/privacy"
            className="text-white/25 hover:text-white/60 transition-colors uppercase"
            style={{ fontSize: "1.4rem" }}
          >
            Politique de Confidentialité
          </Link>
          <span className="text-white/20">/</span>
          <Link
            href="/terms"
            className="text-white/25 hover:text-white/60 transition-colors uppercase"
            style={{ fontSize: "1.4rem" }}
          >
            CGU
          </Link>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Retour en haut"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowUp size={20} />
        </motion.div>
        <span
          className="uppercase tracking-widest"
          style={{
            fontSize: "1.2rem",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          Top
        </span>
      </motion.button>
    </footer>
  );
}
