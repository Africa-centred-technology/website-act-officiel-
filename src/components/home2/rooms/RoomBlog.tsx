"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

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

export default function RoomBlog() {
    const screenSize = useMediaQuery();
    return (
        <div className="h-full w-full overflow-hidden relative flex flex-col">
            {/* Spacer léger entre navbar et contenu */}
            <div style={{ height: screenSize === 'desktop' ? '0.5rem' : '3rem' }} />

            {/* Hero Section */}
            <div className="w-full border-b border-white/10" style={{
                paddingTop: screenSize === 'mobile' ? '2rem' : screenSize === 'tablet' ? '2rem' : '0.25rem',
                paddingBottom: screenSize === 'mobile' ? '2rem' : screenSize === 'tablet' ? '2rem' : '0.75rem',
                paddingLeft: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
                paddingRight: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
            }}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-white font-black uppercase mb-3" style={{
                            fontFamily: "var(--font-display)",
                            fontSize: screenSize === 'mobile' ? 'clamp(2rem, 8vw, 3rem)' : screenSize === 'tablet' ? 'clamp(2.5rem, 6vw, 4rem)' : '4.5rem',
                        }}>
                            <span className="text-[#D35400]">BLOG</span>
                        </h1>
                        <p className="text-white/60" style={{
                            fontFamily: "var(--font-body)",
                            fontSize: screenSize === 'mobile' ? 'clamp(0.85rem, 3vw, 1rem)' : screenSize === 'tablet' ? 'clamp(0.95rem, 2vw, 1.15rem)' : '1.25rem',
                        }}>
                            Le moyen de vous tenir informé de nos dernières actualités, conseils et tendances en matière de Technologie.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-hidden flex" style={{
                alignItems: screenSize === 'desktop' ? 'center' : 'flex-start',
                justifyContent: 'center'
            }}>
                <section style={{
                    paddingLeft: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
                    paddingRight: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
                    paddingTop: screenSize === 'mobile' ? '1.5rem' : screenSize === 'desktop' ? '0' : '1.5rem',
                    paddingBottom: screenSize === 'mobile' ? '1.5rem' : screenSize === 'desktop' ? '0' : '1.5rem',
                    width: '100%',
                    maxWidth: screenSize === 'desktop' ? '1400px' : '100%',
                    margin: screenSize === 'desktop' ? '0 auto' : '0',
                }}>
                    <div className="w-full">


                        {/* Grid: 3 colonnes égales sur Desktop, 2 sur tablette, 1 sur mobile */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: screenSize === 'desktop' ? "1fr 1fr 1fr" : screenSize === 'tablet' ? "1fr 1fr" : "1fr",
                            gap: screenSize === 'mobile' ? '1.5rem' : '2.5rem',
                            marginBottom: "2rem",
                            alignItems: "start",
                        }}>
                            {blogPosts.slice(0, 3).map((post, idx) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.12 }}
                                    className="group"
                                    style={{ width: "100%", display: "flex", flexDirection: "column" }}
                                >
                                    <Link href={`/blog/${post.slug}`} className="flex flex-col gap-3 w-full" style={{ textDecoration: "none" }}>
                                        {/* Image */}
                                        <div style={{
                                            position: "relative",
                                            width: "100%",
                                            height: screenSize === 'mobile' ? '180px' : screenSize === 'tablet' ? '200px' : '230px',
                                            overflow: "hidden",
                                            borderRadius: "0.5rem",
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                        }}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Meta */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-px bg-[#D35400]" />
                                            <span className="text-[#D35400] font-bold uppercase tracking-widest" style={{
                                                fontSize: screenSize === 'mobile' ? 'clamp(0.75rem, 2.5vw, 0.9rem)' : '1rem',
                                            }}>
                                                {post.category}
                                            </span>
                                        </div>
                                        {/* Titre */}
                                        <h3 className="text-white font-bold leading-tight group-hover:text-[#D35400] transition-colors line-clamp-2" style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: screenSize === 'mobile' ? 'clamp(1.1rem, 4vw, 1.5rem)' : screenSize === 'tablet' ? 'clamp(1.2rem, 3vw, 1.7rem)' : '1.85rem',
                                        }}>
                                            {post.title}
                                        </h3>
                                        {/* Excerpt */}
                                        <p className="text-white/65 leading-relaxed line-clamp-2" style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: screenSize === 'mobile' ? 'clamp(0.9rem, 3.5vw, 1.05rem)' : '1.1rem',
                                        }}>
                                            {post.excerpt}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Spacer entre articles et bouton */}
                        <div className="h-12" />

                        {/* Bouton CTA centré */}
                        <div className="flex justify-center">
                            <Link href="/blog" className="cta-btn" style={{ textDecoration: "none" }}>
                                <span className="cta-btn__border" aria-hidden />
                                <span className="cta-btn__blur" aria-hidden />
                                <span className="cta-btn__background" aria-hidden />
                                <span className="cta-btn__inner">
                                    <span className="cta-btn__icon" aria-hidden />
                                    <span className="cta-btn__text">Visitez notre Blog </span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
