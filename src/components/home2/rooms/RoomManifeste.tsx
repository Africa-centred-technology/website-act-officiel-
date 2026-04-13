"use client";

/**
 * Room 04 — LE MANIFESTE
 * Word-by-word staggered reveal (time-based, not scroll-based)
 * since the room fills the full viewport with no scrolling.
 */

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const ease3D = [0.6, 0.08, 0.02, 0.99] as const;

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
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

const MANIFESTO =
  "La technologie n'a de valeur que lorsqu'elle crée un impact réel. Nous ne nous contentons pas d'implémenter des technologies. Nous concevons des solutions qui créent de la valeur durable pour les organisations. En combinant intelligence artificielle, analyse de données et automatisation, nous aidons les entreprises à transformer leurs défis en opportunités et à construire les systèmes qui soutiendront leur croissance de demain.";

const words = MANIFESTO.split(/\s+/).filter(Boolean);

/* ── Curseur clignotant — apparaît après la fin de la saisie ─────── */
function BlinkCursor({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      style={{
        display: "inline-block",
        width: "3px",
        height: "0.82em",
        background: "#D35400",
        marginLeft: "0.15em",
        verticalAlign: "middle",
        borderRadius: 1,
        flexShrink: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{
        delay,
        duration: 1.05,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.04, 0.06, 0.5, 0.52, 1],
      }}
    />
  );
}

/**
 * Each word materialises from an inclined plane:
 * orange → white color, scale 0.88 → 1, rotateX 10 → 0° (depth fold).
 * Creates the sensation of words rising from a reclined surface.
 */
function Word({ word, index, total }: { word: string; index: number; total: number }) {
  const delay = 0.28 + index * (1.55 / total);
  return (
    <motion.span
      className="inline-block"
      style={{ transformOrigin: "50% 100%", marginRight: "0.28em", marginBottom: "0.16em" }}
      initial={{ opacity: 0.05, color: "#D35400bb", scale: 0.86, rotateX: 12, y: 8 }}
      animate={{ opacity: 1, color: "#ffffff", scale: 1, rotateX: 0, y: 0 }}
      transition={{ delay, duration: 0.62, ease: "easeOut" }}
    >
      {word}
    </motion.span>
  );
}

