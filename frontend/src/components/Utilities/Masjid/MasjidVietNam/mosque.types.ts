
// src/types/mosque.types.ts
export interface Mosque {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  region?: string;
  phone?: string;
  website?: string;
  capacity?: number;
  foundedYear?: number;
  image?: string;
  prayerTimes?: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  description?: string;
  facilities?: string[];
}
