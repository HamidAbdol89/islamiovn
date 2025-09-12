import { useCallback } from 'react';
import type { Scholar } from '../types';

export const useRssFeed = () => {
  const fetchRSSFeed = useCallback(async (
    scholarId: string, 
    setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>
  ): Promise<void> => {
    try {
      setScholars(prev => prev.map(s => 
        s.id === scholarId ? { ...s, isLoading: true, error: undefined } : s
      ));

      // Dynamic server URL - using environment variable or fallback
      const serverUrl = import.meta.env.VITE_API_BASE_URL_PODCAST
      || (window.location.hostname === 'localhost'
          ? 'http://localhost:8080'
          : 'https://podcast-production-e25a.up.railway.app');
    
    


      const response = await fetch(`${serverUrl}/api/rss/${scholarId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch episodes');
      }

      const episodes = data.episodes || [];

      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, episodes, isLoading: false, error: undefined }
          : s
      ));

    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, isLoading: false, error: 'Encountered an error. Please try again.' }
          : s
      ));
    }
  }, []);

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
