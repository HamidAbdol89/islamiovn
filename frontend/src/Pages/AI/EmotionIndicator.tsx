import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, AlertCircle } from 'lucide-react';

interface EmotionIndicatorProps {
  emotion: string;
  intensity: number;
}

export const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ emotion, intensity }) => {
  const emotionIcons = {
    positive: Smile,
    negative: Frown,
    neutral: Meh,
    concerned: AlertCircle
  };

  const emotionColors = {
    positive: 'text-green-500 dark:text-green-400',
    negative: 'text-red-500 dark:text-red-400',
    neutral: 'text-blue-500 dark:text-blue-400',
    concerned: 'text-yellow-500 dark:text-yellow-400'
  };

  const emotionLabels = {
    positive: 'Tích cực',
    negative: 'Tiêu cực',
    neutral: 'Trung lập',
    concerned: 'Lo lắng'
  };

  const Icon = emotionIcons[emotion as keyof typeof emotionIcons] || Meh;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: emotion === 'positive' ? [0, -10, 10, -5, 5, 0] : 0
      }}
      transition={{ 
        duration: 0.5,
        rotate: { duration: 0.6, ease: "easeInOut" }
      }}
      className={`flex items-center gap-1 ${emotionColors[emotion as keyof typeof emotionColors]}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon size={16} />
      </motion.div>
      <span className="capitalize text-sm">
        {emotionLabels[emotion as keyof typeof emotionLabels]}
        {intensity > 0.7 && ' (Cao)'}
      </span>
    </motion.div>
  );
}; 