"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FORMATIONS, Formation } from "@/lib/data/formations";

import CTAButton from "@/components/ui/CTAButton";

const ORANGE = "#D35400";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;

// Quelques images génériques pour illustrer les formations
const FORMATION_IMAGES = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1434031211660-24d4e32ae7a8?auto=format&fit=crop&w=1200&q=80",
];

export default function FormationsCarousel() {
  const [index, setIndex] = useState(0);
  const current = FORMATIONS[index];

  const next = () => setIndex((i) => (i + 1) % FORMATIONS.length);
  const prev = () => setIndex((i) => (i - 1 + FORMATIONS.length) % FORMATIONS.length);

  return (
    <section style={{
      background: "transparent",
      padding: "3rem 0",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Futura, system-ui, sans-serif",
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ORANGE}0D 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}
          >

          </motion.div>
          <motion.h2
             initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }} transition={{ delay: 0.1 }}
             style={{ 
               fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", 
               fontWeight: 900, color: "#fff", 
               textTransform: "uppercase", letterSpacing: "-0.02em",
               lineHeight: 1.05,
            }}
          >
            Explorez nos <span style={{ color: ORANGE }}>Formations</span>
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div style={{ position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [...EASE] }}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(250px, 0.85fr) 1.15fr",
                gap: "3rem",
                alignItems: "center",
                minHeight: "400px",
              }}
              className="carousel-grid"
            >
              {/* Image Left */}
              <div style={{ position: "relative", borderRadius: "1.5rem", overflow: "hidden", aspectRatio: "1.2/1", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                <motion.img 
                  src={FORMATION_IMAGES[index % FORMATION_IMAGES.length]} 
                  alt={current.title}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)" }} />
                
                {/* Badge Categorie */}
                <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", background: `${ORANGE}cc`, padding: "0.5rem 1.2rem", borderRadius: "2rem", backdropFilter: "blur(8px)" }}>
                    <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{current.categorie}</span>
                </div>
              </div>

              {/* Content Right */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{current.secteur}</span>
                <h3 style={{ fontSize: "clamp(1.8rem, 2.8vw, 3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.01em" }}>{current.title}</h3>
                
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(1.1rem, 1.3vw, 1.4rem)", lineHeight: 1.55, fontWeight: 500 }}>{current.accroche}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ padding: "1.1rem", borderRadius: "0.8rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: "0.72rem", color: ORANGE, textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: "0.5rem", fontWeight: 700 }}>Niveau</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>{current.niveau}</span>
                    </div>
                    <div style={{ padding: "1.1rem", borderRadius: "0.8rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: "0.72rem", color: ORANGE, textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: "0.5rem", fontWeight: 700 }}>Durée</span>
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>{current.duree}</span>
                    </div>
                </div>

                <div className="carousel-cta-container" style={{ marginTop: "1rem" }}>
                    <CTAButton href={`/formations/${current.slug}`}>
                        Détails de la formation
                    </CTAButton>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "3.5rem", justifyContent: "center" }}>
            <button onClick={prev} className="nav-btn" style={{
                width: 50, height: 50, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s var(--ease-uptown)"
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <div style={{ display: "flex", gap: "0.6rem" }}>
                {FORMATIONS.slice(0, 8).map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setIndex(i)}
                        style={{
                            width: i === index ? 36 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: i === index ? ORANGE : "rgba(255,255,255,0.2)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    />
                ))}
            </div>

            <button onClick={next} className="nav-btn" style={{
                width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s var(--ease-uptown)"
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

      </div>

      <style>{`
        .nav-btn:hover { background: rgba(255,255,255,0.12) !important; border-color: ${ORANGE}66 !important; transform: scale(1.05); color: ${ORANGE} !important; }
        .cta-button-formation:hover { transform: translateY(-3px); box-shadow: 0 15px 30px ${ORANGE}44 !important; }
        @media(max-width:968px) {
          .carousel-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .carousel-cta-container { display: flex; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

