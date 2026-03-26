"use client";

import React from "react";
import { motion } from "framer-motion";

interface ServiceImageCardProps {
  title: string;
  image: string;
  className?: string;
  accent?: string;
}

/**
 * ServiceImageCard — Carte avec un titre qui dépasse sur les côtés (Overflow).
 */
export default function ServiceImageCard({ title, image, className = "", accent = "#D35400" }: ServiceImageCardProps) {
  return (
    <div 
      className={`relative group ${className}`}
      style={{ 
        position: "relative",
        padding: "0 24px", // Augmentation pour réduire la carte et espacer les titres
      }}
    >
      {/* Conteneur Image avec overflow controlé */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        style={{
          aspectRatio: "1 / 1",
          background: "#0a0a0a",
          borderRadius: "1rem",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          maxWidth: "300px",
          margin: "0 auto",
        }}
        className="transition-transform duration-500"
      >
        {/* Image de fond avec effet Ken Burns au hover */}
        <motion.img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          style={{
            opacity: 0.8,
            filter: "brightness(0.9)",
          }}
        />

        {/* Overlay dégradé pour la profondeur */}
        <div 
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 66%)",
            pointerEvents: "none",
          }}
        />

        {/* Cadre de focus subtil qui apparaît au hover */}
        <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-500 pointer-events-none" />
        
        {/* Reflet lumineux furtif */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      </motion.div>

      {/* Le bloc de titre décalé (DÉPASSE SUR LES CÔTÉS) */}
      <div 
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%", // Largeur réduite
          maxWidth: "260px",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
        className="transition-transform duration-500 group-hover:-translate-y-3"
      >
        <motion.div
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: "#20232A", // Block opaque et simple
            padding: "1.5rem 1rem", // Plus haut
            borderRadius: "0.25rem 0.25rem 0 0", // Coins arrondis haut uniquement
            boxShadow: "0 -5px 20px rgba(0,0,0,0.3)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "9.5rem", // Encore plus haut
          }}
        >

          <h2 className="text-white text-center font-black tracking-normal m-0" style={{ fontFamily: "var(--font-heading), system-ui, sans-serif", lineHeight: 1.3, fontSize: "2rem", fontWeight: 900 }}>
            {title}
          </h2>

          {/* Glow subtil au hover */}
          <div 
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${accent} 0%, transparent 70%)`
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
