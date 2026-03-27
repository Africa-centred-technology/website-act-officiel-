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
  ArrowRight
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

const COLOR = "#D35400";

const services = [
  {
    icon: FileSearch,
    title: "Audit & Diagnostic IT",
    description: "Analyse approfondie de votre système d'information : infrastructure, applications, processus, sécurité et gouvernance.",
    features: ["Audit technique complet", "Cartographie SI", "Analyse de la dette technique"]
  },
  {
    icon: Target,
    title: "Stratégie Digitale",
    description: "Élaboration de votre feuille de route numérique alignée sur vos objectifs business et vos contraintes opérationnelles.",
    features: ["Roadmap technologique", "Étude d'opportunité", "Plan de transformation"]
  },
  {
    icon: Briefcase,
    title: "Pilotage de Projets IT",
    description: "Gestion de bout en bout de vos projets technologiques : cadrage, planification, coordination et suivi.",
    features: ["PMO dédié", "Méthodologie Agile/SCRUM", "Reporting transparent"]
  },
  {
    icon: TrendingUp,
    title: "Optimisation des Coûts IT",
    description: "Rationalisation de vos dépenses technologiques et amélioration du ROI de vos investissements IT.",
    features: ["Analyse TCO", "Renegociation contrats", "Cloud cost optimization"]
  },
  {
    icon: Lightbulb,
    title: "Innovation & R&D",
    description: "Veille technologique, POC et accompagnement dans l'adoption de technologies émergentes (IA, Blockchain, IoT).",
    features: ["Prototypage rapide", "Proof of Concept", "Transfert de compétences"]
  },
  {
    icon: Shield,
    title: "Gouvernance & Conformité",
    description: "Mise en place de frameworks de gouvernance IT (ITIL, COBIT) et accompagnement à la conformité réglementaire.",
    features: ["RGPD compliance", "ISO 27001", "Politiques de sécurité"]
  },
];

const expertises = [
  "Transformation digitale",
  "Architecture d'entreprise",
  "Business Intelligence",
  "Gestion de projets",
  "Change management",
  "Data governance",
];

const methodology = [
  {
    step: "01",
    title: "Diagnostic",
    desc: "Analyse de l'existant, identification des enjeux et des opportunités",
    icon: FileSearch
  },
  {
    step: "02",
    title: "Stratégie",
    desc: "Définition de la vision cible et élaboration de la roadmap",
    icon: Target
  },
  {
    step: "03",
    title: "Planification",
    desc: "Cadrage des initiatives, priorisation et allocation des ressources",
    icon: Briefcase
  },
  {
    step: "04",
    title: "Exécution",
    desc: "Pilotage opérationnel, coordination des équipes et suivi de la réalisation",
    icon: TrendingUp
  },
  {
    step: "05",
    title: "Optimisation",
    desc: "Mesure des résultats, ajustements et amélioration continue",
    icon: LineChart
  },
];

const stats = [
  { value: "100+", label: "Audits réalisés" },
  { value: "45+", label: "Entreprises accompagnées" },
  { value: "200+", label: "Projets pilotés" },
  { value: "95%", label: "Taux de satisfaction" },
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
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '700px',
            fontFamily: 'var(--font-body)'
          }}>
            Un accompagnement sur mesure pour chaque étape de votre transformation
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {services.map((service, i) => {
            const Icon = service.icon;
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
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  {service.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {service.features.map((feature, fi) => (
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

      {/* Expertises */}
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
            Nos <span style={{ color: COLOR }}>Expertises</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {expertises.map((exp, i) => (
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
                  {exp}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
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
          {methodology.map((item, i) => {
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

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <FooterStrip />
      </div>
    </div>
  );
}
