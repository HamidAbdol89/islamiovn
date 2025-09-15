const express = require('express');
const cors = require('cors');
const app = express();
const rssNewsRoutes = require('./routes/rssNews');
const cacheRoutes = require('./routes/cacheRoutes');
const errorMonitoringRoutes = require('./routes/errorMonitoring');
app.use('/api/monitoring', errorMonitoringRoutes);
// Import enhanced cache controller
const { 
  warmUpCache, 
  instantCacheMiddleware,
  preloadAllCache,
  startBackgroundRefresh
} = require('./controllers/cacheController');

// Cấu hình CORS
app.use(cors({
  origin: ['https://muslimviet.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware để ghi log các request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Route kiểm tra hoạt động cho Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server đang hoạt động bình thường',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cacheSystem: 'enhanced_v2'
  });
});

// Route RSS với instant cache middleware
app.use('/api/rss', instantCacheMiddleware, rssNewsRoutes);

// Cache management routes
app.use('/api', cacheRoutes);

// Enhanced update-cache endpoint
app.get('/api/update-cache', async (req, res) => {
  try {
    console.log('🔥 Enhanced update-cache endpoint được gọi...');
    const result = await warmUpCache(req, res);
    
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        message: 'Enhanced cache đã được cập nhật thành công',
        result: result,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Lỗi enhanced update-cache endpoint:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật enhanced cache',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

app.post('/api/update-cache', async (req, res) => {
  try {
    console.log('🔥 Enhanced POST update-cache endpoint được gọi...');
    const result = await warmUpCache(req, res);
    
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        message: 'Enhanced cache đã được cập nhật thành công',
        result: result,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Lỗi POST enhanced update-cache endpoint:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật enhanced cache',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Route mặc định
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Backend RSS-News với Enhanced Caching đang hoạt động',
    endpoints: {
      healthCheck: '/health',
      rssApi: '/api/rss (with instant cache)',
      cacheWarmup: 'POST /api/update-cache',
      preloadCache: 'POST /api/preload-cache',
      cacheStatus: '/api/cache-status',
      cacheHealth: '/api/cache-health',
      backgroundRefresh: 'POST /api/background-refresh',
      wakeUp: '/wake-up',
      superWakeUp: '/super-wake-up'
    },
    features: [
      'Instant cache serving',
      'Background refresh',
      'Dual cache system (main + backup)',
      'Proactive cache warming',
      'Critical cache keys monitoring'
    ],
    timestamp: new Date().toISOString(),
    version: '2.0.0-enhanced'
  });
});

// Enhanced wake-up endpoint
app.get('/wake-up', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(`🌅 Enhanced wake-up call nhận được lúc ${new Date().toISOString()}`);
    
    // Preload cache ngay lập tức trong background
    console.log('🚀 Bắt đầu enhanced warm-up từ wake-up endpoint...');
    
    // Không await để response nhanh cho cron job
    warmUpCache(null, null).catch(err => {
      console.error('❌ Lỗi enhanced warm-up trong wake-up:', err.message);
    });
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'success',
      message: 'Server đã thức dậy và đang enhanced warm-up cache!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      actions: ['server_awake', 'enhanced_cache_warming_started', 'background_refresh_initiated'],
      version: '2.0.0-enhanced'
    });
    
  } catch (error) {
    console.error('🚨 Lỗi trong enhanced wake-up endpoint:', error.message);
    
    res.status(200).json({
      status: 'partial_success',
      message: 'Server đã thức dậy nhưng có lỗi nhỏ trong enhanced system',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: error.message
    });
  }
});

// Super wake-up endpoint cho critical situations
app.get('/super-wake-up', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log(`🚀 SUPER wake-up call nhận được lúc ${new Date().toISOString()}`);
    
    // Preload tất cả cache ngay lập tức
    console.log('⚡ Thực hiện IMMEDIATE preload cache...');
    const preloadResults = await preloadAllCache();
    
    // Khởi động background refresh
    startBackgroundRefresh();
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'super_success',
      message: 'SUPER wake-up hoàn thành - Cache đã sẵn sàng ngay lập tức!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      preloadResults,
      actions: [
        'server_awake',
        'immediate_cache_preload_completed', 
        'background_refresh_started'
      ],
      version: '2.0.0-enhanced'
    });
    
  } catch (error) {
    console.error('🚨 Lỗi trong super wake-up endpoint:', error.message);
    
    res.status(500).json({
      status: 'super_failed',
      message: 'Super wake-up gặp lỗi',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      error: error.message
    });
  }
});

// Endpoint manual warmup với enhanced features
app.post('/manual-warmup', async (req, res) => {
  try {
    console.log('🔥 Enhanced manual cache warm-up được yêu cầu...');
    
    const result = await warmUpCache(req, res);
    
    if (!res.headersSent) {
      res.status(200).json({
        success: true,
        message: 'Enhanced cache warm-up hoàn tất',
        result: result
      });
    }
    
  } catch (error) {
    console.error('❌ Lỗi enhanced manual warm-up:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi trong quá trình enhanced warm-up',
        error: error.message
      });
    }
  }
});

