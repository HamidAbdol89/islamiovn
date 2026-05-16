/**
 * Masjid Favorites API — uses Better Auth session cookie (credentials: 'include').
 * No JWT in localStorage.
 */
import type { MasjidViet } from '../types';

const RAW_BASE = import.meta.env.VITE_API_URL_USER as string | undefined;
// Strip trailing /api if present so we can append paths cleanly
const API_BASE = RAW_BASE
  ? RAW_BASE.replace(/\/api\/?$/, '')
  : typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://islamiovn-production.up.railway.app';

const BASE = `${API_BASE}/api/masjid-favorites`;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FavoriteUser {
  user: {
    id: string;
    name: string;
    picture: string;
    googleId?: string;
  };
  favoriteInfo: {
    createdAt: string;
    hasVisited: boolean;
    rating?: number;
  };
}

export interface MasjidFavoriteData {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/** Authenticated fetch — sends Better Auth session cookie automatically */
const authFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, credentials: 'include' });

/** Public fetch — no credentials needed */
const publicFetch = (url: string, options: RequestInit = {}) =>
  fetch(url, { ...options, credentials: 'omit' });

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// ─── API ──────────────────────────────────────────────────────────────────────
export const masjidFavoriteApi = {
  /** Get favorite data for multiple masjids at once (public) */
  async getBatchMasjidData(
    masjidIds: string[],
    limit = 10
  ): Promise<ApiResponse<{ [masjidId: string]: { users: FavoriteUser[]; totalCount: number } }>> {
    const params = new URLSearchParams({ masjidIds: masjidIds.join(','), limit: String(limit) });
    const response = await publicFetch(`${BASE}/batch?${params}`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Add masjid to favorites */
  async addFavorite(masjid: MasjidViet, extra?: Partial<MasjidFavoriteData>): Promise<ApiResponse<any>> {
    const body: MasjidFavoriteData = {
      masjidId: masjid.id,
      masjidName: masjid.ten || '',
      masjidCity: masjid.thanhPho || '',
      masjidRegion: masjid.vung || 'Tất cả',
      masjidAddress: masjid.diaChi || '',
      masjidImage: masjid.hinhAnh,
      isPublic: true,
      hasVisited: false,
      ...extra,
    };
    const response = await authFetch(BASE, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    });
    return handleApiError(response);
  },

  /** Remove masjid from favorites */
  async removeFavorite(masjidId: string): Promise<ApiResponse<any>> {
    const response = await authFetch(`${BASE}/${masjidId}`, { method: 'DELETE', headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Get current user's favorite masjids */
  async getUserFavorites(options?: {
    page?: number;
    limit?: number;
    region?: string;
    hasVisited?: boolean;
  }): Promise<ApiResponse<{ favorites: any[]; pagination: any }>> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.region) params.append('region', options.region);
    if (options?.hasVisited !== undefined) params.append('hasVisited', String(options.hasVisited));
    const response = await authFetch(`${BASE}/my?${params}`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Get users who favorited a specific masjid — public */
  async getMasjidFavoriteUsers(
    masjidId: string,
    limit = 10
  ): Promise<ApiResponse<{ users: FavoriteUser[]; totalCount: number }>> {
    const response = await publicFetch(
      `${BASE}/masjid/${masjidId}/users?limit=${limit}`,
      { headers: JSON_HEADERS }
    );
    return handleApiError(response);
  },

  /** Get masjid statistics — public */
  async getMasjidStats(masjidId: string): Promise<ApiResponse<{
    totalFavorites: number;
    averageRating: number;
    visitedCount: number;
    ratingDistribution: number[];
  }>> {
    const response = await publicFetch(`${BASE}/masjid/${masjidId}/stats`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Check if current user has favorited a masjid */
  async checkIsFavorited(masjidId: string): Promise<ApiResponse<{ isFavorited: boolean; favoriteId?: string }>> {
    const response = await authFetch(`${BASE}/check/${masjidId}`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Batch check favorite status for multiple masjids */
  async batchCheckFavorites(
    masjidIds: string[]
  ): Promise<ApiResponse<{ [masjidId: string]: { isFavorited: boolean; favoriteId?: string } }>> {
    const params = new URLSearchParams({ masjidIds: masjidIds.join(',') });
    const response = await authFetch(`${BASE}/batch-check?${params}`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },

  /** Update favorite details */
  async updateFavorite(
    masjidId: string,
    updateData: {
      personalNote?: string;
      isPublic?: boolean;
      hasVisited?: boolean;
      visitDate?: string;
      rating?: number;
      tags?: string[];
    }
  ): Promise<ApiResponse<any>> {
    const response = await authFetch(`${BASE}/${masjidId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(updateData),
    });
    return handleApiError(response);
  },

  /** Get popular masjids — public */
  async getPopularMasjids(options?: { limit?: number; region?: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.region) params.append('region', options.region);
    const response = await publicFetch(`${BASE}/popular?${params}`, { headers: JSON_HEADERS });
    return handleApiError(response);
  },
};
