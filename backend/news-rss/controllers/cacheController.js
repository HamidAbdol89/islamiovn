const { getRssNews } = require('./rssNewsController');
const NodeCache = require('node-cache');

// Cache chính với thời gian sống dài hơn
const systemCache = new NodeCache({
  stdTTL: 7200, // 2 giờ
  checkperiod: 300, // 5 phút
  maxKeys: 500
});

// Cache backup để đảm bảo luôn có dữ liệu
const backupCache = new NodeCache({
  stdTTL: 86400, // 24 giờ
  checkperiod: 3600, // 1 giờ
  maxKeys: 500
});

// Trạng thái background refresh
let refreshState = {
  isRunning: false,
  lastRun: null,
  nextRun: null,
  currentIndex: 0,
  errors: [],
  successCount: 0
};

// Danh sách cache keys quan trọng cần luôn fresh
const CRITICAL_CACHE_KEYS = [
  'rss_20_1_all',      // Trang chủ - trang 1
  'rss_20_2_all',      // Trang chủ - trang 2  
  'rss_15_1_aljazeera', // Al Jazeera
  'rss_15_1_aboutislam', // About Islam
  'rss_10_1_all',      // Mobile view
  'rss_30_1_all'       // Desktop view
];

/**
 * Preload tất cả cache keys quan trọng ngay lập tức
 */
