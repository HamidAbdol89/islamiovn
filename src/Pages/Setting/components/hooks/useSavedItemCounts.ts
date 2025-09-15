import { useQuery } from '@tanstack/react-query';
import { hybridBookmarkService } from '@/services/hybridBookmarkService';
import { hybridFavoriteService } from '@/services/hybridFavoriteService';
import { quranStorageUtils } from '@/components/Utilities/Quran/utils/storage';
import { useAuth } from '@/context/AuthContext';
import type { SavedItemCounts } from '../types';

export const useSavedItemCounts = (): SavedItemCounts => {
  const { isAuthenticated } = useAuth();

  // Get hadith favorites (local or backend based on auth status)
  const { data: hadithFavorites = [] } = useQuery({
    queryKey: ['hadith-favorites-count', isAuthenticated],
    queryFn: () => hybridFavoriteService.getFavorites(isAuthenticated, 'hadith'),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Error handling can be done via useQuery's error property
  });

  // Get hadith bookmarks (local or backend based on auth status)
  const { data: hadithBookmarks = [] } = useQuery({
    queryKey: ['hadith-bookmarks-count', isAuthenticated],
    queryFn: () => hybridBookmarkService.getBookmarks(isAuthenticated, 'hadith'),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Error handling can be done via useQuery's error property
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
