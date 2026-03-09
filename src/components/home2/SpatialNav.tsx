"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Room } from "@/components/home2/Shell";

interface Props {
  rooms:   Room[];
  current: number;
  onGoTo:  (i: number) => void;
}

/* Compass bearings — each room feels like a direction of travel */
const BEARINGS = ["N 32° — Vue Satellite", "NE 124° — Zone Urbaine", "E 88° — Le Marché", "SE 215° — Quartier Résidentiel", "S 270° — Salle d'Exposition", "NW 340° — Horizon"];

export default function SpatialNav({ rooms, current, onGoTo }: Props) {
  const room  = rooms[current];
  const total = rooms.length;

  return (
    <div
      className="fixed bottom-0 left-0 w-full"
      style={{ zIndex: 50, padding: "0 4rem 3.2rem", pointerEvents: "none" }}
    >
      {/* Progress bar */}
      <div
        style={{
          height:       1,
          background:   "rgba(255,255,255,0.05)",
          marginBottom: "2rem",
          position:     "relative",
        }}
      >
        <motion.div
          style={{
            position:   "absolute",
            left:       0,
            top:        0,
            height:     "100%",
            background: "#D35400",
            originX:    0,
          }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 24 }}
        />
      </div>

      {/* Row: label | dots | arrows */}
      <div className="flex items-end justify-between">

        {/* Left — animated room name + subtitle */}
        <div style={{ pointerEvents: "auto", minWidth: "18rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32 }}
            >
              <span
                className="block text-white/18 uppercase"
                style={{ fontSize: "0.78rem", letterSpacing: "0.38em", marginBottom: "0.28rem" }}
              >
                {room.number}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {BEARINGS[current] ?? ""}
              </span>
              <span
                className="block font-black text-white uppercase"
                style={{ fontSize: "1.32rem", letterSpacing: "0.14em", lineHeight: 1 }}
              >
                {room.label}
              </span>
              <span
                className="block text-white/28 uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "0.28em", marginTop: "0.3rem" }}
              >
                {room.subtitle}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Centre — progress dots */}
        <div
          className="flex items-center gap-2"
          style={{
            position:  "absolute",
            left:      "50%",
            bottom:    "3.2rem",
            transform: "translateX(-50%)",
            pointerEvents: "auto",
          }}
        >
          {rooms.map((r, i) => (
            <button
              key={r.id}
              onClick={() => onGoTo(i)}
              aria-label={r.label}
              style={{ cursor: "none", padding: "7px 4px", background: "none", border: "none" }}
            >
              <motion.div
                animate={{
                  width:      i === current ? 28 : 5,
                  background: i === current ? "#D35400" : "rgba(255,255,255,0.15)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                style={{ height: 4, borderRadius: 99 }}
              />
            </button>
          ))}
        </div>

        {/* Right — navigation arrows */}
        <div
          className="flex items-center gap-1"
          style={{ pointerEvents: "auto" }}
        >
          <button
            onClick={() => onGoTo(current - 1)}
            disabled={current === 0}
            style={{
              cursor:     "none",
              background: "none",
              border:     "none",
              padding:    "8px 14px",
              fontSize:   "1.5rem",
              fontWeight: 900,
              lineHeight: 1,
              color:      current === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)",
              transition: "color 0.2s",
            }}
          >
            ←
          </button>
          <button
            onClick={() => onGoTo(current + 1)}
            disabled={current === total - 1}
            style={{
              cursor:     "none",
              background: "none",
              border:     "none",
              padding:    "8px 14px",
              fontSize:   "1.5rem",
              fontWeight: 900,
              lineHeight: 1,
              color:      current === total - 1 ? "rgba(255,255,255,0.1)" : "#D35400",
              transition: "color 0.2s",
            }}
          >
            →
          </button>
        </div>

      </div>
    </div>
  );
}
