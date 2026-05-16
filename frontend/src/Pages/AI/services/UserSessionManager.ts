import { toast } from '@/lib/toast';

export interface UserSession {
  id: string;
  userId: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: number;
  lastActiveAt: number;
  preferences: {
    language: 'vi' | 'en' | 'ar';
    learningStyle: 'simple' | 'balanced' | 'detailed';
    islamicLevel: 'beginner' | 'intermediate' | 'advanced';
    notifications: boolean;
    darkMode: boolean;
  };
  conversationHistory: {
    totalConversations: number;
    totalMessages: number;
    favoriteTopics: string[];
    lastConversationId?: string;
  };
  subscription: {
    type: 'free' | 'premium' | 'scholar';
    expiresAt?: number;
    features: string[];
  };
}

export interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  topics: string[];
  islamicConcepts: string[];
  summary: string;
  isBookmarked: boolean;
  tags: string[];
}

export class UserSessionManager {
  private static instance: UserSessionManager;
  private currentSession: UserSession | null = null;
  private sessionStorage = 'islamiovn_user_session';
  private conversationsStorage = 'islamiovn_conversations';

  private constructor() {
    this.loadSession();
  }

  public static getInstance(): UserSessionManager {
    if (!UserSessionManager.instance) {
      UserSessionManager.instance = new UserSessionManager();
    }
    return UserSessionManager.instance;
  }

