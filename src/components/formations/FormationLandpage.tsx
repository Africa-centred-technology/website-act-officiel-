"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Search,
    Filter,
    Clock,
    Users,
    BookOpen,
    Sparkles,
    ChevronRight,
    ArrowRight,
    Tag,
    Loader2,
    AlertCircle,
    Grid3x3,
    List as ListIcon,
    RefreshCw,
    TrendingUp,
    Zap,
    Target,
    Shield,
    CheckCircle2,
    } from "lucide-react";
    import FooterStrip from "@/components/layout/FooterStrip";
    import CTAButton from "@/components/ui/CTAButton";

const pedagogy = [
  {
    step: "01",
    title: "Learning by Doing",
    desc: "80% de pratique, 20% de théorie. Chaque concept est appliqué immédiatement via des exercices."
  },
  {
    step: "02",
    title: "Projets Réels",
    desc: "Portfolio professionnel constitué de projets concrets inspirés de cas d'usage entreprise."
  },
  {
    step: "03",
    title: "Mentorat Personnalisé",
    desc: "Accompagnement individuel par des experts pour débloquer et progresser rapidement."
  },
  {
    step: "04",
    title: "Communauté Active",
    desc: "Intégration dans un réseau d'apprenants et de professionnels pour échanger et collaborer."
  },
];

    function useMediaQuery() {
      const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

      useEffect(() => {
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

    const COLOR = "#D35400";
/* ── Marketing Video Section ── */
function MarketingVideo() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{
                width: "100%",
                height: "85vh",
                position: "relative",
                zIndex: 2,
                overflow: "hidden",
                background: "#000"
            }}
        >
            <video
                autoPlay
                muted
                loop
                playsInline
                poster="/Video/Promo.mp4"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
            >
                <source src="/Video/Promo.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
            </video>

            {/* Overlay gradient plus profond pour la transition */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(7,14,28,0.3) 0%, transparent 40%, rgba(7,14,28,0.8) 80%, rgba(7,14,28,1) 100%)",
                pointerEvents: "none"
            }} />

            {/* Floating Indicator */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                style={{
                    position: "absolute",
                    top: "12%",
                    left: "clamp(2rem, 8vw, 8rem)",
                    maxWidth: "850px",
                    zIndex: 3
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 1.2 }}
                        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                    >
                        <div style={{ width: "40px", height: "2px", background: COLOR }} />
                        <span style={{
                            fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase",
                            letterSpacing: "0.4em", color: COLOR
                        }}>
                            Notre Engagement
                        </span>
                    </motion.div>

                    <h2 style={{
                        fontSize: "clamp(2.5rem, 8vw, 5.8rem)",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: "#fff",
                        fontFamily: "var(--font-display)",
                        lineHeight: 0.9,
                        margin: 0,
                        letterSpacing: "-0.04em"
                    }}>
                        Vous formez <br />
                        <span style={{ color: COLOR, display: "block", marginTop: "0.4rem" }}>
                            notre mission
                        </span>
                    </h2>

                    <p style={{
                        fontSize: "clamp(1.7rem, 1.8vw, 1.5rem)",
                        fontWeight: 400,
                        color: "rgba(255, 255, 255, 0.91)",
                        lineHeight: 1.6,
                        maxWidth: "700px",
                        margin: "0.5rem 0 1rem",
                        letterSpacing: "0.01em"
                    }}>
                        Nous rendons la formation de haut niveau accessible à tous. 
                        Dominez les outils de demain grâce à nos programmes intensifs 
                        et notre approche centrée sur l&apos;impact concret.
                    </p>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        style={{ marginTop: "1rem" }}
                    >
                        <CTAButton href="/formations/all" iconPosition="right">
                            Rejoindre une formation
                        </CTAButton>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Down Hint */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    color: "rgba(255,255,255,0.3)"
                }}
            >
                <ChevronRight size={32} style={{ transform: "rotate(90deg)" }} />
            </motion.div>
        </motion.section>
    );
}

