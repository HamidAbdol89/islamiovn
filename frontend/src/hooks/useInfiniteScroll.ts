import { useCallback, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  rootMargin = '100px',
  threshold = 0.1
}: UseInfiniteScrollOptions) => {
  const [sentinelRef, isVisible] = useIntersectionObserver({
    rootMargin,
    threshold
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && isVisible) {
      onLoadMore();
    }
  }, [hasMore, loading, isVisible, onLoadMore]);

  useEffect(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  return { sentinelRef };
};
