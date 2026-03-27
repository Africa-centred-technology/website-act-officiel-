"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

const V = {
  orange: "#e85c1a",
  orangeLt: "rgba(232,92,26,0.15)",
};

/**
 * CustomCursor - Composant global pour le curseur personnalisé du blog
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + "px";
      cursorRef.current.style.top = e.clientY + "px";
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll(
      "button, a, .topic, .av, .cta-main, .cta-secondary, .cat-item"
    );
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);

    interactives.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [onMove]);

  return (
    <>
      {/* <style>{`body, * { cursor: none !important; }`}</style> */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: hovering ? "40px" : "10px",
          height: hovering ? "40px" : "10px",
          borderRadius: "50%",
          background: hovering ? V.orangeLt : V.orange,
          border: hovering ? `1px solid ${V.orange}` : "none",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s, width 0.25s, height 0.25s, background 0.25s",
          mixBlendMode: "screen" as const,
          display: "none", // Désactivé
        }}
      />
    </>
  );
}
