import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from '@/lib/toast';

export interface WebSocketMessage {
  type: 'ai_response' | 'ai_stream' | 'ai_complete' | 'error' | 'connection_status' | 'ai_question' | 'heartbeat' | 'heartbeat_response';
  data: any;
  messageId?: string;
  timestamp?: number;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  sendMessage: (message: WebSocketMessage) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions): UseWebSocketReturn => {
  const {
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>('disconnected');
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const isManualDisconnectRef = useRef(false);

  // Send heartbeat to keep connection alive
  const sendHeartbeat = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'heartbeat',
        timestamp: Date.now()
      }));
      
      heartbeatTimeoutRef.current = setTimeout(() => sendHeartbeat(), heartbeatInterval);
    }
  }, [socket, heartbeatInterval]);

  // Send message through WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        ...message,
        timestamp: Date.now()
      }));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
      toast.error('Kết nối WebSocket không khả dụng', {
        description: 'Đang thử kết nối lại...',
        duration: 3000
      });
    }
  }, [socket]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (isConnecting || (socket && socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');
    isManualDisconnectRef.current = false;

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setSocket(ws);
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus('connected');
        reconnectCountRef.current = 0;
        
        // Start heartbeat
        setTimeout(() => sendHeartbeat(), heartbeatInterval);
        
        onConnect?.();
        
        toast.success('🌐 Kết nối real-time thành công', {
          description: 'AI sẽ phản hồi nhanh hơn',
          duration: 2000
        });
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle heartbeat response
          if (message.type === 'heartbeat_response') {
            return;
          }
          
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setSocket(null);
        setIsConnected(false);
        setIsConnecting(false);
        
        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
          heartbeatTimeoutRef.current = null;
        }

        if (!isManualDisconnectRef.current && reconnectCountRef.current < reconnectAttempts) {
          setConnectionStatus('reconnecting');
          reconnectCountRef.current++;
          
          console.log(`🔄 Reconnecting... Attempt ${reconnectCountRef.current}/${reconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectCountRef.current); // Exponential backoff
          
          toast.info(`🔄 Đang kết nối lại... (${reconnectCountRef.current}/${reconnectAttempts})`, {
            duration: 2000
          });
        } else {
          setConnectionStatus('disconnected');
          onDisconnect?.();
          
          if (reconnectCountRef.current >= reconnectAttempts) {
            toast.error('❌ Không thể kết nối WebSocket', {
              description: 'Vui lòng kiểm tra kết nối mạng',
              duration: 5000
            });
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        onError?.(error);
        
        toast.error('⚠️ Lỗi kết nối WebSocket', {
          description: 'Đang thử kết nối lại...',
          duration: 3000
        });
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setIsConnecting(false);
      setConnectionStatus('disconnected');
      
      toast.error('❌ Không thể tạo kết nối WebSocket', {
        description: 'Vui lòng thử lại sau',
        duration: 5000
      });
    }
  }, [url, onConnect, onDisconnect, onError, onMessage, reconnectAttempts, reconnectInterval, sendHeartbeat]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    
    // Clear timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }

    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
    
    setSocket(null);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionStatus('disconnected');
    reconnectCountRef.current = 0;
  }, [socket]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [url]); // Only reconnect when URL changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
        heartbeatTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    isConnecting,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
    reconnect
  };
};

export default useWebSocket;
