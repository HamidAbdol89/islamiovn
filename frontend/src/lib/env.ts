// Environment configuration utility
export const ENV = {
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  
  // API URLs with fallbacks
  AI_API_URL: import.meta.env.DEV 
    ? (import.meta.env.VITE_API_URL_AI_DEV || 'http://localhost:8000')
    : (import.meta.env.VITE_API_URL_AI || 'https://mira-ai.fly.dev'),
    
  // WebSocket URLs
  WS_URL: import.meta.env.DEV
    ? (import.meta.env.VITE_WS_URL_DEV || 'ws://localhost:8000')
    : (import.meta.env.VITE_WS_URL || 'wss://mira-ai.fly.dev'),
    
  // Debug settings
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true' || import.meta.env.DEV,
} as const;

// Helper functions
export const getApiUrl = (endpoint: string = ''): string => {
  const baseUrl = ENV.AI_API_URL;
  return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}` : baseUrl;
};

export const getWebSocketUrl = (path: string = ''): string => {
  const baseUrl = ENV.WS_URL;
  return path ? `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}` : baseUrl;
};

// Development helpers
export const log = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.log('[DEV]', ...args);
  }
};

export const logError = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.error('[DEV ERROR]', ...args);
  }
};

export const logWarn = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.warn('[DEV WARN]', ...args);
  }
};

// Environment info for debugging
export const getEnvInfo = () => ({
  mode: ENV.mode,
  isDev: ENV.isDevelopment,
  isProd: ENV.isProduction,
  apiUrl: ENV.AI_API_URL,
  wsUrl: ENV.WS_URL,
  debug: ENV.DEBUG_MODE,
  logging: ENV.ENABLE_LOGGING,
});
