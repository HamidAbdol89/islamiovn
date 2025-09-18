// Performance utilities for production optimization
export const isDevelopment = import.meta.env.DEV;

// 🚀 PERFORMANCE OPTIMIZED: No-op logging functions
// All console logs are completely disabled for maximum performance
export const devLog = {
  log: (..._: any[]) => {},
  warn: (..._: any[]) => {},
  error: (..._: any[]) => {},
  info: (..._: any[]) => {}
};

// Performance monitoring for mobile
export const performanceMonitor = {
  startTime: 0,
  
  start(label: string) {
    if (isDevelopment) {
      this.startTime = performance.now();
      console.time(label);
    }
  },
  
  end(label: string) {
    if (isDevelopment) {
      console.timeEnd(label);
      const endTime = performance.now();
      const duration = endTime - this.startTime;
      if (duration > 100) {
        console.warn(`⚠️ Slow operation: ${label} took ${duration.toFixed(2)}ms`);
      }
    }
  }
};

// Debounce for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Mobile detection
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Memory usage monitoring (development only)
export const checkMemoryUsage = () => {
  if (isDevelopment && 'memory' in performance) {
    const memory = (performance as any).memory;
    const used = Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100;
    const total = Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100;
    
    if (used > 50) { // Alert if using more than 50MB
      console.warn(`🧠 High memory usage: ${used}MB / ${total}MB`);
    }
    
    return { used, total };
  }
  return null;
};

// Mobile-optimized cache size
export const getCacheSize = () => {
  return isMobile() ? 10 : 24; // Smaller cache for mobile
};

// Optimized batch size for mobile
export const getBatchSize = () => {
  return isMobile() ? 5 : 10; // Smaller batches for mobile
};
