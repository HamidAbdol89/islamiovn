// Custom hook for managing favorite masjids
import { useState, useCallback, useEffect, useMemo } from 'react';
import type { MasjidViet } from '../types';

const FAVORITES_STORAGE_KEY = 'masjid-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  // Check if a masjid is favorited
  const isFavorite = useCallback((masjidId: string) => {
    return favorites.includes(masjidId);
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((masjidId: string) => {
    setFavorites(prev => {
      if (prev.includes(masjidId)) {
        // Remove from favorites
        return prev.filter(id => id !== masjidId);
      } else {
        // Add to favorites
        return [...prev, masjidId];
      }
    });
  }, []);

  // Add to favorites
  const addFavorite = useCallback((masjidId: string) => {
    setFavorites(prev => {
      if (!prev.includes(masjidId)) {
        return [...prev, masjidId];
      }
      return prev;
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((masjidId: string) => {
    setFavorites(prev => prev.filter(id => id !== masjidId));
  }, []);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // Get favorite masjids from a list
  const getFavoriteMasjids = useCallback((masjidList: MasjidViet[]) => {
    return masjidList.filter(masjid => favorites.includes(masjid.id));
  }, [favorites]);

  // Statistics
  const favoritesCount = useMemo(() => favorites.length, [favorites]);
  const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);

  return {
    favorites,
    favoritesCount,
    hasFavorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    getFavoriteMasjids
  };
};
