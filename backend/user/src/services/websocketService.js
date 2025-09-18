const WebSocket = require('ws');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map<userId, WebSocket>
    this.heartbeatInterval = null;
  }

  initialize(server) {
    // Tạo WebSocket server trên cùng HTTP server
    this.wss = new WebSocket.Server({ 
      server,
      path: '/favorites'
    });

    console.log('🔌 WebSocket server initialized on /favorites');

    this.wss.on('connection', (ws, req) => {
      console.log('🔗 New WebSocket connection');
      
      // Set up connection properties
      ws.isAlive = true;
      ws.userId = null;
      ws.authenticated = false;

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('❌ Invalid WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle connection close
      ws.on('close', () => {
        if (ws.userId) {
          this.clients.delete(ws.userId);
          console.log(`🔌 User ${ws.userId} disconnected`);
        }
      });

      // Handle pong responses for heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established'
      }));
    });

    // Set up heartbeat to detect dead connections
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          console.log('💀 Terminating dead connection');
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 seconds

    console.log('💓 WebSocket heartbeat initialized');
  }

  handleMessage(ws, message) {
    const { type, token, data } = message;

    switch (type) {
      case 'auth':
        this.handleAuth(ws, token);
        break;
        
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
        
      case 'favorite_update':
        if (ws.authenticated) {
          this.broadcastFavoriteUpdate(ws.userId, data);
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Not authenticated'
          }));
        }
        break;
        
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  handleAuth(ws, token) {
    // Simple authentication - trong production nên verify JWT token
    if (token) {
      ws.userId = token;
      ws.authenticated = true;
      this.clients.set(token, ws);
      
      console.log(`✅ User ${token} authenticated`);
      
      ws.send(JSON.stringify({
        type: 'auth_success',
        message: 'Authentication successful'
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'auth_error',
        message: 'Invalid token'
      }));
    }
  }

  // Broadcast favorite update to all connected clients except sender
  broadcastFavoriteUpdate(senderId, favoriteData) {
    const message = JSON.stringify({
      type: 'favorite_updated',
      data: {
        userId: senderId,
        ...favoriteData,
        timestamp: Date.now()
      }
    });

    let broadcastCount = 0;
    this.clients.forEach((client, userId) => {
      if (userId !== senderId && client.readyState === WebSocket.OPEN) {
        client.send(message);
        broadcastCount++;
      }
    });

    console.log(`📡 Broadcasted favorite update to ${broadcastCount} clients`);
  }

  // Send favorite update to specific user
  sendToUser(userId, data) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.clients.size;
  }

  // Get all connected user IDs
  getConnectedUsers() {
    return Array.from(this.clients.keys());
  }

  // Cleanup on server shutdown
  close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.wss) {
      this.wss.close();
    }
    
    console.log('🔌 WebSocket service closed');
  }
}

// Singleton instance
const websocketService = new WebSocketService();

module.exports = websocketService;
