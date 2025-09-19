import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Heart, Star, Moon, ChevronRight, Brain } from 'lucide-react';
import { useTheme } from '@/Pages/AI/context-custom/ThemeContext';
import type { UserPreferences } from '@/Pages/AI/types/ai.types';
import { useMemo, useCallback, memo } from 'react';
import { cubicBezier } from "framer-motion";

// Memoize icons to prevent unnecessary re-renders
const MemoizedIcons = {
  BookOpen: memo(BookOpen),
  Heart: memo(Heart),
  Star: memo(Star),
  Moon: memo(Moon),
  ChevronRight: memo(ChevronRight),
  Brain: memo(Brain)
};

interface WelcomeScreenProps {
  onQuestionSelect: (question: string) => void;
  userPreferences: UserPreferences;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onQuestionSelect,
  userPreferences
}) => {
  const { themeColors } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const suggestedQuestions = useMemo(() => [
    {
      text: "Giải thích về 5 trụ cột của đạo Hồi",
      category: "Kiến thức cơ bản",
      icon: <MemoizedIcons.BookOpen className="w-6 h-6" />,
      accent: "emerald"
    },
    {
      text: "Cách thực hiện Salah đúng cách",
      category: "Thực hành",
      icon: <MemoizedIcons.Heart className="w-6 h-6" />,
      accent: "teal"
    },
    {
      text: "Ý nghĩa của Ramadan",
      category: "Lễ hội",
      icon: <MemoizedIcons.Moon className="w-6 h-6" />,
      accent: "cyan"
    },
    {
      text: "Hướng dẫn về Halal và Haram",
      category: "Đời sống",
      icon: <MemoizedIcons.Star className="w-6 h-6" />,
      accent: "slate"
    }
  ], []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.3
      }
    }
  }), [prefersReducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { 
      y: 30,
      opacity: 0, 
      scale: 0.95,
      rotateX: -10,
      transformOrigin: "center bottom"
    },
    visible: prefersReducedMotion ? { opacity: 1 } : {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.23, 1, 0.32, 1)
      }
    }
  }), [prefersReducedMotion]);

  const headerVariants = useMemo(() => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { y: -50, opacity: 0 },
    visible: prefersReducedMotion ? { opacity: 1 } : {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: cubicBezier(0.23, 1, 0.32, 1)
      }
    }
  }), [prefersReducedMotion]);

  const geometricElements = useMemo(() => {
    if (prefersReducedMotion) return null;
    
    return (
      <>
        <motion.div 
          className="absolute top-1/4 right-8 w-16 h-16 sm:w-24 sm:h-24 border-2 border-emerald-200/30 dark:border-emerald-800/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 30,
            repeat: Infinity, 
            ease: cubicBezier(0.23, 1, 0.32, 1) 
          }}
          style={{ 
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-8 w-12 h-12 sm:w-16 sm:h-16 bg-teal-100/20 dark:bg-teal-900/20 rounded-lg rotate-45"
          animate={{ rotate: [45, 90, 45] }}
          transition={{ 
            duration: 20,
            repeat: Infinity, 
            ease: cubicBezier(0.23, 1, 0.32, 1) 
          }}
          style={{ 
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
      </>
    );
  }, [prefersReducedMotion]);

  // Memoize the question click handler
  const handleQuestionClick = useCallback((question: string) => {
    onQuestionSelect(question);
  }, [onQuestionSelect]);

  // Memoize style objects
  const commonMotionStyle = useMemo(() => ({
    willChange: 'transform, opacity',
    transform: 'translateZ(0)'
  }), []);

  const buttonMotionStyle = useMemo(() => ({
    willChange: 'transform',
    WebkitTapHighlightColor: 'transparent',
    transform: 'translateZ(0)'
  }), []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full h-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 relative overflow-hidden"
      style={{ 
        ...commonMotionStyle,
        WebkitOverflowScrolling: 'touch',
        touchAction: 'manipulation',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Geometric background elements - Simplified for mobile */}
      <div className="absolute inset-0 pointer-events-none w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-50/60 via-transparent to-teal-50/40 dark:from-emerald-950/40 dark:via-transparent dark:to-teal-950/30"
          style={{ willChange: 'opacity' }}
        />
        {geometricElements}
        <div 
          className="absolute top-1/3 left-4 w-2 h-20 bg-gradient-to-b from-emerald-300/40 to-transparent dark:from-emerald-700/40 rounded-full"
          style={{ willChange: 'opacity' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-auto space-y-8 sm:space-y-10 flex flex-col items-center">
        
        {/* Header with strong typography */}
        <motion.div 
          variants={headerVariants}
          className="text-center space-y-6 w-full"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative w-full">
            <div className="absolute inset-0 text-3xl sm:text-6xl font-black text-emerald-100/10 dark:text-emerald-900/10 select-none w-full">
              MIRA
            </div>
            
            <h1 className="relative text-3xl sm:text-6xl font-black tracking-tight mb-8 w-full">
              <span className="text-slate-900 dark:text-slate-100">MI</span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">RA</span>
            </h1>
          </div>
          
          <motion.p 
            className={`text-base sm:text-xl ${themeColors.textSecondary} font-medium max-w-[320px] sm:max-w-md mx-auto leading-relaxed mt-4 w-full`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1, duration: 0.8 }}
            style={{ willChange: 'opacity' }}
          >
            Trợ lý AI cho cộng đồng Muslim Việt Nam
          </motion.p>
        </motion.div>

        {/* Status indicator with style */}
        <motion.div 
          variants={itemVariants}
          className="relative flex items-center justify-center w-full"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
            <MemoizedIcons.Brain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className={`text-xs font-medium tracking-wide ${themeColors.textSecondary}`}>
              Sẵn sàng hỗ trợ
            </span>
          </div>
          
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-emerald-300/30 dark:via-emerald-700/30 to-transparent" />
        </motion.div>

        {/* Questions with character */}
        <motion.div 
          variants={itemVariants}
          className="space-y-3 sm:space-y-4 w-full max-w-[95vw] sm:max-w-lg"
          style={{ 
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-4 w-full">
            <div className="w-4 sm:w-6 h-0.5 bg-emerald-500" />
            <h2 className={`text-base sm:text-xl font-bold ${themeColors.textPrimary} tracking-tight`}>
              Khám phá ngay
            </h2>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
          </div>
          
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuestionClick(question.text)}
              className={`w-full group relative p-3 sm:p-6 rounded-lg sm:rounded-xl text-left transition-all duration-300
                bg-white/40 dark:bg-slate-900/40
                backdrop-blur-xl
                border border-white/20 dark:border-slate-700/20
                shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
                hover:bg-white/50 dark:hover:bg-slate-900/50
                hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]
                dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
                transform active:scale-[0.98]
                touch-manipulation
                select-none`}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              style={{ 
                ...buttonMotionStyle,
                transform: 'translateZ(0)'
              }}
            >
              <div className="flex items-center space-x-3 sm:space-x-5 w-full">
                <motion.div 
                  className={`relative p-2 sm:p-4 rounded-lg sm:rounded-xl 
                    bg-white/60 dark:bg-slate-800/60
                    backdrop-blur-lg
                    border border-white/20 dark:border-slate-700/20
                    shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]
                    dark:shadow-[0_4px_16px_0_rgba(0,0,0,0.3)]
                    group-hover:bg-white/70 dark:group-hover:bg-slate-800/70
                    group-hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.15)]
                    dark:group-hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.4)]
                    transition-all duration-300`}
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  <div className="text-emerald-600 dark:text-emerald-400">
                    {question.icon}
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 leading-tight text-slate-900 dark:text-slate-100">
                    {question.text}
                  </h3>
                  <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {question.category}
                  </p>
                </div>
                
                <motion.div
                  className="text-slate-400 dark:text-slate-500 flex-shrink-0
                    transition-transform duration-300
                    group-hover:translate-x-0.5"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  <MemoizedIcons.ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Settings with minimal style */}
        <motion.div 
          variants={itemVariants}
          className="w-full flex flex-col items-center"
          style={{ 
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center space-x-1.5 w-full justify-center">
            <MemoizedIcons.BookOpen className="w-3.5 h-3.5 text-emerald-600/70 dark:text-emerald-400/70" />
            <span className={`text-xs ${themeColors.textSecondary}`}>
              Phong cách:
            </span>
            <span className="text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {userPreferences.learningStyle === 'simple' ? 'Đơn giản' : 
               userPreferences.learningStyle === 'balanced' ? 'Cân bằng' : 'Chi tiết'}
            </span>
          </div>
          
          <div className="mt-1 w-12 h-px bg-gradient-to-r from-transparent via-emerald-300/30 dark:via-emerald-700/30 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Memoize the entire component
export default memo(WelcomeScreen);