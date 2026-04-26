"use client";

/**
 * Room 04 — LE MANIFESTE (édition magazine)
 * Layout éditorial : grand guillemet décoratif + pull-quote en exergue,
 * portrait fondateur dans un cadre cinématographique avec signature
 * et data-points (année / lieu / fondateur).
 */

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ease3D = [0.6, 0.08, 0.02, 0.99] as const;
const ORANGE = "#D35400";

function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setScreenSize(w < 768 ? "mobile" : w < 1280 ? "tablet" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return screenSize;
}

const PULL_QUOTE =
  "La technologie n'a de valeur que lorsqu'elle crée un impact réel.";

const BODY_PARAGRAPHS = [
  "Nous ne nous contentons pas d'implémenter des technologies — nous concevons des solutions qui créent de la valeur durable pour les organisations.",
  "En combinant intelligence artificielle, analyse de données et automatisation, nous transformons les défis de nos clients en opportunités et bâtissons les systèmes qui soutiendront leur croissance de demain.",
];

export default function ManifesteSection() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const screenSize = useMediaQuery();
  const isDesktop = screenSize === "desktop";

  const bgX = useSpring(mx, { stiffness: 28, damping: 18 });
  const bgY = useSpring(my, { stiffness: 28, damping: 18 });
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });
  const fgX = useSpring(mx, { stiffness: 110, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative flex flex-col overflow-hidden room-pad"
      style={{
        width: "100%",
        height: "100%",
        paddingTop: isDesktop ? "5rem" : "3rem",
        paddingBottom: isDesktop ? "6rem" : "3rem",
        justifyContent: "center",
      }}
    >
      {/* ── Halo orange diffus (background) ── */}
      <motion.div
        aria-hidden
        className="absolute -top-20 -right-32 w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ORANGE}1A 0%, transparent 65%)`,
          filter: "blur(80px)",
          x: bgX,
          y: bgY,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-20 w-[30rem] h-[30rem] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,140,40,0.08) 0%, transparent 65%)`,
          filter: "blur(90px)",
          x: bgX,
          y: bgY,
        }}
      />

      {/* ── Header éditorial (eyebrow + titre) ── */}
      <motion.div
        style={{
          x: midX,
          y: midY,
          maxWidth: "1400px",
          width: "100%",
          marginTop: 0,
          marginRight: "auto",
          marginBottom: isDesktop ? "3.5rem" : "2.5rem",
          marginLeft: "auto",
          paddingBottom: isDesktop ? "3.5rem" : "2.5rem",
        }}
      >


        {/* Titre principal */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: ease3D }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 5vw, 5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
            }}
          >
            Le <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.65)" }}>manifeste</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              textAlign: "right",
              lineHeight: 1.6,
            }}
          >
            <div style={{ color: "#fff" }}>Notre conviction</div>
            <div>Casablanca · Maroc · 2026</div>
          </motion.div>
        </div>

        {/* Filet décoratif */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: ease3D }}
          style={{
            height: 1,
            marginTop: "2rem",
            background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE}55, transparent)`,
            transformOrigin: "left",
          }}
        />
      </motion.div>

      {/* ── Body magazine : pull-quote + paragraphes / portrait ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.4fr 1fr" : "1fr",
          gap: isDesktop ? "5rem" : "3rem",
          alignItems: "center",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ── Colonne gauche : Quote + body ── */}
        <motion.div style={{ x: midX, position: "relative" }}>
          {/* Grand guillemet décoratif */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
            animate={{ opacity: 0.18, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: ease3D }}
            style={{
              position: "absolute",
              top: isDesktop ? "-3rem" : "-1.5rem",
              left: isDesktop ? "-1rem" : "-0.5rem",
              fontFamily: "var(--font-display)",
              fontSize: isDesktop ? "16rem" : "9rem",
              lineHeight: 0.8,
              color: ORANGE,
              fontWeight: 900,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            “
          </motion.span>

          {/* Pull quote — phrase signature */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.45, ease: ease3D }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: isDesktop ? "clamp(1.8rem, 2.6vw, 3rem)" : "clamp(1.4rem, 5vw, 2rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
              marginBottom: "2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {PULL_QUOTE.split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.04 }}
                style={{ display: "inline-block", marginRight: "0.28em" }}
              >
                {w === "réel." ? (
                  <span style={{ color: ORANGE }}>{w}</span>
                ) : (
                  w
                )}
              </motion.span>
            ))}
          </motion.p>

          {/* Filet décoratif sous la quote */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            style={{
              width: "60px",
              height: "2px",
              background: ORANGE,
              transformOrigin: "left",
              marginBottom: "2rem",
            }}
          />

          {/* Paragraphes du manifeste */}
          {BODY_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 + i * 0.18, ease: ease3D }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: isDesktop ? "clamp(1.25rem, 1.5vw, 1.6rem)" : "clamp(1.05rem, 3.5vw, 1.3rem)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.85)",
                marginTop: 0,
                marginRight: 0,
                marginLeft: 0,
                marginBottom: i === BODY_PARAGRAPHS.length - 1 ? 0 : "1.5rem",
                maxWidth: "62ch",
              }}
            >
              {para}
            </motion.p>
          ))}

          {/* Signature manuscrite */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.7 }}
            style={{
              marginTop: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: isDesktop ? "1.6rem" : "1.3rem",
                color: ORANGE,
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              S. Baroud
            </span>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", maxWidth: 120 }} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Fondateur · CEO
            </span>
          </motion.div>
        </motion.div>

        {/* ── Colonne droite : Portrait cinématographique ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease: ease3D }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: isDesktop ? "100%" : "420px",
            margin: isDesktop ? 0 : "0 auto",
          }}
        >
          {/* Cadre orange en background (offset) */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 16, y: 16 }}
            transition={{ duration: 1, delay: 0.9, ease: ease3D }}
            style={{
              position: "absolute",
              inset: 0,
              border: `2px solid ${ORANGE}`,
              borderRadius: "1.25rem",
              transform: "translate(16px, 16px)",
              pointerEvents: "none",
            }}
          />

          {/* Image conteneur */}
          <div
            className="group"
            style={{
              position: "relative",
              borderRadius: "1.25rem",
              overflow: "hidden",
              boxShadow: "0 40px 100px -25px rgba(0,0,0,0.85), 0 0 60px rgba(211,84,0,0.08)",
              aspectRatio: isDesktop ? "4 / 5" : "3 / 4",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <img
              src="/images/Manifeste.png"
              alt="Sohaib Baroud, fondateur d'ACT"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                filter: "grayscale(20%) contrast(1.05)",
                transform: "scale(1.02)",
                transition: "filter 0.7s, transform 0.9s",
              }}
              className="group-hover:grayscale-0 group-hover:scale-105"
            />

            {/* Overlay gradient bas — contenu carte info */}
            <motion.div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: isDesktop ? "1.75rem" : "1.25rem",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, transparent 100%)",
                x: fgX,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: ORANGE,
                      fontWeight: 700,
                      marginBottom: "0.4rem",
                    }}
                  >
                    Le Fondateur
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isDesktop ? "1.4rem" : "1.15rem",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Sohaib Baroud
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    CEO · Africa Centred Technology
                  </div>
                </div>

                {/* Petit badge décoratif */}
                <div
                  aria-hidden
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: `1px solid ${ORANGE}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: "rgba(211,84,0,0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: ORANGE,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    SB
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Coins décoratifs (style cadre photo) */}
            {[
              { top: 14, left: 14, borderTop: 2, borderLeft: 2 },
              { top: 14, right: 14, borderTop: 2, borderRight: 2 },
              { bottom: 14, left: 14, borderBottom: 2, borderLeft: 2 },
              { bottom: 14, right: 14, borderBottom: 2, borderRight: 2 },
            ].map((pos, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  borderColor: ORANGE,
                  borderStyle: "solid",
                  borderWidth: 0,
                  ...(pos as React.CSSProperties),
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
