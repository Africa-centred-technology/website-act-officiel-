"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion, AnimatePresence,
  useScroll, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import CTASection from "@/components/layout/CTASection";

import CatalogueSection from "@/components/formations/CatalogueSection";

/* ══════════════════════════════════════════════════════
   Background layers
   ══════════════════════════════════════════════════════ */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });

/* ══════════════════════════════════════════════════════
   TOKENS
   ══════════════════════════════════════════════════════ */
const ORANGE = "#D35400";
const GOLD = "#F39C12";
const EASE = [0.6, 0.08, 0.02, 0.99] as const;
const BURST = [0.04, 0.72, 0.08, 1.0] as const;
const THROTTLE = 1200; // ms entre transitions

/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */
interface Sub { title: string; desc: string }
interface Svc {
  n: string;
  pole: string;
  poleN: string;
  accent: string;
  bg: string;     // gradient background unique
  title: string;
  tagline: string;
  intro: string;
  subs: Sub[];
  benefits: string[];
  video: string;  // free stock video URL
}

const SERVICES: Svc[] = [
  {
    n: "01", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 20% 60%, #0D2040 0%, #050C18 55%, #030810 100%)",
    title: "Ingénierie Logicielle\n& Solutions Métiers",
    tagline: "Des applications qui parlent africain",
    intro: "Les organisations africaines perdent en compétitivité avec des outils génériques inadaptés à leurs réalités. ACT conçoit des solutions sur mesure, pensées pour les contraintes du continent.",
    subs: [
      {
        title: "Applications Web & Mobile « African-Ready »",
        desc: "Mobile-first, natif Android/iOS et hybride. Performance optimisée pour les réseaux africains, UX taillée pour l'adoption."
      },
      {
        title: "Logiciels Métiers Spécifiques",
        desc: "ERP, SIRH conformes OHADA, CRM, gestion de projets et de stocks — construits à partir des processus réels de chaque organisation."
      },
    ],
    benefits: ["Efficacité opérationnelle", "Adoption rapide", "ROI mesurable", "Plateformes évolutives"],
    video: "https://cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4",
  },
  {
    n: "02", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 90% at 80% 40%, #0A1F0D 0%, #050C18 55%, #030810 100%)",
    title: "Automatisation\nIntelligente (IA Agentique)",
    tagline: "L'IA qui travaille avec vous",
    intro: "Les processus manuels fragmentés génèrent délais et erreurs. ACT déploie des architectures d'agents IA qui collaborent pour transformer vos workflows en machines intelligentes.",
    subs: [
      {
        title: "Architectures Multi-Agents",
        desc: "Plusieurs agents spécialisés coopèrent : collecte, analyse, coordination, rapports et actions automatisées en chaîne."
      },
      {
        title: "Traitement Hybride Digital / Papier",
        desc: "Numérisation, OCR, extraction automatique — les documents papier deviennent des données intégrées dans vos systèmes."
      },
      {
        title: "IA de Soutien (Augmentation Humaine)",
        desc: "L'IA synthétise et recommande, l'humain décide. Un duo complémentaire qui démultiplie les capacités des équipes."
      },
    ],
    benefits: ["Processus accéléré ×5", "Erreurs humaines réduites", "Décisions renforcées", "Coordination fluide"],
    video: "https://cdn.pixabay.com/video/2023/07/24/173103-848555583_large.mp4",
  },
  {
    n: "03", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 85% 70% at 60% 80%, #150A2A 0%, #050C18 55%, #030810 100%)",
    title: "Architecture\n& Infrastructure",
    tagline: "Les fondations de votre croissance",
    intro: "Sans fondations solides, vos applications deviennent des dettes techniques. ACT conçoit des architectures évolutives et des clouds souverains adaptés aux réglementations africaines.",
    subs: [
      {
        title: "Architecture Logicielle Évolutive",
        desc: "Microservices, event-driven, API-first — des systèmes qui s'étendent de l'administration locale au système national sans reconstruction."
      },
      {
        title: "Solutions Cloud Souveraines",
        desc: "Adoption cloud alignée sur les réglementations de localisation des données. Hybride cloud/local, migration sans interruption."
      },
      {
        title: "IT Consulting & Solution Design",
        desc: "Conseil indépendant : analyses comparatives, études de faisabilité, TCO sur 5 ans — pour des décisions technologiques éclairées."
      },
    ],
    benefits: ["Investissement protégé", "Scalabilité native", "Conformité assurée", "Coûts maîtrisés"],
    video: "https://cdn.pixabay.com/video/2024/11/05/240062_large.mp4",
  },
  {
    n: "04", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 30% 20%, #071A1A 0%, #050C18 55%, #030810 100%)",
    title: "Data, Intelligence\nArtificielle & Big Data",
    tagline: "Vos données au service de votre mission",
    intro: "L'Afrique génère des volumes colossaux de données non exploitées. ACT les transforme en actifs stratégiques — avec des modèles entraînés sur des données africaines, par des équipes africaines.",
    subs: [
      {
        title: "Data Science & Machine Learning",
        desc: "Modèles prédictifs calibrés pour l'Afrique : prévision de demande, détection de fraude, segmentation, maintenance prédictive."
      },
      {
        title: "Data Engineering",
        desc: "Pipelines automatisés, data warehouses, data lakes et systèmes de qualité — l'infrastructure invisible qui rend l'IA possible."
      },
      {
        title: "IA Responsable & AI Governance",
        desc: "Solutions IA explicables, équitables et contrôlables. Politique d'IA, comités d'éthique, formation des dirigeants."
      },
    ],
    benefits: ["Décisions data-driven", "Modèles contextualisés", "Gouvernance intégrée", "Big Data opérable"],
    video: "https://cdn.pixabay.com/video/2020/01/30/31772-388253161_large.mp4",
  },
  {
    n: "05", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 80% at 70% 70%, #1A1205 0%, #050C18 55%, #030810 100%)",
    title: "Géomatique\n& Systèmes d'Information\nGéographique",
    tagline: "Connaître son territoire pour le développer",
    intro: "On ne développe pas ce qu'on ne connaît pas. ACT produit des cartographies précises et construit des SIG décisionnels qui transforment la donnée spatiale en politique publique.",
    subs: [
      {
        title: "Cartographie Numérique",
        desc: "Imagerie satellitaire, LiDAR, GPS et drones. Mise à jour continue — indispensable dans des territoires africains en mutation rapide."
      },
      {
        title: "Systèmes d'Information Géographique",
        desc: "Plateformes décisionnelles croisant données territoriales et socio-économiques : urbanisme, ressources naturelles, politiques publiques."
      },
    ],
    benefits: ["Décisions d'aménagement éclairées", "Autonomie géomatique", "Données actualisées", "Appui aux politiques"],
    video: "https://cdn.pixabay.com/video/2017/07/23/10854-226632941_large.mp4",
  },
  {
    n: "06", pole: "Conseil", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 85% 75% at 40% 50%, #1A1708 0%, #050C18 55%, #030810 100%)",
    title: "Conseil Stratégique\n& Transformation",
    tagline: "La stratégie avant l'outil",
    intro: "Beaucoup d'organisations achètent un logiciel avant de savoir pourquoi. ACT inverse cette logique — la vision stratégique précède toujours le choix technologique.",
    subs: [
      {
        title: "Conseil Digital & Growth",
        desc: "Audit de maturité digitale, diagnostic des systèmes en place, feuille de route co-construite avec jalons et KPIs actionnables."
      },
      {
        title: "Digital Transformation Services",
        desc: "Conduite du changement de bout en bout : communication, formation des managers, instances de gouvernance, mesure d'impact."
      },
      {
        title: "Développement Territorial & Ville Intelligente",
        desc: "Territoires intelligents africains — amélioration des services publics en tenant compte des réalités locales, pas des modèles importés."
      },
    ],
    benefits: ["Stratégie claire", "Transformation réussie", "Investissements rentabilisés", "Territoires efficaces"],
    video: "https://cdn.pixabay.com/video/2022/10/31/137265-766326232_large.mp4",
  },
  {
    n: "07", pole: "Conseil", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 80% 80% at 75% 30%, #080F1A 0%, #050C18 55%, #030810 100%)",
    title: "Conseil Opérationnel\n& Métier",
    tagline: "Comprendre avant de numériser",
    intro: "Un processus inefficace numérisé reste inefficace — simplement plus rapide et plus coûteux. ACT optimise l'opérationnel avant de choisir la technologie.",
    subs: [
      {
        title: "Business Analysis",
        desc: "Cartographie terrain BPMN, identification des goulots d'étranglement, cahiers des charges fonctionnels directement exploitables."
      },
      {
        title: "Conseil Opérationnel",
        desc: "Optimisation des processus, alignement stratégie–opération–technologie, accompagnement à la mise en œuvre et mesure ROI."
      },
    ],
    benefits: ["Processus optimisés", "Besoins réels identifiés", "ROI concret", "Adoption facilitée"],
    video: "https://cdn.pixabay.com/video/2024/03/01/202560-918431383_large.mp4",
  },
  {
    n: "08", pole: "Formation", poleN: "III", accent: GOLD,
    bg: "radial-gradient(ellipse 90% 70% at 25% 75%, #051A0A 0%, #050C18 55%, #030810 100%)",
    title: "Formation\n& Développement\ndes Compétences",
    tagline: "La souveraineté passe par les talents africains",
    intro: "Les meilleurs systèmes tombent en désuétude si personne ne peut les maintenir. La formation n'est pas un accessoire chez ACT — c'est une condition de la souveraineté technologique.",
    subs: [
      {
        title: "Formation sur Mesure (Présentiel)",
        desc: "Programmes construits sur diagnostic, illustrés d'exemples africains concrets, avec apprentissage par la pratique sur données réelles."
      },
      {
        title: "Formation en Ligne",
        desc: "Modules légers, smartphone-first, consultables hors-ligne (15–30 min). Communauté apprenante avec forums et sessions live."
      },
      {
        title: "Modèle Intégré Conseil & Formation",
        desc: "La formation se fait pendant la mission — l'organisation devient progressivement autonome, sans dépendance externe permanente."
      },
    ],
    benefits: ["Équipes autonomes", "Savoir-faire ancré", "Souveraineté progressive", "Écosystème renforcé"],
    video: "https://cdn.pixabay.com/video/2024/07/21/222279_large.mp4",
  },
];

