// constants.ts - Vietnamese constants for QuranReader
import type { NgonNgu, VanBanGiaoDien } from './types';

// Languages configuration
export const NGON_NGU: readonly NgonNgu[] = [
  { code: 'id', name: 'Tiếng Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'Tiếng Anh', flag: '🇺🇸' },
  { code: 'ms', name: 'Tiếng Malay', flag: '🇲🇾' },
] as const;

// Vietnamese UI text constants
export const VAN_BAN_GIAO_DIEN: VanBanGiaoDien = {
  title: 'Đọc Quran',
  loading: 'Đang tải Quran...',
  errorLoadingContent: 'Lỗi khi tải nội dung Quran',
  selectSurah: 'Chọn Surah',
  settings: 'Cài đặt',
  settingsDescription: 'Tùy chỉnh cài đặt đọc Quran',
  translation: 'Bản dịch',
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

// Default values
export const GIA_TRI_MAC_DINH = {
  NGON_NGU_MAC_DINH: 'id',
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
