import { hadithBookmarkService } from './hadithBookmarkService';
import { useAuth } from '@/context/AuthContext';

export interface LocalBookmark {
  id: string;
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content: string;
  category?: string;
  metadata?: any;
  tags?: string[];
  notes?: string;
  isPublic: boolean;
  createdAt: string;
}

class HybridBookmarkService {
  private readonly STORAGE_KEY = 'muslimviet_bookmarks';

  // Get all bookmarks (local or backend based on auth status)
  async getBookmarks(isAuthenticated: boolean, type?: string): Promise<LocalBookmark[]> {
    if (isAuthenticated) {
      // Use backend API
      try {
        const backendBookmarks = await hadithBookmarkService.getBookmarks();
        return backendBookmarks.map(bookmark => ({
          id: bookmark.id || '',
          type: bookmark.type,
          itemId: bookmark.itemId.toString(),
          title: bookmark.title,
          content: bookmark.content,
          category: bookmark.category,
          metadata: undefined, // Backend doesn't support metadata
          tags: bookmark.tags,
          notes: bookmark.notes,
          isPublic: bookmark.isPublic,
          createdAt: bookmark.createdAt || new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to get bookmarks from backend, falling back to local:', error);
        return this.getLocalBookmarks(type);
      }
    } else {
      // Use local storage
      return this.getLocalBookmarks(type);
    }
  }

  // Get local bookmarks from localStorage
  private getLocalBookmarks(type?: string): LocalBookmark[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const bookmarks: LocalBookmark[] = stored ? JSON.parse(stored) : [];
      
      if (type) {
        return bookmarks.filter(bookmark => bookmark.type === type);
      }
      return bookmarks;
    } catch (error) {
      console.error('Failed to get local bookmarks:', error);
      return [];
    }
  }

  // Save local bookmarks to localStorage
  private saveLocalBookmarks(bookmarks: LocalBookmark[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save local bookmarks:', error);
    }
  }

  // Add bookmark (local or backend based on auth status)
  async addBookmark(isAuthenticated: boolean, bookmarkData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    category?: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<LocalBookmark> {
    
    const newBookmark: LocalBookmark = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: bookmarkData.type,
      itemId: bookmarkData.itemId,
      title: bookmarkData.title,
      content: bookmarkData.content,
      category: bookmarkData.category,
      metadata: bookmarkData.metadata,
      tags: bookmarkData.tags,
      notes: bookmarkData.notes,
      isPublic: bookmarkData.isPublic || false,
      createdAt: new Date().toISOString()
    };

    if (isAuthenticated) {
      // Use backend API
      try {
        const backendBookmark = await hadithBookmarkService.addBookmark({
          type: bookmarkData.type as 'hadith',
          itemId: parseInt(bookmarkData.itemId),
          category: bookmarkData.category || 'Unknown',
          title: bookmarkData.title,
          content: bookmarkData.content,
          tags: bookmarkData.tags,
          notes: bookmarkData.notes,
          isPublic: bookmarkData.isPublic || false,
          viewCount: 0
        });
        return {
          id: backendBookmark.id || newBookmark.id,
          type: backendBookmark.type,
          itemId: backendBookmark.itemId.toString(),
          title: backendBookmark.title,
          content: backendBookmark.content,
          category: backendBookmark.category,
          metadata: bookmarkData.metadata, // Keep original metadata for local storage
          tags: backendBookmark.tags,
          notes: backendBookmark.notes,
          isPublic: backendBookmark.isPublic,
          createdAt: backendBookmark.createdAt || newBookmark.createdAt
        };
      } catch (error) {
        console.error('Failed to add bookmark to backend, saving locally:', error);
        // Fallback to local storage
        const localBookmarks = this.getLocalBookmarks();
        localBookmarks.push(newBookmark);
        this.saveLocalBookmarks(localBookmarks);
        return newBookmark;
      }
    } else {
      // Use local storage
      const localBookmarks = this.getLocalBookmarks();
      localBookmarks.push(newBookmark);
      this.saveLocalBookmarks(localBookmarks);
      return newBookmark;
    }
  }

  // Remove bookmark (local or backend based on auth status)
  async removeBookmark(isAuthenticated: boolean, bookmarkId: string): Promise<void> {
    
    if (isAuthenticated) {
      // Use backend API
      try {
        await hadithBookmarkService.removeBookmark(bookmarkId);
        return;
      } catch (error) {
        console.error('Failed to remove bookmark from backend, removing locally:', error);
        // Fallback to local storage
        const localBookmarks = this.getLocalBookmarks();
        const updatedBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        this.saveLocalBookmarks(updatedBookmarks);
      }
    } else {
      // Use local storage
      const localBookmarks = this.getLocalBookmarks();
      const updatedBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      this.saveLocalBookmarks(updatedBookmarks);
    }
  }

  // Toggle bookmark (add if not exists, remove if exists)
  async toggleBookmark(isAuthenticated: boolean, bookmarkData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    category?: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<boolean> {
    
    // Check if already exists
    const existingBookmarks = await this.getBookmarks(isAuthenticated, bookmarkData.type);
    const existing = existingBookmarks.find(bookmark => bookmark.itemId === bookmarkData.itemId);
    
    if (existing) {
      // Remove existing
      await this.removeBookmark(isAuthenticated, existing.id);
      return false;
    } else {
      // Add new
      await this.addBookmark(isAuthenticated, bookmarkData);
      return true;
    }
  }

  // Check if item is bookmarked
  async isBookmarked(isAuthenticated: boolean, type: string, itemId: string): Promise<boolean> {
    
    if (isAuthenticated) {
      try {
        return await hadithBookmarkService.isBookmarked(parseInt(itemId));
      } catch (error) {
        console.error('Failed to check bookmark status from backend, checking locally:', error);
        // Fallback to local check
        const localBookmarks = this.getLocalBookmarks(type);
        return localBookmarks.some(bookmark => bookmark.itemId === itemId);
      }
    } else {
      // Use local storage
      const localBookmarks = this.getLocalBookmarks(type);
      return localBookmarks.some(bookmark => bookmark.itemId === itemId);
    }
  }

  // Sync local bookmarks to backend (called when user logs in)
  async syncLocalToBackend(isAuthenticated: boolean): Promise<void> {
    
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot sync to backend');
      return;
    }

    try {
      const localBookmarks = this.getLocalBookmarks();
      
      if (localBookmarks.length === 0) {
        console.log('No local bookmarks to sync');
        return;
      }

      console.log(`Syncing ${localBookmarks.length} local bookmarks to backend...`);
      
      // Sync each local bookmark to backend
      for (const localBookmark of localBookmarks) {
        try {
          await hadithBookmarkService.addBookmark({
            type: localBookmark.type as 'hadith',
            itemId: parseInt(localBookmark.itemId),
            category: localBookmark.category || 'Unknown',
            title: localBookmark.title,
            content: localBookmark.content,
            tags: localBookmark.tags,
            notes: localBookmark.notes,
            isPublic: localBookmark.isPublic,
            viewCount: 0
          });
        } catch (error) {
          console.error(`Failed to sync bookmark ${localBookmark.id}:`, error);
        }
      }

      // Clear local bookmarks after successful sync
      this.saveLocalBookmarks([]);
      console.log('Local bookmarks synced to backend successfully');
      
    } catch (error) {
      console.error('Failed to sync local bookmarks to backend:', error);
    }
  }

  // Get local bookmarks count (for display purposes)
  getLocalBookmarksCount(type?: string): number {
    return this.getLocalBookmarks(type).length;
  }

  // Clear all local bookmarks
  clearLocalBookmarks(): void {
    this.saveLocalBookmarks([]);
  }
}

export const hybridBookmarkService = new HybridBookmarkService();
export default hybridBookmarkService;

// Custom hook for using the hybrid bookmark service
export function useHybridBookmarkService() {
  const { isAuthenticated } = useAuth();
  
  return {
    getBookmarks: (type?: string) => 
      hybridBookmarkService.getBookmarks(isAuthenticated, type),
    addBookmark: (bookmarkData: Parameters<typeof hybridBookmarkService.addBookmark>[1]) => 
      hybridBookmarkService.addBookmark(isAuthenticated, bookmarkData),
    removeBookmark: (bookmarkId: string) => 
      hybridBookmarkService.removeBookmark(isAuthenticated, bookmarkId),
    toggleBookmark: (bookmarkData: Parameters<typeof hybridBookmarkService.toggleBookmark>[1]) => 
      hybridBookmarkService.toggleBookmark(isAuthenticated, bookmarkData),
    isBookmarked: (type: string, itemId: string) => 
      hybridBookmarkService.isBookmarked(isAuthenticated, type, itemId),
    syncLocalToBackend: () => 
      hybridBookmarkService.syncLocalToBackend(isAuthenticated),
    getLocalBookmarksCount: (type?: string) => 
      hybridBookmarkService.getLocalBookmarksCount(type),
    clearLocalBookmarks: () => 
      hybridBookmarkService.clearLocalBookmarks()
  };
}
