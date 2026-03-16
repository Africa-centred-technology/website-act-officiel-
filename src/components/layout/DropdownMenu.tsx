"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#D35400";

export interface DropdownMenuItem {
  href: string;
  label: string;
  key: string;
  description: string;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  isOpen: boolean;
}

export default function DropdownMenu({ items, isOpen }: DropdownMenuProps) {
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
            background: "rgba(7, 14, 28, 0.98)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(211, 84, 0, 0.2)",
            borderRadius: "0.75rem",
            padding: "2rem",
            minWidth: "420px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            zIndex: 100,
          }}
        >
          {items.map((item, index) => (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: "block",
                padding: "1rem 1.6rem",
                textDecoration: "none",
                borderRadius: "0.5rem",
                transition: "background 0.2s, transform 0.2s",
                marginBottom: index < items.length - 1 ? "0.5rem" : 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(211, 84, 0, 0.1)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: ORANGE,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
