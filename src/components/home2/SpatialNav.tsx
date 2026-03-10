"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Room } from "@/components/home2/Shell";

interface Props {
  rooms:   Room[];
  current: number;
  onGoTo:  (i: number) => void;
}

export default function SpatialNav({ rooms, current, onGoTo }: Props) {
  const total = rooms.length;

  return (
    <div
      className="fixed bottom-0 left-0 w-full spatial-nav-wrap"
      style={{ zIndex: 50, pointerEvents: "none" }}
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

        {/* Left — spacer */}
        <div style={{ minWidth: "clamp(10rem, 35vw, 18rem)" }} />

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
              style={{ padding: "10px 6px", background: "none", border: "none" }}
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
              background: "none",
              border:     "none",
              padding:    "12px 16px",
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
              background: "none",
              border:     "none",
              padding:    "12px 16px",
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
