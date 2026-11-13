"use client";

import { useEffect, useRef } from "react";

// ── Tunables ───────────────────────────────────────────────────────────────────
const GRID_SIZE = 64; // px between grid lines
const MAX_PULSES = 5; // concurrent glowing grid intersections
const PULSES_PER_SECOND = 1.2; // spawn rate (was a 2% chance per 60fps frame)
const FRAME_MS = 1000 / 30; // redraw cap

export function BackgroundNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    setSize();

    let scrollProg = 0;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - H);
      scrollProg = Math.min(1, Math.max(0, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Circuit-board style pulse nodes at grid intersections ─────────────
    class Pulse {
      col: number;
      row: number;
      t: number; // 0 -> 1 lifecycle progress
      duration: number;

      constructor(cols: number, rows: number) {
        this.col = Math.floor(Math.random() * cols);
        this.row = Math.floor(Math.random() * rows);
        this.t = 0;
        this.duration = 2.5 + Math.random() * 2;
      }

      update(dt: number) {
        this.t += dt / this.duration;
      }

      get isDone() {
        return this.t >= 1;
      }

      draw() {
        const x = this.col * GRID_SIZE;
        const y = this.row * GRID_SIZE;
        const opacity = Math.sin(this.t * Math.PI) * (0.5 + scrollProg * 0.4);
        const r = 2 + Math.sin(this.t * Math.PI) * 3;

        ctx!.beginPath();
        ctx!.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(217, 70, 239, ${opacity * 0.12})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(168, 85, 247, ${opacity})`;
        ctx!.fill();
      }
    }

    let pulses: Pulse[] = [];
    let cols = Math.ceil(W / GRID_SIZE) + 1;
    let rows = Math.ceil(H / GRID_SIZE) + 1;

    // ── Scanline sweep ──────────────────────────────────────────────────────
    let scanY = 0;
    const SCAN_SPEED = 21; // px per second (was 0.35px per frame at 60fps)

    let rafId: number;
    let lastTime = performance.now();
    let lastDraw = 0;
    let isPaused = false;

    // The grid never changes between frames, so draw it once (as a single
    // path) onto an offscreen canvas and copy it in with one drawImage per
    // frame. Redrawing ~40 separate lines every frame was most of this
    // component's cost. Scroll only changes its opacity, via globalAlpha.
    const gridCanvas = document.createElement("canvas");
    const renderGrid = () => {
      gridCanvas.width = W;
      gridCanvas.height = H;
      const g = gridCanvas.getContext("2d");
      if (!g) return;
      g.strokeStyle = "rgb(168, 85, 247)";
      g.lineWidth = 1;
      g.beginPath();
      for (let c = 0; c <= cols; c++) {
        g.moveTo(c * GRID_SIZE, 0);
        g.lineTo(c * GRID_SIZE, H);
      }
      for (let r = 0; r <= rows; r++) {
        g.moveTo(0, r * GRID_SIZE);
        g.lineTo(W, r * GRID_SIZE);
      }
      g.stroke();
    };
    renderGrid();

    const paintBase = () => {
      ctx.fillStyle = "#0a0613";
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.05 + scrollProg * 0.05;
      ctx.drawImage(gridCanvas, 0, 0);
      ctx.globalAlpha = 1;
    };

    // Visitors who prefer reduced motion get the grid as a still image.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      if (isPaused) return;
      rafId = requestAnimationFrame(draw);
      // The glow sweep and pulses are slow; 30fps looks the same as 60 (or
      // 120 on high-refresh screens) at a fraction of the work. Movement is
      // time-based, so speed doesn't depend on the frame rate.
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      paintBase();

      scanY = (scanY + SCAN_SPEED * dt) % (H + 200);
      const scanGradient = ctx.createLinearGradient(0, scanY - 100, 0, scanY + 100);
      scanGradient.addColorStop(0, "rgba(217, 70, 239, 0)");
      scanGradient.addColorStop(0.5, `rgba(217, 70, 239, ${0.04 + scrollProg * 0.05})`);
      scanGradient.addColorStop(1, "rgba(217, 70, 239, 0)");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 100, W, 200);

      if (pulses.length < MAX_PULSES && Math.random() < PULSES_PER_SECOND * dt) {
        pulses.push(new Pulse(cols, rows));
      }
      pulses.forEach((p) => p.update(dt));
      pulses = pulses.filter((p) => !p.isDone);
      pulses.forEach((p) => p.draw());
    };

    if (reduceMotion) paintBase();
    else draw(lastTime);

    const onResize = () => {
      setSize();
      cols = Math.ceil(W / GRID_SIZE) + 1;
      rows = Math.ceil(H / GRID_SIZE) + 1;
      renderGrid();
      if (reduceMotion) paintBase();
    };
    window.addEventListener("resize", onResize);

    const onVisibilityChange = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        isPaused = true;
      } else if (isPaused) {
        isPaused = false;
        lastTime = performance.now();
        draw(lastTime);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
