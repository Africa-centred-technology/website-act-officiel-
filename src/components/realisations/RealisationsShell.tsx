"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PROJECTS, CATEGORIES } from "@/lib/data/projects";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";

/* ── Shared home2 background layers (same as Shell.tsx) ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain       = dynamic(() => import("@/components/home2/Grain"),       { ssr: false });

/* ── Design tokens ─────────────────────────────────────── */
const EASE   = [0.6, 0.08, 0.02, 0.99] as const;
const BURST  = [0.04, 0.72, 0.08, 1.0] as const;
const ORANGE = "#D35400";
const GOLD   = "#F39C12";
const BG     = "#070E1C";

/* ── WordChars — identique à RoomEntree / SecteursShell ── */
type CharFx = "rollIn" | "burstOut" | "riseUp";

function WordChars({
  text, delay = 0, color = "#ffffff", indent = "0%", mt,
  fx, stagger = 0.033,
  size = "clamp(4.2rem, 10.5vw, 13.5rem)",
}: {
  text: string; delay?: number; color?: string;
  indent?: string; mt?: string; fx: CharFx; stagger?: number;
  size?: string;
}) {
  const chars = text.split("");
  const mid   = Math.floor(chars.length / 2);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginLeft: indent, marginTop: mt }}>
      {chars.map((ch, i) => {
        const ord       = fx === "burstOut" ? Math.abs(i - mid) : i;
        const charDelay = delay + ord * stagger;

        const initial =
          fx === "rollIn"
            ? { y: "-108%", opacity: 0, filter: "blur(4px)" }
            : fx === "burstOut"
              ? { scale: 0.04, opacity: 0, filter: "blur(22px) brightness(3.2)" }
              : { y: "108%", opacity: 0 };

        const target =
          fx === "rollIn"
            ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : fx === "burstOut"
              ? { scale: 1, opacity: 1, filter: "blur(0px) brightness(1.0)" }
              : { y: "0%", opacity: 1 };

        const inner = (
          <motion.span
            className="font-black uppercase"
            style={{
              display: "inline-block",
              color,
              fontSize: size,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textShadow: "0px 12px 40px rgba(0,0,0,0.6)",
              fontFamily: "'Futura', system-ui, sans-serif",
            }}
            initial={initial}
            animate={target}
            transition={{
              duration: fx === "burstOut" ? 1.1 : 0.74,
              delay: charDelay,
              ease: [...BURST],
            }}
          >
            {ch}
          </motion.span>
        );

        return fx !== "burstOut" ? (
          <div key={i} style={{ overflow: "hidden" }}>{inner}</div>
        ) : (
          <div key={i}>{inner}</div>
        );
      })}
    </div>
  );
}

