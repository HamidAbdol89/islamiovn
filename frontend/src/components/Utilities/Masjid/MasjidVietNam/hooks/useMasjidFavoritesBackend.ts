// Enhanced favorites hook with backend integration and user avatars
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import type { MasjidViet } from '../types';
import { masjidFavoriteApi, type FavoriteUser } from '../services/masjidFavoriteApi';
import { useAuth } from '@/context/AuthContext';
import { devLog, getBatchSize } from '@/utils/performance';

interface MasjidFavoriteState {
  [masjidId: string]: {
    isFavorited: boolean;
    favoriteUsers: FavoriteUser[];
    totalFavorites: number;
    isLoading: boolean;
    lastUpdated: number;
  };
}

const CACHE_KEY = 'masjid-favorites-cache';

export const useMasjidFavoritesBackend = () => {
  // Load initial state from localStorage
  const [favoriteStates, setFavoriteStates] = useState<MasjidFavoriteState>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cached favorite states loaded
        return parsed;
      }
    } catch (error) {
      devLog.warn('Failed to load cached favorite states:', error);
    }
    return {};
  });
  
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use AuthContext for authentication
  const { user, isAuthenticated, login } = useAuth();

  // Auto-save to localStorage when favoriteStates changes (debounced for performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(favoriteStates));
      } catch (error) {
        devLog.warn('Failed to save favorite states to cache:', error);
      }
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [favoriteStates]);

  // Get favorite state for a specific masjid
  const getFavoriteState = useCallback((masjidId: string) => {
    return favoriteStates[masjidId] || {
      isFavorited: false,
      favoriteUsers: [],
      totalFavorites: 0,
      isLoading: false,
      lastUpdated: 0
    };
  }, [favoriteStates]);

  // PERFORMANCE: Batch load favorite users for multiple masjids (mobile-optimized)
  const loadBatchMasjidData = useCallback(async (masjidIds: string[]) => {
    try {
      const batchSize = getBatchSize();
      const response = await masjidFavoriteApi.getBatchMasjidData(masjidIds, batchSize);
      
      if (response.success && response.data) {
        setFavoriteStates(prev => {
          const newState = { ...prev };
          Object.entries(response.data!).forEach(([masjidId, data]) => {
            newState[masjidId] = {
              ...prev[masjidId],
              favoriteUsers: data.users,
              totalFavorites: data.totalCount,
              isLoading: false,
              lastUpdated: Date.now()
            };
          });
          return newState;
        });
      }
    } catch (error) {
      devLog.error('Error loading batch masjid data:', error);
    }
  }, []);

  // Load favorite users for a single masjid (fallback)
  const loadMasjidFavoriteUsers = useCallback(async (masjidId: string) => {
    try {
      setFavoriteStates(prev => ({
        ...prev,
        [masjidId]: {
          ...prev[masjidId],
          isLoading: true
        }
      }));

      const batchSize = getBatchSize();
      const response = await masjidFavoriteApi.getMasjidFavoriteUsers(masjidId, batchSize);
      
      if (response.success && response.data) {
        setFavoriteStates(prev => ({
          ...prev,
          [masjidId]: {
            ...prev[masjidId],
            favoriteUsers: response.data!.users,
            totalFavorites: response.data!.totalCount,
            isLoading: false,
            lastUpdated: Date.now()
          }
        }));
      }
    } catch (error) {
      devLog.error('Error loading favorite users:', error);
      setFavoriteStates(prev => ({
        ...prev,
        [masjidId]: {
          ...prev[masjidId],
          isLoading: false
        }
      }));
    }
  }, []);

  // Check if user has favorited a masjid
  const checkIsFavorited = useCallback(async (masjidId: string) => {
    if (!isAuthenticated) return false;

    try {
      const response = await masjidFavoriteApi.checkIsFavorited(masjidId);
      
      if (response.success && response.data) {
        setFavoriteStates(prev => ({
          ...prev,
          [masjidId]: {
            ...prev[masjidId],
            isFavorited: response.data!.isFavorited
          }
        }));
        
        return response.data.isFavorited;
      }
    } catch (error) {
      devLog.error('Error checking favorite status:', error);
    }
    
    return false;
  }, [isAuthenticated]);

  // Track pending toggles to prevent rapid clicking
  const pendingToggles = useRef<Set<string>>(new Set());

  // Toggle favorite status
  const toggleFavorite = useCallback(async (masjid: MasjidViet) => {
    // Prevent rapid clicking
    if (pendingToggles.current.has(masjid.id)) {
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích', {
        duration: 4000,
        description: 'Bạn vẫn có thể xem danh sách masjid và thông tin người dùng khác',
        action: {
          label: 'Đăng nhập',
          onClick: () => {
            login().catch(error => {
              devLog.error('Login failed:', error);
              toast.error('Đăng nhập thất bại');
            });
          }
        }
      });
      return;
    }

    // Mark as pending
    pendingToggles.current.add(masjid.id);

    const currentState = getFavoriteState(masjid.id);
    const wasLiked = currentState.isFavorited;

    try {
      // Optimistic update
      setFavoriteStates(prev => ({
        ...prev,
        [masjid.id]: {
          ...prev[masjid.id],
          isFavorited: !wasLiked,
          totalFavorites: wasLiked 
            ? Math.max(0, currentState.totalFavorites - 1)
            : currentState.totalFavorites + 1
        }
      }));

      if (wasLiked) {
        // Remove from favorites
        await masjidFavoriteApi.removeFavorite(masjid.id);
        toast.success('Đã bỏ khỏi danh sách yêu thích');
      } else {
        // Add to favorites
        await masjidFavoriteApi.addFavorite(masjid);
        toast.success('Đã thêm vào danh sách yêu thích');
      }

      // Reload favorite users to get updated list
      await loadMasjidFavoriteUsers(masjid.id);

    } catch (error) {
      // Revert optimistic update on error
      setFavoriteStates(prev => ({
        ...prev,
        [masjid.id]: {
          ...prev[masjid.id],
          isFavorited: wasLiked,
          totalFavorites: currentState.totalFavorites
        }
      }));

      devLog.error('Error toggling favorite:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      // Remove from pending set
      pendingToggles.current.delete(masjid.id);
    }
  }, [isAuthenticated, getFavoriteState, loadMasjidFavoriteUsers]);

  // Load user's favorites
  const loadUserFavorites = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await masjidFavoriteApi.getUserFavorites();
      
      if (response.success && response.data) {
        setUserFavorites(response.data.favorites);
        
        // Update favorite states for loaded masjids
        response.data.favorites.forEach((favorite: any) => {
          setFavoriteStates(prev => ({
            ...prev,
            [favorite.masjidId]: {
              ...prev[favorite.masjidId],
              isFavorited: true
            }
          }));
        });
      }
    } catch (error) {
      devLog.error('Error loading user favorites:', error);
      toast.error('Không thể tải danh sách yêu thích');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Track which masjids are currently being initialized to prevent duplicates
  const initializingRef = useRef<Set<string>>(new Set());

  // Initialize favorite data for a masjid
  const initializeMasjid = useCallback(async (masjidId: string) => {
    // Prevent duplicate initialization
    if (initializingRef.current.has(masjidId)) {
      return;
    }

    const currentState = getFavoriteState(masjidId);
    const now = Date.now();
    
    // Skip if recently loaded (within 5 minutes) and has data
    if (now - currentState.lastUpdated < 5 * 60 * 1000 && currentState.lastUpdated > 0) {
      return;
    }

    // Mark as initializing
    initializingRef.current.add(masjidId);

    try {
      // Load favorite users (always public - no auth required)
      await loadMasjidFavoriteUsers(masjidId);
      
      // Check user's favorite status (only if authenticated)
      if (isAuthenticated && user) {
        await checkIsFavorited(masjidId);
      }
    } finally {
      // Remove from initializing set
      initializingRef.current.delete(masjidId);
    }
  }, [getFavoriteState, loadMasjidFavoriteUsers, checkIsFavorited, isAuthenticated]);

  // Get favorite count for a masjid
  const getFavoriteCount = useCallback((masjidId: string) => {
    return getFavoriteState(masjidId).totalFavorites;
  }, [getFavoriteState]);

  // Get favorite users for a masjid
  const getFavoriteUsers = useCallback((masjidId: string) => {
    return getFavoriteState(masjidId).favoriteUsers;
  }, [getFavoriteState]);

  // Check if user has favorited a masjid
  const isFavorited = useCallback((masjidId: string) => {
    return getFavoriteState(masjidId).isFavorited;
  }, [getFavoriteState]);

  // Check if loading
  const isLoadingMasjid = useCallback((masjidId: string) => {
    return getFavoriteState(masjidId).isLoading;
  }, [getFavoriteState]);

  // Get total user favorites count
  const totalUserFavorites = useMemo(() => {
    return userFavorites.length;
  }, [userFavorites]);

  // Load user favorites on authentication change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserFavorites();
    } else {
      setUserFavorites([]);
      // Clear ONLY user-specific favorite states (keep public data like avatars)
      setFavoriteStates(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(masjidId => {
          newState[masjidId] = {
            ...newState[masjidId],
            isFavorited: false // Only clear user's favorite status
            // Keep favoriteUsers and totalFavorites (public data)
          };
        });
        return newState;
      });
    }
  }, [isAuthenticated, user, loadUserFavorites]);

  return {
    // State
    isAuthenticated,
    isLoading,
    userFavorites,
    totalUserFavorites,
    
    // Actions
    toggleFavorite,
    initializeMasjid,
    loadUserFavorites,
    loadBatchMasjidData,
    
    // Getters
    isFavorited,
    getFavoriteCount,
    getFavoriteUsers,
    isLoadingMasjid,
    getFavoriteState
  };
};
