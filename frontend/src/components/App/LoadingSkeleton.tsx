import React from 'react';
import { motion } from 'motion/react';
import { Skeleton } from "@/components/ui/skeleton"; // nhớ đường dẫn đúng nhé bro

const LoadingSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4"
  >
    <div className="space-y-4 w-full max-w-sm">
      <Skeleton className="h-16 w-16 mx-auto rounded-full" />
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </motion.div>
);

export default LoadingSkeleton;