/* ── Grain (Identique à ContactShell) ── */
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

/** Helper : couleur selon le niveau */
function getNiveauColor(niveau: string = ""): string {
    if (niveau.includes("Initiation") || niveau.includes("Débutant")) return "#E67E22";
    if (niveau.includes("Intermédiaire")) return "#D35400";
    if (niveau.includes("Avancé")) return "#A04000";
    return "#D35400";
}

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

    function ProgramCard({ program, index, screenSize, COLOR }: { program: FormationCardData, index: number, screenSize: string, COLOR: string }) {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <Link href={`/formations/${program.slug}`} style={{ textDecoration: 'none' }}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        height: '100%',
                        background: 'rgba(255,255,255,0.02)',
                        border: isHovered ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease',
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        boxShadow: isHovered ? `0 20px 60px ${COLOR}33` : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Image Header */}
                    <div style={{
                        position: 'relative',
                        height: screenSize === 'mobile' ? '180px' : '220px',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.3)',
                    }}>
                        {program.imageUrl && (
                            <img
                                src={program.imageUrl}
                                alt={program.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.6s ease, filter 0.4s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    filter: isHovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(40%) brightness(0.6)',
                                }}
                            />
                        )}
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.4) 50%, rgba(7,14,28,0.95) 100%)`,
                        }} />
                        {/* Niveau badge */}
                        {program.niveau && (
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '1.5rem',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '2rem',
                                background: `${COLOR}`,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#fff',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                {program.niveau}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h3 style={{
                            fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-display)',
                            color: '#fff',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                        }}>
                            {program.title}
                        </h3>
                        <p style={{
                            fontSize: screenSize === 'mobile' ? '0.95rem' : '1rem',
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.65)',
                            marginBottom: '1.5rem',
                            fontFamily: 'var(--font-body)',
                            flex: 1,
                        }}>
                            {program.accroche}
                        </p>
                        {/* Meta info */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {program.duree && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                                    <Clock size={14} color={COLOR} /> {program.duree}
                                </span>
                            )}
                            {program.format && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                                    <BookOpen size={14} color={COLOR} /> {program.format}
                                </span>
                            )}
                        </div>

                        {/* CTA link */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            color: isHovered ? '#fff' : COLOR,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'all 0.3s ease',
                        }}>
                            En savoir plus <ArrowRight size={18} />
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

export default function FormationLandpage() {
    const screenSize = useMediaQuery();
    const [formationsData, setFormationsData] = useState<FormationCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const loadFromShopify = async () => {
        setIsLoading(true);
        setFetchError(false);
        try {
            const res = await fetch("/api/shopify/formations");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setFormationsData(json.formations ?? []);
        } catch (err) {
            console.error("[FormationLandpage] Shopify fetch failed:", err);
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

    const filteredFormations = useMemo(() => {
        return formationsData.filter(f => {
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
    }, [formationsData, searchQuery, selectedCategorie, selectedSecteur, selectedNiveau]);

    return (
        <div style={{
            background: '#070E1C',
            minHeight: '100vh',
            overflowX: 'hidden',
            position: 'relative',
            color: '#fff',
        }}>
            {/* ── BACKGROUND LAYERS (Inspiré de ContactShell) ── */}
            <Grain />

            {/* Grid bg */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    backgroundImage: `linear-gradient(rgba(211,84,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(211,84,0,0.035) 1px,transparent 1px)`,
                    backgroundSize: "80px 80px",
                    pointerEvents: "none"
                }}
            />

            {/* Glow */}
            <div
                aria-hidden
                style={{
                    position: "fixed",
                    top: "20%",
                    left: "50%",
                    width: "80vw",
                    height: "60vw",
                    zIndex: 0,
                    background: "radial-gradient(ellipse,rgba(211,84,0,0.06) 0%,transparent 70%)",
                    transform: "translate(-50%,-50%)",
                    pointerEvents: "none"
                }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
                <MarketingVideo />



                      {/* Why Training Matters Section */}
                <section style={{
                    padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ textAlign: 'center', marginBottom: '4rem' }}
                        >
                            <h2 style={{
                                fontSize: screenSize === 'mobile' ? '1.8rem' : '2.5rem',
                                fontWeight: 900,
                                color: '#fff',
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                lineHeight: 1.2,
                                marginBottom: '1rem',
                            }}>
                                Pourquoi se former est <span style={{ color: COLOR }}>essentiel</span> aujourd&apos;hui ?
                            </h2>
                            <p style={{
                                fontSize: screenSize === 'mobile' ? '1rem' : '1.2rem',
                                color: 'rgba(255,255,255,0.65)',
                                maxWidth: '800px',
                                margin: '0 auto',
                                fontFamily: 'var(--font-body)',
                                lineHeight: 1.6,
                            }}>
                                Dans un monde en constante évolution, la formation continue n&apos;est plus un luxe, c&apos;est une nécessité stratégique
                            </p>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                            gap: screenSize === 'mobile' ? '2rem' : '2.5rem',
                        }}>
                            {[
                                {
                                    icon: TrendingUp,
                                    stat: "87%",
                                    label: "Des emplois de demain",
                                    description: "nécessiteront des compétences qui n&apos;existent pas encore aujourd&apos;hui"
                                },
                                {
                                    icon: Zap,
                                    stat: "5 ans",
                                    label: "Durée de vie d&apos;une compétence",
                                    description: "contre 30 ans il y a 20 ans. La formation continue est vitale"
                                },
                                {
                                    icon: Target,
                                    stat: "+40%",
                                    label: "De productivité",
                                    description: "pour les équipes formées aux nouveaux outils et technologies"
                                },
                                {
                                    icon: Users,
                                    stat: "94%",
                                    label: "Des salariés",
                                    description: "resteraient plus longtemps dans une entreprise qui investit dans leur formation"
                                },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            padding: screenSize === 'mobile' ? '2rem 1.5rem' : '2.5rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '1rem',
                                            textAlign: 'center',
                                            transition: 'all 0.3s ease',
                                        }}
                                        whileHover={{
                                            borderColor: `${COLOR}66`,
                                            y: -8,
                                            boxShadow: `0 12px 40px ${COLOR}22`,
                                        }}
                                    >
                                        <div style={{
                                            width: '4rem',
                                            height: '4rem',
                                            borderRadius: '50%',
                                            background: `${COLOR}22`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1.5rem',
                                        }}>
                                            <Icon size={28} color={COLOR} />
                                        </div>

                                        <div style={{
                                            fontSize: screenSize === 'mobile' ? '3rem' : '4rem',
                                            fontWeight: 900,
                                            color: COLOR,
                                            fontFamily: 'var(--font-display)',
                                            lineHeight: 1,
                                            marginBottom: '1rem',
                                        }}>
                                            {item.stat}
                                        </div>

                                        <div style={{
                                            fontSize: screenSize === 'mobile' ? '1.1rem' : '1.25rem',
                                            fontWeight: 700,
                                            color: '#fff',
                                            fontFamily: 'var(--font-display)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            marginBottom: '1rem',
                                        }}>
                                            {item.label}
                                        </div>

                                        <p style={{
                                            fontSize: screenSize === 'mobile' ? '1rem' : '1.05rem',
                                            color: 'rgba(255,255,255,0.55)',
                                            fontFamily: 'var(--font-body)',
                                            lineHeight: 1.6,
                                        }} dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>



                 {/* Programs Grid */}
                      <section id="programs" style={{
                        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                        maxWidth: '1400px',
                        margin: '0 auto',
                      }}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="mb-12"
                        >
                          <h2 style={{
                            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase'
                          }}>
                            Nos <span style={{ color: COLOR }}>Formations</span>
                          </h2>
                          <p style={{
                            fontSize: screenSize === 'mobile' ? '1rem' : '1.2rem',
                            color: 'rgba(255,255,255,0.65)',
                            maxWidth: '700px',
                            fontFamily: 'var(--font-body)'
                          }}>
                            Des formats adaptés à tous les profils et tous les objectifs
                          </p>
                        </motion.div>
                
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                          gap: screenSize === 'mobile' ? '1.5rem' : '2.5rem',
                        }}>
                          {isLoading ? (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
                              <p style={{ color: "rgba(255,255,255,0.5)" }}>Chargement des programmes en vedette...</p>
                            </div>
                          ) : formationsData.length === 0 ? (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
                              <p style={{ color: "rgba(255,255,255,0.5)" }}>Aucun programme disponible.</p>
                            </div>
                          ) : (
                            formationsData.slice(-4).reverse().map((program, i) => (
                              <ProgramCard key={i} program={program} index={i} screenSize={screenSize} COLOR={COLOR} />
                            ))
                          )}
                        </div>
                      </section>


                         {/* Pedagogy */}
                            <section style={{
                              padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                              maxWidth: '1400px',
                              margin: '0 auto',
                            }}>
                              <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{
                                  fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
                                  fontWeight: 900,
                                  marginBottom: '3rem',
                                  fontFamily: 'var(--font-display)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                Notre <span style={{ color: COLOR }}>Pédagogie</span>
                              </motion.h2>
                      
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {pedagogy.map((item, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                      display: 'flex',
                                      gap: screenSize === 'mobile' ? '1rem' : '2rem',
                                      alignItems: 'flex-start',
                                      padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                                      background: 'rgba(255,255,255,0.02)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      borderRadius: '0.75rem',
                                    }}
                                  >
                                    <span style={{
                                      fontSize: screenSize === 'mobile' ? '2rem' : '3rem',
                                      fontWeight: 900,
                                      color: `${COLOR}44`,
                                      lineHeight: 1,
                                      fontFamily: 'var(--font-display)',
                                      flexShrink: 0
                                    }}>
                                      {item.step}
                                    </span>
                                    <div>
                                      <h3 style={{
                                        fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                                        fontWeight: 800,
                                        marginBottom: '0.5rem',
                                        color: '#fff',
                                        fontFamily: 'var(--font-display)'
                                      }}>
                                        {item.title}
                                      </h3>
                                      <p style={{
                                        fontSize: '1rem',
                                        color: 'rgba(255,255,255,0.65)',
                                        fontFamily: 'var(--font-body)'
                                      }}>
                                        {item.desc}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </section>
                      

       
                


                 {/* Why Choose Us */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 900,
            marginBottom: '3rem',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Pourquoi nous <span style={{ color: COLOR }}>choisir</span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? '1fr' : 'repeat(2, 1fr)',
          gap: screenSize === 'mobile' ? '1.5rem' : '2rem',
        }}>
          {[
            {
              icon: Target,
              title: "Approche Pragmatique",
              desc: "Nous privilégions les solutions concrètes et mesurables, adaptées à votre contexte et vos ressources."
            },
            {
              icon: Users,
              title: "Expertise Sectorielle",
              desc: "Une connaissance approfondie des enjeux métiers et des spécificités de votre secteur d'activité."
            },
            {
              icon: TrendingUp,
              title: "ROI Démontré",
              desc: "Accompagnement axé sur la création de valeur mesurable et l'optimisation de vos investissements IT."
            },
            {
              icon: Shield,
              title: "Neutralité Technologique",
              desc: "Recommandations indépendantes et objectives, sans parti pris technologique ou commercial."
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: screenSize === 'mobile' ? '2rem' : '2.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${COLOR}66`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${COLOR}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.5rem',
                  background: `${COLOR}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  <Icon size={24} color={COLOR} />
                </div>
                <h3 style={{
                  fontSize: screenSize === 'mobile' ? '1.3rem' : '1.5rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>


                     {/* Call-to-action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            style={{
                            marginTop: '4rem',
                            textAlign: 'center',
                            padding: screenSize === 'mobile' ? '2rem 1.5rem' : '3rem',
                            background: `linear-gradient(135deg, ${COLOR}15, ${COLOR}08)`,
                            border: `1px solid ${COLOR}33`,
                            borderRadius: '1rem',
                            maxWidth: '1400px',
                            margin: '4rem auto 0',
                            }}
                        >
                            <h3 style={{
                            fontSize: screenSize === 'mobile' ? '1.6rem' : '2.5rem',
                            fontWeight: 800,
                            color: '#fff',
                            fontFamily: 'var(--font-display)',
                            marginBottom: '1.5rem',
                            lineHeight: 1.2,
                            }}>
                            L&apos;investissement dans la formation, c&apos;est l&apos;investissement dans l&apos;avenir
                            </h3>
                            <p style={{
                            fontSize: screenSize === 'mobile' ? '1.1rem' : '1.4rem',
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-body)',
                            maxWidth: '850px',
                            margin: '0 auto 2.5rem',
                            lineHeight: 1.7,
                            }}>
                            Les entreprises qui forment leurs équipes sont 2x plus susceptibles d&apos;innover et 3x plus compétitives sur leur marché
                            </p>
                            <div style={{ 
                                display: 'flex', 
                                gap: '1.5rem', 
                                justifyContent: 'center', 
                                flexWrap: screenSize === 'mobile' ? 'wrap' : 'nowrap',
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}>
                                <div style={{ flex: 1, minWidth: screenSize === 'mobile' ? '100%' : '240px' }}>
                                    <CTAButton href="/formations/all" className="cta-full-width">
                                        Voir toutes nos formations
                                    </CTAButton>
                                </div>
                                <div style={{ flex: 1, minWidth: screenSize === 'mobile' ? '100%' : '240px' }}>
                                    <CTAButton href="https://elearning.africacentredtechnology.com/" external className="cta-full-width">
                                        ACT University
                                    </CTAButton>
                                </div>
                            </div>
                        </motion.div>

                <FooterStrip />
            </div>

            <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .cta-full-width, .cta-full-width .cta-btn {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        .cta-full-width .cta-btn__inner {
          width: 100% !important;
          justify-content: center !important;
        }
      `}</style>
        </div>


    );

    function ProgramCard({ program, index, screenSize, COLOR }: { program: FormationCardData, index: number, screenSize: string, COLOR: string }) {
          const [isHovered, setIsHovered] = useState(false);
        
          return (
            <Link href={`/formations/${program.slug}`} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: isHovered ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHovered ? `0 20px 60px ${COLOR}33` : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Header */}
                <div style={{
                  position: 'relative',
                  height: screenSize === 'mobile' ? '180px' : '220px',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.3)',
                }}>
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease, filter 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        filter: isHovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(40%) brightness(0.6)',
                      }}
                    />
                  )}
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.4) 50%, rgba(7,14,28,0.95) 100%)`,
                  }} />
                  {/* Niveau badge */}
                  {program.niveau && (
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1.5rem',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '2rem',
                      background: `${COLOR}`,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {program.niveau}
                    </div>
                  )}
                </div>
        
                {/* Content */}
                <div style={{
                  padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <h3 style={{
                    fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-display)',
                    color: '#fff',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                  }}>
                    {program.title}
                  </h3>
                  <p style={{
                    fontSize: screenSize === 'mobile' ? '0.95rem' : '1rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.65)',
                    marginBottom: '1.5rem',
                    fontFamily: 'var(--font-body)',
                    flex: 1,
                  }}>
                    {program.accroche}
                  </p>
                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {program.duree && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                        <Clock size={14} color={COLOR} /> {program.duree}
                      </span>
                    )}
                    {program.format && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                        <BookOpen size={14} color={COLOR} /> {program.format}
                      </span>
                    )}
                  </div>
        
                  {/* CTA link */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: isHovered ? '#fff' : COLOR,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                  }}>
                    En savoir plus <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        }
        
}

