# 🤖 Muslim Việt AI - Production-Ready Islamic AI Assistant

## 🌟 **Overview**

Muslim Việt AI là một AI Assistant chuyên về Islam được thiết kế dành riêng cho cộng đồng Muslim Việt Nam. Hệ thống được xây dựng với các tính năng production-level như real-time WebSocket, streaming responses, Islamic context engine, và comprehensive analytics.

## 🚀 **Production Features**

### ✅ **Core Features (Production Ready)**

#### 1. **Real-time WebSocket Communication**
- **Bi-directional communication** với backend
- **Auto-reconnection** với exponential backoff
- **Heartbeat mechanism** để maintain connection
- **Connection status monitoring** với user feedback
- **Error handling và recovery** tự động

#### 2. **Streaming AI Responses**
- **Typewriter effect** như ChatGPT
- **Real-time character streaming** từ server
- **Smooth animations** với customizable speed
- **Stream completion detection** và handling
- **Fallback to regular responses** nếu streaming fail

#### 3. **Islamic Context Engine**
- **Vietnamese Islamic concepts** database
- **Automatic question analysis** cho Islamic context
- **Concept mapping** với keywords Vietnamese/English/Arabic
- **Context-aware responses** dựa trên Islamic knowledge
- **Relevance scoring** cho concepts và references

#### 4. **User Session Management**
- **Persistent authentication** với localStorage
- **Session expiration** và auto-renewal
- **User preferences** persistence
- **Conversation history** management
- **Subscription tiers** (Free/Premium/Scholar)

#### 5. **Analytics & Monitoring**
- **Real-time performance metrics**
- **Usage analytics** và user behavior tracking
- **System health monitoring**
- **Islamic insights** và learning patterns
- **Export capabilities** (JSON/CSV)

### 🚧 **In Progress**

#### 6. **Cloud Conversation Sync**
- Cross-device conversation synchronization
- Cloud storage integration
- Offline-first architecture

### 📋 **Planned Features**

#### 7. **Islamic Knowledge Graph**
- Semantic search capabilities
- Advanced Quran/Hadith integration
- Scholarly references system

#### 8. **Multi-language Support**
- Arabic text support
- English interface option
- RTL layout support

## 📁 **Architecture**

```
src/Pages/AI/
├── 🎯 Core Components
│   ├── AI.tsx                    # Original AI component
│   ├── AIEnhanced.tsx           # Production-ready enhanced version
│   ├── AIHeader.tsx             # Header với controls
│   ├── MessageList.tsx          # Message display
│   ├── InputArea.tsx            # Input với enhancements
│   └── WelcomeScreen.tsx        # Welcome interface
│
├── 🔧 Enhanced Hooks
│   ├── useWebSocket.ts          # WebSocket management
│   ├── useStreamingAI.ts        # Streaming AI responses
│   └── index.ts                 # Hook exports
│
├── 🏗️ Services
│   ├── IslamicContextEngine.ts  # Islamic knowledge processing
│   ├── UserSessionManager.ts    # User session management
│   ├── AnalyticsManager.ts      # Analytics & monitoring
│   └── index.ts                 # Service exports
│
├── 📊 Types
│   ├── ai.types.ts              # TypeScript definitions
│   └── index.ts                 # Type exports
│
├── 🎨 Context
│   ├── ThemeContext.tsx         # Theme management
│   └── index.ts                 # Context exports
│
└── 📚 Utils
    ├── messageFormatter.tsx     # Message formatting
    └── index.ts                 # Utility exports
```

## 🛠️ **Installation & Setup**

### 1. **Environment Variables**

```env
# AI Backend
VITE_API_URL_AI=https://mira-ai.fly.dev

# WebSocket (auto-generated from API URL)
# wss://mira-ai.fly.dev/ws

# Optional: Analytics endpoint
VITE_ANALYTICS_ENDPOINT=https://analytics.muslimviet.app
```

