// API Configuration
export const API_BASE = 'https://hadeethenc.com/api/v1';

// Query Keys
export const QUERY_KEYS = {
  categories: ['hadith', 'categories'] as const,
  hadiths: (categoryId: number, page: number) => ['hadith', 'list', categoryId, page] as const,
  hadithDetail: (hadithId: number) => ['hadith', 'detail', hadithId] as const,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  categories: {
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  },
  hadiths: {
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  },
  hadithDetail: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  HADITH_PER_PAGE: 12,
  PREVIEW_TEXT_LENGTH: 120,
  MOBILE_PAGINATION_PAGES: 5,
  DESKTOP_PAGINATION_PAGES: 7,
} as const;

// Vietnamese Text Constants
export const VIETNAMESE_TEXT = {
  HEADER: {
    TITLE: 'Hadith Collection',
    SUBTITLE: 'Khám phá kho tàng Hadith bằng tiếng Việt',
    BACK: 'Quay lại',
    AVAILABLE_HADITHS: 'Hadith có sẵn',
    PAGE_INFO: 'Trang',
  },
  ACTIONS: {
    RETRY: 'Thử lại',
    PREVIOUS: 'Trước',
    NEXT: 'Tiếp',
  },
  CONTENT: {
    NO_TITLE: 'Không có tiêu đề',
    NO_PREVIEW: 'Không có nội dung xem trước',
    NO_CONTENT: 'Không có nội dung',
    HADITH_CONTENT: 'Nội dung Hadith',
    EXPLANATION: 'Giải thích',
    BENEFITS: 'Lời ích (Fawāid)',
  },
  ERRORS: {
    LOAD_CATEGORIES: 'Không thể tải danh mục',
    LOAD_HADITHS: 'Không thể tải hadith',
    LOAD_DETAIL: 'Không thể tải chi tiết hadith',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'hadith-favorites',
  BOOKMARKS: 'hadith-bookmarks',
} as const;
