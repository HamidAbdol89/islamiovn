// middleware/errorHandler.js
const NodeCache = require('node-cache');

// Cache để track các lỗi và tránh spam logs
const errorCache = new NodeCache({
  stdTTL: 300, // 5 phút
  checkperiod: 60
});

// Danh sách domains problematic
const PROBLEMATIC_DOMAINS = {
  'nytimes.com': {
    issues: ['403_forbidden', 'paywall', 'anti_bot'],
    fallback: 'use_rss_image_only',
    timeout: 2000
  },
  'wsj.com': {
    issues: ['403_forbidden', 'subscription_required'],
    fallback: 'use_rss_image_only',
    timeout: 2000
  },
  'aboutislam.net': {
    issues: ['slow_response', 'intermittent_timeout'],
    fallback: 'retry_with_longer_timeout',
    timeout: 8000
  },
  'productivemuslim.com': {
    issues: ['slow_response'],
    fallback: 'retry_with_longer_timeout',
    timeout: 6000
  },
  'economist.com': {
    issues: ['403_forbidden', 'subscription_required'],
    fallback: 'use_rss_image_only',
    timeout: 2000
  }
};

// Error patterns để identify common issues
const ERROR_PATTERNS = {
  TIMEOUT: /timeout|ECONNABORTED|ETIMEDOUT/i,
  FORBIDDEN: /403|forbidden|access denied/i,
  NOT_FOUND: /404|not found/i,
  TOO_MANY_REQUESTS: /429|too many requests|rate limit/i,
  URL_ERROR: /url\.match is not a function|Invalid URL/i,
  CONNECTION_ERROR: /ECONNRESET|ECONNREFUSED|ENOTFOUND/i,
  DNS_ERROR: /ENOTFOUND|getaddrinfo/i
};

/**
 * Smart error handler với fallback strategies
 */
class SmartErrorHandler {
  constructor() {
    this.errorStats = {
      total: 0,
      byType: {},
      byDomain: {},
      recentErrors: []
    };
  }

  /**
   * Handle lỗi với strategy dựa trên loại lỗi
   */
  handleError(error, context = {}) {
    const errorInfo = this.analyzeError(error, context);
    this.logError(errorInfo);
    
    // Áp dụng fallback strategy
    return this.applyFallbackStrategy(errorInfo);
  }

  /**
   * Phân tích lỗi để xác định loại và strategy
   */
  analyzeError(error, context) {
    const errorMessage = error.message || error.toString();
    const url = context.url || '';
    const domain = this.extractDomain(url);
    
    let errorType = 'UNKNOWN';
    let strategy = 'DEFAULT';
    
    // Identify error type
    for (const [type, pattern] of Object.entries(ERROR_PATTERNS)) {
      if (pattern.test(errorMessage)) {
        errorType = type;
        break;
      }
    }
    
    // Determine strategy based on domain and error type
    if (domain && PROBLEMATIC_DOMAINS[domain]) {
      const domainInfo = PROBLEMATIC_DOMAINS[domain];
      strategy = domainInfo.fallback;
    } else {
      strategy = this.getStrategyForErrorType(errorType);
    }
    
    return {
      error,
      errorMessage,
      errorType,
      url,
      domain,
      strategy,
      timestamp: new Date().toISOString(),
      context
    };
  }

  /**
   * Extract domain from URL safely
   */
  extractDomain(url) {
    if (!url || typeof url !== 'string') return null;
    
    try {
      return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    } catch (e) {
      // Fallback regex for malformed URLs
      const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
      return match ? match[1].toLowerCase() : null;
    }
  }

  /**
   * Get fallback strategy based on error type
   */
  getStrategyForErrorType(errorType) {
    const strategies = {
      TIMEOUT: 'retry_with_longer_timeout',
      FORBIDDEN: 'use_rss_image_only',
      NOT_FOUND: 'use_default_image',
      TOO_MANY_REQUESTS: 'delay_and_retry',
      URL_ERROR: 'use_default_image',
      CONNECTION_ERROR: 'retry_once',
      DNS_ERROR: 'use_default_image'
    };
    
    return strategies[errorType] || 'use_default_image';
  }

  /**
   * Apply fallback strategy
   */
  applyFallbackStrategy(errorInfo) {
    const { strategy, domain, url, errorType } = errorInfo;
    
    switch (strategy) {
      case 'use_rss_image_only':
        return {
          action: 'skip_html_fetch',
          reason: `Domain ${domain} blocks image fetching`,
          fallback: 'rss_image_or_default'
        };
        
      case 'retry_with_longer_timeout':
        return {
          action: 'retry',
          timeout: PROBLEMATIC_DOMAINS[domain]?.timeout || 8000,
          reason: 'Slow domain - using longer timeout'
        };
        
      case 'use_default_image':
        return {
          action: 'use_default',
          reason: `Error type ${errorType} - fallback to default image`
        };
        
      case 'delay_and_retry':
        return {
          action: 'delay_retry',
          delay: 2000,
          reason: 'Rate limited - retry after delay'
        };
        
      case 'retry_once':
        return {
          action: 'retry_once',
          reason: 'Connection error - single retry attempt'
        };
        
      default:
        return {
          action: 'use_default',
          reason: 'Unknown error - fallback to default'
        };
    }
  }

