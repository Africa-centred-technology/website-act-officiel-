"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ORANGE = "#D35400";

export interface DropdownSubItem {
  href: string;
  label: string;
  key: string;
}

export interface DropdownMenuItem {
  href: string;
  label: string;
  key: string;
  description: string;
  subItems?: DropdownSubItem[];
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  isOpen: boolean;
}

export default function DropdownMenu({ items, isOpen }: DropdownMenuProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            top: "calc(100% + 1rem)",
            left: "50%",
            translateX: "-50%",
            background: "rgba(10,20,16, 0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(211, 84, 0, 0.2)",
            borderRadius: "0.75rem",
            padding: "2rem",
            minWidth: "420px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            zIndex: 100,
          }}
        >
          {items.map((item, index) => {
            const hasSubItems = !!item.subItems?.length;
            const isHovered = hoveredKey === item.key;

            return (
              <div
                key={item.key}
                style={{ marginBottom: index < items.length - 1 ? "0.5rem" : 0, position: "relative" }}
                onMouseEnter={() => hasSubItems && setHoveredKey(item.key)}
                onMouseLeave={() => hasSubItems && setHoveredKey(null)}
              >
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "1rem 1.6rem",
                    textDecoration: "none",
                    borderRadius: "0.5rem",
                    transition: "background 0.2s, transform 0.2s",
                    background: isHovered ? "rgba(211, 84, 0, 0.1)" : "transparent",
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasSubItems) {
                      e.currentTarget.style.background = "rgba(211, 84, 0, 0.1)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!hasSubItems) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "1.3rem", fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
                      {item.label}
                    </span>
                  </div>
                  {hasSubItems && (
                    <motion.div
                      animate={{ rotate: isHovered ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} color={isHovered ? ORANGE : "rgba(255,255,255,0.3)"} style={{ transition: "color 0.2s" }} />
                    </motion.div>
                  )}
                </Link>

                {/* Sub-dropdown — appears below the parent item on hover */}
                <AnimatePresence>
                  {hasSubItems && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: "1.6rem",
                        background: "rgba(10,20,16, 0.98)",
                        border: "1px solid rgba(211,84,0,0.25)",
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        minWidth: "320px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        zIndex: 10,
                      }}
                    >
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.key}
                          href={sub.href}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.7rem",
                            padding: "1rem 1.4rem",
                            textDecoration: "none",
                            borderRadius: "0.4rem",
                            color: "rgba(255,255,255,0.7)",
                            fontFamily: "var(--font-body)",
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            transition: "background 0.2s, color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(211,84,0,0.1)";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                          }}
                        >
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
