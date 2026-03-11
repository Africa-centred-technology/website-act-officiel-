"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

export default function RoomPortail() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const midX = useSpring(mx, { stiffness: 62, damping: 22 });
    const midY = useSpring(my, { stiffness: 62, damping: 22 });

    const onMouseMove = (e: React.MouseEvent) => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    return (
        <div
            onMouseMove={onMouseMove}
            className="relative flex flex-col items-center justify-center overflow-hidden room-pad text-center"
            style={{ width: "100%", height: "100%" }}
        >


            <motion.div style={{ x: midX, y: midY, zIndex: 2 }} className="max-w-5xl flex flex-col items-center">

                {/* Visual marker — pulse dot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.04, 0.72, 0.08, 1.0] }}
                    className="w-20 h-20 rounded-full border border-[rgba(211,84,0,0.3)] flex items-center justify-center mb-6 relative"
                    style={{ background: "radial-gradient(circle, rgba(211,84,0,0.15) 0%, transparent 70%)" }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D35400] animate-ping absolute" />
                    <div className="w-3 h-3 rounded-full bg-[#D35400]" />
                </motion.div>

                {/* Main Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: [0.04, 0.72, 0.08, 1.0], delay: 0.2 }}
                    className="font-black uppercase text-white mb-2"
                    style={{ fontSize: "clamp(3.2rem, 8vw, 7.5rem)", lineHeight: 1.0, fontFamily: "'Geist', sans-serif" }}
                >
                    DÉCOUVREZ LE <span className="text-[#D35400]">PORTAIL</span>
                </motion.h2>

                {/* Subtitle / Catchphrase */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
                    className="font-bold uppercase tracking-[0.3em] text-[#D35400]/80 mb-10 text-center"
                    style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)", fontFamily: "'Geist', sans-serif" }}
                >
                    La technologie pensée pour l’Afrique, conçue pour transformer le futur.
                </motion.div>

                {/* Main Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.65 }}
                    className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-16 max-w-3xl mx-auto"
                    style={{ fontFamily: "'Geist', sans-serif" }}
                >
                    Africa Centred Technology développe des solutions digitales, des infrastructures intelligentes et des plateformes innovantes pour accompagner les entreprises africaines.
                </motion.p>

                {/* Three Actions — CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    {[
                        { label: "Découvrir nos services", href: "#" },
                        { label: "Voir nos réalisations", href: "#" },
                        { label: "Lire le blog", href: "#" }
                    ].map((btn, idx) => (
                        <Link
                            key={idx}
                            href={btn.href}
                            className="group relative overflow-hidden px-8 py-4 border border-white/10 bg-white/5 hover:border-[#D35400]/50 transition-all duration-500 min-w-[240px]"
                            style={{ fontFamily: "'Geist', sans-serif" }}
                        >
                            {/* Hover slide effect */}
                            <div className="absolute inset-0 bg-[#D35400]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                            <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                                {btn.label}
                            </span>

                            {/* Small decorative corner or diamond? Let's use a subtle edge line */}
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D35400] group-hover:w-full transition-all duration-700" />
                        </Link>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
