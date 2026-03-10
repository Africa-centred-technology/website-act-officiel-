"use client";

/**
 * RoomBackground — immersive African landscape photo backdrop.
 *
 * Layers (bottom → top):
 *   1. Photo  — Ken Burns slow zoom + drift (unique per room), overflow-clipped
 *   2. Dark   — linear gradient overlay; depth vignette
 *   3. Warm   — orange/amber radial tint, repositioned per room
 *   4. Vignette — radial edge darkening (cinematic letterbox feel)
 *   5. Scanlines — horizontal film-grain texture (very subtle)
 *   6. Canvas — per-room atmospheric overlay: grids, glows, particles, rays
 *
 * Each variant maps to a specific African context matching the room theme:
 *   continent → Savanna & acacia — grand arrival
 *   cite      → City skyline at night — urban workshop
 *   marche    → Vibrant market colors — portfolio energy
 *   maison    → Sahara dunes — philosophical vastness
 *   musee     → Modern African architecture — ordered precision
 *   horizon   → Dramatic African sunset — CTA portal
 */

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Variant = "continent" | "cite" | "marche" | "maison" | "musee" | "horizon"
             | "about-histoire" | "about-chiffres" | "about-adn" | "about-valeurs" | "about-parcours" | "about-cta";

interface BgCfg {
  src:    string;
  /** Ken Burns: animate FROM → TO (mirror loop) */
  kbFrom: { scale: number; x: string; y: string };
  kbTo:   { scale: number; x: string; y: string };
  kbDur:  number; // seconds per half-cycle
  dark:   string; // main dark overlay (CSS gradient)
  warm:   string; // warm tint (CSS gradient)
}

