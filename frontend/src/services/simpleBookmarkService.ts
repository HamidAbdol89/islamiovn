import { hadithBookmarkService } from './hadithBookmarkService';
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore';

export interface SimpleBookmark {
  id: string;
  type: 'hadith' | 'quran' | 'dua' | 'tasbih';
  itemId: string;
  title: string;
  content: string;
  category?: string;
  notes?: string;
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
}

class SimpleBookmarkService {
  // Get all bookmarks from backend (only for authenticated users)
  async getBookmarks(_type?: string): Promise<SimpleBookmark[]> {
    try {
      const response = await hadithBookmarkService.getBookmarks();
      console.log('🔵 Backend bookmarks response:', response);
      
      // Backend returns pagination object, extract items array
      const bookmarks = (response as any)?.items || response || [];
      
      return bookmarks.map((bookmark: any) => ({
        id: bookmark._id || bookmark.id || '',
        type: bookmark.type,
        itemId: bookmark.itemId.toString(),
        title: bookmark.title,
        content: bookmark.content,
        category: bookmark.metadata?.category || 'Unknown',
        notes: bookmark.notes,
        tags: bookmark.tags,
        isPublic: bookmark.isPublic,
        createdAt: bookmark.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to get bookmarks from backend:', error);
      // Return empty array on error to prevent UI issues
      return [];
    }
  }

  // Add bookmark to backend (only for authenticated users)
  async addBookmark(bookmarkData: {
    type: 'hadith' | 'quran' | 'dua' | 'tasbih';
    itemId: string;
    title: string;
    content: string;
    category?: string;
    metadata?: any;
    tags?: string[];
    notes?: string;
    isPublic?: boolean;
  }): Promise<SimpleBookmark> {
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
      id: backendBookmark.id || '',
      type: backendBookmark.type,
      itemId: backendBookmark.itemId.toString(),
      title: backendBookmark.title,
      content: backendBookmark.content,
      category: backendBookmark.category,
      notes: backendBookmark.notes,
      tags: backendBookmark.tags,
      isPublic: backendBookmark.isPublic,
      createdAt: backendBookmark.createdAt || new Date().toISOString()
    };
  }

  // Remove bookmark from backend (only for authenticated users)
  async removeBookmark(bookmarkId: string): Promise<void> {
    await hadithBookmarkService.removeBookmark(bookmarkId);
  }

  // Toggle bookmark (add if not exists, remove if exists)
  async toggleBookmark(bookmarkData: {
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
    const isBookmarked = await hadithBookmarkService.isBookmarked(parseInt(bookmarkData.itemId));
    
    if (isBookmarked) {
      const bookmarks = await this.getBookmarks();
      const bookmark = bookmarks.find(b => b.itemId === bookmarkData.itemId);
      if (bookmark) {
        await this.removeBookmark(bookmark.id);
      }
      return false;
    } else {
      await this.addBookmark(bookmarkData);
      return true;
    }
  }

  // Check if item is bookmarked
  async isBookmarked(_type: string, itemId: string): Promise<boolean> {
    try {
      return await hadithBookmarkService.isBookmarked(parseInt(itemId));
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
      return false;
    }
  }
}

export const simpleBookmarkService = new SimpleBookmarkService();

// Custom hook for using the simple bookmark service
export function useSimpleBookmarkService() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  
  return {
    getBookmarks: (type?: string) => 
      isAuthenticated ? simpleBookmarkService.getBookmarks(type) : Promise.resolve([]),
    addBookmark: (bookmarkData: Parameters<typeof simpleBookmarkService.addBookmark>[0]) => 
      isAuthenticated ? simpleBookmarkService.addBookmark(bookmarkData) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    removeBookmark: (bookmarkId: string) => 
      isAuthenticated ? simpleBookmarkService.removeBookmark(bookmarkId) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    toggleBookmark: (bookmarkData: Parameters<typeof simpleBookmarkService.toggleBookmark>[0]) => 
      isAuthenticated ? simpleBookmarkService.toggleBookmark(bookmarkData) : Promise.reject(new Error('Vui lòng đăng nhập để sử dụng chức năng này')),
    isBookmarked: (type: string, itemId: string) => 
      isAuthenticated ? simpleBookmarkService.isBookmarked(type, itemId) : Promise.resolve(false)
  };
}
