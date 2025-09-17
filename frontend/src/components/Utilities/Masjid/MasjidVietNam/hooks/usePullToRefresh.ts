// Custom hook for pull-to-refresh functionality
import { useState, useCallback, useEffect, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Only trigger if scrolled to top
    if (container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [enabled, isRefreshing]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !enabled || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    if (deltaY > 0) {
      // Prevent default scrolling when pulling down
      e.preventDefault();
      
      // Apply resistance
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);
    }
  }, [isPulling, enabled, isRefreshing, resistance, threshold]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [isPulling, enabled, pullDistance, threshold, isRefreshing, onRefresh]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Calculate pull progress (0-1)
  const pullProgress = Math.min(pullDistance / threshold, 1);
  
  // Check if ready to refresh
  const isReadyToRefresh = pullDistance >= threshold;

  return {
    containerRef,
    isRefreshing,
    isPulling,
    pullDistance,
    pullProgress,
    isReadyToRefresh
  };
};
