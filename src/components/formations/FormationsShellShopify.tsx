"use client";

/**
 * Version Shopify de FormationsShell
 * Récupère les formations depuis la boutique Shopify
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  ArrowUpDown,
  Grid3x3,
  List,
  Clock,
  BookOpen,
  MapPin,
  X
} from "lucide-react";
import { useShopifyFormations } from "@/hooks/useShopifyFormations";
import { Formation } from "@/lib/data/formations";
import FooterStrip from "@/components/layout/FooterStrip";

const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

const COLOR = "#D35400";

function useMediaQuery() {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize('mobile');
      else if (width >= 768 && width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

export default function FormationsShellShopify() {
  const screenSize = useMediaQuery();

  // Récupérer les formations depuis Shopify
  const { formations, loading, error } = useShopifyFormations(100);

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("Toutes");
  const [selectedSecteur, setSelectedSecteur] = useState("Tous");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Extraire les catégories, secteurs et niveaux uniques
  const categories = useMemo(() => {
    const cats = new Set(formations.map(f => f.categorie));
    return ["Toutes", ...Array.from(cats)];
  }, [formations]);

  const secteurs = useMemo(() => {
    const sects = new Set(formations.map(f => f.secteur));
    return ["Tous", ...Array.from(sects)];
  }, [formations]);

  const niveaux = useMemo(() => {
    const nivs = new Set(formations.map(f => f.niveau));
    return ["Tous", ...Array.from(nivs)];
  }, [formations]);

  // Filtrer et trier les formations
  const filteredFormations = useMemo(() => {
    let filtered = formations.filter(formation => {
      const matchSearch = searchQuery === "" ||
        formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formation.accroche.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategorie = selectedCategorie === "Toutes" || formation.categorie === selectedCategorie;
      const matchSecteur = selectedSecteur === "Tous" || formation.secteur === selectedSecteur;
      const matchNiveau = selectedNiveau === "Tous" || formation.niveau === selectedNiveau;

      return matchSearch && matchCategorie && matchSecteur && matchNiveau;
    });

    // Tri
    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "duree":
        filtered.sort((a, b) => a.duree.localeCompare(b.duree));
        break;
      case "niveau":
        filtered.sort((a, b) => a.niveau.localeCompare(b.niveau));
        break;
      default:
        // Garder l'ordre par défaut (recent)
        break;
    }

    return filtered;
  }, [formations, searchQuery, selectedCategorie, selectedSecteur, selectedNiveau, sortBy]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategorie("Toutes");
    setSelectedSecteur("Tous");
    setSelectedNiveau("Tous");
    setSortBy("recent");
  };

  return (
    <div style={{
      background: '#070E1C',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      color: '#fff',
    }}>
      <WaveTerrain />
      <Cursor />
      <Grain />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero avec recherche */}
        <section style={{
          padding: screenSize === 'mobile' ? '8rem 1.5rem 4rem' : '10rem 4rem 6rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h1 style={{
              fontSize: screenSize === 'mobile' ? 'clamp(2.5rem, 8vw, 4rem)' : 'var(--font-50)',
              fontWeight: 900,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}>
              Catalogue de <span style={{ color: COLOR }}>Formations</span>
            </h1>
            <p style={{
              fontSize: screenSize === 'mobile' ? '1.1rem' : 'var(--font-20)',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '800px',
              margin: '0 auto 3rem',
              fontFamily: 'var(--font-body)',
            }}>
              {loading ? 'Chargement des formations depuis Shopify...' :
               error ? 'Erreur lors du chargement des formations' :
               `Découvrez nos ${formations.length} formations professionnelles conçues pour accélérer votre transformation digitale`}
            </p>

            {/* Barre de recherche */}
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              position: 'relative',
            }}>
              <Search
                size={22}
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.4)',
                }}
              />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.5rem 1.2rem 4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLOR;
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>
          </motion.div>

          {/* Affichage des erreurs */}
          {error && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto 2rem',
              padding: '1.5rem',
              background: 'rgba(231, 76, 60, 0.1)',
              border: '1px solid rgba(231, 76, 60, 0.3)',
              borderRadius: '0.75rem',
              textAlign: 'center',
            }}>
              <p style={{ color: '#e74c3c', fontFamily: 'var(--font-body)' }}>
                ⚠️ {error}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                Vérifiez que Shopify est correctement configuré dans vos variables d'environnement.
              </p>
            </div>
          )}
        </section>

        {/* Filtres et résultats */}
        {!loading && !error && (
          <section style={{
            padding: screenSize === 'mobile' ? '2rem 1.5rem' : '3rem 4rem',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {/* Barre d'actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <ArrowUpDown size={24} color={COLOR} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="recent">Plus récentes</option>
                  <option value="title">Par titre</option>
                  <option value="duree">Par durée</option>
                  <option value="niveau">Par niveau</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: '0.75rem',
                    background: viewMode === "grid" ? COLOR : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (viewMode === "grid" ? COLOR : 'rgba(255,255,255,0.1)'),
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid3x3 size={20} color="#fff" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: '0.75rem',
                    background: viewMode === "list" ? COLOR : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (viewMode === "list" ? COLOR : 'rgba(255,255,255,0.1)'),
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <List size={20} color="#fff" />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    padding: '0.75rem 1.2rem',
                    background: showFilters ? COLOR : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (showFilters ? COLOR : 'rgba(255,255,255,0.1)'),
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <Filter size={22} />
                  Filtres
                </button>
              </div>
            </div>

            {/* Panneau de filtres */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    overflow: 'hidden',
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    padding: '2rem',
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: screenSize === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
                    gap: '1.5rem',
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: COLOR,
                      }}>
                        Catégorie
                      </label>
                      <select
                        value={selectedCategorie}
                        onChange={(e) => setSelectedCategorie(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '1rem',
                          cursor: 'pointer',
                        }}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: COLOR,
                      }}>
                        Secteur
                      </label>
                      <select
                        value={selectedSecteur}
                        onChange={(e) => setSelectedSecteur(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '1rem',
                          cursor: 'pointer',
                        }}
                      >
                        {secteurs.map(sect => (
                          <option key={sect} value={sect}>{sect}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: COLOR,
                      }}>
                        Niveau
                      </label>
                      <select
                        value={selectedNiveau}
                        onChange={(e) => setSelectedNiveau(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '1rem',
                          cursor: 'pointer',
                        }}
                      >
                        {niveaux.map(niv => (
                          <option key={niv} value={niv}>{niv}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={resetFilters}
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <X size={16} />
                    Réinitialiser tout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Résultats */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-body)',
              }}>
                {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} trouvée{filteredFormations.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Liste des formations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === "grid"
                ? (screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')
                : '1fr',
              gap: '2rem',
            }}>
              {filteredFormations.map((formation, i) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  viewMode={viewMode}
                  delay={i * 0.05}
                />
              ))}
            </div>

            {filteredFormations.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'rgba(255,255,255,0.5)',
              }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Aucune formation ne correspond à vos critères
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: COLOR,
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </section>
        )}

        {/* État de chargement */}
        {loading && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: `4px solid ${COLOR}33`,
              borderTop: `4px solid ${COLOR}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{
              marginTop: '1.5rem',
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.7)',
            }}>
              Chargement des formations depuis Shopify...
            </p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        <FooterStrip />
      </div>
    </div>
  );
}

// Composant carte de formation
function FormationCard({ formation, viewMode, delay }: { formation: Formation; viewMode: "grid" | "list"; delay: number }) {
  const niveauColors: Record<string, string> = {
    "Initiation": "#3498db",
    "Intermédiaire": "#f39c12",
    "Avancé": "#e74c3c",
    "Expert": "#9b59b6",
  };

  const niveauColor = niveauColors[formation.niveau] || "#95a5a6";

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeft: `4px solid ${niveauColor}`,
          borderRadius: '0.75rem',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{
            display: 'inline-block',
            padding: '0.4rem 0.8rem',
            background: `${niveauColor}22`,
            color: niveauColor,
            borderRadius: '0.25rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            {formation.niveau}
          </span>
        </div>

        <div>
          <h3 style={{
            fontSize: 'var(--font-20)',
            fontWeight: 900,
            marginBottom: '0.75rem',
            color: '#fff',
            fontFamily: 'var(--font-display)',
          }}>
            {formation.title}
          </h3>
          <p style={{
            fontSize: 'var(--font-18)',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-body)',
          }}>
            {formation.accroche}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>
              <Clock size={16} />
              {formation.duree}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>
              <MapPin size={16} />
              {formation.format}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {formation.prix && (
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: COLOR,
              marginBottom: '1rem',
            }}>
              {formation.prix}
            </p>
          )}
          <Link href={`/formations/${formation.slug}`}>
            <button style={{
              padding: '0.75rem 1.5rem',
              background: COLOR,
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              En savoir plus
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Mode grid
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: `3px solid ${niveauColor}`,
        borderRadius: '0.75rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          display: 'inline-block',
          padding: '0.4rem 0.8rem',
          background: `${niveauColor}22`,
          color: niveauColor,
          borderRadius: '0.25rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {formation.niveau}
        </span>
      </div>

      <h3 style={{
        fontSize: 'var(--font-20)',
        fontWeight: 900,
        marginBottom: '0.75rem',
        color: '#fff',
        fontFamily: 'var(--font-display)',
        lineHeight: 1.3,
      }}>
        {formation.title}
      </h3>

      <p style={{
        fontSize: 'var(--font-18)',
        color: 'rgba(255,255,255,0.65)',
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-body)',
        flex: 1,
        lineHeight: 1.6,
      }}>
        {formation.accroche}
      </p>

      {formation.prix && (
        <div style={{
          padding: '1rem',
          background: `${COLOR}15`,
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: COLOR,
          }}>
            {formation.prix}
          </p>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '0.25rem',
          }}>
            par participant
          </p>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>
          <Clock size={16} />
          {formation.duree}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>
          <BookOpen size={16} />
          {formation.format}
        </span>
      </div>

      <Link href={`/formations/${formation.slug}`}>
        <button style={{
          width: '100%',
          padding: '0.875rem',
          background: COLOR,
          border: 'none',
          borderRadius: '0.5rem',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}>
          En savoir plus
        </button>
      </Link>
    </motion.div>
  );
}
