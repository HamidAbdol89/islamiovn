const express = require('express');
const router = express.Router();
const { getRssNews, addRssFeed } = require('../controllers/rssNewsController');

// Middleware để log cache performance
const cachePerformanceLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.json để log response time
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log performance metrics
    console.log(`📊 RSS Response: ${req.method} ${req.originalUrl} - ${responseTime}ms`);
    
    // Add performance info to response
    if (data && typeof data === 'object') {
      data.performance = {
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        cached: data.cacheInfo ? true : false,
        cacheSource: data.cacheInfo?.source || 'none'
      };
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Main RSS endpoint với instant cache (middleware đã được apply ở index.js)
router.get('/', cachePerformanceLogger, getRssNews);

// RSS endpoint với explicit source
router.get('/source/:sourceName', cachePerformanceLogger, (req, res) => {
  // Add source to query params
  req.query.source = req.params.sourceName;
  getRssNews(req, res);
});

// Add new RSS feed
router.post('/add-feed', addRssFeed);

// Quick endpoints cho mobile/desktop
router.get('/mobile', cachePerformanceLogger, (req, res) => {
  req.query.limit = '10';
  req.query.page = '1';
  getRssNews(req, res);
});

router.get('/desktop', cachePerformanceLogger, (req, res) => {
  req.query.limit = '30';
  req.query.page = '1';
  getRssNews(req, res);
});

// Latest news endpoint
router.get('/latest', cachePerformanceLogger, (req, res) => {
  req.query.limit = '5';
  req.query.page = '1';
  getRssNews(req, res);
});

// Popular sources endpoints
router.get('/aljazeera', cachePerformanceLogger, (req, res) => {
  req.query.source = 'aljazeera';
  req.query.limit = req.query.limit || '15';
  getRssNews(req, res);
});

router.get('/aboutislam', cachePerformanceLogger, (req, res) => {
  req.query.source = 'aboutislam';
  req.query.limit = req.query.limit || '15';
  getRssNews(req, res);
});

// Test endpoint để kiểm tra cache
router.get('/test-cache', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const source = req.query.source;
  const cacheKey = `rss_${limit}_${page}_${source || 'all'}`;
  
  try {
    // Import cache từ controller
    const NodeCache = require('node-cache');
    const systemCache = new NodeCache(); // Temporary check
    
    res.json({
      success: true,
      cacheKey,
      params: { limit, page, source },
      message: 'Test cache key generation',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check cho RSS routes
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'RSS Routes',
    endpoints: [
      'GET /',
      'GET /source/:sourceName',
      'GET /mobile',
      'GET /desktop', 
      'GET /latest',
      'GET /aljazeera',
      'GET /aboutislam',
      'GET /test-cache',
      'POST /add-feed'
    ],
    features: [
      'Instant cache serving',
      'Performance logging',
      'Source-specific endpoints',
      'Mobile/Desktop optimized endpoints'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;