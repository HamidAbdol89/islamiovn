import { useState, useCallback, useMemo } from 'react';
import type{ NgayLich, DuLieuThang, UseCalendarDataReturn } from '../types';
import { API_CONFIG } from '../constants';
import CalendarCacheService from '../services/cacheService';

export const useCalendarData = (): UseCalendarDataReturn => {
  const [monthData, setMonthData] = useState<NgayLich[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataCache] = useState<Map<string, NgayLich[]>>(new Map()); // Giữ lại để tương thích

  // Cache service instance
  const cacheService = useMemo(() => CalendarCacheService.getInstance(), []);

  // URL API được memoized
  const apiBaseUrl = useMemo(() => `${API_CONFIG.BASE_URL}/${API_CONFIG.CALENDAR_ENDPOINT}`, []);

  // Hàm tải dữ liệu tháng với cache nâng cao
  const fetchMonthData = useCallback(async (month: number, year: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Kiểm tra cache service trước
      const cachedData = await cacheService.get(month, year);
      if (cachedData) {
        setMonthData(cachedData);
        setLoading(false);
        
        // Preload các tháng liền kề trong background
        cacheService.preloadAdjacentMonths(month, year);
        return;
      }

      // Nếu không có cache, gọi API
      const response = await fetch(`${apiBaseUrl}/${month}/${year}`);
      
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu lịch Hijri');
      }
      
      const data: DuLieuThang = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        setMonthData(data.data);
        
        // Lưu vào cache service
        await cacheService.set(month, year, data.data);
        
        // Preload các tháng liền kề
        cacheService.preloadAdjacentMonths(month, year);
      } else {
        throw new Error('Dữ liệu API không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      console.error('Lỗi tải dữ liệu Hijri:', err);
    } finally {
      setLoading(false);
    }
  }, [cacheService, apiBaseUrl]);

  return {
    monthData,
    loading,
    error,
    fetchMonthData,
    dataCache
  };
};
