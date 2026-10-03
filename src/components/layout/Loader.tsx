"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Intro splash. Shown once per browser session: a refresh or a second tab
// skips it (see INTRO_SEEN_SCRIPT, which hides it before first paint so it
// never flashes). It used to cover every full page load for a fixed 1.2s and
// then run a 0.8s blurred exit — ~2s before anything was visible, each time.
export const INTRO_SEEN_KEY = "sbg-intro-seen";

// Runs inline in <head> before the page paints. Marks <html> when the intro
// was already shown this session, or when the visitor prefers reduced motion,
// so CSS can hide the splash without waiting for React to hydrate.
export const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.introSeen="1"}catch(e){}`;

const SHOW_MS = 1000;

export function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Already hidden by CSS when seen; just unmount it.
    const seen = Boolean(document.documentElement.dataset.introSeen);
    if (!seen) {
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        // Storage blocked (private mode etc.) — the splash just shows again next load.
      }
    }
    const timer = setTimeout(() => setIsLoading(false), seen ? 0 : SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="intro-loader fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-surface-container-lowest"
        >
          {/* Perfect Cloud Assembly */}
          <div className="relative w-32 h-24 mb-6 mt-4">
            {/* Left Puff */}
            <motion.div
              initial={{ x: -50, y: 50, opacity: 0, scale: 0 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.05, type: "spring", bounce: 0.4 }}
              className="absolute bottom-4 left-2 w-12 h-12 bg-primary rounded-full shadow-lg"
            />
            {/* Center Puff */}
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, type: "spring", bounce: 0.4 }}
              className="absolute bottom-6 left-8 w-16 h-16 bg-primary rounded-full shadow-xl z-10"
            />
            {/* Right Puff */}
            <motion.div
              initial={{ x: 50, y: 50, opacity: 0, scale: 0 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-full shadow-lg"
            />
            {/* Base Connector */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-0 left-0 h-10 bg-primary rounded-full z-0"
            />
          </div>

          {/* Dimensional Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            style={{ perspective: "1000px" }}
          >
            <p className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] text-on-surface-variant relative z-10">
              AWS <span className="text-primary">SBG</span> AT SRMIST
            </p>
          </motion.div>

          {/* Underline Progress */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "16rem", opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "circOut" }}
            className="h-[2px] mt-6 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
