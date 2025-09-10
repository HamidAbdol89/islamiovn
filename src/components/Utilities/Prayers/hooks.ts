// src/components/Utilities/Prayers/hooks.ts

import { useState, useEffect } from 'react';
import type { Location, PrayerTimes } from './types';
import { INTERNATIONAL_LOCATIONS, CALCULATION_METHODS } from './constants';
import { findNearestLocation, calculatePrayerTimes, calculateQiblaDirection, findNextPrayer } from './utils';

export const useLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(INTERNATIONAL_LOCATIONS[0]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const requestUserLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestLocation(latitude, longitude);
          setSelectedLocation(nearestLocation);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('Không thể truy cập vị trí:', error);
          setIsLoadingLocation(false);
          alert('Bạn đã từ chối truy cập vị trí. Sử dụng vị trí mặc định (TP. Hồ Chí Minh).');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Trình duyệt không hỗ trợ định vị. Sử dụng vị trí mặc định.');
    }
  };

  return {
    selectedLocation,
    setSelectedLocation,
    isLoadingLocation,
    requestUserLocation
  };
};

export const usePrayerTimes = (location: Location, selectedDate: string, calculationMethodIndex: number) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);

  useEffect(() => {
    const date = new Date(selectedDate);
    const method = CALCULATION_METHODS[calculationMethodIndex];
    const times = calculatePrayerTimes(location, date, method);
    setPrayerTimes(times);
    setQiblaDirection(calculateQiblaDirection(location));
  }, [location, selectedDate, calculationMethodIndex]);

  return { prayerTimes, qiblaDirection };
};

export const useNextPrayer = (prayerTimes: PrayerTimes | null) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState({
    nextPrayer: '',
    timeToNext: '',
    progressPercentage: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const info = findNextPrayer(prayerTimes, currentTime);
      setNextPrayerInfo(info);
    }
  }, [prayerTimes, currentTime]);

  return { currentTime, nextPrayerInfo };
};