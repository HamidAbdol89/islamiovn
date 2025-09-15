import { useCallback, useEffect, useMemo } from 'react';
import CalendarCacheService from '../services/cacheService';

interface UseCacheManagerOptions {
  enablePreloading?: boolean;
  preloadRange?: number;
  autoCleanup?: boolean;
}

export const useCacheManager = (options: UseCacheManagerOptions = {}) => {
  const {
    enablePreloading = true,
    preloadRange = 2,
    autoCleanup = true
  } = options;

  const cacheService = useMemo(() => CalendarCacheService.getInstance(), []);

  // Preload dữ liệu cho các tháng quan trọng
  const preloadImportantMonths = useCallback(async () => {
    if (!enablePreloading) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Preload tháng hiện tại và các tháng liền kề
    await cacheService.preloadAdjacentMonths(currentMonth, currentYear, preloadRange);

    // Preload các tháng đặc biệt (Ramadan, Hajj, etc.)
    const specialMonths = [
      { month: 9, year: currentYear }, // Ramadan
      { month: 12, year: currentYear }, // Dhu al-Hijjah
      { month: 1, year: currentYear + 1 }, // Muharram năm sau
    ];

    for (const { month, year } of specialMonths) {
      const cached = await cacheService.get(month, year);
      if (!cached) {
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result?.data) {
              await cacheService.set(month, year, result.data);
            }
          }
        } catch (error) {
          console.log(`Không thể preload tháng đặc biệt ${month}/${year}:`, error);
        }
      }
    }
  }, [cacheService, enablePreloading, preloadRange]);

  // Khởi tạo cache khi component mount
  useEffect(() => {
    // Delay một chút để không ảnh hưởng đến render ban đầu
    const timer = setTimeout(() => {
      preloadImportantMonths();
    }, 1000);

    return () => clearTimeout(timer);
  }, [preloadImportantMonths]);

  // Dọn dẹp cache định kỳ
  useEffect(() => {
    if (!autoCleanup) return;

    const cleanupInterval = setInterval(() => {
      // Thống kê cache
      const stats = cacheService.getStats();
      console.log('Cache stats:', stats);

      // Nếu cache quá lớn, có thể thực hiện dọn dẹp thêm
      if (stats.storageSize > 3 * 1024 * 1024) { // 3MB
        console.log('Cache size lớn, đang dọn dẹp...');
      }
    }, 5 * 60 * 1000); // 5 phút

    return () => clearInterval(cleanupInterval);
  }, [cacheService, autoCleanup]);

  // Các utility functions
  const clearCache = useCallback(async () => {
    await cacheService.clearAll();
  }, [cacheService]);

  const getCacheStats = useCallback(() => {
    return cacheService.getStats();
  }, [cacheService]);

  const preloadMonth = useCallback(async (month: number, year: number) => {
    const cached = await cacheService.get(month, year);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result?.data) {
          await cacheService.set(month, year, result.data);
          return result.data;
        }
      }
    } catch (error) {
      console.error(`Lỗi preload tháng ${month}/${year}:`, error);
    }
    return null;
  }, [cacheService]);

  return {
    cacheService,
    clearCache,
    getCacheStats,
    preloadMonth,
    preloadImportantMonths
  };
};

export default useCacheManager;