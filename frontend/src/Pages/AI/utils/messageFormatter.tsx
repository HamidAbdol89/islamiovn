/**
 * @fileoverview Message Formatter Component for Islam.io.vn AI
 * A modern, intelligent message formatting system designed specifically for the Vietnamese Muslim community.
 * Features include Islamic content handling, emotional analysis, and smart formatting.
 * 
 * @author Islam.io.vn Team
 * @version 2.0.0
 * @license MIT
 */

import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion } from 'framer-motion';

import { 
  

  BookOpen, Moon, Copy,
  CheckCheck, AlertTriangle, Heart, Brain, BookMarked,
  Lightbulb, Shield
} from 'lucide-react';

// ==================== TYPES & INTERFACES ====================

/**
 * Props for Islamic pattern component
 * @interface IslamicPatternProps
 * @property {string} [className] - Additional CSS classes
 * @property {'star' | 'geometric' | 'calligraphy'} [patternType] - Type of Islamic pattern
 */
interface IslamicPatternProps {
  className?: string;
  patternType?: 'star' | 'geometric' | 'calligraphy';
}

/**
 * Props for Islamic border component
 * @interface IslamicBorderProps
 * @property {React.ReactNode} children - Child components
 * @property {'emerald' | 'blue' | 'amber' | 'purple' | 'rose'} [variant] - Border color variant
 * @property {'subtle' | 'medium' | 'strong'} [intensity] - Border intensity
 * @property {boolean} [animated] - Whether to animate the border
 */
interface IslamicBorderProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
}

/**
 * Props for copy button component
 * @interface CopyButtonProps
 * @property {string} text - Text to copy
 * @property {string} [className] - Additional CSS classes
 * @property {'sm' | 'md' | 'lg'} [size] - Button size
 */
interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Metadata for message formatting
 * @interface MessageMetadata
 * @property {string} [source] - Source of the message (e.g., Quran, Hadith)
 * @property {string} [chapter] - Chapter reference
 * @property {string} [verse] - Verse reference
 * @property {string} [hadithSource] - Hadith source
 * @property {string} [scholarName] - Name of the scholar
 * @property {'neutral' | 'concerned' | 'hopeful'} [emotionalState] - Emotional state of the message
 * @property {'normal' | 'medium' | 'high'} [urgencyLevel] - Urgency level
 * @property {'low' | 'medium' | 'high'} [complexityLevel] - Complexity level
 * @property {string[]} [contexts] - Message contexts
 * @property {string[]} [relatedTopics] - Related topics
 * @property {Array<{pattern: string; relevance: number; contexts: string[]}>} [suggestedQuestions] - Suggested questions
 * @property {{quran?: string[]; hadith?: string[]}} [references] - References
 * @property {Record<string, string | number | boolean>} [additionalInfo] - Additional information
 */
interface MessageMetadata {
  source?: string;
  chapter?: string;
  verse?: string;
  hadithSource?: string;
  scholarName?: string;
  emotionalState?: 'neutral' | 'concerned' | 'hopeful';
  urgencyLevel?: 'normal' | 'medium' | 'high';
  complexityLevel?: 'low' | 'medium' | 'high';
  contexts?: string[];
  relatedTopics?: string[];
  suggestedQuestions?: Array<{
    pattern: string;
    relevance: number;
    contexts: string[];
  }>;
  references?: {
    quran?: string[];
    hadith?: string[];
  };
  additionalInfo?: Record<string, string | number | boolean>;
}

/**
 * Message type definition
 * @interface MessageType
 * @property {MessageTypeEnum} type - Type of message
 * @property {string} content - Message content
 * @property {MessageMetadata} [metadata] - Message metadata
 */
interface MessageType {
  type: 'greeting' | 'title' | 'quran' | 'hadith' | 'scholar' | 'note' | 
        'conclusion' | 'advice' | 'dua' | 'regular' | 'emotional' | 
        'reference' | 'suggestion' | 'context';
  content: string;
  metadata?: MessageMetadata;
}

