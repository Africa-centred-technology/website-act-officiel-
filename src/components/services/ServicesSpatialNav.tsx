"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Service } from "@/lib/data/services";

interface Props {
  services: Service[];
  current: number;
  onGoTo: (i: number) => void;
}

export default function ServicesSpatialNav({ services, current, onGoTo }: Props) {
  const svc = services[current];
  const total = services.length;

  return (
    <div
      className="fixed bottom-0 left-0 w-full spatial-nav-wrap"
      style={{ zIndex: 50, pointerEvents: "none" }}
    >
      {/* Progress bar */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: "2rem", position: "relative" }}>
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, height: "100%", originX: 0 }}
          animate={{
            width: `${((current + 1) / total) * 100}%`,
            background: svc.accent,
          }}
          transition={{ type: "spring", stiffness: 140, damping: 24 }}
        />
      </div>

      {/* Row: label | dots | arrows */}
      <div className="flex items-end justify-between">



        {/* Centre — dots */}
        <div style={{
          position: "absolute", left: "50%", bottom: "3.2rem",
          transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "0.5rem",
          pointerEvents: "auto",
        }}>
          {/* Pôle I dots */}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {services.slice(0, 5).map((s, i) => (
              <button key={s.slug} onClick={() => onGoTo(i)}
                aria-label={s.title.replace(/\n/g, " ")}
                style={{ padding: "10px 6px", background: "none", border: "none" }}>
                <motion.div
                  animate={{
                    width: i === current ? 24 : 5,
                    background: i === current ? "#D35400" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  style={{ height: 4, borderRadius: 99 }}
                />
              </button>
            ))}
          </div>
          {/* Séparateur entre pôles */}
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.08)", margin: "0 0.4rem" }} />
          {/* Pôle II dots */}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {services.slice(5).map((s, i) => {
              const idx = i + 5;
              return (
                <button key={s.slug} onClick={() => onGoTo(idx)}
                  aria-label={s.title.replace(/\n/g, " ")}
                  style={{ padding: "10px 6px", background: "none", border: "none" }}>
                  <motion.div
                    animate={{
                      width: idx === current ? 24 : 5,
                      background: idx === current ? "#F39C12" : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    style={{ height: 4, borderRadius: 99 }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — flèches */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", pointerEvents: "auto" }}>
          <button onClick={() => onGoTo(current - 1)} disabled={current === 0}
            style={{
              background: "none", border: "none", padding: "12px 16px",
              fontSize: "1.5rem", fontWeight: 900, lineHeight: 1,
              color: current === 0 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.40)",
              transition: "color 0.2s",
            }}>←</button>
          <button onClick={() => onGoTo(current + 1)} disabled={current === total - 1}
            style={{
              background: "none", border: "none", padding: "12px 16px",
              fontSize: "1.5rem", fontWeight: 900, lineHeight: 1,
              color: current === total - 1 ? "rgba(255,255,255,0.10)" : svc.accent,
              transition: "color 0.2s",
            }}>→</button>
        </div>
      </div>
    </div>
  );
}
