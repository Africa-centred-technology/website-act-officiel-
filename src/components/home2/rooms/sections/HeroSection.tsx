"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative w-full aspect-[21/9] min-h-[400px] overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
                        <span className="text-[#D35400] font-bold tracking-widest uppercase mb-4">
                            Cas d'usage majeur
                        </span>
                        <h2 className="text-white text-3xl md:text-6xl font-black max-w-4xl mb-8 leading-tight">
                            SYSTÈME RAG MULTI-SOURCES POUR ENVIRONNEMENTS CRITIQUES
                        </h2>
                        <Link
                            href="/projects/rag"
                            className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-[#D35400] hover:text-white transition-all"
                        >
                            Découvrir la solution
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
