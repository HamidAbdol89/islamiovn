import { favoriteService } from './favoriteService';
import { useAuth } from '@/context/AuthContext';

export interface LocalFavorite {
  id: string;
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content: string;
  metadata?: any;
  tags?: string[];
  notes?: string;
  isPublic: boolean;
  createdAt: string;
}

class HybridFavoriteService {
  private readonly STORAGE_KEY = 'muslimviet_favorites';

  // Get all favorites (local or backend based on auth status)
  async getFavorites(isAuthenticated: boolean, type?: string): Promise<LocalFavorite[]> {
    if (isAuthenticated) {
      // Use backend API
      try {
        const backendFavorites = await favoriteService.getFavorites(type);
        const localFavorites = this.getLocalFavorites(type);
        
        // Merge backend and local data, removing duplicates
        const backendMap = new Map(backendFavorites.map(f => [f.itemId, f]));
        
        // Start with backend data
        const mergedFavorites = backendFavorites.map(fav => ({
          id: fav.id || '',
          type: fav.type,
          itemId: fav.itemId,
          title: fav.title,
          content: fav.content,
          metadata: {}, // Favorite from backend does not have metadata
          tags: fav.tags,
          notes: fav.notes,
          isPublic: fav.isPublic,
          createdAt: fav.createdAt || new Date().toISOString()
        }));
        
        // Add local data that's not in backend
        localFavorites.forEach(localFavorite => {
          if (!backendMap.has(localFavorite.itemId)) {
            mergedFavorites.push({
              ...localFavorite,
              metadata: localFavorite.metadata ?? {},
              tags: localFavorite.tags ?? [],
              notes: localFavorite.notes ?? '',
            });
          }
        });
        
        console.log(`Merged ${mergedFavorites.length} favorites (${backendFavorites.length} backend + ${localFavorites.length - backendFavorites.length} local unique)`);
        return mergedFavorites;
      } catch (error) {
        console.error('Failed to get favorites from backend, falling back to local:', error);
        return this.getLocalFavorites(type);
      }
    } else {
      // Use local storage
      return this.getLocalFavorites(type);
    }
  }