// ==================== MOBILE-FIRST CONSTANTS ====================
const BORDER_VARIANTS = {
  emerald: 'from-emerald-300/20 via-emerald-400/10 to-emerald-300/20',
  blue: 'from-blue-300/20 via-blue-400/10 to-blue-300/20',
  amber: 'from-amber-300/20 via-amber-400/10 to-amber-300/20',
  purple: 'from-purple-300/20 via-purple-400/10 to-purple-300/20',
  rose: 'from-rose-300/20 via-rose-400/10 to-rose-300/20'
} as const;

const COPY_STATES = {
  idle: 'Copy',
  copying: 'Copying...',
  success: 'Copied!',
  error: 'Error'
} as const;

// ==================== MOBILE HOOKS ====================

/**
 * Hook to detect mobile devices
 * @returns {boolean} Whether the device is mobile
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

/**
 * Hook to optimize touch interactions
 * @returns {Object} Touch optimization utilities
 */
const useTouchOptimized = () => {
  const [isTouching, setIsTouching] = useState(false);
  
  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  return {
    isTouching,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    }
  };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce utility function
 * @template T
 * @param {T} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {(...args: Parameters<T>) => void} Debounced function
 */
const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Detect message type based on content and metadata
 * @param {string} text - Message text
 * @param {MessageMetadata} [_metadata] - Message metadata
 * @returns {MessageType['type']} Detected message type
 */
const detectMessageType = (text: string, _metadata?: MessageMetadata): MessageType['type'] => {
  const trimmed = text.trim();
  
  // Check metadata first for intelligent typing
  if (_metadata) {
    if (_metadata.emotionalState && _metadata.emotionalState !== 'neutral') {
      return 'emotional';
    }
    if (_metadata.references?.quran?.length) {
      return 'quran';
    }
    if (_metadata.references?.hadith?.length) {
      return 'hadith';
    }
    if (_metadata.suggestedQuestions?.length) {
      return 'suggestion';
    }
    if (_metadata.contexts?.length) {
      return 'context';
    }
  }
  
  // Islamic greetings
  if (trimmed.match(/^(بسم الله|السلام عليكم|الحمد لله|سبحان الله|إن شاء الله|ما شاء الله|اللهم)/)) {
    return 'greeting';
  }
  
  // Titles
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    return 'title';
  }
  
  // Quranic verses
  if (trimmed.match(/^["'"].*["'"]$/) || trimmed.includes('Qur\'an') || trimmed.includes('آية')) {
    return 'quran';
  }
  
  // Hadith
  if (trimmed.includes('Hadith') || trimmed.includes('hadith') || trimmed.includes('Rasulullah') || trimmed.includes('النبي')) {
    return 'hadith';
  }
  
  // Scholar quotes
  if (trimmed.includes('Imam') || trimmed.includes('Sheikh') || trimmed.includes('Ulama')) {
    return 'scholar';
  }
  
  // Important notes
  if (trimmed.match(/^(Lưu ý|Chú ý|Penting|Ingat|تذكير):/i)) {
    return 'note';
  }
  
  // Conclusions
  if (trimmed.match(/^(Kết luận|Tóm lại|Kesimpulan|Ringkasan):/i)) {
    return 'conclusion';
  }
  
  // Advice
  if (trimmed.match(/^(Gợi ý|Lời khuyên|Saran|Nasihat):/i)) {
    return 'advice';
  }
  
  // Dua
  if (trimmed.includes('doa') || trimmed.includes('du\'a') || trimmed.includes('اللهم')) {
    return 'dua';
  }
  
  return 'regular';
};

