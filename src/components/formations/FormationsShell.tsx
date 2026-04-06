"use client";

/**
 * FormationsShell — Page catalogue de formations IA
 * Source de données : Shopify Storefront API exclusivement
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  Clock,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  Tag,
  Loader2,
  AlertCircle,
  Grid3x3,
  List as ListIcon,
  RefreshCw,
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";

/* ── Background layers ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain      = dynamic(() => import("@/components/home2/Grain"),        { ssr: false });
const Cursor     = dynamic(() => import("@/components/home2/Cursor"),       { ssr: false });

const COLOR = "#D35400";

/** Helper : couleur selon le niveau */
function getNiveauColor(niveau: string = ""): string {
  if (niveau.includes("Initiation") || niveau.includes("Débutant")) return "#E67E22";
  if (niveau.includes("Intermédiaire"))                              return "#D35400";
  if (niveau.includes("Avancé"))                                     return "#A04000";
  return "#D35400";
}

// ── Type ─────────────────────────────────────────────────────────────────────
interface FormationCardData {
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
}

export default function FormationsShell() {
  const [formationsData, setFormationsData] = useState<FormationCardData[]>([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [fetchError, setFetchError]         = useState(false);

  const loadFromShopify = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch("/api/shopify/formations");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFormationsData(json.formations ?? []);
    } catch (err) {
      console.error("[FormationsShell] Shopify fetch failed:", err);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFromShopify();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("Toutes");
  const [selectedSecteur, setSelectedSecteur] = useState("Tous");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Extraire les options de filtrage dynamiquement
  const categories = useMemo(() => [
    "Toutes",
    ...Array.from(new Set(formationsData.map(f => f.categorie).filter(Boolean)))
  ], [formationsData]);

  const secteurs = useMemo(() => [
    "Tous",
    ...Array.from(new Set(formationsData.map(f => f.secteur).filter(Boolean)))
  ], [formationsData]);

  const niveaux = useMemo(() => [
    "Tous",
    ...Array.from(new Set(formationsData.map(f => f.niveau).filter(Boolean)))
  ], [formationsData]);

  // Filtrage et tri
  const filteredFormations = useMemo(() => {
    let filtered = formationsData.filter(f => {
      const title = f.title?.toLowerCase() || "";
      const accroche = f.accroche?.toLowerCase() || "";
      const secteur = f.secteur?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();

      const matchSearch = searchQuery === "" ||
        title.includes(search) ||
        accroche.includes(search) ||
        secteur.includes(search);

      const matchCategorie = selectedCategorie === "Toutes" || f.categorie === selectedCategorie;
      const matchSecteur = selectedSecteur === "Tous" || f.secteur === selectedSecteur;
      const matchNiveau = selectedNiveau === "Tous" || f.niveau === selectedNiveau;

      return matchSearch && matchCategorie && matchSecteur && matchNiveau;
    });

    return filtered;
  }, [formationsData, searchQuery, selectedCategorie, selectedSecteur, selectedNiveau]);

  return (
    <div style={{
      background: '#070E1C',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      color: '#fff',
    }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HERO */}
        <section style={{ padding: "8rem clamp(1.5rem, 5vw, 6rem) 4rem", position: "relative" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", opacity: 0.6 }}>
              <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
              <ChevronRight size={16} />
              <span style={{ color: COLOR }}>Formations</span>
            </motion.nav>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Sparkles size={36} color={COLOR} />
                <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, textTransform: "uppercase", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                  Catalogue de <span style={{ color: COLOR }}>Formations</span>
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem", maxWidth: "800px", marginTop: "1.5rem", lineHeight: 1.6 }}>
                Développez vos compétences avec nos programmes intensifs conçus pour le monde de l'IA.
              </p>
            </motion.div>

            {/* SEARCH */}
            <div style={{ marginTop: "3rem", position: "relative", maxWidth: "800px" }}>
              <Search style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
              <input 
                type="text" 
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "1.2rem 1.2rem 1.2rem 3.5rem", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLOR}40`, borderRadius: "0.75rem", color: "#fff", outline: "none" }}
              />
            </div>
          </div>
        </section>

        {/* FILTERS BAR */}
        <section style={{ padding: "1.5rem clamp(1.5rem, 5vw, 6rem)", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            {/* Compteur + source badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                <span style={{ color: COLOR, fontWeight: 700 }}>{filteredFormations.length}</span> formations trouvées
              </p>

              {/* Badge statut Shopify */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.3rem 0.8rem",
                borderRadius: "2rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: isLoading ? "rgba(255,255,255,0.05)" : fetchError ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.12)",
                border: `1px solid ${isLoading ? "rgba(255,255,255,0.1)" : fetchError ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                color: isLoading ? "rgba(255,255,255,0.4)" : fetchError ? "#f87171" : "#4ade80",
              }}>
                {isLoading  && <Loader2 size={10} className="animate-spin" />}
                {!isLoading && !fetchError && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />}
                {!isLoading &&  fetchError && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />}
                {isLoading ? "Chargement Shopify…" : fetchError ? "Erreur Shopify" : "Shopify"}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: showFilters ? COLOR : "rgba(255,255,255,0.05)", border: "none", borderRadius: "0.5rem", color: "#fff", cursor: "pointer", transition: "0.2s" }}
              >
                <Filter size={18} />
                Filtres
              </button>
              
              <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", padding: "0.25rem", borderRadius: "0.5rem" }}>
                <button onClick={() => setViewMode("grid")} style={{ padding: "0.5rem", background: viewMode === "grid" ? COLOR : "transparent", border: "none", borderRadius: "0.4rem", color: "#fff", cursor: "pointer" }}><Grid3x3 size={20}/></button>
                <button onClick={() => setViewMode("list")} style={{ padding: "0.5rem", background: viewMode === "list" ? COLOR : "transparent", border: "none", borderRadius: "0.4rem", color: "#fff", cursor: "pointer" }}><ListIcon size={20}/></button>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS PANEL */}
        <AnimatePresence>
          {showFilters && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", background: "rgba(255,255,255,0.01)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem clamp(1.5rem, 5vw, 6rem)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: COLOR, fontWeight: 700 }}>Catégorie</label>
                  <select value={selectedCategorie} onChange={(e) => setSelectedCategorie(e.target.value)} style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "0.4rem" }}>
                    {categories.map(c => <option key={c} value={c} style={{ background: "#070E1C" }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: COLOR, fontWeight: 700 }}>Secteur</label>
                  <select value={selectedSecteur} onChange={(e) => setSelectedSecteur(e.target.value)} style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "0.4rem" }}>
                    {secteurs.map(s => <option key={s} value={s} style={{ background: "#070E1C" }}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: COLOR, fontWeight: 700 }}>Niveau</label>
                  <select value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)} style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "0.4rem" }}>
                    {niveaux.map(n => <option key={n} value={n} style={{ background: "#070E1C" }}>{n}</option>)}
                  </select>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        <section style={{ padding: "4rem clamp(1.5rem, 5vw, 6rem)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

            {/* ── Erreur Shopify ── */}
            {fetchError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem 1.75rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <AlertCircle size={20} color="#f87171" />
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}>
                    Impossible de charger les formations depuis Shopify.
                  </p>
                </div>
                <button
                  onClick={loadFromShopify}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.2rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.4rem", color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  <RefreshCw size={14} /> Réessayer
                </button>
              </motion.div>
            )}

            {/* ── Squelette de chargement ── */}
            {isLoading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "2.5rem" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem", overflow: "hidden" }}>
                    <div style={{ height: 240, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ height: 12, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 6 }} />
                      <div style={{ height: 20, width: "80%", background: "rgba(255,255,255,0.08)", borderRadius: 6 }} />
                      <div style={{ height: 14, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 6 }} />
                      <div style={{ height: 14, width: "70%", background: "rgba(255,255,255,0.05)", borderRadius: 6 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Grille des formations ── */}
            {!isLoading && !fetchError && (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(380px, 1fr))" : "1fr",
                  gap: "2.5rem"
                }}>
                  {filteredFormations.map((f) => (
                    <FormationCard key={f.id} formation={f} viewMode={viewMode} />
                  ))}
                </div>

                {filteredFormations.length === 0 && (
                  <div style={{ textAlign: "center", padding: "4rem" }}>
                    <BookOpen size={48} color={COLOR} style={{ opacity: 0.3, marginBottom: "1.5rem" }}/>
                    <h3>Aucun résultat pour cette recherche</h3>
                    <button onClick={() => { setSearchQuery(""); setSelectedCategorie("Toutes"); setSelectedSecteur("Tous"); setSelectedNiveau("Tous"); }} style={{ marginTop: "1rem", color: COLOR, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Réinitialiser les filtres</button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <FooterStrip />
      </div>
    </div>
  );
}

function FormationCard({ formation, viewMode }: { formation: any; viewMode: "grid" | "list" }) {
  const niveauValue = formation.niveau;
  const secteurValue = formation.secteur;
  const accrocheValue = formation.accroche;
  const dureeValue = formation.duree;
  const formatValue = formation.format;
  const priceValue = formation.prix || "Nous consulter";
  const imageUrl = formation.imageUrl;
  const handle = formation.slug;

  const color = getNiveauColor(niveauValue);

  return (
    <motion.div 
      layout
      whileHover={{ y: -8 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: viewMode === "grid" ? "column" : "row",
        position: "relative"
      }}
    >
      {/* Badge Niveau */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1, padding: "0.3rem 0.8rem", background: `${color}cc`, backdropFilter: "blur(4px)", borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
        {niveauValue || "Débutant"}
      </div>

      {/* Image */}
      <div style={{ 
        width: viewMode === "grid" ? "100%" : "300px", 
        height: viewMode === "grid" ? "240px" : "100%", 
        minHeight: "240px",
        background: `linear-gradient(45deg, #0f172a, #1e293b), url(${imageUrl}) center/cover`,
        backgroundBlendMode: "overlay"
      }} />

      {/* Content */}
      <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Tag size={14} color={COLOR}/>
          <span style={{ fontSize: "0.8rem", color: COLOR, fontWeight: 700, textTransform: "uppercase" }}>{secteurValue || "Transversal"}</span>
        </div>

        <h3 style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "var(--font-display)", marginBottom: "1rem" }}>{formation.title}</h3>
        
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {accrocheValue || "Une formation pratique pour maîtriser les outils de demain."}
        </p>

        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", opacity: 0.6 }}>
              <Clock size={16} color={COLOR} />
              <span style={{ fontSize: "0.9rem" }}>{dureeValue || "7h"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", opacity: 0.6 }}>
              <Users size={16} color={COLOR} />
              <span style={{ fontSize: "0.9rem" }}>{formatValue || "Présentiel"}</span>
            </div>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: COLOR }}>{priceValue}</div>
          </div>
        </div>

        <Link href={`/formations/${handle}`} style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "0.9rem", textTransform: "uppercase" }}>
          Découvrir le programme 
          <ChevronRight size={18} color={COLOR} />
        </Link>
      </div>
    </motion.div>
  );
}