  /**
   * Log error with deduplication
   */
  logError(errorInfo) {
    const { domain, errorType, url, errorMessage } = errorInfo;
    const errorKey = `${domain}_${errorType}_${errorMessage.substring(0, 50)}`;
    
    // Check if we've already logged this error recently
    if (errorCache.get(errorKey)) {
      return; // Skip duplicate logging
    }
    
    // Cache this error to avoid spam
    errorCache.set(errorKey, true, 300); // 5 minutes
    
    // Update stats
    this.errorStats.total++;
    this.errorStats.byType[errorType] = (this.errorStats.byType[errorType] || 0) + 1;
    if (domain) {
      this.errorStats.byDomain[domain] = (this.errorStats.byDomain[domain] || 0) + 1;
    }
    
    // Add to recent errors (keep last 20)
    this.errorStats.recentErrors.unshift({
      ...errorInfo,
      count: this.errorStats.byDomain[domain] || 1
    });
    
    if (this.errorStats.recentErrors.length > 20) {
      this.errorStats.recentErrors = this.errorStats.recentErrors.slice(0, 20);
    }
    
    // Log based on error type severity
    if (errorType === 'FORBIDDEN' || errorType === 'TOO_MANY_REQUESTS') {
      console.warn(`⚠️ ${errorType} from ${domain || 'unknown'}: ${errorMessage}`);
    } else if (errorType === 'TIMEOUT') {
      console.log(`⏰ TIMEOUT from ${domain || 'unknown'} (${url})`);
    } else {
      console.error(`❌ ${errorType} from ${domain || 'unknown'}: ${errorMessage}`);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      ...this.errorStats,
      topDomainErrors: Object.entries(this.errorStats.byDomain)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      topErrorTypes: Object.entries(this.errorStats.byType)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    };
  }

  /**
   * Reset error stats
   */
  resetStats() {
    this.errorStats = {
      total: 0,
      byType: {},
      byDomain: {},
      recentErrors: []
    };
  }

  /**
   * Check if domain should be skipped for image fetching
   */
  shouldSkipImageFetch(url) {
    const domain = this.extractDomain(url);
    if (!domain) return false;
    
    return PROBLEMATIC_DOMAINS[domain] && 
           PROBLEMATIC_DOMAINS[domain].fallback === 'use_rss_image_only';
  }

  /**
   * Get recommended timeout for domain
   */
  getTimeoutForDomain(url) {
    const domain = this.extractDomain(url);
    if (!domain) return 5000; // Default 5s
    
    return PROBLEMATIC_DOMAINS[domain]?.timeout || 5000;
  }

  /**
   * Safe URL validation
   */
  isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Safe URL normalization
   */
  normalizeUrlSafe(url, baseUrl) {
    if (!url || typeof url !== 'string') return null;
    if (!baseUrl || typeof baseUrl !== 'string') return url;
    
    // Already absolute URL
    if (/^https?:\/\//i.test(url)) return url;
    
    try {
      if (url.startsWith('//')) {
        return `https:${url}`;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else {
        return new URL(url, baseUrl).href;
      }
    } catch (e) {
      console.warn(`⚠️ URL normalization failed: ${url} with base ${baseUrl}`);
      return url;
    }
  }
}

// Singleton instance
const smartErrorHandler = new SmartErrorHandler();

// Export middleware functions
module.exports = {
  smartErrorHandler,
  
  /**
   * Express middleware để handle RSS errors
   */
  rssErrorHandler: (err, req, res, next) => {
    const errorInfo = smartErrorHandler.handleError(err, {
      url: req.url,
      method: req.method,
      query: req.query
    });
    
    console.error('RSS Error:', errorInfo);
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'RSS processing error',
        message: 'Đã xảy ra lỗi khi xử lý RSS feed',
        details: errorInfo.strategy,
        timestamp: new Date().toISOString()
      });
    }
  },
  
  /**
   * Helper để handle image fetch errors
   */
  handleImageFetchError: (error, url) => {
    return smartErrorHandler.handleError(error, { url, type: 'image_fetch' });
  },
  
  /**
   * Helper để check nên skip image fetch không
   */
  shouldSkipImageFetch: (url) => {
    return smartErrorHandler.shouldSkipImageFetch(url);
  },
  
  /**
   * Helper để get timeout cho domain
   */
  getTimeoutForUrl: (url) => {
    return smartErrorHandler.getTimeoutForDomain(url);
  },
  
  /**
   * Helper để normalize URL safely
   */
  safeNormalizeUrl: (url, baseUrl) => {
    return smartErrorHandler.normalizeUrlSafe(url, baseUrl);
  },
  
  /**
   * Get error statistics endpoint
   */
  getErrorStats: () => {
    return smartErrorHandler.getErrorStats();
  }
};