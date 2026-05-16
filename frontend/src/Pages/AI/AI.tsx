import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import './styles/AI.css';
// Import các components đã chia
import AIHeader from '@/Pages/AI/AIHeader';
import WelcomeScreen from '@/Pages/AI/WelcomeScreen';
import MessageList from '@/Pages/AI/MessageList';
import InputArea from '@/Pages/AI/InputArea';
import AIRobotLoading from '@/Pages/AI/ResponseLoading';
import type { MessageMetadata } from '@/Pages/AI/types/ai.types';
// Add type declarations for external modules
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { ThemeProvider } from '@/Pages/AI/context-custom/ThemeContext';
import { getApiUrl, ENV, log } from '@/lib/env';

// Import types
import type { 
  Message, 
  ApiResponse, 
  ChatContext, 
  UserPreferences,
  FavoriteQuestion,
  ChatExport,
  EmotionAnalysis,
} from '@/Pages/AI/types/ai.types';

const MiraAI: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredLanguage: 'vi',
    learningStyle: 'balanced',
    topics: new Set(),
    lastInteraction: Date.now()
  });
  const [chatContext, setChatContext] = useState<ChatContext>({});
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const lastETag = useRef<string>('');
  
  const API_BASE_URL = getApiUrl();

  // Development logging
  useEffect(() => {
    if (ENV.isDevelopment) {
      log('🤖 MiraAI initialized in development mode');
      log('API URL:', API_BASE_URL);
      log('Environment:', ENV.mode);
    }
  }, [API_BASE_URL]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure content is rendered

    return () => clearTimeout(timeoutId);
  }, [messages, loading, scrollToBottom]);

  // Update chat context based on message history and learning system
  useEffect(() => {
    if (messages.length > 0) {
      const lastAIMessage = [...messages].reverse().find(m => m.type === 'ai');
      if (lastAIMessage?.metadata) {
        // Only update if the context has actually changed
        const newContext: Partial<ChatContext> = {
          previousContexts: lastAIMessage.metadata.contexts,
          emotionalState: lastAIMessage.metadata.emotionalState,
          culturalContext: lastAIMessage.metadata.culturalContext,
          learningStyle: lastAIMessage.metadata.learningStyle,
          complexityLevel: lastAIMessage.metadata.complexityLevel
        };

        // Compare with current context to avoid unnecessary updates
        const hasContextChanged = (
          newContext.previousContexts?.join(',') !== chatContext.previousContexts?.join(',') ||
          newContext.emotionalState !== chatContext.emotionalState ||
          newContext.culturalContext !== chatContext.culturalContext ||
          newContext.learningStyle !== chatContext.learningStyle ||
          newContext.complexityLevel !== chatContext.complexityLevel
        );

        if (hasContextChanged) {
          setChatContext(prev => ({
            ...prev,
            ...newContext
          }));
        }
        
        // Update emotion and related topics
        if (lastAIMessage.metadata.emotionalState) {
          setCurrentEmotion({
            primary: lastAIMessage.metadata.emotionalState,
            intensity: lastAIMessage.metadata.intensity || 0.5
          });
        }
      }
    }
  }, [messages, chatContext.previousContexts, chatContext.emotionalState, chatContext.culturalContext, chatContext.learningStyle, chatContext.complexityLevel]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('aiFavorites');
    console.log('Loading favorites from localStorage:', savedFavorites);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        console.log('Parsed favorites:', parsedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    console.log('Saving favorites to localStorage:', favorites);
    localStorage.setItem('aiFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleQuestionChange = (value: string): void => {
    setQuestion(value);
  };

  // Enhanced handleSubmit with all backend features
  const handleSubmit = async (questionToSubmit?: string): Promise<void> => {
    const finalQuestion = questionToSubmit || question.trim();
    if (!finalQuestion) {
      setError('Vui lòng nhập câu hỏi của bạn');
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: finalQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setQuestion('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/islamic-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=3600',
          'If-None-Match': lastETag.current
        },
        body: JSON.stringify({ 
          question: userMessage.content,
          userContext: {
            ...chatContext,
            userPreferences,
            skipCache: false
          }
        }),
      });

      // Handle cache hit
      if (response.status === 304) {
        const cachedData = queryClient.getQueryData(['ai-chat', userMessage.content]);
        if (cachedData) {
          handleAIResponse(cachedData as ApiResponse, finalQuestion);
          return;
        }
      }

      // Get ETag for future requests
      const etag = response.headers.get('ETag');
      if (etag) lastETag.current = etag;

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data.error === 'string' 
          ? data.error 
          : data.error?.message || 'Có lỗi xảy ra khi xử lý yêu cầu';
        throw new Error(errorMessage);
      }

      handleAIResponse(data, finalQuestion);
      
    } catch (err) {
      handleError(err as ApiResponse['error'], messages[messages.length - 1]);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI response with all metadata
  const handleAIResponse = (data: ApiResponse, questionText: string) => {
    // Update user preferences based on AI response
    if (data.intelligence?.relatedTopics) {
      const newTopics = new Set(userPreferences.topics);
      data.intelligence.relatedTopics.forEach(topic => {
        if (topic.relevance > 0.5 && topic.contexts) {
          topic.contexts.forEach(ctx => newTopics.add(ctx));
        }
      });
      setUserPreferences(prev => ({
        ...prev,
        topics: newTopics,
        lastInteraction: Date.now()
      }));
    }

    // Create enhanced metadata with safe access
    const metadata: MessageMetadata = {
      emotionalState: data.intelligence?.emotionalState || 'neutral',
      urgencyLevel: data.intelligence?.urgencyLevel || 'normal',
      complexityLevel: data.intelligence?.complexityLevel || 'medium',
      culturalContext: data.contexts?.includes('vietnamese') ? 'vietnamese' : 
                      data.contexts?.includes('islamic') ? 'islamic' : 'general',
      learningStyle: userPreferences.learningStyle,
      contexts: data.contexts || [],
      isPersonalQuestion: data.contexts?.includes('personal') || false,
      isUrgentQuestion: data.intelligence?.urgencyLevel === 'high',
      isComplexQuestion: data.intelligence?.complexityLevel === 'high',
      requiresDetailedAnswer: userPreferences.learningStyle === 'detailed',
      hasCulturalContext: data.contexts?.some(ctx => ['vietnamese', 'islamic'].includes(ctx)) || false,
      intensity: 0.5, // Default intensity
      scores: {},
      references: {
        quran: data.intelligence?.references?.quran || [],
        hadith: data.intelligence?.references?.hadith || []
      },
      relatedTopics: data.intelligence?.relatedTopics || [],
      fromCache: data.fromCache,
      cacheInfo: data.cacheInfo,
      responseTime: data.responseTime,
      usageStats: data.usageStats,
      intelligence: data.intelligence
    };

    const aiMessage: Message = {
      id: generateId(),
      type: 'ai',
      content: data.response || 'Xin lỗi, tôi không thể xử lý câu hỏi này.',
      timestamp: new Date(),
      metadata
    };

    setMessages(prev => [...prev, aiMessage]);
    queryClient.setQueryData(['ai-chat', questionText], data);
    
    // Update current emotion
    if (data.intelligence) {
      setCurrentEmotion({
        primary: data.intelligence.emotionalState,
        intensity: data.intelligence.urgencyLevel === 'high' ? 0.8 : 0.5
      });
    }

    // Show appropriate toast based on emotion and urgency
    if (data.intelligence?.emotionalState === 'positive') {
      toast.success('Câu trả lời đã sẵn sàng!', {
        icon: '🤲',
        duration: 3000
      });
    } else if (data.intelligence?.urgencyLevel === 'high') {
      toast('Câu trả lời khẩn cấp đã sẵn sàng!', {
        icon: '⚡',
        duration: 2000
      });
    }
  };

  // Handle error with enhanced error handling
  const handleError = (error: unknown, userMessage?: Message) => {
    let errorDetails = {
      message: 'Có lỗi xảy ra khi xử lý yêu cầu',
      code: 'UNKNOWN_ERROR',
      suggestion: 'Vui lòng thử lại sau',
      retryAfter: 60
    };

    if (typeof error === 'string') {
      errorDetails.message = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as { message?: string; code?: string; suggestion?: string; retryAfter?: number };
      errorDetails = {
        message: errorObj.message || errorDetails.message,
        code: errorObj.code || errorDetails.code,
        suggestion: errorObj.suggestion || errorDetails.suggestion,
        retryAfter: errorObj.retryAfter || errorDetails.retryAfter
      };
    }

    setError(errorDetails.message);
    toast.error(errorDetails.message, {
      duration: 5000,
    });

    // Add error message to chat
    if (userMessage) {
      const errorMessage: Message = {
        id: generateId(),
        type: 'ai',
        content: `Xin lỗi, ${errorDetails.message}. ${errorDetails.suggestion}`,
        timestamp: new Date(),
        metadata: {
          emotionalState: 'negative',
          urgencyLevel: 'high',
          complexityLevel: 'low',
          culturalContext: 'general',
          learningStyle: userPreferences.learningStyle,
          contexts: ['error'],
          isPersonalQuestion: false,
          isUrgentQuestion: true,
          isComplexQuestion: false,
          requiresDetailedAnswer: false,
          hasCulturalContext: false,
          intensity: 0.8,
          scores: { negative: 0.8 },
          references: {},
          relatedTopics: []
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = (): void => {
    setMessages([]);
    setError('');
    setChatContext({});
  };

  const handleLearningStyleChange = (style: 'simple' | 'balanced' | 'detailed'): void => {
    setUserPreferences(prev => ({
      ...prev,
      learningStyle: style
    }));
  };

  // Handle favorite toggle: accept FavoriteQuestion
  const handleFavoriteToggle = (favorite: FavoriteQuestion) => {
    console.log('Toggling favorite:', favorite);
    setFavorites(prev => {
      const exists = prev.some(f => f.id === favorite.id);
      console.log('Favorite exists:', exists);
      if (exists) {
        return prev.filter(f => f.id !== favorite.id);
      }
      return [...prev, favorite];
    });
  };

  const handleShare = async (message: Message) => {
    try {
      const shareData = {
        title: 'Islam.io.vn AI Chat',
        text: message.content,
        url: window.location.href
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Không thể chia sẻ tin nhắn');
    }
  };

  // Handle export with enhanced metadata
  const handleExport = () => {
    const exportData: ChatExport = {
      messages,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      exportDate: new Date().toLocaleDateString('vi-VN'),
      totalMessages: messages.length,
      metadata: {
        userPreferences,
        chatContext
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `islamiovn-chat-${new Date().toISOString()}.json`);
  };

  return (
    <ThemeProvider>

    <div className="w-full min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AIHeader
          messages={messages}
          onClearChat={clearChat}
          userPreferences={userPreferences}
          onLearningStyleChange={handleLearningStyleChange}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onShare={handleShare}
          onExport={handleExport}
          currentEmotion={currentEmotion}
        />
      </div>
      
      <div className="flex-1 w-full relative flex flex-col pt-[72px] pb-[96px]">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {messages.length === 0 ? (
            <WelcomeScreen
              onQuestionSelect={(question) => handleSubmit(question)}
              userPreferences={userPreferences}
            />
          ) : (
            <MessageList
              messages={messages}
              loading={loading}
              onFavoriteToggle={(message: Message) => {
                const favorite: FavoriteQuestion = {
                  id: message.id,
                  question: message.type === 'user' ? message.content : '',
                  answer: message.type === 'ai' ? message.content : '',
                  timestamp: message.timestamp,
                  metadata: message.metadata
                };
                handleFavoriteToggle(favorite);
              }}
              onShare={handleShare}
              onExport={handleExport}
              currentEmotion={currentEmotion}
              onQuestionSelect={handleQuestionChange}
            />
          )}
          
          {loading && <AIRobotLoading />}
          <div ref={messagesEndRef}  />
        </div>
      </div>

      <div className="fixed bottom-[48px] left-0 right-0 z-50">
        <InputArea
          question={question}
          onQuestionChange={handleQuestionChange}
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          userPreferences={userPreferences}
          currentEmotion={currentEmotion}
        />
      </div>
      
    </div>
    </ThemeProvider>

  );
};

export default MiraAI;