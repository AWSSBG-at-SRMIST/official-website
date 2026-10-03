"use client";

import { motion } from "framer-motion";
import { BrainOverlay } from "./BrainOverlay";
import { GlobeAnimation } from "./GlobeAnimation";
import Link from "next/link";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg lg:min-h-[85vh] lg:flex lg:items-center">
      {/* Background Globe Animation */}
      <GlobeAnimation />
      <BrainOverlay />

      {/* HUD corner brackets framing the section */}
      <div className="hidden lg:block absolute top-6 left-0 w-10 h-10 border-l-2 border-t-2 border-primary/40" />
      <div className="hidden lg:block absolute top-6 right-0 w-10 h-10 border-r-2 border-t-2 border-primary/40" />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center z-10 w-full relative"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:col-span-8 xl:col-span-7 space-y-8 relative z-20">
          <motion.p
            variants={item}
            className="text-xs uppercase tracking-[0.2em] text-primary"
          >
            AWS Student Builder Group at SRMIST
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-bold leading-[0.95] tracking-tight text-[56px] sm:text-[80px] lg:text-[104px] xl:text-[124px]"
          >
            Think Big.
            <br />
            <span className="text-primary">Build Bigger.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-label-md text-on-surface-variant max-w-lg border-l-2 border-primary/40 pl-5"
          >
            AWS Student Builder Group at SRMIST is the official student tech
            community at SRM, Kattankulathur — building on AWS, AI, data
            engineering, and modern software development.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/projects"
              className="bg-primary text-on-primary px-8 py-4 font-headline-md text-body-md font-bold uppercase tracking-wide hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-block text-center"
            >
              See What We Build
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
