import { useState, useCallback } from 'react';
import type { UseCalendarNavigationReturn } from '../types';
import { ANIMATION_CONFIG } from '../constants';

export const useCalendarNavigation = (): UseCalendarNavigationReturn => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Điều hướng tháng với hiệu ứng mượt mà
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (direction === 'prev') {
        if (currentMonth === 1) {
          setCurrentMonth(12);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 12) {
          setCurrentMonth(1);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
      setIsTransitioning(false);
    }, ANIMATION_CONFIG.NAVIGATION_DELAY);
  }, [currentMonth, currentYear, isTransitioning]);

  // Về tháng hiện tại
  const goToCurrentMonth = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
  }, []);

  return {
    currentMonth,
    currentYear,
    isTransitioning,
    navigateMonth,
    goToCurrentMonth
  };
};
