import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect } from 'react';

// Import types
import type { PodcastEpisode, Scholar } from './types';

// Import constants
import { INITIAL_SCHOLARS, EPISODES_PER_PAGE } from './constants';

// Import hooks
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useRssFeed } from './hooks/useRssFeed';
import { usePagination } from './hooks/usePagination';

// Lazy load components for better performance
const MiniPlayer = lazy(() => import('./components/MiniPlayer'));
const Header = lazy(() => import('./components/Header'));
const ScholarList = lazy(() => import('./components/ScholarList'));
const EpisodeList = lazy(() => import('./components/EpisodeList'));

// Loading fallback component
const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
));

interface PodcastProps {
  handleBackToHome: () => void;
}

// Memoized Vietnamese UI text constants
const UI_TEXT = {
  TITLE: 'Podcast Học Giả Islam',
  LOADING: 'Đang tải...',
  NOW_PLAYING: 'Đang phát',
} as const;

const Podcast: React.FC<PodcastProps> = ({ handleBackToHome }) => {
  // Remove isDarkMode state - using CSS theme system instead
  const [currentScholar, setCurrentScholar] = useState<string | null>(() => null);
  const [scholars, setScholars] = useState<Scholar[]>(() => INITIAL_SCHOLARS);
  const [searchTerm, setSearchTerm] = useState(() => '');
  const [episodeSearchTerm, setEpisodeSearchTerm] = useState(() => '');
  
  // Audio player hook
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    autoPlayNext,
    playEpisode,
    playNextEpisode,
    togglePlayPause,
    forward,
    rewind,
    seekToPercentage,
    toggleAutoPlayNext,
    updateScholarsData
  } = useAudioPlayer();
  
  // RSS feed hook
  const { fetchRSSFeed, retryFetch } = useRssFeed();
  
  // Pagination hook
  const { currentPage, setCurrentPage, getPaginatedEpisodes } = usePagination();
  
  // Memoized current scholar data
  const currentScholarData = useMemo(() => 
    scholars.find(s => s.id === currentScholar),
    [scholars, currentScholar]
  );
  
  // Thêm hàm handleSearchChange
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);
  
  // Thêm hàm xử lý tìm kiếm episode
  const handleEpisodeSearchChange = useCallback((term: string) => {
    setEpisodeSearchTerm(term);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, [setCurrentPage]);
  
  // Thêm hàm lọc episodes dựa trên search term
  const filteredEpisodes = useMemo(() => {
    if (!currentScholarData || !episodeSearchTerm) {
      return currentScholarData?.episodes || [];
    }
    
    const searchTermLower = episodeSearchTerm.toLowerCase();
    return currentScholarData.episodes.filter(episode => 
      episode.title.toLowerCase().includes(searchTermLower) ||
      episode.description.toLowerCase().includes(searchTermLower)
    );
  }, [currentScholarData, episodeSearchTerm]);

  // Reset episode search term khi chuyển đổi giữa các trang
  useEffect(() => {
    if (!currentScholar) {
      setEpisodeSearchTerm('');
    }
  }, [currentScholar]);
  
  const handleScholarSelect = useCallback((scholarId: string) => {
    setCurrentScholar(scholarId);
    setCurrentPage(1);
    setEpisodeSearchTerm('');
    
    // Fetch RSS feed if episodes are empty
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar && scholar.episodes.length === 0 && !scholar.isLoading) {
      fetchRSSFeed(scholarId, setScholars);
    }
  }, [scholars, fetchRSSFeed, setCurrentPage]);
  
  const handleEpisodePlay = useCallback((episode: PodcastEpisode) => {
    playEpisode(episode, currentScholar || undefined);
  }, [playEpisode, currentScholar]);

  const handlePlayNext = useCallback(() => {
    if (currentScholar) {
      playNextEpisode(scholars, currentScholar);
    }
  }, [playNextEpisode, scholars, currentScholar]);
  
  const handlePaginationChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);
  
  const handleRetryFetch = useCallback((scholarId: string) => {
    retryFetch(scholarId, scholars, setScholars);
  }, [retryFetch, scholars]);
  
  const handleGoBack = useCallback(() => {
    setCurrentScholar(null);
    setEpisodeSearchTerm('');
  }, []);

  // Update scholars data for auto-play functionality
  useEffect(() => {
    updateScholarsData(scholars);
  }, [scholars, updateScholarsData]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-smooth">
      <Suspense fallback={<LoadingFallback />}>
        <Header 
          title={currentScholarData ? currentScholarData.name : UI_TEXT.TITLE}
          onBack={currentScholar ? handleGoBack : handleBackToHome}
          searchTerm={currentScholar ? episodeSearchTerm : searchTerm}
          onSearchChange={currentScholar ? handleEpisodeSearchChange : handleSearchChange}
          isEpisodeList={!!currentScholar}
        />
      </Suspense>
      
      <div className="pb-24">
        <Suspense fallback={<LoadingFallback />}>
          {!currentScholar ? (
            <ScholarList
              scholars={scholars}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onScholarSelect={handleScholarSelect}
            />
          ) : (
            <EpisodeList
              scholar={currentScholarData!}
              currentEpisode={currentEpisode}
              isPlaying={isPlaying}
              paginatedEpisodes={getPaginatedEpisodes(filteredEpisodes)}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE)}
              onEpisodePlay={handleEpisodePlay}
              onPageChange={handlePaginationChange}
              onRetry={() => handleRetryFetch(currentScholar!)}
              formatDate={(dateString: string) => new Date(dateString).toLocaleDateString('vi-VN')}
            />
          )}
        </Suspense>
      </div>

      {/* Mini Player */}
      {currentEpisode && (
        <Suspense fallback={<LoadingFallback />}>
          <MiniPlayer
            currentEpisode={currentEpisode}
            currentScholar={currentScholarData}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            autoPlayNext={autoPlayNext}
            onTogglePlayPause={togglePlayPause}
            onForward={forward}
            onRewind={rewind}
            onSeekToPercentage={seekToPercentage}
            onToggleAutoPlayNext={toggleAutoPlayNext}
            onPlayNext={handlePlayNext}
            formatTime={(seconds: number) => {
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = Math.floor(seconds % 60);
              return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Podcast;