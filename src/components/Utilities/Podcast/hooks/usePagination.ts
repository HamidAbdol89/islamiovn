import { useState, useMemo } from 'react';
import type { PodcastEpisode } from '../types';
import { EPISODES_PER_PAGE } from '../constants';

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedEpisodes = useMemo(() => 
    (episodes: PodcastEpisode[] = []) => {
      const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
      const endIndex = startIndex + EPISODES_PER_PAGE;
      return episodes.slice(startIndex, endIndex);
    }, [currentPage]
  );

  const getTotalPages = useMemo(() => 
    (totalEpisodes: number) => Math.ceil(totalEpisodes / EPISODES_PER_PAGE),
    []
  );

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    getPaginatedEpisodes,
    getTotalPages,
    resetPage,
    episodesPerPage: EPISODES_PER_PAGE
  };
};