### 2. **Dependencies**

```bash
# Core dependencies
npm install @tanstack/react-query
npm install react-hot-toast

# WebSocket support (built-in)
# TypeScript support (built-in)
```

### 3. **Basic Usage**

```tsx
import { MiraAIEnhanced } from '@/Pages/AI';

function App() {
  return (
    <div className="app">
      <MiraAIEnhanced />
    </div>
  );
}
```

### 4. **Advanced Usage với Custom Configuration**

```tsx
import { 
  MiraAIEnhanced,
  IslamicContextEngine,
  UserSessionManager,
  AnalyticsManager 
} from '@/Pages/AI';

function App() {
  // Initialize services
  const islamicEngine = IslamicContextEngine.getInstance();
  const sessionManager = UserSessionManager.getInstance();
  const analytics = AnalyticsManager.getInstance();

  return (
    <div className="app">
      <MiraAIEnhanced />
    </div>
  );
}
```

## 🔧 **Configuration**

### **AI_CONFIG Constants**

```typescript
export const AI_CONFIG = {
  DEFAULT_API_URL: 'https://mira-ai.fly.dev',
  WEBSOCKET_RECONNECT_ATTEMPTS: 5,
  WEBSOCKET_RECONNECT_INTERVAL: 3000,
  HEARTBEAT_INTERVAL: 30000,
  STREAMING_TYPING_SPEED: 30,
  MAX_MESSAGE_LENGTH: 4000,
  MAX_CONVERSATION_HISTORY: 50,
  ANALYTICS_SYNC_INTERVAL: 300000,
  SESSION_TIMEOUT: 86400000,
} as const;
```

### **Feature Flags**

```typescript
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
```

## 📊 **Performance Metrics**

### **Real-time Monitoring**

```typescript
import { AnalyticsManager } from '@/Pages/AI';

const analytics = AnalyticsManager.getInstance();

// Get real-time dashboard data
const dashboardData = analytics.getDashboardData();

console.log('Performance:', dashboardData.performance);
console.log('Usage:', dashboardData.usage);
console.log('Islamic Insights:', dashboardData.islamic);
console.log('System Health:', dashboardData.systemHealth);
```

### **Key Performance Indicators**

- **Average Response Time**: < 2000ms
- **Streaming Speed**: > 50 characters/second
- **WebSocket Uptime**: > 99%
- **Error Rate**: < 1%
- **Cache Hit Rate**: > 80%

## 🕌 **Islamic Features**

### **Supported Islamic Concepts**

- **5 Pillars**: Shahada, Salah, Zakat, Sawm, Hajj
- **Core Concepts**: Tawhid, Dua, Quran, Hadith, Jihad
- **Vietnamese Keywords**: Cầu nguyện, từ thiện, hành hương, nhịn ăn, etc.
- **Arabic Terms**: صلاة, زكاة, حج, صوم, شهادة, etc.

### **Context Analysis**

```typescript
import { IslamicContextEngine } from '@/Pages/AI';

const engine = IslamicContextEngine.getInstance();
const analysis = engine.analyzeQuestion("Làm thế nào để cầu nguyện đúng cách?");

console.log('Primary Concepts:', analysis.primaryConcepts);
console.log('Context Type:', analysis.contextType);
console.log('Recommended Approach:', analysis.recommendedApproach);
```

## 🔐 **Security & Privacy**

### **Data Protection**
- **Local Storage**: Session data stored locally
- **No Sensitive Data**: Không lưu trữ thông tin nhạy cảm
- **Encrypted Communication**: HTTPS/WSS only
- **Session Expiration**: 24-hour timeout

### **User Privacy**
- **Anonymous Analytics**: Không track personal info
- **Opt-out Options**: User có thể disable analytics
- **Data Retention**: Limited conversation history
- **GDPR Compliant**: Tuân thủ quy định bảo mật

## 🚀 **Production Deployment**

