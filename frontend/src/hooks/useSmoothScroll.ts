// Hook for smooth scrolling optimization on mobile
import { useEffect, useCallback, useRef } from 'react';
import { getMobileSettings } from '@/utils/mobileOptimizations';

interface SmoothScrollOptions {
  enableVirtualization?: boolean;
  itemHeight?: number;
  overscan?: number;
}

export const useSmoothScroll = (options?: SmoothScrollOptions) => {
  const {
    enableVirtualization = true,
    itemHeight = 200,
    overscan = 3
  } = options || {};

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  const mobileSettings = getMobileSettings();

  // Optimize scroll behavior for mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !mobileSettings.shouldOptimize) return;

    // Add CSS for smooth scrolling
    container.style.scrollBehavior = 'auto'; // Disable smooth scroll on mobile
    container.style.overflowY = 'auto';
    (container.style as any).WebkitOverflowScrolling = 'touch'; // iOS momentum scrolling
    
    // Optimize scroll performance
    container.style.willChange = 'scroll-position';
    container.style.transform = 'translateZ(0)'; // Force hardware acceleration
    
    // Prevent touch event conflicts
    container.style.touchAction = 'pan-y'; // Only allow vertical scrolling
    (container.style as any).overscrollBehavior = 'contain'; // Prevent overscroll

    return () => {
      container.style.scrollBehavior = '';
      container.style.willChange = '';
      container.style.transform = '';
      container.style.touchAction = '';
      (container.style as any).overscrollBehavior = '';
    };
  }, [mobileSettings.shouldOptimize]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (!mobileSettings.shouldOptimize) return;

    isScrollingRef.current = true;
    
    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to detect scroll end
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, [mobileSettings.shouldOptimize]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !mobileSettings.shouldOptimize) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, mobileSettings.shouldOptimize]);

  // Virtual scrolling calculation
  const getVisibleRange = useCallback((scrollTop: number, containerHeight: number) => {
    if (!enableVirtualization || !mobileSettings.shouldOptimize) {
      return { start: 0, end: Infinity };
    }

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = start + visibleCount + overscan * 2;

    return { start, end };
  }, [enableVirtualization, itemHeight, overscan, mobileSettings.shouldOptimize]);

  // Check if item should be rendered (for virtual scrolling)
  const shouldRenderItem = useCallback((index: number) => {
    if (!enableVirtualization || !mobileSettings.shouldOptimize) {
      return true;
    }

    const container = scrollContainerRef.current;
    if (!container) return index < 10; // Render first 10 items by default

    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const { start, end } = getVisibleRange(scrollTop, containerHeight);

    return index >= start && index <= end;
  }, [enableVirtualization, getVisibleRange, mobileSettings.shouldOptimize]);

  return {
    scrollContainerRef,
    isScrolling: isScrollingRef.current,
    shouldRenderItem,
    getVisibleRange,
    isMobileOptimized: mobileSettings.shouldOptimize
  };
};
