import { useState, useCallback, useRef } from 'react';
import { useWebSocket, type WebSocketMessage } from './useWebSocket';
import { toast } from '@/lib/toast';
import type { Message, ChatContext, UserPreferences } from '../types/ai.types';

export interface StreamingMessage extends Message {
  isStreaming?: boolean;
  streamingContent?: string;
  isComplete?: boolean;
}

export interface UseStreamingAIOptions {
  apiBaseUrl: string;
  onMessageComplete?: (message: StreamingMessage) => void;
  onStreamingUpdate?: (message: StreamingMessage) => void;
  onError?: (error: string) => void;
}

export interface UseStreamingAIReturn {
  messages: StreamingMessage[];
  isConnected: boolean;
  connectionStatus: string;
  isStreaming: boolean;
  sendQuestion: (question: string, context?: ChatContext, userPreferences?: UserPreferences) => void;
  clearMessages: () => void;
  reconnect: () => void;
}

export const useStreamingAI = (options: UseStreamingAIOptions): UseStreamingAIReturn => {
  const { apiBaseUrl, onMessageComplete, onStreamingUpdate, onError } = options;
  
  const [messages, setMessages] = useState<StreamingMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const currentStreamingMessageRef = useRef<string | null>(null);
  const streamingContentRef = useRef<string>('');

  // WebSocket URL - replace http with ws
  const wsUrl = apiBaseUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'ai_stream':
        // Streaming content chunk
        if (currentStreamingMessageRef.current) {
          const chunk = message.data.content || '';
          streamingContentRef.current += chunk;
          
          setMessages(prev => prev.map(msg => 
            msg.id === currentStreamingMessageRef.current
              ? {
                  ...msg,
                  streamingContent: streamingContentRef.current,
                  content: streamingContentRef.current,
                  isStreaming: true
                }
              : msg
          ));

          // Notify streaming update
          const updatedMessage = messages.find(m => m.id === currentStreamingMessageRef.current);
          if (updatedMessage) {
            onStreamingUpdate?.({
              ...updatedMessage,
              streamingContent: streamingContentRef.current,
              content: streamingContentRef.current,
              isStreaming: true
            });
          }
        }
        break;

      case 'ai_complete':
        // Streaming complete
        if (currentStreamingMessageRef.current) {
          const finalContent = message.data.content || streamingContentRef.current;
          const metadata = message.data.metadata;
          const references = message.data.references;

          setMessages(prev => prev.map(msg => 
            msg.id === currentStreamingMessageRef.current
              ? {
                  ...msg,
                  content: finalContent,
                  streamingContent: finalContent,
                  isStreaming: false,
                  isComplete: true,
                  metadata: metadata,
                  references: references
                }
              : msg
          ));

          // Notify completion
          const completedMessage = messages.find(m => m.id === currentStreamingMessageRef.current);
          if (completedMessage) {
            onMessageComplete?.({
              ...completedMessage,
              content: finalContent,
              streamingContent: finalContent,
              isStreaming: false,
              isComplete: true,
              metadata: metadata
            });
          }

          // Reset streaming state
          currentStreamingMessageRef.current = null;
          streamingContentRef.current = '';
          setIsStreaming(false);

          toast.success('🤖 AI đã hoàn thành phản hồi', {
            duration: 2000
          });
        }
        break;

      case 'ai_response':
        // Non-streaming response (fallback)
        const aiMessage: StreamingMessage = {
          id: generateId(),
          type: 'ai',
          content: message.data.response || 'Xin lỗi, tôi không thể xử lý câu hỏi này.',
          timestamp: new Date(),
          isStreaming: false,
          isComplete: true,
          metadata: message.data.metadata
        };

        setMessages(prev => [...prev, aiMessage]);
        onMessageComplete?.(aiMessage);
        setIsStreaming(false);
        break;

      case 'error':
        console.error('WebSocket AI Error:', message.data);
        onError?.(message.data.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
        setIsStreaming(false);
        
        toast.error('❌ Lỗi AI', {
          description: message.data.message || 'Vui lòng thử lại',
          duration: 5000
        });
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }, [messages, onMessageComplete, onStreamingUpdate, onError]);

  // WebSocket connection
  const {
    isConnected,
    connectionStatus,
    sendMessage,
    reconnect
  } = useWebSocket({
    url: wsUrl,
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log('🤖 AI WebSocket connected');
    },
    onDisconnect: () => {
      console.log('🤖 AI WebSocket disconnected');
      setIsStreaming(false);
    },
    onError: (error) => {
      console.error('AI WebSocket error:', error);
      setIsStreaming(false);
    }
  });

  // Send question to AI
  const sendQuestion = useCallback((
    question: string, 
    context?: ChatContext, 
    userPreferences?: UserPreferences
  ) => {
    if (!isConnected) {
      toast.error('❌ Chưa kết nối WebSocket', {
        description: 'Vui lòng chờ kết nối hoặc thử lại',
        duration: 3000
      });
      return;
    }

    if (isStreaming) {
      toast.warning('⏳ AI đang xử lý câu hỏi khác', {
        description: 'Vui lòng chờ hoàn thành',
        duration: 2000
      });
      return;
    }

    // Add user message
    const userMessage: StreamingMessage = {
      id: generateId(),
      type: 'user',
      content: question,
      timestamp: new Date(),
      isStreaming: false,
      isComplete: true
    };

    setMessages(prev => [...prev, userMessage]);

    // Create AI message placeholder for streaming
    const aiMessageId = generateId();
    const aiMessage: StreamingMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      isComplete: false,
      streamingContent: ''
    };

    setMessages(prev => [...prev, aiMessage]);

    // Set streaming state
    currentStreamingMessageRef.current = aiMessageId;
    streamingContentRef.current = '';
    setIsStreaming(true);

    // Send question via WebSocket
    sendMessage({
      type: 'ai_question',
      data: {
        question,
        context: context || {},
        userPreferences: userPreferences || {},
        messageId: aiMessageId,
        enableStreaming: true
      }
    });

    toast.info('🤖 AI đang suy nghĩ...', {
      duration: 1500
    });
  }, [isConnected, isStreaming, sendMessage]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    currentStreamingMessageRef.current = null;
    streamingContentRef.current = '';
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isConnected,
    connectionStatus,
    isStreaming,
    sendQuestion,
    clearMessages,
    reconnect
  };
};

export default useStreamingAI;
