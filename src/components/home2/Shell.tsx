"use client";

import React, { useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import SpatialNav from "@/components/home2/SpatialNav";
import RoomEntree from "@/components/home2/rooms/RoomEntree";
import RoomAtelier from "@/components/home2/rooms/RoomAtelier";
import RoomManifeste from "@/components/home2/rooms/RoomManifeste";
import RoomSortie from "@/components/home2/rooms/RoomSortie";
import RoomQuiSommesNous from "@/components/home2/rooms/RoomQuiSommesNous";
import RoomPortail from "@/components/home2/rooms/RoomPortail";
import RoomBlog from "@/components/home2/rooms/RoomBlog";

/* Canvas / window-dependent — client only */
const WaveTerrain = dynamic(() => import("@/components/home2/WaveTerrain"), { ssr: false });
const Cursor = dynamic(() => import("@/components/home2/Cursor"), { ssr: false });
const Grain = dynamic(() => import("@/components/home2/Grain"), { ssr: false });

export interface Room {
  id: string;
  label: string;
  subtitle: string;   // location flavour text shown in SpatialNav
  number: string;
  Component: React.ComponentType;
}

export const ROOMS: Room[] = [
  { id: "continent", label: "LE CONTINENT", subtitle: "Afrique", number: "01", Component: RoomEntree },
  { id: "qui-sommes-nous", label: "QUI SOMMES-NOUS", subtitle: "L'Identité ACT", number: "02", Component: RoomQuiSommesNous },
  { id: "cite", label: "LA CITÉ", subtitle: "Casablanca · Lagos · Nairobi", number: "03", Component: RoomAtelier },
  { id: "maison", label: "LA MAISON", subtitle: "Architecture & Patrimoine Africain", number: "04", Component: RoomManifeste },
  { id: "portail", label: "LE PORTAIL", subtitle: "Espace Client Sécurisé", number: "05", Component: RoomPortail },
  { id: "blog", label: "LE BLOG", subtitle: "Actualités & Insights Tech", number: "06", Component: RoomBlog },
  { id: "horizon", label: "L'HORIZON", subtitle: "L'Afrique de Demain", number: "07", Component: RoomSortie },
];

const THROTTLE = 1300;

/**
 * ── Depth-of-field journey transitions ──────────────────────────────────
 *
 * Rooms are DESTINATIONS approached through 3D space, not sliding panels.
 *
 * ENTER  — Room bursts from deep Z (scale 0.13 = far in the horizon, heavy
 *   blur = out-of-focus, dim = distance haze). Rushes toward the viewer with
 *   an explosive-start / graceful-landing ease — like a landscape approaching
 *   at speed, then slowing to reveal itself at full resolution.
 *   rotateX +5° = slightly below eye level (floor of the destination visible).
 *   rotateY ±10° = slight turn in the direction of travel.
 *
 * CENTER — Full presence, flat to viewer, zero deformation.
 *
 * EXIT   — Room collapses into the distance (scale 0.08, intense blur,
 *   counter-rotateX) — like a location disappearing behind you as you
 *   dive through a portal.
 *
 * The WaveTerrain canvas (z-index 0, fixed) acts as the "world floor"
 * visible through the shrinking rooms during transition.
 */
const variants = {
  enter: (dir: number) => ({
    y: `${dir > 0 ? 100 : -100}%`,
    opacity: 0,
    filter: "blur(6px) brightness(0.7)",
    zIndex: 2,
  }),
  center: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px) brightness(1.0)",
    zIndex: 2,
    transition: { duration: 0.85, ease: [0.04, 0.72, 0.08, 1.0] },
  },
  exit: (dir: number) => ({
    y: `${dir > 0 ? -100 : 100}%`,
    opacity: 0,
    filter: "blur(6px) brightness(0.7)",
    zIndex: 1,
    transition: { duration: 0.60, ease: [0.60, 0.0, 1.0, 0.42] },
  }),
};

/* ── TransitionFlash — warm radial burst at each navigation ───────────── */
const TransitionFlash = React.memo(function TransitionFlash() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.28, 0] }}
      transition={{ duration: 0.90, times: [0, 0.13, 1], ease: "easeOut" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 58% 52% at 50% 50%, rgba(211,84,0,0.40) 0%, rgba(255,80,0,0.16) 44%, transparent 72%)",
        }}
      />
    </motion.div>
  );
});

/* ── VignettePulse — cinematic tunnel-squeeze at each navigation ─────── */
const VignettePulse = React.memo(function VignettePulse() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 6 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.35, 0] }}
      transition={{ duration: 1.30, times: [0, 0.09, 0.52, 1], ease: "easeOut" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 90% 88% at 50% 50%, transparent 18%, rgba(0,0,0,0.82) 100%)",
        }}
      />
    </motion.div>
  );
});

export default function Home2Shell() {
  const [current, setCurrent] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const currentRef = useRef(0);
  const navigating = useRef(false);
  const touchStartY = useRef(0);

  /* Lock body scroll — each room fills 100vh */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Core navigation — ref-tracked to avoid stale closures in listeners */
  const goTo = useCallback((idx: number) => {
    if (navigating.current) return;
    const clamped = Math.max(0, Math.min(ROOMS.length - 1, idx));
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

  /* ── Wheel (supports both vertical scroll and horizontal trackpad swipe) ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Prefer horizontal delta (trackpad swipe) when it dominates; fall back to vertical
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 15) return;
      step(delta > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [step]);

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(e.key)) step(1);
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* ── Touch swipe ── */
  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 55) step(dy > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [step]);

  const { Component } = ROOMS[current];

  return (
    <div
      style={{
        background: "#070E1C",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fixed background layers */}
      <WaveTerrain />
      <Cursor />
      <Grain />

      {/* Transition effects — remount on each navigation (key triggers remount) */}
      <TransitionFlash key={`flash-${current}`} />
      <VignettePulse key={`vgnt-${current}`} />

      {/* Spatial navigation — fixed bottom */}
      <SpatialNav rooms={ROOMS} current={current} onGoTo={goTo} />

      {/* Perspective container — 950px FOV for strong depth-of-field journey */}
      <div
        style={{
          position: "absolute",
          top: "clamp(3.5rem, 5vw, 5rem)",   /* clear the fixed navbar */
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="sync" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
            }}
          >
            <Component />
          </motion.div>
        </AnimatePresence>

        {/* Global Persistent Logo (starting from index 1) */}
        {current !== 0 && (
          <motion.div
            layoutId="logo-continent"
            className="fixed bottom-3 right-3 z-[100] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.80, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.2, ease: [0.04, 0.72, 0.08, 1.0] }}
          >
            <img
              src="/logo/logo_continent.png"
              alt=""
              className="w-[clamp(6rem,15vw,20rem)] h-auto filter brightness-90 contrast-110"
            />
          </motion.div>
        )}
      </div>

    </div>
  );
}
