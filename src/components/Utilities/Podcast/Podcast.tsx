import React, { useState, useCallback, useMemo } from 'react';

// Import types
import type { PodcastEpisode, Scholar } from './types';

// Import constants
import { INITIAL_SCHOLARS, EPISODES_PER_PAGE } from './constants';

// Import hooks
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useRssFeed } from './hooks/useRssFeed';
import { usePagination } from './hooks/usePagination';

// Import components
import MiniPlayer from './components/MiniPlayer';
import Header from './components/Header';
import ScholarList from './components/ScholarList';
import EpisodeList from './components/EpisodeList';

interface IslamicPodcastAppProps {
  handleBackToHome: () => void;
}

const IslamicPodcastApp: React.FC<IslamicPodcastAppProps> = ({ handleBackToHome }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Navigation state
  const [currentScholar, setCurrentScholar] = useState<string | null>(null);
  
  // Scholar data state
  const [scholars, setScholars] = useState<Scholar[]>(INITIAL_SCHOLARS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Audio player hook
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playEpisode,
    togglePlayPause,
    forward,
    rewind
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
  
  // Callbacks
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  const handleScholarSelect = useCallback((scholarId: string) => {
    setCurrentScholar(scholarId);
    setCurrentPage(1);
    
    // Fetch RSS feed if episodes are empty
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar && scholar.episodes.length === 0 && !scholar.isLoading) {
      fetchRSSFeed(scholarId, setScholars);
    }
  }, [scholars, fetchRSSFeed, setCurrentPage]);
  
  const handleEpisodePlay = useCallback((episode: PodcastEpisode) => {
    playEpisode(episode);
  }, [playEpisode]);
  
  const handlePaginationChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);
  
  const handleRetryFetch = useCallback((scholarId: string) => {
    retryFetch(scholarId, scholars, setScholars);
  }, [retryFetch, scholars]);
  
  const handleGoBack = useCallback(() => {
    setCurrentScholar(null);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        isDarkMode={isDarkMode}
        title={currentScholarData ? currentScholarData.name : 'Islamic Scholars Podcast'}
        onToggleTheme={handleThemeToggle}
        onBack={currentScholar ? handleGoBack : handleBackToHome}
      />
      
      <div className="pb-24">
        {!currentScholar ? (
          <ScholarList
            isDarkMode={isDarkMode}
            scholars={scholars}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onScholarSelect={handleScholarSelect}
          />
        ) : (
          <EpisodeList
            isDarkMode={isDarkMode}
            scholar={currentScholarData!}
            currentEpisode={currentEpisode}
            isPlaying={isPlaying}
            paginatedEpisodes={getPaginatedEpisodes(currentScholarData?.episodes || [])}
            currentPage={currentPage}
            totalPages={Math.ceil((currentScholarData?.episodes.length || 0) / EPISODES_PER_PAGE)}
            onEpisodePlay={handleEpisodePlay}
            onPageChange={handlePaginationChange}
            onRetry={() => handleRetryFetch(currentScholar!)}
            formatDate={(dateString: string) => new Date(dateString).toLocaleDateString()}
          />
        )}
      </div>

      {/* Mini Player */}
      {currentEpisode && (
        <MiniPlayer
          isDarkMode={isDarkMode}
          currentEpisode={currentEpisode}
          currentScholar={currentScholarData}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlayPause={togglePlayPause}
          onForward={forward}
          onRewind={rewind}
          formatTime={(seconds: number) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
          }}
        />
      )}
    </div>
  );
};

export default IslamicPodcastApp;