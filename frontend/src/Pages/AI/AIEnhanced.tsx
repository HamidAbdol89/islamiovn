import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './styles/AI.css';
import { getApiUrl, ENV, log } from '@/lib/env';

// Import enhanced hooks and services
import useStreamingAI, { type StreamingMessage } from './hooks/useStreamingAI';
import IslamicContextEngine from './services/IslamicContextEngine';
import { toast } from '@/lib/toast';

// Import existing components
import AIHeader from './AIHeader';
import WelcomeScreen from './WelcomeScreen';
// import MessageList from './MessageList'; // Not used in enhanced version
import InputArea from './InputArea';

// Import types
import type { 
  ChatContext, 
  UserPreferences,
  FavoriteQuestion,
  ChatExport,
  EmotionAnalysis,
} from './types/ai.types';

// Enhanced streaming message component
const StreamingMessageBubble: React.FC<{ message: StreamingMessage }> = React.memo(({ message }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect for streaming messages
  useEffect(() => {
    if (message.isStreaming && message.streamingContent) {
      const content = message.streamingContent;
      
      if (currentIndex < content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        }, 30); // 30ms delay for smooth typing effect

        return () => clearTimeout(timer);
      }
    } else if (!message.isStreaming) {
      setDisplayedContent(message.content);
      setCurrentIndex(message.content.length);
    }
  }, [message.streamingContent, message.isStreaming, currentIndex, message.content]);

  return (
    <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">
        {displayedContent}
        {message.isStreaming && (
          <span className="streaming-cursor animate-pulse">|</span>
        )}
      </div>
      
      {message.isStreaming && (
        <div className="streaming-indicator">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>AI đang trả lời...</span>
          </div>
        </div>
      )}
    </div>
  );
});

StreamingMessageBubble.displayName = 'StreamingMessageBubble';

