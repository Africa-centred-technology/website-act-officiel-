"use client";

import React, { useRef, useEffect } from "react";

export default function WaveTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ t: 0, mx: 0.5, my: 0.5, scrollY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 40;   // réduit de 48 → 40 (-17% de points)
    const ROWS = 28;   // réduit de 34 → 28 (-18% de points)
    const SPX  = 56;
    const SPZ  = 50;
    const FOCAL = 720;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onResize = resize;
    const onMouse  = (e: MouseEvent) => {
      state.current.mx = e.clientX / window.innerWidth;
      state.current.my = e.clientY / window.innerHeight;
    };
    const onScroll = () => {
      state.current.scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const frac = Math.min(state.current.scrollY / maxScroll, 1);
      canvas.style.opacity = String(Math.max(0.08, 1 - frac * 2.8));
    };

    window.addEventListener("resize",    onResize, { passive: true });
    window.addEventListener("mousemove", onMouse,  { passive: true });
    window.addEventListener("scroll",    onScroll, { passive: true });

    let rafId    = 0;
    let lastTime = 0;
    const TARGET_FPS = 30;                    // cap à 30fps — invisible à l'œil
    const FRAME_MS   = 1000 / TARGET_FPS;

    type PP = { sx: number; sy: number; depth: number; wy: number; vis: boolean };

    const draw = (timestamp: number) => {
      /* ── Frame-rate cap ── */
      if (timestamp - lastTime < FRAME_MS) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      state.current.t += 0.010;
      const { t, mx, my, scrollY } = state.current;

      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W * 0.5 + (mx - 0.5) * 70;
      const cy = H * 0.50 + (my - 0.5) * 40;

      const maxSY = Math.max(document.body.scrollHeight - H, 1);
      const sf    = Math.min(scrollY / maxSY, 1);
      const theta = 0.32 + sf * 0.60;
      const cosT  = Math.cos(theta);
      const sinT  = Math.sin(theta);

      ctx.clearRect(0, 0, W, H);

      /* Ambient glow */
      const amb = ctx.createRadialGradient(W * 0.5, H * 0.62, 0, W * 0.5, H * 0.62, W * 0.75);
      amb.addColorStop(0, "rgba(18,55,100,0.18)");
      amb.addColorStop(0.5, "rgba(10,28,55,0.10)");
      amb.addColorStop(1, "transparent");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W, H);

      /* ── Build grid ── */
      const grid: PP[][] = [];

      for (let j = 0; j < ROWS; j++) {
        const row: PP[] = [];
        for (let i = 0; i < COLS; i++) {
          const wx = (i - COLS / 2) * SPX;
          const wz = (j - ROWS / 2) * SPZ;

          let wy =
            Math.sin(i * 0.28 + t) * Math.cos(j * 0.22 + t * 0.68) * 30 +
            Math.sin(i * 0.14 - t * 0.85) * Math.sin(j * 0.19 + t * 0.38) * 15 +
            Math.sin(i * 0.06 + j * 0.08 + t * 0.45) * 8;

          const worldMX = (mx - 0.5) * COLS * SPX;
          const worldMZ = (my - 0.5) * ROWS * SPZ;
          const dMX = wx - worldMX;
          const dMZ = wz - worldMZ;
          const mDist = Math.sqrt(dMX * dMX + dMZ * dMZ);
          wy += Math.max(0, 1 - mDist / 260) * 45;

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

      /* ── Draw lines — groupées par direction pour réduire les appels stroke() ── */
      // Horizontales (orange) en un seul path par ligne de grille
      for (let j = 0; j < ROWS - 1; j++) {
        ctx.beginPath();
        for (let i = 0; i < COLS - 1; i++) {
          const p  = grid[j][i];
          const pr = grid[j][i + 1];
          if (!p.vis || !pr.vis) continue;
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pr.sx, pr.sy);
        }
        const midDepth = grid[j][Math.floor(COLS / 2)].depth;
        const midNorm  = Math.max(0, (grid[j][Math.floor(COLS / 2)].wy + 36) / 80);
        ctx.strokeStyle = `rgba(211,84,0,${Math.min(1.0, midNorm * midDepth * 1.35)})`;
        ctx.lineWidth   = Math.max(0.4, midDepth * 1.4);
        ctx.stroke();
      }

      // Verticales (amber) en un seul path par colonne de grille
      for (let i = 0; i < COLS - 1; i++) {
        ctx.beginPath();
        for (let j = 0; j < ROWS - 1; j++) {
          const p  = grid[j][i];
          const pd = grid[j + 1][i];
          if (!p.vis || !pd.vis) continue;
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pd.sx, pd.sy);
        }
        const midDepth = grid[Math.floor(ROWS / 2)][i].depth;
        const midNorm  = Math.max(0, (grid[Math.floor(ROWS / 2)][i].wy + 36) / 80);
        ctx.strokeStyle = `rgba(243,156,18,${Math.min(0.70, midNorm * midDepth * 0.90)})`;
        ctx.lineWidth   = Math.max(0.3, midDepth * 1.0);
        ctx.stroke();
      }

      /* ── Nœuds — sans shadowBlur (remplacé par un halo radial) ── */
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const p = grid[j][i];
          if (!p.vis || p.depth < 0.08) continue;

          const norm  = (p.wy + 36) / 80;
          const glow  = norm > 0.62;
          const r     = p.depth * (glow ? 5.0 : 2.2);
          const alpha = p.depth * (glow ? 1.0 : 0.45);

          if (glow) {
            /* Halo cheap : un cercle plus grand et transparent, zéro shadowBlur */
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, r * 4.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(211,84,0,${alpha * 0.14})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.3, r), 0, Math.PI * 2);
          ctx.fillStyle = glow
            ? `rgba(211,84,0,${alpha})`
            : `rgba(243,156,18,${alpha * 0.5})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const startTimer = setTimeout(() => { rafId = requestAnimationFrame(draw); }, 1200);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll",    onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        background:    "var(--bg-primary)",
        transition:    "opacity 0.4s",
      }}
    />
  );
}
