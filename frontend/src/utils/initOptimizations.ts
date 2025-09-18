// Initialize all performance optimizations for the app
import { initMobileOptimizations, monitorMobilePerformance } from './mobileOptimizations';
import { disablePullToRefresh } from './touchEventFix';
import { devLog } from './performance';

// Global performance optimizations
export const initAppOptimizations = () => {
  devLog.log('🚀 Initializing app optimizations...');

  // Initialize mobile optimizations
  initMobileOptimizations();

  // Fix touch event conflicts
  disablePullToRefresh();

  // Start performance monitoring
  monitorMobilePerformance();

  // Remove console.log in production
  if (!import.meta.env.DEV) {
    // Override console methods in production
    const noop = () => {};
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    // Keep console.error for debugging critical issues
  }

  // Optimize React DevTools in production
  if (!import.meta.env.DEV && typeof window !== 'undefined') {
    // Disable React DevTools in production
    const globalHook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (typeof globalHook === 'object' && globalHook) {
      globalHook.onCommitFiberRoot = null;
      globalHook.onCommitFiberUnmount = null;
    }
  }

  // Add global error handling for better UX
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to an error tracking service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to an error tracking service
  });

  devLog.log('✅ App optimizations initialized');
};

// Call this in your main.tsx or App.tsx
export default initAppOptimizations;
