import type { HadithSummary, ApiResponse } from '../types';
import { VITE_API_BASE } from '../constants';

interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
}

interface BatchOptions {
  delayBetweenRequests?: number; // ms delay between requests
  maxConcurrentRequests?: number;
  onProgress?: (progress: BatchProgress) => void;
  onError?: (error: Error, page: number) => void;
}

class HadithBatchService {
  private cache = new Map<string, HadithSummary[]>();
  
  // Rate limiting
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 500; // 500ms between requests

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await this.delay(this.MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
    return fetch(url);
  }

  private getCacheKey(categoryId: number): string {
    return `category_${categoryId}_all`;
  }

  async fetchAllHadiths(
    categoryId: number, 
    options: BatchOptions = {}
  ): Promise<HadithSummary[]> {
    const cacheKey = this.getCacheKey(categoryId);
    
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const {
      delayBetweenRequests = 300,
      maxConcurrentRequests = 2,
      onProgress,
      onError
    } = options;

    try {
      // Try multiple approaches to get all hadiths
      let apiUrl = `${VITE_API_BASE}/hadeeths/list/?language=vi&category_id=${categoryId}`;
      
      // First try with high per_page limit
      const urls = [
        `${apiUrl}&per_page=1000`,
        `${apiUrl}&per_page=500`, 
        `${apiUrl}&limit=1000`,
        `${apiUrl}`,
        `${VITE_API_BASE}/hadeeths/?language=vi&category_id=${categoryId}`,
      ];
      
      let firstPageResponse;
      let workingUrl = '';
      
      for (const url of urls) {
        try {
          console.log(`Trying API call: ${url}`);
          firstPageResponse = await this.rateLimitedFetch(url);
          if (firstPageResponse.ok) {
            workingUrl = url;
            break;
          }
        } catch (e) {
          console.log(`Failed with URL: ${url}`);
        }
      }
      
      if (!firstPageResponse || !firstPageResponse.ok) {
        throw new Error('Không thể tải dữ liệu từ API');
      }
      
      console.log(`Working URL: ${workingUrl}`);
      
      if (!firstPageResponse.ok) {
        throw new Error('Không thể tải trang đầu tiên');
      }

      const firstPageData = await firstPageResponse.json();
      console.log(`Full API Response:`, firstPageData);
      
      // API trả về array trực tiếp, không có pagination
      if (Array.isArray(firstPageData)) {
        console.log(`API returns array directly with ${firstPageData.length} hadiths`);
        this.cache.set(cacheKey, firstPageData);
        return firstPageData;
      }
      
      // Nếu có structure pagination
      const totalPages = firstPageData.last_page || 1;
      const allHadiths: HadithSummary[] = [...(firstPageData.data || [])];
      
      console.log(`API Response - Total pages: ${totalPages}, First page has ${allHadiths.length} hadiths`);

      // Update progress
      onProgress?.({
        current: 1,
        total: totalPages,
        percentage: Math.round((1 / totalPages) * 100)
      });

      if (totalPages === 1) {
        console.log(`Only 1 page found, returning ${allHadiths.length} hadiths`);
        this.cache.set(cacheKey, allHadiths);
        return allHadiths;
      }
      
      console.log(`Found ${totalPages} pages, starting to load remaining ${totalPages - 1} pages...`);

      // Fetch remaining pages with controlled concurrency
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const chunks = this.chunkArray(remainingPages, maxConcurrentRequests);

      for (const chunk of chunks) {
        const promises = chunk.map(async (page) => {
          try {
            await this.delay(delayBetweenRequests);
            
            const response = await this.rateLimitedFetch(
              `${VITE_API_BASE}/hadeeths/list/?language=vi&category_id=${categoryId}&page=${page}`
            );
            
            if (!response.ok) {
              throw new Error(`Lỗi tải trang ${page}`);
            }

            const data: ApiResponse<HadithSummary> = await response.json();
            return { page, data: data.data };
          } catch (error) {
            onError?.(error as Error, page);
            return { page, data: [] };
          }
        });

        const results = await Promise.all(promises);
        
        // Add results to allHadiths in correct order
        results
          .sort((a, b) => a.page - b.page)
          .forEach(result => {
            allHadiths.push(...result.data);
          });

        // Update progress
        const completedPages = allHadiths.length > 0 ? 
          Math.ceil(allHadiths.length / firstPageData.per_page) : 1;
      
        console.log(`Batch loading progress: ${allHadiths.length} hadiths loaded from ${completedPages}/${totalPages} pages`);
      
        onProgress?.({
          current: Math.min(completedPages, totalPages),
          total: totalPages,
          percentage: Math.round((Math.min(completedPages, totalPages) / totalPages) * 100)
        });
      }

      // Cache the complete result
      console.log(`Final result: Cached ${allHadiths.length} hadiths for category ${categoryId}`);
      this.cache.set(cacheKey, allHadiths);
      return allHadiths;

    } catch (error) {
      throw new Error(`Lỗi tải toàn bộ hadith: ${(error as Error).message}`);
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Get cached hadiths count
  getCachedCount(categoryId: number): number {
    const cacheKey = this.getCacheKey(categoryId);
    return this.cache.get(cacheKey)?.length || 0;
  }

  // Check if category is fully cached
  isFullyCached(categoryId: number): boolean {
    return this.cache.has(this.getCacheKey(categoryId));
  }

  // Clear cache for a specific category
  clearCache(categoryId: number): void {
    const cacheKey = this.getCacheKey(categoryId);
    this.cache.delete(cacheKey);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { categories: number; totalHadiths: number } {
    let totalHadiths = 0;
    this.cache.forEach(hadiths => {
      totalHadiths += hadiths.length;
    });
    
    return {
      categories: this.cache.size,
      totalHadiths
    };
  }
}

export const hadithBatchService = new HadithBatchService();
