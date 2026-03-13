"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";

export default function ProjectsGrid() {
    return (
        <section className="py-20 px-10 lg:px-16 relative z-10 min-h-screen flex flex-col justify-center items-center">
            <div className="max-w-screen-xl mx-auto w-full">
                {/* Header */}
                <div className="mb-16 text-center mb-20">
                    <h2 className="text-white text-5xl md:text-7xl font-black uppercase mb-5">
                        Découvrir nos <span className="text-[#D35400]">Réalisations</span>
                    </h2>
                    <div className="w-28 h-1.5 bg-[#D35400] mx-auto" />
                </div>

                {/* Grid: 2 projets à gauche + 2 projets à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12">
                    {/* 2 projets (gauche) */}
                    <div className="flex flex-col gap-10 w-full">
                        {PROJECTS.slice(0, 2).map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group w-full"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="relative aspect-video min-h-[280px] overflow-hidden bg-white/5 rounded-lg">
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute top-4 left-4 px-3 py-2 bg-[#D35400] text-white text-xs font-bold uppercase tracking-widest">
                                            {project.category}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-px bg-[#D35400]" />
                                        <span className="text-[#D35400] text-sm font-bold uppercase tracking-widest">
                                            {project.category}
                                        </span>
                                    </div>
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug group-hover:text-[#D35400] transition-colors line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-white/50 text-base line-clamp-2 font-light">{project.tagline}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 2 projets (droite) */}
                    <div className="flex flex-col gap-10 w-full">
                        {PROJECTS.slice(2, 4).map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: (idx + 2) * 0.1 }}
                                className="group w-full"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="relative aspect-video min-h-[280px] overflow-hidden bg-white/5 rounded-lg">
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute top-4 left-4 px-3 py-2 bg-[#D35400] text-white text-xs font-bold uppercase tracking-widest">
                                            {project.category}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-px bg-[#D35400]" />
                                        <span className="text-[#D35400] text-sm font-bold uppercase tracking-widest">
                                            {project.category}
                                        </span>
                                    </div>
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug group-hover:text-[#D35400] transition-colors line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-white/50 text-base line-clamp-2 font-light">{project.tagline}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bouton CTA centré */}
                <div className="flex justify-center mt-20">
                    <Link href="/projects" className="cta-btn" style={{ textDecoration: "none" }}>
                        <span className="cta-btn__border" aria-hidden />
                        <span className="cta-btn__blur" aria-hidden />
                        <span className="cta-btn__background" aria-hidden />
                        <span className="cta-btn__inner">
                            <span className="cta-btn__icon" aria-hidden />
                            <span className="cta-btn__text">Voir tous les projets</span>
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
