"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export default function BlogSection() {
    return (
        <section className="pt-40 pb-20 px-10 lg:px-16 relative z-10 min-h-screen flex flex-col justify-center items-center">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-16 text-center mb-20">
                    <h2 className="text-white text-5xl md:text-7xl font-black uppercase mb-20 mt-20">
                        Articles de <span className="text-[#D35400]">Blog</span>
                    </h2>
                    <div className="w-28 h-1.5 bg-[#D35400] mx-auto" />
                </div>

                {/* Grid: 1 grand article à gauche + 2 petits articles à droite */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Grand article (gauche) */}
                    {blogPosts[0] && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="group w-full flex flex-col"
                        >
                            <Link href={`/blog/${blogPosts[0].slug}`} className="block w-full">
                                {/* Image */}
                                <div className="relative w-full h-[500px] overflow-hidden mb-10 rounded-lg bg-white/5">
                                    <img
                                        src={blogPosts[0].image}
                                        alt={blogPosts[0].title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                {/* Meta */}
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-px bg-[#D35400]" />
                                    <span className="text-[#D35400] text-lg font-bold uppercase tracking-widest">
                                        {blogPosts[0].category}
                                    </span>
                                </div>
                                {/* Titre */}
                                <h3 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-8 group-hover:text-[#D35400] transition-colors line-clamp-3">
                                    {blogPosts[0].title}
                                </h3>
                                {/* Excerpt */}
                                <p className="text-white/50 text-xl leading-relaxed line-clamp-4">
                                    {blogPosts[0].excerpt}
                                </p>
                            </Link>
                        </motion.div>
                    )}

                    {/* 2 petits articles (droite) */}
                    <div className="flex flex-col gap-10 w-full">
                        {blogPosts.slice(1, 3).map((post, idx) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                                className="group w-full"
                            >
                                <Link href={`/blog/${post.slug}`} className="flex flex-col gap-4">
                                    {/* Image */}
                                    <div className="w-full aspect-[16/10] min-h-[280px] overflow-hidden rounded-lg">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Meta */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-px bg-[#D35400]" />
                                        <span className="text-[#D35400] text-sm font-bold uppercase tracking-widest">
                                            {post.category}
                                        </span>
                                    </div>
                                    {/* Titre */}
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug group-hover:text-[#D35400] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bouton CTA centré */}
                <div className="flex justify-center mt-30">
                    <Link href="/blog" className="cta-btn" style={{ textDecoration: "none" }}>
                        <span className="cta-btn__border" aria-hidden />
                        <span className="cta-btn__blur" aria-hidden />
                        <span className="cta-btn__background" aria-hidden />
                        <span className="cta-btn__inner">
                            <span className="cta-btn__icon" aria-hidden />
                            <span className="cta-btn__text">Plus d'articles de blog</span>
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