const MiraAIEnhanced: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
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
  const islamicEngine = useRef<IslamicContextEngine | undefined>(undefined);

  const API_BASE_URL = getApiUrl();

  // Development logging
  useEffect(() => {
    if (ENV.isDevelopment) {
      log('🚀 MiraAI Enhanced initialized in development mode');
      log('API URL:', API_BASE_URL);
    }
  }, [API_BASE_URL]);

  // Initialize Islamic Context Engine
  useEffect(() => {
    islamicEngine.current = IslamicContextEngine.getInstance();
    islamicEngine.current.initialize();
  }, []);

  // Enhanced streaming AI hook
  const {
    messages,
    isConnected,
    connectionStatus,
    isStreaming,
    sendQuestion,
    clearMessages,
    reconnect
  } = useStreamingAI({
    apiBaseUrl: API_BASE_URL,
    onMessageComplete: (completedMessage) => {
      console.log('Message completed:', completedMessage);
      
      // Update emotion based on completed message
      if (completedMessage.metadata?.intelligence?.emotionalState) {
        setCurrentEmotion({
          primary: completedMessage.metadata.intelligence.emotionalState,
          intensity: completedMessage.metadata.intelligence.urgencyLevel === 'high' ? 0.8 : 0.5
        });
      }

      // Update chat context
      if (completedMessage.metadata) {
        setChatContext(prev => ({
          ...prev,
          previousContexts: completedMessage.metadata?.contexts,
          emotionalState: completedMessage.metadata?.emotionalState,
          culturalContext: completedMessage.metadata?.culturalContext,
          learningStyle: completedMessage.metadata?.learningStyle,
          complexityLevel: completedMessage.metadata?.complexityLevel
        }));
      }
    },
    onStreamingUpdate: () => {
      // Auto-scroll during streaming
      scrollToBottom();
    },
    onError: (error) => {
      setError(error);
      toast.error('❌ Lỗi AI', {
        description: error,
        duration: 5000
      });
    }
  });

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('aiFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('aiFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleQuestionChange = (value: string): void => {
    setQuestion(value);
    setError(''); // Clear error when user types
  };

  // Enhanced question submission with Islamic context analysis
  const handleSubmit = useCallback(async (questionToSubmit?: string): Promise<void> => {
    const finalQuestion = questionToSubmit || question.trim();
    if (!finalQuestion) {
      setError('Vui lòng nhập câu hỏi của bạn');
      toast.error('❌ Câu hỏi trống', {
        description: 'Vui lòng nhập câu hỏi trước khi gửi',
        duration: 3000
      });
      return;
    }

    if (!isConnected) {
      setError('Chưa kết nối WebSocket. Vui lòng thử lại.');
      toast.error('❌ Chưa kết nối', {
        description: 'Đang thử kết nối lại...',
        duration: 3000
      });
      reconnect();
      return;
    }

    if (isStreaming) {
      toast.warning('⏳ AI đang xử lý', {
        description: 'Vui lòng chờ AI hoàn thành câu trả lời hiện tại',
        duration: 2000
      });
      return;
    }

    // Analyze Islamic context
    let islamicContext = {};
    if (islamicEngine.current) {
      try {
        const analysis = islamicEngine.current.analyzeQuestion(finalQuestion);
        islamicContext = {
          islamicAnalysis: analysis,
          primaryConcepts: analysis.primaryConcepts.map(c => c.name),
          contextType: analysis.contextType,
          recommendedApproach: analysis.recommendedApproach,
          culturalContext: analysis.culturalContext
        };

        console.log('Islamic context analysis:', analysis);
        
        // Show context feedback to user
        if (analysis.primaryConcepts.length > 0) {
          const concepts = analysis.primaryConcepts.map(c => c.name).join(', ');
          toast.info('🕌 Islamic Context Detected', {
            description: `Concepts: ${concepts}`,
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Error analyzing Islamic context:', error);
      }
    }

    // Enhanced context with Islamic analysis
    const enhancedContext: ChatContext = {
      ...chatContext,
      ...islamicContext,
      questionAnalysis: {
        length: finalQuestion.length,
        hasQuestionMark: finalQuestion.includes('?'),
        language: finalQuestion.match(/[a-zA-Z]/) ? 'mixed' : 'vietnamese',
        timestamp: Date.now()
      }
    };

    // Clear input and send question
    setQuestion('');
    setError('');

    // Send via WebSocket streaming
    sendQuestion(finalQuestion, enhancedContext, userPreferences);

  }, [question, isConnected, isStreaming, chatContext, userPreferences, sendQuestion, reconnect]);

  const clearChat = (): void => {
    clearMessages();
    setError('');
    setChatContext({});
    setCurrentEmotion(null);
    
    toast.success('🧹 Đã xóa lịch sử chat', {
      duration: 2000
    });
  };

  const handleLearningStyleChange = (style: 'simple' | 'balanced' | 'detailed'): void => {
    setUserPreferences(prev => ({
      ...prev,
      learningStyle: style
    }));
    
    toast.info('📚 Đã cập nhật phong cách học', {
      description: `Chuyển sang chế độ: ${style}`,
      duration: 2000
    });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (favorite: FavoriteQuestion) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === favorite.id);
      if (exists) {
        return prev.filter(f => f.id !== favorite.id);
      }
      return [...prev, favorite];
    });
  };

  const handleShare = async (message: StreamingMessage) => {
    try {
      const shareData = {
        title: 'Muslim Việt AI Chat',
        text: message.content,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('🔗 Đã chia sẻ thành công', {
          duration: 2000
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${message.content}\n\n- Muslim Việt AI`);
        toast.success('📋 Đã sao chép vào clipboard', {
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('❌ Không thể chia sẻ', {
        duration: 3000
      });
    }
  };

  // Handle export with enhanced metadata
  const handleExport = () => {
    const exportData: ChatExport = {
      messages: messages.map(msg => ({
        ...msg,
        // Convert StreamingMessage to Message
        isFavorite: favorites.some(f => f.id === msg.id)
      })),
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      exportDate: new Date().toLocaleDateString('vi-VN'),
      totalMessages: messages.length,
      metadata: {
        userPreferences,
        chatContext,
        connectionInfo: {
          isConnected,
          connectionStatus,
          apiBaseUrl: API_BASE_URL
        },
        islamicContext: islamicEngine.current ? {
          conceptsAnalyzed: true,
          totalConcepts: islamicEngine.current.getAllConcepts().length
        } : null
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muslim-viet-ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('📁 Đã xuất lịch sử chat', {
      description: 'File JSON đã được tải xuống',
      duration: 3000
    });
  };

  // Connection status indicator
  const connectionStatusColor = useMemo(() => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'reconnecting': return 'text-orange-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }, [connectionStatus]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* Connection Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${connectionStatusColor}`}>
              {connectionStatus === 'connected' && '🟢 Real-time Connected'}
              {connectionStatus === 'connecting' && '🟡 Connecting...'}
              {connectionStatus === 'reconnecting' && '🟠 Reconnecting...'}
              {connectionStatus === 'disconnected' && '🔴 Disconnected'}
            </span>
          </div>
          
          {!isConnected && (
            <button
              onClick={reconnect}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Kết nối lại
            </button>
          )}
        </div>
      </div>

      {/* AI Header */}
      <div className="fixed top-12 left-0 right-0 z-40">
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
      
      {/* Chat Content */}
      <div className="flex-1 w-full relative flex flex-col pt-[120px] pb-[96px]">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4"
        >
          {messages.length === 0 ? (
            <WelcomeScreen
              onQuestionSelect={(question) => handleSubmit(question)}
              userPreferences={userPreferences}
            />
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <StreamingMessageBubble
                  key={message.id}
                  message={message}
                />
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto p-4">
          <InputArea
            question={question}
            onQuestionChange={handleQuestionChange}
            onSubmit={handleSubmit}
            error={error}
            loading={isStreaming}
            userPreferences={userPreferences}
            currentEmotion={currentEmotion}
          />
          
          {/* Streaming indicator */}
          {isStreaming && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>AI đang suy nghĩ và trả lời...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiraAIEnhanced;
