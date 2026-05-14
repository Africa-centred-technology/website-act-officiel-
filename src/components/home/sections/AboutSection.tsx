"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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

export default function AboutSection() {
    const t = useTranslations("home.about");
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
                    alignItems: "stretch",
                }}>

                    {/* ── COLONNE GAUCHE — Identité ── */}
                    <div style={{ alignSelf: "start", marginTop: "clamp(-4rem, -6vw, -2rem)" }}>
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
                                {t("eyebrow")}
                            </span>
                        </motion.div>

                        {/* Titre — échelle h2 unifiée */}
                        <motion.h2
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.15, ease: [...EASE] }}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 900,
                                fontSize: screenSize === 'mobile'?"clamp(1.8rem, 8vw, 3rem)":screenSize === 'tablet' ? "clamp(2.2rem, 6vw, 4rem)" : "clamp(3.5rem, 7vw, 9rem)",
                                lineHeight: 1.1,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase",
                                color: "#fff",
                                marginBottom: "clamp(1rem, 2vw, 1.8rem)",
                                textAlign: "left",
                            }}
                        >
                            {t("title1")}<br />
                            <span style={{ color: "#D35400" }}>{t("title2")}</span><br />
                            {t("title3")}
                        </motion.h2>

                        {/* CTA - Desktop uniquement */}

                    </div>

                    {/* ── COLONNE DROITE — Genèse + Vision ── */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        gap: "clamp(1.5rem, 3vw, 3rem)",
                    }}>
                        {/* Genèse */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.30, ease: [...EASE] }}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: screenSize === 'mobile' ? "clamp(0.9rem, 3.5vw, 1.1rem)" : screenSize === 'tablet' ? "clamp(1rem, 2.5vw, 1.3rem)" : "clamp(1.15rem, 1.5vw, 1.5rem)",
                                lineHeight: 1.85,
                                letterSpacing: "0.01em",
                                color: "#ffffff",
                                width: "100%",
                                maxWidth: "100%",
                                marginBottom: 0,
                                textAlign: "justify",
                                textJustify: "inter-word",
                                hyphens: "auto",
                            }}
                        >
                            {t.rich("intro", { strong: (chunks) => <strong style={{ color: "#fff" }}>{chunks}</strong> })}
                        </motion.p>

                        {/* Vision tag — placée en bas de la colonne droite */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: [...EASE] }}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "1rem",
                                marginTop: "auto",
                                paddingTop: "clamp(3rem, 10vw, 8rem)",
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
                                {t("vision")}
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
