"use client";

/**
 * ServiceRoomShell — Navigation depth-of-field entre les 8 services ACT.
 *
 * Reprend exactement la mécanique de Home2Shell :
 *   - AnimatePresence mode="sync" + variants 3D (scale 0.13, blur 42px, rotateX/Y)
 *   - TransitionFlash (burst radial accent) + VignettePulse (tunnel squeeze)
 *   - WaveTerrain + Grain + Cursor partagés
 *   - Navigation : wheel (vertical + trackpad horizontal), keyboard, touch
 *   - Throttle 1300 ms entre transitions
 *
 * Chaque service = une <ServiceRoom /> montée comme destination dans l'espace.
 */

import React, { useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import ServiceRoom          from "@/components/services/ServiceRoom";
import ServicesSpatialNav   from "@/components/services/ServicesSpatialNav";
import { SERVICES }         from "@/lib/data/services";

/* Canvas / window-dependent — ssr: false obligatoire */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Cursor      = dynamic(() => import("@/components/home2/Cursor"),      { ssr: false });
const Grain       = dynamic(() => import("@/components/home2/Grain"),       { ssr: false });

/* ══════════════════════════════════════════════════════
   TRANSITION VARIANTS — depth-of-field journey
   ══════════════════════════════════════════════════════ */
const variants = {
  enter: (dir: number) => ({
    x:       `${dir > 0 ? 5 : -5}%`,
    y:       "3%",
    scale:   0.13,
    rotateY: dir > 0 ? 10 : -10,
    rotateX: 5,
    opacity: 0,
    filter:  "blur(42px) brightness(0.07) saturate(0.14)",
    zIndex:  2,
  }),
  center: {
    x:       "0%",
    y:       "0%",
    scale:   1,
    rotateY: 0,
    rotateX: 0,
    opacity: 1,
    filter:  "blur(0px) brightness(1.0) saturate(1.0)",
    zIndex:  2,
    transition: { duration: 1.38, ease: [0.04, 0.72, 0.08, 1.0] },
  },
  exit: (dir: number) => ({
    x:       `${dir > 0 ? -4 : 4}%`,
    y:       "-2%",
    scale:   0.08,
    rotateY: dir > 0 ? -10 : 10,
    rotateX: -4,
    opacity: 0,
    filter:  "blur(36px) brightness(0.05) saturate(0.12)",
    zIndex:  1,
    transition: { duration: 0.65, ease: [0.60, 0.0, 1.0, 0.42] },
  }),
};

/* ── TransitionFlash — burst radial en couleur accent ── */
function TransitionFlash({ accent }: { accent: string }) {
  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}
      initial={{ opacity: 0 }} animate={{ opacity: [0, 0.28, 0] }}
      transition={{ duration: 0.90, times: [0, 0.13, 1], ease: "easeOut" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 58% 52% at 50% 50%, ${accent}66 0%, ${accent}28 44%, transparent 72%)`,
      }} />
    </motion.div>
  );
}

/* ── VignettePulse — tunnel squeeze cinématique ── */
function VignettePulse() {
  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}
      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.35, 0] }}
      transition={{ duration: 1.30, times: [0, 0.09, 0.52, 1], ease: "easeOut" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 90% 88% at 50% 50%, transparent 18%, rgba(0,0,0,0.85) 100%)",
      }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   SHELL PRINCIPAL
   ══════════════════════════════════════════════════════ */
const THROTTLE = 1300;

export default function ServiceRoomShell() {
  const [current, setCurrent] = React.useState(0);
  const [dir, setDir]         = React.useState(1);
  const currentRef  = useRef(0);
  const navigating  = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  /* Bloquer le scroll natif — chaque room remplit 100vh */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const goTo = useCallback((idx: number) => {
    if (navigating.current) return;
    const clamped = Math.max(0, Math.min(SERVICES.length - 1, idx));
    if (clamped === currentRef.current) return;

    const d = clamped > currentRef.current ? 1 : -1;
    setDir(d);
    currentRef.current = clamped;
    setCurrent(clamped);
    navigating.current = true;
    setTimeout(() => { navigating.current = false; }, THROTTLE);
  }, []);

  const step = useCallback((delta: number) => {
    goTo(currentRef.current + delta);
  }, [goTo]);

  /* Wheel (vertical + trackpad horizontal) */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 15) return;
      step(delta > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);

  /* Keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(e.key)) step(1);
      if (["ArrowUp",   "ArrowLeft" ].includes(e.key)) step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* Touch swipe (vertical + horizontal) */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(dominant) > 50) step(dominant > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [step]);

  const svc = SERVICES[current];

  return (
    <div style={{
      background: "#070E1C",
      width:      "100vw",
      height:     "100vh",
      overflow:   "hidden",
      position:   "relative",
    }}>
      {/* ── Couches fixes partagées ── */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* ── Effets de transition (remontés à chaque nav) ── */}
      <TransitionFlash key={`flash-${current}`} accent={svc.accent} />
      <VignettePulse   key={`vgnt-${current}`} />

      {/* ── Container perspective FOV 950px ── */}
      <div style={{
        position: "absolute", inset: 0,
        perspective: "950px",
        perspectiveOrigin: "50% 46%",
      }}>
        <AnimatePresence mode="sync" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ position: "absolute", inset: 0, overflow: "hidden" }}
          >
            <ServiceRoom svc={svc} index={current} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Spatial nav fixe en bas ── */}
      <ServicesSpatialNav services={SERVICES} current={current} onGoTo={goTo} />
    </div>
  );
}
