"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { PROJECTS } from "@/lib/data/projects";

/* ── Grain ───────────────────────────────────────────── */
function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px",
      }}
    />
  );
}

/* ── Reveal wrapper ──────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.6, 0.08, 0.02, 0.99] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Section label ───────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        marginBottom: "1.5rem",
      }}
    >
      <span className="diamond diamond--sm" />
      <span
        style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#D35400",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════ */
export default function ProjectDetailShell({ project }: { project: Project }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  /* Adjacent projects for navigation */
  const idx = PROJECTS.findIndex((p) => p.id === project.id);
  const prev = PROJECTS[idx - 1] ?? null;
  const next = PROJECTS[idx + 1] ?? null;

  return (
    <div style={{ minHeight: "100vh", background: "#070e1c", color: "#fff", overflowX: "hidden", paddingTop: "5rem" }}>
      <Grain />

      {/* ── BACK LINK ────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: "clamp(8rem, 12vh, 10rem)", /* Ensure it clears the navbar links */
          left: "clamp(1.5rem, 5vw, 4rem)",
          zIndex: 200,
        }}
      >
        <Link
          href="/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(7,14,28,0.75)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2rem",
            padding: "0.55rem 1.2rem",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Futura, system-ui, sans-serif",
            fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "color 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#D35400";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(211,84,0,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          ← Réalisations
        </Link>
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          height: "calc(100vh - 5rem)",
          minHeight: 600,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Parallax image */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            bottom: "-20%",
            left: "-5%",
            right: "-5%",
            y: imgY,
            opacity: imgOpacity,
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-contain"
            style={{ padding: "clamp(2rem, 6vw, 6rem)" }}
            priority
          />
        </motion.div>

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,14,28,0.3) 0%, rgba(7,14,28,0.55) 40%, rgba(7,14,28,0.95) 80%, #070e1c 100%)",
          }}
        />

        {/* Grid lines bg */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(211,84,0,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(211,84,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "clamp(2rem, 5vw, 5rem) clamp(1.5rem, 6vw, 8rem) clamp(3rem, 6vh, 5rem)",
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}
          >
            <span
              style={{
                background: "#D35400",
                color: "#fff",
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding: "0.35rem 1rem",
                borderRadius: "0.3rem",
              }}
            >
              {project.category}
            </span>
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.8rem, 1vw, 1rem)",
                letterSpacing: "0.18em",
              }}
            >
              {project.index} / 04
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.6, 0.08, 0.02, 0.99] }}
            style={{
              fontFamily: "Futura, system-ui, sans-serif",
              fontWeight: 900,
              textTransform: "uppercase",
              fontSize: "var(--font-90)",
              lineHeight: 0.95,
              color: "#fff",
              marginBottom: "1.5rem",
              maxWidth: "14ch",
            }}
          >
            {project.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "var(--font-20)",
              maxWidth: "60ch",
              lineHeight: 1.6,
            }}
          >
            {project.tagline}
          </motion.p>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(to right, #D35400, #F39C12, #D35400)",
            transformOrigin: "left",
            zIndex: 1,
          }}
        />
      </section>

      {/* ── META BAR ─────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 6vw, 8rem)",
        }}
      >
        <Reveal>
          <div className="proj-meta-bar">
            {[
              { label: "Client", value: project.client },
              { label: "Année", value: project.year },
              { label: "Durée", value: project.duration },
              { label: "Domaine", value: project.categoryFull },
            ].map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    fontFamily: "Futura, system-ui, sans-serif",
                    fontSize: "clamp(0.7rem, 0.85vw, 0.85rem)",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#D35400",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "Futura, system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "var(--font-20)",
                    color: "#fff",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}

            {/* Technologies */}
            <div style={{ gridColumn: "1 / -1" }}>
              <p
                style={{
                  fontFamily: "Futura, system-ui, sans-serif",
                  fontSize: "clamp(0.7rem, 0.85vw, 0.85rem)",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#D35400",
                  marginBottom: "0.75rem",
                }}
              >
                Technologies
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.35rem",
                      padding: "0.4rem 1rem",
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(0.75rem, 0.95vw, 0.95rem)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── BODY CONTENT ─────────────────────────────── */}
      <div
        style={{
          padding: "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 6vw, 8rem)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(5rem, 9vw, 10rem)",
        }}
      >
        {/* Description longue */}
        <Reveal>
          <div className="proj-body-split">
            {/* Left — label */}
            <div>
              <SectionLabel>Présentation</SectionLabel>
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: "#D35400",
                  marginTop: "0.5rem",
                }}
              />
            </div>
            {/* Right — texte */}
            <div>
              {project.descriptionLong.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "var(--font-20)",
                    lineHeight: 1.85,
                    marginBottom: i < project.descriptionLong.split("\n\n").length - 1 ? "1.8rem" : 0,
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Image pleine largeur */}
        <Reveal delay={0.1}>
          <div
            style={{
              position: "relative",
              height: "clamp(260px, 45vw, 620px)",
              borderRadius: "1rem",
              overflow: "hidden",
              background: "#0a1520",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
              style={{ padding: "clamp(1.5rem, 4vw, 4rem)" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(7,14,28,0.15) 0%, rgba(7,14,28,0.05) 100%)",
              }}
            />
          </div>
        </Reveal>

        {/* Résultats */}
        <Reveal delay={0.05}>
          <div className="proj-body-split">
            <div>
              <SectionLabel>Résultats</SectionLabel>
              <div style={{ width: 40, height: 2, background: "#D35400", marginTop: "0.5rem" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                gap: "1rem",
              }}
            >
              {project.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  style={{
                    background: "rgba(211,84,0,0.05)",
                    border: "1px solid rgba(211,84,0,0.15)",
                    borderRadius: "0.75rem",
                    padding: "1.5rem 1.8rem",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: "var(--font-25)",
                      color: "#D35400",
                      lineHeight: 1.1,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {r.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(0.8rem, 1vw, 1rem)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#ffffff",
                    }}
                  >
                    {r.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Défis */}
        <Reveal delay={0.05}>
          <div className="proj-body-split">
            <div>
              <SectionLabel>Défis</SectionLabel>
              <div style={{ width: 40, height: 2, background: "#D35400", marginTop: "0.5rem" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {project.challenges.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.2rem",
                    padding: "1.4rem 1.6rem",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: "Futura, system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(0.75rem, 0.95vw, 0.95rem)",
                      color: "#D35400",
                      letterSpacing: "0.1em",
                      paddingTop: "0.2rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "var(--font-20)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {c}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Approche */}
        <Reveal delay={0.05}>
          <div className="proj-body-split">
            <div>
              <SectionLabel>Notre Approche</SectionLabel>
              <div style={{ width: 40, height: 2, background: "#D35400", marginTop: "0.5rem" }} />
            </div>
            <div
              style={{
                background: "rgba(211,84,0,0.04)",
                border: "1px solid rgba(211,84,0,0.12)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem, 3vw, 2.5rem)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "var(--font-20)",
                  lineHeight: 1.85,
                  margin: 0,
                }}
              >
                {project.approach}
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(5rem, 10vw, 10rem) clamp(1.5rem, 6vw, 8rem)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, rgba(211,84,0,0.07) 0%, transparent 65%)",
          }}
        />
        <Reveal>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.8rem" }}>
              <span className="diamond diamond--sm" />
              <span style={{ fontFamily: "Futura, system-ui, sans-serif", fontSize: "0.9rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                Votre prochain projet
              </span>
              <span className="diamond diamond--sm" />
            </div>
            <h2
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "var(--font-50)",
                lineHeight: 1.05,
                color: "#fff",
                marginBottom: "1.2rem",
              }}
            >
              Votre Vision,{" "}
              <span style={{ color: "#D35400" }}>Notre Expertise</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.38)",
                fontSize: "var(--font-20)",
                lineHeight: 1.72,
                maxWidth: 520,
                margin: "0 auto 3rem",
              }}
            >
              Prêt à faire de votre prochain projet une success story technologique ?
              L'équipe Africa Centred Technology est à votre écoute.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.9rem",
                background: "#D35400",
                color: "#fff",
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "1.2rem 2.8rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                transition: "background 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#b84a00";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#D35400";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Démarrer un projet similaire →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── NAVIGATION PROJETS ───────────────────────── */}
      <nav
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "grid",
          gridTemplateColumns: prev ? (next ? "1fr 1fr" : "1fr") : "1fr",
        }}
      >
        {prev && (
          <Link
            href={`/projects/${prev.id}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 6vw, 8rem)",
              borderRight: next ? "1px solid rgba(255,255,255,0.05)" : "none",
              textDecoration: "none",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")
            }
            onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.7rem, 0.9vw, 0.9rem)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              ← Projet précédent
            </span>
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "var(--font-25)",
                color: "#fff",
              }}
            >
              {prev.title}
            </span>
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.75rem, 0.95vw, 0.95rem)",
                letterSpacing: "0.15em",
                color: "#D35400",
              }}
            >
              {prev.category}
            </span>
          </Link>
        )}
        {next && (
          <Link
            href={`/projects/${next.id}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
              padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 6vw, 8rem)",
              textDecoration: "none",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.7rem, 0.9vw, 0.9rem)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              Projet suivant →
            </span>
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "var(--font-25)",
                color: "#fff",
                textAlign: "right",
              }}
            >
              {next.title}
            </span>
            <span
              style={{
                fontFamily: "Futura, system-ui, sans-serif",
                fontSize: "clamp(0.75rem, 0.95vw, 0.95rem)",
                letterSpacing: "0.15em",
                color: "#D35400",
              }}
            >
              {next.category}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
