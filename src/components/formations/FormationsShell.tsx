"use client";

/**
 * FormationsShell — Page catalogue de formations IA
 * Design unique avec système de filtres, recherche et catalogue interactif
 */

import React, { useState, useMemo } from "react";
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
  X,
  Grid3x3,
  List,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import { FORMATIONS, type Formation } from "@/lib/data/formations";
import FooterStrip from "@/components/layout/FooterStrip";

/* ── Background layers ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

const COLOR = "#D35400"; // Orange principal d'ACT
const ACCENT = "#E67E22"; // Accent plus clair

// Catégories disponibles
const categories = [
  "Toutes",
  ...Array.from(new Set(FORMATIONS.map(f => f.categorie)))
];

// Secteurs disponibles
const secteurs = [
  "Tous",
  ...Array.from(new Set(FORMATIONS.map(f => f.secteur)))
];

// Niveaux disponibles
const niveaux = [
  "Tous",
  ...Array.from(new Set(FORMATIONS.map(f => f.niveau)))
];

const EASE = [0.6, 0.08, 0.02, 0.99] as const;

function getNiveauColor(niveau: string): string {
  if (niveau.includes("Initiation") || niveau.includes("Débutant")) return "#E67E22";
  if (niveau.includes("Intermédiaire")) return "#D35400";
  if (niveau.includes("Avancé")) return "#A04000";
  return "#D35400";
}

export default function FormationsShell() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("Toutes");
  const [selectedSecteur, setSelectedSecteur] = useState("Tous");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrage des formations
  const filteredFormations = useMemo(() => {
    return FORMATIONS.filter(formation => {
      const matchSearch = searchQuery === "" ||
        formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formation.accroche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formation.secteur.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategorie = selectedCategorie === "Toutes" ||
        formation.categorie === selectedCategorie;

      const matchSecteur = selectedSecteur === "Tous" ||
        formation.secteur === selectedSecteur;

      const matchNiveau = selectedNiveau === "Tous" ||
        formation.niveau === selectedNiveau;

      return matchSearch && matchCategorie && matchSecteur && matchNiveau;
    });
  }, [searchQuery, selectedCategorie, selectedSecteur, selectedNiveau]);

  // Stats du catalogue
  const stats = [
    { label: "Formations", value: FORMATIONS.length.toString(), icon: BookOpen },
    { label: "Parcours", value: Array.from(new Set(FORMATIONS.map(f => f.categorie))).length.toString(), icon: Target },
    { label: "Secteurs", value: Array.from(new Set(FORMATIONS.map(f => f.secteur))).length.toString(), icon: Users },
    { label: "Certifications", value: "15+", icon: Award },
  ];

  return (
    <div style={{
      background: '#070E1C',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      color: '#fff',
    }}>
      {/* ── Background layers ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section style={{
          padding: "8rem clamp(1.5rem, 5vw, 6rem) 4rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Gradient accent */}
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
            style={{ background: `${COLOR}20`, filter: 'blur(120px)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                marginBottom: "2rem", fontSize: "0.9rem", letterSpacing: "0.1em",
              }}>
              <Link href="/" style={{ color: "#ffffff80", textDecoration: "none" }}>Accueil</Link>
              <ChevronRight size={16} color="#ffffff40" />
              <span style={{ color: COLOR, fontWeight: 600 }}>Formations</span>
            </motion.nav>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Sparkles size={32} color={COLOR} />
                <h1 style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                }}>
                  Catalogue de <span style={{ color: COLOR }}>Formations</span>
                </h1>
              </div>

              <p style={{
                fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.7)",
                maxWidth: "800px",
                marginBottom: "3rem",
              }}>
                Développez vos compétences en Intelligence Artificielle avec nos formations
                pratiques conçues pour tous les niveaux et tous les secteurs d'activité.
              </p>
            </motion.div>

            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1.5rem",
                marginBottom: "4rem",
              }}>
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}>
                    <Icon size={24} color={COLOR} style={{ margin: "0 auto 0.75rem" }} />
                    <p style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: COLOR,
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                      fontFamily: "var(--font-display)",
                    }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                position: "relative",
                maxWidth: "800px",
                margin: "0 auto",
              }}>
              <Search
                size={20}
                color={COLOR}
                style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Rechercher une formation par titre, secteur ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1.25rem 1.5rem 1.25rem 3.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${COLOR}40`,
                  borderRadius: "1rem",
                  fontSize: "1rem",
                  color: "#fff",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = COLOR;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = `${COLOR}40`;
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "1.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                  <X size={20} />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FILTERS & CONTROLS
        ═══════════════════════════════════════════════════════ */}
        <section style={{
          padding: "2rem clamp(1.5rem, 5vw, 6rem)",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Top bar */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)" }}>
                <strong style={{ color: COLOR }}>{filteredFormations.length}</strong> formation{filteredFormations.length > 1 ? "s" : ""} trouvée{filteredFormations.length > 1 ? "s" : ""}
              </p>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* View mode toggle */}
                <div style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }}>
                  <button
                    onClick={() => setViewMode("grid")}
                    style={{
                      padding: "0.5rem 1rem",
                      background: viewMode === "grid" ? COLOR : "transparent",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}>
                    <Grid3x3 size={16} />
                    Grille
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    style={{
                      padding: "0.5rem 1rem",
                      background: viewMode === "list" ? COLOR : "transparent",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}>
                    <List size={16} />
                    Liste
                  </button>
                </div>

                {/* Filters toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: showFilters ? COLOR : "rgba(255,255,255,0.05)",
                    border: `1px solid ${showFilters ? COLOR : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "0.5rem",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}>
                  <Filter size={16} />
                  Filtres
                </button>
              </div>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ overflow: "hidden" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "2rem",
                  }}>
                    {/* Secteur */}
                    <div>
                      <label style={{
                        display: "block",
                        marginBottom: "0.75rem",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: COLOR,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}>
                        Secteur
                      </label>
                      <select
                        value={selectedSecteur}
                        onChange={(e) => setSelectedSecteur(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}>
                        {secteurs.map(secteur => (
                          <option key={secteur} value={secteur} style={{ background: "#0A1410" }}>
                            {secteur}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Niveau */}
                    <div>
                      <label style={{
                        display: "block",
                        marginBottom: "0.75rem",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: COLOR,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}>
                        Niveau
                      </label>
                      <select
                        value={selectedNiveau}
                        onChange={(e) => setSelectedNiveau(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}>
                        {niveaux.map(niveau => (
                          <option key={niveau} value={niveau} style={{ background: "#0A1410" }}>
                            {niveau}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reset button */}
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <button
                        onClick={() => {
                          setSelectedCategorie("Toutes");
                          setSelectedSecteur("Tous");
                          setSelectedNiveau("Tous");
                          setSearchQuery("");
                        }}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "0.5rem",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = ACCENT;
                          e.currentTarget.style.borderColor = ACCENT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        }}>
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CATALOGUE DE FORMATIONS
        ═══════════════════════════════════════════════════════ */}
        <section style={{
          padding: "4rem clamp(1.5rem, 5vw, 6rem)",
          minHeight: "60vh",
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <AnimatePresence mode="wait">
              {filteredFormations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                  }}>
                  <BookOpen size={64} color={COLOR} style={{ margin: "0 auto 1.5rem", opacity: 0.5 }} />
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    color: "#fff",
                  }}>
                    Aucune formation trouvée
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategorie("Toutes");
                      setSelectedSecteur("Tous");
                      setSelectedNiveau("Tous");
                      setSearchQuery("");
                    }}
                    style={{
                      padding: "1rem 2rem",
                      background: COLOR,
                      border: "none",
                      borderRadius: "0.5rem",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}>
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  style={{
                    display: "grid",
                    gridTemplateColumns: viewMode === "grid"
                      ? "repeat(auto-fill, minmax(min(100%, 380px), 1fr))"
                      : "1fr",
                    gap: "2rem",
                  }}>
                  {filteredFormations.map((formation) => (
                    <FormationCard
                      key={formation.id}
                      formation={formation}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <FooterStrip />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FORMATION CARD COMPONENT
   ═══════════════════════════════════════════════════════ */
function FormationCard({ formation, viewMode }: { formation: Formation; viewMode: "grid" | "list" }) {
  const niveauColor = getNiveauColor(formation.niveau);

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ x: 8 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: `4px solid ${niveauColor}`,
          borderRadius: "0.75rem",
          padding: "2rem",
          cursor: "pointer",
        }}>
        <Link href={`/formations/${formation.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              {/* Tags */}
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <span style={{
                  padding: "0.35rem 0.75rem",
                  background: `${niveauColor}20`,
                  color: niveauColor,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "0.375rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  {formation.niveau}
                </span>
                <span style={{
                  padding: "0.35rem 0.75rem",
                  background: `${COLOR}20`,
                  color: COLOR,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "0.375rem",
                }}>
                  {formation.secteur}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "0.75rem",
                color: "#fff",
                fontFamily: "var(--font-display)",
              }}>
                {formation.title}
              </h3>

              {/* Accroche */}
              <p style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.65)",
                marginBottom: "1rem",
              }}>
                {formation.accroche.substring(0, 150)}...
              </p>

              {/* Meta info */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock size={16} color={COLOR} />
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
                    {formation.duree}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Users size={16} color={COLOR} />
                  <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
                    {formation.format}
                  </span>
                </div>
                {formation.parcours && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <TrendingUp size={16} color={COLOR} />
                    <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
                      {formation.parcours}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: COLOR,
              fontWeight: 700,
              fontSize: "0.95rem",
              whiteSpace: "nowrap",
            }}>
              Voir détails
              <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: `3px solid ${niveauColor}`,
        borderRadius: "0.75rem",
        padding: "2rem",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}>
      <Link href={`/formations/${formation.slug}`} style={{ textDecoration: "none", color: "inherit", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <span style={{
            padding: "0.35rem 0.75rem",
            background: `${niveauColor}20`,
            color: niveauColor,
            fontSize: "0.7rem",
            fontWeight: 700,
            borderRadius: "0.375rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            {formation.niveau}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: "1.4rem",
          fontWeight: 800,
          marginBottom: "1rem",
          color: "#fff",
          fontFamily: "var(--font-display)",
          lineHeight: 1.2,
        }}>
          {formation.title}
        </h3>

        {/* Secteur */}
        <p style={{
          fontSize: "0.85rem",
          color: COLOR,
          marginBottom: "1rem",
          fontWeight: 600,
        }}>
          {formation.secteur}
        </p>

        {/* Accroche */}
        <p style={{
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.6)",
          marginBottom: "1.5rem",
          flex: 1,
        }}>
          {formation.accroche.substring(0, 120)}...
        </p>

        {/* Meta info */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={16} color={COLOR} />
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              {formation.duree}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={16} color={COLOR} />
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              {formation.format}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <span style={{ color: COLOR, fontWeight: 700, fontSize: "0.9rem" }}>
            En savoir plus
          </span>
          <ChevronRight size={20} color={COLOR} />
        </div>
      </Link>
    </motion.div>
  );
}
