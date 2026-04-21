"use client";

/**
 * Pôle Conseil & Stratégie IT - Page Détaillée
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Users,
  Target,
  TrendingUp,
  FileSearch,
  Briefcase,
  Lightbulb,
  LineChart,
  Shield,
  CheckCircle2,
  ArrowRight,
  Zap,
  GitBranch,
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";
import { blogPosts } from "@/lib/blog-data";
import CTAButton from "@/components/ui/CTAButton";

/* ── Background layers ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize('mobile');
      else if (width < 1280) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

const COLOR = "#D35400";

const services = [
  {
    icon: Target,
    title: "Conseil Stratégique & Transformation",
    slug: "conseil-strategique",
    description: "La stratégie avant l'outil. Nous définissons votre vision cible et votre feuille de route digitale avant tout investissement technologique.",
    features: ["Audit de maturité digitale", "Roadmap stratégique", "Conduite du changement"],
    image: "/images/poles/pole-conseil.jpg"
  },
  {
    icon: Briefcase,
    title: "Conseil Opérationnel & Métier",
    slug: "conseil-operationnel",
    description: "L'excellence opérationnelle au service de la performance. Nous optimisons vos processus métiers réels avant de les numériser.",
    features: ["Business Analysis terrain", "Optimisation des processus BPMN", "Alignement Stratégie-Outil"],
    image: "/images/poles/pole-conseil.jpg"
  },
];

const process = [
  { step: "01", title: "Diagnostic", desc: "Analyse de l'existant, identification des enjeux et des opportunités" },
  { step: "02", title: "Stratégie", desc: "Définition de la vision cible et élaboration de la roadmap" },
  { step: "03", title: "Planification", desc: "Cadrage des initiatives, priorisation et allocation des ressources" },
  { step: "04", title: "Exécution", desc: "Pilotage opérationnel, coordination des équipes et suivi de la réalisation" },
  { step: "05", title: "Optimisation", desc: "Mesure des résultats, ajustements et amélioration continue" },
];

export default function PoleConseilShell() {
  const screenSize = useMediaQuery();

  return (
    <div style={{
      background: '#070E1C',
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      color: '#fff',
    }}>
      {/* ── Background layers ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden"
          style={{
            padding: screenSize === 'mobile' ? '6rem 1.5rem 4rem' : '8rem 4rem 6rem',
          }}>

        <motion.div
          className="absolute top-1/4 -right-40 w-[800px] h-[800px] rounded-full"
          style={{ background: `${COLOR}20`, filter: 'blur(150px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="diamond diamond--sm" />
            <span style={{
              color: COLOR,
              fontSize: screenSize === 'mobile' ? '0.75rem' : '0.9rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'var(--font-display)'
            }}>
              Pôle 02
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: screenSize === 'mobile' ? 'clamp(2.5rem, 10vw, 4rem)' : 'clamp(4rem, 7vw, 8rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase'
            }}
          >
            Conseil &
            <br />
            <span style={{ color: COLOR }}>Stratégie IT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: screenSize === 'mobile' ? '1.1rem' : '1.5rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '800px',
              marginBottom: '3rem',
              fontFamily: 'var(--font-body)'
            }}
          >
            Votre partenaire stratégique pour piloter et réussir votre transformation digitale.
            Nous vous accompagnons de l'audit à l'exécution, avec une approche pragmatique et orientée résultats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
            style={{ flexWrap: 'wrap' }}
          >
            <Link href="#services">
              <button style={{
                background: COLOR,
                border: 'none',
                color: '#fff',
                padding: screenSize === 'mobile' ? '1rem 2rem' : '1.2rem 3rem',
                fontSize: screenSize === 'mobile' ? '0.9rem' : '1rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '0.25rem',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${COLOR}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                Nos Services
              </button>
            </Link>
            <Link href="/contact">
              <button style={{
                background: 'transparent',
                border: `1px solid ${COLOR}`,
                color: COLOR,
                padding: screenSize === 'mobile' ? '1rem 2rem' : '1.2rem 3rem',
                fontSize: screenSize === 'mobile' ? '0.9rem' : '1rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '0.25rem',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${COLOR}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}>
                Demander un Audit
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Consulting Matters Section */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
        background: 'rgba(255,255,255,0.06)',
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
              Pourquoi se faire <span style={{ color: COLOR }}>conseiller</span> est stratégique ?
            </h2>
            <p style={{
              fontSize: screenSize === 'mobile' ? '1rem' : '1.2rem',
              color: 'rgba(255,255,255,0.80)',
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}>
              Dans un environnement digital complexe, le conseil stratégique n'est pas une option, c'est un accélérateur de performance
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
                stat: "70%",
                label: "Des projets IT échouent",
                description: "par manque de stratégie claire et d'alignement métier-technologie"
              },
              {
                icon: Target,
                stat: "3x",
                label: "Plus de ROI",
                description: "pour les entreprises qui investissent dans le conseil avant l'implémentation"
              },
              {
                icon: Zap,
                stat: "-40%",
                label: "De coûts IT",
                description: "grâce à l'optimisation stratégique et l'élimination des redondances"
              },
              {
                icon: LineChart,
                stat: "85%",
                label: "Des dirigeants",
                description: "estiment que le conseil externe accélère leur transformation digitale"
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
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
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
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                  }}>
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

  
        </div>
      </section>

      {/* ── Services Section ── */}

      {/* Services Grid */}
      <section id="services" style={{
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
            Nos <span style={{ color: COLOR }}>Services</span>
          </h2>
          <p style={{
            fontSize: screenSize === 'mobile' ? '1rem' : '1.2rem',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: '700px',
            fontFamily: 'var(--font-body)'
          }}>
            Un accompagnement sur mesure pour chaque étape de votre transformation
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gap: screenSize === 'mobile' ? '1.5rem' : '2.5rem',
        }}>
          {services.map((service, i) => {
            const Icon = service.icon;
            const [isHovered, setIsHovered] = useState(false);
            return (
              <Link href={`/services/${service.slug}`} key={i} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    height: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: isHovered ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? `0 20px 60px ${COLOR}33` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* Image Header */}
                  <div style={{
                    position: 'relative',
                    height: screenSize === 'mobile' ? '180px' : '220px',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.3)',
                  }}>
                    <img
                      src={service.image}
                      alt={service.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease, filter 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        filter: isHovered ? 'grayscale(0%) brightness(0.8)' : 'grayscale(40%) brightness(0.6)',
                      }}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to bottom, transparent 0%, rgba(7,14,28,0.4) 50%, rgba(7,14,28,0.95) 100%)`,
                    }} />
                    {/* Icon badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1.5rem',
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '0.75rem',
                      background: `${COLOR}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 24px ${COLOR}66`,
                    }}>
                      <Icon size={24} color="#fff" />
                    </div>
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
                      {service.title}
                    </h3>
                    <p style={{
                      fontSize: screenSize === 'mobile' ? '0.95rem' : '1rem',
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.80)',
                      marginBottom: '1.5rem',
                      fontFamily: 'var(--font-body)',
                      flex: 1,
                    }}>
                      {service.description}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                      {service.features.map((feature, fi) => (
                        <li key={fi} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.75)',
                          fontFamily: 'var(--font-body)'
                        }}>
                          <CheckCircle2 size={16} color={COLOR} />
                          {feature}
                        </li>
                      ))}
                    </ul>

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
          })}
        </div>
      </section>

      {/* Process */}
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
          Notre <span style={{ color: COLOR }}>Méthodologie</span>
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {process.map((item, i) => (
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
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
                  color: 'rgba(255,255,255,0.80)',
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
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${COLOR}66`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${COLOR}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
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
                  color: 'rgba(255,255,255,0.80)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Blog Articles */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{
            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 900,
            marginBottom: '1rem',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            Ce que nous <span style={{ color: COLOR }}>publions</span> sur le sujet
          </h2>
          <p style={{
            fontSize: screenSize === 'mobile' ? '1rem' : '1.2rem',
            color: 'rgba(255,255,255,0.80)',
            maxWidth: '700px',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            margin: '0 auto',
          }}>
          </p>
        </motion.div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: screenSize === 'mobile' ? '2rem' : '4rem',
        }}>
          {blogPosts
            .filter(post => ["Leadership & Strat", "Business & Ops", "Tech Trends"].includes(post.category))
            .slice(0, 3)
            .map((post, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${COLOR}66`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${COLOR}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: screenSize === 'mobile' ? '1fr' : (isEven ? '0.5fr 1.5fr' : '1.5fr 0.5fr'),
                      alignItems: 'stretch',
                    }}>
                      {/* Image - Order controlled with flex or just placement for even/odd */}
                      <div style={{
                        position: 'relative',
                        height: screenSize === 'mobile' ? '200px' : 'auto',
                        minHeight: screenSize === 'mobile' ? '200px' : '300px',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.3)',
                        order: (screenSize !== 'mobile' && !isEven) ? 2 : 1,
                      }}>
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.7)',
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '1.5rem',
                          left: '1.5rem',
                          padding: '0.4rem 0.8rem',
                          background: COLOR,
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          zIndex: 2,
                        }}>
                          {post.format}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{
                        padding: screenSize === 'mobile' ? '1.5rem' : '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        order: (screenSize !== 'mobile' && !isEven) ? 1 : 2,
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '1.5rem',
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.72)',
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR }} />
                            {post.readTime}
                          </span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>

                        <h3 style={{
                          fontSize: screenSize === 'mobile' ? '1.4rem' : '2.2rem',
                          fontWeight: 900,
                          marginBottom: '1.5rem',
                          fontFamily: 'var(--font-display)',
                          color: '#fff',
                          lineHeight: 1.2,
                          textTransform: 'uppercase',
                        }}>
                          {post.title}
                        </h3>

                        <p style={{
                          fontSize: screenSize === 'mobile' ? '1rem' : '1.15rem',
                          lineHeight: 1.7,
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '2.5rem',
                          fontFamily: 'var(--font-body)',
                        }}>
                          {post.excerpt}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: COLOR,
                          fontSize: '1rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}>
                          Lire l'article complet
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
        </div>
      </section>

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <FooterStrip />
      </div>
    </div>
  );
}