// Instant preload endpoint - for emergency cache loading
app.post('/instant-preload', async (req, res) => {
  try {
    console.log('⚡ Instant preload được yêu cầu...');
    const startTime = Date.now();
    
    const results = await preloadAllCache();
    const totalTime = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      message: `Instant preload hoàn thành trong ${totalTime}ms`,
      results,
      totalTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Instant preload error:', error);
    res.status(500).json({
      success: false,
      message: 'Instant preload failed',
      error: error.message
    });
  }
});

// Cache performance endpoint
app.get('/cache-performance', (req, res) => {
  const { systemCache, backupCache } = require('./controllers/cacheController');
  
  try {
    const criticalKeys = [
      'rss_20_1_all', 'rss_20_2_all', 
      'rss_15_1_aljazeera', 'rss_15_1_aboutislam'
    ];
    
    let mainCacheReady = 0;
    let backupCacheReady = 0;
    
    criticalKeys.forEach(key => {
      if (systemCache?.has?.(key)) mainCacheReady++;
      if (backupCache?.has?.(key)) backupCacheReady++;
    });
    
    const performance = {
      status: mainCacheReady >= criticalKeys.length ? 'optimal' : 
              mainCacheReady >= criticalKeys.length * 0.5 ? 'good' : 'poor',
      mainCache: {
        ready: mainCacheReady,
        total: criticalKeys.length,
        percentage: Math.round((mainCacheReady / criticalKeys.length) * 100)
      },
      backupCache: {
        ready: backupCacheReady,
        total: criticalKeys.length,
        percentage: Math.round((backupCacheReady / criticalKeys.length) * 100)
      },
      recommendation: mainCacheReady < criticalKeys.length ? 
        'Run /super-wake-up hoặc /instant-preload để cải thiện hiệu suất' : 
        'Cache performance optimal',
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      performance
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Xử lý lỗi cho routes không tồn tại
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Không tìm thấy endpoint này',
    availableEndpoints: [
      '/health', 
      '/api/rss (with instant cache)', 
      '/api/update-cache (GET/POST)', 
      '/api/preload-cache',
      '/api/cache-status',
      '/api/cache-health',
      '/api/background-refresh',
      '/wake-up',
      '/super-wake-up',
      '/manual-warmup',
      '/instant-preload',
      '/cache-performance'
    ],
    timestamp: new Date().toISOString(),
    version: '2.0.0-enhanced'
  });
});

// Xử lý lỗi chung với error boundary
app.use((err, req, res, next) => {
  console.error(`🚨 Server Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Đã xảy ra lỗi server',
      timestamp: new Date().toISOString(),
      path: req.path,
      version: '2.0.0-enhanced'
    });
  }
});

const PORT = process.env.PORT || 8080;

// Lắng nghe trên tất cả các interface để Render có thể truy cập
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ Enhanced RSS Backend server chạy trên cổng ${PORT}`);
  console.log(`📗 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`🔥 Enhanced cache warm-up: POST http://localhost:${PORT}/api/update-cache`);
  console.log(`⚡ Instant preload: POST http://localhost:${PORT}/instant-preload`);
  console.log(`🚀 Super wake-up: GET http://localhost:${PORT}/super-wake-up`);
  console.log(`📊 Cache performance: GET http://localhost:${PORT}/cache-performance`);
  console.log(`🌅 Wake-up endpoint: http://localhost:${PORT}/wake-up`);
  
  // Enhanced initial setup khi server khởi động
  setTimeout(async () => {
    try {
      console.log('🚀 Thực hiện enhanced initial setup...');
      
      // Preload critical cache ngay lập tức
      console.log('⚡ Preloading critical cache...');
      await preloadAllCache();
      
      // Khởi động background refresh
      console.log('🔄 Starting background refresh...');
      startBackgroundRefresh();
      
      console.log('✅ Enhanced initial setup hoàn thành!');
      
    } catch (error) {
      console.error('❌ Enhanced initial setup failed:', error.message);
      // Không crash server, chỉ log lỗi
    }
  }, 3000); // Chờ 3s để server ổn định
});

// Xử lý thoát graceful
const gracefulShutdown = (signal) => {
  console.log(`Nhận tín hiệu ${signal}, đóng server gracefully...`);
  
  server.close(() => {
    console.log('✅ Enhanced server đã đóng hoàn toàn');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.log('⚠️ Force close enhanced server sau 10s timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Xử lý uncaught exceptions để tránh crash
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  // Không exit để server vẫn chạy
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection tại:', promise);
  console.error('Lý do:', reason);
  // Không exit để server vẫn chạy
});