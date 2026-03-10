"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";
import { Linkedin, Facebook, Youtube, Instagram } from "lucide-react";

const navLeft = [
  { href: "/about",    label: "À Propos",    key: "about" },
  { href: "/services", label: "Services",    key: "services" },
  { href: "/projects", label: "Réalisations", key: "projects" },
  { href: "/blog",     label: "Blog",         key: "blog" },
];

const menuLinks = [
  { href: "/",         label: "Accueil",      key: "index" },
  { href: "/services", label: "Services",     key: "services" },
  { href: "/projects", label: "Réalisations", key: "projects" },
  { href: "/", label: "Secteurs d'activités", key: "secteurs" },
  { href: "/blog",     label: "Blog",         key: "blog" },
  { href: "/contact",  label: "Carrière",      key: "contact" },
  { href: "/notre-groupe",  label: "Notre Groupe",      key: "notre-groupe" },
];

const socials = [
  { icon: Linkedin,  href: "#", label: "LinkedIn" },
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Youtube,   href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /* Scroll direction tracking → show/hide navbar (clone pattern) */
  useEffect(() => {
    let lastY = 0;
    const threshold = 60;
    const handler = () => {
      const y = window.scrollY;
      const direction = y > lastY ? "down" : "up";
      const started = y > threshold;
      document.body.setAttribute("data-scrolling-direction", direction);
      document.body.setAttribute("data-scrolling-started", started ? "true" : "false");
      lastY = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen]);

  function isActive(key: string) {
    const p = pathname ?? "/";
    if (key === "index") return p === "/" || p === "";
    return p.includes(`/${key}`);
  }

  const menuVariants = {
    hidden: { opacity: 0, visibility: "hidden" as const },
    visible: {
      opacity: 1,
      visibility: "visible" as const,
      transition: { duration: 0.5, ease: [0.6, 0.08, 0.02, 0.99] as [number,number,number,number] },
    },
    exit: {
      opacity: 0,
      visibility: "hidden" as const,
      transition: { duration: 0.35 },
    },
  };

  const linkVariants = {
    hidden:  { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { delay: i * 0.07 + 0.2, duration: 0.6, ease: [0.6, 0.08, 0.02, 0.99] as [number,number,number,number] },
    }),
  };

  return (
    <>
      {/* ══ NAVBAR ══ */}
      <nav className="navbar">
        <div className="navbar-flex">

          {/* LEFT: nav links (desktop) */}
          <ul className="navbar-navigation hidden md:flex">
            {navLeft.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={`navbar-navigation__link ${isActive(link.key) ? "--is-active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CENTER: Logo */}
          <Link href="/" className="justify-self-center flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex flex-col items-center gap-0"
            >
              <span
                className="font-black uppercase leading-none text-white"
                style={{ fontSize: "1.6rem", letterSpacing: "0.25em" }}
              >
                ACT
              </span>
              <span
                className="text-[#D35400] uppercase leading-none"
                style={{ fontSize: "0.85rem", letterSpacing: "0.3em" }}
              >
                Africa Centred Technology
              </span>
            </motion.div>
          </Link>

          {/* RIGHT: Hamburger */}
          <button
            className="navbar-hamburger justify-self-end"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              className="navbar-hamburger__line navbar-hamburger__line-top"
              animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.35, ease: [0.6, 0.08, 0.02, 0.99] }}
            />
            <motion.span
              className="navbar-hamburger__line navbar-hamburger__line-bottom"
              animate={menuOpen ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.35, ease: [0.6, 0.08, 0.02, 0.99] }}
            />
          </button>
        </div>
      </nav>

      {/* ══ FULLSCREEN MENU OVERLAY ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[150]"
          >
            <div className="menu-inner h-full">
              {/* Left: image */}
              <div className="menu-image hidden md:block">
                <motion.div
                  className="w-full h-full relative"
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.6, 0.08, 0.02, 0.99] }}
                >
                  {/* Gradient overlay on image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, transparent, rgba(10,20,16,0.3))",
                      zIndex: 1,
                    }}
                  />
                  {/* Menu background image */}
                  <Image
                    src="https://media.licdn.com/dms/image/v2/C4D1BAQEm9aYTIqZhMg/company-background_10000/company-background_10000/0/1634310266750/technopark_maroc_cover?e=2147483647&v=beta&t=7gJ75iWSzYjgG-EDcHkkj7zg0XwRleXjG4qbBe7Tjxs"
                    alt=""
                    fill
                    unoptimized
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                  {/* Diamond decorative */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, duration: 0.8, ease: [0.6, 0.08, 0.02, 0.99] }}
                      className="flex flex-col items-center gap-6 text-white/20 text-center"
                    >
                      <span className="diamond" style={{ width: "4rem", height: "4rem" }} />
                      <p
                        className="font-black uppercase tracking-widest"
                        style={{ fontSize: "var(--font-20)", letterSpacing: "0.4em" }}
                      >
                        Africa Centred<br />Technology
                      </p>
                      <span className="diamond diamond--gold" style={{ width: "2rem", height: "2rem" }} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right: navigation */}
              <div
                className="flex flex-col justify-between overflow-y-auto"
                style={{
                  background: "#0A1410",
                  padding: "7rem 5rem 4rem",
                }}
              >
                {/* Tag */}
                <motion.div
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <span className="diamond diamond--sm" />
                  <span
                    className="text-white/40 uppercase tracking-[0.3em]"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Menu
                  </span>
                </motion.div>

                {/* Nav links */}
                <nav className="flex-1">
                  <ul className="space-y-1">
                    {menuLinks.map((link, i) => (
                      <motion.li
                        key={link.key}
                        custom={i}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`block font-black uppercase leading-tight transition-colors hover:text-white ${
                            isActive(link.key) ? "text-white" : "text-white/25"
                          }`}
                          style={{ fontSize: "var(--font-40)" }}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Bottom: socials + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 space-y-6"
                >
                  <div>
                    <p
                      className="text-white/40 uppercase tracking-[0.2em] mb-3"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Réseaux Sociaux
                    </p>
                    <div className="flex items-center gap-4">
                      {socials.map(({ icon: Icon, href, label }) => (
                        <motion.a
                          key={label}
                          href={href}
                          aria-label={label}
                          whileHover={{ scale: 1.15, color: "#D35400" }}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Icon size={18} />
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  <CTAButton href="/contact" onClick={() => setMenuOpen(false)}>
                    Un projet en tête ?
                  </CTAButton>

                  <div className="flex flex-col gap-1" style={{ fontSize: "1.1rem" }}>
                    <a
                      href="mailto:contact@act.africa"
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      contact@act.africa
                    </a>
                    <a
                      href="tel:+212694528498"
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      +212 694-528498
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
