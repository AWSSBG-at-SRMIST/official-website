"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const NEURONS = [
  { angle: -150, length: 95 },
  { angle: -115, length: 120 },
  { angle: -65, length: 100 },
  { angle: -20, length: 130 },
  { angle: 15, length: 105 },
  { angle: 60, length: 125 },
  { angle: 115, length: 95 },
  { angle: 160, length: 115 },
];

function Neuron({ angle, length, delay }: { angle: number; length: number; delay: number }) {
  const rad = (angle * Math.PI) / 180;
  const x2 = Math.cos(rad) * length;
  const y2 = Math.sin(rad) * length;

  return (
    <>
      <motion.line
        x1={0}
        y1={0}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
      {/* Endless pulse runs as a CSS animation (.neuron-dot in globals.css)
          rather than a framer-motion loop, so it doesn't cost main-thread
          work every frame. */}
      <circle
        cx={x2}
        cy={y2}
        r={3}
        fill="currentColor"
        className="neuron-dot"
        style={{ animationDelay: `${delay + 0.4}s` }}
      />
    </>
  );
}

// Mirrors GlobeAnimation's own wrapper exactly (same inset-0 box, same
// lg:translate-x-1/4 shift) so the brain's center point lands on the
// globe's visual center, which the WebGL camera renders in the middle of
// that same translated box.
export function BrainOverlay() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[260px] sm:h-[300px] pointer-events-none -z-10 overflow-hidden lg:inset-0 lg:h-auto">
      <div className="relative w-full h-full lg:translate-x-1/4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            viewBox="-170 -170 340 340"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] text-[#D946EF]"
          >
            {NEURONS.map((n, i) => (
              <Neuron key={i} angle={n.angle} length={n.length} delay={i * 0.12} />
            ))}
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Brain
              size={120}
              strokeWidth={1.1}
              className="text-primary drop-shadow-[0_0_28px_rgba(168,85,247,0.55)]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