// ==================== MOBILE-OPTIMIZED TEXT FORMATTING ====================
const formatTextWithMarkdown = (text: string): React.ReactElement => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|_.*?_|~~.*?~~|\[.*?\]\(.*?\))/g);
  
  return (
    <span className="font-sf-pro antialiased subpixel-antialiased">
      {parts.map((part, index) => {
        // Bold text - macOS style
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {part.slice(2, -2)}
            </strong>
          );
        }
        
        // Italic text - macOS style
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={index} className="italic text-slate-700 dark:text-slate-300 font-medium tracking-tight">
              {part.slice(1, -1)}
            </em>
          );
        }
        
        // Code snippets - macOS style
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="px-1.5 py-0.5 text-sm bg-slate-100/90 dark:bg-slate-800/90 rounded-md border border-slate-200/50 dark:border-slate-700/50 font-mono text-slate-700 dark:text-slate-300 break-all tracking-tight">
              {part.slice(1, -1)}
            </code>
          );
        }
        
        // Underlined text - macOS style
        if (part.startsWith('_') && part.endsWith('_')) {
          return (
            <span key={index} className="underline decoration-2 decoration-blue-500/60 underline-offset-2 text-slate-800 dark:text-slate-200">
              {part.slice(1, -1)}
            </span>
          );
        }
        
        // Strikethrough text - macOS style
        if (part.startsWith('~~') && part.endsWith('~~')) {
          return (
            <span key={index} className="line-through text-slate-500/80 dark:text-slate-400/80">
              {part.slice(2, -2)}
            </span>
          );
        }
        
        // Links - macOS style
        if (part.match(/\[.*?\]\(.*?\)/)) {
          const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            return (
              <a 
                key={index} 
                href={linkMatch[2]}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2"
              >
                {linkMatch[1]}
              </a>
            );
          }
        }
        
        return <span key={index} className="text-slate-800 dark:text-slate-200">{part}</span>;
      })}
    </span>
  );
};

// ==================== MOBILE-OPTIMIZED COMPONENTS ====================
const IslamicPattern = memo<IslamicPatternProps>(({ 
  className = '', 
  patternType = 'star' 
}) => {
  const isMobile = useIsMobile();
  
  // Reduce pattern complexity on mobile for better performance
  if (isMobile) {
    return (
      <div className={`absolute inset-0 opacity-20 ${className}`} aria-hidden="true">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-slate-100/20 dark:via-slate-800/20 to-transparent"></div>
      </div>
    );
  }

  const patterns = {
    star: (
      <path d="M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8 Z" 
            fill="currentColor" opacity="0.08"/>
    ),
    geometric: (
      <path d="M0,0 L10,10 L20,0 L20,20 L10,10 L0,20 Z" 
            fill="currentColor" opacity="0.06"/>
    ),
    calligraphy: (
      <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.1"/>
    )
  };

  return (
    <div className={`absolute inset-0 opacity-30 ${className}`} aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <pattern id={`islamic-${patternType}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            {patterns[patternType]}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-${patternType})`} />
      </svg>
    </div>
  );
});

IslamicPattern.displayName = 'IslamicPattern';

const IslamicBorder = memo<IslamicBorderProps>(({ 
  children, 
  variant = 'emerald',
  intensity = 'medium',
  animated = false
}) => {
  const isMobile = useIsMobile();
  const selectedColor = BORDER_VARIANTS[variant];
  
  // Simplified border for mobile
  const opacityClass = isMobile ? 'opacity-15' : {
    subtle: 'opacity-20',
    medium: 'opacity-25',
    strong: 'opacity-30'
  }[intensity];
  
  const animationClass = animated && !isMobile ? 'animate-pulse-soft' : '';
  
  return (
    <div className="relative">
      <div className={`absolute -inset-1 bg-gradient-to-r ${selectedColor} rounded-lg blur-sm ${opacityClass} ${animationClass}`}></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
});

IslamicBorder.displayName = 'IslamicBorder';

const CopyButton = memo<CopyButtonProps>(({ text, className = '', size = 'md' }) => {
  const [copyState, setCopyState] = useState<keyof typeof COPY_STATES>('idle');
  const isMobile = useIsMobile();
  const { isTouching, touchProps } = useTouchOptimized();
  
  const handleCopy = useCallback(async () => {
    if (copyState !== 'idle') return;
    
    setCopyState('copying');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('success');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }, [text, copyState]);
  
  const debouncedCopy = useMemo(() => debounce(handleCopy, 300), [handleCopy]);
  
  // Mobile-optimized sizes - larger touch targets
  const sizeClasses = isMobile ? {
    sm: 'px-3 py-2 text-sm min-h-[44px]',
    md: 'px-4 py-2.5 text-sm min-h-[48px]',
    lg: 'px-5 py-3 text-base min-h-[52px]'
  }[size] : {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }[size];
  
  const IconComponent = copyState === 'success' ? CheckCheck : 
                       copyState === 'error' ? AlertTriangle : Copy;
  
  return (
    <button
      onClick={debouncedCopy}
      disabled={copyState !== 'idle'}
      className={`flex items-center justify-center space-x-2 ${sizeClasses} bg-slate-100/60 hover:bg-slate-200/60 active:bg-slate-200/80 disabled:bg-slate-100/30 dark:bg-slate-700/40 dark:hover:bg-slate-600/50 dark:active:bg-slate-600/70 dark:disabled:bg-slate-700/20 rounded-md text-slate-600 dark:text-slate-300 touch-manipulation ${isTouching ? 'select-none' : ''} ${className}`}
      aria-label={COPY_STATES[copyState]}
      {...touchProps}
    >
      <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
      {!isMobile && <span>{COPY_STATES[copyState]}</span>}
    </button>
  );
});

CopyButton.displayName = 'CopyButton';

// ==================== MOBILE-OPTIMIZED MESSAGE COMPONENTS ====================
const IconWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </div>
);

