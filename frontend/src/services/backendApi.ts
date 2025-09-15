// Backend API service
const ENV_API_BASE: string | undefined = import.meta.env.VITE_API_URL_USER as any;
const isValidUrl = (url?: string) => !!url && /^https?:\/\/.+/.test(url);
const withApiSuffix = (url: string) => url.replace(/\/?$/, '').endsWith('/api') ? url : `${url.replace(/\/?$/, '')}/api`;
const fixLocalhostPortTypo = (url: string) => url
  // fix localhost3000 -> localhost:3000
  .replace(/localhost(\d{4,5})/, 'localhost:$1')
  // also fix https://localhost3000 -> https://localhost:3000
  .replace(/(https?:\/\/localhost)(\d{4,5})/, '$1:$2');

const DEFAULT_BASE = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ? 'http://localhost:3000/api'
  : 'https://muslimviet-user.onrender.com/api';

const API_BASE_URL = (() => {
  if (!isValidUrl(ENV_API_BASE)) return DEFAULT_BASE;
  const corrected = withApiSuffix(fixLocalhostPortTypo(ENV_API_BASE as string));
  return corrected;
})();

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('muslimviet_jwt_token');
  }

  private setToken(token: string) {
    console.log('BackendAPI: Setting JWT token:', token ? 'exists' : 'missing');
    this.token = token;
    localStorage.setItem('muslimviet_jwt_token', token);
    console.log('BackendAPI: JWT token saved to localStorage');
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('muslimviet_jwt_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('BackendAPI: Making request to:', url);
    console.log('BackendAPI: Token exists:', !!this.token);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      console.log('BackendAPI: Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearToken();
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async googleAuth(googleToken: string) {
    const response = await this.request<{
      user: any;
      token: string;
    }>('/auth/google', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${googleToken}`,
      },
    });

    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async refreshToken() {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
    
    this.setToken(response.token);
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  // User methods
  async getUserStats() {
    return this.request<any>('/users/stats');
  }

  async getUserActivity(page = 1, limit = 20) {
    return this.request<any>(`/users/activity?page=${page}&limit=${limit}`);
  }

  async searchBookmarks(query: string, type?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (type) params.append('type', type);
    
    return this.request<any>(`/users/search?${params}`);
  }

  async exportUserData() {
    const response = await fetch(`${this.baseURL}/users/export`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Bookmark methods
  async createBookmark(bookmarkData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isFavorite?: boolean;
    isPublic?: boolean;
  }) {
    return this.request<any>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(bookmarkData),
    });
  }

  async getBookmarks(params: {
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    favorite?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<any>(`/bookmarks?${searchParams}`);
  }

  async getBookmark(id: string) {
    return this.request<any>(`/bookmarks/${id}`);
  }

  async updateBookmark(id: string, updateData: any) {
    return this.request<any>(`/bookmarks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteBookmark(id: string) {
    return this.request<any>(`/bookmarks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(id: string) {
    return this.request<any>(`/bookmarks/${id}/favorite`, {
      method: 'PATCH',
    });
  }

  async getPopularBookmarks(type?: string, limit = 10) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (type) params.append('type', type);
    
    return this.request<any>(`/bookmarks/public/popular?${params}`);
  }

  async bulkBookmarkOperation(action: 'delete' | 'favorite' | 'unfavorite', bookmarkIds: string[]) {
    return this.request<any>('/bookmarks/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, bookmarkIds }),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export types
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
  isFavorite?: boolean;
  isPublic?: boolean;
}

export interface UserProfile {
  id: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      prayerTimes: boolean;
      quranReminder: boolean;
      hadithDaily: boolean;
    };
  };
  lastLogin: string;
  createdAt: string;
}

export default apiService;
