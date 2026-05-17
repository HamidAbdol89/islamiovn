// api.ts - robust version (fixed 404 + fallback + safer handling)

import { VITE_API_BASE, VIETNAMESE_TEXT } from './constants';
import type {
  Category,
  HadithSummary,
  HadithDetail,
  ApiResponse,
} from './types';

const request = async (url: string, errorMsg: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    console.warn('API Error:', url, response.status);
    throw new Error(errorMsg);
  }

  return response.json();
};

export const hadithApi = {
  // ─────────────────────────────
  // Categories
  // ─────────────────────────────
  getCategories: async (): Promise<Category[]> => {
    return request(
      `${VITE_API_BASE}/categories/roots/?language=vi`,
      VIETNAMESE_TEXT.ERRORS.LOAD_CATEGORIES
    );
  },

  // ─────────────────────────────
  // List hadiths by category
  // ─────────────────────────────
  getHadiths: async (
    categoryId: number,
    page: number = 1
  ): Promise<ApiResponse<HadithSummary>> => {
    const url = `${VITE_API_BASE}/hadeeths/list/?language=vi&category_id=${categoryId}&page=${page}&per_page=12`;

    const data = await request(url, VIETNAMESE_TEXT.ERRORS.LOAD_HADITHS);

    // debug nhẹ để tránh sai field id
    console.log('Hadith list sample:', data?.data?.[0]);

    return data;
  },

  // ─────────────────────────────
  // Get single hadith (FIXED + fallback)
  // ─────────────────────────────
  getHadithDetail: async (hadithId: number): Promise<HadithDetail> => {
    if (!hadithId) {
      throw new Error('Invalid hadith id');
    }

    const urls = [
      // ưu tiên tiếng Việt
      `${VITE_API_BASE}/hadeeths/one/?language=vi&id=${hadithId}`,

      // fallback tiếng Anh
      `${VITE_API_BASE}/hadeeths/one/?language=en&id=${hadithId}`,
    ];

    let lastError: any = null;

    for (const url of urls) {
      try {
        const data = await request(url, VIETNAMESE_TEXT.ERRORS.LOAD_DETAIL);

        console.log('Hadith detail loaded from:', url);

        return data;
      } catch (err) {
        lastError = err;
        console.warn('Failed:', url);
      }
    }

    throw lastError || new Error(VIETNAMESE_TEXT.ERRORS.LOAD_DETAIL);
  },
};