  // Session Management
  public async createSession(userData: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<UserSession> {
    const session: UserSession = {
      id: `session_${Date.now()}`,
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      preferences: {
        language: 'vi',
        learningStyle: 'balanced',
        islamicLevel: 'beginner',
        notifications: true,
        darkMode: false
      },
      conversationHistory: {
        totalConversations: 0,
        totalMessages: 0,
        favoriteTopics: [],
      },
      subscription: {
        type: 'free',
        features: ['basic_ai', 'conversation_history', 'favorites']
      }
    };

    this.currentSession = session;
    this.saveSession();

    toast.success('🌟 Đã tạo phiên làm việc', {
      description: `Chào mừng ${userData.name}!`,
      duration: 3000
    });

    return session;
  }

  public getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  public updateLastActive(): void {
    if (this.currentSession) {
      this.currentSession.lastActiveAt = Date.now();
      this.saveSession();
    }
  }

  public updatePreferences(preferences: Partial<UserSession['preferences']>): void {
    if (this.currentSession) {
      this.currentSession.preferences = {
        ...this.currentSession.preferences,
        ...preferences
      };
      this.saveSession();

      toast.success('⚙️ Đã cập nhật tùy chọn', {
        duration: 2000
      });
    }
  }

  public logout(): void {
    this.currentSession = null;
    localStorage.removeItem(this.sessionStorage);
    
    toast.info('👋 Đã đăng xuất', {
      description: 'Hẹn gặp lại bạn!',
      duration: 2000
    });
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.sessionStorage);
      if (stored) {
        const session = JSON.parse(stored);
        
        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - session.lastActiveAt;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge < maxAge) {
          this.currentSession = session;
          this.updateLastActive();
        } else {
          // Session expired
          localStorage.removeItem(this.sessionStorage);
          toast.info('⏰ Phiên làm việc đã hết hạn', {
            description: 'Vui lòng đăng nhập lại',
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      localStorage.removeItem(this.sessionStorage);
    }
  }

  private saveSession(): void {
    if (this.currentSession) {
      try {
        localStorage.setItem(this.sessionStorage, JSON.stringify(this.currentSession));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }

  // Conversation History Management
  public saveConversation(conversation: {
    messages: any[];
    title?: string;
    topics?: string[];
    islamicConcepts?: string[];
  }): string {
    if (!this.currentSession) {
      toast.error('❌ Cần đăng nhập để lưu cuộc trò chuyện', {
        duration: 3000
      });
      return '';
    }

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const metadata: ConversationMetadata = {
      id: conversationId,
      title: conversation.title || this.generateConversationTitle(conversation.messages),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: conversation.messages.length,
      topics: conversation.topics || [],
      islamicConcepts: conversation.islamicConcepts || [],
      summary: this.generateConversationSummary(conversation.messages),
      isBookmarked: false,
      tags: []
    };

    // Save conversation data
    const conversationData = {
      metadata,
      messages: conversation.messages
    };

    try {
      const existingConversations = this.getConversations();
      existingConversations.push(conversationData);
      
      // Keep only last 50 conversations for free users
      const maxConversations = this.currentSession.subscription.type === 'free' ? 50 : 500;
      if (existingConversations.length > maxConversations) {
        existingConversations.splice(0, existingConversations.length - maxConversations);
      }

      localStorage.setItem(this.conversationsStorage, JSON.stringify(existingConversations));

      // Update session stats
      this.currentSession.conversationHistory.totalConversations++;
      this.currentSession.conversationHistory.totalMessages += conversation.messages.length;
      this.currentSession.conversationHistory.lastConversationId = conversationId;
      this.saveSession();

      toast.success('💾 Đã lưu cuộc trò chuyện', {
        description: metadata.title,
        duration: 2000
      });

      return conversationId;
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast.error('❌ Không thể lưu cuộc trò chuyện', {
        duration: 3000
      });
      return '';
    }
  }

  public getConversations(): any[] {
    try {
      const stored = localStorage.getItem(this.conversationsStorage);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  public getConversationById(id: string): any | null {
    const conversations = this.getConversations();
    return conversations.find(conv => conv.metadata.id === id) || null;
  }

  public deleteConversation(id: string): void {
    try {
      const conversations = this.getConversations();
      const filtered = conversations.filter(conv => conv.metadata.id !== id);
      localStorage.setItem(this.conversationsStorage, JSON.stringify(filtered));

      toast.success('🗑️ Đã xóa cuộc trò chuyện', {
        duration: 2000
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('❌ Không thể xóa cuộc trò chuyện', {
        duration: 3000
      });
    }
  }

  public bookmarkConversation(id: string, bookmarked: boolean = true): void {
    try {
      const conversations = this.getConversations();
      const conversation = conversations.find(conv => conv.metadata.id === id);
      
      if (conversation) {
        conversation.metadata.isBookmarked = bookmarked;
        conversation.metadata.updatedAt = Date.now();
        localStorage.setItem(this.conversationsStorage, JSON.stringify(conversations));

        toast.success(bookmarked ? '🔖 Đã đánh dấu' : '📝 Đã bỏ đánh dấu', {
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error bookmarking conversation:', error);
    }
  }

  public searchConversations(query: string): any[] {
    const conversations = this.getConversations();
    const lowerQuery = query.toLowerCase();

    return conversations.filter(conv => 
      conv.metadata.title.toLowerCase().includes(lowerQuery) ||
      conv.metadata.summary.toLowerCase().includes(lowerQuery) ||
      conv.metadata.topics.some((topic: string) => topic.toLowerCase().includes(lowerQuery)) ||
      conv.metadata.islamicConcepts.some((concept: string) => concept.toLowerCase().includes(lowerQuery)) ||
      conv.metadata.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Subscription Management
  public upgradeSubscription(type: 'premium' | 'scholar', expiresAt?: number): void {
    if (this.currentSession) {
      this.currentSession.subscription = {
        type,
        expiresAt,
        features: this.getSubscriptionFeatures(type)
      };
      this.saveSession();

      toast.success('🎉 Đã nâng cấp tài khoản', {
        description: `Chào mừng bạn đến với ${type}!`,
        duration: 5000
      });
    }
  }

  public hasFeature(feature: string): boolean {
    return this.currentSession?.subscription.features.includes(feature) || false;
  }

  private getSubscriptionFeatures(type: 'free' | 'premium' | 'scholar'): string[] {
    switch (type) {
      case 'premium':
        return [
          'basic_ai', 'conversation_history', 'favorites',
          'unlimited_questions', 'priority_support', 'advanced_analytics',
          'export_conversations', 'custom_themes'
        ];
      case 'scholar':
        return [
          'basic_ai', 'conversation_history', 'favorites',
          'unlimited_questions', 'priority_support', 'advanced_analytics',
          'export_conversations', 'custom_themes',
          'scholarly_references', 'advanced_islamic_context', 'research_tools',
          'multilingual_support', 'offline_access'
        ];
      default:
        return ['basic_ai', 'conversation_history', 'favorites'];
    }
  }

  // Utility methods
  private generateConversationTitle(messages: any[]): string {
    if (messages.length === 0) return 'Cuộc trò chuyện mới';
    
    const firstUserMessage = messages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50);
      return title.length < firstUserMessage.content.length ? title + '...' : title;
    }
    
    return 'Cuộc trò chuyện mới';
  }

  private generateConversationSummary(messages: any[]): string {
    const userMessages = messages.filter(msg => msg.type === 'user');
    const aiMessages = messages.filter(msg => msg.type === 'ai');
    
    return `${userMessages.length} câu hỏi, ${aiMessages.length} câu trả lời`;
  }

  // Analytics
  public getAnalytics(): {
    totalConversations: number;
    totalMessages: number;
    averageMessagesPerConversation: number;
    mostUsedTopics: string[];
    mostUsedIslamicConcepts: string[];
    sessionDuration: number;
  } {
    if (!this.currentSession) {
      return {
        totalConversations: 0,
        totalMessages: 0,
        averageMessagesPerConversation: 0,
        mostUsedTopics: [],
        mostUsedIslamicConcepts: [],
        sessionDuration: 0
      };
    }

    const conversations = this.getConversations();
    const allTopics: string[] = [];
    const allConcepts: string[] = [];

    conversations.forEach(conv => {
      allTopics.push(...conv.metadata.topics);
      allConcepts.push(...conv.metadata.islamicConcepts);
    });

    // Count frequency
    const topicCounts = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const conceptCounts = allConcepts.reduce((acc, concept) => {
      acc[concept] = (acc[concept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top 5
    const mostUsedTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    const mostUsedIslamicConcepts = Object.entries(conceptCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([concept]) => concept);

    return {
      totalConversations: this.currentSession.conversationHistory.totalConversations,
      totalMessages: this.currentSession.conversationHistory.totalMessages,
      averageMessagesPerConversation: this.currentSession.conversationHistory.totalConversations > 0 
        ? this.currentSession.conversationHistory.totalMessages / this.currentSession.conversationHistory.totalConversations 
        : 0,
      mostUsedTopics,
      mostUsedIslamicConcepts,
      sessionDuration: Date.now() - this.currentSession.createdAt
    };
  }
}

export default UserSessionManager;
