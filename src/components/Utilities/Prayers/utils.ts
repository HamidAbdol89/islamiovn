// src/components/Utilities/Prayers/utils.ts

import type { Location, PrayerTimes, CalculationMethod, PrayerInfo } from './types';
import {  INTERNATIONAL_LOCATIONS } from './constants';

export const calculateHaversineDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Bán kính Trái Đất (km)
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearestLocation = (userLat: number, userLng: number): Location => {
  let nearestLocation = INTERNATIONAL_LOCATIONS[0];
  let minDistance = Infinity;
  
  INTERNATIONAL_LOCATIONS.forEach(location => {
    const distance = calculateHaversineDistance(
      userLat, userLng, 
      location.latitude, location.longitude
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = location;
    }
  });
  
  return nearestLocation;
};

export const calculatePrayerTimes = (
  location: Location, 
  date: Date, 
  method: CalculationMethod
): PrayerTimes => {
  // Chuyển đổi sang múi giờ địa phương
  const localDateStr = date.toLocaleString('en-US', { timeZone: location.timezone });
  const dateInTz = new Date(localDateStr);
  
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;
  
  // Tính toán ngày Julian
  const julianDay = Math.floor(dateInTz.getTime() / 86400000) + 2440587.5;
  const n = julianDay - 2451545;
  
  // Tính toán vị trí mặt trời
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = rad * ((357.528 + 0.9856003 * n) % 360);
  const lambda = rad * (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  
  // Tính góc mặt trời
  const delta = Math.asin(Math.sin(23.439 * rad) * Math.sin(lambda));
  
  const lat = location.latitude * rad;
  const lng = location.longitude;
  
  // Tính giờ Dhuhr (giữa trưa)
  const equationOfTime = -7.655 * Math.sin(g) + 9.873 * Math.sin(2 * g + 1.971);
  const dhuhrTime = 12 + (equationOfTime - lng / 15) / 60;
  
  // Tính các giờ cầu nguyện
  const fajrAngle = method.fajrAngle * rad;
  const ishaAngle = method.ishaAngle * rad;
  
  const fajrTime = dhuhrTime - Math.acos((-Math.sin(fajrAngle) - Math.sin(lat) * Math.sin(delta)) / (Math.cos(lat) * Math.cos(delta))) * deg / 15;
  const sunriseTime = dhuhrTime - Math.acos((-Math.sin(-0.833 * rad) - Math.sin(lat) * Math.sin(delta)) / (Math.cos(lat) * Math.cos(delta))) * deg / 15;
  
  const asrShadowLength = 1; // 1 = Shafi, 2 = Hanafi
  const asrTime = dhuhrTime + (
    Math.acos(
      (
        Math.sin(
          Math.atan(1 / (asrShadowLength + Math.tan(Math.abs(lat - delta))))
        ) - Math.sin(lat) * Math.sin(delta)
      ) / (Math.cos(lat) * Math.cos(delta))
    ) * deg / 15
  );
  
  const maghribTime = dhuhrTime + Math.acos((-Math.sin(-0.833 * rad) - Math.sin(lat) * Math.sin(delta)) / (Math.cos(lat) * Math.cos(delta))) * deg / 15;
  const ishaTime = dhuhrTime + Math.acos((-Math.sin(ishaAngle) - Math.sin(lat) * Math.sin(delta)) / (Math.cos(lat) * Math.cos(delta))) * deg / 15;
  
  const formatTime = (time: number) => {
    time = time % 24;
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return {
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime)
  };
};

export const calculateQiblaDirection = (location: Location): number => {
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;
  
  const lat1 = location.latitude * Math.PI / 180;
  const lat2 = makkahLat * Math.PI / 180;
  const deltaLng = (makkahLng - location.longitude) * Math.PI / 180;
  
  const y = Math.sin(deltaLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);
  
  let qibla = Math.atan2(y, x) * 180 / Math.PI;
  qibla = (qibla + 360) % 360;
  
  return Math.round(qibla);
};

export const findNextPrayer = (
  times: PrayerTimes, 
  current: Date
): { 
  nextPrayer: string; 
  timeToNext: string; 
  progressPercentage: number;
} => {
  const prayerList: PrayerInfo[] = [
    { name: 'Fajr', time: times.fajr, displayName: 'Fajr', icon: '🌅' },
    { name: 'Sunrise', time: times.sunrise, displayName: 'Bình minh', icon: '☀️' },
    { name: 'Dhuhr', time: times.dhuhr, displayName: 'Dhuhr', icon: '🌞' },
    { name: 'Asr', time: times.asr, displayName: 'Asr', icon: '🌤️' },
    { name: 'Maghrib', time: times.maghrib, displayName: 'Maghrib', icon: '🌅' },
    { name: 'Isha', time: times.isha, displayName: 'Isha', icon: '🌙' }
  ];
  
  const currentMinutes = current.getHours() * 60 + current.getMinutes();
  const currentSeconds = currentMinutes * 60 + current.getSeconds();
  
  // Tìm thời gian cầu nguyện trước đó để tính progress
  let previousPrayerSeconds = 0;
  
  for (let i = prayerList.length - 1; i >= 0; i--) {
    const [hours, minutes] = prayerList[i].time.split(':').map(Number);
    const prayerSeconds = (hours * 60 + minutes) * 60;
    
    if (prayerSeconds <= currentSeconds) {
      previousPrayerSeconds = prayerSeconds;
      break;
    }
  }
  
  // Nếu không tìm thấy thời gian cầu nguyện trước đó hôm nay, sử dụng Isha hôm qua
  if (previousPrayerSeconds === 0) {
    const [hours, minutes] = prayerList[5].time.split(':').map(Number);
    previousPrayerSeconds = (hours * 60 + minutes - (24 * 60)) * 60;
  }
  
  for (const prayer of prayerList) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerSeconds = (hours * 60 + minutes) * 60;
    
    if (prayerSeconds > currentSeconds) {
      const diffSeconds = prayerSeconds - currentSeconds;
      const hoursLeft = Math.floor(diffSeconds / 3600);
      const minutesLeft = Math.floor((diffSeconds % 3600) / 60);
      const secondsLeft = diffSeconds % 60;
      
      // Tính progress
      const totalPeriod = prayerSeconds - previousPrayerSeconds;
      const elapsed = currentSeconds - previousPrayerSeconds;
      const progress = totalPeriod > 0 ? (elapsed / totalPeriod) * 100 : 0;
      
      return {
        nextPrayer: `${prayer.icon} ${prayer.displayName}`,
        timeToNext: hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}p` : `${minutesLeft}p ${secondsLeft}s`,
        progressPercentage: Math.min(progress, 100)
      };
    }
  }
  
  // Nếu không tìm thấy thời gian cầu nguyện hôm nay, kế tiếp là Fajr ngày mai
  const [hours, minutes] = prayerList[0].time.split(':').map(Number);
  const prayerSeconds = (hours * 60 + minutes) * 60;
  const diffSeconds = (24 * 3600) - currentSeconds + prayerSeconds;
  const hoursLeft = Math.floor(diffSeconds / 3600);
  const minutesLeft = Math.floor((diffSeconds % 3600) / 60);
  
  // Tính progress từ hiện tại đến nửa đêm
  const totalPeriod = (24 * 3600) - previousPrayerSeconds;
  const elapsed = currentSeconds - previousPrayerSeconds;
  const progress = totalPeriod > 0 ? (elapsed / totalPeriod) * 100 : 0;
  
  return {
    nextPrayer: '🌅 Fajr (ngày mai)',
    timeToNext: hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}p` : `${minutesLeft}p`,
    progressPercentage: Math.min(progress, 100)
  };
};