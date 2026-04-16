"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { POLES } from "@/lib/data/poles";

const ORANGE  = "#D35400";
const ORANGE2 = "#ff8c38";

/* ── Extra metadata par pôle (même ordre que POLES) ── */
const POLE_META = [
  {
    tags: ["Web & Mobile", "Cloud", "IA / Data"],
    stats: [{ val: "120+", label: "Projets" }, { val: "15+", label: "Technologies" }, { val: "99.9%", label: "Uptime" }],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke={ORANGE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    tags: ["Stratégie IT", "Audit", "Transformation"],
    stats: [{ val: "80+", label: "Clients" }, { val: "200+", label: "Missions" }, { val: "3x", label: "ROI moyen" }],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke={ORANGE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    tags: ["E-learning", "Bootcamps", "Certifications"],
    stats: [{ val: "500+", label: "Formés" }, { val: "40+", label: "Programmes" }, { val: "98%", label: "Satisfaction" }],
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" stroke={ORANGE} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
];

/* ── Responsive hook ── */
function useScreenSize() {
  const [size, setSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setSize(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return size;
}

/* ── Panel accordéon ── */
function Panel({
  pole,
  meta,
  isActive,
  onClick,
  isMobile,
}: {
  pole: (typeof POLES)[0];
  meta: (typeof POLE_META)[0];
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const [scanKey, setScanKey] = useState(0);

  const handleClick = () => {
    if (!isActive) setScanKey((k) => k + 1);
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        flex: isMobile ? undefined : isActive ? 4.5 : 1,
        height: isMobile ? (isActive ? "440px" : "100px") : undefined,
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        transition: isMobile
          ? "height 0.7s cubic-bezier(.16,1,.3,1)"
          : "flex 0.7s cubic-bezier(.16,1,.3,1), box-shadow 0.5s",
        minWidth: 0,
        boxShadow: isActive
          ? "0 20px 60px rgba(0,0,0,.5), 0 0 80px rgba(255,106,0,.06)"
          : "none",
      }}
    >
      {/* Image de fond */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={pole.img}
          alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.8s cubic-bezier(.16,1,.3,1), filter 0.6s",
            filter: isActive ? "brightness(.42) saturate(.8)" : "brightness(.3) saturate(.65)",
            transform: isActive ? "scale(1.06)" : "scale(1)",
          }}
        />
      </div>

      {/* Overlay sombre */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: isActive
          ? "linear-gradient(0deg,rgba(6,6,8,.9) 0%,rgba(6,6,8,.35) 40%,rgba(6,6,8,.08) 70%,rgba(6,6,8,.2) 100%), linear-gradient(90deg,rgba(6,6,8,.2),transparent 25%)"
          : "linear-gradient(0deg,rgba(6,6,8,.95) 0%,rgba(6,6,8,.5) 35%,rgba(6,6,8,.15) 60%,rgba(6,6,8,.3) 100%), linear-gradient(90deg,rgba(6,6,8,.4),transparent 40%,transparent 60%,rgba(6,6,8,.4))",
        transition: "all 0.6s cubic-bezier(.16,1,.3,1)",
      }} />

      {/* Teinte orange bas */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        zIndex: 2, pointerEvents: "none",
        background: `linear-gradient(0deg, rgba(255,106,0,.05), transparent)`,
        opacity: isActive ? 1 : 0, transition: "opacity 0.5s 0.1s",
      }} />

      {/* Bordure verre */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "18px",
        zIndex: 4, pointerEvents: "none",
        border: `1px solid ${isActive ? "rgba(255,106,0,.12)" : "rgba(255,255,255,.05)"}`,
        transition: "border-color 0.4s",
      }} />

      {/* Ligne lumineuse en haut */}
      <div style={{
        position: "absolute", top: 0, left: 0, height: "2px", zIndex: 5,
        background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE2}, transparent)`,
        boxShadow: `0 0 10px rgba(255,106,0,.45)`,
        borderRadius: "2px",
        width: isActive ? "100%" : "0%",
        transition: "width 0.7s cubic-bezier(.16,1,.3,1)",
      }} />

      {/* Scan (one-shot à chaque activation) */}
      {isActive && (
        <div
          key={scanKey}
          style={{
            position: "absolute", left: 0, right: 0, height: "1px",
            zIndex: 8, pointerEvents: "none",
            background: `linear-gradient(90deg, transparent, ${ORANGE}, ${ORANGE2}, transparent)`,
            boxShadow: `0 0 12px rgba(255,106,0,.45)`,
            animation: "panelScan 0.8s 0.05s cubic-bezier(.16,1,.3,1) forwards",
          }}
        />
      )}

      {/* Label (vue réduite) */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6,
        padding: "0 28px 28px",
        display: "flex", flexDirection: "column", gap: "10px",
        opacity: isActive ? 0 : 1,
        transform: isActive ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.35s, transform 0.35s cubic-bezier(.16,1,.3,1)",
        pointerEvents: isActive ? "none" : "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "rgba(255,106,0,.06)", border: "1px solid rgba(255,106,0,.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <meta.Icon />
          </div>
          <span style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "3px", color: "rgba(255,106,0,.35)" }}>
            {pole.n}
          </span>
        </div>
        <div style={{ fontSize: "clamp(18px, 2.8vw, 28px)", fontWeight: 700, letterSpacing: "0.5px", color: "rgba(255,255,255,.85)" }}>
          {pole.title}
        </div>
        <Link
          href={pole.href}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "10px", fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase",
            color: "rgba(255,106,0,.45)", textDecoration: "none",
          }}
        >
          Découvrir
          <span style={{ display: "block", width: "16px", height: "1px", background: ORANGE, opacity: 0.3 }} />
        </Link>
      </div>

      {/* Contenu étendu */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              zIndex: 6, padding: "32px 36px",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "4px", color: "rgba(255,106,0,.45)", marginBottom: "4px" }}>
              Pôle {pole.n}
            </div>
            <div style={{ fontSize: "clamp(22px, 2.8vw, 36px)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "6px", color: "#fff" }}>
              {pole.title}
            </div>
            {/* Barre orange animée */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50px" }}
              transition={{ duration: 0.6, delay: 0.33 }}
              style={{
                height: "2px", borderRadius: "1px", marginBottom: "14px",
                background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE2})`,
                boxShadow: `0 0 8px rgba(255,106,0,.45)`,
              }}
            />
            <p style={{
              fontSize: "13px", fontWeight: 300, lineHeight: 1.8,
              color: "rgba(255,255,255,.55)", maxWidth: "400px", marginBottom: "16px",
              fontFamily: "var(--font-body)",
            }}>
              {pole.description}
            </p>
            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "14px" }}>
              {meta.tags.map((tag, ti) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.46 + ti * 0.06 }}
                  style={{
                    fontSize: "10px", fontWeight: 400, letterSpacing: "0.8px",
                    padding: "5px 14px", borderRadius: "100px",
                    background: "rgba(255,255,255,.04)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,106,0,.1)", color: ORANGE,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.58 }}
              style={{
                display: "flex", gap: "20px",
                paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,.06)",
              }}
            >
              {meta.stats.map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontSize: "18px", fontWeight: 700,
                    background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE2})`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: "8px", fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.3)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main ── */
export default function RoomAtelier() {
  const screenSize = useScreenSize();
  const isMobile   = screenSize !== "desktop";

  const [activePanel, setActivePanel] = useState<number | null>(null);

  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const midX = useSpring(mx, { stiffness: 62, damping: 22 });
  const midY = useSpring(my, { stiffness: 62, damping: 22 });

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth  - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  };

  const handlePanel = (i: number) =>
    setActivePanel((prev) => (prev === i ? null : i));

  return (
    <div
      onMouseMove={onMouseMove}
      className="relative flex flex-col overflow-hidden room-pad"
      style={{ width: "100%", height: "100%" }}
    >
      {/* ── Header — gardé identique à l'original ── */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
        style={{ x: midX, y: midY, fontFamily: "var(--font-display)" }}
      >
        <div style={{ flexShrink: 0, paddingBottom: isMobile ? "0.5rem" : "1rem" }}>
          <motion.div
            className="flex items-center gap-3 mb-2"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            <span className="diamond diamond--sm" />
            <span style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: screenSize === "mobile" ? "0.65rem" : screenSize === "tablet" ? "0.75rem" : "0.85rem",
              letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500,
            }}>
              Audit & Ingénierie
            </span>
          </motion.div>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: screenSize === "desktop" ? "flex-end" : "flex-start",
          alignItems: "baseline", flex: 1,
          textAlign: screenSize === "desktop" ? "right" : "left", gap: "0.1em",
        }}>
          {"Ce que nous proposons".split("").map((ch, ci) => (
            <motion.span
              key={ci}
              className="font-black uppercase"
              style={{
                display: "inline-block",
                fontSize: screenSize === "mobile" ? "clamp(1.5rem,6vw,2.5rem)" : screenSize === "tablet" ? "clamp(2rem,5vw,3.5rem)" : "clamp(2rem,4.5vw,5.5rem)",
                lineHeight: 0.9,
                color: ci >= 12 ? ORANGE : "#ffffff",
                letterSpacing: "-0.04em",
              }}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.45, delay: 0.15 + ci * 0.015, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Règle orange */}
      <motion.div
        style={{ height: 1, background: "rgba(211,84,0,0.45)", originX: 0.5, marginBottom: "1.2rem" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.78, duration: 1.0, ease: [0.6, 0.08, 0.02, 0.99] }}
      />

      {/* ── Panels accordéon ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "8px",
        minHeight: 0,
      }}>
        {POLES.map((pole, i) => (
          <Panel
            key={pole.id}
            pole={pole}
            meta={POLE_META[i]}
            isActive={activePanel === i}
            onClick={() => handlePanel(i)}
            isMobile={isMobile}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes panelScan {
          0%   { opacity: 1; top: 0; }
          100% { opacity: 0; top: 100%; }
        }
      `}</style>
    </div>
  );
}
