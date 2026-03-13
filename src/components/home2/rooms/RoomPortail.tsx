"use client";

import React from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/data/projects";

export default function RoomPortail() {
    // Logos des entreprises clientes
    const clients = [
        { name: "Lear", logo: "/logo_entreprise_partenaire/Logo_Lear.png" },
        { name: "Yoozak", logo: "/logo_entreprise_partenaire/logo_Yoozak.png" },
        { name: "GreenSIG", logo: "/logo_entreprise_partenaire/logo_green_sig.png" },
    ];

    return (
        <div className="h-full w-full overflow-hidden relative flex flex-col">
            {/* Content Section */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-center py-8 custom-scrollbar">
                <div className="w-full">
                    {/* Titre */}
                    <div className="mb-8 text-center px-12">
                        <h2 className="text-white text-3xl md:text-4xl font-black uppercase mb-2">
                            Nos <span className="text-[#D35400]">Réalisations</span>
                        </h2>
                        <div className="w-16 h-1 bg-[#D35400] mx-auto" />
                    </div>

                    {/* Affichage horizontal des projets statiques */}
                    <div className="w-full px-12 mb-24">
                        <div className="flex gap-6 overflow-x-hidden justify-center flex-wrap md:flex-nowrap">
                            {PROJECTS.slice(0, 4).map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="group flex-shrink-0 w-[300px]"
                                >
                                    <div className="flex flex-col bg-white/5 rounded-xl overflow-hidden shadow-2xl h-[450px] border border-white/10 group-hover:border-[#D35400]/50 transition-colors duration-300">
                                        {/* Partie 1 : Image (moitié supérieure) */}
                                        <div className="relative w-full h-[220px] flex-shrink-0 overflow-hidden">
                                            <img 
                                                src={project.image} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-[#D35400] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md z-10">
                                                {project.category}
                                            </div>
                                        </div>
                                        
                                        {/* Partie 2 : Contenu (moitié inférieure) */}
                                        <div className="p-6 flex flex-col flex-1">
                                            {/* Meta */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="w-6 h-px bg-[#D35400]" />
                                                <span className="text-[#D35400] text-xs font-bold uppercase tracking-widest">
                                                    {project.category}
                                                </span>
                                            </div>
                                            
                                            {/* Titre */}
                                            <h3 className="text-white text-lg font-bold leading-tight group-hover:text-[#D35400] transition-colors line-clamp-2 mb-3">
                                                {project.title}
                                            </h3>
                                            
                                            {/* Description avec flex-1 pour pousser vers le bas si besoin, mais ici on limite les lignes */}
                                            <p className="text-white/70 text-sm line-clamp-3 leading-relaxed flex-1">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Ils nous font confiance - Défilement infini */}
                    <div className="w-full pt-12 pb-6 border-t border-white/10 mt-auto">
                        <h3 className="text-white/60 text-center text-sm uppercase tracking-widest mb-10 px-12">
                            Ils nous font confiance
                        </h3>
                        <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-black before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-black after:to-transparent">
                            <motion.div
                                className="flex w-max"
                                animate={{
                                    x: ["0%", "-50%"],
                                }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 25,
                                        ease: "linear",
                                    },
                                }}
                            >
                                {/* On répète la liste 2 fois pour le conteneur principal, avec les logos multipliés à l'intérieur pour remplir l'écran */}
                                {[...Array(2)].map((_, setIdx) => (
                                    <div key={`logo-set-${setIdx}`} className="flex flex-shrink-0 min-w-max gap-12 pr-12">
                                        {[...clients, ...clients, ...clients, ...clients, ...clients, ...clients].map((client, idx) => (
                                            <div
                                                key={`logo-${setIdx}-${idx}`}
                                                className="flex-shrink-0 w-28 h-16 flex items-center justify-center"
                                            >
                                                <div className="w-28 h-16 bg-white rounded-lg p-3 flex items-center justify-center shadow-lg">
                                                    <img 
                                                        src={client.logo} 
                                                        alt={client.name} 
                                                        className="max-w-full max-h-full object-contain" 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
