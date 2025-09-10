// src/components/Utilities/Prayers/types.ts

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CalculationMethod {
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export interface PrayerInfo {
  name: string;
  time: string;
  displayName: string;
  icon: string;
}