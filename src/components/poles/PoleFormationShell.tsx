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
  Award,
  Laptop,
  Target,
  TrendingUp,
  Globe,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";

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

const COLOR = "#16a34a";

const programs = [
  {
    icon: Laptop,
    title: "ACT University",
    description: "Plateforme e-learning avec plus de 100 modules couvrant développement web, data science, cybersécurité et cloud computing.",
    features: ["Parcours structurés", "Exercices pratiques", "Certificats reconnus"]
  },
  {
    icon: Target,
    title: "Bootcamps Intensifs",
    description: "Programmes accélérés de 8 à 12 semaines pour une reconversion professionnelle ou une montée en compétences rapide.",
    features: ["Formation pratique", "Projets réels", "Garantie employabilité"]
  },
  {
    icon: Users,
    title: "Formation en Entreprise",
    description: "Programmes sur mesure pour vos équipes : upskilling, reskilling et accompagnement à l'adoption de nouvelles technologies.",
    features: ["Sur mesure", "Intra-entreprise", "Coaching individuel"]
  },
  {
    icon: BookOpen,
    title: "Ateliers & Masterclass",
    description: "Sessions courtes et ciblées sur des sujets pointus : IA générative, DevOps, architecture cloud, cybersécurité...",
    features: ["Experts métier", "Format court", "Hands-on labs"]
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Préparation aux certifications professionnelles reconnues : AWS, Azure, Google Cloud, CompTIA, CISSP...",
    features: ["Taux de réussite élevé", "Support personnalisé", "Examens blancs"]
  },
  {
    icon: Globe,
    title: "Mentorat & Coaching",
    description: "Accompagnement personnalisé par des professionnels expérimentés pour accélérer votre progression.",
    features: ["1-to-1 mentoring", "Career coaching", "Code reviews"]
  },
];

const tracks = [
  "Développement Web Full-Stack",
  "Data Science & IA",
  "Cybersécurité",
  "Cloud & DevOps",
  "Développement Mobile",
  "Business Intelligence",
];

const pedagogy = [
  {
    step: "01",
    title: "Learning by Doing",
    desc: "80% de pratique, 20% de théorie. Chaque concept est appliqué immédiatement via des exercices.",
    icon: Laptop
  },
  {
    step: "02",
    title: "Projets Réels",
    desc: "Portfolio professionnel constitué de projets concrets inspirés de cas d'usage entreprise.",
    icon: Target
  },
  {
    step: "03",
    title: "Mentorat Personnalisé",
    desc: "Accompagnement individuel par des experts pour débloquer et progresser rapidement.",
    icon: Users
  },
  {
    step: "04",
    title: "Communauté Active",
    desc: "Intégration dans un réseau d'apprenants et de professionnels pour échanger et collaborer.",
    icon: Globe
  },
  {
    step: "05",
    title: "Certification Reconnue",
    desc: "Validation officielle des compétences acquises, valorisable sur le marché du travail.",
    icon: Award
  },
];

const stats = [
  { value: "2000+", label: "Apprenants formés" },
  { value: "15+", label: "Entreprises partenaires" },
  { value: "100+", label: "Modules disponibles" },
  { value: "85%", label: "Taux d'insertion pro" },
];

const testimonials = [
  {
    name: "Amina K.",
    role: "Développeuse Full-Stack",
    text: "Le bootcamp ACT m'a permis de me reconvertir en 3 mois. Aujourd'hui je travaille chez une startup tech.",
    avatar: "AK"
  },
  {
    name: "Omar B.",
    role: "Data Analyst",
    text: "Une formation complète et pratique. Les formateurs sont des pros qui partagent leur expérience terrain.",
    avatar: "OB"
  },
  {
    name: "Fatima Z.",
    role: "DevOps Engineer",
    text: "ACT University m'a donné les compétences pour décrocher mon poste actuel. Je recommande à 100% !",
    avatar: "FZ"
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

      {/* Stats */}
      <section style={{
        padding: screenSize === 'mobile' ? '3rem 1.5rem' : '4rem 4rem',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr 1fr' : screenSize === 'tablet' ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)',
          gap: screenSize === 'mobile' ? '2rem' : '3rem',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{
                fontSize: screenSize === 'mobile' ? '2.5rem' : '3.5rem',
                fontWeight: 900,
                color: COLOR,
                lineHeight: 1,
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-display)'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-body)'
              }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs */}
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
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {programs.map((program, i) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  padding: screenSize === 'mobile' ? '2rem 1.5rem' : '2.5rem',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  borderColor: COLOR,
                  y: -8
                }}
              >
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.75rem',
                  background: `${COLOR}22`,
                  border: `1px solid ${COLOR}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  <Icon size={28} color={COLOR} />
                </div>
                <h3 style={{
                  fontSize: screenSize === 'mobile' ? '1.3rem' : '1.5rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-display)',
                  color: '#fff'
                }}>
                  {program.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  {program.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tracks */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 900,
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase'
            }}
          >
            Parcours <span style={{ color: COLOR }}>Disponibles</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {tracks.map((track, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={20} color={COLOR} style={{ flexShrink: 0 }} />
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'var(--font-body)'
                }}>
                  {track}
                </span>
              </motion.div>
            ))}
          </div>
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
          {pedagogy.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  gap: screenSize === 'mobile' ? '1rem' : '2rem',
                  alignItems: 'center',
                  padding: screenSize === 'mobile' ? '1.5rem' : '2rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '0.75rem',
                }}
              >
                <div style={{
                  width: screenSize === 'mobile' ? '3rem' : '4rem',
                  height: screenSize === 'mobile' ? '3rem' : '4rem',
                  borderRadius: '0.75rem',
                  background: `${COLOR}22`,
                  border: `1px solid ${COLOR}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={screenSize === 'mobile' ? 20 : 24} color={COLOR} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: screenSize === 'mobile' ? '1.5rem' : '2rem',
                      fontWeight: 900,
                      color: `${COLOR}66`,
                      lineHeight: 1,
                      fontFamily: 'var(--font-display)'
                    }}>
                      {item.step}
                    </span>
                    <h3 style={{
                      fontSize: screenSize === 'mobile' ? '1.2rem' : '1.5rem',
                      fontWeight: 800,
                      color: '#fff',
                      fontFamily: 'var(--font-display)'
                    }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.65)',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: screenSize === 'mobile' ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: 900,
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase'
            }}
          >
            Témoignages <span style={{ color: COLOR }}>d'Apprenants</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '2rem',
          }}>
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem',
                  padding: '2rem',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: `${COLOR}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: COLOR,
                    fontFamily: 'var(--font-display)'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p style={{
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.25rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {testimonial.name}
                    </p>
                    <p style={{
                      fontSize: '0.85rem',
                      color: COLOR,
                      fontFamily: 'var(--font-body)'
                    }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-body)'
                }}>
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
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