const GreetingMessage = memo(({ content }: { content: string }) => {
  const isMobile = useIsMobile();
  
  return (
 <div className={`text-center ${isMobile ? 'py-4' : 'py-6'} relative`}>
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/10 dark:via-emerald-900/10 to-transparent rounded-2xl backdrop-blur-xl"></div>

  <IslamicBorder variant="emerald" intensity="subtle">
  <div
    className={`inline-flex items-center space-x-3 ${
      isMobile ? 'px-4 py-3' : 'px-6 py-4'
    } bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-slate-700/20 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]`}
  >
    <IconWrapper
      className="text-emerald-600/90 dark:text-emerald-400/90"
    >
      <Moon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
    </IconWrapper>

    <span
      className={`${
        isMobile ? 'text-base' : 'text-lg'
      } font-medium text-emerald-700 dark:text-emerald-300 tracking-tight`}
    >
      {content}
    </span>

    <IconWrapper
      className="text-emerald-600/90 dark:text-emerald-400/90"
    >
      <Moon
        className={`${
          isMobile ? 'w-4 h-4' : 'w-5 h-5'
        } scale-x-[-1]`}
      />
    </IconWrapper>
  </div>
</IslamicBorder>

</div>

  );
});

GreetingMessage.displayName = 'GreetingMessage';

