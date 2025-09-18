// Mobile-specific optimizations for better performance
import { devLog } from './performance';

// Detect mobile device capabilities - DISABLED optimization for favorites
export const getMobileCapabilities = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;
  const isSlowConnection = (navigator as any).connection?.effectiveType === 'slow-2g' || 
                          (navigator as any).connection?.effectiveType === '2g';
  
  return {
    isMobile,
    isLowEndDevice,
    isSlowConnection,
    shouldOptimize: false
  };
};

// Mobile-optimized settings - DISABLED for favorites compatibility
export const getMobileSettings = () => {
  const capabilities = getMobileCapabilities();
  
  return {
    batchSize: 10,
    cacheSize: 20,
    debounceDelay: 300,
    
    // Keep image quality optimization (doesn't affect favorites)
    imageQuality: capabilities.shouldOptimize ? 'low' : 'high',
    
    // Keep animations (doesn't affect favorites)
    enableAnimations: !capabilities.isLowEndDevice,
    
    maxConcurrentRequests: 5,
    shouldOptimize: false
  };
};

// Optimize images for mobile
export const optimizeImageLoading = () => {
  const capabilities = getMobileCapabilities();
  
  if (capabilities.shouldOptimize) {
    // Add loading="lazy" to all images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
    
    // Reduce image quality on slow connections
    if (capabilities.isSlowConnection) {
      const highResImages = document.querySelectorAll('img[src*="high-res"]');
      highResImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          img.setAttribute('src', src.replace('high-res', 'low-res'));
        }
      });
    }
  }
};

// Memory management for mobile
export const cleanupMemory = () => {
  const capabilities = getMobileCapabilities();
  
  if (capabilities.shouldOptimize) {
    // Clear unused caches
    try {
      // Clear old localStorage entries
      const keys = Object.keys(localStorage);
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      
      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && parsed.timestamp < oneWeekAgo) {
              localStorage.removeItem(key);
              devLog.log(`Cleaned up old cache entry: ${key}`);
            }
          }
        } catch (e) {
          // Invalid JSON, remove it
          localStorage.removeItem(key);
        }
      });
      
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
    } catch (error) {
      devLog.warn('Memory cleanup failed:', error);
    }
  }
};

// Network optimization - DISABLED for favorites compatibility
export const optimizeNetworkRequests = () => {
  return {
    maxConcurrentRequests: 5,
    requestTimeout: 5000
  };
};

// Initialize mobile optimizations
export const initMobileOptimizations = () => {
  const capabilities = getMobileCapabilities();
  
  if (capabilities.shouldOptimize) {
    devLog.log('Initializing mobile optimizations...');
    
    // Optimize images
    optimizeImageLoading();
    
    // Clean up memory periodically
    setInterval(cleanupMemory, 5 * 60 * 1000); // Every 5 minutes
    
    // Add mobile-specific CSS class
    document.body.classList.add('mobile-optimized');
    
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
    }
    
    // Mobile favorites debugging removed for clean code
    
    devLog.log('Mobile optimizations initialized');
  }
};

// Performance monitoring for mobile
export const monitorMobilePerformance = () => {
  const capabilities = getMobileCapabilities();
  
  if (capabilities.shouldOptimize && 'performance' in window) {
    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      
      if (usedMB > 30) { // Alert if using more than 30MB on mobile
        devLog.warn(`High memory usage on mobile: ${usedMB}MB`);
        cleanupMemory();
      }
    }
    
    // Monitor slow operations
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Alert for operations taking more than 50ms
          devLog.warn(`Slow operation on mobile: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
};

export const getMobileFavoritesSettings = () => {
  return {
    enableFavorites: true,
    favoritesBatchSize: 10,
    favoritesTimeout: 5000,
    favoritesRetries: 2,
    debugFavorites: false
  };
};
