import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900"
  >
    <div className="text-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
      ></motion.div>
      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
        Loading...
      </p>
    </div>
  </motion.div>
);

export default LoadingSpinner;