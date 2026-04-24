"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

const EASE = [0.04, 0.72, 0.08, 1.0] as const;

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1280) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

const VALEURS = [
    {
        icon: "◈",
        titre: "Collaboration",
        desc: "Les meilleures solutions naissent de l'intelligence collective et du partage de compétences.",
    },
    {
        icon: "◉",
        titre: "Transmission",
        desc: "Nous formons, accompagnons et développons les talents technologiques africains.",
    },
    {
        icon: "◆",
        titre: "Excellence",
        desc: "Des standards élevés de qualité, de fiabilité et de rigueur dans chaque projet.",
    },
    {
        icon: "◇",
        titre: "Innovation utile",
        desc: "Une innovation ancrée dans les réalités africaines, qui répond à des besoins concrets.",
    },
];

const STATS = [
    { n: "2026", label: "Fondée" },
    { n: "8", label: "Collaborateurs" },
    { n: "5+", label: "Domaines" },
    { n: "∞", label: "Ambition" },
];

export default function RoomQuiSommesNous() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const midX = useSpring(mx, { stiffness: 55, damping: 22 });
    const midY = useSpring(my, { stiffness: 55, damping: 22 });
    const screenSize = useMediaQuery();

    const onMouseMove = (e: React.MouseEvent) => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    return (
        <div
            onMouseMove={onMouseMove}
            className="relative overflow-hidden room-pad"
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}
        >

            <motion.div
                style={{ x: midX, y: midY, zIndex: 2, width: "100%" }}
                className="relative"
            >
                {/* ── Layout adaptatif selon la taille d'écran ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: screenSize === 'desktop' ? "1fr 1fr" : "1fr",
                    gap: screenSize === 'mobile' ? "3rem" : "clamp(2rem, 5vw, 6rem)",
                    alignItems: "start",
                }}>

                    {/* ── COLONNE GAUCHE — Identité ── */}
                    <div>
                        {/* Eyebrow */}
                        <motion.div
                            className="flex items-center gap-3 mb-5"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.05, ease: [...EASE] }}
                        >
                            <span className="diamond diamond--sm" />
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: screenSize === 'mobile' ? "0.8rem" : screenSize === 'tablet' ? "0.95rem" : "1.1rem",
                                letterSpacing: "0.32em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.28)",
                            }}>
                                Qui sommes-nous
                            </span>
                        </motion.div>

                        {/* Titre */}
                        <motion.h2
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.15, ease: [...EASE] }}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 900,
                                fontSize: screenSize === 'mobile' ? "clamp(1.8rem, 8vw, 3rem)" : screenSize === 'tablet' ? "clamp(2.2rem, 6vw, 4rem)" : "clamp(3.5rem, 7vw, 9rem)",
                                lineHeight: 1.0,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase",
                                color: "#fff",
                                marginBottom: "clamp(1rem, 2vw, 1.8rem)",
                                textAlign: "left",
                            }}
                        >
                            AFRICA<br />
                            <span style={{ color: "#D35400" }}>CENTRED</span><br />
                            TECHNOLOGY
                        </motion.h2>

                        {/* Genèse */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.30, ease: [...EASE] }}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: screenSize === 'mobile' ? "clamp(0.9rem, 3.5vw, 1.1rem)" : screenSize === 'tablet' ? "clamp(1rem, 2.5vw, 1.3rem)" : "clamp(1.35rem, 2vw, 1.75rem)",
                                lineHeight: 1.6,
                                color: "#ffffff",
                                maxWidth: "48rem",
                                marginBottom: "clamp(1.2rem, 2.5vw, 2rem)",
                                textAlign: "left",
                            }}
                        >
                            Nous sommes une startup guidée par une <strong style={{ color: "#fff" }}>raison d’être commune</strong> : libérer l'énergie humaine et technologique.
                            Une approche profondément humaine y est cultivée{" "}
                            ,renforcée par la puissance de l’Intelligence Artificielle.
                            L’ambition est de générer un impact concret et durable, afin de transformer les sociétés et de contribuer à la construction d’un écosystème numérique collaboratif.
                        </motion.p>

                        {/* Stats bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45, ease: [...EASE] }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: screenSize === 'desktop' ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
                                gap: screenSize === 'desktop' ? "0" : "1rem",
                                borderTop: screenSize === 'desktop' ? "1px solid rgba(255,255,255,0.1)" : "none",
                                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                            }}
                        >
                            {STATS.map((s, i) => (
                                <div key={i} style={{
                                    paddingTop: screenSize === 'desktop' ? "1rem" : "1.5rem",
                                    paddingBottom: screenSize === 'desktop' ? "1rem" : "1.5rem",
                                    paddingRight: screenSize === 'desktop' ? "1rem" : "1.5rem",
                                    paddingLeft: screenSize === 'desktop' ? (i > 0 ? "1rem" : "0") : "1.5rem",
                                    borderRight: screenSize === 'desktop' && i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                    border: screenSize !== 'desktop' ? "1px solid rgba(255,255,255,0.1)" : "none",
                                    borderRadius: screenSize !== 'desktop' ? "0.5rem" : "0",
                                    backgroundColor: screenSize !== 'desktop' ? "rgba(255,255,255,0.02)" : "transparent",
                                    textAlign: "left",
                                }}>
                                    <div style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: screenSize === 'mobile' ? "clamp(1.5rem, 5vw, 2.2rem)" : screenSize === 'tablet' ? "clamp(1.8rem, 4vw, 2.8rem)" : "clamp(2.2rem, 3.5vw, 3.5rem)",
                                        fontWeight: 900,
                                        color: "#D35400",
                                        lineHeight: 1,
                                        marginBottom: "0.3rem",
                                    }}>{s.n}</div>
                                    <div style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: screenSize === 'mobile' ? "0.7rem" : screenSize === 'tablet' ? "0.8rem" : "1rem",
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.5)",
                                    }}>{s.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA - Desktop uniquement */}
                       
                    </div>

                    {/* ── COLONNE DROITE — Valeurs ── */}
                    <div>
                        {/* Eyebrow valeurs */}
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.20, ease: [...EASE] }}
                        >
                            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                            <span style={{
                                fontFamily: "var(--font-display)",
                                fontSize: screenSize === 'mobile' ? "0.8rem" : screenSize === 'tablet' ? "0.9rem" : "1.05rem",
                                letterSpacing: "0.30em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.4)",
                            }}>
                                Nos valeurs fondamentales
                            </span>
                        </motion.div>

                        {/* Grille valeurs */}
                        <div style={{
                            display: screenSize === 'tablet' ? "grid" : "flex",
                            gridTemplateColumns: screenSize === 'tablet' ? "repeat(2, 1fr)" : undefined,
                            flexDirection: screenSize !== 'tablet' ? "column" : undefined,
                            gap: screenSize === 'tablet' ? "1rem" : "0"
                        }}>
                            {VALEURS.map((v, i) => (
                                <motion.div
                                    key={v.titre}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.65, delay: 0.25 + i * 0.10, ease: [...EASE] }}
                                    style={{
                                        display: "flex",
                                        gap: screenSize === 'mobile' ? "1rem" : "1.2rem",
                                        alignItems: "flex-start",
                                        padding: screenSize === 'tablet' ? "1.5rem" : screenSize === 'mobile' ? "1rem 0" : "1.1rem 0",
                                        borderBottom: screenSize !== 'tablet' ? "1px solid rgba(255,255,255,0.08)" : "none",
                                        border: screenSize === 'tablet' ? "1px solid rgba(255,255,255,0.08)" : "none",
                                        borderRadius: screenSize === 'tablet' ? "0.5rem" : "0",
                                        backgroundColor: screenSize === 'tablet' ? "rgba(255,255,255,0.02)" : "transparent",
                                    }}
                                >
                                    {/* Icône */}
                                    <span style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: screenSize === 'mobile' ? "0.95rem" : screenSize === 'tablet' ? "1.1rem" : "1.3rem",
                                        color: "#D35400",
                                        flexShrink: 0,
                                        marginTop: "0.1rem",
                                        lineHeight: 1,
                                    }}>{v.icon}</span>

                                    {/* Contenu */}
                                    <div>
                                        <div style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: screenSize === 'mobile' ? "clamp(0.95rem, 3.5vw, 1.2rem)" : screenSize === 'tablet' ? "clamp(1.1rem, 2.5vw, 1.4rem)" : "clamp(1.4rem, 1.8vw, 1.8rem)",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                            color: "#fff",
                                            marginBottom: "0.45rem",
                                        }}>{v.titre}</div>
                                        <div style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: screenSize === 'mobile' ? "clamp(0.85rem, 3vw, 1rem)" : screenSize === 'tablet' ? "clamp(0.95rem, 2vw, 1.15rem)" : "clamp(1.2rem, 1.5vw, 1.5rem)",
                                            lineHeight: 1.6,
                                            color: "#ffffff",
                                        }}>{v.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Vision tag */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.75 }}
                            style={{
                                marginTop: "1.5rem",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "1rem",
                            }}
                        >
                            <div style={{ width: 2, alignSelf: "stretch", background: "linear-gradient(to bottom, #D35400, transparent)", flexShrink: 0 }} />
                            <p style={{
                                fontFamily: "var(--font-body)",
                                fontSize: screenSize === 'mobile' ? "clamp(0.85rem, 3vw, 1rem)" : screenSize === 'tablet' ? "clamp(0.95rem, 2vw, 1.15rem)" : "clamp(1.2rem, 1.5vw, 1.5rem)",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.55)",
                                fontStyle: "italic",
                                textAlign: "left",
                            }}>
                                « Contribuer à l'émergence d'un écosystème technologique fort,
                                innovant et autonome — où l'Afrique devient productrice,
                                et non uniquement consommatrice de technologies. »
                            </p>
                        </motion.div>
                    </div>

                </div>

                {/* CTA - Mobile et Tablette uniquement (en bas) */}
                {screenSize !== 'desktop' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.60, ease: [...EASE] }}
                        style={{
                            marginTop: "3rem",
                            display: "flex",
                            justifyContent: "center" // Centré sur mobile et tablette
                        }}
                    >
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
