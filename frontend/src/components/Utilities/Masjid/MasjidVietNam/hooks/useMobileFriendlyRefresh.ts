// Simple mobile-friendly refresh hook without touch conflicts
import { useState, useCallback, useRef } from 'react';

interface UseMobileFriendlyRefreshOptions {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
}

export const useMobileFriendlyRefresh = ({
  onRefresh,
  enabled = true
}: UseMobileFriendlyRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTime = useRef(0);

  // Simple refresh function with debouncing
  const handleRefresh = useCallback(async () => {
    if (!enabled || isRefreshing) return;
    
    // Debounce: prevent multiple refreshes within 2 seconds
    const now = Date.now();
    if (now - lastRefreshTime.current < 2000) return;
    
    lastRefreshTime.current = now;
    setIsRefreshing(true);
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [enabled, isRefreshing, onRefresh]);

  return {
    isRefreshing,
    handleRefresh
  };
};
