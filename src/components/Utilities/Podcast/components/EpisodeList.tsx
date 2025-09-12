import React, { useMemo } from 'react';
import type { Scholar, PodcastEpisode } from '../types';
import EpisodeCard from './EpisodeCard';
import PaginationControls from './PaginationControls';
import { LoadingState, ErrorState, EmptyState } from './LoadingState';

interface EpisodeListProps {
  scholar: Scholar;
  isDarkMode: boolean;
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  paginatedEpisodes: PodcastEpisode[];
  currentPage: number;
  totalPages: number;
  onEpisodePlay: (episode: PodcastEpisode) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  formatDate: (dateString: string) => string;
}

const EpisodeList: React.FC<EpisodeListProps> = React.memo(({
  scholar,
  isDarkMode,
  currentEpisode,
  isPlaying,
  paginatedEpisodes,
  currentPage,
  totalPages,
  onEpisodePlay,
  onPageChange,
  onRetry,
  formatDate
}) => {
  const episodeCount = useMemo(() => scholar.episodes.length, [scholar.episodes.length]);

  return (
    <div className="p-4 space-y-4">
      {/* Scholar Info */}
      <div className={`rounded-xl p-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="flex items-center space-x-4 mb-4">
          {/* Changed from rounded-full to rounded-lg and increased size */}
          <div className={`w-24 h-24 rounded-lg ${scholar.color} flex items-center justify-center overflow-hidden`}>
            <img
              src={scholar.avatar}
              alt={scholar.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{scholar.name}</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {scholar.title}
            </p>
          </div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {scholar.bio}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Scholar avatar and info */}
          </div>
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {episodeCount} lectures
          </span>
        </div>
      </div>

      {/* Episodes */}
      <div className="space-y-3">
        {/* Loading State */}
        {scholar.isLoading && (
          <LoadingState isDarkMode={isDarkMode} />
        )}

        {/* Error State */}
        {scholar.error && (
          <ErrorState 
            isDarkMode={isDarkMode}
            error={scholar.error}
            onRetry={onRetry}
          />
        )}

        {/* Episodes List */}
        {!scholar.isLoading && !scholar.error && (
          <>
            {/* Display when no episodes */}
            {episodeCount === 0 ? (
              <EmptyState 
                isDarkMode={isDarkMode}
                message="No lectures available yet"
              />
            ) : (
              <>
                {/* Display paginated episodes list */}
                {paginatedEpisodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    scholar={scholar}
                    isDarkMode={isDarkMode}
                    isCurrentEpisode={currentEpisode?.id === episode.id}
                    isPlaying={isPlaying}
                    onPlay={() => onEpisodePlay(episode)}
                    formatDate={formatDate}
                  />
                ))}

                {/* Pagination controls */}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  isDarkMode={isDarkMode}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
});

EpisodeList.displayName = 'EpisodeList';

export default EpisodeList;
