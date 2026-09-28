"use client";

import { motion } from "framer-motion";
import "./TeamCategoryScroller.css";

interface Category {
  id: string;
  name: string;
}

interface TeamCategoryScrollerProps {
  categories: Category[];
  activeIndex: number;
  onCategoryChange: (index: number) => void;
}

export function TeamCategoryScroller({
  categories,
  activeIndex,
  onCategoryChange,
}: TeamCategoryScrollerProps) {
  const scrollerVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
  };

  const itemVariants = {
    // Dimmed but still readable: at opacity 0.4 with a blur, inactive tab
    // labels were close to invisible on the dark background.
    inactive: {
      scale: 0.92,
      opacity: 0.75,
      filter: "blur(0px)",
      x: 0,
    },
    active: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
    },
  };

  return (
    <motion.div
      className="team-category-scroller desktop"
      variants={scrollerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.button
            key={category.id}
            className={`team-category-item ${isActive ? "active" : ""}`}
            onClick={(e) => {
              onCategoryChange(index);
              // Bring a partly hidden tab fully into the scrollable row.
              e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            }}
            custom={index}
            variants={itemVariants}
            animate={isActive ? "active" : "inactive"}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
            whileHover={{ scale: 0.9, opacity: 0.7 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="category-label">{category.name}</span>
            {isActive && (
              <motion.div
                className="category-indicator"
                layoutId="category-indicator"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
