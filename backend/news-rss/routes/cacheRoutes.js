const express = require('express');
const router = express.Router();

const {
  warmUpCache,
  getCacheStats,
  forceRefreshKey,
  toggleBackgroundRefresh,
  preloadAllCache,
  startBackgroundRefresh
} = require('../controllers/cacheController');

// Cache status - GET /api/cache-status
router.get('/cache-status', getCacheStats);

// Warm up cache - POST /api/update-cache
router.post('/update-cache', warmUpCache);
router.get('/update-cache', warmUpCache);

// Preload all cache immediately - POST /api/preload-cache
router.post('/preload-cache', async (req, res) => {
  try {
    console.log('🚀 Manual preload cache được yêu cầu...');
    const results = await preloadAllCache();
    
    res.json({
      success: true,
      message: 'Preload cache hoàn thành',
      results
    });
  } catch (error) {
    console.error('Manual preload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi preload cache',
      error: error.message
    });
  }
});

// Force refresh specific cache key - POST /api/refresh-key/:cacheKey
router.post('/refresh-key/:cacheKey', forceRefreshKey);

// Control background refresh - POST /api/background-refresh
router.post('/background-refresh', toggleBackgroundRefresh);

// Start background refresh immediately - POST /api/start-background
router.post('/start-background', (req, res) => {
  try {
    startBackgroundRefresh();
    res.json({
      success: true,
      message: 'Background refresh đã được khởi động',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khởi động background refresh',
      error: error.message
    });
  }
});

// Get cache keys list - GET /api/cache-keys
router.get('/cache-keys', (req, res) => {
  const criticalKeys = [
    'rss_20_1_all',      // Trang chủ - trang 1
    'rss_20_2_all',      // Trang chủ - trang 2  
    'rss_15_1_aljazeera', // Al Jazeera
    'rss_15_1_aboutislam', // About Islam
    'rss_10_1_all',      // Mobile view
    'rss_30_1_all'       // Desktop view
  ];
  
  res.json({
    success: true,
    criticalKeys,
    totalKeys: criticalKeys.length,
    description: {
      'rss_20_1_all': 'Trang chủ - 20 bài trang 1',
      'rss_20_2_all': 'Trang chủ - 20 bài trang 2',
      'rss_15_1_aljazeera': 'Al Jazeera - 15 bài',
      'rss_15_1_aboutislam': 'About Islam - 15 bài',
      'rss_10_1_all': 'Mobile view - 10 bài',
      'rss_30_1_all': 'Desktop view - 30 bài'
    }
  });
});

// Health check cho cache system - GET /api/cache-health
router.get('/cache-health', async (req, res) => {
  try {
    const criticalKeys = [
      'rss_20_1_all',
      'rss_20_2_all', 
      'rss_15_1_aljazeera',
      'rss_15_1_aboutislam'
    ];
    
    // Import cache từ controller
    const { systemCache, backupCache } = require('../controllers/cacheController');
    
    let mainCacheHits = 0;
    let backupCacheHits = 0;
    
    // Kiểm tra từng critical key
    for (const key of criticalKeys) {
      if (systemCache?.has && systemCache.has(key)) mainCacheHits++;
      if (backupCache?.has && backupCache.has(key)) backupCacheHits++;
    }
    
    const health = {
      status: mainCacheHits >= criticalKeys.length * 0.75 ? 'healthy' : 'degraded',
      mainCache: {
        hits: mainCacheHits,
        total: criticalKeys.length,
        percentage: Math.round((mainCacheHits / criticalKeys.length) * 100)
      },
      backupCache: {
        hits: backupCacheHits,
        total: criticalKeys.length,
        percentage: Math.round((backupCacheHits / criticalKeys.length) * 100)
      },
      recommendation: mainCacheHits < criticalKeys.length * 0.75 ? 
        'Nên chạy preload-cache để cải thiện hiệu suất' : 
        'Cache hoạt động tốt',
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      health
    });
    
  } catch (error) {
    console.error('Cache health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra cache health',
      error: error.message
    });
  }
});

module.exports = router;