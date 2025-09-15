import apiService from './backendApi';

export interface Favorite {
  id?: string;
  userId: string;
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content: string;
  notes?: string;
  tags?: string[];
  isPublic: boolean;
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

class FavoriteService {
  // Get all favorites for current user
  async getFavorites(type?: string): Promise<Favorite[]> {
    try {
      console.log('FavoriteService: Getting favorites...');
      const url = type ? `/favorites?type=${type}` : '/favorites';
      const response = await apiService.get<{ data: Favorite[] }>(url);
      console.log('FavoriteService: Got response:', response);
      return response?.data || [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  }

  // Add favorite
  async addFavorite(favoriteData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<Favorite> {
    try {
      // Validate required fields
      if (!favoriteData.content || favoriteData.content.trim() === '') {
        throw new Error('Content is required and cannot be empty');
      }
      
      console.log('FavoriteService: Adding favorite with data:', favoriteData);
      const response = await apiService.post<Favorite>('/favorites', favoriteData);
      console.log('FavoriteService: Add favorite response:', response);
      return response;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  }

  // Remove favorite
  async removeFavorite(favoriteId: string): Promise<void> {
    try {
      await apiService.delete(`/favorites/${favoriteId}`);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
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
  }): Promise<{ isFavorited: boolean; favorite?: Favorite }> {
    try {
      // Validate required fields
      if (!favoriteData.content || favoriteData.content.trim() === '') {
        throw new Error('Content is required and cannot be empty');
      }
      
      const response = await apiService.post<{ 
        isFavorited: boolean; 
        favorite?: Favorite;
        message: string;
      }>('/favorites/toggle', favoriteData);
      return response;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }

  // Check if item is favorited
  async isFavorited(type: string, itemId: string): Promise<boolean> {
    try {
      const response = await apiService.get<{ isFavorited: boolean }>(
        `/favorites/check/${type}/${itemId}`
      );
      return response.isFavorited;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  }

  // Update favorite
  async updateFavorite(favoriteId: string, updateData: Partial<Favorite>): Promise<Favorite> {
    try {
      const response = await apiService.put<Favorite>(`/favorites/${favoriteId}`, updateData);
      return response;
    } catch (error) {
      console.error('Failed to update favorite:', error);
      throw error;
    }
  }

  // Get single favorite
  async getFavorite(favoriteId: string): Promise<Favorite> {
    try {
      const response = await apiService.get<Favorite>(`/favorites/${favoriteId}`);
      return response;
    } catch (error) {
      console.error('Failed to get favorite:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkOperation(action: 'delete' | 'make_public' | 'make_private', favoriteIds: string[]) {
    try {
      const response = await apiService.post<any>('/favorites/bulk', {
        action,
        favoriteIds
      });
      return response;
    } catch (error) {
      console.error('Failed to perform bulk operation:', error);
      throw error;
    }
  }

  // Get popular favorites
  async getPopularFavorites(type?: string, limit = 10): Promise<Favorite[]> {
    try {
      const url = type ? `/favorites/public/popular?type=${type}&limit=${limit}` : `/favorites/public/popular?limit=${limit}`;
      const response = await apiService.get<Favorite[]>(url);
      return response || [];
    } catch (error) {
      console.error('Failed to get popular favorites:', error);
      return [];
    }
  }
}

export const favoriteService = new FavoriteService();
export default favoriteService;
