import React, { useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useTheme } from '@/Pages/AI/context-custom/ThemeContext';

interface AIInputAreaProps {
  question: string;
  loading: boolean;
  error: string;
  onQuestionChange: (value: string) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => Promise<void>;
}

const AIInputArea: React.FC<AIInputAreaProps> = ({
  question,
  loading,
  error,
  onQuestionChange,
  onSubmit
}) => {
  const { themeColors } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !loading) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className={`${themeColors.cardBg} ${themeColors.border} border-t px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 safe-bottom`}>
      <div className="flex items-end space-x-2 sm:space-x-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi về giáo lý Hồi giáo..."
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 ${themeColors.inputBg} ${themeColors.border} border rounded-xl sm:rounded-2xl resize-none transition-all duration-200 text-sm sm:text-base ${themeColors.textPrimary} placeholder:${themeColors.textTertiary} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:${themeColors.border} touch-manipulation`}
            style={{ minHeight: '44px', maxHeight: '100px' }}
            disabled={loading}
            rows={1}
          />
          
          {/* Character counter - Hidden on very small screens */}
          <div className={`absolute bottom-2 right-10 sm:right-12 text-xs ${themeColors.textTertiary} opacity-60 hidden xs:block`}>
            {question.length}/1000
          </div>
        </div>

        {/* Send button - Mobile friendly */}
        <button
          onClick={onSubmit}
          disabled={loading || !question.trim()}
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r ${themeColors.buttonGradient} text-white rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg touch-manipulation`}
          style={{
            boxShadow: `0 4px 14px 0 ${themeColors.buttonGlow}`
          }}
          aria-label="Gửi câu hỏi"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>
      </div>

      {/* Helper text - More compact on mobile */}
      <div className="flex items-center justify-center mt-2 sm:mt-3 space-x-2 text-xs">
        <div className={`w-1.5 h-1.5 rounded-full ${
          loading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'
        }`}></div>
        <span className={`${themeColors.textTertiary}`}>
          {loading ? 'Đang xử lý...' : error ? 'Lỗi kết nối' : 'Nhấn Enter để gửi'}
        </span>
      </div>
    </div>
  );
};

export default AIInputArea;