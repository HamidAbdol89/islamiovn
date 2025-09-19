import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useTheme } from '@/Pages/AI/context-custom/ThemeContext';
import type { AIInputAreaProps } from '@/Pages/AI/types/ai.types';

const InputArea: React.FC<Omit<AIInputAreaProps, 'themeColors'>> = ({
  question,
  loading,
  error,
  onQuestionChange,
  onSubmit
}) => {
  const { themeColors } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // 🚀 MOBILE OPTIMIZATION: Memoize styles để tránh re-calculation
 const containerClasses = useMemo(() => ({
  container: `relative rounded-3xl ${themeColors.inputBg} border ${themeColors.border} 
    shadow-sm hover:shadow-md transition-shadow duration-200
    focus-within:ring-0 focus-within:ring-transparent  
    focus-within:border-gray-300 dark:focus-within:border-gray-600
    will-change-[box-shadow] contain-layout`,
  
  textarea: `w-full px-4 py-3 pr-14 rounded-3xl resize-none bg-transparent
    ${themeColors.textPrimary} outline-none !important
    ${loading ? 'opacity-40 cursor-not-allowed' : ''}
    min-h-[44px] max-h-[120px]
    placeholder:${themeColors.textTertiary} placeholder:opacity-60
    text-[15px] leading-relaxed
    will-change-[height] transition-[height] duration-100 ease-out
    touch-manipulation overscroll-contain
    selection:bg-gray-200 dark:selection:bg-gray-700
    [-webkit-overflow-scrolling:touch]
    [scrollbar-width:none] [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
    [&:focus]:outline-none !important [&:focus-visible]:outline-none !important
    [&:focus]:ring-0 [&:focus-visible]:ring-0  
    [-webkit-appearance:none] [-moz-appearance:none] [appearance:none]
    contain-strict`,
    
      
    button: `absolute right-2 bottom-2 p-2.5 rounded-full transition-colors duration-150
      ${loading || !question.trim() 
        ? 'opacity-30 cursor-not-allowed bg-gray-100 dark:bg-gray-700' 
        : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm'}
      text-white dark:text-gray-900 min-w-[40px] h-[40px] flex items-center justify-center
      will-change-[background-color,transform] contain-layout`,
      
    charCounter: `absolute bottom-2 left-4 text-xs ${themeColors.textTertiary}`
  }), [themeColors, loading, question]);

  // 🚀 MOBILE OPTIMIZATION: Debounced resize với cleanup
  const handleResize = useCallback(() => {
    if (!textareaRef.current) return;
    
    // Clear previous timeout để tránh multiple calls
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Debounce với 16ms (~60fps) để smooth trên mobile
    resizeTimeoutRef.current = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
        const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }, 16);
  }, []);

  // 🚀 MOBILE OPTIMIZATION: Skip first render để tránh layout thrashing
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleResize();
  }, [question, handleResize]);

  // 🚀 MOBILE OPTIMIZATION: Cleanup timeouts
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // 🚀 MOBILE OPTIMIZATION: Memoized handlers để tránh re-renders
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && question.trim()) {
      onSubmit();
    }
  }, [loading, question, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) {
        onSubmit();
      }
    }
  }, [loading, question, onSubmit]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionChange(e.target.value);
  }, [onQuestionChange]);

  // 🚀 MOBILE OPTIMIZATION: Memoize character counter logic
  const showCharCounter = useMemo(() => question.length > 1600, [question.length]);
  const isOverLimit = useMemo(() => question.length > 2000, [question.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      {/* 🚀 MOBILE OPTIMIZATION: Reduced animation duration */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute -top-6 left-0 right-0 text-center"
          >
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100/70 text-red-800 dark:bg-red-900/15 dark:text-red-300">
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-end space-x-2">
        <div className="flex-1 relative">
          <div className={containerClasses.container}>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Đặt câu hỏi của bạn về đạo Hồi..."
              disabled={loading}
              className={containerClasses.textarea}
              rows={1}
              maxLength={2000} // 🚀 MOBILE: Prevent excessive input
              autoComplete="off" // 🚀 MOBILE: Disable autocomplete
              autoCorrect="off" // 🚀 MOBILE: Disable autocorrect
              spellCheck="false" // 🚀 MOBILE: Disable spellcheck
              inputMode="text" // 🚀 MOBILE: Optimize keyboard
            />
            
            {/* 🚀 MOBILE OPTIMIZATION: Conditional render char counter */}
            {showCharCounter && (
              <div className={`${containerClasses.charCounter} 
                ${isOverLimit ? 'text-red-500 dark:text-red-400' : ''}`}>
                {question.length}/2000
              </div>
            )}

            {/* 🚀 MOBILE OPTIMIZATION: Reduced motion values */}
            <motion.button
              type="submit"
              disabled={loading || !question.trim()}
              onClick={handleSubmit}
              whileHover={!loading && question.trim() ? { scale: 1.01 } : {}}
              whileTap={!loading && question.trim() ? { scale: 0.99 } : {}}
              transition={{ duration: 0.1 }}
              className={containerClasses.button}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;