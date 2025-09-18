// Professional Optimistic Favorites Hook with Request Manager
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { MasjidViet } from '../types';
import { masjidFavoriteApi, type FavoriteUser } from '../services/masjidFavoriteApi';
import { useAuth } from '@/context/AuthContext';
import { devLog } from '@/utils/performance';
import { makeRequest, requestManager } from '@/utils/RequestManager';
// import { getMobileFavoritesSettings } from '@/utils/mobileOptimizations'; // No longer needed

interface OptimisticFavoriteState {
  [masjidId: string]: {
    isFavorited: boolean;
    favoriteUsers: FavoriteUser[];
    totalFavorites: number;
    isLoading: boolean;
    isPending: boolean; // For optimistic updates
  };
}

export const useOptimisticFavorites = () => {
  const [favoriteStates, setFavoriteStates] = useState<OptimisticFavoriteState>({});
  const { user, isAuthenticated, login } = useAuth();
  
  // Queue for debounced server sync
  const syncQueue = useRef<Map<string, { masjid: MasjidViet; action: 'add' | 'remove'; timestamp: number }>>(new Map());
  const syncTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 🚀 Professional server sync with Request Manager
  const syncToServer = useCallback(async (masjidId: string) => {
    const queueItem = syncQueue.current.get(masjidId);
    if (!queueItem) return;

    const requestId = `favorite-${queueItem.action}-${masjidId}`;

    try {
      // Use Request Manager for professional request handling
      const response = await makeRequest(
        requestId,
        () => queueItem.action === 'add' 
          ? masjidFavoriteApi.addFavorite(queueItem.masjid)
          : masjidFavoriteApi.removeFavorite(masjidId),
        'normal' // Priority
      );

      if (response.success) {
        devLog.log(`✅ Server sync successful: ${queueItem.action} favorite for ${masjidId}`);
        
        // Update with real server data
        setFavoriteStates(prev => ({
          ...prev,
          [masjidId]: {
            ...prev[masjidId],
            isPending: false
          }
        }));

        // Refresh favorite users from server
        setTimeout(() => {
          makeRequest(
            `load-users-${masjidId}`,
            () => loadFavoriteUsers(masjidId),
            'low'
          ).catch(err => devLog.warn('Failed to refresh favorite users:', err));
        }, 500);

      } else {
        throw new Error('Server sync failed');
      }
    } catch (error: any) {
      devLog.error('❌ Server sync failed:', error);
      
      // Handle different error types professionally
      if (error.message?.includes('Circuit breaker')) {
        toast.error('⚠️ Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.', {
          duration: 4000
        });
        // Don't rollback - keep optimistic state, server will sync later
      } else if (error.message?.includes('Rate limit exceeded')) {
        toast.warning('⏳ Đang thực hiện quá nhiều thao tác. Vui lòng chờ một chút.', {
          duration: 3000
        });
        // Don't rollback - this is temporary, keep optimistic state
      } else if (error.message?.includes('Duplicate request')) {
        // Silent - this is expected behavior for deduplication
        devLog.log('✅ Duplicate request prevented successfully');
      } else {
        // Only rollback for actual server errors (not rate limiting)
        setFavoriteStates(prev => {
          const current = prev[masjidId];
          if (!current) return prev;

          return {
            ...prev,
            [masjidId]: {
              ...current,
              isFavorited: queueItem.action === 'remove', // Rollback
              totalFavorites: queueItem.action === 'add' 
                ? Math.max(0, current.totalFavorites - 1)
                : current.totalFavorites + 1,
              isPending: false
            }
          };
        });
        
        toast.error('❌ Không thể đồng bộ với server. Đã hoàn tác thay đổi.', {
          duration: 3000
        });
      }

      // Always clear pending state
      setFavoriteStates(prev => ({
        ...prev,
        [masjidId]: {
          ...prev[masjidId],
          isPending: false
        }
      }));
    } finally {
      syncQueue.current.delete(masjidId);
    }
  }, []);

  // Load favorite users for a masjid
  const loadFavoriteUsers = useCallback(async (masjidId: string) => {
    setFavoriteStates(prev => ({
      ...prev,
      [masjidId]: {
        ...prev[masjidId],
        isLoading: true
      }
    }));

    try {
      const response = await masjidFavoriteApi.getMasjidFavoriteUsers(masjidId, 5);
      
      if (response.success && response.data) {
        setFavoriteStates(prev => ({
          ...prev,
          [masjidId]: {
            ...prev[masjidId],
            favoriteUsers: response.data!.users,
            totalFavorites: response.data!.totalCount,
            isLoading: false
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

  // 🚀 OPTIMISTIC TOGGLE FAVORITE with instant UI updates
  const toggleFavorite = useCallback(async (masjid: MasjidViet) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích', {
        duration: 4000,
        action: {
          label: 'Đăng nhập',
          onClick: () => login().catch(() => toast.error('Đăng nhập thất bại'))
        }
      });
      return;
    }

    if (!user) return;

    const currentState = favoriteStates[masjid.id] || {
      isFavorited: false,
      favoriteUsers: [],
      totalFavorites: 0,
      isLoading: false,
      isPending: false
    };

    const wasLiked = currentState.isFavorited;
    const newAction = wasLiked ? 'remove' : 'add';

    // 🎯 INSTANT OPTIMISTIC UPDATE - User sees change immediately
    setFavoriteStates(prev => {
      const newFavoriteUsers = [...currentState.favoriteUsers];
      
      if (!wasLiked) {
        // Add user avatar immediately to the front with animation
        const newUser: FavoriteUser = {
          user: {
            id: user.id,
            name: user.name || 'Người dùng',
            picture: user.picture || '',
            googleId: user.id
          },
          favoriteInfo: {
            createdAt: new Date().toISOString(),
            hasVisited: false
          }
        };
        newFavoriteUsers.unshift(newUser);
      } else {
        // Remove user avatar immediately
        const userIndex = newFavoriteUsers.findIndex(u => u.user.id === user.id);
        if (userIndex !== -1) {
          newFavoriteUsers.splice(userIndex, 1);
        }
      }

      return {
        ...prev,
        [masjid.id]: {
          isFavorited: !wasLiked,
          favoriteUsers: newFavoriteUsers.slice(0, 5), // Keep only first 5 for display
          totalFavorites: wasLiked 
            ? Math.max(0, currentState.totalFavorites - 1)
            : currentState.totalFavorites + 1,
          isLoading: false,
          isPending: true // Mark as pending server sync
        }
      };
    });

    // Clear existing timeout for this masjid
    const existingTimeout = syncTimeouts.current.get(masjid.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Queue for server sync with 500ms debounce
    syncQueue.current.set(masjid.id, {
      masjid,
      action: newAction,
      timestamp: Date.now()
    });

    // Set debounced timeout
    const timeout = setTimeout(() => {
      syncToServer(masjid.id);
      syncTimeouts.current.delete(masjid.id);
    }, 3000);
    
    syncTimeouts.current.set(masjid.id, timeout);

    // Show immediate feedback with animation
    toast.success(
      wasLiked ? '💔 Đã bỏ yêu thích' : '❤️ Đã thêm vào yêu thích', 
      { 
        duration: 1500,
        position: 'bottom-center'
      }
    );
  }, [isAuthenticated, user, favoriteStates, login, syncToServer]);

  // Initialize masjid data
  const initializeMasjid = useCallback(async (masjidId: string) => {
    if (!favoriteStates[masjidId]) {
      setFavoriteStates(prev => ({
        ...prev,
        [masjidId]: {
          isFavorited: false,
          favoriteUsers: [],
          totalFavorites: 0,
          isLoading: true,
          isPending: false
        }
      }));
    }

    await loadFavoriteUsers(masjidId);

    // Check if current user has favorited this masjid
    if (isAuthenticated) {
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
        }
      } catch (error) {
        devLog.error('Error checking favorite status:', error);
      }
    }
  }, [favoriteStates, loadFavoriteUsers, isAuthenticated]);

  // 🚀 OPTIMIZED: Batch load multiple masjids in single request
  const loadBatchMasjidData = useCallback(async (masjidIds: string[]) => {
    if (masjidIds.length === 0) return;

    // Filter out masjids that are already loaded
    const unloadedIds = masjidIds.filter(id => !favoriteStates[id]);
    if (unloadedIds.length === 0) return;

    // Mobile settings no longer used - using desktop settings

    devLog.log(`📦 Batch loading ${unloadedIds.length} masjids:`, unloadedIds);

    // Initialize empty states for all unloaded masjids
    setFavoriteStates(prev => {
      const newStates = { ...prev };
      unloadedIds.forEach(id => {
        if (!newStates[id]) {
          newStates[id] = {
            isFavorited: false,
            favoriteUsers: [],
            totalFavorites: 0,
            isLoading: true,
            isPending: false
          };
        }
      });
      return newStates;
    });

    try {
      // 🎯 SINGLE BATCH REQUEST instead of multiple individual requests
      const response = await makeRequest(
        `batch-load-${unloadedIds.join('-')}`,
        () => {
          const limit = 5; // Standard limit
          return masjidFavoriteApi.getBatchMasjidData(unloadedIds, limit);
        },
        'normal'
      );

      if (response.success && response.data) {
        // Update all masjids with batch data
        setFavoriteStates(prev => {
          const newStates = { ...prev };
          
          unloadedIds.forEach(masjidId => {
            const masjidData = response.data![masjidId];
            if (masjidData) {
              newStates[masjidId] = {
                ...newStates[masjidId],
                favoriteUsers: masjidData.users || [],
                totalFavorites: masjidData.totalCount || 0,
                isLoading: false
              };
            } else {
              // No data for this masjid (no favorites yet)
              newStates[masjidId] = {
                ...newStates[masjidId],
                favoriteUsers: [],
                totalFavorites: 0,
                isLoading: false
              };
            }
          });
          
          return newStates;
        });

        devLog.log(`✅ Batch loaded ${unloadedIds.length} masjids successfully`);
      }

      // 🚀 BATCH: Check favorite status for authenticated users
      if (isAuthenticated && unloadedIds.length > 0) {
        try {
          devLog.log(`🔍 Batch checking favorite status for ${unloadedIds.length} masjids`);
          
          const batchCheckResponse = await makeRequest(
            `batch-check-favorites-${unloadedIds.join('-')}`,
            () => masjidFavoriteApi.batchCheckFavorites(unloadedIds),
            'low' // Lower priority than data loading
          );

          if (batchCheckResponse.success && batchCheckResponse.data) {
            // Update favorite status for all masjids in one go
            setFavoriteStates(prev => {
              const newStates = { ...prev };
              
              Object.entries(batchCheckResponse.data!).forEach(([masjidId, favoriteData]) => {
                if (newStates[masjidId]) {
                  newStates[masjidId].isFavorited = favoriteData.isFavorited;
                }
              });
              
              return newStates;
            });

            devLog.log(`✅ Batch checked favorite status for ${Object.keys(batchCheckResponse.data).length} masjids`);
          }
        } catch (error) {
          devLog.warn('❌ Batch favorite check failed, falling back to individual checks:', error);
          
          // Fallback to individual checks if batch fails
          const favoriteChecks = unloadedIds.map(async (masjidId) => {
            try {
              const checkResponse = await masjidFavoriteApi.checkIsFavorited(masjidId);
              if (checkResponse.success && checkResponse.data) {
                setFavoriteStates(prev => ({
                  ...prev,
                  [masjidId]: {
                    ...prev[masjidId],
                    isFavorited: checkResponse.data!.isFavorited
                  }
                }));
              }
            } catch (error) {
              devLog.warn(`Failed to check favorite status for ${masjidId}:`, error);
            }
          });

          await Promise.allSettled(favoriteChecks);
        }
      }

    } catch (error) {
      devLog.error('❌ Batch loading failed:', error);
      
      // Reset loading states on error
      setFavoriteStates(prev => {
        const newStates = { ...prev };
        unloadedIds.forEach(id => {
          if (newStates[id]) {
            newStates[id].isLoading = false;
          }
        });
        return newStates;
      });
    }
  }, [favoriteStates, isAuthenticated]);

  // Helper functions
  const isFavorited = useCallback((masjidId: string) => {
    return favoriteStates[masjidId]?.isFavorited || false;
  }, [favoriteStates]);

  const getFavoriteUsers = useCallback((masjidId: string) => {
    return favoriteStates[masjidId]?.favoriteUsers || [];
  }, [favoriteStates]);

  const getFavoriteCount = useCallback((masjidId: string) => {
    return favoriteStates[masjidId]?.totalFavorites || 0;
  }, [favoriteStates]);

  const isLoadingMasjid = useCallback((masjidId: string) => {
    return favoriteStates[masjidId]?.isLoading || false;
  }, [favoriteStates]);

  const isPendingSync = useCallback((masjidId: string) => {
    return favoriteStates[masjidId]?.isPending || false;
  }, [favoriteStates]);

  // Calculate total user favorites
  const totalUserFavorites = Object.values(favoriteStates).filter(
    state => state.isFavorited
  ).length;

  // Monitor Request Manager status (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const status = requestManager.getStatus();
        if (status.queueLength > 0 || status.activeRequests > 0) {
          devLog.log('📊 Request Manager Status:', status);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      syncTimeouts.current.forEach(timeout => clearTimeout(timeout));
      syncTimeouts.current.clear();
    };
  }, []);

  return {
    // State
    isFavorited,
    getFavoriteUsers,
    getFavoriteCount,
    isLoadingMasjid,
    isPendingSync,
    totalUserFavorites,
    
    // Actions
    toggleFavorite,
    initializeMasjid,
    loadBatchMasjidData
  };
};
