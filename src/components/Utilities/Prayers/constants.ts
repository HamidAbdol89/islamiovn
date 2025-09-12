// src/components/Utilities/Prayers/constants.ts

import type { Location, CalculationMethod } from './types';

// Extract static data outside for better performance and prevent re-creation

// Memoized international locations - frozen for immutability and performance
export const INTERNATIONAL_LOCATIONS: readonly Location[] = Object.freeze([
  // Việt Nam
  { name: "TP. Hồ Chí Minh, Việt Nam", latitude: 10.8231, longitude: 106.6297, timezone: "Asia/Ho_Chi_Minh" },
  { name: "Hà Nội, Việt Nam", latitude: 21.0285, longitude: 105.8542, timezone: "Asia/Ho_Chi_Minh" },
  { name: "Đà Nẵng, Việt Nam", latitude: 16.0471, longitude: 108.2068, timezone: "Asia/Ho_Chi_Minh" },
  { name: "Cần Thơ, Việt Nam", latitude: 10.0452, longitude: 105.7469, timezone: "Asia/Ho_Chi_Minh" },
  { name: "An Giang, Việt Nam", latitude: 10.5, longitude: 105.1667, timezone: "Asia/Ho_Chi_Minh" },
  { name: "Ninh Thuận, Việt Nam", latitude: 11.5753, longitude: 108.9888, timezone: "Asia/Ho_Chi_Minh" },
  { name: "Bình Thuận, Việt Nam", latitude: 10.9299, longitude: 108.1022, timezone: "Asia/Ho_Chi_Minh" },

  // Châu Á
  { name: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore" },
  { name: "Malaysia", latitude: 3.1390, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur" },
  { name: "Thái Lan", latitude: 13.7563, longitude: 100.5018, timezone: "Asia/Bangkok" },
  { name: "Indonesia", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta" },
  { name: "Philippines", latitude: 14.5995, longitude: 120.9842, timezone: "Asia/Manila" },
  { name: "Campuchia", latitude: 11.5564, longitude: 104.9282, timezone: "Asia/Phnom_Penh" },
  { name: "Lào", latitude: 17.9757, longitude: 102.6331, timezone: "Asia/Vientiane" },
  { name: "Myanmar", latitude: 16.8661, longitude: 96.1951, timezone: "Asia/Yangon" },
  { name: "Trung Quốc", latitude: 39.9042, longitude: 116.4074, timezone: "Asia/Shanghai" },
  { name: "Nhật Bản", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo" },
  { name: "Hàn Quốc", latitude: 37.5665, longitude: 126.9780, timezone: "Asia/Seoul" },
  { name: "Đài Loan", latitude: 25.0330, longitude: 121.5654, timezone: "Asia/Taipei" },
  { name: "Hồng Kông", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong" },
  { name: "Ấn Độ", latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata" },
  { name: "Pakistan", latitude: 33.6844, longitude: 73.0479, timezone: "Asia/Karachi" },
  { name: "Bangladesh", latitude: 23.8103, longitude: 90.4125, timezone: "Asia/Dhaka" },
  { name: "Sri Lanka", latitude: 6.9271, longitude: 79.8612, timezone: "Asia/Colombo" },
  { name: "Nepal", latitude: 27.7172, longitude: 85.3240, timezone: "Asia/Kathmandu" },

  // Châu Âu
  { name: "Anh Quốc", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London" },
  { name: "Pháp", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris" },
  { name: "Đức", latitude: 52.5200, longitude: 13.4050, timezone: "Europe/Berlin" },
  { name: "Ý", latitude: 41.9028, longitude: 12.4964, timezone: "Europe/Rome" },
  { name: "Tây Ban Nha", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid" },
  { name: "Hà Lan", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam" },
  { name: "Bỉ", latitude: 50.8503, longitude: 4.3517, timezone: "Europe/Brussels" },
  { name: "Thụy Sĩ", latitude: 46.9480, longitude: 7.4474, timezone: "Europe/Zurich" },
  { name: "Áo", latitude: 48.2082, longitude: 16.3738, timezone: "Europe/Vienna" },
  { name: "Thụy Điển", latitude: 59.3293, longitude: 18.0686, timezone: "Europe/Stockholm" },
  { name: "Na Uy", latitude: 59.9139, longitude: 10.7522, timezone: "Europe/Oslo" },
  { name: "Đan Mạch", latitude: 55.6761, longitude: 12.5683, timezone: "Europe/Copenhagen" },
  { name: "Phần Lan", latitude: 60.1699, longitude: 24.9384, timezone: "Europe/Helsinki" },
  { name: "Ba Lan", latitude: 52.2297, longitude: 21.0122, timezone: "Europe/Warsaw" },
  { name: "Séc", latitude: 50.0755, longitude: 14.4378, timezone: "Europe/Prague" },
  { name: "Bồ Đào Nha", latitude: 38.7223, longitude: -9.1393, timezone: "Europe/Lisbon" },
  { name: "Hy Lạp", latitude: 37.9838, longitude: 23.7275, timezone: "Europe/Athens" },
  { name: "Nga", latitude: 55.7558, longitude: 37.6176, timezone: "Europe/Moscow" },

  // Bắc Mỹ
  { name: "Mỹ - New York", latitude: 40.7128, longitude: -74.0060, timezone: "America/New_York" },
  { name: "Mỹ - Los Angeles", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Canada", latitude: 45.4215, longitude: -75.6972, timezone: "America/Toronto" },
  { name: "Mexico", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City" },

  // Nam Mỹ
  { name: "Brazil", latitude: -15.8267, longitude: -47.9218, timezone: "America/Sao_Paulo" },
  { name: "Argentina", latitude: -34.6118, longitude: -58.3960, timezone: "America/Argentina/Buenos_Aires" },
  { name: "Chile", latitude: -33.4489, longitude: -70.6693, timezone: "America/Santiago" },
  { name: "Colombia", latitude: 4.7110, longitude: -74.0721, timezone: "America/Bogota" },
  { name: "Peru", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima" },

  // Châu Phi
  { name: "Nam Phi", latitude: -25.7479, longitude: 28.2293, timezone: "Africa/Johannesburg" },
  { name: "Nigeria", latitude: 9.0765, longitude: 7.3986, timezone: "Africa/Lagos" },
  { name: "Kenya", latitude: -1.2921, longitude: 36.8219, timezone: "Africa/Nairobi" },
  { name: "Ai Cập", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo" },
  { name: "Morocco", latitude: 33.9716, longitude: -6.8498, timezone: "Africa/Casablanca" },
  { name: "Ghana", latitude: 5.6037, longitude: -0.1870, timezone: "Africa/Accra" },
  { name: "Ethiopia", latitude: 9.1450, longitude: 40.4897, timezone: "Africa/Addis_Ababa" },
  { name: "Tanzania", latitude: -6.7924, longitude: 39.2083, timezone: "Africa/Dar_es_Salaam" },

  // Châu Úc
  { name: "Úc", latitude: -35.2809, longitude: 149.1300, timezone: "Australia/Sydney" },
  { name: "New Zealand", latitude: -41.2865, longitude: 174.7762, timezone: "Pacific/Auckland" },

  // Trung Đông
  { name: "UAE", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  { name: "Ả Rập Saudi", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh" },
  { name: "Qatar", latitude: 25.2854, longitude: 51.5310, timezone: "Asia/Qatar" },
  { name: "Kuwait", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait" },
  { name: "Palestine", latitude: 31.9522, longitude: 35.2332, timezone: "Asia/Gaza" },
  { name: "Thổ Nhĩ Kỳ", latitude: 39.9334, longitude: 32.8597, timezone: "Europe/Istanbul" },
  { name: "Iran", latitude: 35.6892, longitude: 51.3890, timezone: "Asia/Tehran" },
  { name: "Jordan", latitude: 31.9454, longitude: 35.9284, timezone: "Asia/Amman" }
]);

// Memoized calculation methods - frozen for immutability and performance
export const CALCULATION_METHODS: readonly CalculationMethod[] = Object.freeze([
  { name: "Liên đoàn Thế giới Hồi giáo", fajrAngle: 18, ishaAngle: 17 },
  { name: "Cộng đồng Hồi giáo Việt Nam", fajrAngle: 18, ishaAngle: 17 },
  { name: "Đại học Khoa học Hồi giáo, Karachi", fajrAngle: 18, ishaAngle: 18 },
  { name: "Cơ quan Khảo sát Ai Cập", fajrAngle: 19.5, ishaAngle: 17.5 },
  { name: "Đại học Umm Al-Qura, Mecca", fajrAngle: 18.5, ishaAngle: 90 },
  { name: "Hiệp hội Hồi giáo Bắc Mỹ (ISNA)", fajrAngle: 15, ishaAngle: 15 },
  { name: "Ủy ban Quan sát Mặt trăng Toàn cầu", fajrAngle: 18, ishaAngle: 18 },
  { name: "Sở Tôn giáo Thổ Nhĩ Kỳ", fajrAngle: 18, ishaAngle: 17 },
  { name: "Viện Địa vật lý Iran", fajrAngle: 17.7, ishaAngle: 14 },
  { name: "Shia Ithna-Ashari (Viện Leva)", fajrAngle: 16, ishaAngle: 14 },
  { name: "Hội đồng Tôn giáo Hồi giáo Singapore", fajrAngle: 20, ishaAngle: 18 },
  { name: "Liên hiệp Tổ chức Hồi giáo Pháp", fajrAngle: 12, ishaAngle: 12 },
  { name: "Liên bang Nga", fajrAngle: 16, ishaAngle: 15 }
]);

// Frozen prayer names for better performance
export const PRAYER_NAMES = Object.freeze({
  fajr: 'Fajr',
  sunrise: 'Bình minh', 
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha'
} as const);

// Frozen Vietnamese prayer names for better performance
export const PRAYER_NAMES_VIETNAMESE = Object.freeze({
  fajr: 'Cầu nguyện Sáng',
  sunrise: 'Bình minh',
  dhuhr: 'Cầu nguyện Trưa', 
  asr: 'Cầu nguyện Chiều',
  maghrib: 'Cầu nguyện Chiều tối',
  isha: 'Cầu nguyện Tối'
} as const);

// Frozen prayer icons for better performance
export const PRAYER_ICONS = Object.freeze({
  fajr: '🌅',
  sunrise: '☀️',
  dhuhr: '🌞', 
  asr: '🌤️',
  maghrib: '🌅',
  isha: '🌙'
} as const);

// Type-safe prayer keys for better TypeScript support
export type PrayerKey = keyof typeof PRAYER_NAMES;

// Memoized prayer list for components that need ordered prayer data
export const PRAYER_ORDER: readonly PrayerKey[] = Object.freeze([
  'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'
] as const);

// Default location index for fallback scenarios
export const DEFAULT_LOCATION_INDEX = 0;

// Default calculation method index
export const DEFAULT_CALCULATION_METHOD_INDEX = 0;