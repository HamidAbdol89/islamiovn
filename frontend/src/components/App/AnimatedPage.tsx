import React from "react";
import { motion } from "motion/react";
import type { Transition } from "motion/react";

interface AnimatedPageProps {
  children: React.ReactNode;
}

// iOS-like easing
const iosEase: Transition["ease"] = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: {
    x: 20,
    opacity: 0,
  },
  in: {
    x: 0,
    opacity: 1,
  },
  out: {
    x: -20,
    opacity: 0,
  },
};

const pageTransition: Transition = {
  duration: 0.25,
  ease: iosEase,
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;