const CFG: Record<Variant, BgCfg> = {
  /* ── Room 01 — LE CONTINENT — African futuristic city at sunset ── */
  continent: {
    src:    "/logo/sectionherohome.jpeg",
    kbFrom: { scale: 1.0,  x: "0%",   y: "0%"   },
    kbTo:   { scale: 1.10, x: "-3%",  y: "-2%"  },
    kbDur:  26,
    dark:   "linear-gradient(160deg, rgba(3,6,10,0.82) 0%, rgba(3,6,10,0.36) 46%, rgba(3,6,10,0.88) 100%)",
    warm:   "radial-gradient(ellipse 68% 55% at 30% 64%, rgba(211,84,0,0.20) 0%, rgba(180,60,0,0.08) 50%, transparent 100%)",
  },

  /* ── Room 02 — LA CITÉ — city lights after dark ── */
  cite: {
    src:    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.10, x: "3%",   y: "1%"   },
    kbTo:   { scale: 1.0,  x: "-3%",  y: "3%"   },
    kbDur:  20,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.90) 0%, rgba(3,6,10,0.44) 50%, rgba(3,6,10,0.92) 100%)",
    warm:   "radial-gradient(ellipse 58% 44% at 70% 56%, rgba(211,84,0,0.15) 0%, transparent 100%)",
  },

  /* ── Room 03 — LE MARCHÉ — vibrant African market / energy ── */
  marche: {
    src:    "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.13, x: "0%",   y: "-4%"  },
    kbTo:   { scale: 1.0,  x: "3%",   y: "0%"   },
    kbDur:  26,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.84) 0%, rgba(3,6,10,0.30) 42%, rgba(3,6,10,0.88) 100%)",
    warm:   "radial-gradient(ellipse 80% 62% at 48% 52%, rgba(211,84,0,0.14) 0%, transparent 100%)",
  },

  /* ── Room 04 — LA MAISON — Sahara dunes, philosophical vastness ── */
  maison: {
    src:    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.0,  x: "0%",   y: "5%"   },
    kbTo:   { scale: 1.10, x: "0%",   y: "-3%"  },
    kbDur:  28,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.84) 0%, rgba(3,6,10,0.22) 50%, rgba(3,6,10,0.90) 100%)",
    warm:   "radial-gradient(ellipse 60% 52% at 50% 34%, rgba(211,84,0,0.28) 0%, rgba(180,60,0,0.10) 55%, transparent 100%)",
  },

  /* ── Room 05 — LE MUSÉE — modern African architecture ── */
  musee: {
    src:    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.08, x: "-3%",  y: "-2%"  },
    kbTo:   { scale: 1.0,  x: "3%",   y: "2%"   },
    kbDur:  22,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.92) 0%, rgba(3,6,10,0.50) 46%, rgba(3,6,10,0.94) 100%)",
    warm:   "radial-gradient(ellipse 56% 46% at 62% 48%, rgba(211,84,0,0.13) 0%, transparent 100%)",
  },

  /* ── Room 06 — L'HORIZON — African sunset, the CTA portal ── */
  horizon: {
    src:    "https://images.unsplash.com/photo-1504197832061-98356e3dcdcf?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.0,  x: "0%",   y: "-5%"  },
    kbTo:   { scale: 1.14, x: "0%",   y: "3%"   },
    kbDur:  30,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.90) 0%, rgba(3,6,10,0.14) 46%, rgba(3,6,10,0.90) 100%)",
    warm:   "radial-gradient(ellipse 72% 50% at 50% 62%, rgba(211,84,0,0.36) 0%, rgba(180,50,0,0.16) 52%, transparent 100%)",
  },

  /* ═══════════════════════════════════════════════════════════
     ABOUT PAGE — 6 variants distincts
     ═══════════════════════════════════════════════════════════ */

  /* ── About 01 — NOTRE HISTOIRE — Casablanca (gpsmycity) ── */
  "about-histoire": {
    src:    "https://www.gpsmycity.com/img/gd_sight/56635.jpg",
    kbFrom: { scale: 1.0,  x: "0%",  y: "0%"  },
    kbTo:   { scale: 1.10, x: "-3%", y: "-3%" },
    kbDur:  28,
    dark:   "linear-gradient(160deg, rgba(3,6,10,0.88) 0%, rgba(3,6,10,0.30) 48%, rgba(3,6,10,0.92) 100%)",
    warm:   "radial-gradient(ellipse 68% 54% at 30% 62%, rgba(211,84,0,0.20) 0%, rgba(180,60,0,0.08) 52%, transparent 100%)",
  },

  /* ── About 02 — NOS CHIFFRES — immeubles de verre, tours modernes ── */
  "about-chiffres": {
    src:    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.10, x: "3%",  y: "2%"  },
    kbTo:   { scale: 1.0,  x: "-3%", y: "4%"  },
    kbDur:  22,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.92) 0%, rgba(3,6,10,0.38) 50%, rgba(3,6,10,0.95) 100%)",
    warm:   "radial-gradient(ellipse 55% 44% at 70% 52%, rgba(211,84,0,0.14) 0%, transparent 100%)",
  },

  /* ── About 03 — NOTRE ADN — équipe tech africaine, bureau collaboratif ── */
  "about-adn": {
    src:    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.0,  x: "0%",  y: "3%"  },
    kbTo:   { scale: 1.10, x: "0%",  y: "-3%" },
    kbDur:  30,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.90) 0%, rgba(3,6,10,0.28) 50%, rgba(3,6,10,0.92) 100%)",
    warm:   "radial-gradient(ellipse 62% 50% at 50% 42%, rgba(211,84,0,0.18) 0%, rgba(180,60,0,0.07) 55%, transparent 100%)",
  },

  /* ── About 04 — NOS VALEURS — skyline africaine moderne, ville tech ── */
  "about-valeurs": {
    src:    "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.12, x: "0%",  y: "-4%" },
    kbTo:   { scale: 1.0,  x: "4%",  y: "0%"  },
    kbDur:  26,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.86) 0%, rgba(3,6,10,0.26) 46%, rgba(3,6,10,0.90) 100%)",
    warm:   "radial-gradient(ellipse 78% 62% at 50% 54%, rgba(211,84,0,0.13) 0%, transparent 100%)",
  },

  /* ── About 05 — NOTRE PARCOURS — espace coworking tech, open-space ── */
  "about-parcours": {
    src:    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2400&q=80",
    kbFrom: { scale: 1.0,  x: "0%",  y: "-3%" },
    kbTo:   { scale: 1.12, x: "0%",  y: "3%"  },
    kbDur:  28,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.90) 0%, rgba(3,6,10,0.32) 48%, rgba(3,6,10,0.93) 100%)",
    warm:   "radial-gradient(ellipse 66% 48% at 50% 68%, rgba(211,84,0,0.24) 0%, rgba(180,50,0,0.10) 52%, transparent 100%)",
  },

  /* ── About 07 — CTA — Mosquée Hassan II, Casablanca ── */
  "about-cta": {
    src:    "https://shemstravel.com/assets/site/images/posts/ow6gm07qxi.jpg",
    kbFrom: { scale: 1.0,  x: "0%",  y: "-5%" },
    kbTo:   { scale: 1.14, x: "0%",  y: "4%"  },
    kbDur:  34,
    dark:   "linear-gradient(to bottom, rgba(3,6,10,0.90) 0%, rgba(3,6,10,0.14) 46%, rgba(3,6,10,0.92) 100%)",
    warm:   "radial-gradient(ellipse 74% 52% at 50% 62%, rgba(211,84,0,0.36) 0%, rgba(180,50,0,0.16) 52%, transparent 100%)",
  },
};

