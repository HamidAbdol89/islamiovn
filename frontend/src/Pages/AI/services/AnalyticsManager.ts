import { toast } from '@/lib/toast';

export interface PerformanceMetrics {
  responseTime: number;
  messageLength: number;
  streamingSpeed: number; // characters per second
  connectionLatency: number;
  errorRate: number;
  cacheHitRate: number;
}

export interface UsageAnalytics {
  sessionId: string;
  userId?: string;
  timestamp: number;
  eventType: 'question_asked' | 'response_received' | 'conversation_started' | 'conversation_ended' | 'feature_used' | 'error_occurred';
  eventData: Record<string, any>;
  performance: PerformanceMetrics;
  userContext: {
    learningStyle: string;
    islamicLevel: string;
    language: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browserType: string;
  };
}

export interface SystemHealth {
  websocketStatus: 'connected' | 'disconnected' | 'reconnecting';
  apiResponseTime: number;
  errorCount: number;
  activeUsers: number;
  memoryUsage: number;
  cacheStatus: 'healthy' | 'degraded' | 'critical';
}

export interface AIInsights {
  popularTopics: Array<{ topic: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  islamicConcepts: Array<{ concept: string; frequency: number; userLevel: string }>;
  userSatisfaction: {
    averageRating: number;
    totalRatings: number;
    feedbackSentiment: 'positive' | 'neutral' | 'negative';
  };
  performanceTrends: {
    responseTimeImprovement: number;
    accuracyScore: number;
    streamingEfficiency: number;
  };
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private analytics: UsageAnalytics[] = [];
  private performanceBuffer: PerformanceMetrics[] = [];
  private systemHealth: SystemHealth = {
    websocketStatus: 'disconnected',
    apiResponseTime: 0,
    errorCount: 0,
    activeUsers: 0,
    memoryUsage: 0,
    cacheStatus: 'healthy'
  };
  private sessionStartTime: number = Date.now();
  private lastSyncTime: number = 0;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeAnalytics();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private initializeAnalytics(): void {
    // Load existing analytics from localStorage
    this.loadAnalytics();
    
    // Start periodic sync
    this.startPeriodicSync();
    
    // Monitor system performance
    this.startSystemMonitoring();
    
    console.log('📊 Analytics Manager initialized');
  }

  // Event Tracking
  public trackEvent(
    eventType: UsageAnalytics['eventType'],
    eventData: Record<string, any> = {},
    performance?: Partial<PerformanceMetrics>
  ): void {
    const analytics: UsageAnalytics = {
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      timestamp: Date.now(),
      eventType,
      eventData,
      performance: {
        responseTime: performance?.responseTime || 0,
        messageLength: performance?.messageLength || 0,
        streamingSpeed: performance?.streamingSpeed || 0,
        connectionLatency: performance?.connectionLatency || 0,
        errorRate: this.calculateErrorRate(),
        cacheHitRate: performance?.cacheHitRate || 0,
        ...performance
      },
      userContext: this.getUserContext()
    };

    this.analytics.push(analytics);
    this.performanceBuffer.push(analytics.performance);

    // Keep buffer size manageable
    if (this.performanceBuffer.length > 100) {
      this.performanceBuffer.splice(0, 50);
    }

    // Auto-save periodically
    if (this.analytics.length % 10 === 0) {
      this.saveAnalytics();
    }
  }

  // Performance Monitoring
  public recordResponseTime(responseTime: number, messageLength: number): void {
    this.trackEvent('response_received', {
      responseTime,
      messageLength,
      efficiency: messageLength / responseTime
    }, {
      responseTime,
      messageLength
    });
  }

  public recordStreamingMetrics(
    totalCharacters: number,
    streamingDuration: number,
    chunksReceived: number
  ): void {
    const streamingSpeed = totalCharacters / (streamingDuration / 1000); // chars per second
    
    this.trackEvent('feature_used', {
      feature: 'streaming_response',
      totalCharacters,
      streamingDuration,
      chunksReceived,
      streamingSpeed
    }, {
      streamingSpeed,
      messageLength: totalCharacters
    });
  }

  public recordError(error: string, context: Record<string, any> = {}): void {
    this.systemHealth.errorCount++;
    
    this.trackEvent('error_occurred', {
      error,
      context,
      timestamp: Date.now()
    });

    // Show user-friendly error analytics
    if (this.systemHealth.errorCount > 5) {
      toast.warning('⚠️ Phát hiện nhiều lỗi', {
        description: 'Hệ thống đang gặp sự cố, vui lòng thử lại',
        duration: 5000
      });
    }
  }

  // System Health Monitoring
  public updateSystemHealth(health: Partial<SystemHealth>): void {
    this.systemHealth = {
      ...this.systemHealth,
      ...health,
    };

    // Alert on critical issues
    if (health.apiResponseTime && health.apiResponseTime > 10000) {
      toast.error('🐌 API phản hồi chậm', {
        description: `Thời gian phản hồi: ${health.apiResponseTime}ms`,
        duration: 3000
      });
    }

    if (health.cacheStatus === 'critical') {
      toast.warning('💾 Cache gặp sự cố', {
        description: 'Hiệu suất có thể bị ảnh hưởng',
        duration: 4000
      });
    }
  }

  public getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  // Analytics Insights
  public getPerformanceInsights(): {
    averageResponseTime: number;
    averageStreamingSpeed: number;
    errorRate: number;
    cacheHitRate: number;
    performanceTrend: 'improving' | 'stable' | 'degrading';
  } {
    if (this.performanceBuffer.length === 0) {
      return {
        averageResponseTime: 0,
        averageStreamingSpeed: 0,
        errorRate: 0,
        cacheHitRate: 0,
        performanceTrend: 'stable'
      };
    }

    const recent = this.performanceBuffer.slice(-20); // Last 20 measurements
    const older = this.performanceBuffer.slice(-40, -20); // Previous 20 measurements

    const avgResponseTime = recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;
    const avgStreamingSpeed = recent.reduce((sum, m) => sum + m.streamingSpeed, 0) / recent.length;
    const errorRate = recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length;
    const cacheHitRate = recent.reduce((sum, m) => sum + m.cacheHitRate, 0) / recent.length;

    // Calculate trend
    let performanceTrend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (older.length > 0) {
      const olderAvgResponseTime = older.reduce((sum, m) => sum + m.responseTime, 0) / older.length;
      const improvement = (olderAvgResponseTime - avgResponseTime) / olderAvgResponseTime;
      
      if (improvement > 0.1) performanceTrend = 'improving';
      else if (improvement < -0.1) performanceTrend = 'degrading';
    }

    return {
      averageResponseTime: Math.round(avgResponseTime),
      averageStreamingSpeed: Math.round(avgStreamingSpeed),
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      performanceTrend
    };
  }

  public getUsageInsights(): {
    totalSessions: number;
    totalQuestions: number;
    averageSessionDuration: number;
    mostPopularFeatures: Array<{ feature: string; usage: number }>;
    peakUsageHours: number[];
  } {
    const sessions = new Set(this.analytics.map(a => a.sessionId));
    const questions = this.analytics.filter(a => a.eventType === 'question_asked');
    const features = this.analytics.filter(a => a.eventType === 'feature_used');

    // Calculate session durations
    const sessionDurations: Record<string, number> = {};
    sessions.forEach(sessionId => {
      const sessionEvents = this.analytics.filter(a => a.sessionId === sessionId);
      if (sessionEvents.length > 0) {
        const start = Math.min(...sessionEvents.map(e => e.timestamp));
        const end = Math.max(...sessionEvents.map(e => e.timestamp));
        sessionDurations[sessionId] = end - start;
      }
    });

    const avgSessionDuration = Object.values(sessionDurations).reduce((sum, duration) => sum + duration, 0) / sessions.size;

    // Most popular features
    const featureUsage: Record<string, number> = {};
    features.forEach(f => {
      const feature = f.eventData.feature || 'unknown';
      featureUsage[feature] = (featureUsage[feature] || 0) + 1;
    });

    const mostPopularFeatures = Object.entries(featureUsage)
      .map(([feature, usage]) => ({ feature, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    // Peak usage hours
    const hourlyUsage: Record<number, number> = {};
    this.analytics.forEach(a => {
      const hour = new Date(a.timestamp).getHours();
      hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
    });

    const peakUsageHours = Object.entries(hourlyUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      totalSessions: sessions.size,
      totalQuestions: questions.length,
      averageSessionDuration: Math.round(avgSessionDuration / 1000 / 60), // minutes
      mostPopularFeatures,
      peakUsageHours
    };
  }

  public getIslamicInsights(): {
    popularConcepts: Array<{ concept: string; frequency: number }>;
    learningPatterns: Array<{ level: string; topics: string[] }>;
    questionComplexity: { simple: number; intermediate: number; advanced: number };
  } {
    const islamicEvents = this.analytics.filter(a => 
      a.eventData.islamicConcepts || a.eventData.islamicAnalysis
    );

    // Extract concepts
    const conceptFrequency: Record<string, number> = {};
    islamicEvents.forEach(event => {
      const concepts = event.eventData.islamicConcepts || [];
      concepts.forEach((concept: string) => {
        conceptFrequency[concept] = (conceptFrequency[concept] || 0) + 1;
      });
    });

    const popularConcepts = Object.entries(conceptFrequency)
      .map(([concept, frequency]) => ({ concept, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Learning patterns by level
    const learningPatterns: Record<string, Set<string>> = {
      beginner: new Set(),
      intermediate: new Set(),
      advanced: new Set()
    };

    islamicEvents.forEach(event => {
      const level = event.userContext.islamicLevel;
      const topics = event.eventData.topics || [];
      topics.forEach((topic: string) => {
        if (learningPatterns[level]) {
          learningPatterns[level].add(topic);
        }
      });
    });

    const learningPatternsArray = Object.entries(learningPatterns).map(([level, topicsSet]) => ({
      level,
      topics: Array.from(topicsSet).slice(0, 5)
    }));

    // Question complexity
    const complexity = { simple: 0, intermediate: 0, advanced: 0 };
    islamicEvents.forEach(event => {
      const complexityLevel = event.eventData.islamicAnalysis?.complexityLevel;
      if (complexityLevel && complexity[complexityLevel as keyof typeof complexity] !== undefined) {
        complexity[complexityLevel as keyof typeof complexity]++;
      }
    });

    return {
      popularConcepts,
      learningPatterns: learningPatternsArray,
      questionComplexity: complexity
    };
  }

  // Real-time Dashboard Data
  public getDashboardData(): {
    performance: ReturnType<typeof this.getPerformanceInsights>;
    usage: ReturnType<typeof this.getUsageInsights>;
    islamic: ReturnType<typeof this.getIslamicInsights>;
    systemHealth: SystemHealth;
    realTimeStats: {
      currentUsers: number;
      questionsPerMinute: number;
      averageResponseTime: number;
      errorRate: number;
    };
  } {
    const now = Date.now();
    const lastMinute = now - 60000;
    const recentEvents = this.analytics.filter(a => a.timestamp > lastMinute);
    const recentQuestions = recentEvents.filter(a => a.eventType === 'question_asked');
    const recentErrors = recentEvents.filter(a => a.eventType === 'error_occurred');

    return {
      performance: this.getPerformanceInsights(),
      usage: this.getUsageInsights(),
      islamic: this.getIslamicInsights(),
      systemHealth: this.getSystemHealth(),
      realTimeStats: {
        currentUsers: new Set(recentEvents.map(e => e.sessionId)).size,
        questionsPerMinute: recentQuestions.length,
        averageResponseTime: this.getPerformanceInsights().averageResponseTime,
        errorRate: recentErrors.length / Math.max(recentEvents.length, 1)
      }
    };
  }

  // Export & Reporting
  public exportAnalytics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        analytics: this.analytics,
        systemHealth: this.systemHealth,
        insights: {
          performance: this.getPerformanceInsights(),
          usage: this.getUsageInsights(),
          islamic: this.getIslamicInsights()
        },
        exportedAt: Date.now()
      }, null, 2);
    } else {
      // CSV format
      const headers = ['timestamp', 'eventType', 'responseTime', 'messageLength', 'errorRate'];
      const rows = this.analytics.map(a => [
        new Date(a.timestamp).toISOString(),
        a.eventType,
        a.performance.responseTime,
        a.performance.messageLength,
        a.performance.errorRate
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }

  // Private Methods
  private getSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    // Get from UserSessionManager if available
    try {
      const session = localStorage.getItem('muslimviet_user_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.userId;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return undefined;
  }

  private getUserContext(): UsageAnalytics['userContext'] {
    return {
      learningStyle: 'balanced', // Default, should be from user session
      islamicLevel: 'beginner',
      language: 'vi',
      deviceType: this.getDeviceType(),
      browserType: this.getBrowserType()
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowserType(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private calculateErrorRate(): number {
    const recentEvents = this.analytics.slice(-50); // Last 50 events
    const errors = recentEvents.filter(e => e.eventType === 'error_occurred');
    return recentEvents.length > 0 ? errors.length / recentEvents.length : 0;
  }

  private loadAnalytics(): void {
    try {
      const stored = localStorage.getItem('analytics_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.analytics = data.analytics || [];
        this.systemHealth = data.systemHealth || this.systemHealth;
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  private saveAnalytics(): void {
    try {
      // Keep only last 1000 analytics entries to prevent storage bloat
      const analyticsToSave = this.analytics.slice(-1000);
      
      localStorage.setItem('analytics_data', JSON.stringify({
        analytics: analyticsToSave,
        systemHealth: this.systemHealth,
        lastSaved: Date.now()
      }));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  private startPeriodicSync(): void {
    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.saveAnalytics();
      this.lastSyncTime = Date.now();
    }, 5 * 60 * 1000);
  }

  private startSystemMonitoring(): void {
    // Monitor system performance every 30 seconds
    setInterval(() => {
      this.updateSystemHealth({
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        activeUsers: new Set(
          this.analytics
            .filter(a => a.timestamp > Date.now() - 300000) // Last 5 minutes
            .map(a => a.sessionId)
        ).size
      });
    }, 30000);
  }

  // Cleanup
  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.saveAnalytics();
  }
}

export default AnalyticsManager;
