"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    id: "rag",
    index: "01",
    title: "Système RAG Multi-sources",
    category: "Intelligence Artificielle",
    year: "2024–25",
    desc: "Système de récupération augmentée multimodal intégrant documents, images, audio et vidéo pour opérer en environnement à faible connectivité.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "cod",
    index: "02",
    title: "CODRescue Platform",
    category: "E-commerce & Logistique",
    year: "2024",
    desc: "Plateforme complète de gestion e-commerce avec dashboards en temps réel, intégrations multi-transporteurs et optimisation des coûts.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "sig",
    index: "03",
    title: "GreenSIG V1",
    category: "Systèmes d'Information Géographique",
    year: "2026",
    desc: "Application de gestion des espaces verts avec cartographie interactive, suivi temps réel des interventions et capteurs IoT terrain.",
    image: "https://images.unsplash.com/photo-1542601906897-a1cf845e6ed6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "gam",
    index: "04",
    title: "GAM — Génies Afrique Médias",
    category: "Média & Éditorial",
    year: "2026",
    desc: "Web TV panafricaine avec architecture headless, gestion éditoriale avancée et diffusion multi-canal pour 15 pays africains.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AxWork() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      className="relative"
      style={{ background: "rgba(3,6,10,0.88)", zIndex: 2, borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Header */}
      <div style={{ padding: "8rem 6rem 4rem" }}>
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="diamond diamond--sm" />
              <span className="text-white/35 uppercase tracking-[0.25em]" style={{ fontSize: "1.2rem" }}>
                Portfolio
              </span>
            </div>
            <h2 className="font-black uppercase text-white" style={{ fontSize: "var(--font-50)", lineHeight: 1.0 }}>
              Nos <span className="text-[#D35400]">Réalisations</span>
            </h2>
          </div>
          <span className="hidden md:block text-white/15 font-black uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
            04 / ARCHIVE
          </span>
        </motion.div>
      </div>

      {/* Accordion list */}
      <div style={{ padding: "0 6rem 8rem" }}>
        {projects.map((p, i) => {
          const isOpen = open === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              {/* Row header — clickable */}
              <button
                className="w-full text-left"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  padding: "2.4rem 0",
                  cursor: "none",
                }}
                onClick={() => setOpen(isOpen ? null : p.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-8">
                    <span className="text-white/20 font-black" style={{ fontSize: "1.2rem", letterSpacing: "0.1em" }}>
                      {p.index}
                    </span>
                    <motion.h3
                      className="font-black uppercase text-white"
                      animate={{ color: isOpen ? "#D35400" : "#ffffff" }}
                      style={{ fontSize: "var(--font-40)", lineHeight: 1 }}
                    >
                      {p.title}
                    </motion.h3>
                  </div>
                  <div className="flex items-center gap-8 hidden md:flex">
                    <span className="text-white/40 uppercase" style={{ fontSize: "1.15rem", letterSpacing: "0.1em" }}>
                      {p.category}
                    </span>
                    <span className="text-white/25 uppercase" style={{ fontSize: "1.15rem", letterSpacing: "0.1em" }}>
                      {p.year}
                    </span>
                    {/* Toggle arrow */}
                    <motion.span
                      className="text-[#D35400] font-black"
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      style={{ fontSize: "2rem", display: "block" }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </button>

              {/* Expandable image + description panel */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.6, 0.08, 0.02, 0.99] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: "1fr 1.6fr", gap: "4rem", paddingBottom: "4rem" }}
                    >
                      {/* Image with clip-path reveal */}
                      <motion.div
                        className="relative overflow-hidden"
                        style={{ height: "32rem" }}
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.6, 0.08, 0.02, 0.99] }}
                      >
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="40vw"
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to right, rgba(3,6,10,0.3), transparent)" }}
                        />
                      </motion.div>

                      {/* Description */}
                      <motion.div
                        className="flex flex-col justify-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="diamond diamond--sm" />
                          <span className="text-[#D35400] uppercase" style={{ fontSize: "1.1rem", letterSpacing: "0.2em" }}>
                            {p.category}
                          </span>
                        </div>
                        <h4
                          className="font-black uppercase text-white mb-6"
                          style={{ fontSize: "var(--font-35)", lineHeight: 1.05 }}
                        >
                          {p.title}
                        </h4>
                        <div style={{ width: 40, height: 1, background: "#D35400", marginBottom: "2rem" }} />
                        <p className="text-white/45 mb-8" style={{ fontSize: "var(--font-20)", lineHeight: 1.72 }}>
                          {p.desc}
                        </p>
                        <span
                          className="flex items-center gap-3 text-white/35 uppercase"
                          style={{ fontSize: "1.15rem", letterSpacing: "0.12em" }}
                        >
                          <span className="diamond diamond--sm" />
                          Voir le projet →
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {/* Final border */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
      </div>
    </section>
  );
}
