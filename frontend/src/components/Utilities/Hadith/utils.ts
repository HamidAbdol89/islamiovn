import { STORAGE_KEYS } from './constants';

// Storage utilities
export const storageUtils = {
  getFavorites: (): number[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    } catch {
      return [];
    }
  },
  
  setFavorites: (favorites: number[]): void => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },
  
  getBookmarks: (): number[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    } catch {
      return [];
    }
  },
  
  setBookmarks: (bookmarks: number[]): void => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  },
};
