"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { secteurs } from "@/lib/secteurs-data";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";

/* ── Background layers ─────────────────────────────────────── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

/* ── Tokens ─────────────────────────────────────────────── */
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const ORANGE = "#D35400";
const BG = "#0A1410";

/* ── Directions ─────────────────────────────────────────── */
type Dir = 1 | -1;

/* ══════════════════════════════════════════════════════════
   ALBUM SECTION — fixed height, arrow + drag navigation
   ══════════════════════════════════════════════════════════ */
function AlbumSection() {
  const total = secteurs.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<Dir>(1);
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const hasDragged = useRef(false);

  const go = useCallback(
    (d: Dir) => {
      setDir(d);
      setActive((prev) => (prev + d + total) % total);
    },
    [total]
  );

  const goTo = useCallback(
    (i: number) => {
      setDir(i > active ? 1 : -1);
      setActive(i);
    },
    [active]
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  /* Mouse drag handlers */
  const onMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    hasDragged.current = false;
    setIsDragging(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = Math.abs(e.clientX - dragStartX.current);
    if (dx > 8) hasDragged.current = true;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    if (!hasDragged.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };
  const onMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      const dx = e.clientX - dragStartX.current;
      if (hasDragged.current && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    }
  };

  /* Touch handlers */
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    hasDragged.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const s = secteurs[active];
  const num = String(active + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  /* Slide variants */
  const variants = {
    enter: (d: Dir) => ({ x: d * 60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: Dir) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        position: "relative",
        paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
        paddingRight: "clamp(1.5rem, 3vw, 3rem)",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
      className="flex-col lg:flex-row flex-wrap lg:flex-nowrap"
    >
      {/* ── LEFT: Text Content ──────────────────────────── */}
      <div
        style={{
          flex: "1 1 100%", // Start at 100% width on mobile
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: "clamp(0px, 3vw, 3rem)",
          position: "relative",
          zIndex: 2,
        }}
        className="lg:flex-[0_0_52%] mb-12 lg:mb-0"
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Counter */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
              <span style={{ width: "4rem", height: "3px", background: s.color, display: "inline-block" }} />
              <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", letterSpacing: "0.2em", color: "#ffffff", textTransform: "uppercase", opacity: 0.8 }}>
                {num} / {tot}
              </span>
            </div>

            {/* Label - Sector Name First - ORANGE */}
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 900, textTransform: "uppercase", color: ORANGE, marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
              {s.label}
            </p>

            {/* Tagline - Second */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.75rem, 3.5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "#ffffff",
                margin: "0 0 1.5rem",
              }}
            >
              {s.tagline}
            </p>

            {/* Description - BIGGER */}
            <p style={{ fontFamily: "var(--font-body)", color: "#ffffff", fontSize: "clamp(1.2rem, 1.5vw, 1.5rem)", lineHeight: 1.75, maxWidth: "650px", marginBottom: "2.5rem", textAlign: "justify" }}>
              {s.description.length > 350 ? s.description.slice(0, 350) + "…" : s.description}
            </p>

            {/* Services - BIGGER */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {s.services.slice(0, 3).map((svc) => (
                <li key={svc} style={{ fontFamily: "var(--font-body)", display: "flex", alignItems: "flex-start", gap: "0.85rem", color: "#ffffff", fontSize: "clamp(1.1rem, 1.35vw, 1.35rem)", lineHeight: 1.5 }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, flexShrink: 0, marginTop: "0.55rem" }} />
                  {svc}
                </li>
              ))}
            </ul>

            {/* Key figure - BIGGER */}
            {s.chiffre && (
              <div style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}44`, borderLeft: `5px solid ${s.color}`, borderRadius: "0.8rem", padding: "1.4rem 2rem", marginBottom: "2.5rem", display: "inline-block" }}>
                <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 900, color: ORANGE, margin: "0 0 0.35rem", lineHeight: 1 }}>
                  {s.chiffre.value}
                </p>
                <p style={{ fontFamily: "var(--font-body)", color: "#ffffff", fontSize: "clamp(1rem, 1.3vw, 1.3rem)", margin: 0, lineHeight: 1.4, opacity: 0.85 }}>
                  {s.chiffre.label}
                </p>
              </div>
            )}

            {/* CTA - BIGGER */}
            <div>
              <Link
                href={`/secteurs/${s.slug}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", borderBottom: "3px solid rgba(255,255,255,0.4)", paddingBottom: "0.5rem", transition: "color 0.25s, border-color 0.25s" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = ORANGE; el.style.borderBottomColor = ORANGE; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = "#ffffff"; el.style.borderBottomColor = "rgba(255,255,255,0.4)"; }}
              >
                Explorer le secteur →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>


      </div>

      {/* ── RIGHT: Photo Cards Stack ("hand of cards") ──── */}
      <div
        style={{
          flex: "1 1 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "2vh",
          paddingBottom: "2vh",
          paddingRight: "clamp(0px, 2vw, 2rem)",
          position: "relative",
          overflow: "visible",
          minWidth: "300px",
          minHeight: "450px"
        }}
        className="w-full lg:w-1/2"
      >
        {/* Wrapper for all stacked cards */}
        <div
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            width: "100%",
            maxWidth: "420px",
            height: "min(60vh, 520px)",
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          {/* Render ALL cards — background cards fanned out, active on top */}
          {secteurs.map((cardSecteur, i) => {
            const isActive = i === active;
            // Calculate relative position from active (circular)
            let relPos = i - active;
            if (relPos > Math.floor(total / 2)) relPos -= total;
            if (relPos < -Math.floor(total / 2)) relPos += total;
            const absPos = Math.abs(relPos);

            // Only render cards within ±3 of active
            if (absPos > 3) return null;

            // Fan-out config: rotation, translate, scale, opacity per distance from active
            const rotationMap: Record<number, number> = { 0: 0, 1: 6, 2: -4.5, 3: 9 };
            const translateXMap: Record<number, number> = { 0: 0, 1: 25, 2: -18, 3: 40 };
            const translateYMap: Record<number, number> = { 0: 0, 1: 8, 2: 14, 3: 20 };
            const scaleMap: Record<number, number> = { 0: 1, 1: 0.95, 2: 0.90, 3: 0.85 };
            const opacityMap: Record<number, number> = { 0: 1, 1: 0.85, 2: 0.65, 3: 0.45 };

            const rot = (rotationMap[absPos] || 0) * (relPos < 0 ? -1 : 1);
            const tx = (translateXMap[absPos] || 0) * (relPos < 0 ? -1 : 1);
            const ty = translateYMap[absPos] || 0;
            const sc = scaleMap[absPos] || 0.85;
            const op = opacityMap[absPos] || 0.45;
            const zIdx = 10 - absPos;

            const cardNum = String(i + 1).padStart(2, "0");

            return (
              <div
                key={cardSecteur.slug}
                style={{
                  position: isActive ? "relative" : "absolute",
                  inset: isActive ? undefined : 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  transform: `rotate(${rot}deg) translate(${tx}px, ${ty}px) scale(${sc})`,
                  transformOrigin: "center 85%",
                  zIndex: zIdx,
                  opacity: op,
                  boxShadow: isActive
                    ? "0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)"
                    : "0 16px 50px rgba(0,0,0,0.40)",
                  pointerEvents: isActive ? "auto" : "none",
                  transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, box-shadow 0.5s ease",
                  display: "flex",
                  flexDirection: "column",
                  background: "#0d1525",
                }}
              >
                {/* Number top-right */}
                <div style={{ position: "absolute", top: "1.25rem", right: "1.5rem", zIndex: 10, fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.85rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                  {cardNum}
                </div>

                {/* Image area */}
                <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <Image
                    src={cardSecteur.image}
                    alt={cardSecteur.label}
                    fill
                    style={{ objectFit: "cover", pointerEvents: "none" }}
                    sizes="45vw"
                    priority={isActive}
                    draggable={false}
                  />
                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: isActive ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)" : "linear-gradient(to bottom, rgba(10,20,16,0.25) 0%, rgba(10,20,16,0.65) 100%)", pointerEvents: "none" }} />

                  {isActive && (
                    <>
                      {/* Icon badge */}
                      <div style={{ position: "absolute", bottom: "1.1rem", left: "1.25rem", background: "rgba(0,0,0,0.50)", backdropFilter: "blur(8px)", borderRadius: "0.45rem", padding: "0.3rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem", pointerEvents: "none" }}>
                        <span style={{ fontSize: "0.95rem" }}>{cardSecteur.icon}</span>
                      </div>

                      {/* Left arrow */}
                      <button
                        onClick={(e) => { e.stopPropagation(); go(-1); }}
                        aria-label="Secteur précédent"
                        style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.40)", backdropFilter: "blur(8px)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.22s, border-color 0.22s, transform 0.22s" }}
                        onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,0,0,0.70)"; b.style.borderColor = "rgba(255,255,255,0.55)"; b.style.transform = "translateY(-50%) scale(1.08)"; }}
                        onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,0,0,0.40)"; b.style.borderColor = "rgba(255,255,255,0.25)"; b.style.transform = "translateY(-50%) scale(1)"; }}
                      >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                      </button>

                      {/* Right arrow */}
                      <button
                        onClick={(e) => { e.stopPropagation(); go(1); }}
                        aria-label="Secteur suivant"
                        style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "2.6rem", height: "2.6rem", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.40)", backdropFilter: "blur(8px)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.22s, border-color 0.22s, transform 0.22s" }}
                        onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,0,0,0.70)"; b.style.borderColor = "rgba(255,255,255,0.55)"; b.style.transform = "translateY(-50%) scale(1.08)"; }}
                        onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,0,0,0.40)"; b.style.borderColor = "rgba(255,255,255,0.25)"; b.style.transform = "translateY(-50%) scale(1)"; }}
                      >
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </button>

                      {/* Progress dots */}
                      <div style={{ position: "absolute", bottom: "1rem", right: "1.25rem", zIndex: 20, display: "flex", alignItems: "center", gap: "0.35rem", pointerEvents: "auto" }}>
                        {secteurs.map((_, di) => (
                          <button
                            key={di}
                            onClick={(e) => { e.stopPropagation(); goTo(di); }}
                            aria-label={`Secteur ${di + 1}`}
                            style={{ width: di === active ? "1.2rem" : "0.35rem", height: "0.35rem", borderRadius: "4px", background: di === active ? "#fff" : "rgba(255,255,255,0.35)", border: "none", padding: 0, cursor: "pointer", transition: "width 0.35s ease, background 0.35s ease" }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Legend strip */}
                <div style={{ background: "#f5f0e8", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexShrink: 0 }}>
                  <p style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#1B3022", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: "rgba(27,48,34,0.45)", fontSize: "0.58rem" }}>({cardNum})</span>
                    {cardSecteur.label.toUpperCase()}
                  </p>
                  {isActive && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button title="Secteur précédent" onClick={(e) => { e.stopPropagation(); go(-1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#1B3022", display: "flex", alignItems: "center", opacity: 0.45, padding: "0.1rem", transition: "opacity 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.45")}>
                        <ChevronLeft size={14} strokeWidth={2.5} />
                      </button>
                      <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(27,48,34,0.45)", flexShrink: 0 }}>{num} / {tot}</span>
                      <button title="Secteur suivant" onClick={(e) => { e.stopPropagation(); go(1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#1B3022", display: "flex", alignItems: "center", opacity: 0.45, padding: "0.1rem", transition: "opacity 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")} onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.45")}>
                        <ChevronRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical divider - hidden on mobile */}
      <div className="hidden lg:block" style={{ position: "absolute", left: "52%", top: "15%", bottom: "15%", width: "1px", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SHELL
   ══════════════════════════════════════════════════════════ */
export default function SecteursShell() {
  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "Futura, system-ui, sans-serif",
        color: "#fff",
      }}
    >
      {/* ── Background layers ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          paddingTop: "clamp(7rem, 11vw, 12rem)",
          paddingBottom: "clamp(4rem, 6vw, 7rem)",
          paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
          paddingRight: "clamp(1.5rem, 6vw, 8rem)",
        }}
      >
        {/* Radial glow orange */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 72% 56% at 50% -8%, rgba(211,84,0,0.13) 0%, transparent 68%)" }} />

        {/* Orange rule reveal */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [...EASE] }}
          style={{ height: 1, background: "rgba(211,84,0,0.38)", marginBottom: "2.5rem", originX: 0 }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.2rem" }}
        >
          <motion.div
            style={{ width: 28, height: 1, background: ORANGE, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.45 }}
          />
          <span style={{ color: "#ffffff", fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)", letterSpacing: "0.35em", textTransform: "uppercase" }}>
            Africa Centred Technology
          </span>
          <span style={{ color: ORANGE, fontWeight: 900, fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            — Secteurs
          </span>
        </motion.div>

        {/* Title */}
        <div style={{ overflow: "hidden", marginBottom: "1.25rem" }}>
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [...EASE] }}
            style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(3rem, 8vw, 10rem)", lineHeight: 0.92, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#fff", margin: 0 }}
          >
            NOS DOMAINES
            <br />
            <span style={{ color: ORANGE }}>D&apos;EXPERTISE</span>
          </motion.h1>
        </div>

        {/* Subtitle + Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.65, delay: 0.42 }}
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "2.5rem" }}
        >
          <p style={{ fontFamily: "var(--font-body)", color: "#ffffff", fontSize: "clamp(1.4rem, 1.8vw, 1.8rem)", lineHeight: 1.6, maxWidth: "700px", margin: 0, textAlign: "justify", flex: "1 1 100%", order: 2 }} className="lg:flex-1 lg:order-1">
            ACT intervient dans de nombreux secteurs, apporter expertise technologique et vision locale pour transformer les défis du continent en opportunités concrètes.
          </p>
  
        </motion.div>
      </section>

      {/* ── Album Section (100vh, fixed, arrows + drag) ── */}
      <AlbumSection />

      {/* ── CTA band ── */}
      <CTASection />

      {/* ── Footer ── */}
      <FooterStrip />
    </div>
  );
}