/* ── Project Card ────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [...EASE] }}
    >
      <Link
        href={`/projects/${project.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${hovered ? "rgba(211,84,0,0.3)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "1rem",
          overflow: "hidden",
          textDecoration: "none",
          transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 24px 60px rgba(211,84,0,0.08)" : "0 0 0 transparent",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: "clamp(180px, 22vw, 280px)", background: "#0a1520", overflow: "hidden" }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            style={{
              padding: "1.2rem",
              transition: "transform 0.6s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: hovered
              ? "linear-gradient(to bottom, rgba(7,14,28,0.1), rgba(7,14,28,0.55))"
              : "linear-gradient(to bottom, rgba(7,14,28,0.05), rgba(7,14,28,0.4))",
            transition: "background 0.4s",
          }} />

          {/* Index */}
          <span style={{
            position: "absolute", top: "1rem", left: "1rem",
            fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900,
            fontSize: "0.92rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em",
          }}>
            {project.index}
          </span>

          {/* Category badge on hover */}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: ORANGE, color: "#fff",
              fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700,
              fontSize: "clamp(0.8rem, 1vw, 1rem)", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.35rem 0.85rem", borderRadius: "0.3rem",
            }}
          >
            {project.category}
          </motion.span>

          {/* Tech tags */}
          <div style={{ position: "absolute", bottom: "1rem", left: "1rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.09)", backdropFilter: "blur(8px)",
                color: "#ffffff", fontSize: "clamp(0.8rem, 1vw, 1rem)",
                fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.3rem 0.65rem", borderRadius: "0.25rem",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
          <div style={{ padding: "clamp(1.2rem, 2.5vw, 1.8rem)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.7rem" }}>
              <span style={{ color: ORANGE, fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                {project.categoryFull}
              </span>
              <span style={{ color: "#ffffff", fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)", letterSpacing: "0.1em" }}>
                {project.year}
              </span>
            </div>

          <h3 style={{
            fontFamily: "Futura, system-ui, sans-serif", fontWeight: 900,
            textTransform: "uppercase",
            color: hovered ? ORANGE : "#fff",
            fontSize: "var(--font-25)", lineHeight: 1.1, marginBottom: "0.75rem",
            transition: "color 0.3s",
          }}>
            {project.title}
          </h3>

          <p style={{
            color: "#ffffff", fontSize: "var(--font-18)", lineHeight: 1.65,
            marginBottom: "1.2rem",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
            overflow: "hidden",
          }}>
            {project.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color: "#ffffff", fontFamily: "Futura, system-ui, sans-serif", fontSize: "clamp(0.85rem, 1.1vw, 1rem)", letterSpacing: "0.1em" }}>
              {project.client}
            </span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              style={{ color: ORANGE, fontFamily: "Futura, system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)", letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              Lire →
            </motion.span>
          </div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          style={{ height: 2, background: `linear-gradient(to right, ${ORANGE}, ${GOLD})`, originX: 0 }}
          transition={{ duration: 0.35 }}
        />
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SHELL PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export default function RealisationsShell() {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");

  const filtered =
    activeCategory === "Tous"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: "Futura, system-ui, sans-serif" }}>

      {/* ── Couches de fond identiques à la home ── */}
      <WaveTerrain />
      <Grain />

      {/* ══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        paddingTop: "clamp(7rem, 11vw, 12rem)",
        paddingBottom: "clamp(4rem, 6vw, 7rem)",
        paddingLeft: "clamp(1.5rem, 6vw, 8rem)",
        paddingRight: "clamp(1.5rem, 6vw, 8rem)",
      }}>

        {/* Radial glow orange */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 72% 56% at 50% -8%, rgba(211,84,0,0.13) 0%, transparent 68%)",
        }} />

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
            — Portfolio
          </span>
        </motion.div>

        {/* Titre — structure 3 mots identique à Room 1 / Secteurs */}
        <div style={{ perspective: "1200px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <WordChars text="NOS"          fx="rollIn"   delay={0.10} stagger={0.040} size="clamp(4rem, 9vw, 13rem)" />
          <WordChars text="RÉALISATIONS" fx="burstOut" delay={0.30} stagger={0.044} color="#FF6B00" mt="0.12em" size="clamp(2.5rem, 5vw, 7rem)" />
          <WordChars text="ACT"          fx="riseUp"   delay={0.65} stagger={0.040} mt="0.10em" size="clamp(3.5rem, 8vw, 11.5rem)" />
        </div>

        {/* Subtitle + stats */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", marginTop: "3rem" }}
        >
          <p style={{ color: "#ffffff", fontSize: "clamp(1.2rem, 1.8vw, 1.8rem)", lineHeight: 1.7, maxWidth: "600px" }}>
            Découvrez nos projets qui transforment les entreprises africaines et créent un impact
            durable sur le continent. Technologies de pointe, résultats mesurables.
          </p>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {[
              { value: "04",   label: "Projets réalisés" },
              { value: "2+",   label: "Pays couverts"    },
              { value: "100%", label: "Satisfaction"     },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <p style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: ORANGE, margin: 0, lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ color: ORANGE, fontSize: "clamp(1rem, 1.5vw, 1.5rem)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.4rem" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: "absolute", bottom: "2.5rem", right: "clamp(1.5rem, 4vw, 8rem)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.div
            style={{ width: 1, height: 52, background: "rgba(211,84,0,0.55)", margin: "0 auto", originY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{ color: ORANGE, fontSize: "clamp(0.85rem, 1vw, 1.1rem)", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", display: "block", textAlign: "center", marginTop: "0.5rem" }}>
            04
          </span>
        </motion.div>
      </section>

      {/* ══ FILTER BAR ═════════════════════════════════════════════════ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(7,14,28,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(211,84,0,0.2)",
        padding: "2rem clamp(1.5rem, 6vw, 8rem)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <span style={{
            color: "#ffffff", fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(1.1rem, 1.6vw, 1.6rem)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700,
          }}>
            Filtrer par catégorie
          </span>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === "Tous" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: isActive ? ORANGE : "transparent",
                    border: `2px solid ${isActive ? ORANGE : "rgba(255,255,255,0.15)"}`,
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                    fontFamily: "Futura, system-ui, sans-serif", fontWeight: 600,
                    fontSize: "clamp(0.95rem, 1.3vw, 1.3rem)", letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.3s ease",
                    display: "flex", alignItems: "center", gap: "0.75rem",
                  }}
                >
                  {cat}
                  <span style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                    borderRadius: "0.3rem", padding: "0.2rem 0.5rem",
                    fontSize: "clamp(0.8rem, 1vw, 1rem)", fontWeight: 700, color: "#ffffff",
                  }}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ GRID ════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", zIndex: 2,
        background: "rgba(7,14,28,0.80)",
        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        padding: "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 6vw, 8rem)",
      }}>
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 2rem)",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "6rem 0", color: "rgba(255,255,255,0.25)" }}
          >
            <span style={{ fontFamily: "Futura, system-ui, sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Aucun projet dans cette catégorie
            </span>
          </motion.div>
        )}
      </section>

      {/* ══ CTA BAND ════════════════════════════════════════════════════ */}
      <CTASection
        eyebrow="Votre projet, notre expertise"
        title="Parlons de votre projet"
        description="ACT dispose de l'expertise technologique pour vous accompagner dans votre transformation digitale, quelle que soit votre industrie."
        buttonText="Démarrer un projet"
      />

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <FooterStrip />
    </div>
  );
}
