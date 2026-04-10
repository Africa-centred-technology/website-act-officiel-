"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Clock, Users, BarChart3, BookOpen,
  CheckCircle2, ArrowRight, Loader2, AlertCircle, RefreshCw,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import FooterStrip from "@/components/layout/FooterStrip";
import CTAButton from "@/components/ui/CTAButton";
import FormationInscriptionModal from "@/components/formations/FormationInscriptionModal";

const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain      = dynamic(() => import("@/components/home2/Grain"),        { ssr: false });
const Cursor     = dynamic(() => import("@/components/home2/Cursor"),       { ssr: false });

const ORANGE = "#D35400";
const EASE   = [0.6, 0.08, 0.02, 0.99] as const;

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

/* ── Skeleton loading ─────────────────────────────────────────────────────── */
function SkeletonBlock({ w = "100%", h = 16 }: { w?: string; h?: number }) {
  return (
    <div style={{
      width: w, height: h, background: "rgba(255,255,255,0.06)",
      borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function FormationDetailShell({ slug }: { slug: string }) {
  const accent = ORANGE;
  const [formation, setFormation]   = useState<FormationDetail | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"public" | "programme" | "objectifs">("public");

  const loadFormation = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/shopify/formations/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFormation(json.formation ?? null);
    } catch (err) {
      console.error("[FormationDetailShell] Shopify fetch failed:", err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadFormation(); }, [slug]);

  return (
    <div style={{ background: "#070E1C", minHeight: "100vh", color: "#fff", position: "relative" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>

      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: [...EASE] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: accent, originX: 0, zIndex: 100 }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", padding: "clamp(6rem, 10vw, 9rem) clamp(1.5rem, 5vw, 3rem) 6rem" }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem", flexWrap: "wrap" }}
        >
          <Link href="/services" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.1em" }}>Services</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <Link href="/formations" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.1em" }}>Formations</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: accent, fontSize: "0.9rem", letterSpacing: "0.1em" }}>
            {isLoading ? "…" : formation?.secteur ?? slug}
          </span>
        </motion.div>

        {/* ── Erreur ── */}
        {fetchError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "0.75rem", padding: "1.5rem 2rem", marginBottom: "3rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <AlertCircle size={22} color="#f87171" />
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
                Impossible de charger cette formation.
              </p>
            </div>
            <button
              onClick={loadFormation}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.2rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.4rem", color: "#fff", cursor: "pointer", fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Réessayer
            </button>
          </motion.div>
        )}

        {/* ── Skeleton loading ── */}
        {isLoading && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", marginBottom: "5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "1rem", height: 500 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <SkeletonBlock w="50%" h={12} />
              <SkeletonBlock w="90%" h={40} />
              <SkeletonBlock w="100%" h={80} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[0,1,2,3].map(i => <div key={i} style={{ height: 90, background: "rgba(255,255,255,0.04)", borderRadius: "0.75rem" }} />)}
              </div>
              <SkeletonBlock w="100%" h={80} />
            </div>
          </div>
        )}

        {/* ── Contenu principal ── */}
        {!isLoading && !fetchError && formation && (
          <>
            {/* Hero : Image + Caractéristiques */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem 4rem", marginBottom: "5rem", alignItems: "start" }}>

              {/* Left — Image Carousel */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                style={{ flex: "1.2 1 600px", minWidth: 0 }}
              >
                <div style={{ position: "relative", width: "100%", height: "500px", borderRadius: "1rem", overflow: "hidden", border: `1px solid ${accent}33` }}>
                  
                  {formation.images && formation.images.length > 1 ? (
                    <div className="formation-swiper-container" style={{ height: "100%" }}>
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                          prevEl: ".swiper-button-prev-custom",
                          nextEl: ".swiper-button-next-custom",
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        style={{ height: "100%" }}
                      >
                        {formation.images.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                              <img
                                src={img}
                                alt={`${formation.title} - ${idx + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}

                        {/* Custom Navigation */}
                        <div className="swiper-button-prev-custom" style={{ 
                          position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", 
                          zIndex: 10, width: "40px", height: "40px", borderRadius: "50%", 
                          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          color: "#fff", transition: "all 0.3s"
                        }}>
                          <ChevronLeft size={24} />
                        </div>
                        <div className="swiper-button-next-custom" style={{ 
                          position: "absolute", top: "50%", right: "1rem", transform: "translateY(-50%)", 
                          zIndex: 10, width: "40px", height: "40px", borderRadius: "50%", 
                          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          color: "#fff", transition: "all 0.3s"
                        }}>
                          <ChevronRight size={24} />
                        </div>
                      </Swiper>
                    </div>
                  ) : (
                    <img
                      src={formation.images?.[0] || formation.imageUrl || `/images/poles/pole-formation.jpg`}
                      alt={formation.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}

                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.3) 50%, rgba(7,14,28,0.9) 100%)", pointerEvents: "none", zIndex: 5 }} />
                  
                  {formation.secteur && (
                    <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", padding: "0.6rem 1.2rem", background: accent, borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", zIndex: 6 }}>
                      {formation.secteur}
                    </div>
                  )}
                </div>

                {/* Onglets sous l'image */}
                <div style={{ marginTop: "2rem" }}>
                  <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem", overflowX: "auto" }}>
                    {[
                      { id: "public", label: "Public Cible", icon: Users },
                      { id: "programme", label: "Programme", icon: BookOpen },
                      { id: "objectifs", label: "Objectifs", icon: CheckCircle2 }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                          background: "none", border: "none", color: activeTab === tab.id ? accent : "rgba(255,255,255,0.5)",
                          padding: "1rem 0.5rem", fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase",
                          letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem",
                          position: "relative", whiteSpace: "nowrap", transition: "all 0.3s ease"
                        }}
                      >
                        <tab.icon size={22} />
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="activeTabUnderline" style={{ position: "absolute", bottom: -9, left: 0, right: 0, height: 3, background: accent }} />
                        )}
                      </button>
                    ))}
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}11`, borderRadius: "1rem", padding: "2.5rem", minHeight: "350px" }}>
                    {activeTab === "public" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 style={{ fontSize: "1.8rem", color: accent, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>Public Cible</h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontSize: "1.25rem", margin: 0 }}>{formation.publicCible || "Non spécifié"}</p>
                      </motion.div>
                    )}

                    {activeTab === "programme" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 style={{ fontSize: "1.8rem", color: accent, marginBottom: "2rem", fontFamily: "var(--font-display)" }}>Programme détaillé</h3>
                        {formation.programme && formation.programme.length > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {formation.programme.map((mod, i) => (
                              <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                                <div style={{ flexShrink: 0, width: "2.2rem", height: "2.2rem", borderRadius: "50%", background: `${accent}22`, border: `1px solid ${accent}55`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.15rem" }}>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: accent, fontFamily: "var(--font-body)" }}>{String(i + 1).padStart(2, "0")}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontWeight: 700, color: "#fff", marginBottom: "0.65rem", fontSize: "1.2rem" }}>{mod.module}</p>
                                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {mod.details.map((d, j) => (
                                      <li key={j} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", display: "flex", gap: "0.75rem" }}>
                                        <span style={{ color: accent, flexShrink: 0 }}>›</span> {d}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.25rem" }}>Détails bientôt disponibles</p>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "objectifs" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 style={{ fontSize: "1.8rem", color: accent, marginBottom: "2rem", fontFamily: "var(--font-display)" }}>Objectifs pédagogiques</h3>
                        {formation.objectifs && formation.objectifs.length > 0 ? (
                          <div style={{ display: "grid", gap: "1.5rem" }}>
                            {formation.objectifs.map((obj, i) => (
                              <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                                <CheckCircle2 size={24} color={accent} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.2rem", lineHeight: 1.6 }}>{obj}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.25rem" }}>Objectifs bientôt disponibles</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right — Infos */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                style={{ flex: "1 1 400px", minWidth: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}` }} />
                  <span style={{ fontSize: "0.9rem", color: accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                    Pôle III · Formation
                  </span>
                </div>

                <h1 style={{ fontSize: "var(--font-40)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#fff", marginBottom: "2rem", fontFamily: "var(--font-display)" }}>
                  {formation.title}
                </h1>

                <p style={{ fontSize: "var(--font-20)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "3rem", fontFamily: "var(--font-body)" }}>
                  {formation.accroche}
                </p>

                {/* Caractéristiques */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
                  {[
                    { icon: Clock,    label: "Durée",     value: formation.duree },
                    { icon: BookOpen, label: "Format",    value: formation.format },
                    { icon: BarChart3,label: "Niveau",    value: formation.niveau },
                    { icon: Users,    label: "Catégorie", value: formation.categorie },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}33`, borderRadius: "0.75rem", padding: "1.5rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <item.icon size={24} color={accent} />
                        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontFamily: "var(--font-body)" }}>{item.label}</p>
                      </div>
                      <p style={{ fontSize: "var(--font-18)", color: "#fff", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>{item.value || "—"}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Niveau — barre de progression visuelle */}
                {formation.niveau && (() => {
                  const steps = ["Initiation", "Intermédiaire", "Avancé"];
                  const niveauNorm = (formation.niveau ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const stepIdx = niveauNorm.includes("avan") || niveauNorm.includes("expert") ? 2
                    : niveauNorm.includes("inter") || niveauNorm.includes("confirm") ? 1 : 0;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.72, duration: 0.5 }}
                      style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}33`, borderRadius: "0.75rem" }}
                    >
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.85rem 0", fontFamily: "var(--font-body)" }}>
                        Niveau requis
                      </p>
                      <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.45rem" }}>
                        {steps.map((_, i) => (
                          <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= stepIdx ? accent : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {steps.map((step, i) => (
                          <span key={step} style={{ fontSize: "0.7rem", fontWeight: i === stepIdx ? 700 : 400, color: i === stepIdx ? accent : "rgba(255,255,255,0.28)", fontFamily: "var(--font-body)" }}>
                            {step}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Compétences développées */}
                {formation.objectifs && formation.objectifs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{ marginBottom: "2.5rem" }}
                  >
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.85rem 0", fontFamily: "var(--font-body)" }}>
                      Compétences développées
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                      {formation.objectifs.slice(0, 5).map((obj, i) => (
                        <span key={i} style={{
                          display: "inline-flex", alignItems: "flex-start", gap: "0.4rem",
                          padding: "0.4rem 0.85rem",
                          background: `${accent}14`,
                          border: `1px solid ${accent}3A`,
                          borderRadius: "2rem",
                          fontSize: "0.76rem",
                          color: "rgba(255,255,255,0.8)",
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.45,
                        }}>
                          <CheckCircle2 size={11} color={accent} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                          {obj.length > 50 ? obj.slice(0, 50).trimEnd() + "…" : obj}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Prix */}
                {formation.prix && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.5 }}
                    style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}11)`, border: `2px solid ${accent}`, borderRadius: "0.75rem", padding: "1.25rem 2rem", marginBottom: "2rem", textAlign: "center" }}
                  >
                    <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem", fontFamily: "var(--font-body)" }}>Tarif</p>
                    <p style={{ fontSize: "var(--font-25)", fontWeight: 900, color: accent, lineHeight: 1, fontFamily: "var(--font-display)", marginBottom: "0.25rem" }}>{formation.prix}</p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)", margin: 0 }}>par participant</p>
                  </motion.div>
                )}

                {/* CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <CTAButton onClick={() => setIsModalOpen(true)}>
                    S&apos;inscrire à cette formation
                  </CTAButton>
                  <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                    Réponse sous 48h ouvrées
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.9, ease: [...EASE] }}
              style={{ height: 1, background: `linear-gradient(90deg, ${accent}55, transparent)`, originX: 0, marginBottom: "5rem" }}
            />

            {/* Content + Sidebar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem", marginBottom: "5rem" }}>

              {/* Left — Contenu */}
              <div style={{ flex: "1 1 600px", minWidth: 0 }}>
           

                {/* Description HTML si pas de programme */}
                {formation.programme?.length === 0 && formation.descriptionHtml && (
                  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "4rem" }}>
                    <h2 style={{ fontSize: "var(--font-35)", fontWeight: 900, marginBottom: "1.5rem", color: "#fff", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>
                      À propos de <span style={{ color: accent }}>cette formation</span>
                    </h2>
                    <div
                      style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "var(--font-18)", fontFamily: "var(--font-body)" }}
                      dangerouslySetInnerHTML={{ __html: formation.descriptionHtml }}
                    />
                  </motion.section>
                )}

                {/* Méthode */}
                {formation.methode && (
                  <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: "4rem" }}>
                    <h2 style={{ fontSize: "var(--font-35)", fontWeight: 900, marginBottom: "1.5rem", color: "#fff", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>
                      Méthode <span style={{ color: accent }}>pédagogique</span>
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "var(--font-18)", fontFamily: "var(--font-body)" }}>{formation.methode}</p>
                  </motion.section>
                )}
              </div>

              {/* Right — Sidebar */}
              <div style={{ position: "sticky", top: "7rem" }}>
                {/* Prérequis */}
                {formation.prerequis && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15, duration: 0.55 }}
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem", padding: "1.75rem 2rem", marginBottom: "1.5rem" }}
                  >
                    <h3 style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem", fontFamily: "var(--font-body)" }}>
                      Prérequis
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", margin: 0, lineHeight: 1.65, fontFamily: "var(--font-body)" }}>{formation.prerequis}</p>
                  </motion.div>
                )}

                {/* Livrables */}
                {formation.livrables?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.55 }}
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}33`, borderRadius: "0.75rem", padding: "2rem", marginBottom: "2rem" }}
                  >
                    <h3 style={{ fontSize: "1.1rem", color: accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-body)" }}>
                      Ce que vous repartez avec
                    </h3>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {formation.livrables.map((l, i) => (
                        <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                          <CheckCircle2 size={22} color={accent} style={{ flexShrink: 0, marginTop: "0.1em" }} />
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "var(--font-18)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                
                {/* Parcours */}
                {formation.parcours && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
                    style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}22`, borderRadius: "0.75rem" }}
                  >
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>🎓 Parcours</p>
                    <p style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 600, margin: 0 }}>{formation.parcours}</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Final CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                marginTop: "6rem",
                padding: "5rem 2rem",
                background: `linear-gradient(to bottom, transparent, ${accent}11, transparent)`,
                borderTop: `1px solid ${accent}11`,
                borderBottom: `1px solid ${accent}11`,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <h2 style={{ fontSize: "var(--font-40)", fontWeight: 900, marginBottom: "2rem", color: "#fff", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>
                Prêt à intégrer le <span style={{ color: accent }}>futur</span> ?
              </h2>
              <CTAButton onClick={() => setIsModalOpen(true)}>
                S&apos;inscrire à cette formation
              </CTAButton>
              <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                Accompagnement personnalisé et réponse sous 48h
              </p>
            </motion.div>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}
              style={{ marginTop: "6rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Link href="/formations" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Retour au catalogue de formations
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <FooterStrip />

      <style>{`
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: ${ORANGE} !important;
          width: 20px !important;
          border-radius: 4px !important;
        }
        .swiper-button-prev-custom:hover, .swiper-button-next-custom:hover {
          background: ${ORANGE} !important;
          border-color: ${ORANGE} !important;
          transform: translateY(-50%) scale(1.1) !important;
        }
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>

      <FormationInscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formationTitle={formation?.title ?? slug}
        formationSlug={slug}
      />
    </div>
  );
}