/* ══════════════════════════════════════════════════════
   TRANSITION VARIANTS — depth-of-field journey (Shell.tsx)
   ══════════════════════════════════════════════════════ */
const variants = {
  enter: (dir: number) => ({
    x: `${dir > 0 ? 5 : -5}%`,
    y: "3%",
    scale: 0.12,
    rotateY: dir > 0 ? 10 : -10,
    rotateX: 5,
    opacity: 0,
    filter: "blur(44px) brightness(0.06) saturate(0.12)",
    zIndex: 2,
  }),
  center: {
    x: "0%", y: "0%", scale: 1, rotateY: 0, rotateX: 0,
    opacity: 1, filter: "blur(0px) brightness(1.0) saturate(1.0)", zIndex: 2,
    transition: { duration: 1.35, ease: [0.04, 0.72, 0.08, 1.0] },
  },
  exit: (dir: number) => ({
    x: `${dir > 0 ? -4 : 4}%`,
    y: "-2%",
    scale: 0.07,
    rotateY: dir > 0 ? -10 : 10,
    rotateX: -4,
    opacity: 0,
    filter: "blur(38px) brightness(0.04) saturate(0.10)",
    zIndex: 1,
    transition: { duration: 0.62, ease: [0.60, 0.0, 1.0, 0.42] },
  }),
};

