import { useMemo } from 'react';
import { storageUtils } from '@/components/Utilities/Hadith/utils';
import { quranStorageUtils } from '@/components/Utilities/Quran/utils/storage';
import type { SavedItemCounts } from '../types';

export const useSavedItemCounts = (): SavedItemCounts => {
  return useMemo(() => ({
    hadithFavorites: storageUtils.getFavorites().length,
    hadithBookmarks: storageUtils.getBookmarks().length,
    quranFavorites: quranStorageUtils.getFavorites().length,
    quranBookmarks: quranStorageUtils.getBookmarks().length,
  }), []);
};
