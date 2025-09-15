import React from 'react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4"
  >
    <div className="text-center max-w-md mx-auto">
      <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Page Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mr-4"
      >
        Go Back
      </button>
      <a
        href="/"
        className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors inline-block"
      >
        Home
      </a>
    </div>
  </motion.div>
);

export default NotFound;