/* ══════════════════════════════════════════════════════
   TRANSITION FX (same as Shell.tsx)
   ══════════════════════════════════════════════════════ */
const TransitionFlash = memo(function TransitionFlash({ color }: { color: string }) {
  return (
    <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}
      initial={{ opacity: 0 }} animate={{ opacity: [0, 0.32, 0] }}
      transition={{ duration: 0.85, times: [0, 0.12, 1], ease: "easeOut" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 58% 52% at 50% 50%, ${color}66 0%, ${color}28 44%, transparent 72%)`
      }} />
    </motion.div>
  );
});

const VignettePulse = memo(function VignettePulse() {
  return (
    <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}
      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.30, 0] }}
      transition={{ duration: 1.25, times: [0, 0.09, 0.52, 1], ease: "easeOut" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 90% 88% at 50% 50%, transparent 18%, rgba(0,0,0,0.84) 100%)"
      }} />
    </motion.div>
  );
});

/* ══════════════════════════════════════════════════════
   SERVICE CANVAS — animated visual per service
   ══════════════════════════════════════════════════════ */
function ServiceCanvas({ accent, seed }: { accent: string; seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Parse hex → rgb */
    const hex = accent.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    /* Deterministic seed helpers */
    const rng = (i: number) => ((Math.sin(i * 127.1 + seed * 311.7) * 43758.5453) % 1 + 1) % 1;

    /* Particles */
    const COUNT = 50;
    const particles = Array.from({ length: COUNT }, (_, i) => ({
      x: rng(i * 3) * (canvas.width || 400),
      y: rng(i * 3 + 1) * (canvas.height || 200),
      vx: (rng(i * 3 + 2) - 0.5) * 0.7,
      vy: -(0.25 + rng(i) * 0.55),
      size: 0.6 + rng(i * 7) * 2.0,
      life: rng(i * 11),
    }));

    let raf: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const t = Date.now() / 1000;

      /* Trail: semi-transparent fill → persistence of vision */
      ctx.fillStyle = "rgba(5,12,24,0.18)";
      ctx.fillRect(0, 0, W, H);

      /* Particles */
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.0035 + rng(i) * 0.002;

        if (p.y < -4 || p.life >= 1) {
          p.x = rng(i * t * 0.01 + 1) * W;
          p.y = H + 4;
          p.life = 0;
        }

        const alpha = Math.sin(p.life * Math.PI) * 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        /* Glow */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.12})`;
        ctx.fill();
      });

      /* Sine wave — two overlapping layers */
      const drawWave = (amp: number, freq: number, speed: number, alpha: number, lw: number) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lw;
        for (let x = 0; x <= W; x++) {
          const y = H * 0.5 + Math.sin(x * freq + t * speed) * amp
            + Math.sin(x * freq * 2.3 + t * speed * 0.7) * (amp * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      drawWave(H * 0.14, 0.018 + seed * 0.002, 1.4, 0.35, 1.2);
      drawWave(H * 0.07, 0.034 + seed * 0.001, 2.1, 0.15, 0.6);

      /* Vertical grid lines (subtle) */
      ctx.strokeStyle = `rgba(${r},${g},${b},0.04)`;
      ctx.lineWidth = 1;
      const cols = 8 + seed % 4;
      for (let c = 1; c < cols; c++) {
        const x = (W / cols) * c;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [accent, seed]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   SCANLINE
   ══════════════════════════════════════════════════════ */
function ScanLine({ color }: { color: string }) {
  return (
    <motion.div aria-hidden className="absolute left-0 w-full pointer-events-none"
      style={{
        height: 1, zIndex: 4,
        background: `linear-gradient(to right, transparent, ${color}88 30%, ${color}dd 50%, ${color}88 70%, transparent)`,
        boxShadow: `0 0 20px 3px ${color}44`
      }}
      initial={{ top: "-1px", opacity: 0 }}
      animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 9, times: [0, 0.05, 0.93, 1] }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   DIAMOND
   ══════════════════════════════════════════════════════ */
function Diamond({ size = "0.55rem", color = ORANGE }: { size?: string; color?: string }) {
  return (
    <span aria-hidden style={{
      display: "inline-block", width: size, height: size,
      background: color, transform: "rotate(45deg)", flexShrink: 0
    }} />
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE PANEL — layout cinématique immersif
   ══════════════════════════════════════════════════════ */
function ServicePanel({ svc }: { svc: Svc }) {
  /* Mouse parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useSpring(mx, { stiffness: 18, damping: 16 });
  const bgY = useSpring(my, { stiffness: 18, damping: 16 });
  const midX = useSpring(mx, { stiffness: 45, damping: 20 });
  const midY = useSpring(my, { stiffness: 45, damping: 20 });
  const fgX = useSpring(mx, { stiffness: 90, damping: 22 });
  const fgY = useSpring(my, { stiffness: 90, damping: 22 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth - 0.5) * 2);
    my.set((e.clientY / window.innerHeight - 0.5) * 2);
  }, [mx, my]);

  /* Particules déterministes */
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i, x: (i * 61 + 11) % 100, y: (i * 73 + 23) % 100,
    size: 0.9 + (i % 3) * 0.5, dur: 4.5 + (i % 5) * 1.1, delay: (i % 6) * 0.6,
  })), []);

  const isGold = svc.accent === GOLD;

  return (
    <div
      onMouseMove={onMouseMove}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {/* ── Background gradient parallax ── */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", inset: "-10%", background: svc.bg, x: bgX, y: bgY, zIndex: 0 }}
      />

      {/* ── Particles ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        {particles.map(p => (
          <motion.div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: svc.accent, boxShadow: `0 0 ${p.size * 7}px ${svc.accent}88`,
          }}
            animate={{ y: [0, -38, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Scanline ── */}
      <ScanLine color={svc.accent} />


      {/* ── Horizontal ambient lines ── */}
      {(["18%", "82%"] as const).map(pos => (
        <motion.div key={pos} aria-hidden style={{
          position: "absolute", left: 0, width: "100%", height: 1, top: pos,
          background: "rgba(255,255,255,0.04)", pointerEvents: "none", originX: 0.5, zIndex: 1,
        }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [...EASE] }} />
      ))}

      {/* ══ CONTENT ══ */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex",
        flexDirection: "row",
        padding: "clamp(2rem, 5vw, 5rem) clamp(2rem, 5.5vw, 5.5rem) clamp(3rem, 6vw, 6rem)",
        overflow: "hidden",
      }}>

        {/* ══ CONTENU ══ */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          maxWidth: "680px",
        }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <Diamond size="0.45rem" color={svc.accent} />
              <span style={{
                fontSize: "clamp(1rem, 1.3vw, 1.25rem)", color: "#ffffff",
                letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700
              }}>
                Pôle {svc.poleN} · {svc.pole}
              </span>
            </div>

            {/* ── Title ── */}
            <div style={{ overflow: "hidden", marginBottom: "0.3rem" }}>
              {svc.title.split("\n").map((line, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <motion.h2
                    className="font-black uppercase"
                    style={{
                      fontSize: "clamp(2.2rem, 4.5vw, 6rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.03em",
                      color: i === 0 ? "#fff" : i === 1 ? svc.accent : "rgba(255,255,255,0.85)",
                      display: "block",
                    }}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.05, delay: i * 0.12, ease: [...BURST] }}
                  >
                    {line}
                  </motion.h2>
                </div>
              ))}
            </div>

            {/* ── Rule ── */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [...EASE] }}
              style={{ height: 1, background: `${svc.accent}88`, originX: 0, margin: "1.5rem 0" }}
            />

            {/* ── Video (takes all remaining space) ── */}
            <motion.div
              style={{
                marginTop: "1.5rem",
                flex: 1,
                minHeight: "8rem",
                overflow: "hidden",
                position: "relative",
                border: `1px solid ${svc.accent}33`,
              }}
              initial={{ opacity: 0, scaleY: 0.85 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 1.0, duration: 0.9, ease: [...EASE] }}
            >
              <video
                key={svc.video}
                src={svc.video}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "brightness(0.55) saturate(0.7)",
                }}
              />
              {/* accent gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to right, ${svc.accent}22 0%, transparent 50%), linear-gradient(to bottom, transparent 40%, #050C18 100%)`,
              }} />
              {/* left accent bar */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 2, background: svc.accent
              }} />
            </motion.div>
          </motion.div>



          {/* ── Benefits ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <p style={{
              fontSize: "clamp(1rem, 1.3vw, 1.25rem)", color: "#ffffff",
              letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "0.8rem"
            }}>
              Bénéfices
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {svc.benefits.map((b, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.07, duration: 0.4 }}
                  style={{
                    padding: "0.4rem 0.9rem", border: `1px solid ${svc.accent}44`,
                    color: svc.accent, fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700
                  }}
                >{b}</motion.span>
              ))}
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            style={{ marginTop: "1.5rem" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.55 }}
          >
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.8rem",
              color: "#ffffff", fontSize: "clamp(1.05rem, 1.3vw, 1.25rem)",
              letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
            }}>
              <Diamond size="0.42rem" color={svc.accent} />
              Discuter de ce service
            </Link>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PROGRESS BAR (fixed top)
   ══════════════════════════════════════════════════════ */
function ProgressBar({ current, total, accent }: { current: number; total: number; accent: string }) {
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000,
      background: "rgba(255,255,255,0.06)",
    }}>
      <motion.div
        style={{ position: "absolute", left: 0, top: 0, height: "100%", background: accent, originX: 0 }}
        animate={{ scaleX: (current + 1) / total }}
        transition={{ duration: 0.6, ease: [...EASE] }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE NAV (fixed bottom — dots + label)
   ══════════════════════════════════════════════════════ */
function ServiceNav({ current, services, onGoTo }: {
  current: number; services: Svc[]; onGoTo: (i: number) => void;
}) {
  const svc = services[current];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      padding: "0 5.5rem 3rem", pointerEvents: "none",
      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    }}>
      {/* Left — current service info */}
      <motion.div
        key={current}
        style={{ pointerEvents: "none" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span style={{
          fontSize: "clamp(1rem, 1.3vw, 1.25rem)", color: "#ffffff",
          letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: "0.3rem", fontWeight: 700
        }}>
          {svc.pole}
        </span>
        <span style={{
          fontSize: "clamp(1rem, 1.3vw, 1.35rem)", fontWeight: 900,
          color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.04em"
        }}>
          {svc.title.split("\n")[0]}
        </span>
      </motion.div>

      {/* Center — dots */}
      <div style={{
        position: "absolute", left: "50%", bottom: "3rem",
        transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "0.6rem",
        pointerEvents: "auto",
      }}>
        {services.map((s, i) => (
          <button key={i} onClick={() => onGoTo(i)} aria-label={s.title.split("\n")[0]}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem" }}>
            <motion.div
              animate={{
                width: i === current ? 28 : 5,
                background: i === current ? svc.accent : "rgba(255,255,255,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{ height: 4, borderRadius: 99 }}
            />
          </button>
        ))}
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HERO (scroll-through vers le journey)
   ══════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section style={{
      height: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "flex-end", padding: "0 clamp(1.5rem, 4.5vw, 5.5rem) clamp(4rem, 7vw, 8rem)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Giant ghost */}
      <motion.div aria-hidden className="font-black uppercase select-none pointer-events-none"
        style={{
          position: "absolute", fontSize: "clamp(10rem, 22vw, 28rem)",
          lineHeight: 0.82, letterSpacing: "-0.05em",
          color: `${ORANGE}06`, top: "8%", left: "-1rem", zIndex: 0,
        }}
        initial={{ opacity: 0, y: 60, filter: "blur(30px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.6, ease: [...BURST] }}
      >
        NOS<br />EXPERTISES
      </motion.div>

      {/* Horizontal lines */}
      {["20%", "80%"].map(pos => (
        <motion.div key={pos} aria-hidden style={{
          position: "absolute", left: 0, width: "100%", height: 1,
          background: "rgba(255,255,255,0.05)", top: pos,
        }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [...EASE] }} />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
          initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          <Diamond size="0.5rem" />
          <span style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.35rem)", color: "#ffffff", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            L'Arborescence ACT
          </span>
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          <motion.h1 className="font-black uppercase"
            style={{ fontSize: "var(--font-90)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
            initial={{ y: "112%" }} animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease: [...BURST], delay: 0.05 }}>
            Nos Services
          </motion.h1>
        </div>

        <motion.div style={{ height: 1, background: ORANGE, originX: 0, margin: "2.5rem 0" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.9, ease: [...EASE] }} />

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
          <motion.p style={{ fontSize: "var(--font-20)", color: "#ffffff", lineHeight: 1.7, maxWidth: "36rem" }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.65 }}>
            Trois pôles complémentaires — Ingénierie, Conseil et Formation — couvrant l&apos;intégralité de la chaîne de valeur de la transformation digitale africaine.
          </motion.p>

          <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <Diamond size="0.4rem" color={ORANGE} />
              <span style={{ fontSize: "1.0rem", color: ORANGE, letterSpacing: "0.2em", textTransform: "uppercase" }}>5 services Ingénierie</span>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <Diamond size="0.4rem" color={GOLD} />
              <span style={{ fontSize: "1.0rem", color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase" }}>3 services Conseil</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "3.5rem" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}>
          <motion.div
            style={{ width: 1, height: 48, background: `${ORANGE}88`, originY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{
            fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)", color: "#ffffff",
            letterSpacing: "0.35em", textTransform: "uppercase"
          }}>Scroll pour explorer</span>
        </motion.div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════
   CATALOGUE PANEL — accordion par catégorie
   ══════════════════════════════════════════════════════ */
function CataloguePanel({ svc }: { svc: Svc }) {
  const [formations, setFormations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shopify/formations")
      .then(res => res.json())
      .then(json => setFormations(json.formations || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Grouper les formations par secteur
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    formations.forEach(f => {
      const key = f.secteur || "Autres";
      if (!map[key]) map[key] = [];
      map[key].push(f);
    });
    return Object.entries(map);
  }, [formations]);

  const [openCat, setOpenCat] = useState<string | null>(grouped[0]?.[0] ?? null);

  return (
    <div onMouseMove={() => {}} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Background */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: svc.bg, zIndex: 0 }} />
      <ScanLine color={svc.accent} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "row",
        padding: "clamp(2rem, 5vw, 5rem) clamp(2rem, 5.5vw, 5.5rem) clamp(3rem, 6vw, 6rem)",
        gap: "3rem",
        overflow: "hidden",
      }}>
        {/* Colonne gauche — header */}
        <div style={{ flexShrink: 0, width: "clamp(220px, 28vw, 340px)", display: "flex", flexDirection: "column", gap: "1.5rem", justifyContent: "flex-start", paddingTop: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Diamond size="0.45rem" color={svc.accent} />
            <span style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)", color: "#ffffff", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>
              Pôle {svc.poleN} · {svc.pole}
            </span>
          </div>
          <div style={{ overflow: "hidden" }}>
            {svc.title.split("\n").map((line, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <motion.h2
                  className="font-black uppercase"
                  style={{ fontSize: "clamp(1.8rem, 3.2vw, 4.2rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: i === 0 ? "#fff" : svc.accent, display: "block" }}
                  initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: i * 0.12, ease: [...BURST] }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [...EASE] }}
            style={{ height: 1, background: `${svc.accent}88`, originX: 0 }}
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            style={{ fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}
          >
            {svc.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              padding: "0.65rem 1.4rem",
              border: `1px solid ${svc.accent}55`,
              color: svc.accent, fontSize: "0.8rem",
              letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700,
            }}>
              <Diamond size="0.35rem" color={svc.accent} />
              Formation sur mesure
            </Link>
          </motion.div>
        </div>

        {/* Colonne droite — accordion */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0, overflowY: "auto", paddingRight: "0.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
            style={{ marginBottom: "1.2rem" }}
          >
            <p style={{ fontSize: "clamp(0.78rem, 0.9vw, 0.9rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              {isLoading ? "Chargement..." : `${formations.length} formations disponibles`}
            </p>
          </motion.div>

          {grouped.map(([categorie, formations], gi) => (
            <motion.div
              key={categorie}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + gi * 0.07, duration: 0.45 }}
            >
              {/* Header catégorie */}
              <button
                onClick={() => setOpenCat(openCat === categorie ? null : categorie)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.85rem 0",
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                }}
              >
                <motion.span
                  animate={{ rotate: openCat === categorie ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 20, height: 20, flexShrink: 0,
                    border: `1.5px solid ${svc.accent}`,
                    borderRadius: "50%",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v8M1 5h8" stroke={svc.accent} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </motion.span>
                <span style={{
                  fontWeight: 700, fontSize: "clamp(0.85rem, 1.05vw, 1rem)",
                  color: openCat === categorie ? svc.accent : "rgba(255,255,255,0.85)",
                  letterSpacing: "0.04em", textAlign: "left", transition: "color 0.2s",
                }}>
                  {categorie}
                </span>
                <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                  {formations.length}
                </span>
              </button>

              {/* Liste des formations */}
              <AnimatePresence initial={false}>
                {openCat === categorie && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingBottom: "0.5rem" }}>
                      {formations.map((f: any, fi: number) => (
                        <Link
                          key={f.slug}
                          href={`/formations/${f.slug}`}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 6 }}
                            transition={{ delay: fi * 0.04, duration: 0.18 }}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.75rem",
                              padding: "0.65rem 0 0.65rem 1.8rem",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: `${svc.accent}88`, flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: "clamp(0.82rem, 1vw, 0.95rem)", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
                              {f.title}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", flexShrink: 0 }}>
                              {f.duree}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={svc.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICES JOURNEY — scroll-driven rooms
   ══════════════════════════════════════════════════════ */
function ServicesJourney({ onCurrentChange }: { onCurrentChange?: (n: string) => void }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const navigating = useRef(false);
  const currentRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* Mobile detection */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });

  /* Map scroll progress → service index */
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (navigating.current) return;
      const next = Math.min(
        Math.floor(v * SERVICES.length),
        SERVICES.length - 1,
      );
      if (next !== currentRef.current) {
        const d = next > currentRef.current ? 1 : -1;
        setDir(d);
        currentRef.current = next;
        setCurrent(next);
        onCurrentChange?.(SERVICES[next].n);
        navigating.current = true;
        setTimeout(() => { navigating.current = false; }, THROTTLE);
      }
    });
  }, [scrollYProgress]);

  /* Direct navigation via dots */
  const goTo = useCallback((idx: number) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const progress = (idx + 0.5) / SERVICES.length;
    const scrollTarget = el.offsetTop + progress * (el.scrollHeight - window.innerHeight);
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  }, []);

  const svc = SERVICES[current];

  /* Mobile fallback: render all services as scrollable sections */
  if (isMobile) {
    return (
      <div style={{ background: "#0A1410", padding: "5rem 1rem" }}>
        {SERVICES.map((service, idx) => (
          <div key={idx} style={{ marginBottom: "4rem", padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: service.accent }} />
              <span style={{ fontSize: "0.85rem", color: service.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Pôle {service.poleN} · {service.pole}
              </span>
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, textTransform: "uppercase", color: "#fff", marginBottom: "1rem", lineHeight: 1.1 }}>
              {service.title}
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {service.intro}
            </p>
            <Link href="/services" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: service.accent, color: "#fff", textDecoration: "none", borderRadius: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", fontWeight: 600 }}>
              En savoir plus
            </Link>
          </div>
        ))}
        <CTASection />
      </div>
    );
  }

  return (
    <>
      <ProgressBar current={current} total={SERVICES.length} accent={svc.accent} />

      {/* Scroll trigger zone */}
      <div ref={containerRef} style={{ height: `${SERVICES.length * 100}vh`, position: "relative" }}>

        {/* Sticky viewport */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          {/* Perspective container */}
          <div style={{ position: "absolute", inset: 0, perspective: "1000px", perspectiveOrigin: "50% 46%" }}>
            <AnimatePresence mode="sync" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                {svc.n === "09" ? <CataloguePanel svc={svc} /> : <ServicePanel svc={svc} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Transition FX */}
          <TransitionFlash key={`flash-${current}`} color={svc.accent} />
          <VignettePulse key={`vgnt-${current}`} />

          {/* Navigation */}
          <ServiceNav current={current} services={SERVICES} onGoTo={goTo} />
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   SHELL
   ══════════════════════════════════════════════════════ */
export default function ServicesShell() {
  const [currentN, setCurrentN] = useState("01");
  const isCatalogue = currentN === "09";

  return (
    <div style={{ background: "#0A1410", minHeight: "100vh", position: "relative" }}>
      {/* Background layers */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#0A1410" }}>
        <WaveTerrain />
        <Grain />
        <Cursor />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <ServicesJourney onCurrentChange={setCurrentN} />
        {isCatalogue ? (
          <CatalogueSection />
        ) : (
          <CTASection
            eyebrow="Votre projet"
            title="Construisons l'avenir ensemble"
            description="Chaque transformation commence par une conversation. Partagez-nous votre projet — notre équipe vous répond sous 48h."
            buttonText="Démarrer votre projet"
          />
        )}
      </div>
    </div>
  );
}
