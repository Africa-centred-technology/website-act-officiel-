"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";

// Hook pour détecter la taille d'écran
function useMediaQuery() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
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

type Dir = 1 | -1;

export default function RoomPortail() {
    const screenSize = useMediaQuery();
    const total = Math.min(4, PROJECTS.length);
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState<Dir>(1);
    const [isDragging, setIsDragging] = useState(false);

    // Drag state
    const dragStartX = useRef(0);
    const hasDragged = useRef(false);

    // Logos des entreprises clientes
    const clients = [
        { name: "Lear", logo: "/logo_entreprise_partenaire/Logo_Lear.png" },
        { name: "Yoozak", logo: "/logo_entreprise_partenaire/logo_Yoozak.png" },
        { name: "GreenSIG", logo: "/logo_entreprise_partenaire/logo_green_sig.png" },
    ];

    const go = useCallback(
        (d: Dir) => {
            setDir(d);
            setActive((prev) => (prev + d + total) % total);
        },
        [total]
    );

    const goTo = useCallback(
        (i: number) => {
            setDir(i > active ? 1 : -1);
            setActive(i);
        },
        [active]
    );

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [go]);

    // Mouse drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        dragStartX.current = e.clientX;
        hasDragged.current = false;
        setIsDragging(true);
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = Math.abs(e.clientX - dragStartX.current);
        if (dx > 8) hasDragged.current = true;
    };
    const onMouseUp = (e: React.MouseEvent) => {
        setIsDragging(false);
        if (!hasDragged.current) return;
        const dx = e.clientX - dragStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    };
    const onMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStartX.current;
            if (hasDragged.current && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }
    };

    // Touch handlers
    const onTouchStart = (e: React.TouchEvent) => {
        dragStartX.current = e.touches[0].clientX;
        hasDragged.current = false;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - dragStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    };

    return (
        <div className="h-full w-full overflow-hidden relative">
            {/* Content Section */}
            <div className=" overflow-y-auto overflow-x-hidden py-8 custom-scrollbar">
                {/* Spacer léger entre navbar et contenu */}
                <div className="h-12" />

                <div className="w-full pt-32 md:pt-40 lg:pt-48">

                    {/* Conteneur des titres avec des padding importants pour éviter les extrêmes */}
                    <div className="w-full px-8 md:px-12 lg:px-16 xl:px-20">
                        {/* En-tête avec flex-row, aligné en bas et bordure en dessous pour correspondre à l'image */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 mb-16">
                            {/* Eyebrow - aligné à gauche et plus bas visuellement */}
                            <motion.div
                                className="flex items-center gap-2.5 mb-5"
                                style={{ marginLeft: "1rem", marginRight: "auto" }}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.05 }}
                            >
                                <span className="diamond diamond--sm" />
                                <span style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "0.75rem",
                                    letterSpacing: "0.32em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.4)",
                                }}>
                                    NOS RÉALISATIONS
                                </span>
                            </motion.div>

                            {/* Titre Principal - aligné à droite */}
                            <motion.h2
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.75, delay: 0.15 }}
                                className="text-right"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 900,
                                    fontSize: "clamp(1.5rem, 3vw, 3.5rem)",
                                    lineHeight: 0.9,
                                    letterSpacing: "-0.02em",
                                    textTransform: "uppercase",
                                    color: "#fff",
                                    marginLeft: "auto",
                                    marginRight: "1rem",
                                }}
                            >
                                NOS PROJETS &
                                  <span style={{ color: "#D35400" }}> DÉFIS RELEVÉS</span>
                            </motion.h2>
                        </div>
                    </div>

                    {/* Spacer pour créer un espacement visible */}
                    <div className="h-20" />

                    {/* Affichage Desktop - Grid classique */}
                    {screenSize === 'desktop' && (
                        <div className="w-full mb-24" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {PROJECTS.slice(0, 4).map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        className="group"
                                        style={{ flexShrink: 0, width: '300px' }}
                                    >
                                        <div className="flex flex-col bg-white/5 rounded-xl overflow-hidden shadow-2xl h-[350px] border border-white/10 group-hover:border-[#D35400]/50 transition-colors duration-300">
                                            <div className="relative w-full h-[180px] flex-shrink-0 overflow-hidden">
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-[#D35400] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md z-10">
                                                    {project.category}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 mb-3 mt-8">
                                                    <span className="w-6 h-px bg-[#D35400]" />
                                                    <span className="text-[#D35400] text-xs font-bold uppercase tracking-widest">{project.category}</span>
                                                </div>
                                                <h2 className="text-white text-xl font-bold leading-tight group-hover:text-[#D35400] transition-colors line-clamp-2 mb-8" style={{ fontFamily: "var(--font-display)" }}>
                                                    {project.title}
                                                </h2>
                                                <p className="text-white/50 text-xl line-clamp-3 leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Affichage Mobile/Tablette - Cards empilées avec navigation */}
                    {screenSize !== 'desktop' && (
                        <div className="w-full mb-24" style={{
                            paddingLeft: screenSize === 'mobile' ? '1.5rem' : '2rem',
                            paddingRight: screenSize === 'mobile' ? '1.5rem' : '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseLeave}
                                onTouchStart={onTouchStart}
                                onTouchEnd={onTouchEnd}
                                style={{
                                    width: '100%',
                                    maxWidth: screenSize === 'mobile' ? '320px' : '400px',
                                    height: screenSize === 'mobile' ? '420px' : '480px',
                                    position: 'relative',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    userSelect: 'none',
                                }}
                            >
                                {PROJECTS.slice(0, 4).map((project, i) => {
                                    const isActive = i === active;
                                    let relPos = i - active;
                                    if (relPos > Math.floor(total / 2)) relPos -= total;
                                    if (relPos < -Math.floor(total / 2)) relPos += total;
                                    const absPos = Math.abs(relPos);

                                    if (absPos > 3) return null;

                                    const rotationMap: Record<number, number> = { 0: 0, 1: 6, 2: -4.5, 3: 9 };
                                    const translateXMap: Record<number, number> = { 0: 0, 1: 25, 2: -18, 3: 40 };
                                    const translateYMap: Record<number, number> = { 0: 0, 1: 8, 2: 14, 3: 20 };
                                    const scaleMap: Record<number, number> = { 0: 1, 1: 0.95, 2: 0.90, 3: 0.85 };
                                    const opacityMap: Record<number, number> = { 0: 1, 1: 0.85, 2: 0.65, 3: 0.45 };

                                    const rot = (rotationMap[absPos] || 0) * (relPos < 0 ? -1 : 1);
                                    const tx = (translateXMap[absPos] || 0) * (relPos < 0 ? -1 : 1);
                                    const ty = translateYMap[absPos] || 0;
                                    const sc = scaleMap[absPos] || 0.85;
                                    const op = opacityMap[absPos] || 0.45;
                                    const zIdx = 10 - absPos;

                                    return (
                                        <div
                                            key={project.id}
                                            style={{
                                                position: isActive ? 'relative' : 'absolute',
                                                inset: isActive ? undefined : 0,
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '1rem',
                                                overflow: 'hidden',
                                                transform: `rotate(${rot}deg) translate(${tx}px, ${ty}px) scale(${sc})`,
                                                transformOrigin: 'center 85%',
                                                zIndex: zIdx,
                                                opacity: op,
                                                boxShadow: isActive ? '0 32px 80px rgba(0,0,0,0.55)' : '0 16px 50px rgba(0,0,0,0.40)',
                                                pointerEvents: isActive ? 'auto' : 'none',
                                                transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, box-shadow 0.5s ease',
                                            }}
                                            className="flex flex-col bg-white/5 border border-white/10"
                                        >
                                            <div className="relative w-full flex-1 overflow-hidden">
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40" />
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-[#D35400] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md z-10">
                                                    {project.category}
                                                </div>

                                                {isActive && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); go(-1); }}
                                                            style={{
                                                                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                                                                zIndex: 20, width: '2.4rem', height: '2.4rem', borderRadius: '50%',
                                                                border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.40)',
                                                                backdropFilter: 'blur(8px)', color: '#fff', display: 'flex',
                                                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                            }}
                                                        >
                                                            <ChevronLeft size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); go(1); }}
                                                            style={{
                                                                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                                                zIndex: 20, width: '2.4rem', height: '2.4rem', borderRadius: '50%',
                                                                border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(0,0,0,0.40)',
                                                                backdropFilter: 'blur(8px)', color: '#fff', display: 'flex',
                                                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                            }}
                                                        >
                                                            <ChevronRight size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 20, display: 'flex', gap: '0.35rem' }}>
                                                            {PROJECTS.slice(0, 4).map((_, di) => (
                                                                <button
                                                                    key={di}
                                                                    onClick={(e) => { e.stopPropagation(); goTo(di); }}
                                                                    style={{
                                                                        width: di === active ? '1.2rem' : '0.35rem',
                                                                        height: '0.35rem',
                                                                        borderRadius: '4px',
                                                                        background: di === active ? '#fff' : 'rgba(255,255,255,0.35)',
                                                                        border: 'none',
                                                                        padding: 0,
                                                                        cursor: 'pointer',
                                                                        transition: 'width 0.35s ease, background 0.35s ease',
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col bg-white/5" style={{ flexShrink: 0 }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-6 h-px bg-[#D35400]" />
                                                    <span className="text-[#D35400] text-xs font-bold uppercase tracking-widest">{project.category}</span>
                                                </div>
                                                <h2 className="text-white text-lg font-bold leading-tight line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                                                    {project.title}
                                                </h2>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Spacer entre cards et bouton */}
                    <div className="h-16" />

                    {/* Bouton CTA centré */}
                    <div className="flex justify-center">
                        <Link href="/projets" className="cta-btn" style={{ textDecoration: "none" }}>
                            <span className="cta-btn__border" aria-hidden />
                            <span className="cta-btn__blur" aria-hidden />
                            <span className="cta-btn__background" aria-hidden />
                            <span className="cta-btn__inner">
                                <span className="cta-btn__icon" aria-hidden />
                                <span className="cta-btn__text">Voir tous les projets</span>
                            </span>
                        </Link>
                    </div>

                    {/* Spacer entre projets et section clients */}
                    <div className="h-20" />

                    {/* Section: Ils nous font confiance - Défilement infini */}
                    <div className="w-full pt-12 pb-6 border-t border-white/10">
                        <h3 className="text-white/60 text-center text-sm uppercase tracking-widest mb-10 px-12" style={{ fontFamily: "var(--font-display)" }}>
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
