"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    n: "01",
    title: "Intelligence\nArtificielle",
    tag: "IA & ML",
    desc: "LLMs locaux, RAG multimodal, agents autonomes et IA générative taillés pour les réalités africaines.",
    href: "/services#ia",
  },
  {
    n: "02",
    title: "Transformation\nDigitale",
    tag: "Cloud & DevOps",
    desc: "Architectures micro-services, DevOps et migration cloud-native pour accélérer votre time-to-market.",
    href: "/services#transformation",
  },
  {
    n: "03",
    title: "Data &\nSouveraineté",
    tag: "Data Engineering",
    desc: "Pipelines sécurisés, gouvernance et analytique avancée pour maîtriser vos actifs stratégiques.",
    href: "/services#data",
  },
];

/** 3-D holographic card — scanlines + perspective tilt + orange glow border */
function HoloCard({ svc, index }: { svc: (typeof services)[0]; index: number }) {
  const ref     = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    setTilt({ rx: (py - 0.5) * 20, ry: (px - 0.5) * -20, gx: px * 100, gy: py * 100, on: true });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      style={{ perspective: "1100px" }}
      className="holo-card-wrap"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          padding: "clamp(2.5rem, 4vw, 4.5rem) clamp(1.5rem, 3vw, 3.5rem)",
          minHeight: "clamp(32rem, 38vw, 44rem)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(3,6,10,0.82)",
          border: `1px solid rgba(211,84,0,${tilt.on ? 0.45 : 0.15})`,
          boxShadow: tilt.on
            ? "0 0 0 1px rgba(211,84,0,0.1), 0 0 50px rgba(211,84,0,0.08), inset 0 0 40px rgba(211,84,0,0.03)"
            : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
          overflow: "hidden",
        }}
      >
        {/* Scanlines overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.015) 3px, rgba(211,84,0,0.015) 4px)",
            zIndex: 1,
          }}
        />

        {/* Radial glow at cursor position */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: tilt.on
              ? `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(211,84,0,0.07) 0%, transparent 60%)`
              : "none",
            transition: "background 0.25s",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div className="relative" style={{ zIndex: 3 }}>
          {/* Number */}


          {/* Tag */}
          <div className="flex items-center gap-2 mb-5">
            <span className="diamond diamond--sm" />
            <span className="text-[#D35400] uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
              {svc.tag}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-black uppercase text-white flex-1"
            style={{ fontSize: "var(--font-35)", lineHeight: 1.05, whiteSpace: "pre-line", marginBottom: "2.5rem" }}
          >
            {svc.title}
          </h3>

          {/* Animated separator */}
          <motion.div
            style={{ height: 1, background: "rgba(211,84,0,0.5)", originX: 0, marginBottom: "2rem" }}
            animate={{ scaleX: tilt.on ? 1 : 0.18 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          />

          {/* Desc */}
          <p className="text-white/38 mb-8" style={{ fontSize: "var(--font-18)", lineHeight: 1.72 }}>
            {svc.desc}
          </p>

          {/* Link */}
          <Link
            href={svc.href}
            className="flex items-center gap-3 text-white/30 hover:text-white transition-colors uppercase"
            style={{ fontSize: "1.15rem", letterSpacing: "0.12em" }}
          >
            <span className="diamond diamond--sm" />
            Découvrir
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AxServices() {
  return (
    <section
      className="relative"
      style={{ background: "rgba(3,6,10,0.90)", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div style={{ padding: "clamp(4rem, 7vw, 8rem) clamp(1.5rem, 5vw, 6rem)" }}>
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-16"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="diamond diamond--sm" />
              <span className="text-white/35 uppercase tracking-[0.25em]" style={{ fontSize: "1.2rem" }}>
                Expertises
              </span>
            </div>
            <h2 className="font-black uppercase text-white" style={{ fontSize: "var(--font-50)", lineHeight: 1.0 }}>
              Ce que nous <span className="text-[#D35400]">Construisons</span>
            </h2>
          </div>
          <span className="hidden md:block text-white/15 font-black uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
            03 / CRAFT
          </span>
        </motion.div>

        {/* Holographic 3-col grid */}
        <div className="ax-services-grid">
          {services.map((svc, i) => (
            <HoloCard key={svc.n} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
