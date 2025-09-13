import { useState, useMemo, useCallback } from 'react';
import type { PodcastEpisode } from '../types';
import { EPISODES_PER_PAGE } from '../constants';

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(() => 1);

  const getPaginatedEpisodes = useCallback(
    (episodes: PodcastEpisode[] = []) => {
      const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
      const endIndex = startIndex + EPISODES_PER_PAGE;
      return episodes.slice(startIndex, endIndex);
    }, 
    [currentPage]
  );

  const getTotalPages = useCallback(
    (totalEpisodes: number) => Math.ceil(totalEpisodes / EPISODES_PER_PAGE),
    []
  );

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const goToNextPage = useCallback((totalPages: number) => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number, totalPages: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, []);

  const paginationInfo = useMemo(() => ({
    episodesPerPage: EPISODES_PER_PAGE,
    hasNextPage: (totalPages: number) => currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }), [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    getPaginatedEpisodes,
    getTotalPages,
    resetPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    ...paginationInfo
  };
};