import { useQuery } from '@tanstack/react-query';
import { useSimpleBookmarkService } from '@/services/simpleBookmarkService';
import { useSimpleFavoriteService } from '@/services/simpleFavoriteService';
import { quranStorageUtils } from '@/components/Utilities/Quran/utils/storage';
import { useAuth } from '@/context/AuthContext';
import type { SavedItemCounts } from '../types';

export const useSavedItemCounts = (): SavedItemCounts => {
  const { isAuthenticated } = useAuth();
  
  // Use simple services
  const favoriteService = useSimpleFavoriteService();
  const bookmarkService = useSimpleBookmarkService();

  // Get hadith favorites (only for authenticated users)
  const { data: hadithFavorites = [] } = useQuery({
    queryKey: ['hadith-favorites-count', isAuthenticated],
    queryFn: () => favoriteService.getFavorites('hadith'),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
  });

  // Get hadith bookmarks (only for authenticated users)
  const { data: hadithBookmarks = [] } = useQuery({
    queryKey: ['hadith-bookmarks-count', isAuthenticated],
    queryFn: () => bookmarkService.getBookmarks('hadith'),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
  });

  // Quran still uses local storage for now
  const quranFavorites = quranStorageUtils.getFavorites().length;
  const quranBookmarks = quranStorageUtils.getBookmarks().length;

  return {
    hadithFavorites: Array.isArray(hadithFavorites) ? hadithFavorites.length : 0,
    hadithBookmarks: Array.isArray(hadithBookmarks) ? hadithBookmarks.length : 0,
    quranFavorites,
    quranBookmarks,
  };
};
