// routes/errorMonitoring.js
const express = require('express');
const router = express.Router();
const { getErrorStats, smartErrorHandler } = require('../middleware/errorHandler');

// Get error statistics
router.get('/error-stats', (req, res) => {
  try {
    const stats = getErrorStats();
    
    res.json({
      success: true,
      message: 'Error statistics',
      data: {
        ...stats,
        summary: {
          totalErrors: stats.total,
          uniqueDomains: Object.keys(stats.byDomain).length,
          uniqueErrorTypes: Object.keys(stats.byType).length,
          mostProblematicDomain: stats.topDomainErrors[0]?.[0] || 'none',
          mostCommonError: stats.topErrorTypes[0]?.[0] || 'none'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy error statistics',
      error: error.message
    });
  }
});

// Reset error statistics
router.post('/reset-error-stats', (req, res) => {
  try {
    smartErrorHandler.resetStats();
    
    res.json({
      success: true,
      message: 'Error statistics đã được reset',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi reset error statistics',
      error: error.message
    });
  }
});

// Get problematic domains info
router.get('/problematic-domains', (req, res) => {
  const PROBLEMATIC_DOMAINS = {
    'nytimes.com': {
      issues: ['403_forbidden', 'paywall', 'anti_bot'],
      fallback: 'use_rss_image_only',
      timeout: 2000,
      description: 'NYTimes blocks bots and has paywall'
    },
    'wsj.com': {
      issues: ['403_forbidden', 'subscription_required'],
      fallback: 'use_rss_image_only',
      timeout: 2000,
      description: 'Wall Street Journal blocks scrapers'
    },
    'aboutislam.net': {
      issues: ['slow_response', 'intermittent_timeout'],
      fallback: 'retry_with_longer_timeout',
      timeout: 8000,
      description: 'AboutIslam has slow server response'
    },
    'productivemuslim.com': {
      issues: ['slow_response'],
      fallback: 'retry_with_longer_timeout',
      timeout: 6000,
      description: 'ProductiveMuslim occasionally slow'
    },
    'economist.com': {
      issues: ['403_forbidden', 'subscription_required'],
      fallback: 'use_rss_image_only',
      timeout: 2000,
      description: 'The Economist blocks scrapers'
    }
  };

  res.json({
    success: true,
    message: 'Danh sách domains problematic',
    data: {
      domains: PROBLEMATIC_DOMAINS,
      totalDomains: Object.keys(PROBLEMATIC_DOMAINS).length,
      strategies: {
        'use_rss_image_only': 'Chỉ dùng ảnh từ RSS feed, không fetch HTML',
        'retry_with_longer_timeout': 'Retry với timeout dài hơn',
        'use_default_image': 'Sử dụng ảnh mặc định',
        'delay_and_retry': 'Chờ và retry lại'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Test URL validation and normalization
router.post('/test-url', (req, res) => {
  try {
    const { url, baseUrl } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const isValid = smartErrorHandler.isValidUrl(url);
    const domain = smartErrorHandler.extractDomain(url);
    const shouldSkip = smartErrorHandler.shouldSkipImageFetch(url);
    const timeout = smartErrorHandler.getTimeoutForDomain(url);
    const normalized = baseUrl ? 
      smartErrorHandler.normalizeUrlSafe(url, baseUrl) : 
      url;

    res.json({
      success: true,
      message: 'URL analysis complete',
      data: {
        originalUrl: url,
        baseUrl: baseUrl || null,
        normalizedUrl: normalized,
        isValid,
        domain,
        shouldSkipImageFetch: shouldSkip,
        recommendedTimeout: timeout,
        analysis: {
          isAbsolute: /^https?:\/\//i.test(url),
          isRelative: url.startsWith('/') && !url.startsWith('//'),
          isProtocolRelative: url.startsWith('//'),
          isDataUrl: url.startsWith('data:'),
          hasProblematicDomain: shouldSkip
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi test URL',
      error: error.message
    });
  }
});

// Health check for error handling system
router.get('/error-system-health', (req, res) => {
  try {
    const stats = getErrorStats();
    const recentErrorRate = stats.recentErrors.length;
    const totalErrors = stats.total;
    
    let healthStatus = 'healthy';
    let recommendations = [];
    
    if (recentErrorRate > 15) {
      healthStatus = 'degraded';
      recommendations.push('Tỷ lệ lỗi gần đây cao, kiểm tra network connectivity');
    }
    
    if (totalErrors > 100) {
      healthStatus = 'degraded';
      recommendations.push('Tổng số lỗi cao, có thể cần review RSS sources');
    }
    
    // Check if specific domains are causing too many errors
    const topErrorDomain = stats.topDomainErrors[0];
    if (topErrorDomain && topErrorDomain[1] > 20) {
      recommendations.push(`Domain ${topErrorDomain[0]} gây nhiều lỗi (${topErrorDomain[1]} lỗi)`);
    }
    
    res.json({
      success: true,
      healthStatus,
      message: `Error handling system is ${healthStatus}`,
      data: {
        recentErrorCount: recentErrorRate,
        totalErrorCount: totalErrors,
        topErrorDomain: topErrorDomain?.[0] || 'none',
        topErrorType: stats.topErrorTypes[0]?.[0] || 'none',
        recommendations,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      healthStatus: 'unhealthy',
      message: 'Error handling system check failed',
      error: error.message
    });
  }
});

// Force test problematic domains
router.post('/test-problematic-domains', async (req, res) => {
  try {
    const axios = require('axios');
    const testUrls = [
      'https://www.nytimes.com/section/world/middleeast',
      'https://aboutislam.net/feed/',
      'https://productivemuslim.com/feed/',
      'https://www.wsj.com'
    ];
    
    const results = [];
    
    for (const url of testUrls) {
      const startTime = Date.now();
      const timeout = smartErrorHandler.getTimeoutForDomain(url);
      
      try {
        const response = await axios.get(url, {
          timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        results.push({
          url,
          status: 'success',
          responseTime: Date.now() - startTime,
          statusCode: response.status,
          timeout: timeout
        });
      } catch (error) {
        const errorResult = smartErrorHandler.handleError(error, { url });
        
        results.push({
          url,
          status: 'failed',
          responseTime: Date.now() - startTime,
          error: error.message,
          errorType: errorResult.errorType,
          strategy: errorResult.strategy,
          timeout: timeout
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Problematic domains test completed',
      data: {
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'failed').length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi test problematic domains',
      error: error.message
    });
  }
});

module.exports = router;