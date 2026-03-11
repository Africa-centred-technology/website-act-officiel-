"use client";

import React, { useRef, useEffect } from "react";

/**
 * Full-screen 3D wave grid rendered with Canvas 2D + perspective projection.
 * – Grid in XZ plane, camera rotates from near-horizontal (hero) → bird-eye (bottom).
 * – Mouse creates a "tent" deformation (elevation) at cursor position.
 * – Opacity fades as user scrolls (terrain is strongest in hero).
 */
export default function WaveTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ t: 0, mx: 0.5, my: 0.5, scrollY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 48;
    const ROWS = 34;
    const SPX = 52;   // horizontal world spacing
    const SPZ = 46;   // depth world spacing
    const FOCAL = 720;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onResize = resize;
    const onMouse = (e: MouseEvent) => {
      state.current.mx = e.clientX / window.innerWidth;
      state.current.my = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      state.current.scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const frac = Math.min(state.current.scrollY / maxScroll, 1);
      /* Fade terrain: full opacity in hero, dim below */
      canvas.style.opacity = String(Math.max(0.08, 1 - frac * 2.8));
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId = 0;

    const draw = () => {
      state.current.t += 0.007;
      const { t, mx, my, scrollY } = state.current;

      const W = canvas.width;
      const H = canvas.height;
      const cx = W * 0.5 + (mx - 0.5) * 70;
      const cy = H * 0.50 + (my - 0.5) * 40;

      /* Camera tilt: 0.32 (near-horiz) → 0.92 (bird-eye) */
      const maxSY = Math.max(document.body.scrollHeight - H, 1);
      const sf = Math.min(scrollY / maxSY, 1);
      const theta = 0.32 + sf * 0.60;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      ctx.clearRect(0, 0, W, H);

      /* Ambient deep-space glow — gives the background a midnight-blue tint */
      const amb = ctx.createRadialGradient(W * 0.5, H * 0.62, 0, W * 0.5, H * 0.62, W * 0.75);
      amb.addColorStop(0, "rgba(18,55,100,0.18)");
      amb.addColorStop(0.5, "rgba(10,28,55,0.10)");
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W, H);

      type PP = { sx: number; sy: number; depth: number; wy: number; vis: boolean };
      const grid: PP[][] = [];

      for (let j = 0; j < ROWS; j++) {
        const row: PP[] = [];
        for (let i = 0; i < COLS; i++) {
          const wx = (i - COLS / 2) * SPX;
          const wz = (j - ROWS / 2) * SPZ;

          /* Wave height: two overlapping sinusoids */
          let wy =
            Math.sin(i * 0.28 + t) * Math.cos(j * 0.22 + t * 0.68) * 30 +
            Math.sin(i * 0.14 - t * 0.85) * Math.sin(j * 0.19 + t * 0.38) * 15 +
            Math.sin(i * 0.06 + j * 0.08 + t * 0.45) * 8;

          /* Mouse tent: raise grid toward cursor */
          const worldMX = (mx - 0.5) * COLS * SPX;
          const worldMZ = (my - 0.5) * ROWS * SPZ;
          const dMX = wx - worldMX;
          const dMZ = wz - worldMZ;
          const mDist = Math.sqrt(dMX * dMX + dMZ * dMZ);
          wy += Math.max(0, 1 - mDist / 260) * 45;

          /* View transform (rotate around X axis) */
          const viewY = wy * cosT - wz * sinT;
          const viewZ = wy * sinT + wz * cosT + (ROWS * SPZ * 0.52);

          if (viewZ < 20) {
            row.push({ sx: 0, sy: 0, depth: 0, wy, vis: false });
            continue;
          }

          const scale = FOCAL / viewZ;
          row.push({
            sx: cx + wx * scale,
            sy: cy - viewY * scale,
            depth: Math.min(1, FOCAL / (viewZ + 1)),
            wy,
            vis: true,
          });
        }
        grid.push(row);
      }

      /* ── Draw lines ── */
      for (let j = 0; j < ROWS - 1; j++) {
        for (let i = 0; i < COLS - 1; i++) {
          const p = grid[j][i];
          const pr = grid[j][i + 1];
          const pd = grid[j + 1][i];

          if (!p.vis || !pr.vis || !pd.vis) continue;

          const normH = Math.max(0, (p.wy + 36) / 80);

          /* Horizontal — orange */
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pr.sx, pr.sy);
          ctx.strokeStyle = `rgba(211,84,0,${Math.min(1.0, normH * p.depth * 1.35)})`;
          ctx.lineWidth = Math.max(0.4, p.depth * 1.4);
          ctx.stroke();

          /* Vertical — amber */
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pd.sx, pd.sy);
          ctx.strokeStyle = `rgba(243,156,18,${Math.min(0.70, normH * p.depth * 0.90)})`;
          ctx.lineWidth = Math.max(0.3, p.depth * 1.0);
          ctx.stroke();
        }
      }

      /* ── Draw intersection nodes ── */
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const p = grid[j][i];
          if (!p.vis || p.depth < 0.08) continue;

          const norm = (p.wy + 36) / 80;
          const glow = norm > 0.62;
          const r = p.depth * (glow ? 5.0 : 2.2);
          const alpha = p.depth * (glow ? 1.0 : 0.45);

          if (glow) {
            ctx.shadowColor = "#FF6B00";
            ctx.shadowBlur = 18 * p.depth;
          }
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.3, r), 0, Math.PI * 2);
          ctx.fillStyle = glow
            ? `rgba(211,84,0,${alpha})`
            : `rgba(243,156,18,${alpha * 0.5})`;
          ctx.fill();
          if (glow) ctx.shadowBlur = 0;
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "#070E1C",
        transition: "opacity 0.4s",
      }}
    />
  );
}