/* ─────────────────────────────────────────────────────── */

export default function RoomBackground({ variant }: { variant: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfg = CFG[variant];

  /* ── Canvas atmospheric overlay ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* ── continent: lat/lon grid + pulsing glow ── */
    const drawContinent = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cols = 14, rows = 10;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo((i / cols) * W, 0); ctx.lineTo((i / cols) * W, H);
        ctx.strokeStyle = i % 4 === 0 ? "rgba(211,84,0,0.10)" : "rgba(211,84,0,0.036)";
        ctx.lineWidth = 0.65; ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, (j / rows) * H); ctx.lineTo(W, (j / rows) * H);
        ctx.strokeStyle = j % 3 === 0 ? "rgba(211,84,0,0.10)" : "rgba(211,84,0,0.036)";
        ctx.lineWidth = 0.65; ctx.stroke();
      }
      /* Breath glow */
      const gA = 0.10 + Math.sin(t * 0.5) * 0.04;
      const g  = ctx.createRadialGradient(W * 0.38, H * 0.60, 0, W * 0.38, H * 0.60, W * 0.48);
      g.addColorStop(0, `rgba(211,84,0,${gA})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };

    /* ── cite: perspective floor grid + horizon flare ── */
    const drawCite = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const vy = H * 0.54;
      for (let i = 0; i <= 22; i++) {
        const x0 = -W * 0.4 + (i / 22) * W * 1.8;
        ctx.beginPath();
        ctx.moveTo(x0, H + 20); ctx.lineTo(W * 0.5, vy);
        ctx.strokeStyle = "rgba(211,84,0,0.062)";
        ctx.lineWidth = 0.7; ctx.stroke();
      }
      /* Horizon neon pulse */
      const hA = 0.24 + Math.sin(t * 0.45) * 0.07;
      const hg = ctx.createLinearGradient(0, vy - 55, 0, vy + 80);
      hg.addColorStop(0,    "transparent");
      hg.addColorStop(0.48, `rgba(211,84,0,${hA})`);
      hg.addColorStop(1,    "transparent");
      ctx.fillStyle = hg;
      ctx.fillRect(0, vy - 55, W, 135);
    };

    /* ── marche: diagonal kente stripes + warm bloom ── */
    const drawMarche = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const sw = 44;
      const n  = Math.ceil((W + H) / sw);
      for (let i = 0; i < n; i++) {
        if (i % 7 !== 0 && i % 7 !== 3) continue;
        const x0 = i * sw - H;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, 0); ctx.lineTo(x0 + sw, 0);
        ctx.lineTo(x0 + sw + H, H); ctx.lineTo(x0 + H, H);
        ctx.closePath();
        ctx.fillStyle = i % 7 === 0 ? "rgba(211,84,0,0.07)" : "rgba(243,156,18,0.044)";
        ctx.fill(); ctx.restore();
      }
      /* Warm bloom */
      const bA = 0.08 + Math.sin(t * 0.38) * 0.03;
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.54, 0, W * 0.5, H * 0.54, W * 0.55);
      bg.addColorStop(0, `rgba(211,84,0,${bA})`);
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    };

    /* ── maison: mashrabiya lattice + sand glow ── */
    const drawMaison = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cell = 38;
      ctx.strokeStyle = "rgba(211,84,0,0.055)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < H + cell; y += cell) {
        for (let x = 0; x < W + cell; x += cell) {
          const d = cell * 0.30;
          ctx.beginPath();
          ctx.moveTo(x, y - d); ctx.lineTo(x + d, y);
          ctx.lineTo(x, y + d); ctx.lineTo(x - d, y);
          ctx.closePath(); ctx.stroke();
        }
      }
      /* Sand dune glow */
      const gA = 0.12 + Math.sin(t * 0.32) * 0.05;
      const g  = ctx.createRadialGradient(W * 0.50, H * 0.40, 0, W * 0.50, H * 0.40, W * 0.50);
      g.addColorStop(0, `rgba(211,84,0,${gA})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };

    /* ── musee: vanishing floor grid + pillars ── */
    const drawMusee = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const vy = H * 0.46;
      for (let i = 0; i <= 16; i++) {
        const x0 = (i / 16) * W;
        ctx.beginPath();
        ctx.moveTo(x0, H); ctx.lineTo(W * 0.5, vy);
        ctx.strokeStyle = i % 4 === 0 ? "rgba(211,84,0,0.085)" : "rgba(211,84,0,0.034)";
        ctx.lineWidth = 0.6; ctx.stroke();
      }
      /* Museum horizontal bands */
      for (const yF of [0.38, 0.47, 0.56, 0.65, 0.74]) {
        ctx.fillStyle = "rgba(255,255,255,0.024)";
        ctx.fillRect(0, yF * H, W, 1);
      }
      /* Glow from vanishing point */
      const gA = 0.09 + Math.sin(t * 0.42) * 0.04;
      const g  = ctx.createRadialGradient(W * 0.5, vy, 0, W * 0.5, vy, W * 0.6);
      g.addColorStop(0, `rgba(211,84,0,${gA})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };

    /* ── horizon: stars + pulsing horizon + golden light rays ── */
    const drawHorizon = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Stars — upper half */
      for (let i = 0; i < 90; i++) {
        const sx    = ((i * 137 + 29) % 100) / 100 * W;
        const sy    = ((i * 73  + 11) % 52) / 100 * H;
        const sz    = 0.35 + ((i * 31) % 10) / 10 * 0.75;
        const flick = Math.sin(t * 1.1 + i * 0.9) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.48 * flick})`;
        ctx.fill();
      }

      /* Horizon band — pulsing amber glow */
      const hY  = H * 0.66;
      const hA  = 0.32 + Math.sin(t * 0.32) * 0.10;
      const hg  = ctx.createLinearGradient(0, hY - 95, 0, hY + 95);
      hg.addColorStop(0,    "transparent");
      hg.addColorStop(0.45, `rgba(211,84,0,${hA})`);
      hg.addColorStop(0.65, `rgba(180,50,0,${hA * 0.55})`);
      hg.addColorStop(1,    "transparent");
      ctx.fillStyle = hg;
      ctx.fillRect(0, hY - 95, W, 190);

      /* Golden light rays from sun point */
      const sunX = W * 0.5, sunY = hY;
      const rayCount = 9;
      for (let r = 0; r < rayCount; r++) {
        /* Fan spread around straight-up (-π/2) */
        const angle = -Math.PI / 2 + (r - (rayCount - 1) / 2) * (Math.PI / 10);
        const len   = W * 1.35;
        const rA    = (0.038 + Math.sin(t * 0.28 + r * 1.4) * 0.022);
        const grad  = ctx.createLinearGradient(sunX, sunY,
          sunX + Math.cos(angle) * len,
          sunY + Math.sin(angle) * len);
        grad.addColorStop(0,   `rgba(211,84,0,${rA * 3.5})`);
        grad.addColorStop(0.6, `rgba(211,84,0,${rA})`);
        grad.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5 + r * 0.15;
        ctx.stroke();
      }

      /* Sun disc */
      const sA = 0.38 + Math.sin(t * 0.28) * 0.10;
      const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.24);
      sg.addColorStop(0,   `rgba(255,120,30,${sA})`);
      sg.addColorStop(0.3, `rgba(211,84,0,${sA * 0.55})`);
      sg.addColorStop(1,   "transparent");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
    };

    /* ── about-histoire: lat/lon grid (same energy as continent) ── */
    const drawAboutHistoire = drawContinent;

    /* ── about-chiffres: dense perspective grid (data-center feel) ── */
    const drawAboutChiffres = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const vy = H * 0.5;
      for (let i = 0; i <= 28; i++) {
        const x0 = -W * 0.3 + (i / 28) * W * 1.6;
        ctx.beginPath(); ctx.moveTo(x0, H + 20); ctx.lineTo(W * 0.5, vy);
        ctx.strokeStyle = i % 5 === 0 ? "rgba(211,84,0,0.09)" : "rgba(211,84,0,0.03)";
        ctx.lineWidth = 0.6; ctx.stroke();
      }
      for (let j = 0; j <= 10; j++) {
        const y0 = vy + (j / 10) * (H - vy);
        ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0);
        ctx.strokeStyle = "rgba(211,84,0,0.04)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      const hA = 0.18 + Math.sin(t * 0.5) * 0.06;
      const hg = ctx.createLinearGradient(0, vy - 40, 0, vy + 60);
      hg.addColorStop(0, "transparent"); hg.addColorStop(0.5, `rgba(211,84,0,${hA})`); hg.addColorStop(1, "transparent");
      ctx.fillStyle = hg; ctx.fillRect(0, vy - 40, W, 100);
    };

    /* ── about-adn: star field + central radial burst ── */
    const drawAboutAdn = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 120; i++) {
        const sx = ((i * 137 + 29) % 100) / 100 * W;
        const sy = ((i * 73  + 11) % 80)  / 100 * H;
        const sz = 0.3 + ((i * 31) % 10) / 10 * 0.8;
        const fl = Math.sin(t * 0.9 + i * 0.7) * 0.3 + 0.7;
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 * fl})`; ctx.fill();
      }
      const gA = 0.10 + Math.sin(t * 0.35) * 0.04;
      const g  = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.45);
      g.addColorStop(0, `rgba(211,84,0,${gA})`); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };

    /* ── about-valeurs: diagonal kente (same as marche) ── */
    const drawAboutValeurs = drawMarche;

    /* ── about-parcours: vanishing road grid ── */
    const drawAboutParcours = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const vy = H * 0.42;
      for (let i = 0; i <= 20; i++) {
        const x0 = (i / 20) * W;
        ctx.beginPath(); ctx.moveTo(x0, H); ctx.lineTo(W * 0.5, vy);
        ctx.strokeStyle = i % 4 === 0 ? "rgba(211,84,0,0.10)" : "rgba(211,84,0,0.032)";
        ctx.lineWidth = 0.7; ctx.stroke();
      }
      const rA = 0.28 + Math.sin(t * 0.3) * 0.10;
      const rg = ctx.createLinearGradient(0, vy - 80, 0, vy + 80);
      rg.addColorStop(0, "transparent"); rg.addColorStop(0.48, `rgba(211,84,0,${rA})`); rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg; ctx.fillRect(0, vy - 80, W, 160);
    };

    /* ── about-cta: ocean horizon with rays (same as horizon) ── */
    const drawAboutCta = drawHorizon;

    const DRAWS: Record<Variant, () => void> = {
      continent:        drawContinent,
      cite:             drawCite,
      marche:           drawMarche,
      maison:           drawMaison,
      musee:            drawMusee,
      horizon:          drawHorizon,
      "about-histoire": drawAboutHistoire,
      "about-chiffres": drawAboutChiffres,
      "about-adn":      drawAboutAdn,
      "about-valeurs":  drawAboutValeurs,
      "about-parcours": drawAboutParcours,
      "about-cta":      drawAboutCta,
    };

    const loop = () => {
      t += 0.016;
      if (!document.hidden) DRAWS[variant]();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── 1. Photo — Ken Burns zoom + drift ── */}
      <motion.div
        className="absolute"
        style={{ inset: "-9%", willChange: "transform" }}
        animate={{
          scale: [cfg.kbFrom.scale, cfg.kbTo.scale],
          x:     [cfg.kbFrom.x,     cfg.kbTo.x    ],
          y:     [cfg.kbFrom.y,     cfg.kbTo.y    ],
        }}
        transition={{
          duration:   cfg.kbDur,
          ease:       "easeInOut",
          repeat:     Infinity,
          repeatType: "mirror",
        }}
      >
        {/* Blur-clear entry reveal on room mount */}
        <motion.img
          src={cfg.src}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", display: "block" }}
          initial={{ opacity: 0, filter: "blur(12px) brightness(0.5)" }}
          animate={{ opacity: 1, filter: "blur(0px)  brightness(1.0)" }}
          transition={{ duration: 2.2, ease: [0.4, 0.0, 0.2, 1] }}
        />
      </motion.div>

      {/* ── 2. Dark gradient — depth vignette ── */}
      <div className="absolute inset-0" style={{ background: cfg.dark }} />

      {/* ── 3. Warm orange tint — room accent ── */}
      <div className="absolute inset-0" style={{ background: cfg.warm }} />

      {/* ── 4. Edge vignette — cinematic letterbox feel ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 105% 105% at 50% 50%, transparent 35%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* ── 5. CSS scanlines — film grain texture ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)",
        }}
      />

      {/* ── 6. Canvas — atmospheric glows, grids, rays ── */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0"
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      />
    </div>
  );
}