const preloadAllCache = async () => {
  console.log('🚀 Bắt đầu preload tất cả cache keys quan trọng...');
  const startTime = Date.now();
  const results = {
    success: 0,
    failed: 0,
    details: []
  };

  for (const cacheKey of CRITICAL_CACHE_KEYS) {
    try {
      const params = parseCacheKey(cacheKey);
      console.log(`⚡ Preloading: ${cacheKey}`, params);
      
      const mockReq = {
        query: params,
        method: 'GET'
      };
      
      const mockRes = {
        header: () => {},
        json: (data) => {
          // Lưu vào cả main cache và backup cache
          systemCache.set(cacheKey, data, 7200); // 2 giờ
          backupCache.set(cacheKey, data, 86400); // 24 giờ
          return data;
        },
        status: (code) => ({ 
          json: (data) => data, 
          end: () => {} 
        })
      };

      await getRssNews(mockReq, mockRes);
      results.success++;
      results.details.push({
        key: cacheKey,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Preload thành công: ${cacheKey}`);
      
      // Nghỉ ngắn để tránh overload
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Preload failed ${cacheKey}:`, error.message);
      results.failed++;
      results.details.push({
        key: cacheKey,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  const totalTime = Date.now() - startTime;
  console.log(`🎉 Preload hoàn thành trong ${totalTime}ms - Success: ${results.success}, Failed: ${results.failed}`);
  
  // Lưu kết quả preload
  systemCache.set('preload_stats', {
    ...results,
    totalTime,
    timestamp: new Date().toISOString()
  });
  
  return results;
};

/**
 * Background refresh liên tục - chạy từng cache key một cách luân phiên
 */
const startBackgroundRefresh = () => {
  if (refreshState.isRunning) {
    console.log('Background refresh đã đang chạy...');
    return;
  }
  
  console.log('🔄 Khởi động background refresh...');
  refreshState.isRunning = true;
  refreshState.currentIndex = 0;
  
  // Chạy ngay lập tức lần đầu
  executeBackgroundRefresh();
  
  // Sau đó chạy mỗi 10 phút
  const interval = setInterval(() => {
    if (refreshState.isRunning) {
      executeBackgroundRefresh();
    } else {
      clearInterval(interval);
    }
  }, 10 * 60 * 1000); // 10 phút
  
  return interval;
};

/**
 * Thực hiện refresh một cache key
 */
const executeBackgroundRefresh = async () => {
  try {
    const cacheKey = CRITICAL_CACHE_KEYS[refreshState.currentIndex];
    console.log(`🔄 Background refresh: ${cacheKey} (${refreshState.currentIndex + 1}/${CRITICAL_CACHE_KEYS.length})`);
    
    const params = parseCacheKey(cacheKey);
    const mockReq = {
      query: params,
      method: 'GET'
    };
    
    const mockRes = {
      header: () => {},
      json: (data) => {
        // Update cả main cache và backup cache
        systemCache.set(cacheKey, data, 7200);
        backupCache.set(cacheKey, data, 86400);
        console.log(`✅ Background refresh thành công: ${cacheKey}`);
        return data;
      },
      status: (code) => ({ 
        json: (data) => data, 
        end: () => {} 
      })
    };

    await getRssNews(mockReq, mockRes);
    refreshState.successCount++;
    
    // Di chuyển đến cache key tiếp theo
    refreshState.currentIndex = (refreshState.currentIndex + 1) % CRITICAL_CACHE_KEYS.length;
    refreshState.lastRun = new Date().toISOString();
    refreshState.nextRun = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
  } catch (error) {
    console.error('❌ Background refresh error:', error.message);
    refreshState.errors.push({
      error: error.message,
      timestamp: new Date().toISOString(),
      cacheKey: CRITICAL_CACHE_KEYS[refreshState.currentIndex]
    });
    
    // Giữ chỉ 10 lỗi gần nhất
    if (refreshState.errors.length > 10) {
      refreshState.errors = refreshState.errors.slice(-10);
    }
    
    // Vẫn chuyển sang cache key tiếp theo
    refreshState.currentIndex = (refreshState.currentIndex + 1) % CRITICAL_CACHE_KEYS.length;
  }
};

/**
 * Parse cache key thành parameters
 */
const parseCacheKey = (cacheKey) => {
  // Format: rss_limit_page_source
  const parts = cacheKey.split('_');
  const params = {
    limit: parseInt(parts[1]) || 20,
    page: parseInt(parts[2]) || 1
  };
  
  if (parts[3] && parts[3] !== 'all') {
    params.source = parts[3];
  }
  
  return params;
};

/**
 * Middleware để serve từ cache ngay lập tức
 */
const instantCacheMiddleware = (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const source = req.query.source;
  const cacheKey = `rss_${limit}_${page}_${source || 'all'}`;
  
  // Tìm trong main cache trước
  let cached = systemCache.get(cacheKey);
  
  // Nếu không có trong main cache, tìm trong backup cache
  if (!cached) {
    cached = backupCache.get(cacheKey);
    if (cached) {
      console.log(`📦 Served from backup cache: ${cacheKey}`);
      // Copy vào main cache luôn
      systemCache.set(cacheKey, cached, 7200);
    }
  } else {
    console.log(`⚡ Served from main cache: ${cacheKey}`);
  }
  
  if (cached) {
    // Thêm metadata về cache
    cached.cacheInfo = {
      served: 'instant',
      timestamp: new Date().toISOString(),
      source: systemCache.get(cacheKey) ? 'main_cache' : 'backup_cache'
    };
    
    return res.json(cached);
  }
  
  // Nếu không có cache, tiếp tục với controller gốc
  console.log(`🔍 Cache miss: ${cacheKey} - Falling back to normal flow`);
  next();
};

/**
 * Improved warmup với preload ngay lập tức
 */
const warmUpCache = async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('🔥 Enhanced warm-up cache bắt đầu...');
    
    // Preload tất cả cache keys quan trọng
    const preloadResults = await preloadAllCache();
    
    // Khởi động background refresh nếu chưa chạy
    if (!refreshState.isRunning) {
      startBackgroundRefresh();
    }
    
    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      totalTime: Date.now() - startTime,
      preloadResults,
      backgroundRefreshStatus: {
        isRunning: refreshState.isRunning,
        currentIndex: refreshState.currentIndex,
        nextKey: CRITICAL_CACHE_KEYS[refreshState.currentIndex],
        lastRun: refreshState.lastRun,
        nextRun: refreshState.nextRun
      }
    };
    
    // Lưu thống kê
    systemCache.set('last_warmup', results);
    
    if (res && typeof res.status === 'function') {
      res.status(200).json({
        success: true,
        message: 'Enhanced cache warm-up hoàn thành',
        details: results
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('🚨 Enhanced warm-up error:', error);
    
    if (res && typeof res.status === 'function') {
      res.status(500).json({
        success: false,
        message: 'Lỗi enhanced warm-up',
        error: error.message
      });
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Lấy trạng thái cache chi tiết
 */
const getCacheStats = async (req, res) => {
  try {
    const mainCacheStats = systemCache.getStats();
    const backupCacheStats = backupCache.getStats();
    
    const cacheStatus = {
      timestamp: new Date().toISOString(),
      mainCache: {
        keys: systemCache.keys().length,
        stats: mainCacheStats,
        criticalKeysPresent: CRITICAL_CACHE_KEYS.filter(key => systemCache.has(key)).length
      },
      backupCache: {
        keys: backupCache.keys().length,
        stats: backupCacheStats,
        criticalKeysPresent: CRITICAL_CACHE_KEYS.filter(key => backupCache.has(key)).length
      },
      backgroundRefresh: {
        ...refreshState,
        nextKey: CRITICAL_CACHE_KEYS[refreshState.currentIndex],
        totalKeys: CRITICAL_CACHE_KEYS.length
      },
      criticalKeys: CRITICAL_CACHE_KEYS,
      preloadStats: systemCache.get('preload_stats'),
      lastWarmup: systemCache.get('last_warmup')
    };
    
    res.status(200).json({
      success: true,
      message: 'Cache statistics',
      data: cacheStatus
    });
    
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy cache stats',
      error: error.message
    });
  }
};

/**
 * Force refresh một cache key cụ thể
 */
const forceRefreshKey = async (req, res) => {
  try {
    const { cacheKey } = req.params;
    
    if (!CRITICAL_CACHE_KEYS.includes(cacheKey)) {
      return res.status(400).json({
        success: false,
        message: `Cache key "${cacheKey}" không trong danh sách critical keys`,
        availableKeys: CRITICAL_CACHE_KEYS
      });
    }
    
    const params = parseCacheKey(cacheKey);
    const mockReq = { query: params, method: 'GET' };
    const mockRes = {
      header: () => {},
      json: (data) => {
        systemCache.set(cacheKey, data, 7200);
        backupCache.set(cacheKey, data, 86400);
        return data;
      },
      status: (code) => ({ json: (data) => data, end: () => {} })
    };
    
    await getRssNews(mockReq, mockRes);
    
    res.json({
      success: true,
      message: `Cache key "${cacheKey}" đã được force refresh`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Force refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi force refresh',
      error: error.message
    });
  }
};

/**
 * Stop/Start background refresh
 */
const toggleBackgroundRefresh = (req, res) => {
  try {
    const { action } = req.body; // 'start' hoặc 'stop'
    
    if (action === 'stop') {
      refreshState.isRunning = false;
      res.json({
        success: true,
        message: 'Background refresh đã được dừng',
        status: refreshState
      });
    } else if (action === 'start') {
      if (refreshState.isRunning) {
        res.json({
          success: true,
          message: 'Background refresh đã đang chạy',
          status: refreshState
        });
      } else {
        startBackgroundRefresh();
        res.json({
          success: true,
          message: 'Background refresh đã được khởi động',
          status: refreshState
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Action phải là "start" hoặc "stop"'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi toggle background refresh',
      error: error.message
    });
  }
};

module.exports = {
  warmUpCache,
  getCacheStats,
  instantCacheMiddleware,
  preloadAllCache,
  startBackgroundRefresh,
  forceRefreshKey,
  toggleBackgroundRefresh,
  
  // Backward compatibility
  shouldWarmUp: () => !refreshState.isRunning,
  autoWarmUpMiddleware: (req, res, next) => {
    if (!refreshState.isRunning) {
      startBackgroundRefresh();
    }
    next();
  }
};