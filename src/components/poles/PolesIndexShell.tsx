"use client";

/**
 * Poles Index Page
 * Page d'accueil présentant les 3 pôles avec liens vers pages détaillées
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Code, Users, GraduationCap, ArrowRight } from "lucide-react";
import FooterStrip from "@/components/layout/FooterStrip";
import CTASection from "@/components/layout/CTASection";
import { POLES } from "@/lib/data/poles";


/* ── Background layers ── */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1280) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

const poles = POLES;


/* ══════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════ */
function HeroSection({ screenSize }: { screenSize: 'mobile' | 'tablet' | 'desktop' }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : screenSize === 'tablet' ? '5rem 3rem' : '6rem 4rem',
      }}>

      {/* Decoration */}
      <motion.div
        aria-hidden
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#D35400]/10 blur-[150px] rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="diamond diamond--sm" />
          <span style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: screenSize === 'mobile' ? '0.9rem' : '1.3rem',
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
            fontFamily: "var(--font-display)"
          }}>
            Notre Expertise
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="font-black uppercase mb-6"
          style={{
            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 8vw, 3rem)' : screenSize === 'tablet' ? 'clamp(3rem, 7vw, 5rem)' : 'clamp(4rem, 6vw, 7rem)',
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#fff",
            fontFamily: "var(--font-display)"
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Nos </span>
          <span style={{ color: "#D35400" }}>3 Pôles</span>
          <br />
          <span>d'Excellence</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          style={{
            fontSize: screenSize === 'mobile' ? '1.15rem' : screenSize === 'tablet' ? '1.35rem' : '1.5rem',
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
            maxWidth: "50rem",
            margin: "0 auto",
            fontFamily: "var(--font-body)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Trois domaines d'intervention complémentaires pour accompagner votre transformation digitale de bout en bout : de la stratégie à l'exécution, en passant par la montée en compétences de vos équipes.
        </motion.p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   POLE CARD
   ══════════════════════════════════════════════════════════ */
function PoleCard({ pole, index, screenSize }: { pole: typeof poles[0]; index: number; screenSize: 'mobile' | 'tablet' | 'desktop' }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = pole.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/poles/${pole.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.02)',
            border: isHovered ? `1px solid ${pole.color}` : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '1rem',
            overflow: 'hidden',
            transition: 'all 0.4s ease',
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          }}
        >
          {/* Image Background */}
          <div style={{
            position: 'relative',
            height: screenSize === 'mobile' ? '200px' : screenSize === 'tablet' ? '250px' : '300px',
            overflow: 'hidden',
          }}>
            <img
              src={pole.image}
              alt={pole.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isHovered ? 'grayscale(20%) brightness(0.8)' : 'grayscale(60%) brightness(0.6)',
                transition: 'filter 0.4s ease, transform 0.4s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, transparent 0%, rgba(10,20,16,0.8) 60%, rgba(10,20,16,0.95) 100%)`,
            }} />
            {/* Number */}
            <span style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: screenSize === 'mobile' ? '4rem' : '5rem',
              fontWeight: 900,
              color: isHovered ? `${pole.color}66` : 'rgba(255,255,255,0.15)',
              lineHeight: 1,
              fontFamily: 'var(--font-display)',
              transition: 'color 0.4s ease',
            }}>
              {pole.number}
            </span>
          </div>

          {/* Content */}
          <div style={{
            padding: screenSize === 'mobile' ? '2rem 1.5rem' : '2.5rem 2rem',
          }}>
            {/* Icon + Tag */}
            <div className="flex items-center gap-3 mb-4">
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.5rem',
                background: `${pole.color}22`,
                border: `1px solid ${pole.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.4s ease',
                transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)',
              }}>
                <Icon size={20} color={pole.color} />
              </div>
              <span style={{
                color: pole.color,
                fontSize: '1rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}>
                Pôle {pole.number}
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: screenSize === 'mobile' ? 'clamp(1.5rem, 5vw, 2rem)' : 'clamp(2rem, 3vw, 2.5rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
            }}>
              {pole.title}
            </h2>

            {/* Tagline */}
            <p style={{
              fontSize: screenSize === 'mobile' ? '1.05rem' : '1.15rem',
              fontWeight: 600,
              color: pole.color,
              marginBottom: '1rem',
              fontFamily: 'var(--font-body)',
            }}>
              {pole.tagline}
            </p>

            {/* Description */}
            <p style={{
              fontSize: screenSize === 'mobile' ? '1rem' : '1.1rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-body)',
            }}>
              {pole.description}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div>
                <p style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: pole.color,
                  lineHeight: 1.1,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                }}>
                  {pole.stats.left}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: '0.25rem',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {pole.stats.leftLabel}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: pole.color,
                  lineHeight: 1.1,
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                }}>
                  {pole.stats.right}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: '0.25rem',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {pole.stats.rightLabel}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2" style={{
              color: isHovered ? pole.color : 'rgba(255,255,255,0.5)',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              transition: 'color 0.3s ease',
            }}>
              <span>Découvrir ce pôle</span>
              <ArrowRight size={18} style={{
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.3s ease',
              }} />
            </div>
          </div>

          {/* Accent bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: pole.color,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s ease',
          }} />
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function PolesIndexShell() {
  const screenSize = useMediaQuery();

  return (
    <div style={{
      background: '#0A1410',
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
        <HeroSection screenSize={screenSize} />

      {/* Poles Grid */}
      <section style={{
        padding: screenSize === 'mobile' ? '4rem 1.5rem' : screenSize === 'tablet' ? '5rem 3rem' : '6rem 4rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? '1fr' : 'repeat(3, 1fr)',
          gap: screenSize === 'mobile' ? '2rem' : '2.5rem',
        }}>
          {poles.map((pole, index) => (
            <PoleCard key={pole.id} pole={pole} index={index} screenSize={screenSize} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterStrip />
      </div>
    </div>
  );
}
