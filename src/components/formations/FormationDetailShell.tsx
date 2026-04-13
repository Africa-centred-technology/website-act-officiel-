"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Clock, Users, BarChart3, BookOpen,
  Check, Loader2, AlertCircle, RefreshCw,
  ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
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

import FooterStrip from "../layout/FooterStrip";

/* ── Configuration des couleurs ─────────────────────────── */
const ORANGE = "#D35400";
const DARK = "#070E1C";
const CARD_BG = "rgba(255, 255, 255, 0.03)";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_GRAY = "rgba(255,255,255,0.6)";
const OFF_WHITE = "#fcf9f2";

// Couleurs extraites du logo ACT (vert → orange-doré → orange → rouge-orangé → rouge)
const LOGO_COLORS = ["#1B5B3A", "#F0A500", "#D35400", "#B83C1F", "#8B1515"];

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

interface RelatedFormation {
  slug: string;
  title: string;
  categorie: string;
  secteur: string;
  niveau: string;
  duree: string;
  accroche: string;
  imageUrl?: string;
}

/* ── Sous-Composants ────────────────────────────────────── */

const SectionLabel = ({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) => (
  <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start", marginBottom: "1rem" }}>
    <span style={{
      fontSize: "1.2rem",
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
      fontSize: "1.5rem",
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

/* ── FramedImage ────────────────────────────────────────────────── */
function FramedImage({
  src, alt, height, borderRadius = "16px", fallback
}: {
  src?: string; alt?: string; height: string; borderRadius?: string; fallback?: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", paddingBottom: "12px", paddingRight: "12px" }}>
      {/* Cadre décoratif offset */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: "calc(100% - 12px)", height: `calc(${height} - 0px)`,
        borderRadius, border: `1px solid ${ORANGE}55`,
        pointerEvents: "none",
      }} />
      {/* Coin accent orange en haut à gauche */}
      <div style={{
        position: "absolute", top: -6, left: -6,
        width: 28, height: 28, borderTop: `2px solid ${ORANGE}`,
        borderLeft: `2px solid ${ORANGE}`, borderRadius: "4px 0 0 0",
        pointerEvents: "none", zIndex: 2,
      }} />
      {/* Coin accent orange en bas à droite */}
      <div style={{
        position: "absolute", bottom: 6, right: 6,
        width: 28, height: 28, borderBottom: `2px solid ${ORANGE}`,
        borderRight: `2px solid ${ORANGE}`, borderRadius: "0 0 4px 0",
        pointerEvents: "none", zIndex: 2,
      }} />
      {/* Image */}
      <div style={{ height, borderRadius, overflow: "hidden", border: `1px solid ${BORDER}`, position: "relative" }}>
        {src ? (
          <img src={src} alt={alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }} />
        ) : (
          fallback ?? <div style={{ width: "100%", height: "100%", background: `${ORANGE}18` }} />
        )}
      </div>
    </div>
  );
}

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
  const router = useRouter();
  const [formation, setFormation]     = useState<FormationDetail | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [fetchError, setFetchError]   = useState(false);
  const [openModule, setOpenModule]   = useState<number | null>(0);
  const [related, setRelated]         = useState<RelatedFormation[]>([]);
  const [scrolled, setScrolled]       = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!formation) return;
    fetch("/api/shopify/formations")
      .then((r) => r.json())
      .then((json) => {
        const all: RelatedFormation[] = json.formations ?? [];
        const others = all.filter((f) => f.slug !== slug);
        // Priorité : même catégorie → même secteur → reste
        const sameCategorie = others.filter((f) => f.categorie === formation.categorie);
        const sameSecteur   = others.filter((f) => f.secteur === formation.secteur && f.categorie !== formation.categorie);
        const rest          = others.filter((f) => f.categorie !== formation.categorie && f.secteur !== formation.secteur);
        const sorted = [...sameCategorie, ...sameSecteur, ...rest];
        setRelated(sorted.slice(0, 3));
      })
      .catch(() => {});
  }, [formation, slug]);

  const scrollToProgramme = () => {
    const el = document.getElementById("programme-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: DARK, color: "#fff", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <Grain />

      {/* ── Sticky CTA bar (remplace le Header au scroll) ── */}
      <AnimatePresence>
        {scrolled && formation && (
          <motion.div
            key="sticky-bar"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 6%", height: "68px",
              background: "rgba(7,14,28,0.92)",
              backdropFilter: "blur(16px)",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            {/* ACT à gauche */}
            <span style={{
              fontSize: "2rem", fontWeight: 800,
              letterSpacing: "0.06em",
              fontFamily: "var(--font-display)",
              color: "#fff",
            }}>
              ACT
            </span>

            {/* Bouton Je m'inscris avec pulse */}
            <button
              onClick={() => router.push(`/formations/${slug}/inscription`)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 28px", borderRadius: "8px",
                background: ORANGE, color: "#000",
                fontSize: "1.3rem", fontWeight: 700,
                border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)",
                position: "relative",
              }}
            >
              <span style={{
                position: "absolute", inset: -3, borderRadius: "10px",
                border: `2px solid ${ORANGE}`,
                animation: "ctaPulse 2s ease-out infinite",
                pointerEvents: "none",
              }} />
              <Users size={18} />
              Je m'inscris
            </button>
          </motion.div>
        )}
      </AnimatePresence>


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

          <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 200px 0.8fr", gap: "80px", alignItems: "flex-start" }}>

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
                <div style={{ marginBottom: "2rem" }}>
                  <CTAButton 
                    onClick={() => router.back()}
                    icon={<ChevronLeft size={20} />}
                    iconPosition="left"
                  >
                    Retour
                  </CTAButton>
                </div>
                <h1 style={{ fontSize: "clamp(4.2rem, 8vw, 6rem)", lineHeight: 1.1, fontWeight: 800, marginBottom: "2.5rem", fontFamily: "var(--font-display)" }}>
                  {formation.title.split('IA').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span style={{ color: ORANGE, fontStyle: "italic" }}>IA</span>}
                    </React.Fragment>
                  ))}
                </h1>

                <div style={{ display: "flex", gap: "25px", marginBottom: "5rem" }}>
                  <Button onClick={() => router.push(`/formations/${slug}/inscription`)}>Je m'inscris <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><Users size={24} /></motion.div></Button>
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
                      <div style={{ color: ORANGE, fontSize: "4rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>{stat.val}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, fontFamily: "var(--font-body)" }}>{stat.lab}</div>
                    </div>
                  ))}
                </div>

                <p style={{ color: TEXT_GRAY, fontSize: "clamp(1.7rem, 2.8vw, 2.1rem)", lineHeight: 1.8, maxWidth: "640px", marginTop: "4rem", fontFamily: "var(--font-body)" }}>
                  {formation.accroche}
                </p>

                <div style={{ marginTop: "3.5rem" }}>
                  <CTAButton href="#">Télécharger la brochure</CTAButton>
                </div>
              </motion.div>
            ) : null}

            {/* ── SECTION ATTESTATION (Middle) ── */}
            {formation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "20px" }}
              >
                <SectionLabel centered>{formation.secteur} · ATTESTATION ACT</SectionLabel>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: "relative" }}>
              <FramedImage
                src={formation?.images?.[0]}
                alt={formation?.title}
                height="500px"
                borderRadius="14px"
                fallback={<div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />}
              />
            </motion.div>
          </div>
        </section>

        {formation && (
          <>
            <div style={{ height: "1px", background: BORDER, width: "100%" }} />



                  {/* ── SECTION "POUR QUI" ── */}
            <section style={{ padding: "10px 5%", textAlign: "center" }}>
              <SectionLabel centered>POUR QUI</SectionLabel>
              <h2 style={{ fontSize: "clamp(3rem, 5.5vw, 4.5rem)", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Cette formation est conçue pour vous</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "850px", margin: "0 auto 2.5rem", fontSize: "clamp(1.4rem, 2vw, 1.6rem)", fontFamily: "var(--font-body)", lineHeight: 1.8 }}>
                {formation.prerequis || "Aucun prérequis technique particulier. Une curiosité pour l'IA suffit."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", maxWidth: "1100px", margin: "0 auto" }}>
                {formation.publicCible ? (
                  formation.publicCible.split(',').map((pill, i) => (
                    <span key={i} style={{ padding: "14px 28px", background: CARD_BG, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px", fontSize: "1.4rem", fontWeight: 500, color: OFF_WHITE, fontFamily: "var(--font-body)" }}>{pill.trim()}</span>
                  ))
                ) : (
                  <span style={{ padding: "14px 28px", background: CARD_BG, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "99px", fontSize: "1.4rem", fontWeight: 500, color: OFF_WHITE, fontFamily: "var(--font-body)" }}>Tous les professionnels</span>
                )}
              </div>
            </section>


            {/* ── SECTION "OBJECTIFS" ── */}
            <section style={{ padding: "80px 6%", textAlign: "center" }}>
              <div style={{ marginBottom: "35px" }}>
                <SectionLabel centered>OBJECTIFS</SectionLabel>
                <h2 style={{ fontSize: "clamp(3.2rem, 5.5vw, 4.8rem)", fontWeight: 800, marginBottom: "1.2rem", fontFamily: "var(--font-display)" }}>Ce que vous allez maîtriser</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "850px", margin: "0 auto", fontSize: "clamp(1.5rem, 2.2vw, 1.7rem)", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>Une approche concrète pour transformer votre manière de travailler avec l'intelligence artificielle.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", maxWidth: "1200px", margin: "0 auto" }}>
                {formation.objectifs.length > 0 ? (
                  formation.objectifs.slice(0, 4).map((obj, i) => {
                    const icons = [<BookOpen size={22} />, <BarChart3 size={22} />, <Users size={22} />, <Clock size={22} />];
                    const cardImg = formation.images && formation.images.length > 0
                      ? formation.images[i % formation.images.length]
                      : null;
                    return (
                      <motion.div key={i}
                        whileHover={{ borderColor: ORANGE, y: -4 }}
                        style={{ background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER}`, transition: "all 0.3s ease", textAlign: "left", overflow: "hidden" }}
                      >
                        {/* Image du card */}
                        <div style={{ height: "150px", position: "relative", overflow: "hidden" }}>
                          {cardImg ? (
                            <img src={cardImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${ORANGE}33, ${ORANGE}11)` }} />
                          )}
                          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, rgba(7,14,28,0.85))` }} />
                          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "8px",
                              background: `${ORANGE}cc`, border: `1px solid ${ORANGE}`,
                              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                            }}>
                              {icons[i]}
                            </div>
                            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: ORANGE, fontFamily: "var(--font-body)", letterSpacing: "0.05em" }}>0{i + 1}</span>
                          </div>
                        </div>
                        {/* Contenu */}
                        <div style={{ padding: "24px 28px 28px" }}>
                          <div style={{ width: 32, height: 3, borderRadius: 2, background: ORANGE, marginBottom: "14px" }} />
                          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.5rem", lineHeight: 1.75, fontWeight: 500, fontFamily: "var(--font-body)" }}>{obj}</p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  [1,2,3,4].map(i => (
                    <div key={i} style={{ background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER}`, overflow: "hidden", height: "280px" }}>
                      <SkeletonBlock w="100%" h={150} />
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
                      formation.programme.map((mod, i) => {
                        const isOpen = openModule === i;
                        const modColor = LOGO_COLORS[i % LOGO_COLORS.length];
                        return (
                          <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>

                            {/* ── Header cliquable ── */}
                            <button
                              onClick={() => setOpenModule(isOpen ? null : i)}
                              style={{
                                width: "100%", display: "flex", gap: "24px", alignItems: "center",
                                padding: "28px 0", background: "none", border: "none",
                                cursor: "pointer", textAlign: "left",
                              }}
                            >
                              <div style={{
                                minWidth: "52px", height: "52px", borderRadius: "50%", flexShrink: 0,
                                border: `2px solid ${modColor}`,
                                background: isOpen ? `${modColor}33` : `${modColor}15`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: modColor,
                                fontWeight: 800, fontSize: "1.3rem", fontFamily: "var(--font-body)",
                                transition: "all 0.3s ease",
                                boxShadow: isOpen ? `0 0 14px ${modColor}55` : "none",
                              }}>
                                {String(i + 1).padStart(2, "0")}
                              </div>

                              <h3 style={{
                                flex: 1, margin: 0, fontSize: "1.85rem", fontWeight: 700,
                                color: isOpen ? "#fff" : "rgba(255,255,255,0.7)",
                                fontFamily: "var(--font-body)", transition: "color 0.3s ease",
                              }}>
                                {mod.module}
                              </h3>

                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ color: isOpen ? ORANGE : "rgba(255,255,255,0.3)", flexShrink: 0 }}
                              >
                                <ChevronDown size={22} />
                              </motion.div>
                            </button>

                            {/* ── Contenu animé ── */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  key="content"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div style={{ paddingLeft: "76px", paddingBottom: "28px" }}>
                                    {/* Détails */}
                                    <div style={{ marginBottom: "24px" }}>
                                      {mod.details.map((d, j) => (
                                        <div key={j} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                                          <span style={{ color: ORANGE, flexShrink: 0, marginTop: "2px" }}>•</span>
                                          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.4rem", lineHeight: 1.65, fontFamily: "var(--font-body)" }}>{d}</span>
                                        </div>
                                      ))}
                                    </div>

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: TEXT_GRAY, fontSize: "1.4rem" }}>Programme détaillé en cours de mise à jour.</p>
                    )}
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "sticky", top: "140px" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <FramedImage
                        src={formation.images && formation.images.length > 1 ? formation.images[1] : "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800"}
                        alt="Formation details"
                        height="540px"
                      />
                    </div>
                    <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "1.3rem", fontStyle: "italic", fontFamily: "var(--font-body)", marginBottom: "24px" }}>Chaque module alterne concept et atelier pratique</p>

                    <button
                      onClick={() => router.push(`/formations/${slug}/inscription`)}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = ORANGE;
                        (e.currentTarget as HTMLButtonElement).style.color = "#000";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = ORANGE;
                      }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        padding: "16px 28px", background: "transparent",
                        border: `1px solid ${ORANGE}`, borderRadius: "10px",
                        color: ORANGE, fontSize: "1.4rem", fontWeight: 700,
                        cursor: "pointer", fontFamily: "var(--font-body)",
                        transition: "all 0.25s ease",
                      }}
                    >
                      Je m'inscris
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION LIVRABLES ── */}
            <section style={{ padding: "80px 6%", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
                <div style={{ background: CARD_BG, border: `1px solid ${ORANGE}33`, padding: "50px", borderRadius: "24px" }}>
                  <h2 style={{ fontSize: "clamp(2.7rem, 4.5vw, 3.7rem)", fontWeight: 800, marginBottom: "32px", fontFamily: "var(--font-display)" }}>Vous repartez avec</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                    {formation.livrables.length > 0 ? (
                      formation.livrables.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.55rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>{item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.55rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>Support de cours complet</span>
                        </div>
                        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                          <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} color={ORANGE} />
                          </div>
                          <span style={{ fontSize: "1.55rem", lineHeight: 1.6, fontWeight: 500, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-body)" }}>Attestation de réussite ACT Formation</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <FramedImage
                  src={formation.images && formation.images.length > 2 ? formation.images[2] : formation.images && formation.images.length > 0 ? formation.images[0] : "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800"}
                  alt="Formation détails"
                  height="420px"
                />
              </div>
            </section>

            {/* ── SECTION FORMATIONS SIMILAIRES ── */}
            {related.length > 0 && (
              <section style={{ padding: "80px 6%", borderTop: `1px solid ${BORDER}` }}>
                <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                  <div style={{ marginBottom: "48px", textAlign: "center" }}>
                    <SectionLabel centered>ALLER PLUS LOIN</SectionLabel>
                    <h2 style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)", fontWeight: 800, fontFamily: "var(--font-display)", marginTop: "0.5rem" }}>
                      Formations qui pourraient vous intéresser
                    </h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px" }}>
                    {related.map((f, i) => (
                      <motion.a
                        key={f.slug}
                        href={`/formations/${f.slug}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -6 }}
                        style={{
                          display: "block", textDecoration: "none", borderRadius: "16px",
                          border: `1px solid ${BORDER}`, background: CARD_BG, overflow: "hidden",
                          transition: "border-color 0.3s ease",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${ORANGE}66`)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                      >
                        {/* Image */}
                        <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                          {f.imageUrl ? (
                            <img src={f.imageUrl} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `${ORANGE}18` }} />
                          )}
                          {/* Badge catégorie */}
                          <span style={{
                            position: "absolute", top: "14px", left: "14px",
                            background: `${ORANGE}dd`, color: "#fff",
                            fontSize: "1.05rem", fontWeight: 700, padding: "5px 14px",
                            borderRadius: "99px", fontFamily: "var(--font-body)",
                          }}>
                            {f.categorie || f.secteur}
                          </span>
                        </div>

                        {/* Contenu */}
                        <div style={{ padding: "28px" }}>
                          {/* Méta */}
                          <div style={{ display: "flex", gap: "16px", marginBottom: "14px", flexWrap: "wrap" }}>
                            {f.niveau && (
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", fontFamily: "var(--font-body)" }}>
                                <BarChart3 size={14} /> {f.niveau}
                              </span>
                            )}
                            {f.duree && (
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", fontFamily: "var(--font-body)" }}>
                                <Clock size={14} /> {f.duree}
                              </span>
                            )}
                          </div>

                          <h3 style={{
                            fontSize: "1.6rem", fontWeight: 700, color: "#fff",
                            marginBottom: "12px", lineHeight: 1.3,
                            fontFamily: "var(--font-display)",
                          }}>
                            {f.title}
                          </h3>

                          {f.accroche && (
                            <p style={{
                              color: "rgba(255,255,255,0.55)", fontSize: "1.25rem",
                              lineHeight: 1.6, fontFamily: "var(--font-body)",
                              display: "-webkit-box", WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical", overflow: "hidden",
                            }}>
                              {f.accroche}
                            </p>
                          )}

                          <div style={{ marginTop: "22px", display: "flex", alignItems: "center", gap: "8px", color: ORANGE, fontSize: "1.2rem", fontWeight: 600, fontFamily: "var(--font-body)" }}>
                            Voir la formation <ChevronRight size={16} />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <FooterStrip />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        :root { --font-display: 'Lora', serif; --font-body: 'Poppins', sans-serif; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes ctaPulse {
          0%   { opacity: 0.9; transform: scale(1); }
          70%  { opacity: 0;   transform: scale(1.25); }
          100% { opacity: 0;   transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
