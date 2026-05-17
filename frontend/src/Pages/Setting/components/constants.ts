import { Moon, Sun } from 'phosphor-react';
import type { ThemeOption } from './types';

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { id: 'light', name: 'Sáng', icon: Sun },
  { id: 'dark',  name: 'Tối',  icon: Moon },
] as const;

export const SHARE_DATA = {
  title: 'Islam.io.vn - Ứng dụng Hồi giáo',
  text:  'Khám phá Islam.io.vn với đầy đủ tính năng: Lịch Hijri, Hadith, Tin tức Hồi giáo và nhiều hơn nữa!',
} as const;

export const MESSAGES = {
  SHARE_SUCCESS: 'Đã sao chép thông tin ứng dụng vào clipboard!',
  SHARE_ERROR:   'Không thể chia sẻ ứng dụng',
} as const;

export const SECTION_TITLES = {
  ACCOUNT:       'Tài khoản',
  CUSTOMIZATION: 'Tùy chỉnh',
  SAVED:         'Đã lưu',
  GENERAL:       'Chung',
  OTHER:         'Khác',
} as const;

export const SETTING_LABELS = {
  THEME:              'Chủ đề',
  LANGUAGE:           'Ngôn ngữ',
  SAVED_HADITH:       'Hadith đã lưu',
  SAVED_QURAN:        'Quran đã lưu',
  LOCATION:           'Vị trí & Phương pháp tính',
  CALENDAR_ADJUSTMENT:'Điều chỉnh lịch Hồi giáo',
  REMINDER_TYPE:      'Nhắc nhở Salah',
  WIDGET_SYNC:        'Đồng bộ Widget màn hình chính',
  BACKUP_RESTORE:     'Sao lưu & Khôi phục',
  EXPORT_PRAYER_TIMES:'Xuất thời gian cầu nguyện',
  SHARE_APP:          'Chia sẻ ứng dụng',
  PRIVACY_POLICY:     'Chính sách quyền riêng tư',
  GOOGLE_LOGIN:       'Đăng nhập Google',
  ACCOUNT:            'Tài khoản',
  LOGOUT:             'Đăng xuất',
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS:  'Đăng nhập thành công!',
  LOGIN_ERROR:    'Không thể đăng nhập. Vui lòng thử lại.',
  LOGOUT_SUCCESS: 'Đã đăng xuất thành công!',
  LOGOUT_ERROR:   'Không thể đăng xuất. Vui lòng thử lại.',
  LOADING:        'Đang xử lý...',
  WELCOME_BACK:   'Chào mừng trở lại',
  NOT_SIGNED_IN:  'Chưa đăng nhập',
  SIGN_IN_TO_SYNC:'Đăng nhập để đồng bộ dữ liệu',
} as const;
