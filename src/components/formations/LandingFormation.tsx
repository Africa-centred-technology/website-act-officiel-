"use client";

/**
 * LandingFormation — Page landing dynamique pour une formation spécifique.
 *
 * MAPPING Shopify → UI
 * ─────────────────────────────────────────────────────────────────
 * Hero
 *   SectionLabel     ← secteur + duree + "ATTESTATION ACT"
 *   H1               ← title
 *   Sous-titre       ← accroche
 *   Stat 1           ← duree
 *   Stat 2           ← programme.length  (modules)
 *   Stat 3           ← "≤12"  (statique)
 *   Stat 4           ← format
 *   Image hero       ← images[0] || imageUrl
 *   Badge            ← format · secteur
 *
 * "Ce que vous allez maîtriser" (4 cartes visuelles)
 *                    ← objectifs[0..3]
 *   Fallback si vide ← publicCible + methode
 *
 * Programme
 *   module.title     ← programme[i].module
 *   module.details   ← programme[i].details (puces)
 *   module.duree     ← programme[i].duree   (si dispo)
 *   Image sticky     ← images[1] || images[0] || imageUrl
 *
 * Livrables          ← livrables[]
 *   Image            ← images[2] || images[1] || imageUrl
 *
 * Pour qui
 *   Pills            ← publicCible  (split · , \n)
 *   Prérequis        ← prerequis
 *
 * CTA final
 *   Prix             ← prix
 *   Titre            ← title
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import FormationInscriptionModal from "@/components/formations/FormationInscriptionModal";

/* ─────────────────────────────────────────────────────────────────
   TYPE (aligné sur ShopifyFormationDetail de formations.ts)
───────────────────────────────────────────────────────────────── */
interface FormationData {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  prix: string;
  accroche: string;
  imageUrl?: string;
  images?: string[];
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: { module: string; details: string[]; duree?: string }[];
  livrables: string[];
  methode: string;
  descriptionHtml?: string;
}

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────── */
const ORANGE   = "#D35400";
const DARK     = "#0A1410";
const CARD_BG  = "rgba(255,255,255,0.03)";
const BORDER   = "rgba(255,255,255,0.06)";
const TEXT_GRAY = "rgba(255,255,255,0.6)";

/* ─────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────── */
function Grain() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.028,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "180px",
    }} />
  );
}

const SectionLabel = ({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) => (
  <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start", marginBottom: "1.5rem" }}>
    <span style={{
      fontSize: "1rem", fontWeight: 700, letterSpacing: "0.15em", color: ORANGE,
      textTransform: "uppercase", border: `1px solid ${ORANGE}44`, background: `${ORANGE}11`,
      padding: "10px 20px", borderRadius: "99px",
      display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-body)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE }} />
      {children}
    </span>
  </div>
);

function PrimaryBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "1.2rem 2.8rem", borderRadius: "10px", fontWeight: 800, fontSize: "1.1rem",
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px",
        background: hov ? "#e05c10" : ORANGE, color: "#000", border: "none",
        transition: "all 0.25s ease", transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 12px 36px ${ORANGE}44` : "none",
        fontFamily: "var(--font-body)",
      }}>
      {children}
      <span style={{ display: "inline-block", transition: "transform 0.3s", transform: hov ? "rotate(45deg)" : "rotate(0deg)" }}>
        <ArrowRight size={20} />
      </span>
    </button>
  );
}

function OutlineBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "1.2rem 2.8rem", borderRadius: "10px", fontWeight: 700, fontSize: "1.1rem",
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px",
        background: "transparent", color: "#fff",
        border: `1px solid ${hov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)"}`,
        transition: "all 0.25s ease",
        fontFamily: "var(--font-body)",
      }}>
      {children}
    </button>
  );
}

/* ── Skeleton (affichage pendant le chargement) ─── */
function SkeletonLine({ w = "100%", h = 14 }: { w?: string; h?: number }) {
  return <div style={{ width: w, height: h, background: "rgba(255,255,255,0.07)", borderRadius: 6, animation: "pulse 1.6s ease-in-out infinite" }} />;
}

