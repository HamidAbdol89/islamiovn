// hooks/useRssNews.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  summary: string;
  publishedAt: string;
  link: string;
  source?: { name?: string; url?: string };
  language?: string;
}

export interface NewsItemRss {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
  source?: string;
  image?: string;
}

export interface RssResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  news: NewsItemRss[];
}

// Type cho API response có thể có nhiều format khác nhau
type ApiResponse = 
  | NewsItemRss[] // Mảng trực tiếp
  | RssResponse // Structured response
  | { news: NewsItemRss[] } // Nested news
  | { results: NewsItemRss[] } // Alternative format
  | Record<string, unknown>; // Fallback cho unknown structure

// Hàm helper để xác định base API URL
const getApiBaseUrl = (): string => {
  if (window.location.hostname === 'muslimviet.vercel.app') {
    return 'https://rss-news-production.up.railway.app';
  }
  return window.location.origin;
};

// Cache để lưu trữ dữ liệu tạm thời
const newsCache = new Map<string, { data: NewsItemRss[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Helper function để tạo cache key
const getCacheKey = (page: number, limit: number): string => `rss_${page}_${limit}`;

// Helper function để kiểm tra cache có còn hợp lệ không
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export function useNewsFeed({ 
  endpoint, 
  language, 
  page, 
  limit 
}: { 
  endpoint: string; 
  language: string; 
  page: number; 
  limit: number; 
}) {
  return useQuery({
    queryKey: ['news', endpoint, language, page, limit],
    queryFn: async (): Promise<ApiResponse> => {
      const apiBaseUrl = getApiBaseUrl();
      const url = new URL(`/api/${endpoint}`, apiBaseUrl);
      
      url.searchParams.append('language', language);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      
      const controller = new AbortController();
      
      // Timeout sau 10 giây
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      
      try {
        const res = await fetch(url.toString(), {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }
        
        const data = await res.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    select: (data: ApiResponse): NewsItemRss[] => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'news' in data && Array.isArray(data.news)) return data.news;
      if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) return data.results;
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút (gcTime thay thế cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

interface UseRssNewsReturn {
  news: NewsItemRss[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  refetch: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

export const useRssNews = (page = 1, limit = 10): UseRssNewsReturn => {
  const [news, setNews] = useState<NewsItemRss[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: page,
    totalPages: 1,
    limit
  });

  // Ref để track request hiện tại và tránh race condition
  const currentRequestRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Helper function để xử lý dữ liệu an toàn
  const processSafeNewsData = useCallback((newsData: NewsItemRss[]): NewsItemRss[] => {
    return newsData.map(item => ({
      ...item,
      image: (!item.image || item.image === 'null' || item.image === 'undefined') 
        ? '/default-news.jpg' 
        : item.image,
      title: item.title || 'Không có tiêu đề',
      link: item.link || '#',
      contentSnippet: item.contentSnippet || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: item.source || 'Không rõ nguồn'
    }));
  }, []);

  // Function để fetch dữ liệu từ API
  const fetchNewsData = useCallback(async (
    currentPage: number, 
    currentLimit: number, 
    isLoadMore = false
  ): Promise<void> => {
    // Hủy request trước đó nếu có
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Tạo AbortController mới
    const controller = new AbortController();
    currentRequestRef.current = controller;

    try {
      // Kiểm tra cache trước
      const cacheKey = getCacheKey(currentPage, currentLimit);
      const cached = newsCache.get(cacheKey);
      
      if (cached && isCacheValid(cached.timestamp)) {
        console.log(`Sử dụng cache cho page=${currentPage}, limit=${currentLimit}`);
        const safeData = processSafeNewsData(cached.data);
        
        if (mountedRef.current) {
            setLoading(false); // Thêm dòng này

          if (isLoadMore) {
            setNews(prev => [...prev, ...safeData]);
          } else {
            setNews(safeData);
          }
          setLoading(false);
          setLoadingMore(false);
        }
        return;
      }

     if (!isLoadMore) {
  setLoading(true);
} else {
  setLoadingMore(true);
}
      setError(null);

      console.log(`Đang fetch RSS API - page=${currentPage}, limit=${currentLimit}...`);

      const apiBaseUrl = getApiBaseUrl();
      const url = new URL('/api/rss', apiBaseUrl);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', currentLimit.toString());

      console.log('Calling API:', url.toString());

      const response = await axios.get(url.toString(), {
        timeout: 20000, // 12 giây timeout
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      // Kiểm tra component vẫn được mount
      if (!mountedRef.current) return;

      console.log('RSS API Response Status:', response.status);

      let responseData = response.data;

      // Xử lý trường hợp dữ liệu là string
      if (typeof responseData === 'string') {
        const trimmed = responseData.trim();
        if (trimmed.startsWith('<')) {
          throw new Error('API trả về HTML, có thể do lỗi server');
        }
        try {
          responseData = JSON.parse(responseData);
        } catch {
          throw new Error('Không thể parse dữ liệu JSON');
        }
      }

      let newsData: NewsItemRss[] = [];
      let paginationData = {
        total: 0,
        currentPage,
        totalPages: 1,
        limit: currentLimit
      };

      // Xử lý các format dữ liệu khác nhau
      if (responseData?.success && Array.isArray(responseData.news)) {
        console.log('Structured RSS data:', responseData.news.length, 'items');
        newsData = responseData.news;
        paginationData = {
          total: responseData.total || 0,
          currentPage: responseData.page || currentPage,
          totalPages: responseData.totalPages || 1,
          limit: responseData.limit || currentLimit
        };
      } else if (Array.isArray(responseData)) {
        console.log('Direct array RSS data:', responseData.length, 'items');
        newsData = responseData;
        paginationData = {
          total: responseData.length,
          currentPage,
          totalPages: Math.ceil(responseData.length / currentLimit),
          limit: currentLimit
        };
      } else if (responseData?.news && Array.isArray(responseData.news)) {
        console.log('Nested RSS data:', responseData.news.length, 'items');
        newsData = responseData.news;
        paginationData = {
          total: responseData.news.length,
          currentPage,
          totalPages: Math.ceil(responseData.news.length / currentLimit),
          limit: currentLimit
        };
      } else {
        throw new Error('Dữ liệu không đúng định dạng mong đợi');
      }

      // Xử lý và cache dữ liệu
      const safeNewsData = processSafeNewsData(newsData);
      
      // Lưu vào cache
      newsCache.set(cacheKey, {
        data: safeNewsData,
        timestamp: Date.now()
      });

      // Cập nhật state nếu component vẫn được mount
      if (mountedRef.current) {
        if (isLoadMore) {
          setNews(prev => [...prev, ...safeNewsData]);
        } else {
          setNews(safeNewsData);
        }
        setPagination(paginationData);
        console.log('RSS news updated:', safeNewsData.length, 'items');
      }

    } catch (err: unknown) {
      const error = err as Error & { name?: string; code?: string };
      
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('Request đã bị hủy');
        return;
      }

      console.error('RSS fetch error:', error.message);
      
      if (mountedRef.current) {
        setError(error.message || 'Không thể tải tin tức');
        if (!isLoadMore) {
          setNews([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [processSafeNewsData]);

  // Function để refetch dữ liệu
  const refetch = useCallback(() => {
    // Xóa cache
    const cacheKey = getCacheKey(page, limit);
    newsCache.delete(cacheKey);
    
    fetchNewsData(page, limit);
  }, [page, limit, fetchNewsData]);

  // Effect chính để fetch dữ liệu khi page hoặc limit thay đổi
  useEffect(() => {
    mountedRef.current = true;
    fetchNewsData(page, limit);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [page, limit, fetchNewsData]);

  // Cleanup effect khi component unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  const hasMore = pagination.currentPage < pagination.totalPages;

  return {
    news,
    loading,
    error,
    pagination,
    refetch,
    hasMore,
    loadingMore
  };
};