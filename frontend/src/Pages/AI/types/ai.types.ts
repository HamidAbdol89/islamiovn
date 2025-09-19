import type { ThemeColorPalette } from '@/Pages/AI/context-custom/ThemeContext';

// Message types
export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isFavorite?: boolean;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  emotionalState: 'positive' | 'negative' | 'neutral' | 'concerned';
  urgencyLevel: 'high' | 'medium' | 'normal' | 'low';
  complexityLevel: 'high' | 'medium' | 'low';
  culturalContext: 'vietnamese' | 'islamic' | 'general';
  learningStyle: 'detailed' | 'simple' | 'balanced';
  isPersonalQuestion: boolean;
  isUrgentQuestion: boolean;
  isComplexQuestion: boolean;
  requiresDetailedAnswer: boolean;
  hasCulturalContext: boolean;
  intensity: number;
  scores: Record<string, number>;
  contexts: string[];
  references?: {
    quran?: string[];
    hadith?: string[];
  };
  relatedTopics?: Array<{
    pattern: string;
    relevance: number;
    contexts?: string[];
  }>;
  fromCache?: boolean;
  cacheInfo?: string;
  responseTime?: number;
  avgResponseTime?: number;
  usageStats?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  intelligence?: {
    emotionalState: 'positive' | 'negative' | 'neutral' | 'concerned';
    urgencyLevel: 'high' | 'medium' | 'normal' | 'low';
    complexityLevel: 'high' | 'medium' | 'low';
    references?: {
      quran?: string[];
      hadith?: string[];
    };
    relatedTopics?: Array<{
      pattern: string;
      relevance: number;
      contexts?: string[];
    }>;
  };
}

export interface EmotionAnalysis {
  primary: 'positive' | 'negative' | 'neutral' | 'concerned';
  intensity: number;
}

export interface RelatedTopic {
  pattern: string;
  relevance: number;
  contexts: string[];
  emotion?: EmotionAnalysis;
}

export interface UserPreferences {
  preferredLanguage: string;
  learningStyle: 'detailed' | 'simple' | 'balanced';
  topics: Set<string>;
  lastInteraction: number;
}

export interface ChatContext {
  previousContexts?: string[];
  emotionalState?: 'positive' | 'negative' | 'neutral' | 'concerned';
  culturalContext?: 'vietnamese' | 'islamic' | 'general';
  learningStyle?: 'detailed' | 'simple' | 'balanced';
  complexityLevel?: 'high' | 'medium' | 'low';
}

export interface ApiResponse {
  reply: string;
  contexts?: string[];
  timestamp: string;
  model: string;
  provider: string;
  creator: string;
  responseTime: number;
  originalQuestion: string;
  fromCache?: boolean;
  cacheInfo?: string;
  usageStats?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  intelligence?: {
    emotionalState: 'positive' | 'negative' | 'neutral' | 'concerned';
    urgencyLevel: 'high' | 'medium' | 'normal' | 'low';
    complexityLevel: 'high' | 'medium' | 'low';
    references?: {
      quran?: string[];
      hadith?: string[];
    };
    relatedTopics?: Array<{
      pattern: string;
      relevance: number;
      contexts?: string[];
    }>;
  };
  error?: {
    message: string;
    code?: string;
    suggestion?: string;
    retryAfter?: number;
  };
}

export interface FavoriteQuestion {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  metadata?: MessageMetadata;
  categories?: string[]; // Thêm dòng này

}

export interface ChatExport {
  messages: Message[];
  timestamp: string;
  version: string;
  exportDate: string;
  totalMessages: number;
  metadata: {
    userPreferences: UserPreferences;
    chatContext: ChatContext;
  };
}

// Component Props Types
export interface AIMessageListProps {
  messages: Message[];
  loading?: boolean;
  onFavoriteToggle: (message: Message) => void;
  onShare: (message: Message) => Promise<void>;
  onExport: () => void;
  currentEmotion: EmotionAnalysis | null;
  onQuestionSelect: (value: string) => void;
  personalizedSuggestions?: Array<{
    pattern: string;
    relevance: number;
  }>;
}

export interface AIHeaderProps {
  messages: Message[];
  onClearChat: () => void;
  userPreferences: UserPreferences;
  onLearningStyleChange: (style: 'detailed' | 'simple' | 'balanced') => void;
  favorites: FavoriteQuestion[];
  onFavoriteToggle: (question: FavoriteQuestion) => void;
  onShare: (message: Message) => void;
  onExport?: () => void;
  currentEmotion?: EmotionAnalysis | null;
  relatedTopics?: RelatedTopic[];
  themeColors: ThemeColorPalette;
}

export interface EmotionIndicatorProps {
  emotion: 'positive' | 'negative' | 'neutral' | 'concerned';
  intensity: number;
  themeColors: ThemeColorPalette;
}

export interface ReferencesListProps {
  references: {
    quran: string[];
    hadith: string[];
  };
  themeColors: ThemeColorPalette;
}

export interface RelatedTopicsProps {
  topics: RelatedTopic[];
  themeColors: ThemeColorPalette;
  contexts?: string[]; // Thay vì contexts: string[];

}

export interface AIInputAreaProps {
  question: string;
  loading: boolean;
  error: string;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
  userPreferences: UserPreferences;
  themeColors: ThemeColorPalette;
  currentEmotion?: EmotionAnalysis | null;
  relatedTopics?: RelatedTopic[];
}