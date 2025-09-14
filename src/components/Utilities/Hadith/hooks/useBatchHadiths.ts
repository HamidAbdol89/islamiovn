import { useState, useCallback, useRef } from 'react';
import { hadithBatchService } from '../services/HadithBatchService';
import type { HadithSummary } from '../types';

interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
}

interface UseBatchHadithsReturn {
  hadiths: HadithSummary[];
  isLoading: boolean;
  progress: BatchProgress | null;
  error: string | null;
  loadAllHadiths: (categoryId: number) => Promise<void>;
  cancelLoading: () => void;
  clearCache: (categoryId?: number) => void;
  getCachedCount: (categoryId: number) => number;
  isFullyCached: (categoryId: number) => boolean;
}

export const useBatchHadiths = (): UseBatchHadithsReturn => {
  const [hadiths, setHadiths] = useState<HadithSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadAllHadiths = useCallback(async (categoryId: number) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setProgress(null);
    setHadiths([]);

    try {
      const allHadiths = await hadithBatchService.fetchAllHadiths(categoryId, {
        delayBetweenRequests: 300, // 300ms delay between requests
        maxConcurrentRequests: 2,  // Max 2 concurrent requests
        onProgress: (progressData) => {
          if (!abortControllerRef.current?.signal.aborted) {
            setProgress(progressData);
          }
        },
        onError: (error, page) => {
          console.warn(`Lỗi tải trang ${page}:`, error.message);
        }
      });

      if (!abortControllerRef.current?.signal.aborted) {
        setHadiths(allHadiths);
        setProgress({
          current: allHadiths.length,
          total: allHadiths.length,
          percentage: 100
        });
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        setError((err as Error).message);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const cancelLoading = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setProgress(null);
  }, []);

  const clearCache = useCallback((categoryId?: number) => {
    if (categoryId) {
      hadithBatchService.clearCache(categoryId);
    } else {
      hadithBatchService.clearAllCache();
    }
  }, []);

  const getCachedCount = useCallback((categoryId: number) => {
    return hadithBatchService.getCachedCount(categoryId);
  }, []);

  const isFullyCached = useCallback((categoryId: number) => {
    return hadithBatchService.isFullyCached(categoryId);
  }, []);

  return {
    hadiths,
    isLoading,
    progress,
    error,
    loadAllHadiths,
    cancelLoading,
    clearCache,
    getCachedCount,
    isFullyCached,
  };
};
