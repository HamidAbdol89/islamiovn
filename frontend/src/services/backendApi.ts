/**
 * Backend API service — uses Firebase ID token for authentication.
 * Token is fetched from Firebase Auth on each request.
 */
import { auth } from '@/lib/firebase';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const ENV_API_BASE = import.meta.env.VITE_API_URL_USER as string | undefined;

const isValidUrl = (url?: string) => !!url && /^https?:\/\/.+/.test(url);

const normalizeUrl = (url: string) => {
  // fix localhost3000 → localhost:3000
  url = url.replace(/(https?:\/\/localhost)(\d{4,5})/, '$1:$2');
  // ensure /api suffix
  return url.replace(/\/?$/, '').endsWith('/api') ? url : `${url.replace(/\/?$/, '')}/api`;
};

const DEFAULT_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://islamiovn-production.up.railway.app/api';

const API_BASE_URL = isValidUrl(ENV_API_BASE)
  ? normalizeUrl(ENV_API_BASE!)
  : DEFAULT_BASE;

// ─── API Service ──────────────────────────────────────────────────────────────
class ApiService {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const maxRetries = 3;
    const url = `${this.baseURL}${endpoint}`;

    // Get fresh Firebase ID token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
    } catch {
      // No user logged in — continue without token
    }

 const config: RequestInit = {
  ...options,
  headers,
};

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired — Firebase auto-refreshes, just sign out
        auth.signOut().catch(() => {});
        throw new Error('Authentication required');
      }

      // Retry on rate limit (429) or server errors (5xx)
      if ((response.status === 429 || response.status >= 500) && retryCount < maxRetries) {
        const delay = 1000 * (retryCount + 1);
        await new Promise((r) => setTimeout(r, delay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  }

  // ─── Generic HTTP ───────────────────────────────────────────────────────────
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ─── User ───────────────────────────────────────────────────────────────────
  getUserStats() {
    return this.request<any>('/users/stats');
  }

  getUserActivity(page = 1, limit = 20) {
    return this.request<any>(`/users/activity?page=${page}&limit=${limit}`);
  }

  searchBookmarks(query: string, type?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
    if (type) params.append('type', type);
    return this.request<any>(`/users/search?${params}`);
  }

  async exportUserData(): Promise<Blob> {
  const response = await fetch(`${this.baseURL}/users/export`, {
    headers: {
      Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Export failed');
  return response.blob();
}

  // ─── Bookmarks ──────────────────────────────────────────────────────────────
  createBookmark(data: BookmarkData) {
    return this.request<any>('/bookmarks', { method: 'POST', body: JSON.stringify(data) });
  }

  getBookmarks(params: {
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && sp.append(k, String(v)));
    return this.request<any>(`/bookmarks?${sp}`);
  }

  getBookmark(id: string) {
    return this.request<any>(`/bookmarks/${id}`);
  }

  updateBookmark(id: string, data: unknown) {
    return this.request<any>(`/bookmarks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  deleteBookmark(id: string) {
    return this.request<any>(`/bookmarks/${id}`, { method: 'DELETE' });
  }

  getPopularBookmarks(type?: string, limit = 10) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (type) params.append('type', type);
    return this.request<any>(`/bookmarks/public/popular?${params}`);
  }

  bulkBookmarkOperation(action: 'delete' | 'make_public' | 'make_private', bookmarkIds: string[]) {
    return this.request<any>('/bookmarks/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, bookmarkIds }),
    });
  }

  // ─── Favorites ──────────────────────────────────────────────────────────────
  createFavorite(data: BookmarkData) {
    return this.request<any>('/favorites', { method: 'POST', body: JSON.stringify(data) });
  }

  getFavorites(params: { type?: string; page?: number; limit?: number } = {}) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && sp.append(k, String(v)));
    return this.request<any>(`/favorites?${sp}`);
  }

  toggleFavorite(data: BookmarkData) {
    return this.request<any>('/favorites/toggle', { method: 'POST', body: JSON.stringify(data) });
  }

  checkFavorite(type: string, itemId: string) {
    return this.request<any>(`/favorites/check/${type}/${itemId}`);
  }

  deleteFavorite(id: string) {
    return this.request<any>(`/favorites/${id}`, { method: 'DELETE' });
  }

  // ─── Auth state helpers ───────────────────────────────────────────────────
  isAuthenticated(): boolean {
    // Use useAuth() hook in React components instead
    return false;
  }
}

export const apiService = new ApiService(API_BASE_URL);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BookmarkData {
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content?: string;
  metadata?: {
    hadithNumber?: string;
    narrator?: string;
    source?: string;
    category?: string;
    surahNumber?: number;
    surahName?: string;
    verseNumber?: number;
    juzNumber?: number;
    duaCategory?: string;
    tasbihCount?: number;
    tasbihType?: string;
  };
  tags?: string[];
  notes?: string;
  isPublic?: boolean;
}

export default apiService;
