"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  BarChart3,
  MonitorPlay,
  Tag,
  Phone,
  Mail,
  CheckCircle2,
  Users,
  CalendarCheck,
  FileText,
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";
import FormationInscriptionForm from "@/components/formations/FormationInscriptionForm";

const ORANGE = "#D35400";
const DARK = "#070E1C";

/* ── Grain ──────────────────────────────────────────────── */
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

/* ── Section label ───────────────────────────────────────── */
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
      <span
        style={{
          display: "inline-block",
          width: 7,
          height: 7,
          background: ORANGE,
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: ORANGE,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ── Meta pill ───────────────────────────────────────────── */
function MetaPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.55rem 1rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "6px",
      }}
    >
      <Icon size={15} color={ORANGE} strokeWidth={1.8} />
      <span
        style={{
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "1.5rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "1.7rem",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Formation data type (minimal) ───────────────────────── */
interface FormationMeta {
  title: string;
  accroche: string;
  niveau: string;
  duree: string;
  format: string;
  prix: string;
  secteur: string;
  categorie: string;
}

const PROCESS_STEPS = [
  {
    icon: FileText,
    title: "Remplissez le formulaire",
    desc: "Complétez votre profil et vos attentes en 4 étapes guidées.",
  },
  {
    icon: CalendarCheck,
    title: "Confirmation sous 24h",
    desc: "Un conseiller ACT vous contacte pour confirmer et planifier.",
  },
  {
    icon: Users,
    title: "Intégrez la formation",
    desc: "Rejoignez votre groupe et démarrez votre parcours.",
  },
];

/* ── Main ──────────────────────────────────────────────────────── */
export default function FormationInscriptionShell({ slug }: { slug: string }) {
  const [formation, setFormation] = useState<FormationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, margin: "-80px" });

  useEffect(() => {
    fetch(`/api/shopify/formations/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.formation) setFormation(json.formation);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  const title = formation?.title ?? slug.replace(/-/g, " ");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DARK,
        color: "#fff",
        overflowX: "hidden",
        fontFamily: "Futura, system-ui, sans-serif",
      }}
    >
      <Grain />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "62vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding:
            "clamp(7rem, 14vh, 11rem) clamp(1.5rem, 6vw, 8rem) clamp(4rem, 7vh, 6rem)",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "40%",
            left: "55%",
            width: "55vw",
            height: "45vw",
            background:
              "radial-gradient(ellipse,rgba(211,84,0,0.07) 0%,transparent 65%)",
            transform: "translate(-50%,-50%)",
          }}
        />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 1, marginBottom: "2rem" }}
        >
          <Link
            href={`/formations/${slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "rgba(255,255,255,0.45)",
              textDecoration: "none",
              fontSize: "1.6rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = ORANGE)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.45)")
            }
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Retour à la formation
          </Link>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.8rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              background: ORANGE,
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: "1.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Inscription Formation
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.6, 0.08, 0.02, 0.99] }}
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            fontSize: "var(--font-90, clamp(3rem, 7vw, 6.5rem))",
            lineHeight: 0.95,
            marginBottom: "2.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.88)" }}>Inscrivez</span>
          <br />
          <span style={{ color: ORANGE }}>-vous</span>
        </motion.h1>

        {/* Formation title + meta pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.38 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          {isLoading ? (
            <div
              style={{
                width: 280,
                height: 28,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 4,
                marginBottom: "1.5rem",
              }}
            />
          ) : (
            <p
              style={{
                fontSize: "clamp(2.2rem, 3vw, 3.5rem)",
                color: "rgba(255,255,255,0.65)",
                fontWeight: 600,
                marginBottom: "1.5rem",
                textTransform: "none",
                letterSpacing: "0",
              }}
            >
              {title}
            </p>
          )}

          {formation && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
              }}
            >
              <MetaPill icon={BarChart3} label="Niveau" value={formation.niveau} />
              <MetaPill icon={Clock} label="Durée" value={formation.duree} />
              <MetaPill icon={MonitorPlay} label="Format" value={formation.format} />
              <MetaPill icon={Tag} label="Prix" value={formation.prix} />
            </div>
          )}
        </motion.div>

        {/* Orange rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={heroInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.6 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(to right,#D35400,#F39C12,#D35400)",
            transformOrigin: "left",
            zIndex: 1,
          }}
        />
      </section>

      {/* ── FORM + SIDEBAR ──────────────────────────────────── */}
      <section
        ref={formRef}
        style={{
          padding:
            "clamp(4rem, 7vw, 7rem) clamp(1.5rem, 6vw, 8rem) clamp(5rem, 9vw, 9rem)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(300px, 32%, 420px)",
            gap: "clamp(3rem, 5vw, 6rem)",
            alignItems: "start",
          }}
          className="inscription-grid"
        >
          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <SLabel>Formulaire d'inscription</SLabel>
            <h2
              style={{
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "clamp(3.8rem, 6vw, 7rem)",
                lineHeight: 1.05,
                marginBottom: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              Votre <span style={{ color: ORANGE }}>dossier</span>
            </h2>

            <FormationInscriptionForm
              formationTitle={formation?.title ?? title}
              formationSlug={slug}
            />
          </motion.div>

          {/* ── SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "2rem" }}
          >
            {/* Formation summary card */}
            {formation && (
              <div
                style={{
                  background: `${ORANGE}08`,
                  border: `1px solid ${ORANGE}25`,
                  borderRadius: "1rem",
                  padding: "clamp(1.5rem, 3vw, 2.2rem)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(to right, ${ORANGE}, #F39C12)`,
                  }}
                />
                <SLabel>Récapitulatif</SLabel>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    color: "#fff",
                    marginBottom: "1.5rem",
                    lineHeight: 1.45,
                  }}
                >
                  {formation.title}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    { icon: BarChart3, label: "Niveau", value: formation.niveau },
                    { icon: Clock, label: "Durée", value: formation.duree },
                    { icon: MonitorPlay, label: "Format", value: formation.format },
                    { icon: Tag, label: "Tarif", value: formation.prix },
                  ]
                    .filter((r) => r.value)
                    .map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "6px",
                            background: "rgba(211,84,0,0.12)",
                            border: "1px solid rgba(211,84,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={15} color={ORANGE} strokeWidth={1.8} />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "1.35rem",
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.35)",
                              marginBottom: "0.1rem",
                            }}
                          >
                            {label}
                          </p>
                          <p
                            style={{
                              fontSize: "1.75rem",
                              color: "#fff",
                              fontWeight: 600,
                              textTransform: "none",
                              letterSpacing: "0",
                            }}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {formation.accroche && (
                  <p
                    style={{
                      marginTop: "1.5rem",
                      fontSize: "1.65rem",
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.7,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: "1.2rem",
                      textTransform: "none",
                      letterSpacing: "0",
                    }}
                  >
                    {formation.accroche.slice(0, 160)}
                    {formation.accroche.length > 160 ? "…" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Process steps */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem, 3vw, 2.2rem)",
              }}
            >
              <SLabel>Comment ça se passe ?</SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {PROCESS_STEPS.map(({ icon: Icon, title: t, desc }, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        background: "rgba(211,84,0,0.1)",
                        border: "1px solid rgba(211,84,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} color={ORANGE} strokeWidth={1.7} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "1.65rem",
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {t}
                      </p>
                      <p
                        style={{
                          fontSize: "1.6rem",
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.6,
                          textTransform: "none",
                          letterSpacing: "0",
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagements */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem, 3vw, 2.2rem)",
              }}
            >
              <SLabel>Nos engagements</SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  "Réponse garantie sous 24h ouvrées",
                  "Conseiller dédié à votre dossier",
                  "Confidentialité assurée (NDA disponible)",
                ].map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                    <CheckCircle2 size={16} color={ORANGE} strokeWidth={2} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <span
                      style={{
                        fontSize: "1.65rem",
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.6,
                        textTransform: "none",
                        letterSpacing: "0",
                      }}
                    >
                      {e}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact direct */}
            <div
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1rem",
                padding: "clamp(1.5rem, 3vw, 2.2rem)",
              }}
            >
              <SLabel>Une question ?</SLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <a
                  href="tel:+212662777507"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    fontSize: "1.65rem",
                    transition: "color 0.2s",
                    textTransform: "none",
                    letterSpacing: "0",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = ORANGE)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.55)")
                  }
                >
                  <Phone size={15} color={ORANGE} strokeWidth={1.8} />
                  +212 662-777507
                </a>
                <a
                  href="mailto:sohaib.baroud@a-ct.ma"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    fontSize: "1.65rem",
                    transition: "color 0.2s",
                    textTransform: "none",
                    letterSpacing: "0",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = ORANGE)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.55)")
                  }
                >
                  <Mail size={15} color={ORANGE} strokeWidth={1.8} />
                  sohaib.baroud@a-ct.ma
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <FooterStrip />

      <style jsx global>{`
        @media (max-width: 900px) {
          .inscription-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
