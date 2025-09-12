// src/components/Utilities/Prayers/hooks.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Location, PrayerTimes } from './types';
import { INTERNATIONAL_LOCATIONS, CALCULATION_METHODS } from './constants';
import { findNearestLocation, calculatePrayerTimes, calculateQiblaDirection, findNextPrayer } from './utils';

// Extract static keys for better performance
const STORAGE_KEYS = {
  SELECTED_LOCATION: 'prayer-selected-location',
  USER_LOCATION: 'prayer-user-location'
} as const;

export const useLocation = () => {
  // Memoized initial location retrieval
  const initialLocation = useMemo(() => {
    try {
      const savedLocation = localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
      if (savedLocation) {
        return JSON.parse(savedLocation);
      }
      
      const savedUserLocation = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      if (savedUserLocation) {
        return JSON.parse(savedUserLocation);
      }
      
      return INTERNATIONAL_LOCATIONS[0];
    } catch (error) {
      console.error('Error parsing saved location:', error);
      return INTERNATIONAL_LOCATIONS[0];
    }
  }, []);
  
  const [selectedLocation, setSelectedLocation] = useState<Location>(initialLocation);
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Memoized geolocation options
  const geolocationOptions = useMemo(() => ({
    enableHighAccuracy: true,
    timeout: 10000
  }), []);
  
  const requestUserLocation = useCallback(() => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      setIsLoadingLocation(false);
      alert('Trình duyệt không hỗ trợ định vị. Sử dụng vị trí mặc định.');
      return;
    }
    
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const nearestLocation = findNearestLocation(latitude, longitude);
      
      const userLocation = {
        ...nearestLocation,
        name: `Vị trí của tôi (${nearestLocation.name})`
      };
      
      setSelectedLocation(userLocation);
      localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(userLocation));
      setIsLoadingLocation(false);
    };
    
    const handleError = (error: GeolocationPositionError) => {
      console.log('Không thể truy cập vị trí:', error);
      setIsLoadingLocation(false);
      alert('Bạn đã từ chối truy cập vị trí. Sử dụng vị trí mặc định (TP. Hồ Chí Minh).');
    };
    
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );
  }, [geolocationOptions]);

  // Memoized localStorage update
  const updateLocationStorage = useCallback((location: Location) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(location));
  }, []);
  
  useEffect(() => {
    updateLocationStorage(selectedLocation);
  }, [selectedLocation, updateLocationStorage]);

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

  // Memoized calculation method
  const calculationMethod = useMemo(() => 
    CALCULATION_METHODS[calculationMethodIndex], [calculationMethodIndex]);
  
  // Memoized date object
  const dateObject = useMemo(() => new Date(selectedDate), [selectedDate]);
  
  // Memoized qibla calculation
  const memoizedQiblaDirection = useMemo(() => 
    calculateQiblaDirection(location), [location]);

  useEffect(() => {
    const times = calculatePrayerTimes(location, dateObject, calculationMethod);
    setPrayerTimes(times);
    setQiblaDirection(memoizedQiblaDirection);
  }, [location, dateObject, calculationMethod, memoizedQiblaDirection]);

  return { prayerTimes, qiblaDirection };
};

export const useNextPrayer = (prayerTimes: PrayerTimes | null) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState({
    nextPrayer: '',
    timeToNext: '',
    progressPercentage: 0
  });

  // Memoized timer setup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Memoized next prayer calculation
  const calculatedNextPrayerInfo = useMemo(() => {
    if (!prayerTimes) {
      return {
        nextPrayer: '',
        timeToNext: '',
        progressPercentage: 0
      };
    }
    return findNextPrayer(prayerTimes, currentTime);
  }, [prayerTimes, currentTime]);

  useEffect(() => {
    setNextPrayerInfo(calculatedNextPrayerInfo);
  }, [calculatedNextPrayerInfo]);

  return { currentTime, nextPrayerInfo };
};