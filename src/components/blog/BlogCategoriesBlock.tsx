"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/blog-data";

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



type BlogCategoriesBlockProps = {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  className?: string;
};

export default function BlogCategoriesBlock({
  activeCategory = "all",
  onCategoryChange,
  className = "",
}: BlogCategoriesBlockProps) {
  const screenSize = useMediaQuery();
  // On peut filtrer la catégorie "Tous" si on veut seulement lister les rubriques spécifiques
  const rubriques = categories.filter((c) => c.value !== "all");

  return (
      <div
        className={className}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.2rem",
          padding: screenSize === 'mobile' ? '1.5rem' : '2.5rem',
          backdropFilter: "blur(10px)",
        }}
      >
      <h3
        style={{
          fontSize: screenSize === 'mobile' ? '1.3rem' : '1.6rem',
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          color: "#fff",
          marginBottom: screenSize === 'mobile' ? '1.5rem' : '2rem',
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            background: "#D35400",
            transform: "rotate(45deg)",
          }}
        />
        Toutes les rubriques
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: screenSize === 'mobile' ? '1fr' : screenSize === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: screenSize === 'mobile' ? '1rem' : '1.5rem'
      }}>
        {rubriques.map((cat, i) => {
          const isActive = activeCategory === cat.value;
          return (
            <motion.button
              key={cat.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onCategoryChange && onCategoryChange(cat.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: screenSize === 'mobile' ? '0.6rem' : screenSize === 'tablet' ? '0.9rem' : '1.2rem',
                padding: screenSize === 'mobile' ? '1.2rem 1.4rem' : screenSize === 'tablet' ? '1.6rem 1.8rem' : '2rem',
                background: isActive ? "rgba(211,84,0,0.1)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  isActive ? "rgba(211,84,0,0.4)" : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: "1.2rem",
                color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                fontFamily: "var(--font-display)",
                fontSize: screenSize === 'mobile' ? '1.1rem' : screenSize === 'tablet' ? '1.3rem' : '1.4rem',
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                minHeight: screenSize === 'mobile' ? '80px' : screenSize === 'tablet' ? '90px' : 'auto'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }
              }}
            >
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontWeight: isActive ? 700 : 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: screenSize === 'mobile' ? '1.1rem' : screenSize === 'tablet' ? '1.25rem' : 'inherit'
                }}>{cat.label}</span>
                <span
                  style={{
                    fontSize: screenSize === 'mobile' ? "1.2rem" : "1.4rem",
                    color: isActive ? "#D35400" : "rgba(255,255,255,0.2)",
                    transform: isActive ? "translateX(0)" : "translateX(-4px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  →
                </span>
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="active-line"
                  style={{ 
                    position: "absolute", 
                    bottom: 0, 
                    left: 0, 
                    height: "3px", 
                    width: "100%", 
                    background: "#D35400" 
                  }} 
                />
              )}
            </motion.button>
          );
        })}
      </div>
      </div>
  );
}
