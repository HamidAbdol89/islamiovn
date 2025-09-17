// Custom hook for search analytics and tracking
import { useState, useCallback, useEffect, useMemo } from 'react';

const ANALYTICS_STORAGE_KEY = 'masjid-search-analytics';
const MAX_SEARCH_HISTORY = 50;

interface SearchEntry {
  query: string;
  region: string;
  timestamp: number;
  resultsCount: number;
}

interface SearchAnalytics {
  searches: SearchEntry[];
  totalSearches: number;
  lastUpdated: number;
}

export const useSearchAnalytics = () => {
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    searches: [],
    totalSearches: 0,
    lastUpdated: Date.now()
  });

  // Load analytics from localStorage on mount
  useEffect(() => {
    try {
      const savedAnalytics = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (savedAnalytics) {
        const parsed = JSON.parse(savedAnalytics);
        setAnalytics(parsed);
      }
    } catch (error) {
      console.warn('Failed to load search analytics:', error);
    }
  }, []);

  // Save analytics to localStorage
  const saveAnalytics = useCallback((newAnalytics: SearchAnalytics) => {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(newAnalytics));
    } catch (error) {
      console.warn('Failed to save search analytics:', error);
    }
  }, []);

  // Track a search
  const trackSearch = useCallback((query: string, region: string, resultsCount: number) => {
    // Don't track empty searches
    if (!query.trim()) return;

    const newEntry: SearchEntry = {
      query: query.trim().toLowerCase(),
      region,
      timestamp: Date.now(),
      resultsCount
    };

    setAnalytics(prev => {
      const newSearches = [newEntry, ...prev.searches].slice(0, MAX_SEARCH_HISTORY);
      const newAnalytics = {
        searches: newSearches,
        totalSearches: prev.totalSearches + 1,
        lastUpdated: Date.now()
      };
      
      saveAnalytics(newAnalytics);
      return newAnalytics;
    });
  }, [saveAnalytics]);

  // Get popular search terms
  const popularSearches = useMemo(() => {
    const searchCounts = new Map<string, number>();
    
    analytics.searches.forEach(search => {
      const count = searchCounts.get(search.query) || 0;
      searchCounts.set(search.query, count + 1);
    });

    return Array.from(searchCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }, [analytics.searches]);

  // Get recent searches
  const recentSearches = useMemo(() => {
    const uniqueSearches = new Map<string, SearchEntry>();
    
    analytics.searches.forEach(search => {
      if (!uniqueSearches.has(search.query)) {
        uniqueSearches.set(search.query, search);
      }
    });

    return Array.from(uniqueSearches.values())
      .slice(0, 5);
  }, [analytics.searches]);

  // Get search statistics
  const searchStats = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const todaySearches = analytics.searches.filter(s => s.timestamp > oneDayAgo);
    const weekSearches = analytics.searches.filter(s => s.timestamp > oneWeekAgo);

    const avgResultsCount = analytics.searches.length > 0
      ? analytics.searches.reduce((sum, s) => sum + s.resultsCount, 0) / analytics.searches.length
      : 0;

    return {
      total: analytics.totalSearches,
      today: todaySearches.length,
      thisWeek: weekSearches.length,
      averageResults: Math.round(avgResultsCount)
    };
  }, [analytics]);

  // Get region distribution
  const regionStats = useMemo(() => {
    const regionCounts = new Map<string, number>();
    
    analytics.searches.forEach(search => {
      const count = regionCounts.get(search.region) || 0;
      regionCounts.set(search.region, count + 1);
    });

    return Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([region, count]) => ({ region, count }));
  }, [analytics.searches]);

  // Clear analytics
  const clearAnalytics = useCallback(() => {
    const emptyAnalytics = {
      searches: [],
      totalSearches: 0,
      lastUpdated: Date.now()
    };
    
    setAnalytics(emptyAnalytics);
    saveAnalytics(emptyAnalytics);
  }, [saveAnalytics]);

  return {
    analytics,
    popularSearches,
    recentSearches,
    searchStats,
    regionStats,
    trackSearch,
    clearAnalytics
  };
};
