// Hằng số cho lịch Hijri - tiếng Việt
export const THANG_HIJRI_VI = [
  'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
] as const;

// Hằng số cho lịch Gregorian - tiếng Việt
export const THANG_GREGORIAN_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
] as const;

// Hằng số cho các ngày trong tuần - tiếng Việt
export const THU_TRONG_TUAN_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

// Văn bản giao diện tiếng Việt
export const VAN_BAN_VI = {
  // Tiêu đề và nhãn
  LICH_HIJRI: 'Lịch Hijri',
  LICH_GREGORIAN: 'Lịch Dương',
  CHI_TIET_NGAY: 'Chi tiết ngày',
  LE_DAC_BIET: 'Lễ đặc biệt',
  DANG_TAI: 'Đang tải lịch Hijri...',
  
  // Nút và hành động
  THU_LAI: 'Thử lại',
  VE_THANG_HIEN_TAI: 'Về tháng hiện tại',
  DONG: 'Đóng',
  
  // Thông báo lỗi
  LOI_TAI_DU_LIEU: 'Không thể tải dữ liệu lịch Hijri',
  LOI_CHUNG: 'Đã xảy ra lỗi',
  
  // Định dạng thời gian
  GIO: 'giờ',
  PHUT: 'phút',
  GIAY: 'giây',
  
  // Trạng thái
  KHONG_CO_DU_LIEU: 'Không có dữ liệu',
  DANG_XU_LY: 'Đang xử lý...',
  HOAN_THANH: 'Hoàn thành'
} as const;

// URL API
export const API_CONFIG = {
  BASE_URL: 'https://api.aladhan.com/v1',
  CALENDAR_ENDPOINT: 'gToHCalendar'
} as const;

// Cấu hình hiệu ứng
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 300,
  NAVIGATION_DELAY: 150,
  PRELOAD_DELAY: 100,
  TIME_UPDATE_INTERVAL: 1000
} as const;

// Cấu hình bộ nhớ đệm
export const CACHE_CONFIG = {
  MAX_CACHE_SIZE: 12, // Lưu tối đa 12 tháng
  PRELOAD_ADJACENT_MONTHS: true
} as const;
