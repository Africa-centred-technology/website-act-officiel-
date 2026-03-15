"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

const EASE = [0.04, 0.72, 0.08, 1.0] as const;

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
    { n: "4", label: "Collaborateurs" },
    { n: "5+", label: "Domaines" },
    { n: "∞", label: "Ambition" },
];

export default function RoomQuiSommesNous() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const midX = useSpring(mx, { stiffness: 55, damping: 22 });
    const midY = useSpring(my, { stiffness: 55, damping: 22 });

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
                {/* ── Layout deux colonnes ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "clamp(2rem, 5vw, 6rem)",
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
                                fontSize: "1.1rem",
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
                                fontSize: "clamp(3.5rem, 7vw, 9rem)",
                                lineHeight: 1.0,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase",
                                color: "#fff",
                                marginBottom: "clamp(1rem, 2vw, 1.8rem)",
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
                                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                                lineHeight: 1.6,
                                color: "#ffffff",
                                maxWidth: "48rem",
                                marginBottom: "clamp(1.2rem, 2.5vw, 2rem)",
                            }}
                        >
                            Chez ACT, nous sommes animés par une <strong style={{ color: "#fff" }}>raison d'être commune</strong> : libérer l'énergie humaine et technologique.
                            Née en <strong style={{ color: "#fff" }}>2026</strong> de la vision de{" "}
                            <strong style={{ color: "#fff" }}>Sohaib Baroud</strong>, nous allions une approche profondément humaine à la puissance de l'Intelligence Artificielle.
                            Notre objectif : créer un <strong style={{ color: "#fff" }}>impact concret et durable</strong> pour transformer nos sociétés — et bâtir ensemble un{" "}
                            <strong style={{ color: "#D35400" }}>écosystème numérique</strong>.
                        </motion.p>

                        {/* Stats bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45, ease: [...EASE] }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                borderTop: "1px solid rgba(255,255,255,0.1)",
                                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                            }}
                        >
                            {STATS.map((s, i) => (
                                <div key={i} style={{
                                    padding: "1rem 0",
                                    borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                    paddingRight: "1rem",
                                    paddingLeft: i > 0 ? "1rem" : 0,
                                }}>
                                    <div style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)",
                                        fontWeight: 900,
                                        color: "#D35400",
                                        lineHeight: 1,
                                        marginBottom: "0.3rem",
                                    }}>{s.n}</div>
                                    <div style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1rem",
                                        letterSpacing: "0.2em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.5)",
                                    }}>{s.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.60, ease: [...EASE] }}
                        >
                            <Link
                                href="/about"
                                className="cta-btn"
                                style={{ textDecoration: "none" }}
                            >
                                <span className="cta-btn__border" aria-hidden />
                                <span className="cta-btn__blur" aria-hidden />
                                <span className="cta-btn__background" aria-hidden />
                                <span className="cta-btn__inner">
                                    <span className="cta-btn__icon" aria-hidden />
                                    <span className="cta-btn__text">Notre histoire</span>
                                </span>
                            </Link>
                        </motion.div>
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
                                fontSize: "1.05rem",
                                letterSpacing: "0.30em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.4)",
                            }}>
                                Nos valeurs fondamentales
                            </span>
                        </motion.div>

                        {/* Grille valeurs */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {VALEURS.map((v, i) => (
                                <motion.div
                                    key={v.titre}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.65, delay: 0.25 + i * 0.10, ease: [...EASE] }}
                                    style={{
                                        display: "flex",
                                        gap: "1.2rem",
                                        alignItems: "flex-start",
                                        padding: "1.1rem 0",
                                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    {/* Icône */}
                                    <span style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.3rem",
                                        color: "#D35400",
                                        flexShrink: 0,
                                        marginTop: "0.1rem",
                                        lineHeight: 1,
                                    }}>{v.icon}</span>

                                    {/* Contenu */}
                                    <div>
                                        <div style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "clamp(1.4rem, 1.8vw, 1.8rem)",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                            color: "#fff",
                                            marginBottom: "0.45rem",
                                        }}>{v.titre}</div>
                                        <div style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
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
                                fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)",
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.55)",
                                fontStyle: "italic",
                            }}>
                                « Contribuer à l'émergence d'un écosystème technologique fort,
                                innovant et autonome — où l'Afrique devient productrice,
                                et non uniquement consommatrice de technologies. »
                            </p>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
