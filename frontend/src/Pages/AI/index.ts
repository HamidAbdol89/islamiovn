// Main AI Components
export { default as MiraAI } from './AI';
export { default as MiraAIEnhanced } from './AIEnhanced';

// Core Components
export { default as AIHeader } from './AIHeader';
export { default as WelcomeScreen } from './WelcomeScreen';
export { default as MessageList } from './MessageList';
export { default as InputArea } from './InputArea';
export { default as ResponseLoading } from './ResponseLoading';
export { default as ErrorMessage } from './components/ErrorMessage';
// export { default as EmotionIndicator } from './EmotionIndicator'; // Component not created yet

// Enhanced Hooks
export { default as useWebSocket } from './hooks/useWebSocket';
export { default as useStreamingAI } from './hooks/useStreamingAI';
export type { WebSocketMessage, UseWebSocketOptions, UseWebSocketReturn } from './hooks/useWebSocket';
export type { StreamingMessage, UseStreamingAIOptions, UseStreamingAIReturn } from './hooks/useStreamingAI';

// Services
export { default as IslamicContextEngine } from './services/IslamicContextEngine';
export { default as UserSessionManager } from './services/UserSessionManager';
export { default as AnalyticsManager } from './services/AnalyticsManager';

// Types
export type {
  Message,
  MessageMetadata,
  ApiResponse,
  ChatContext,
  UserPreferences,
  FavoriteQuestion,
  ChatExport,
  EmotionAnalysis,
  RelatedTopic
} from './types/ai.types';

export type {
  QuranReference,
  HadithReference,
  IslamicConcept,
  IslamicContextAnalysis
} from './services/IslamicContextEngine';

export type {
  UserSession,
  ConversationMetadata
} from './services/UserSessionManager';

export type {
  PerformanceMetrics,
  UsageAnalytics,
  SystemHealth,
  AIInsights
} from './services/AnalyticsManager';

// Context
export { default as ThemeContext } from './context-custom/ThemeContext';
export type { ThemeColorPalette } from './context-custom/ThemeContext';

// Utils
export { default as messageFormatter } from './utils/messageFormatter';

// Constants
export const AI_CONFIG = {
  DEFAULT_API_URL: 'https://mira-ai.fly.dev',
  WEBSOCKET_RECONNECT_ATTEMPTS: 5,
  WEBSOCKET_RECONNECT_INTERVAL: 3000,
  HEARTBEAT_INTERVAL: 30000,
  STREAMING_TYPING_SPEED: 30,
  MAX_MESSAGE_LENGTH: 4000,
  MAX_CONVERSATION_HISTORY: 50,
  ANALYTICS_SYNC_INTERVAL: 300000, // 5 minutes
  SESSION_TIMEOUT: 86400000, // 24 hours
} as const;

// Feature Flags
export const FEATURES = {
  WEBSOCKET_ENABLED: true,
  STREAMING_RESPONSES: true,
  ISLAMIC_CONTEXT_ENGINE: true,
  USER_SESSIONS: true,
  ANALYTICS: true,
  CONVERSATION_HISTORY: true,
  MULTILINGUAL: false, // Coming soon
  OFFLINE_MODE: false, // Coming soon
} as const;

// Production Ready Status
export const PRODUCTION_STATUS = {
  CORE_AI: '✅ Production Ready',
  WEBSOCKET: '✅ Production Ready',
  STREAMING: '✅ Production Ready',
  ISLAMIC_ENGINE: '✅ Production Ready',
  USER_SESSIONS: '✅ Production Ready',
  ANALYTICS: '✅ Production Ready',
  CONVERSATION_SYNC: '🚧 In Progress',
  KNOWLEDGE_GRAPH: '📋 Planned',
  MULTILINGUAL: '📋 Planned',
} as const;
