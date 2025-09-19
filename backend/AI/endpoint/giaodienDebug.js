/**
 * Debug endpoints for system monitoring
 */

/**
 * Handle debug interface endpoint
 */
export function handleDebugInterface(req, res) {
  try {
    const systemInfo = {
      service: 'Muslim Việt Mira AI',
      version: '2.0.0',
      status: 'ACTIVE',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
      developer: 'ABDOL HAMID'
    };
    
    res.json({
      success: true,
      debug: systemInfo,
      endpoints: [
        '/api/islamic-question',
        '/api/health',
        '/api/stats',
        '/api/knowledge/:topic',
        '/api/process'
      ]
    });
  } catch (error) {
    console.error('❌ Debug interface error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug interface failed',
      timestamp: new Date().toISOString()
    });
  }
}

export const setupDebugEndpoints = (app, { userInteractionStats, responseCache, callGeminiAPI }) => {
  // Enhanced debug endpoints
  app.get('/debug/stats', (req, res) => {
    const stats = Array.from(userInteractionStats.entries()).map(([ip, data]) => ({
      ip: ip.substring(0, 8) + '***', // Privacy protection
      totalRequests: data.totalRequests,
      firstSeen: new Date(data.firstSeen).toISOString(),
      lastSeen: new Date(data.lastSeen).toISOString(),
      avgResponseTime: Math.round(data.avgResponseTime),
      topicsInterested: Array.from(data.topics)
    }));
    
    res.json({
      totalUsers: stats.length,
      userStats: stats,
      cacheStats: responseCache.getStats(),
      systemInfo: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  });

  app.get('/debug/cache', (req, res) => {
    const cacheKeys = responseCache.keys();
    const cacheInfo = cacheKeys.map(key => {
      const data = responseCache.get(key);
      return {
        key: key.substring(0, 20) + '...',
        question: data?.originalQuestion?.substring(0, 50) + '...',
        contexts: data?.contexts,
        timestamp: data?.timestamp
      };
    });
    
    res.json({
      totalCached: cacheKeys.length,
      cacheDetails: cacheInfo,
      stats: responseCache.getStats()
    });
  });

  // Test endpoint with enhanced features
  app.get('/debug/test-enhanced', async (req, res) => {
    try {
      const testQuestion = "Assalamu alaikum, Muslim Việt có thể giúp gì cho tôi?";
      const response = await callGeminiAPI(testQuestion, { test: true });

      res.json({
        status: 'success',
        model: 'gemini-1.5-flash-enhanced',
        provider: 'Google AI + Muslim Việt Intelligence',
        creator: 'ABDOL HAMID',
        testQuestion,
        contexts: response.contexts,
        responsePreview: response.reply.substring(0, 200) + '...',
        timestamp: new Date().toISOString(),
        intelligence: 'ACTIVE ✅'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        model: 'gemini-1.5-flash-enhanced',
        creator: 'ABDOL HAMID debugging...',
        timestamp: new Date().toISOString()
      });
    }
  });
};