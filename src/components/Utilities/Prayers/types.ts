// src/components/Utilities/Prayers/types.ts

// Optimized interfaces with readonly properties for better performance and immutability

export interface PrayerTimes {
  readonly fajr: string;
  readonly sunrise: string;
  readonly dhuhr: string;
  readonly asr: string;
  readonly maghrib: string;
  readonly isha: string;
}

export interface Location {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly timezone: string;
}

export interface CalculationMethod {
  readonly name: string;
  readonly fajrAngle: number;
  readonly ishaAngle: number;
}

export interface PrayerInfo {
  readonly name: string;
  readonly time: string;
  readonly displayName: string;
  readonly icon: string;
}

// Additional type definitions for better type safety
export type PrayerName = keyof PrayerTimes;

export interface NextPrayerInfo {
  readonly nextPrayer: string;
  readonly timeToNext: string;
  readonly progressPercentage: number;
}

// Utility types for component props
export interface LocationHookReturn {
  readonly selectedLocation: Location;
  readonly setSelectedLocation: (location: Location) => void;
  readonly isLoadingLocation: boolean;
  readonly requestUserLocation: () => void;
}

export interface PrayerTimesHookReturn {
  readonly prayerTimes: PrayerTimes | null;
  readonly qiblaDirection: number;
}

export interface NextPrayerHookReturn {
  readonly currentTime: Date;
  readonly nextPrayerInfo: NextPrayerInfo;
}