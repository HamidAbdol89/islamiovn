// API service for masjid favorites with backend integration
import type { MasjidViet } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL_USER || 'http://localhost:3000/api';

// Types for API responses
export interface FavoriteUser {
  user: {
    id: string;
    name: string;
    picture: string;
    googleId: string;
  };
  favoriteInfo: {
    createdAt: string;
    hasVisited: boolean;
    rating?: number;
  };
}

export interface MasjidFavoriteData {
  userId: string;
  masjidId: string;
  masjidName: string;
  masjidCity: string;
  masjidRegion: string;
  masjidAddress?: string;
  masjidImage?: string;
  personalNote?: string;
  isPublic?: boolean;
  hasVisited?: boolean;
  visitDate?: string;
  rating?: number;
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Get JWT token from localStorage (same as apiService)
const getJWTToken = (): string | null => {
  return localStorage.getItem('muslimviet_jwt_token') || null;
};

// Create headers with JWT token
const createHeaders = (): HeadersInit => {
  const token = getJWTToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const masjidFavoriteApi = {
  // PERFORMANCE: Get favorite data for multiple masjids at once
  async getBatchMasjidData(masjidIds: string[], limit = 10): Promise<ApiResponse<{ [masjidId: string]: { users: FavoriteUser[]; totalCount: number } }>> {
    const params = new URLSearchParams();
    params.append('masjidIds', masjidIds.join(','));
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/masjid-favorites/batch?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return handleApiError(response);
  },

  // Add masjid to favorites
  async addFavorite(masjid: MasjidViet, additionalData?: Partial<MasjidFavoriteData>): Promise<ApiResponse<any>> {
    const favoriteData: MasjidFavoriteData = {
      userId: '', // Will be set by backend from token
      masjidId: masjid.id,
      masjidName: masjid.ten || '',
      masjidCity: masjid.thanhPho || '',
      masjidRegion: masjid.vung || 'Tất cả',
      masjidAddress: masjid.diaChi || '',
      masjidImage: masjid.hinhAnh,
      isPublic: true,
      hasVisited: false,
      ...additionalData
    };

    const response = await fetch(`${API_BASE_URL}/masjid-favorites`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(favoriteData)
    });

    return handleApiError(response);
  },

  // Remove masjid from favorites
  async removeFavorite(masjidId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/masjid-favorites/${masjidId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleApiError(response);
  },

  // Get user's favorite masjids
  async getUserFavorites(options?: {
    page?: number;
    limit?: number;
    region?: string;
    hasVisited?: boolean;
  }): Promise<ApiResponse<{ favorites: any[]; pagination: any }>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.region) params.append('region', options.region);
    if (options?.hasVisited !== undefined) params.append('hasVisited', options.hasVisited.toString());

    const response = await fetch(`${API_BASE_URL}/masjid-favorites/my?${params}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleApiError(response);
  },

  // Get users who favorited a specific masjid (for avatar display) - PUBLIC ENDPOINT
  async getMasjidFavoriteUsers(masjidId: string, limit = 10): Promise<ApiResponse<{ users: FavoriteUser[]; totalCount: number }>> {
    const response = await fetch(`${API_BASE_URL}/masjid-favorites/masjid/${masjidId}/users?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header - this is a public endpoint
      }
    });

    return handleApiError(response);
  },

  // Get masjid statistics - PUBLIC ENDPOINT
  async getMasjidStats(masjidId: string): Promise<ApiResponse<{
    totalFavorites: number;
    averageRating: number;
    visitedCount: number;
    ratingDistribution: number[];
  }>> {
    const response = await fetch(`${API_BASE_URL}/masjid-favorites/masjid/${masjidId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header - this is a public endpoint
      }
    });

    return handleApiError(response);
  },

  // Check if user has favorited a masjid
  async checkIsFavorited(masjidId: string): Promise<ApiResponse<{ isFavorited: boolean; favoriteId?: string }>> {
    const response = await fetch(`${API_BASE_URL}/masjid-favorites/check/${masjidId}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleApiError(response);
  },

  // 🚀 BATCH: Check favorite status for multiple masjids at once
  async batchCheckFavorites(masjidIds: string[]): Promise<ApiResponse<{ [masjidId: string]: { isFavorited: boolean; favoriteId?: string } }>> {
    const params = new URLSearchParams();
    params.append('masjidIds', masjidIds.join(','));

    const response = await fetch(`${API_BASE_URL}/masjid-favorites/batch-check?${params}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleApiError(response);
  },

  // Update favorite (rating, note, visit status)
  async updateFavorite(masjidId: string, updateData: {
    personalNote?: string;
    isPublic?: boolean;
    hasVisited?: boolean;
    visitDate?: string;
    rating?: number;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/masjid-favorites/${masjidId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(updateData)
    });

    return handleApiError(response);
  },

  // Get popular masjids
  async getPopularMasjids(options?: {
    limit?: number;
    region?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.region) params.append('region', options.region);

    const response = await fetch(`${API_BASE_URL}/masjid-favorites/popular?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return handleApiError(response);
  }
};
