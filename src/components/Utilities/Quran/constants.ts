// constants.ts - Vietnamese constants for QuranReader
import type { NgonNgu, VanBanGiaoDien } from './types';

// Languages configuration - UPDATED: Added Vietnamese
export const NGON_NGU: readonly NgonNgu[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Tiếng Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'Tiếng Anh', flag: '🇺🇸' },
  { code: 'ar', name: 'Tiếng Arap', flag: '🇦🇪' },
] as const;

// Vietnamese UI text constants
export const VAN_BAN_GIAO_DIEN: VanBanGiaoDien = {
  title: 'Đọc Quran',
  loading: 'Đang tải Quran...',
  errorLoadingContent: 'Lỗi khi tải nội dung Quran',
  errorLoadingTranslation: 'Lỗi khi tải bản dịch',
  retryTranslation: 'Thử lại bản dịch',
  settings: 'Cài đặt',
  settingsDescription: 'Tùy chỉnh cài đặt đọc Quran',
  translation: 'Bản dịch',
  translationUnavailable: 'Bản dịch không có sẵn',
  footnotes: 'Ghi chú',
  tajweed: 'Tajweed',
  tajweedGuide: 'Hướng dẫn Tajweed',
  tajweedLegend: 'Hướng dẫn Tajweed',
  language: 'Ngôn ngữ',
  languageLabel: 'Ngôn ngữ',
  displayOptions: 'Tùy chọn hiển thị',
  volume: 'Âm lượng',
  verses: 'câu',
  failedToPlay: 'Không thể phát audio',
  failedToLoad: 'Không thể tải audio',
  refresh: 'Làm mới',
  back: 'Quay lại',
  verse: 'Câu',
  surah: 'Surah',
  play: 'Phát',
  pause: 'Tạm dừng',
  next: 'Tiếp theo',
  previous: 'Trước đó'
} as const;

// Default values - UPDATED: Changed default language to Vietnamese
export const GIA_TRI_MAC_DINH = {
  NGON_NGU_MAC_DINH: 'vi', // Changed from 'id' to 'vi'
  AM_LUONG_MAC_DINH: 1,
  HIEN_THI_BAN_DICH: true,
  HIEN_THI_TAJWEED: false,
  HIEN_THI_HUONG_DAN_TAJWEED: false,
  THOI_GIAN_CHO_AUTO_PLAY: 1000,
  THOI_GIAN_CHO_CHUYEN_CAU: 500,
  THOI_GIAN_CHO_CHUYEN_SURAH: 2000,
  TIMEOUT_TAI_AUDIO: 10000,
  SO_SURAH_TOI_DA: 114
} as const;