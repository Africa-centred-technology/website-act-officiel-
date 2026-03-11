"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Room } from "@/components/home2/Shell";

interface Props {
  rooms: Room[];
  current: number;
  onGoTo: (i: number) => void;
}

export default function SpatialNav({ rooms, current, onGoTo }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 w-full spatial-nav-wrap"
      style={{ zIndex: 50, pointerEvents: "none" }}
    >
      {/* Centre — progress dots */}
      <div
        className="flex items-center gap-2"
        style={{ pointerEvents: "auto" }}
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
                width: i === current ? 28 : 5,
                background: i === current ? "#D35400" : "rgba(255,255,255,0.15)",
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{ height: 4, borderRadius: 99 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
