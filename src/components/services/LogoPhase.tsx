"use client";

/**
 * LogoPhase — animation de particules ACT
 * Extrait de ServicesIntroShell pour pouvoir être importé
 * indépendamment (évite les conflits de module avec dynamic()).
 */

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ORANGE = "#D35400";

/* ── Particle types ──────────────────────────────────────── */
interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  dvx: number; dvy: number;
  size: number;
  r: number; g: number; b: number;
  alpha: number;
}

/* ── Sample glyph pixels ─────────────────────────────────── */
function sampleOffscreenText(w: number, h: number, n: number): [number, number][] {
  const oc = document.createElement("canvas");
  oc.width = w;
  oc.height = h;
  const ctx = oc.getContext("2d")!;
  const fs = Math.min(w * 0.30, h * 0.52);
  ctx.font = `900 ${fs}px Futura, system-ui, sans-serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ACT", w / 2, h / 2);

  const data = ctx.getImageData(0, 0, w, h).data;
  const bright: [number, number][] = [];
  for (let y = 0; y < h; y += 3)
    for (let x = 0; x < w; x += 3)
      if (data[(y * w + x) * 4 + 3] > 140) bright.push([x, y]);

  for (let i = bright.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [bright[i], bright[j]] = [bright[j], bright[i]];
  }
  return bright.slice(0, n);
}

/* ── Canvas hook ─────────────────────────────────────────── */
function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onDone: () => void
) {
  const rafRef          = useRef<number>(0);
  const phaseRef        = useRef<"stream" | "glow" | "disperse">("stream");
  const startRef        = useRef<number>(0);
  const initRef         = useRef(false);
  const disperseInitRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initRef.current) return;
    initRef.current = true;

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const cx = W / 2, cy = H / 2;

    const N = 300;
    const targets = sampleOffscreenText(W, H, N);

    const particles: Particle[] = Array.from({ length: N }, (_, i) => {
      const tx = targets[i]?.[0] ?? cx + (Math.random() - 0.5) * 100;
      const ty = targets[i]?.[1] ?? cy + (Math.random() - 0.5) * 100;

      const edge = i % 4;
      let sx: number, sy: number;
      switch (edge) {
        case 0: sx = Math.random() * W; sy = -30; break;
        case 1: sx = W + 30; sy = Math.random() * H; break;
        case 2: sx = Math.random() * W; sy = H + 30; break;
        default: sx = -30; sy = Math.random() * H; break;
      }

      const dx = tx - sx, dy = ty - sy;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      const spd = 10 + Math.random() * 8;

      const rx = (tx - cx) / W;
      let r: number, g: number, b: number;
      if (rx < -0.08)      { r = 211; g = 84;  b = 0;  }
      else if (rx > 0.08)  { r = 243; g = 156; b = 18; }
      else                 { r = 255; g = 200; b = 130; }

      return {
        x: sx, y: sy, tx, ty,
        vx: (dx / d) * spd, vy: (dy / d) * spd,
        dvx: 0, dvy: 0,
        size: 1.4 + Math.random() * 2.0,
        r, g, b, alpha: 0,
      };
    });

    startRef.current       = performance.now();
    disperseInitRef.current = false;

    function loop(now: number) {
      const t = (now - startRef.current) / 1000;

      if (t < 1.0)       phaseRef.current = "stream";
      else if (t < 1.7)  phaseRef.current = "glow";
      else               phaseRef.current = "disperse";

      const disperseT = Math.max(0, (t - 1.7) / 0.8);

      if (phaseRef.current === "disperse" && !disperseInitRef.current) {
        disperseInitRef.current = true;
        for (const p of particles) {
          const angle = Math.atan2(p.ty - cy, p.tx - cx);
          const spd   = 18 + Math.random() * 22;
          p.dvx = Math.cos(angle) * spd;
          p.dvy = Math.sin(angle) * spd;
        }
      }

      const trailOpacity = phaseRef.current === "stream" ? 0.30 : 0.55;
      ctx.fillStyle = `rgba(7,14,28,${trailOpacity})`;
      ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        if (phaseRef.current === "stream") {
          p.alpha = Math.min(1, t * 4);
          const dx = p.tx - p.x, dy = p.ty - p.y;
          p.vx = p.vx * 0.78 + dx * 0.22;
          p.vy = p.vy * 0.78 + dy * 0.22;
          p.x += p.vx; p.y += p.vy;
        } else if (phaseRef.current === "glow") {
          p.x = p.tx + Math.sin(t * 22 + p.tx * 0.08) * 1.2;
          p.y = p.ty + Math.cos(t * 19 + p.ty * 0.08) * 1.2;
          p.vx = 0; p.vy = 0;
          p.alpha = 1;
        } else {
          p.dvx *= 1.10; p.dvy *= 1.10;
          p.x += p.dvx; p.y += p.dvy;
          p.alpha = Math.max(0, 1 - disperseT * 1.6);
          p.vx = p.dvx; p.vy = p.dvy;
        }

        if (p.alpha <= 0) continue;

        const speed  = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const angle  = Math.atan2(p.vy, p.vx);
        const trailL = phaseRef.current === "stream"
          ? Math.min(speed * 3.5, 28) : p.size * 2;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const grad = ctx.createLinearGradient(-trailL, 0, p.size, 0);
        grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},0)`);
        grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},${p.alpha})`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(trailL, p.size), p.size, 0, 0, Math.PI * 2);
        ctx.fill();

        const pulse = phaseRef.current === "glow"
          ? 1 + Math.sin(t * 18 + p.tx * 0.06) * 0.6 : 1;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha * 0.9})`;
        ctx.fill();

        if (phaseRef.current === "glow") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha * 0.06})`;
          ctx.fill();
        }

        ctx.restore();
      }

      if (phaseRef.current === "glow" || (phaseRef.current === "disperse" && disperseT < 0.35)) {
        const prog = phaseRef.current === "glow"
          ? Math.min(1, (t - 1.0) / 0.35)
          : Math.max(0, 1 - disperseT * 3);
        const fs  = Math.min(W * 0.30, H * 0.52);
        const fss = Math.min(W * 0.012, 18);
        ctx.font      = `500 ${fss}px Futura, system-ui, sans-serif`;
        ctx.fillStyle = `rgba(255,255,255,${prog * 0.38})`;
        (ctx as unknown as Record<string, unknown>).letterSpacing = "0.35em";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("AFRICA CENTRED TECHNOLOGY", W / 2, H / 2 + fs * 0.56);
      }

      if (phaseRef.current === "disperse" && disperseT >= 1.0) {
        ctx.clearRect(0, 0, W, H);
        onDone();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      initRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ══════════════════════════════════════════════════════════
   LOGO PHASE — composant exporté
   ══════════════════════════════════════════════════════════ */
export default function LogoPhase({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef, onDone);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Arc orbital rotatif */}
      <motion.div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <path id="orb-lp" d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
          </defs>
          <text style={{ fontSize: "2.2", fill: "rgba(211,84,0,0.10)", fontWeight: 700, letterSpacing: "0.9" }}>
            <textPath href="#orb-lp">
              {"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}
              {"ACT · AFRICA CENTRED TECHNOLOGY · IA AFRICAINE · "}
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Halo radial central */}
      <motion.div aria-hidden style={{
        position: "absolute",
        width: "55vw", height: "55vw",
        background: "radial-gradient(ellipse, rgba(211,84,0,0.14) 0%, rgba(211,84,0,0.04) 50%, transparent 75%)",
        borderRadius: "50%",
        top: "50%", left: "50%",
        translateX: "-50%", translateY: "-50%",
        zIndex: 0,
      }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bouton "Passer" */}
      <motion.button
        onClick={onDone}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{
          position: "absolute", bottom: "2.5rem", right: "3.5rem",
          background: "none", border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "2rem", padding: "0.45rem 1.1rem",
          color: "rgba(255,255,255,0.28)", cursor: "pointer",
          fontFamily: "Futura, system-ui, sans-serif",
          fontSize: "clamp(10px, 0.68rem, 0.72rem)", letterSpacing: "0.2em",
          textTransform: "uppercase", zIndex: 5,
          transition: "color 0.2s, border-color 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = ORANGE;
          (e.currentTarget as HTMLElement).style.borderColor = ORANGE + "55";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
        }}
      >
        Passer →
      </motion.button>
    </div>
  );
}
