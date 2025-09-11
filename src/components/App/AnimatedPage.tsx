// AnimatedPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';

interface AnimatedPageProps {
  children: React.ReactNode;
}

// Variants chuyển trang: translate full width + opacity nhẹ
const pageVariants = {
  initial: { x: '100%', opacity: 0 },
  in: { x: '0%', opacity: 1 },
  out: { x: '-100%', opacity: 0 }
};

// Transition hybrid: spring cho translate, tween cho opacity
const pageTransition: Transition = {
  x: { type: 'spring', stiffness: 250, damping: 25, mass: 0.8 },
  opacity: { duration: 0.2, ease: 'easeOut' }
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
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
