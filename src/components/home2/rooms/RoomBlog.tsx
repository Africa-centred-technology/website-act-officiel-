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
            <div className="h-12" />

            {/* Hero Section */}
            <div className="w-full border-b border-white/10" style={{
                paddingTop: screenSize === 'mobile' ? '2rem' : '2rem',
                paddingBottom: screenSize === 'mobile' ? '2rem' : '2rem',
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
                            Actualités, Insights & Tendances Tech
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-hidden flex items-center justify-center">
                <section style={{
                    paddingLeft: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
                    paddingRight: screenSize === 'mobile' ? '1.5rem' : screenSize === 'tablet' ? '2rem' : '3rem',
                    paddingTop: screenSize === 'mobile' ? '1.5rem' : '1.5rem',
                    paddingBottom: screenSize === 'mobile' ? '1.5rem' : '1.5rem',
                }}>
                    <div className="w-full max-w-6xl mx-auto">


                    {/* Grid: 1 grand article à gauche + 2 petits articles à droite (desktop) ou colonne unique (mobile/tablette) */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: screenSize === 'desktop' ? "2.5fr 1fr" : "1fr",
                        gap: screenSize === 'mobile' ? '1.5rem' : '2rem',
                        marginBottom: "2rem",
                        alignItems: "start",
                    }}>
                        {/* Grand article (gauche) */}
                        {blogPosts[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="group"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                }}
                            >
                                <Link href={`/blog/${blogPosts[0].slug}`} className="block w-full">
                                    {/* Image */}
                                    <div style={{
                                        position: "relative",
                                        width: "100%",
                                        height: screenSize === 'mobile' ? '200px' : screenSize === 'tablet' ? '250px' : '300px',
                                        overflow: "hidden",
                                        marginBottom: "1rem",
                                        borderRadius: "0.5rem",
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    }}>
                                        <img
                                            src={blogPosts[0].image}
                                            alt={blogPosts[0].title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Meta */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-8 h-px bg-[#D35400]" />
                                        <span className="text-[#D35400] font-bold uppercase tracking-widest" style={{
                                            fontSize: screenSize === 'mobile' ? 'clamp(0.65rem, 2.5vw, 0.85rem)' : screenSize === 'tablet' ? 'clamp(0.75rem, 2vw, 0.95rem)' : '1.25rem',
                                        }}>
                                            {blogPosts[0].category}
                                        </span>
                                    </div>
                                    {/* Titre */}
                                    <h3 className="text-white font-bold leading-tight mb-3 group-hover:text-[#D35400] transition-colors line-clamp-2" style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: screenSize === 'mobile' ? 'clamp(1rem, 4vw, 1.4rem)' : screenSize === 'tablet' ? 'clamp(1.2rem, 3vw, 1.6rem)' : '1.875rem',
                                    }}>
                                        {blogPosts[0].title}
                                    </h3>
                                    {/* Excerpt */}
                                    <p className="text-white leading-relaxed line-clamp-2" style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: screenSize === 'mobile' ? 'clamp(0.85rem, 3.5vw, 1.05rem)' : screenSize === 'tablet' ? 'clamp(0.95rem, 2.5vw, 1.2rem)' : '1.5rem',
                                    }}>
                                        {blogPosts[0].excerpt}
                                    </p>
                                </Link>
                            </motion.div>
                        )}

                        {/* 2 petits articles (droite sur desktop, dessous sur mobile/tablette) */}
                        <div style={{
                            display: screenSize === 'desktop' ? "flex" : "grid",
                            flexDirection: screenSize === 'desktop' ? "column" : undefined,
                            gridTemplateColumns: screenSize === 'tablet' ? "1fr 1fr" : screenSize === 'mobile' ? "1fr" : undefined,
                            gap: screenSize === 'mobile' ? '1.5rem' : '1.5rem',
                            width: "100%",
                            height: "auto",
                        }}>
                            {blogPosts.slice(1, 3).map((post, idx) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                                    className="group"
                                    style={{
                                        width: "100%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Link href={`/blog/${post.slug}`} className="flex flex-col gap-2">
                                        {/* Image */}
                                        <div style={{
                                            width: "100%",
                                            height: screenSize === 'mobile' ? '150px' : screenSize === 'tablet' ? '130px' : '110px',
                                            overflow: "hidden",
                                            borderRadius: "0.5rem",
                                        }}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Meta */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-px bg-[#D35400]" />
                                            <span className="text-[#D35400] font-bold uppercase tracking-widest" style={{
                                                fontSize: screenSize === 'mobile' ? 'clamp(0.6rem, 2.5vw, 0.8rem)' : screenSize === 'tablet' ? 'clamp(0.65rem, 2vw, 0.85rem)' : '1.25rem',
                                            }}>
                                                {post.category}
                                            </span>
                                        </div>
                                        {/* Titre */}
                                        <h3 className="text-white font-bold leading-tight group-hover:text-[#D35400] transition-colors line-clamp-2" style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: screenSize === 'mobile' ? 'clamp(0.9rem, 3.5vw, 1.2rem)' : screenSize === 'tablet' ? 'clamp(1rem, 2.8vw, 1.35rem)' : '1.5rem',
                                        }}>
                                            {post.title}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
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
                                    <span className="cta-btn__text">Plus d'articles</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
