/**
 * Health check endpoints
 */

/**
 * Handle health check endpoint
 */
export function handleHealthCheck(req, res) {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      status: 'HEALTHY',
      service: 'Muslim Việt Islam AI',
      version: '2.0.0',
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
      },
      timestamp: new Date().toISOString(),
      developer: 'ABDOL HAMID'
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}

export const setupHealthEndpoints = (app, { isShuttingDown, userInteractionStats, deepLearningReady }) => {
  // Health check được cải thiện
  app.get('/health', (req, res) => {
    // Nếu đang shutdown, trả về unhealthy
    if (isShuttingDown) {
      return res.status(503).json({ 
        status: 'SHUTTING_DOWN',
        message: 'Server is shutting down'
      });
    }

    const uptime = process.uptime();
    const totalUsers = userInteractionStats ? userInteractionStats.size : 0;
    const totalQuestions = userInteractionStats ? 
      Array.from(userInteractionStats.values())
        .reduce((sum, stats) => sum + stats.totalRequests, 0) : 0;
    
    res.status(200).json({ 
      status: 'HEALTHY', 
      service: 'Muslim Việt Islam AI',
      ready: true,
      deepLearning: deepLearningReady ? 'ACTIVE' : 'DISABLED',
      stats: {
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        totalUsers,
        totalQuestions,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
      },
      timestamp: new Date().toISOString() 
    });
  });

  // Readiness probe riêng
  app.get('/ready', (req, res) => {
    if (isShuttingDown) {
      return res.status(503).json({ ready: false, reason: 'shutting_down' });
    }
    
    res.status(200).json({ 
      ready: true,
      deepLearning: deepLearningReady,
      timestamp: new Date().toISOString()
    });
  });
};