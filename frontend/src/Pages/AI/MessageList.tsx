import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Check, Clock, Moon, Cpu, BarChart3 } from 'lucide-react';
import { FormattedMessage } from '@/Pages/AI/utils/messageFormatter';
import type { AIMessageListProps, Message } from '@/Pages/AI/types/ai.types';

type TypingSpeed = 'instant' | 'ultra' | 'fast' | 'normal' | 'slow';

interface SmoothMessageProps {
  content: string;
  speed?: TypingSpeed;
  showCursor?: boolean;
  enableSkip?: boolean;
}

// 🌙 ULTRA PERFORMANCE SmoothMessage - Tối ưu với thiết kế Muslim
const SmoothMessage: React.FC<SmoothMessageProps> = ({ 
  content, 
  speed = 'ultra',
  showCursor = true,
  enableSkip = true
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(true);
  const [canSkip, setCanSkip] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const rafRef = React.useRef<number>(0);
  const currentIndexRef = React.useRef(0);
  const lastUpdateRef = React.useRef(0);

  // ⚡ Cấu hình BATCH PROCESSING - Hiển thị nhiều chữ cùng lúc
  const speedConfig = {
    instant: { batchSize: Infinity, delay: 0 },    // Hiển thị ngay toàn bộ
    ultra: { batchSize: 8, delay: 1 },            // 8 chữ mỗi 1ms
    fast: { batchSize: 4, delay: 2 },             // 4 chữ mỗi 2ms
    normal: { batchSize: 2, delay: 4 },           // 2 chữ mỗi 4ms
    slow: { batchSize: 1, delay: 8 }              // 1 chữ mỗi 8ms
  };

  // 🔥 Engine đánh máy tối ưu với batch processing
  const typeBatch = (timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    
    const elapsed = timestamp - lastUpdateRef.current;
    const { batchSize, delay } = speedConfig[speed];
    
    if (elapsed > delay) {
      const newIndex = Math.min(
        currentIndexRef.current + batchSize,
        content.length
      );
      
      setDisplayedText(content.substring(0, newIndex));
      setProgress((newIndex / content.length) * 100);
      currentIndexRef.current = newIndex;
      lastUpdateRef.current = timestamp;

      if (newIndex >= content.length) {
        setIsTyping(false);
        setCanSkip(false);
        return;
      }
    }
    
    rafRef.current = requestAnimationFrame(typeBatch);
  };

  React.useEffect(() => {
    if (!content || typeof content !== 'string') {
      setIsTyping(false);
      setDisplayedText('');
      return;
    }

    if (speed === 'instant') {
      setDisplayedText(content);
      setIsTyping(false);
      setProgress(100);
      return;
    }

    // Reset state
    setDisplayedText('');
    setIsTyping(true);
    setCanSkip(enableSkip);
    setProgress(0);
    currentIndexRef.current = 0;
    lastUpdateRef.current = 0;

    rafRef.current = requestAnimationFrame(typeBatch);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [content, speed, enableSkip]);

  // 🚀 Instant skip - No animation delay
  const handleSkip = React.useCallback(() => {
    if (canSkip && isTyping) {
      cancelAnimationFrame(rafRef.current);
      setDisplayedText(content);
      setIsTyping(false);
      setCanSkip(false);
      setProgress(100);
    }
  }, [canSkip, isTyping, content]);

  // 🔥 Keyboard shortcut for skip (Space or Enter)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && canSkip && isTyping) {
        e.preventDefault();
        handleSkip();
      }
    };

    if (canSkip && isTyping) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [canSkip, isTyping, handleSkip]);

  if (!content || typeof content !== 'string') {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic animate-pulse">
        ☪️ Đang tải nội dung...
      </div>
    );
  }

  return (
    <div onClick={handleSkip} className={canSkip ? 'cursor-pointer' : 'cursor-default'}>
      {/* 🌙 Performance indicator với thiết kế Muslim */}
      {isTyping && (
        <div className="flex items-center space-x-2 mb-2 text-xs text-emerald-600 dark:text-emerald-400">
          <Moon className="w-3 h-3 animate-pulse" />
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-emerald-500 h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      <motion.div 
        className="whitespace-pre-wrap break-words leading-[1.4] text-[1.125rem] text-[#000000] dark:text-[#FFFFFF]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <FormattedMessage text={displayedText || ''} />
      </motion.div>
      
      {/* 🌙 Ultra-responsive typing cursor với màu Muslim */}
      <AnimatePresence>
        {isTyping && showCursor && (
          <motion.span
            className="inline-block w-0.5 h-5 bg-gradient-to-t from-emerald-400 to-emerald-600 ml-0.5 align-text-bottom"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: [0.3, 1, 0.3], 
              scaleY: [0.8, 1, 0.8]
            }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>
      
      {/* 🌙 Enhanced skip controls */}
      <AnimatePresence>
        {canSkip && isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.2 }}
            className="flex items-center space-x-2 text-xs text-gray-400 mt-2 select-none"
          >
            <Cpu className="w-3 h-3" />
            <span>Nhấn chuột, Space hoặc Enter để hiển thị ngay</span>
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>{speed === 'ultra' ? 'ULTRA' : speed.toUpperCase()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 🌙 Main MessageList Component - Ultra Performance với thiết kế Muslim
const MessageList: React.FC<Omit<AIMessageListProps, 'themeColors'>> = ({ 
  messages, 
  onFavoriteToggle,
  onQuestionSelect,
  personalizedSuggestions
}) => {
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);
  const [renderMode] = React.useState<'ultra' | 'instant'>('ultra');

  // 🚀 Optimized copy function
  const handleCopyClick = React.useCallback(async (message: Message, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      // Auto-clear after 1.5s for better UX
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 1500);
    }
  }, []);

  const handleFavoriteClick = React.useCallback((message: Message, e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(message);
  }, [onFavoriteToggle]);

  return (
    <div className="space-y-6 py-4">
      {/* 💬 Messages với thiết kế tối ưu */}
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.16, 1, 0.3, 1],
              delay: index * 0.02 // Stagger effect
            }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'w-full'} mb-3`}
          >
            <div
              className={`${message.type === 'user' 
                ? 'max-w-[85%] sm:max-w-[75%] px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-[1.2rem] rounded-tr-[0.2rem] shadow-lg ml-auto font-sf-pro hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]' 
                : 'w-full p-6 font-sf-pro bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200'}`}
            >
              {/* Message content với ultra-fast rendering */}
              <div className={`whitespace-pre-wrap break-words leading-[1.4] ${message.type === 'user' ? 'text-[0.95rem]' : 'text-[1.125rem] text-[#000000] dark:text-[#FFFFFF]'}`}>
                {message.type === 'ai' ? (
                  message.content && typeof message.content === 'string' ? (
                    <SmoothMessage 
                      content={message.content} 
                      speed={renderMode === 'instant' ? 'instant' : 'ultra'}
                      enableSkip={true}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-red-500">
                      <span>⚠️</span>
                      <span>Lỗi: Không có nội dung để hiển thị</span>
                    </div>
                  )
                ) : (
                  message.content || (
                    <div className="text-gray-400 italic">Tin nhắn trống</div>
                  )
                )}
              </div>

              {/* 🌙 Message actions với thiết kế gọn gàng */}
              {message.type === 'ai' && (
                <motion.div 
                  className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2D2D2F]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={(e) => handleFavoriteClick(message, e)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        message.isFavorite 
                          ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 scale-110' 
                          : 'text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                      title={message.isFavorite ? 'Bỏ lưu' : 'Lưu câu trả lời'}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4" fill={message.isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>
                    
                    <motion.button
                      onClick={(e) => handleCopyClick(message, e)}
                      className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                      title="Sao chép toàn bộ văn bản"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {copiedMessageId === message.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ⏰ Simplified timestamp */}
<motion.div 
  className={`text-[0.75rem] ${message.type === 'user' ? 'text-white/80' : 'text-[#8E8E93] dark:text-[#8E8E93]'} text-right mt-3 select-none tracking-tight flex items-center justify-end space-x-2`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <Clock className="w-3 h-3 opacity-60" />
  <span>
    {message.timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })}
  </span>
</motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 🌙 Enhanced personalized suggestions với thiết kế Muslim */}
      <AnimatePresence>
        {personalizedSuggestions && personalizedSuggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center space-x-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ☪️
              </motion.div>
              <div className="font-medium text-[0.9375rem] text-emerald-700 dark:text-emerald-400 tracking-tight">
                Bạn có thể quan tâm ({personalizedSuggestions.length} gợi ý):
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {personalizedSuggestions.map((topic: { pattern: string; relevance: number }, idx: number) => (
                <motion.button
                  key={idx}
                  className="px-4 py-2 rounded-xl text-[0.8125rem] bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-700 tracking-tight hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-200 text-left shadow-sm hover:shadow-md"
                  onClick={() => onQuestionSelect && onQuestionSelect(topic.pattern)}
                  title={`Độ liên quan: ${Math.round(topic.relevance * 100)}% - Click để hỏi ngay`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: idx * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.15)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.pattern}</span>
                    <div className="flex items-center space-x-1">
                      <Moon className="w-3 h-3 opacity-60" />
                      <span className="text-xs font-bold opacity-80">
                        {Math.round(topic.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Quick action buttons với thiết kế Muslim */}
            <motion.div 
              className="flex items-center justify-center space-x-2 mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => {
                  const randomTopic = personalizedSuggestions[Math.floor(Math.random() * personalizedSuggestions.length)];
                  onQuestionSelect?.(randomTopic.pattern);
                }}
                className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center space-x-1"
              >
                <span>🎲</span>
                <span>Ngẫu nhiên</span>
              </button>
              <button
                onClick={() => {
                  const bestTopic = personalizedSuggestions.reduce((prev, current) => 
                    (prev.relevance > current.relevance) ? prev : current
                  );
                  onQuestionSelect?.(bestTopic.pattern);
                }}
                className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-xs font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center space-x-1"
              >
                <Moon className="w-3 h-3" />
                <span>Tốt nhất</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;