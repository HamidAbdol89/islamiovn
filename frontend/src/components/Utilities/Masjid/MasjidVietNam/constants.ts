// Vietnamese Constants for MasjidVietnam Component

export const VIETNAMESE_TEXT = {
  // Header
  title: 'Masjid Việt Nam 🇻🇳',
  subtitle: 'Danh bạ các Masjid trên toàn quốc',
  
  // Important Notice
  importantNotice: {
    title: 'Lưu ý quan trọng:',
    content: 'Dữ liệu hiện đang được thu thập và có thể chưa chính xác. Vui lòng liên hệ trực tiếp với cộng đồng Muslim địa phương để xác minh thông tin.'
  },
  
  // Search & Filter
  search: {
    placeholder: 'Tìm kiếm theo tên, thành phố...',
    resultsCount: 'Tìm thấy {count} masjid',
    noResults: 'Không tìm thấy masjid nào phù hợp với tiêu chí tìm kiếm.'
  },
  
  // Regions
  regions: {
    all: 'Tất cả',
    northern: 'Miền Bắc', 
    central: 'Miền Trung',
    southern: 'Miền Nam'
  },
  
  // Card Content
  card: {
    capacity: 'Sức chứa: {count} người',
    established: 'Thành lập: {year}',
    moreFeatures: '+{count} tiện ích khác'
  },
  
  // Modal Content
  modal: {
    description: 'Mô tả',
    prayerTimes: 'Thời gian cầu nguyện',
    facilities: 'Tiện ích',
    website: 'Website',
    close: 'Đóng'
  },
  
  // Prayer Times
  prayers: {
    fajr: 'Fajr',
    dhuhr: 'Dhuhr', 
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  },
  
  // Prayer Times
  prayerTimes: {
    title: 'Thời gian cầu nguyện',
    fajr: 'Fajr',
    dhuhr: 'Dhuhr', 
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha'
  },
  
  // Loading & Error States
  loading: 'Đang tải...',
  error: 'Có lỗi xảy ra',
  retry: 'Thử lại'
} as const;

export const VUNG_VIET_NAM = [
  VIETNAMESE_TEXT.regions.all,
  VIETNAMESE_TEXT.regions.northern,
  VIETNAMESE_TEXT.regions.central,
  VIETNAMESE_TEXT.regions.southern
] as const;

// Badge colors for different regions
export const REGION_BADGE_COLORS = {
  [VIETNAMESE_TEXT.regions.northern]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  [VIETNAMESE_TEXT.regions.central]: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  [VIETNAMESE_TEXT.regions.southern]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  [VIETNAMESE_TEXT.regions.all]: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
} as const;

export const REGION_MAPPING = {
  'All': VIETNAMESE_TEXT.regions.all,
  'Northern': VIETNAMESE_TEXT.regions.northern,
  'Central': VIETNAMESE_TEXT.regions.central,
  'Southern': VIETNAMESE_TEXT.regions.southern
} as const;

export const REVERSE_REGION_MAPPING = {
  [VIETNAMESE_TEXT.regions.all]: 'All',
  [VIETNAMESE_TEXT.regions.northern]: 'Northern', 
  [VIETNAMESE_TEXT.regions.central]: 'Central',
  [VIETNAMESE_TEXT.regions.southern]: 'Southern'
} as const;

export const DEFAULT_IMAGE = "/images/mosque-default.webp";
