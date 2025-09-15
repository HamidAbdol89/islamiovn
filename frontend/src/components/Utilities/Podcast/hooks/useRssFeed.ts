import { useCallback, useMemo } from 'react';
import type { Scholar } from '../types';

// Memoized server URL outside component to prevent recreation
const getServerUrl = () => {
  return import.meta.env.VITE_API_BASE_URL_PODCAST
    || (window.location.hostname === 'localhost'
        ? 'http://localhost:8080'
        : 'https://podcast-production-e25a.up.railway.app');
};

// Memoized error messages in Vietnamese
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Gặp lỗi khi tải dữ liệu. Vui lòng thử lại.',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
} as const;

export const useRssFeed = () => {
  // Memoize server URL to prevent recalculation
  const serverUrl = useMemo(() => getServerUrl(), []);

  const fetchRSSFeed = useCallback(async (
    scholarId: string, 
    setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>
  ): Promise<void> => {
    try {
      setScholars(prev => prev.map(s => 
        s.id === scholarId ? { ...s, isLoading: true, error: undefined } : s
      ));

      const response = await fetch(`${serverUrl}/api/rss/${scholarId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = response.status >= 500 
          ? ERROR_MESSAGES.SERVER_ERROR 
          : ERROR_MESSAGES.NETWORK_ERROR;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || ERROR_MESSAGES.FETCH_FAILED);
      }

      const episodes = data.episodes || [];

      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, episodes, isLoading: false, error: undefined }
          : s
      ));

    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_FAILED;
      
      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, isLoading: false, error: errorMessage }
          : s
      ));
    }
  }, [serverUrl]);

  const retryFetch = useCallback((
    scholarId: string, 
    scholars: Scholar[], 
    setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>
  ) => {
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar) {
      fetchRSSFeed(scholarId, setScholars);
    }
  }, [fetchRSSFeed]);

  return {
    fetchRSSFeed,
    retryFetch
  };
};
