"use client";

/**
 * Pôle Développement Technologique - Page Détaillée
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Code,
  Cloud,
  Smartphone,
  Database,
  Cpu,
  GitBranch,
  Shield,
  Zap,
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
    icon: Code,
    title: "Développement Full-Stack",
    description: "Applications web et mobile performantes avec les technologies modernes : React, Next.js, Node.js, Python, Django.",
    features: ["SPA & PWA", "API RESTful & GraphQL", "Applications temps réel"]
  },
  {
    icon: Cloud,
    title: "Architecture Cloud",
    description: "Conception et déploiement d'infrastructures scalables et sécurisées sur AWS, Azure et Google Cloud Platform.",
    features: ["Infrastructure as Code", "Microservices", "Serverless Computing"]
  },
  {
    icon: Smartphone,
    title: "Développement Mobile",
    description: "Applications natives et cross-platform pour iOS et Android avec React Native et Flutter.",
    features: ["UI/UX natif", "Performances optimales", "Synchronisation offline"]
  },
  {
    icon: Database,
    title: "Solutions Data",
    description: "Conception de bases de données, pipelines ETL, data warehousing et solutions d'analyse de données.",
    features: ["PostgreSQL, MongoDB", "Data pipelines", "Business Intelligence"]
  },
  {
    icon: GitBranch,
    title: "DevOps & CI/CD",
    description: "Automatisation des déploiements, intégration et livraison continues, monitoring et observabilité.",
    features: ["Docker & Kubernetes", "GitHub Actions, GitLab CI", "Monitoring 24/7"]
  },
  {
    icon: Shield,
    title: "Sécurité Applicative",
    description: "Audit de sécurité, tests de pénétration, implémentation de best practices OWASP.",
    features: ["Audit de code", "Pentest applications", "Conformité RGPD"]
  },
];

const technologies = [
  { name: "React / Next.js", category: "Frontend" },
  { name: "Node.js / Python", category: "Backend" },
  { name: "PostgreSQL / MongoDB", category: "Database" },
  { name: "Docker / Kubernetes", category: "DevOps" },
  { name: "AWS / Azure / GCP", category: "Cloud" },
  { name: "React Native / Flutter", category: "Mobile" },
];

const process = [
  { step: "01", title: "Analyse & Cadrage", desc: "Audit de l'existant, définition du périmètre et des objectifs" },
  { step: "02", title: "Conception", desc: "Architecture technique, maquettes, spécifications détaillées" },
  { step: "03", title: "Développement", desc: "Sprints agiles, revues régulières, tests continus" },
  { step: "04", title: "Déploiement", desc: "Mise en production, formation des équipes, transfert de compétences" },
  { step: "05", title: "Support & Évolution", desc: "Maintenance, monitoring, évolutions fonctionnelles" },
];

export default function PoleDeveloppementShell() {
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
              Pôle 01
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
            Développement
            <br />
            <span style={{ color: COLOR }}>Technologique</span>
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
            Nous transformons vos idées en produits technologiques performants et scalables.
            De l'application web au système distribué, nous maîtrisons l'ensemble de la chaîne de valeur technique.
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
                Nous Contacter
              </button>
            </Link>
          </motion.div>
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
            Une expertise complète pour tous vos besoins de développement logiciel
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

      {/* Technologies */}
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
            Stack <span style={{ color: COLOR }}>Technologique</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {technologies.map((tech, i) => (
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
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  fontSize: '0.75rem',
                  color: COLOR,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)'
                }}>
                  {tech.category}
                </span>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'var(--font-body)'
                }}>
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
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
          Notre <span style={{ color: COLOR }}>Processus</span>
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

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <FooterStrip />
      </div>
    </div>
  );
}