### **Environment Setup**

```bash
# Production build
npm run build

# Environment variables
export VITE_API_URL_AI=https://mira-ai.fly.dev
export NODE_ENV=production
```

### **Performance Optimization**

- **Code Splitting**: Lazy loading components
- **Bundle Optimization**: Tree shaking enabled
- **Caching Strategy**: Aggressive caching cho static assets
- **CDN Integration**: Static assets served from CDN

### **Monitoring & Alerting**

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals tracking
- **Uptime Monitoring**: Pingdom/UptimeRobot
- **Analytics Dashboard**: Real-time metrics

## 📈 **Scaling Considerations**

### **Frontend Scaling**
- **CDN Distribution**: Global edge caching
- **Load Balancing**: Multiple frontend instances
- **Service Worker**: Offline capabilities
- **Progressive Web App**: Mobile app experience

### **Backend Integration**
- **WebSocket Scaling**: Socket.io clustering
- **Database Optimization**: Connection pooling
- **Caching Layer**: Redis integration
- **Rate Limiting**: Per-user request limits

## 🧪 **Testing**

### **Unit Tests**
```bash
npm run test:unit
```

### **Integration Tests**
```bash
npm run test:integration
```

### **E2E Tests**
```bash
npm run test:e2e
```

### **Performance Tests**
```bash
npm run test:performance
```

## 📚 **API Documentation**

### **WebSocket Events**

```typescript
// Client to Server
{
  type: 'ai_question',
  data: {
    question: string,
    context: ChatContext,
    userPreferences: UserPreferences,
    messageId: string,
    enableStreaming: boolean
  }
}

// Server to Client
{
  type: 'ai_stream' | 'ai_complete' | 'error',
  data: {
    content: string,
    metadata?: MessageMetadata,
    references?: References
  },
  messageId: string
}
```

### **REST API Endpoints**

```typescript
// Fallback HTTP endpoint
POST /api/islamic-question
{
  question: string,
  userContext: {
    chatContext: ChatContext,
    userPreferences: UserPreferences,
    skipCache: boolean
  }
}

Response:
{
  success: boolean,
  response: string,
  references?: References,
  context?: ContextAnalysis,
  responseTime: number,
  cached: boolean
}
```

## 🤝 **Contributing**

### **Development Setup**

```bash
# Clone repository
git clone https://github.com/muslimviet/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

### **Code Standards**

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### **Pull Request Process**

1. **Feature Branch**: Create từ `develop`
2. **Tests**: Ensure all tests pass
3. **Documentation**: Update README nếu cần
4. **Review**: Code review required
5. **Merge**: Squash and merge

## 📞 **Support**

### **Documentation**
- **API Docs**: https://docs.muslimviet.app
- **Component Storybook**: https://storybook.muslimviet.app
- **Changelog**: https://github.com/muslimviet/frontend/releases

### **Community**
- **Discord**: https://discord.gg/muslimviet
- **Telegram**: https://t.me/muslimviet
- **Email**: support@muslimviet.app

### **Issues**
- **Bug Reports**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Security Issues**: security@muslimviet.app

---

## 🎉 **Production Status**

### ✅ **Ready for Production**
- ✅ Real-time WebSocket Communication
- ✅ Streaming AI Responses
- ✅ Islamic Context Engine
- ✅ User Session Management
- ✅ Analytics & Monitoring

### 🚧 **In Development**
- 🚧 Cloud Conversation Sync
- 🚧 Advanced Caching

### 📋 **Roadmap**
- 📋 Islamic Knowledge Graph
- 📋 Multi-language Support
- 📋 Offline Mode
- 📋 Mobile App

**Muslim Việt AI** đã sẵn sàng cho production với các tính năng enterprise-level và performance optimization. Hệ thống được thiết kế để scale và maintain dễ dàng với architecture modular và comprehensive monitoring.

---

*Built with ❤️ for the Vietnamese Muslim Community*
