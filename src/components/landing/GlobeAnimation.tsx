"use client";

import { useEffect, useRef, useState } from "react";

// Hero globe. Renders a still SVG globe straight away (server-rendered, so
// it's in the first paint), then — only on devices that can afford it —
// loads the WebGL version (globeScene.ts + three.js, ~130KB gzipped) once the
// browser is idle, and cross-fades to it. Before, three.js was fetched and
// started on every visit before anything else settled, roughly doubling the
// homepage's startup work.

// Same Fibonacci-sphere layout as the WebGL nodes, projected flat.
const POSTER_R = 91; // globe radius in the 200x200 viewBox (matches the 3D camera framing)
const POSTER_DOTS = Array.from({ length: 55 }, (_, i) => {
  const phi = Math.acos(-1 + (2 * i) / 55);
  const theta = Math.sqrt(55 * Math.PI) * phi;
  const r = 102;
  return {
    x: r * Math.sin(phi) * Math.sin(theta),
    y: -r * Math.cos(phi),
    front: Math.sin(phi) * Math.cos(theta) > -0.2,
  };
}).filter((d) => d.front);

function GlobePoster() {
  // Faint and dense like the WebGL wireframe, so the cross-fade is subtle.
  const line = { fill: "none", stroke: "rgba(196,181,253,0.085)", strokeWidth: 0.3 };
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
      <circle r={POSTER_R} fill="rgba(168,85,247,0.05)" stroke="rgba(196,181,253,0.16)" strokeWidth={0.4} />
      {[10, 20, 30, 40, 50, 60, 70, 80].map((deg) => (
        <ellipse key={`m${deg}`} rx={POSTER_R * Math.cos((deg * Math.PI) / 180)} ry={POSTER_R} {...line} />
      ))}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const rx = POSTER_R * Math.cos(rad);
        return <ellipse key={`p${deg}`} cy={POSTER_R * Math.sin(rad)} rx={rx} ry={rx * 0.12} {...line} />;
      })}
      {POSTER_DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.2} fill="#d946ef" opacity={0.8} />
      ))}
    </svg>
  );
}

// The animated globe is skipped where it would cost the visitor more than
// it gives: reduced-motion preference, Data Saver, low-memory or low-core
// devices, and touch devices (phones/tablets), where the globe's cursor
// interaction doesn't apply and battery matters. They keep the still globe.
function canAnimateGlobe(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return false;
  if (window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 1024) return false;
  return true;
}

export function GlobeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canAnimateGlobe()) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    const start = async () => {
      try {
        const { createGlobe } = await import("./globeScene");
        if (cancelled) return;
        destroy = createGlobe(container, () => {
          if (!cancelled) setWebglReady(true);
        });
      } catch {
        // No WebGL, or the chunk failed to load: the still globe stays.
      }
    };

    // Wait until the browser has finished the important work (hero text,
    // fonts, hydration) before downloading and starting three.js.
    // (Safari has no requestIdleCallback; fall back to a short delay.)
    const w = window as Window;
    const hasIdle = typeof w.requestIdleCallback === "function";
    const idleId = hasIdle
      ? w.requestIdleCallback(start, { timeout: 2500 })
      : w.setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) w.cancelIdleCallback(idleId);
      else w.clearTimeout(idleId);
      destroy?.();
    };
  }, []);

  return (
    <div
      className="relative h-[260px] sm:h-[300px] w-full mb-6 pointer-events-none -z-10 overflow-hidden lg:overflow-visible lg:absolute lg:inset-0 lg:h-[90%] lg:mb-0"
    >
      <div className="relative w-full h-full lg:translate-x-1/4">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${webglReady ? "opacity-0" : "opacity-100"}`}
        >
          <GlobePoster />
        </div>
        <div
          ref={containerRef}
          className={`absolute inset-0 transition-opacity duration-700 ${webglReady ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
