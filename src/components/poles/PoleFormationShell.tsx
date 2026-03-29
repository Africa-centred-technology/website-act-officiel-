"use client";

/**
 * Pôle Formation & Développement des Compétences - Page Détaillée
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  GraduationCap,
  BookOpen,
  Users,
  Laptop,
  Target,
  TrendingUp,
  Globe,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Sparkles,
  MousePointer2
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";
import { blogPosts } from "@/lib/blog-data";
import { FORMATIONS } from "@/lib/data/formations";

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

// Sélection de 6 formations représentatives pour l'affichage en vedette
const programs = [
  {
    icon: Sparkles,
    title: FORMATIONS[0].title,
    slug: FORMATIONS[0].slug,
    description: FORMATIONS[0].accroche,
    features: FORMATIONS[0].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
  {
    icon: Target,
    title: FORMATIONS[1].title,
    slug: FORMATIONS[1].slug,
    description: FORMATIONS[1].accroche,
    features: FORMATIONS[1].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
  {
    icon: Zap,
    title: FORMATIONS[3].title, // Automatisation
    slug: FORMATIONS[3].slug,
    description: FORMATIONS[3].accroche,
    features: FORMATIONS[3].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
  {
    icon: BookOpen,
    title: FORMATIONS[4].title, // IA pour enseignants
    slug: FORMATIONS[4].slug,
    description: FORMATIONS[4].accroche,
    features: FORMATIONS[4].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
  {
    icon: MousePointer2,
    title: FORMATIONS[7].title, // IA Marketing
    slug: FORMATIONS[7].slug,
    description: FORMATIONS[7].accroche,
    features: FORMATIONS[7].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
  {
    icon: Shield,
    title: FORMATIONS[6].title, // IA Santé
    slug: FORMATIONS[6].slug,
    description: FORMATIONS[6].accroche,
    features: FORMATIONS[6].objectifs.slice(0, 3),
    image: "/images/poles/pole-formation.jpg"
  },
];

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

export default function PoleFormationShell() {
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
              Pôle 03
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
            Formation &
            <br />
            <span style={{ color: COLOR }}>Développement</span>
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
            Nous formons les talents qui construiront l'Afrique digitale de demain.
            Formations certifiantes, bootcamps intensifs et mentorat personnalisé pour accélérer votre carrière tech.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
            style={{ flexWrap: 'wrap' }}
          >
            <Link href="https://elearning.africacentredtechnology.com/" target="_blank">
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${COLOR}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                ACT University
                <ExternalLink size={18} />
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
                Formation Entreprise
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: screenSize === 'mobile' ? '3rem 1.5rem' : '6rem 4rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: screenSize === 'mobile' ? '1.5rem' : '2.2rem',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.2
          }}>
           Pourquoi choisir les formations de <br />
            <span style={{ color: COLOR }}>ACT</span>
          </h2>
          <div style={{
            width: '60px',
            height: '2px',
            background: COLOR,
            margin: '1.5rem auto 0',
            borderRadius: '1px'
          }} />
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: screenSize === 'mobile' ? '2rem' : '3rem',
          textAlign: 'center',
        }}>
          {[
            { value: "2000+", label: "Apprenants formés" },
            { value: "15+", label: "Entreprises partenaires" },
            { value: "100+", label: "Modules disponibles" },
            { value: "85%", label: "Taux d'insertion pro" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '2rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '1rem',
              }}
            >
              <div style={{
                fontSize: screenSize === 'mobile' ? '2.5rem' : '3.5rem',
                fontWeight: 900,
                color: COLOR,
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: screenSize === 'mobile' ? '0.85rem' : '0.95rem',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
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
            Nos <span style={{ color: COLOR }}>Programmes</span>
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
          {programs.map((program, i) => {
            const Icon = program.icon;
            const [isHovered, setIsHovered] = useState(false);
            return (
              <Link href={`/formations/${program.slug}`} key={i} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
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
                      src={program.image}
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
                      {program.description}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                      {program.features.map((feature, fi) => (
                        <li key={fi} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.55)',
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
              title: "Approche Pratique",
              desc: "80% de pratique, 20% de théorie. Apprenez en faisant avec des projets réels dès le premier jour."
            },
            {
              icon: Users,
              title: "Formateurs Experts",
              desc: "Professionnels en activité qui partagent leur expérience terrain et leurs meilleures pratiques."
            },
            {
              icon: Laptop,
              title: "Projets Réels",
              desc: "Travail sur des projets réels et personnalisées selon votre secteur d'activité."
            },
            {
              icon: TrendingUp,
              title: "Suivi Personnalisé",
              desc: "Mentorat individuel, coaching carrière et accompagnement jusqu'à votre insertion professionnelle."
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
            color: 'rgba(255,255,255,0.65)',
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
            .filter(post => ["Carrière & Skills", "Tech Trends", "Data & IA"].includes(post.category))
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
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
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
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
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
                      {/* Image */}
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
                          color: 'rgba(255,255,255,0.5)',
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
