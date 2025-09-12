// AnimatedPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
interface AnimatedPageProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition: Transition = {
  opacity: {
    duration: 0.2,
    ease: [0, 0, 1, 1], // cubic-bezier linear
  },
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
