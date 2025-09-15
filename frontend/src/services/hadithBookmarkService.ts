import apiService from './backendApi';

export interface HadithBookmark {
  id?: string;
  userId: string;
  type: 'hadith';
  itemId: number;
  category: string;
  title: string;
  content: string;
  notes?: string;
  tags?: string[];
  isPublic: boolean;
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

class HadithBookmarkService {
  // Get all Hadith bookmarks for current user
  async getBookmarks(): Promise<HadithBookmark[]> {
    try {
      console.log('HadithBookmarkService: Getting bookmarks...');
      const response = await apiService.get<{ data: HadithBookmark[] }>('/bookmarks?type=hadith');
      console.log('HadithBookmarkService: Got response:', response);
      return response?.data || [];
    } catch (error) {
      console.error('Failed to get Hadith bookmarks:', error);
      return [];
    }
  }


  // Add bookmark
  async addBookmark(bookmark: Omit<HadithBookmark, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<HadithBookmark> {
    try {
      // Validate required fields
      if (!bookmark.content || bookmark.content.trim() === '') {
        throw new Error('Content is required and cannot be empty');
      }
      
      console.log('HadithBookmarkService: Adding bookmark with data:', bookmark);
      const response = await apiService.post<{ data: HadithBookmark }>('/bookmarks', {
        ...bookmark,
        type: 'hadith',
        isPublic: false,
        viewCount: 0,
      });
      console.log('HadithBookmarkService: Add bookmark response:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to add Hadith bookmark:', error);
      throw error;
    }
  }


  // Remove bookmark
  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      await apiService.delete(`/bookmarks/${bookmarkId}`);
    } catch (error) {
      console.error('Failed to remove Hadith bookmark:', error);
      throw error;
    }
  }


  // Check if Hadith is bookmarked
  async isBookmarked(hadithId: number): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(b => b.itemId === hadithId);
    } catch (error) {
      console.error('Failed to check if Hadith is bookmarked:', error);
      return false;
    }
  }


  // Toggle bookmark
  async toggleBookmark(hadithId: number, hadithData: { category: string; title: string; content: string }): Promise<boolean> {
    try {
      const isBookmarked = await this.isBookmarked(hadithId);
      
      if (isBookmarked) {
        const bookmarks = await this.getBookmarks();
        const bookmark = bookmarks.find(b => b.itemId === hadithId);
        if (bookmark) {
          await this.removeBookmark(bookmark.id!);
        }
        return false;
      } else {
        await this.addBookmark({
          type: 'hadith',
          itemId: hadithId,
          category: hadithData.category,
          title: hadithData.title,
          content: hadithData.content,
          isPublic: false,
          viewCount: 0,
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to toggle Hadith bookmark:', error);
      throw error;
    }
  }

}

export const hadithBookmarkService = new HadithBookmarkService();
