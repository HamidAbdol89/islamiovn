import { API_BASE, VIETNAMESE_TEXT } from './constants';
import type { Category, HadithSummary, HadithDetail, ApiResponse } from './types';

// API functions
export const hadithApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE}/categories/roots/?language=vi`);
    if (!response.ok) throw new Error(VIETNAMESE_TEXT.ERRORS.LOAD_CATEGORIES);
    return response.json();
  },

  getHadiths: async (categoryId: number, page: number = 1): Promise<ApiResponse<HadithSummary>> => {
    const response = await fetch(
      `${API_BASE}/hadeeths/list/?language=vi&category_id=${categoryId}&page=${page}&per_page=12`
    );
    if (!response.ok) throw new Error(VIETNAMESE_TEXT.ERRORS.LOAD_HADITHS);
    return response.json();
  },

  getHadithDetail: async (hadithId: number): Promise<HadithDetail> => {
    const response = await fetch(`${API_BASE}/hadeeths/one/?language=vi&id=${hadithId}`);
    if (!response.ok) throw new Error(VIETNAMESE_TEXT.ERRORS.LOAD_DETAIL);
    return response.json();
  },
};
