// Storage utilities for Quran favorites and bookmarks
export interface QuranBookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  translation?: string;
  timestamp: number;
}

export interface QuranFavorite {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  translation?: string;
  timestamp: number;
}

const STORAGE_KEYS = {
  QURAN_FAVORITES: 'quran_favorites',
  QURAN_BOOKMARKS: 'quran_bookmarks',
  QURAN_FONT_SIZE: 'quran_font_size',
} as const;

export const quranStorageUtils = {
  // Favorites
  getFavorites: (): QuranFavorite[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_FAVORITES) || '[]');
    } catch {
      return [];
    }
  },

  setFavorites: (favorites: QuranFavorite[]): void => {
    localStorage.setItem(STORAGE_KEYS.QURAN_FAVORITES, JSON.stringify(favorites));
  },

  addFavorite: (favorite: Omit<QuranFavorite, 'timestamp'>): void => {
    const favorites = quranStorageUtils.getFavorites();
    const newFavorite: QuranFavorite = {
      ...favorite,
      timestamp: Date.now()
    };
    
    // Check if already exists
    const exists = favorites.some(f => 
      f.surahNumber === favorite.surahNumber && f.ayahNumber === favorite.ayahNumber
    );
    
    if (!exists) {
      favorites.push(newFavorite);
      quranStorageUtils.setFavorites(favorites);
    }
  },

  removeFavorite: (surahNumber: number, ayahNumber: number): void => {
    const favorites = quranStorageUtils.getFavorites();
    const filtered = favorites.filter(f => 
      !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
    );
    quranStorageUtils.setFavorites(filtered);
  },

  isFavorite: (surahNumber: number, ayahNumber: number): boolean => {
    const favorites = quranStorageUtils.getFavorites();
    return favorites.some(f => 
      f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
    );
  },

  // Bookmarks
  getBookmarks: (): QuranBookmark[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_BOOKMARKS) || '[]');
    } catch {
      return [];
    }
  },

  setBookmarks: (bookmarks: QuranBookmark[]): void => {
    localStorage.setItem(STORAGE_KEYS.QURAN_BOOKMARKS, JSON.stringify(bookmarks));
  },

  addBookmark: (bookmark: Omit<QuranBookmark, 'timestamp'>): void => {
    const bookmarks = quranStorageUtils.getBookmarks();
    const newBookmark: QuranBookmark = {
      ...bookmark,
      timestamp: Date.now()
    };
    
    // Check if already exists
    const exists = bookmarks.some(b => 
      b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber
    );
    
    if (!exists) {
      bookmarks.push(newBookmark);
      quranStorageUtils.setBookmarks(bookmarks);
    }
  },

  removeBookmark: (surahNumber: number, ayahNumber: number): void => {
    const bookmarks = quranStorageUtils.getBookmarks();
    const filtered = bookmarks.filter(b => 
      !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
    );
    quranStorageUtils.setBookmarks(filtered);
  },

  isBookmarked: (surahNumber: number, ayahNumber: number): boolean => {
    const bookmarks = quranStorageUtils.getBookmarks();
    return bookmarks.some(b => 
      b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  },

  // Font Size
  getFontSize: (): number => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QURAN_FONT_SIZE);
      return saved ? parseFloat(saved) : 1.0; // Default 100%
    } catch {
      return 1.0;
    }
  },

  setFontSize: (fontSize: number): void => {
    localStorage.setItem(STORAGE_KEYS.QURAN_FONT_SIZE, fontSize.toString());
  },

  // Utility functions
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.QURAN_FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.QURAN_BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.QURAN_FONT_SIZE);
  },

  getStats: () => {
    return {
      favoritesCount: quranStorageUtils.getFavorites().length,
      bookmarksCount: quranStorageUtils.getBookmarks().length,
      fontSize: quranStorageUtils.getFontSize()
    };
  }
};

export default quranStorageUtils;
