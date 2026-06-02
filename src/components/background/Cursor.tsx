"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [clicked,  setClicked]  = useState(false);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);

  /* Dot — très rapide */
  const dx = useSpring(mx, { stiffness: 1600, damping: 45 });
  const dy = useSpring(my, { stiffness: 1600, damping: 45 });

  /* Glow — lag magnétique */
  const px = useSpring(mx, { stiffness: 110, damping: 24 });
  const py = useSpring(my, { stiffness: 110, damping: 24 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true); // React ignore les setState sans changement de valeur
    };

    /* Throttle via RAF — mouseover peut déclencher des centaines d'events/s */
    let overRaf = 0;
    const onOver = (e: MouseEvent) => {
      if (overRaf) return;
      overRaf = requestAnimationFrame(() => {
        overRaf = 0;
        const el  = e.target as HTMLElement;
        const hit = el.closest("a, button, [data-hover], input, select, textarea, .cta-btn");
        setHovered(!!hit);
      });
    };

    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);

    window.addEventListener("mousemove", onMove,  { passive: true });
    window.addEventListener("mouseover", onOver,  { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.body.classList.add("cursor-none");

    return () => {
      if (overRaf) cancelAnimationFrame(overRaf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.body.classList.remove("cursor-none");
    };
  }, [mx, my]); // `visible` retiré — ne doit pas déclencher un re-enregistrement des listeners

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Dot — mix-blend-mode difference */}
      <motion.div
        aria-hidden
        style={{
          position:      "fixed",
          zIndex:        999999,
          pointerEvents: "none",
          x:             dx,
          y:             dy,
          translateX:    "-50%",
          translateY:    "-50%",
          width:         6,
          height:        6,
          borderRadius:  "50%",
          background:    "#fff",
          mixBlendMode:  "difference",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale:   clicked ? 0.3 : hovered ? 1.6 : 1,
        }}
        transition={{ duration: 0.18 }}
      />

      {/* Glow halo */}
      <motion.div
        aria-hidden
        style={{
          position:      "fixed",
          zIndex:        999998,
          pointerEvents: "none",
          x:             px,
          y:             py,
          translateX:    "-50%",
          translateY:    "-50%",
          width:         hovered ? 120 : 80,
          height:        hovered ? 120 : 80,
          borderRadius:  "50%",
          background:    hovered
            ? "radial-gradient(circle, rgba(211,84,0,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          transition:    "width 0.5s ease, height 0.5s ease, background 0.4s ease",
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </>,
    document.body
  );
}