  // Get local favorites from localStorage
  private getLocalFavorites(type?: string): LocalFavorite[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const favorites: LocalFavorite[] = stored ? JSON.parse(stored) : [];
      
      if (type) {
        return favorites.filter(fav => fav.type === type);
      }
      return favorites;
    } catch (error) {
      console.error('Failed to get local favorites:', error);
      return [];
    }
  }

  // Save local favorites to localStorage
  private saveLocalFavorites(favorites: LocalFavorite[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save local favorites:', error);
    }
  }

  // Add favorite (local or backend based on auth status)
  async addFavorite(isAuthenticated: boolean, favoriteData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<LocalFavorite> {
    
    const newFavorite: LocalFavorite = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: favoriteData.type,
      itemId: favoriteData.itemId,
      title: favoriteData.title,
      content: favoriteData.content,
      metadata: favoriteData.metadata,
      tags: favoriteData.tags,
      notes: favoriteData.notes,
      isPublic: favoriteData.isPublic || false,
      createdAt: new Date().toISOString()
    };

    if (isAuthenticated) {
      // Use backend API
      try {
        const backendFavorite = await favoriteService.addFavorite(favoriteData);
        return {
          id: backendFavorite.id || newFavorite.id,
          type: backendFavorite.type,
          itemId: backendFavorite.itemId,
          title: backendFavorite.title,
          content: backendFavorite.content,
          metadata: {}, // Favorite from backend does not have metadata
          tags: backendFavorite.tags,
          notes: backendFavorite.notes,
          isPublic: backendFavorite.isPublic,
          createdAt: backendFavorite.createdAt || newFavorite.createdAt
        };
      } catch (error) {
        console.error('Failed to add favorite to backend, saving locally:', error);
        // Fallback to local storage
        const localFavorites = this.getLocalFavorites();
        localFavorites.push(newFavorite);
        this.saveLocalFavorites(localFavorites);
        return newFavorite;
      }
    } else {
      // Use local storage
      const localFavorites = this.getLocalFavorites();
      localFavorites.push(newFavorite);
      this.saveLocalFavorites(localFavorites);
      return newFavorite;
    }
  }

  // Remove favorite (local or backend based on auth status)
  async removeFavorite(isAuthenticated: boolean, favoriteId: string): Promise<void> {
    
    if (isAuthenticated) {
      // Use backend API
      try {
        await favoriteService.removeFavorite(favoriteId);
        return;
      } catch (error) {
        console.error('Failed to remove favorite from backend, removing locally:', error);
        // Fallback to local storage
        const localFavorites = this.getLocalFavorites();
        const updatedFavorites = localFavorites.filter(fav => fav.id !== favoriteId);
        this.saveLocalFavorites(updatedFavorites);
      }
    } else {
      // Use local storage
      const localFavorites = this.getLocalFavorites();
      const updatedFavorites = localFavorites.filter(fav => fav.id !== favoriteId);
      this.saveLocalFavorites(updatedFavorites);
    }
  }

  // Toggle favorite (add if not exists, remove if exists)
  async toggleFavorite(isAuthenticated: boolean, favoriteData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<{ isFavorited: boolean; favorite?: LocalFavorite }> {
    
    // Check if already exists
    const existingFavorites = await this.getFavorites(isAuthenticated, favoriteData.type);
    const existing = existingFavorites.find(fav => fav.itemId === favoriteData.itemId);
    
    if (existing) {
      // Remove existing
      await this.removeFavorite(isAuthenticated, existing.id);
      return { isFavorited: false };
    } else {
      // Add new
      const newFavorite = await this.addFavorite(isAuthenticated, favoriteData);
      return { isFavorited: true, favorite: newFavorite };
    }
  }

  // Check if item is favorited
  async isFavorited(isAuthenticated: boolean, type: string, itemId: string): Promise<boolean> {
    
    if (isAuthenticated) {
      try {
        return await favoriteService.isFavorited(type, itemId);
      } catch (error) {
        console.error('Failed to check favorite status from backend, checking locally:', error);
        // Fallback to local check
        const localFavorites = this.getLocalFavorites(type);
        return localFavorites.some(fav => fav.itemId === itemId);
      }
    } else {
      // Use local storage
      const localFavorites = this.getLocalFavorites(type);
      return localFavorites.some(fav => fav.itemId === itemId);
    }
  }

  // Sync local favorites to backend (called when user logs in)
  async syncLocalToBackend(isAuthenticated: boolean): Promise<void> {
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot sync to backend');
      return;
    }

    try {
      const localFavorites = this.getLocalFavorites();
      
      if (localFavorites.length === 0) {
        console.log('No local favorites to sync');
        return;
      }

      console.log(`Syncing ${localFavorites.length} local favorites to backend...`);
      
      // Sync each local favorite to backend
      for (const localFavorite of localFavorites) {
        try {
          await favoriteService.addFavorite({
            type: localFavorite.type,
            itemId: localFavorite.itemId,
            title: localFavorite.title,
            content: localFavorite.content,
            metadata: localFavorite.metadata,
            tags: localFavorite.tags,
            notes: localFavorite.notes,
            isPublic: localFavorite.isPublic
          });
        } catch (error) {
          console.error(`Failed to sync favorite ${localFavorite.id}:`, error);
        }
      }

      // Clear local favorites after successful sync
      this.saveLocalFavorites([]);
      console.log('Local favorites synced to backend successfully');
      
    } catch (error) {
      console.error('Failed to sync local favorites to backend:', error);
    }
  }

  // Get local favorites count (for display purposes)
  getLocalFavoritesCount(type?: string): number {
    return this.getLocalFavorites(type).length;
  }

  // Clear all local favorites
  clearLocalFavorites(): void {
    this.saveLocalFavorites([]);
  }
}

export const hybridFavoriteService = new HybridFavoriteService();
export default hybridFavoriteService;

// Custom hook for using the hybrid favorite service
export function useHybridFavoriteService() {
  const { isAuthenticated } = useAuth();
  
  return {
    getFavorites: (type?: string) => 
      hybridFavoriteService.getFavorites(isAuthenticated, type),
    addFavorite: (favoriteData: Parameters<typeof hybridFavoriteService.addFavorite>[1]) => 
      hybridFavoriteService.addFavorite(isAuthenticated, favoriteData),
    removeFavorite: (favoriteId: string) => 
      hybridFavoriteService.removeFavorite(isAuthenticated, favoriteId),
    toggleFavorite: (favoriteData: Parameters<typeof hybridFavoriteService.toggleFavorite>[1]) => 
      hybridFavoriteService.toggleFavorite(isAuthenticated, favoriteData),
    isFavorited: (type: string, itemId: string) => 
      hybridFavoriteService.isFavorited(isAuthenticated, type, itemId),
    syncLocalToBackend: () => 
      hybridFavoriteService.syncLocalToBackend(isAuthenticated),
    getLocalFavoritesCount: (type?: string) => 
      hybridFavoriteService.getLocalFavoritesCount(type),
    clearLocalFavorites: () => 
      hybridFavoriteService.clearLocalFavorites()
  };
}