function PageSkeleton() {
  return (
    <div style={{ padding: "200px 6% 100px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "100px", marginBottom: "6rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <SkeletonLine w="40%" h={12} />
          <SkeletonLine w="85%" h={48} />
          <SkeletonLine w="90%" h={48} />
          <SkeletonLine w="95%" h={20} />
          <SkeletonLine w="80%" h={20} />
        </div>
        <div style={{ height: 400, background: "rgba(255,255,255,0.04)", borderRadius: "14px" }} />
      </div>
      <div style={{ height: 1, background: BORDER, marginBottom: "6rem" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 900 }}>
        {[1,2,3,4].map(i => <SkeletonLine key={i} w={`${70 + i * 5}%`} h={14} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function LandingFormation({ slug }: { slug: string }) {
  const [data,      setData]      = useState<FormationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);
  const [isModal,   setIsModal]   = useState(false);

  const load = async () => {
    setIsLoading(true); setHasError(false);
    try {
      const res = await fetch(`/api/shopify/formations/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.formation ?? null);
    } catch (err) {
      console.error("[LandingFormation] fetch failed:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [slug]);

  /* ── Dérivées depuis les données Shopify ─────────────── */
  const heroImage  = data?.images?.[0]  || data?.imageUrl  || null;
  const progImage  = data?.images?.[1]  || heroImage;
  const livrImage  = data?.images?.[2]  || data?.images?.[1] || heroImage;

  // Pills "Pour qui" : split publicCible sur · , ou saut de ligne
  const pills = data?.publicCible
    ? data.publicCible.split(/[·,\n]/).map(s => s.trim()).filter(s => s.length > 1)
    : [];

  // Cartes "Ce que vous allez maîtriser" : les 4 premiers objectifs
  const objCards = (data?.objectifs ?? []).slice(0, 4);

  // Stats du hero
  const heroStats = data ? [
    { val: data.duree  || "1j",                           lab: "de pratique intensive"   },
    { val: `${data.programme.length || "—"} modules`,    lab: "progressifs"             },
    { val: "≤12",                                         lab: "apprenants / session"    },
    { val: data.format || "100%",                         lab: data.format ? "format" : "cas métier réels" },
  ] : [];

  // Label eyebrow hero
  const eyebrow = [data?.secteur, data?.duree, "ATTESTATION ACT"].filter(Boolean).join(" · ").toUpperCase();

  return (
    <div style={{ background: DARK, color: "#fff", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
      `}</style>

      <Grain />
      <Header />

      {/* ── LOADING ─────────────────────────────────────── */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "240px 6% 100px", gap: "1.5rem" }}>
          <Loader2 size={40} color={ORANGE} style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ color: TEXT_GRAY, fontSize: "1.1rem" }}>Chargement de la formation…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── ERROR ───────────────────────────────────────── */}
      {hasError && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "240px 6% 100px", gap: "1.5rem", textAlign: "center" }}>
          <AlertCircle size={48} color="#f87171" />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Impossible de charger cette formation</h2>
          <p style={{ color: TEXT_GRAY }}>Vérifiez votre connexion ou réessayez.</p>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.5rem", color: "#fff", cursor: "pointer", fontSize: "1rem" }}>
            <RefreshCw size={16} /> Réessayer
          </button>
        </div>
      )}

      {/* ── CONTENT ─────────────────────────────────────── */}
      {!isLoading && !hasError && data && (
        <>
          {/* ══ HERO ═══════════════════════════════════════ */}
          <section style={{ position: "relative", padding: "120px 6% 140px", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
            {/* Grid bg */}
            <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`, backgroundSize: "80px 80px" }} />
            {/* Glow */}
            <div aria-hidden style={{ position: "absolute", top: "35%", left: "60%", width: "60vw", height: "50vw", background: "radial-gradient(ellipse,rgba(211,84,0,0.07) 0%,transparent 65%)", transform: "translate(-50%,-50%)" }} />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "100px", alignItems: "center" }}>

              {/* Left */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                {/* ← secteur · duree · ATTESTATION ACT */}
                <SectionLabel>{eyebrow || "FORMATION · ATTESTATION ACT"}</SectionLabel>

                {/* ← title */}
                <h1 style={{ fontSize: "clamp(3.2rem, 6vw, 4.8rem)", lineHeight: 1.1, fontWeight: 800, marginBottom: "2rem", fontFamily: "var(--font-display)" }}>
                  {data.title}
                </h1>

                {/* ← accroche */}
                <p style={{ color: TEXT_GRAY, fontSize: "clamp(1.15rem, 1.8vw, 1.3rem)", lineHeight: 1.8, maxWidth: "640px", marginBottom: "3.5rem" }}>
                  {data.accroche}
                </p>

                <div style={{ display: "flex", gap: "20px", marginBottom: "5rem", flexWrap: "wrap" }}>
                  <PrimaryBtn onClick={() => setIsModal(true)}>Réserver ma place</PrimaryBtn>
                  <OutlineBtn onClick={() => document.getElementById("programme")?.scrollIntoView({ behavior: "smooth" })}>
                    Voir le programme
                  </OutlineBtn>
                </div>

                {/* ← duree / programme.length / ≤12 / format */}
                <div style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
                  {heroStats.map((s, i) => (
                    <div key={i}>
                      <div style={{ color: ORANGE, fontSize: "2.8rem", fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.val}</div>
                      <div style={{ color: TEXT_GRAY, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginTop: "0.3rem" }}>{s.lab}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right — image Shopify */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: "relative" }}>
                <div style={{ height: "400px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.03)" }}>
                  {heroImage ? (
                    <img src={heroImage} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: `${ORANGE}08` }}>
                      <span style={{ fontSize: "4rem" }}>🎓</span>
                    </div>
                  )}
                </div>
                {/* Badge ← format · secteur */}
                <div style={{ position: "absolute", bottom: "20px", left: "20px", background: "rgba(10,20,16,0.88)", backdropFilter: "blur(10px)", border: `1px solid ${ORANGE}`, padding: "16px 20px", borderRadius: "12px" }}>
                  <div style={{ color: ORANGE, fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>{data.format || "Formation intensive"}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{data.secteur} · Petits groupes · Attestation ACT</div>
                </div>
              </motion.div>
            </div>
          </section>

          <div style={{ height: "1px", background: BORDER }} />

          {/* ══ CE QUE VOUS ALLEZ MAÎTRISER ═══════════════ */}
          {/* ← objectifs[0..3]  (fallback : publicCible + methode) */}
          <section style={{ padding: "120px 6%", textAlign: "center" }}>
            <div style={{ marginBottom: "80px" }}>
              <SectionLabel centered>Objectifs pédagogiques</SectionLabel>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, marginBottom: "2rem", fontFamily: "var(--font-display)" }}>
                Ce que vous allez maîtriser
              </h2>
              {data.methode && (
                <p style={{ color: TEXT_GRAY, maxWidth: "850px", margin: "0 auto", fontSize: "clamp(1.1rem, 1.5vw, 1.25rem)", lineHeight: 1.7 }}>
                  {data.methode}
                </p>
              )}
            </div>

            {objCards.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px", maxWidth: "1200px", margin: "0 auto" }}>
                {objCards.map((obj, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ background: CARD_BG, borderRadius: "16px", border: `1px solid ${BORDER}`, padding: "35px", textAlign: "left", transition: "border-color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${ORANGE}66`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORDER}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${ORANGE}15`, border: `1px solid ${ORANGE}44`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                      <span style={{ color: ORANGE, fontWeight: 800, fontSize: "1rem", fontFamily: "var(--font-display)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", lineHeight: 1.7, margin: 0 }}>{obj}</p>
                  </motion.div>
                ))}
              </div>
            ) : data.publicCible ? (
              <div style={{ maxWidth: "800px", margin: "0 auto", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "40px" }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.2rem", lineHeight: 1.8, margin: 0 }}>{data.publicCible}</p>
              </div>
            ) : null}
          </section>

          <div style={{ height: "1px", background: BORDER }} />

          {/* ══ PROGRAMME ══════════════════════════════════ */}
          {/* ← programme[].module / details / duree */}
          <section id="programme" style={{ padding: "120px 6%" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 420px", gap: "120px" }}>
              <div>
                <SectionLabel>Le programme</SectionLabel>

                {data.programme.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {data.programme.map((mod, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        style={{ display: "flex", gap: "40px", padding: "40px 0", borderBottom: `1px solid ${BORDER}` }}
                      >
                        {/* ← index */}
                        <div style={{ minWidth: "56px", height: "56px", borderRadius: "50%", border: `1px solid ${ORANGE}`, background: `${ORANGE}11`, display: "flex", alignItems: "center", justifyContent: "center", color: ORANGE, fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div style={{ flex: 1 }}>
                          {/* ← module */}
                          <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px", fontFamily: "var(--font-body)" }}>{mod.module}</h3>
                          {/* ← details */}
                          {mod.details.length > 0 && (
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {mod.details.map((d, j) => (
                                <li key={j} style={{ color: TEXT_GRAY, fontSize: "1.05rem", lineHeight: 1.6, display: "flex", gap: "0.65rem" }}>
                                  <span style={{ color: ORANGE, flexShrink: 0 }}>›</span> {d}
                                </li>
                              ))}
                            </ul>
                          )}
                          {/* ← duree (si disponible dans Shopify) */}
                          {mod.duree && (
                            <span style={{ color: ORANGE, fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{mod.duree}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : data.descriptionHtml ? (
                  <div
                    style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "1.15rem" }}
                    dangerouslySetInnerHTML={{ __html: data.descriptionHtml }}
                  />
                ) : (
                  <p style={{ color: TEXT_GRAY, fontSize: "1.1rem" }}>Programme détaillé bientôt disponible.</p>
                )}
              </div>

              {/* Sticky image ← images[1] || images[0] */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "sticky", top: "140px" }}>
                  <div style={{ height: "580px", borderRadius: "16px", overflow: "hidden", marginBottom: "25px", background: `${ORANGE}08`, border: `1px solid ${BORDER}` }}>
                    {progImage ? (
                      <img src={progImage} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>📚</div>
                    )}
                  </div>
                  <p style={{ textAlign: "center", color: TEXT_GRAY, fontSize: "1.05rem", fontStyle: "italic" }}>
                    Chaque module alterne concept et atelier pratique
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══ LIVRABLES ══════════════════════════════════ */}
          {/* ← livrables[] */}
          {data.livrables.length > 0 && (
            <section style={{ padding: "120px 6%", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px", alignItems: "center" }}>
                <div style={{ background: CARD_BG, border: `1px solid ${ORANGE}33`, padding: "60px", borderRadius: "24px" }}>
                  <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "40px", fontFamily: "var(--font-display)" }}>
                    Ce que vous repartez avec
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    {data.livrables.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                        <div style={{ minWidth: "30px", height: "30px", borderRadius: "50%", background: `${ORANGE}22`, border: `1px solid ${ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                          <Check size={16} color={ORANGE} />
                        </div>
                        <span style={{ fontSize: "1.15rem", lineHeight: 1.65, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: "450px", borderRadius: "16px", overflow: "hidden", background: `${ORANGE}06`, border: `1px solid ${BORDER}` }}>
                  {livrImage ? (
                    <img src={livrImage} alt="Livrables" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🎁</div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ POUR QUI ════════════════════════════════════ */}
          {/* ← publicCible (pills) + prerequis */}
          <section style={{ padding: "120px 6%", textAlign: "center" }}>
            <SectionLabel centered>Pour qui</SectionLabel>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, marginBottom: "2rem", fontFamily: "var(--font-display)" }}>
              Cette formation est faite pour vous
            </h2>

            {/* Prérequis ← prerequis */}
            {data.prerequis && (
              <p style={{ color: TEXT_GRAY, maxWidth: "850px", margin: "0 auto 4rem", fontSize: "clamp(1.1rem, 1.5vw, 1.25rem)", lineHeight: 1.8 }}>
                <strong style={{ color: "rgba(255,255,255,0.7)" }}>Prérequis :</strong> {data.prerequis}
              </p>
            )}

            {/* Pills ← publicCible split */}
            {pills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", maxWidth: "1100px", margin: "0 auto" }}>
                {pills.map((pill, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    style={{ padding: "14px 28px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: "99px", fontSize: "1.1rem", fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>
                    {pill}
                  </motion.span>
                ))}
              </div>
            ) : data.publicCible ? (
              <p style={{ color: TEXT_GRAY, maxWidth: "700px", margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.8 }}>{data.publicCible}</p>
            ) : null}
          </section>

          {/* ══ CTA FINAL ══════════════════════════════════ */}
          {/* ← title, prix */}
          <section style={{ padding: "120px 6%" }}>
            <div style={{ background: "linear-gradient(135deg, #1a1400 0%, #2a1f00 100%)", border: `2px solid ${ORANGE}`, borderRadius: "24px", padding: "100px 40px", textAlign: "center" }}>
              <h2 style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                Prêt à maîtriser<br />
                <span style={{ color: ORANGE }}>{data.title}</span> ?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(1.2rem, 2vw, 1.4rem)", marginBottom: "1.5rem", lineHeight: 1.8 }}>
                Une journée. Des méthodes concrètes. Des compétences applicables dès demain.
              </p>

              {/* ← prix */}
              {data.prix && (
                <div style={{ display: "inline-block", padding: "12px 32px", background: `${ORANGE}15`, border: `1px solid ${ORANGE}44`, borderRadius: "99px", marginBottom: "3rem" }}>
                  <span style={{ color: ORANGE, fontWeight: 800, fontSize: "1.6rem", fontFamily: "var(--font-display)" }}>{data.prix}</span>
                  <span style={{ color: TEXT_GRAY, fontSize: "1rem", marginLeft: "8px" }}>par participant</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "36px", flexWrap: "wrap" }}>
                <PrimaryBtn onClick={() => setIsModal(true)}>Réserver ma place</PrimaryBtn>
              </div>
              <p style={{ color: TEXT_GRAY, fontSize: "1rem", fontWeight: 500 }}>
                ✓ Réponse sous 24h · ✓ Sans engagement · ✓ Satisfait ou remboursé 7 jours
              </p>
            </div>
          </section>

          {/* ══ FOOTER ══════════════════════════════════════ */}
          <footer style={{ padding: "60px 6%", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
              <span style={{ color: ORANGE }}>ACT</span>{" "}
              <span style={{ color: "#fff", fontWeight: 300 }}>· Africa Centred Technology</span>
            </div>
            <div style={{ color: TEXT_GRAY, fontSize: "1rem" }}>Casablanca · contact@act.africa</div>
          </footer>
        </>
      )}

      <FormationInscriptionModal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        formationTitle={data?.title ?? slug}
        formationSlug={slug}
      />
    </div>
  );
}
