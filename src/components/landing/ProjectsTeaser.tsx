"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function ProjectsTeaser() {
  return (
    <section className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-t-2 border-on-surface/10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end"
      >
        <div className="lg:col-span-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">What We Build</p>
          <h2 className="font-display font-bold text-[32px] sm:text-[48px] lg:text-[56px] leading-[1.02] tracking-tight mb-4">
            Project Showcase.
          </h2>
          <p className="text-label-md text-on-surface-variant max-w-md">
            A growing gallery of products, open-source tools, and experiments built by
            our community.
          </p>
        </div>
        <div className="lg:col-span-4 flex lg:justify-end">
          <Link
            href="/projects"
            className="border-2 border-on-surface text-on-surface px-8 py-4 font-bold uppercase tracking-wide hover:bg-on-surface hover:text-surface transition-all duration-300"
          >
            View Projects
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
