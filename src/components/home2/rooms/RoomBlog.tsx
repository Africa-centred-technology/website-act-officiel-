"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export default function RoomBlog() {
    return (
        <div className="h-full w-full overflow-hidden relative flex flex-col">
            {/* Hero Section */}
            <div className="w-full py-8 px-12 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-white text-6xl md:text-7xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-display)" }}>
                             <span className="text-[#D35400]">BLOG</span>
                        </h1>
                        <p className="text-white/60 text-lg md:text-xl" style={{ fontFamily: "var(--font-body)" }}>
                            Actualités, Insights & Tendances Tech
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-hidden flex items-center justify-center">
                <section className="px-12 py-6">
                    <div className="w-full max-w-6xl mx-auto">
                        

                    {/* Grid: 1 grand article à gauche + 2 petits articles à droite */}
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mb-12 items-start">
                        {/* Grand article (gauche) */}
                        {blogPosts[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="group w-full flex flex-col h-full"
                            >
                                <Link href={`/blog/${blogPosts[0].slug}`} className="block w-full">
                                    {/* Image */}
                                    <div className="relative w-full h-[300px] overflow-hidden mb-4 rounded-lg bg-white/5 mx-4">
                                        <img
                                            src={blogPosts[0].image}
                                            alt={blogPosts[0].title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Meta */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-8 h-px bg-[#D35400]" />
                                        <span className="text-[#D35400] text-xl font-bold uppercase tracking-widest">
                                            {blogPosts[0].category}
                                        </span>
                                    </div>
                                    {/* Titre */}
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-[#D35400] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                                        {blogPosts[0].title}
                                    </h3>
                                    {/* Excerpt */}
                                    <p className="text-white text-2xl leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                                        {blogPosts[0].excerpt}
                                    </p>
                                </Link>
                            </motion.div>
                        )}

                        {/* 2 petits articles (droite) */}
                        <div className="flex flex-col gap-6 w-full h-auto">
                            {blogPosts.slice(1, 3).map((post, idx) => (
                                <motion.div
                                    key={post.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                                    className="group w-full flex-shrink-0"
                                >
                                    <Link href={`/blog/${post.slug}`} className="flex flex-col gap-2">
                                        {/* Image */}
                                        <div className="w-full h-[110px] overflow-hidden rounded-lg mx-4">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        {/* Meta */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-px bg-[#D35400]" />
                                            <span className="text-[#D35400] text-xl font-bold uppercase tracking-widest">
                                                {post.category}
                                            </span>
                                        </div>
                                        {/* Titre */}
                                        <h3 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-[#D35400] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                                            {post.title}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

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