const TitleMessage = memo(({ content }: { content: string }) => {
  const isMobile = useIsMobile();
  
return (
  <div className={`relative ${isMobile ? 'mb-4' : 'mb-6'}`}>
    <div className={`flex items-center justify-center space-x-3 ${isMobile ? 'mb-3' : 'mb-4'}`}>
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-300/60 dark:via-emerald-600/40 to-emerald-400/60 dark:to-emerald-500/40 flex-1"></div>

      <IconWrapper className="relative">
        <Moon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-500/70 dark:text-emerald-400/70`} />
        <div className={`absolute inset-0 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'} bg-emerald-400/20 rounded-full blur-md`}></div>
      </IconWrapper>

      <div className="h-px bg-gradient-to-l from-transparent via-emerald-300/60 dark:via-emerald-600/40 to-emerald-400/60 dark:to-emerald-500/40 flex-1"></div>
    </div>

    <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-center text-slate-800 dark:text-slate-200 leading-tight tracking-tight px-2`}>
      {content.replace(/\*\*/g, '')}
    </h3>
  </div>
);

});

TitleMessage.displayName = 'TitleMessage';

const QuranMessage = memo(({ content, metadata }: { content: string; metadata?: MessageMetadata }) => {
  const isMobile = useIsMobile();
return (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={`relative ${isMobile ? 'my-5' : 'my-8'}`}
  >
    <IslamicBorder variant="emerald" intensity="strong">
      <div className={`bg-white/50 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/30 rounded-3xl p-${isMobile ? '4' : '6'} shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all`}>

        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`absolute -top-4 ${isMobile ? 'left-4' : 'left-6'} px-3 py-1.5 rounded-full font-semibold text-[0.875rem] shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-blur-xl bg-gradient-to-r from-emerald-100/90 to-white/60 dark:from-emerald-900/70 dark:to-slate-800/80 text-emerald-700 dark:text-emerald-300 flex items-center space-x-2 ring-1 ring-emerald-400/30`}
        >
          <IconWrapper>
            <BookOpen className="w-4 h-4" />
          </IconWrapper>
          <span className={`tracking-tight ${isMobile ? 'hidden sm:inline' : 'inline'}`}>
            {metadata?.source || 'القرآن الكريم'}
          </span>
        </motion.div>

        {/* Nội dung chính */}
        <div className={`flex items-start ${isMobile ? 'space-x-3' : 'space-x-4'} mt-3`}>
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className={`text-slate-800 dark:text-slate-100 font-[500] leading-relaxed ${isMobile ? 'text-base' : 'text-lg'} tracking-tight mb-${isMobile ? '2' : '3'} break-words`}
              style={{ fontFamily: `'Amiri', 'Scheherazade New', serif` }}
            >
              {formatTextWithMarkdown(content)}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex items-center justify-between mt-2"
            >
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 group">
          
                <span className="italic font-medium tracking-tight">
                  {metadata?.chapter && metadata?.verse
                    ? `Surah ${metadata.chapter}, Ayah ${metadata.verse}`
                    : 'كلام الله المجيد'}
                </span>
              </div>
              <CopyButton text={content} size="sm" />
            </motion.div>
          </div>
        </div>
      </div>
    </IslamicBorder>
  </motion.div>
);

});

QuranMessage.displayName = 'QuranMessage';

// New component for emotional state messages
const EmotionalMessage = memo(({ content, metadata }: { content: string; metadata?: MessageMetadata }) => {
  const isMobile = useIsMobile();
  const emotionalState = metadata?.emotionalState || 'neutral';
  
  type EmotionalStyle = {
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'rose' | 'emerald';
    gradient: string;
    border: string;
    text: string;
  };
  
  const emotionalStyles: Record<'concerned' | 'hopeful' | 'neutral', EmotionalStyle> = {
    concerned: {
      icon: Shield,
      color: 'blue',
      gradient: 'bg-white/40 dark:bg-slate-800/40',
      border: 'border-white/20 dark:border-slate-700/20',
      text: 'text-slate-800 dark:text-slate-200'
    },
    hopeful: {
      icon: Heart,
      color: 'rose',
      gradient: 'bg-white/40 dark:bg-slate-800/40',
      border: 'border-white/20 dark:border-slate-700/20',
      text: 'text-slate-800 dark:text-slate-200'
    },
    neutral: {
      icon: Brain,
      color: 'emerald',
      gradient: 'bg-white/40 dark:bg-slate-800/40',
      border: 'border-white/20 dark:border-slate-700/20',
      text: 'text-slate-800 dark:text-slate-200'
    }
  };
  
  const style = emotionalStyles[emotionalState];
  const IconComponent = style.icon;
  
  return (
    <div className={`relative rounded-2xl p-4 ${style.gradient} ${style.border} border shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl`}>
      <div className={`absolute -top-3 ${isMobile ? 'left-4' : 'left-6'} bg-white/80 dark:bg-slate-800/80 text-${style.color}-600 dark:text-${style.color}-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl border border-white/20 dark:border-slate-700/20`}>
        <IconComponent className="w-4 h-4" />
        <span className={isMobile ? 'hidden sm:inline' : 'inline'}>
          {emotionalState === 'concerned' ? 'Lời Khuyên' : 
           emotionalState === 'hopeful' ? 'Niềm Hy Vọng' : 
           'Hướng Dẫn'}
        </span>
      </div>
      <div className={`mt-2 ${style.text}`}>
        {formatTextWithMarkdown(content)}
      </div>
    </div>
  );
});

EmotionalMessage.displayName = 'EmotionalMessage';

// New component for suggested questions
const SuggestionMessage = memo(({ metadata }: { metadata?: MessageMetadata }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative rounded-lg p-4 bg-amber-50/80 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/30 shadow-sm">
      <div className="absolute -top-3 left-6 bg-amber-500/90 dark:bg-amber-600/90 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-sm">
        <Lightbulb className="w-4 h-4" />
        <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Câu Hỏi Liên Quan</span>
      </div>
      <div className="mt-2">
        {metadata?.suggestedQuestions?.map((suggestion, index) => (
          <div key={index} className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'} ${index > 0 ? 'mt-3' : ''}`}>
            <div className="flex-shrink-0 w-1 h-6 bg-gradient-to-b from-amber-400/60 via-amber-400/40 to-amber-400/60 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="text-amber-700/90 dark:text-amber-300/90 font-medium">
                {suggestion.pattern}
              </div>
              {suggestion.contexts.length > 0 && (
                <div className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/70">
                  {suggestion.contexts.join(' • ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SuggestionMessage.displayName = 'SuggestionMessage';

// New component for references
const ReferenceMessage = memo(({ metadata }: { metadata?: MessageMetadata }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative rounded-lg p-4 bg-purple-50/80 dark:bg-purple-900/10 border border-purple-200/60 dark:border-purple-700/30 shadow-sm">
      <div className="absolute -top-3 left-6 bg-purple-500/90 dark:bg-purple-600/90 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2 shadow-sm">
        <BookMarked className="w-4 h-4" />
        <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Tài Liệu Tham Khảo</span>
      </div>
      <div className="mt-2 space-y-3">
        {metadata?.references?.quran?.map((ref, index) => (
          <div key={`quran-${index}`} className="flex items-center space-x-2 text-purple-700/90 dark:text-purple-300/90">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{ref}</span>
          </div>
        ))}
        {metadata?.references?.hadith?.map((ref, index) => (
          <div key={`hadith-${index}`} className="flex items-center space-x-2 text-purple-700/90 dark:text-purple-300/90">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{ref}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

ReferenceMessage.displayName = 'ReferenceMessage';

// ==================== HOOKS ====================
const useMessageFormatter = (text: string) => {
  const messages = useMemo(() => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map(paragraph => ({
      type: detectMessageType(paragraph, {}),
      content: paragraph.trim()
    }));
  }, [text]);
  
  return messages;
};

const useMessageRenderer = () => {
  const isMobile = useIsMobile();
  
  const renderMessage = useCallback((message: MessageType, index: number) => {
    const { type, content, metadata } = message;
    
    switch (type) {
      case 'greeting':
        return <GreetingMessage key={index} content={content} />;
      case 'title':
        return <TitleMessage key={index} content={content} />;
      case 'quran':
        return <QuranMessage key={index} content={content} metadata={metadata} />;
      case 'emotional':
        return <EmotionalMessage key={index} content={content} metadata={metadata} />;
      case 'suggestion':
        return <SuggestionMessage key={index} metadata={metadata} />;
      case 'reference':
        return <ReferenceMessage key={index} metadata={metadata} />;
      // ... other cases ...
      default:
        return (
          <div key={index} className={`${isMobile ? 'leading-[1.5]' : 'leading-[1.6]'} text-[#000000] dark:text-[#FFFFFF] font-normal transition-colors duration-200`}>
            <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
              <div className={`flex-shrink-0 w-1 ${isMobile ? 'h-5' : 'h-6'} bg-gradient-to-b from-teal-400/60 via-emerald-400/40 to-blue-400/60 rounded-full mt-1 opacity-50`}></div>
              <div className={`flex-1 ${isMobile ? 'text-[1.0625rem]' : 'text-[1.25rem]'} break-words tracking-tight font-sf-pro antialiased subpixel-antialiased`}>
                {formatTextWithMarkdown(content)}
                {metadata?.contexts && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {metadata.contexts.map((ctx, i) => (
                      <span key={i} className="px-2 py-1 text-[0.875rem] bg-[#E5E5EA]/60 dark:bg-[#38383A]/40 rounded-full text-[#8E8E93] dark:text-[#8E8E93]">
                        {ctx}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  }, [isMobile]);

  return renderMessage;
};

// ==================== MAIN COMPONENT ====================
export const MessageFormatterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="message-formatter-provider">
      {children}
    </div>
  );
};

export const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const messages = useMessageFormatter(text);
  const renderMessage = useMessageRenderer();
  const isMobile = useIsMobile();

return (
  <div className={`${isMobile ? 'space-y-4 px-2' : 'space-y-6'} text-slate-800/90 dark:text-slate-200/90 relative`}>
    <IslamicPattern patternType="star" />

    {messages.map(renderMessage)}

    {/* Chân trang chúc phúc - tối ưu cho mobile */}
    <div className={`${isMobile ? 'mt-8 pt-4' : 'mt-12 pt-6'} border-t border-slate-300/40 dark:border-slate-700/50 relative`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 dark:via-amber-900/10 to-transparent rounded pointer-events-none"></div>
      
      <div className="text-center relative z-10">
        <div className={`inline-flex items-center ${isMobile ? 'space-x-2 px-4 py-2' : 'space-x-3 px-6 py-3'} bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-800/30 dark:to-orange-800/30 border border-amber-200/50 dark:border-amber-700/40 rounded-full shadow backdrop-blur-md ring-1 ring-amber-300/30 dark:ring-amber-700/20`}>
          <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-amber-700 dark:text-amber-200 tracking-wide`}>
            {isMobile ? 'Cầu xin Allah ban phúc lành cho bạn' : 'بارك الله فيكم - Cầu xin Allah ban phúc lành cho bạn'}
          </span>
        </div>

        <div className={`${isMobile ? 'mt-2 text-xs' : 'mt-3 text-sm'} text-slate-500/80 dark:text-slate-400/80 italic px-2`}>
          "والله أعلم" - Allah là Đấng biết rõ nhất.
        </div>
      </div>
    </div>
  </div>
);

};

// ==================== MAIN FORMATTER (Legacy) ====================
/**
 * Main message formatter component
 * Formats AI responses with Islamic context and intelligent features
 * @param {string} text - Text to format
 * @returns {React.ReactElement} Formatted message component
 */
export const formatAIResponse = (text: string): React.ReactElement => {
  return <FormattedMessage text={text} />;
};

// ==================== MOBILE-OPTIMIZED CUSTOM STYLES ====================
const addCustomStyles = () => {
  if (typeof document !== 'undefined' && !document.head.querySelector('style[data-islamic-formatter-mobile]')) {
    const style = document.createElement('style');
    style.setAttribute('data-islamic-formatter-mobile', 'true');
    style.textContent = `
      /* macOS-style system font stack */
      :root {
        --system-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --system-mono: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
      }

      /* macOS-style text rendering */
      .message-formatter-provider {
        font-family: var(--system-ui);
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        letter-spacing: -0.011em;
      }

      /* macOS-style scrolling */
      .message-formatter-provider {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }
      
      .message-formatter-provider::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .message-formatter-provider::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .message-formatter-provider::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      
      .message-formatter-provider::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }

      /* macOS-style transitions */
      * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* macOS-style focus */
      button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.5);
      }

      /* macOS-style hover effects */
      .hover-scale {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-scale:hover {
        transform: scale(1.05);
      }
      
      .hover-lift {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-2px);
      }

      /* macOS-style selection */
      ::selection {
        background-color: rgba(0, 122, 255, 0.2);
        color: inherit;
      }

      /* macOS-style button press */
      button:active {
        transform: scale(0.98);
      }

      /* macOS-style input focus */
      input:focus, textarea:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.5);
      }

      /* macOS-style code blocks */
      code {
        font-family: var(--system-mono);
        font-size: 0.9em;
        letter-spacing: -0.025em;
      }

      /* macOS-style links */
      a {
        text-decoration-skip-ink: auto;
        text-underline-offset: 0.2em;
      }

      /* macOS-style tooltips */
      [data-tooltip] {
        position: relative;
      }

      [data-tooltip]:before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 12px;
        border-radius: 4px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }

      [data-tooltip]:hover:before {
        opacity: 1;
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        * {
          transition-duration: 150ms;
        }
        
        button, a, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }

        /* iOS-style touch feedback */
        button:active, a:active {
          opacity: 0.7;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation: none !important;
          transition: none !important;
        }
      }

      /* Dark mode refinements */
      @media (prefers-color-scheme: dark) {
        ::selection {
          background-color: rgba(0, 122, 255, 0.3);
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        * {
          transition: none !important;
        }
        
        button:focus-visible {
          outline: 2px solid currentColor !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize styles
addCustomStyles();
export default formatAIResponse;