export default function RoomManifeste() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const screenSize = useMediaQuery();

  /* 3-layer parallax */
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
        paddingBottom: screenSize === 'mobile' ? "2rem" : screenSize === 'tablet' ? "3rem" : "4rem",
        paddingTop: screenSize === 'mobile' ? "2rem" : screenSize === 'tablet' ? "3rem" : "4rem",
        justifyContent: screenSize === 'desktop' ? 'center' : 'flex-start'
      }}
    >


      {/* ── Section Decoration (Background) ── */}
      <motion.div
        aria-hidden
        className="absolute top-1/4 -right-20 w-96 h-96 bg-[#D35400]/5 blur-[120px] rounded-full"
        style={{ x: bgX, y: bgY }}
      />

      {/* ── Header adaptatif selon la taille d'écran ── */}
      <motion.div
        className="flex items-center gap-6"
        style={{
          x: midX,
          y: midY,
          flexDirection: screenSize === 'desktop' ? 'row' : 'column',
          alignItems: screenSize === 'desktop' ? 'center' : 'flex-start',
          gap: screenSize === 'desktop' ? '1.5rem' : '0.5rem',
          marginBottom: screenSize === 'mobile' ? '4rem' : screenSize === 'tablet' ? '2.5rem' : '3rem',
        }}
      >
        {/* Left: eyebrow + "04" */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            className="flex items-center gap-3"
            style={{
              marginBottom: screenSize === 'desktop' ? '0.75rem' : '0.5rem'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="diamond diamond--sm" />
            <span className="text-white/55 uppercase tracking-[0.3em]" style={{
              fontSize: screenSize === 'mobile' ? "0.75rem" : screenSize === 'tablet' ? "0.85rem" : "1.15rem",
              fontFamily: "var(--font-display)"
            }}>
              Notre Manifeste
            </span>
          </motion.div>
        </div>

        {/* Séparateur vertical (Desktop seulement) */}
        {screenSize === 'desktop' && (
          <motion.div
            style={{ width: 1, alignSelf: "stretch", background: "rgba(211,84,0,0.3)", flexShrink: 0, originY: 0.5 }}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.18 }}
          />
        )}

        {/* Right: "LE MANIFESTE" — 3D depth rotateX par mot */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: screenSize === 'desktop' ? "flex-end" : "flex-start"
        }}>
          {(["LE", "MANIFESTE"] as const).map((word, wi) => (
            <motion.span
              key={wi}
              className="font-black uppercase block"
              style={{
                fontSize: wi === 0
                  ? (screenSize === 'mobile' ? "clamp(1.2rem, 5vw, 2rem)" : screenSize === 'tablet' ? "clamp(1.5rem, 4vw, 3rem)" : "clamp(1.5rem, 3vw, 4rem)")
                  : (screenSize === 'mobile' ? "clamp(2.5rem, 12vw, 4rem)" : screenSize === 'tablet' ? "clamp(3rem, 10vw, 6rem)" : "clamp(3rem, 7vw, 9rem)"),
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: wi === 0 ? "rgba(255,255,255,0.4)" : "#ffffff",
                transformOrigin: "50% 100%",
                fontFamily: "var(--font-display)",
                marginBottom: wi === 0 ? (screenSize === 'mobile' ? "0.7rem" : "0.3rem") : 0,
              }}
              initial={{ opacity: 0, scale: 0.82, rotateX: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 + wi * 0.18, ease: ease3D }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Main Content : Text + Image Side by Side ── */}
      <div style={{
        display: 'flex',
        gap: screenSize === 'desktop' ? '4rem' : '3rem',
        alignItems: screenSize === 'desktop' ? 'center' : 'flex-start',
        flexDirection: screenSize === 'desktop' ? 'row' : 'column',
        width: '100%',
      }}>
        {/* Left Side: Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Word-by-word reveal — mid layer */}
          <motion.div style={{ maxWidth: "65rem", x: midX, perspective: "1100px" }}>
            <p
              className="font-bold uppercase"
              style={{
                fontSize: screenSize === 'mobile' ? "12px" : screenSize === 'tablet' ? "clamp(1.2rem, 3vw, 1.8rem)" : "clamp(1.2rem, 2vw, 2.4rem)",
                lineHeight: 1.45,
                letterSpacing: "0.01em",
                fontFamily: "var(--font-display)"
              }}
            >
              {words.map((w, i) => (
                <Word key={i} word={w} index={i} total={words.length} />
              ))}
              <BlinkCursor delay={0.28 + (words.length - 1) * (1.55 / words.length) + 0.65} />
            </p>
          </motion.div>

        </div>

        {/* Right Side: Manifeste Image */}
        <motion.div
          style={{
            width: screenSize === 'desktop' ? '450px' : '100%',
            flexShrink: 0,
            position: "relative",
            left: screenSize === 'desktop' ? "-40px" : "0",
          }}
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: ease3D }}
        >
          <div className="relative group">
            {/* Soft Glow */}
            <div className="absolute -inset-10 bg-[#D35400]/10 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

            <img
              src="/images/Manifeste.png"
              alt="Notre Manifeste"
              className="relative w-full grayscale-[15%] hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-[1.02] object-cover"
              style={{
                height: screenSize === 'desktop' ? '500px' : 'auto',
                objectPosition: 'top',
                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8)",
                borderRadius: screenSize === 'mobile' ? '1rem' : screenSize === 'tablet' ? '1.5rem' : '1.5rem',
              }}
            />

            <motion.div
              className="absolute left-0 right-0 bottom-0 flex items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + words.length * (1.6 / words.length) + 0.4, duration: 0.7 }}
              style={{
                x: fgX,
                padding: screenSize === 'mobile' ? '1.25rem' : screenSize === 'tablet' ? '1.5rem' : '1.8rem',
                flexWrap: 'wrap',
                borderBottomLeftRadius: screenSize === 'mobile' ? '1rem' : '1.5rem',
                borderBottomRightRadius: screenSize === 'mobile' ? '1rem' : '1.5rem',
                background: "linear-gradient(to top, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.48) 55%, transparent 100%)",
              }}
            >
              <div style={{ width: screenSize === 'mobile' ? 28 : 40, height: 2, background: "#D35400", flexShrink: 0 }} />
              <span
                className="text-white/85 uppercase font-medium"
                style={{
                  fontSize: screenSize === 'mobile' ? "0.75rem" : screenSize === 'tablet' ? "0.9rem" : "1rem",
                  letterSpacing: "0.18em",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.4,
                }}
              >
                SOHIAB BAROUD — Fondateur &amp; CEO, ACT
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
