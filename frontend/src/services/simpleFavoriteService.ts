import { favoriteService } from './favoriteService';
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore';

export interface SimpleFavorite {
  id: string;
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content: string;
  notes?: string;
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
}

class SimpleFavoriteService {
  // Get all favorites from backend (only for authenticated users)
  async getFavorites(type?: string): Promise<SimpleFavorite[]> {
    try {
      const response = await favoriteService.getFavorites(type);
      console.log('🔴 Backend favorites response:', response);
      
      // Backend returns pagination object, extract items array
      const favorites = (response as any)?.items || response || [];
      
      return favorites.map((fav: any) => ({
        id: fav._id || fav.id || '',
        type: fav.type,
        itemId: fav.itemId,
        title: fav.title,
        content: fav.content,
        notes: fav.notes,
        tags: fav.tags,
        isPublic: fav.isPublic,
        createdAt: fav.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to get favorites from backend:', error);
      // Return empty array on error to prevent UI issues
      return [];
    }
  }

  // Add favorite to backend (only for authenticated users)
  async addFavorite(favoriteData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<SimpleFavorite> {
    const backendFavorite = await favoriteService.addFavorite(favoriteData);
    return {
      id: backendFavorite.id || '',
      type: backendFavorite.type,
      itemId: backendFavorite.itemId,
      title: backendFavorite.title,
      content: backendFavorite.content,
      notes: backendFavorite.notes,
      tags: backendFavorite.tags,
      isPublic: backendFavorite.isPublic,
      createdAt: backendFavorite.createdAt || new Date().toISOString()
    };
  }

  // Remove favorite from backend (only for authenticated users)
  async removeFavorite(favoriteId: string): Promise<void> {
    await favoriteService.removeFavorite(favoriteId);
  }

  // Toggle favorite (add if not exists, remove if exists)
  async toggleFavorite(favoriteData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<{ isFavorited: boolean; favorite?: SimpleFavorite }> {
    const result = await favoriteService.toggleFavorite(favoriteData);
    return {
      isFavorited: result.isFavorited,
      favorite: result.favorite ? {
        id: result.favorite.id || '',
        type: result.favorite.type,
        itemId: result.favorite.itemId,
        title: result.favorite.title,
        content: result.favorite.content,
        notes: result.favorite.notes,
        tags: result.favorite.tags,
        isPublic: result.favorite.isPublic,
        createdAt: result.favorite.createdAt || new Date().toISOString()
      } : undefined
    };
  }

  // Check if item is favorited
  async isFavorited(type: string, itemId: string): Promise<boolean> {
    try {
      return await favoriteService.isFavorited(type, itemId);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  }
}

export const simpleFavoriteService = new SimpleFavoriteService();

// Custom hook for using the simple favorite service
export function useSimpleFavoriteService() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  
  return {
    getFavorites: (type?: string) => 
      isAuthenticated ? simpleFavoriteService.getFavorites(type) : Promise.resolve([]),
    addFavorite: (favoriteData: Parameters<typeof simpleFavoriteService.addFavorite>[0]) => 
      isAuthenticated ? simpleFavoriteService.addFavorite(favoriteData) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    removeFavorite: (favoriteId: string) => 
      isAuthenticated ? simpleFavoriteService.removeFavorite(favoriteId) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    toggleFavorite: (favoriteData: Parameters<typeof simpleFavoriteService.toggleFavorite>[0]) => 
      isAuthenticated ? simpleFavoriteService.toggleFavorite(favoriteData) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    isFavorited: (type: string, itemId: string) => 
      isAuthenticated ? simpleFavoriteService.isFavorited(type, itemId) : Promise.resolve(false)
  };
}
