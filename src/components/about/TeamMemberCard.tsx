"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface TeamMember {
  name: string;
  role: string;
  img: string;
  bio: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

const EASE3D = [0.6, 0.08, 0.02, 0.99] as const;

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Détection du fondateur
  const isFounder = member.role.toLowerCase().includes("fondateur & ceo") ||
                    member.role.toLowerCase().includes("ceo");

  // Animation d'entrée basée sur l'index
  const entryDelay = 0.1 + index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: entryDelay, ease: [...EASE3D] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-white/5 transition-all duration-500"
      style={{
        borderRadius: "0.75rem",
        height: "100%",
        minHeight: isFounder ? "500px" : "450px",
        border: isFounder
          ? "2px solid rgba(211,84,0,0.5)"
          : "1px solid rgba(255,255,255,0.10)",
        boxShadow: isFounder
          ? "0 0 30px rgba(211,84,0,0.2), 0 0 60px rgba(211,84,0,0.1)"
          : "none",
      }}
    >
      {/* Badge Fondateur (si c'est le CEO) */}
      {isFounder && (
        <div
          className="absolute top-4 right-4 z-30 px-4 py-2 rounded-md backdrop-blur-md"
          style={{
            background: "rgba(211,84,0,0.9)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 4px 15px rgba(211,84,0,0.4)",
          }}
        >
        
        </div>
      )}

      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={member.img}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1.0)",
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isFounder
              ? "linear-gradient(to top, rgba(7,14,28,0.98) 0%, rgba(7,14,28,0.88) 40%, rgba(211,84,0,0.15) 70%, transparent 100%)"
              : "linear-gradient(to top, rgba(7,14,28,0.98) 0%, rgba(7,14,28,0.85) 40%, rgba(7,14,28,0.4) 70%, transparent 100%)",
            opacity: isHovered ? 0.95 : 1,
          }}
        />
      </div>

      {/* Contenu textuel */}
      <div className="absolute inset-0 p-12 flex flex-col justify-end z-20 pointer-events-none">
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.4, ease: [...EASE3D] }}
          className="pointer-events-auto"
        >
          {/* Role */}
          <div className="flex items-center gap-2 mb-2">
            <span className="diamond diamond--sm" style={{ background: isFounder ? "#F39C12" : "#D35400" }} />
            <span
              className="uppercase tracking-widest"
              style={{
                fontSize: isFounder ? "0.8rem" : "0.75rem",
                fontFamily: "var(--font-display)",
                color: isFounder ? "#F39C12" : "#D35400",
                fontWeight: isFounder ? 900 : 400,
              }}
            >
              {member.role}
            </span>
          </div>

          {/* Nom */}
          <h3
            className="text-white font-black uppercase leading-tight"
            style={{
              fontSize: isFounder ? "clamp(1.5rem, 2.2vw, 2rem)" : "clamp(1.3rem, 2vw, 1.8rem)",
              fontFamily: "var(--font-display)",
              marginBottom: isHovered ? "0.5rem" : "0.8rem",
            }}
          >
            {member.name}
          </h3>

          {/* Ligne décorative */}
          <motion.div
            style={{
              height: isFounder ? 3 : 2,
              background: isFounder ? "#F39C12" : "#D35400",
              originX: 0,
              marginBottom: isHovered ? "1.5rem" : "0",
            }}
            animate={{ width: isHovered ? "100%" : isFounder ? "40%" : "30%" }}
            transition={{ duration: 0.4 }}
          />

          {/* Bio (Animée) */}
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? "auto" : 0,
            }}
            transition={{ duration: 0.4, ease: [...EASE3D] }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="text-white/80 leading-relaxed"
              style={{
                fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
              }}
            >
              {member.bio}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Effet de scan */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isFounder
            ? "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(243,156,18,0.025) 3px, rgba(243,156,18,0.025) 4px)"
            : "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(211,84,0,0.015) 3px, rgba(211,84,0,0.015) 4px)",
        }}
      />
    </motion.div>
  );
}
