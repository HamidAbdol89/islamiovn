import { Moon, Sun, Globe } from 'lucide-react';
import type { ThemeOption } from './types';

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { id: 'light', name: 'Sáng', icon: Sun },
  { id: 'dark', name: 'Tối', icon: Moon },
  { id: 'islamic', name: 'Hồi giáo', icon: Globe }
] as const;

export const SHARE_DATA = {
  title: 'Muslim Việt - Ứng dụng Hồi giáo',
  text: 'Khám phá ứng dụng Muslim Việt với đầy đủ tính năng: Lịch Hijri, Hadith, Tin tức Hồi giáo và nhiều hơn nữa!',
} as const;

export const MESSAGES = {
  SHARE_SUCCESS: 'Đã sao chép thông tin ứng dụng vào clipboard!',
  SHARE_ERROR: 'Không thể chia sẻ ứng dụng',
} as const;

export const SECTION_TITLES = {
  CUSTOMIZATION: 'Tùy chỉnh',
  SAVED: 'Đã lưu',
  GENERAL: 'Chung',
  OTHER: 'Khác',
} as const;

export const SETTING_LABELS = {
  THEME: 'Chủ đề',
  LANGUAGE: 'Ngôn ngữ',
  SAVED_HADITH: 'Hadith đã lưu',
  SAVED_QURAN: 'Quran đã lưu',
  LOCATION: 'Vị trí & Phương pháp tính',
  CALENDAR_ADJUSTMENT: 'Điều chỉnh lịch Hồi giáo',
  REMINDER_TYPE: 'Loại nhắc nhở',
  WIDGET_SYNC: 'Đồng bộ Widget màn hình chính',
  BACKUP_RESTORE: 'Sao lưu & Khôi phục',
  EXPORT_PRAYER_TIMES: 'Xuất thời gian cầu nguyện',
  SHARE_APP: 'Chia sẻ ứng dụng',
  PRIVACY_POLICY: 'Chính sách quyền riêng tư',
} as const;
