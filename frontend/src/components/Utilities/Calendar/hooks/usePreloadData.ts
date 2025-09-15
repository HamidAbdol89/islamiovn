import { useCallback } from 'react';
import { API_CONFIG } from '../constants';
import type { DuLieuThang } from '../types';

export const usePreloadData = (
  dataCache: Map<string, any[]>,
  setDataCache: React.Dispatch<React.SetStateAction<Map<string, any[]>>>
) => {
  // Tải trước các tháng liền kề
  const preloadAdjacentMonths = useCallback(async (month: number, year: number) => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const prevKey = `${prevMonth}-${prevYear}`;
    const nextKey = `${nextMonth}-${nextYear}`;

    // Tải trước tháng trước
    if (!dataCache.has(prevKey)) {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.CALENDAR_ENDPOINT}/${prevMonth}/${prevYear}`
        );
        if (response.ok) {
          const data: DuLieuThang = await response.json();
          if (data && data.data) {
            setDataCache(prev => new Map(prev).set(prevKey, data.data));
          }
        }
      } catch (err) {
        console.log('Tải trước tháng trước thất bại:', err);
      }
    }

    // Tải trước tháng sau
    if (!dataCache.has(nextKey)) {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/${API_CONFIG.CALENDAR_ENDPOINT}/${nextMonth}/${nextYear}`
        );
        if (response.ok) {
          const data: DuLieuThang = await response.json();
          if (data && data.data) {
            setDataCache(prev => new Map(prev).set(nextKey, data.data));
          }
        }
      } catch (err) {
        console.log('Tải trước tháng sau thất bại:', err);
      }
    }
  }, [dataCache, setDataCache]);

  return { preloadAdjacentMonths };
};
