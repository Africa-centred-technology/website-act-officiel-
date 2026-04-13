"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Clock, Users, BarChart3, BookOpen,
  Check,  Loader2, AlertCircle, RefreshCw,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Header from "@/components/layout/Header";
import CTAButton from "@/components/ui/CTAButton";

const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });

/* ── Grain texture ── */
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

import FormationInscriptionModal from "@/components/formations/FormationInscriptionModal";
import FooterStrip from "../layout/FooterStrip";

/* ── Configuration des couleurs ─────────────────────────── */
const ORANGE = "#D35400";
const DARK = "#070E1C";
const CARD_BG = "rgba(255, 255, 255, 0.03)";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_GRAY = "rgba(255,255,255,0.6)";
const OFF_WHITE = "#fcf9f2";

interface FormationDetail {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  prix?: string;
  accroche: string;
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: { module: string; details: string[] }[];
  livrables: string[];
  methode: string;
  imageUrl?: string;
  images?: string[];
  descriptionHtml?: string;
}

/* ── Sous-Composants ────────────────────────────────────── */

const SectionLabel = ({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) => (
  <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start", marginBottom: "1rem" }}>
    <span style={{
      fontSize: "1.05rem",
      fontWeight: 700,
      letterSpacing: "0.15em",
      color: ORANGE,
      textTransform: "uppercase",
      border: `1px solid ${ORANGE}44`,
      background: `${ORANGE}11`,
      padding: "10px 20px",
      borderRadius: "99px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-body)"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
      {children}
    </span>
  </div>
);

const Button = ({
  children,
  variant = "primary",
  onClick
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "1.4rem 3rem",
      borderRadius: "10px",
      fontWeight: 700,
      fontSize: "1.3rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      background: variant === "primary" ? ORANGE : "transparent",
      color: variant === "primary" ? "#000" : "#fff",
      border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.3)",
      fontFamily: "var(--font-body)"
    }}
  >
    {children}
  </button>
);

/* ── Skeleton ──────────────────────────────────────────────────── */
function SkeletonBlock({ w = "100%", h = 16 }: { w?: string; h?: number }) {
  return (
    <div style={{
      width: w, height: h,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 6,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function FormationDetailShell({ slug }: { slug: string }) {
  const [formation, setFormation]     = useState<FormationDetail | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [fetchError, setFetchError]   = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFormation = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/shopify/formations/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFormation(json.formation ?? null);
    } catch (err) {
      console.error("[FormationDetailShell] fetch failed:", err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadFormation(); }, [slug]);

  const scrollToProgramme = () => {
    const el = document.getElementById("programme-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: DARK, color: "#fff", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <Grain />

      {/* ── Header du site ── */}
      <Header />

      {/* Background Terrain */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.4 }}>
        <WaveTerrain />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── SECTION HERO ── */}
        <section style={{ position: "relative", padding: "80px 6% 100px", minHeight: "85vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* Grid bg */}
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
          {/* Glow */}
          <div aria-hidden style={{ position: "absolute", top: "35%", left: "60%", width: "60vw", height: "50vw", background: "radial-gradient(ellipse,rgba(211,84,0,0.07) 0%,transparent 65%)", transform: "translate(-50%,-50%)" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "100px", alignItems: "flex-start" }}>

            {/* Loading / Error States */}
            {isLoading ? (
              <div>
                <SkeletonBlock w="200px" h={40} />
                <div style={{ height: "1.5rem" }} />
                <SkeletonBlock w="80%" h={80} />
                <div style={{ height: "1.5rem" }} />
                <SkeletonBlock w="60%" h={40} />
                <div style={{ height: "3rem" }} />
                <div style={{ display: "flex", gap: "20px" }}>
                  <SkeletonBlock w="180px" h={50} />
                  <SkeletonBlock w="180px" h={50} />
                </div>
              </div>
            ) : fetchError ? (
              <div>
                <SectionLabel>ERREUR DE CHARGEMENT</SectionLabel>
                <h1 style={{ fontSize: "var(--font-40)", color: "#fff", marginBottom: "2rem" }}>Impossible de charger les détails</h1>
                <Button onClick={loadFormation}>Réessayer <RefreshCw size={18} /></Button>
              </div>
            ) : formation ? (
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <SectionLabel>{formation.secteur} · {formation.duree} · ATTESTATION ACT</SectionLabel>
                <h1 style={{ fontSize: "clamp(3.8rem, 7.5vw, 5.4rem)", lineHeight: 1.1, fontWeight: 800, marginBottom: "2.5rem", fontFamily: "var(--font-display)" }}>
                  {formation.title.split('IA').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span style={{ color: ORANGE, fontStyle: "italic" }}>IA</span>}
                    </React.Fragment>
                  ))}
                </h1>

                <div style={{ display: "flex", gap: "25px", marginBottom: "5rem" }}>
                  <Button onClick={() => setIsModalOpen(true)}>Je m'inscris <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><Users size={24} /></motion.div></Button>
                  <Button variant="secondary" onClick={scrollToProgramme}>Voir le programme</Button>
                </div>

                <div style={{ display: "flex", gap: "40px" }}>
                  {[
                    { val: formation.duree + "h", lab: "pratique intensive" },
                    { val: (formation.programme?.length || 0) > 0 ? formation.programme.length : "6", lab: "modules progressifs" },
                    { val: "≤12", lab: "apprenants / session" },
                    { val: "100%", lab: "cas métier réels" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div style={{ color: ORANGE, fontSize: "3.4rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>{stat.val}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, fontFamily: "var(--font-body)" }}>{stat.lab}</div>
                    </div>
                  ))}
                </div>

                <p style={{ color: TEXT_GRAY, fontSize: "clamp(1.5rem, 2.5vw, 1.85rem)", lineHeight: 1.8, maxWidth: "640px", marginTop: "4rem", fontFamily: "var(--font-body)" }}>
                  {formation.accroche}
                </p>

                <div style={{ marginTop: "3.5rem" }}>
                  <CTAButton href="#">Télécharger la brochure</CTAButton>
                </div>
              </motion.div>
            ) : null}

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: "relative" }}>
              <div style={{ height: "350px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
                {formation?.images && formation.images.length > 0 ? (
                  <img src={formation.images[0]} alt={formation.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />
                )}
              </div>
            
            </motion.div>
          </div>
        </section>

        {formation && (
          <>
            <div style={{ height: "1px", background: BORDER, width: "100%" }} />

            {/* ── SECTION "OBJECTIFS" ── */}
            <section style={{ padding: "80px 6%", textAlign: "center" }}>
              <div style={{ marginBottom: "35px" }}>
                <SectionLabel centered>OBJECTIFS</SectionLabel>
                <h2 style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)", fontWeight: 800, marginBottom: "1.2rem", fontFamily: "var(--font-display)" }}>Ce que vous allez maîtriser</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "850px", margin: "0 auto", fontSize: "clamp(1.2rem, 1.8vw, 1.4rem)", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>Une approche concrète pour transformer votre manière de travailler avec l'intelligence artificielle.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", maxWidth: "1200px", margin: "0 auto" }}>
                {formation.objectifs.length > 0 ? (
                  formation.objectifs.slice(0, 4).map((obj, i) => (
                    <motion.div key={i} whileHover={{ borderColor: ORANGE }}
                                style={{ background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER}`, transition: "all 0.3s ease", textAlign: "left", padding: "32px" }}>
                      <div style={{ marginBottom: "18px", width: "48px", height: "48px", borderRadius: "12px", background: `${ORANGE}22`, border: `1px solid ${ORANGE}44`, display: "flex", alignItems: "center", justifyContent: "center", color: ORANGE, fontWeight: 800, fontSize: "1.4rem" }}>
                        0{i+1}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.25rem", lineHeight: 1.7, fontWeight: 500, fontFamily: "var(--font-body)" }}>{obj}</p>
                    </motion.div>
                  ))
                ) : (
                  [1,2,3,4].map(i => (
                    <div key={i} style={{ background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER}`, padding: "32px", height: "180px" }}>
                      <SkeletonBlock w="40px" h={40} />
                    </div>
                  ))
                )}
              </div>
            </section>

            <div style={{ height: "1px", background: BORDER, width: "100%" }} />

            {/* ── SECTION "LE PROGRAMME" ── */}
            <section id="programme-section" style={{ padding: "80px 6%" }}>
              <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 420px", gap: "70px" }}>
                <div>
                  <SectionLabel>LE PROGRAMME</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {formation.programme.length > 0 ? (
                      formation.programme.map((mod, i) => (
                        <div key={i} style={{ display: "flex", gap: "32px", padding: "30px 0", borderBottom: `1px solid ${BORDER}` }}>
                          <div style={{
                            minWidth: "52px", height: "52px", borderRadius: "50%", border: `1px solid ${ORANGE}`,
                            background: `${ORANGE}11`, display: "flex", alignItems: "center", justifyContent: "center", color: ORANGE, fontWeight: 800, fontSize: "1.1rem", fontFamily: "var(--font-body)"
                          }}>{String(i+1).padStart(2, '0')}</div>
                          <div>
                            <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "10px", fontFamily: "var(--font-body)" }}>{mod.module}</h3>
                            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.2rem", lineHeight: 1.65, marginBottom: "10px", fontFamily: "var(--font-body)" }}>
                              {mod.details.map((d, j) => (
                                <div key={j} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                                  <span style={{ color: ORANGE }}>•</span> {d}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: TEXT_GRAY, fontSize: "1.25rem" }}>Programme détaillé en cours de mise à jour.</p>
                    )}
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "sticky", top: "140px" }}>
                    <div style={{ height: "540px", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" }}>
                      {formation.images && formation.images.length > 1 ? (
                        <img src={formation.images[1]} alt="Formation details" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800" alt="Formation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", fontStyle: "italic", fontFamily: "var(--font-body)" }}>Chaque module alterne concept et atelier pratique</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION LIVRABLES ── */}
            <section style={{ padding: "80px 6%", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
                <div style={{ background: CARD_BG, border: `1px solid ${ORANGE}33`, padding: "50px", borderRadius: "24px" }}>
                  <h2 style={{ fontSize: "clamp(2.3rem, 4vw, 3.2rem)", fontWeight: 800, marginBottom: "32px", fontFamily: "var(--font-display)" }}>Vous repartez avec</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                    {formation.livrables.length > 0 ? (
                      formation.livrables.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.3rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>{item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.3rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>Support de cours complet</span>
                        </div>
                        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.3rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>Attestation de réussite ACT Formation</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ height: "420px", borderRadius: "16px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
                  <img
                    src={formation.images && formation.images.length > 2 ? formation.images[2] : formation.images && formation.images.length > 0 ? formation.images[0] : "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800"}
                    alt="Formation détails"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </section>

            {/* ── SECTION "POUR QUI" ── */}
            <section style={{ padding: "80px 6%", textAlign: "center" }}>
              <SectionLabel centered>POUR QUI</SectionLabel>
              <h2 style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Cette formation est conçue pour vous</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "850px", margin: "0 auto 2.5rem", fontSize: "clamp(1.2rem, 1.8vw, 1.4rem)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
                {formation.prerequis || "Aucun prérequis technique particulier. Une curiosité pour l'IA suffit."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", maxWidth: "1100px", margin: "0 auto" }}>
                {formation.publicCible ? (
                  formation.publicCible.split(',').map((pill, i) => (
                    <span key={i} style={{ padding: "14px 28px", background: CARD_BG, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px", fontSize: "1.2rem", fontWeight: 500, color: OFF_WHITE, fontFamily: "var(--font-body)" }}>{pill.trim()}</span>
                  ))
                ) : (
                  <span style={{ padding: "14px 28px", background: CARD_BG, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px", fontSize: "1.2rem", fontWeight: 500, color: OFF_WHITE, fontFamily: "var(--font-body)" }}>Tous les professionnels</span>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <FooterStrip />

      <FormationInscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formationTitle={formation?.title ?? slug}
        formationSlug={slug}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        :root { --font-display: 'Lora', serif; --font-body: 'Poppins', sans-serif; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
