import React, { useMemo } from 'react';
import type { Scholar, PodcastEpisode } from '../types';
import EpisodeCard from './EpisodeCard';
import PaginationControls from './PaginationControls';
import { LoadingState, ErrorState, EmptyState } from './LoadingState';

interface EpisodeListProps {
  scholar: Scholar;
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
      <div className="rounded-xl p-6 bg-card border-border shadow-luxury dark:shadow-luxury-dark transition-smooth">
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
            <h3 className="text-xl font-bold mb-4 px-4 text-[var(--foreground)]">{scholar.name}</h3>
            <p className="text-sm text-muted-foreground">
              {scholar.title}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {scholar.bio}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Scholar avatar and info */}
          </div>
          <span className="text-sm text-muted-foreground">
            {episodeCount} Bài giảng
          </span>
        </div>
      </div>

      {/* Episodes */}
      <div className="space-y-3">
        {/* Loading State */}
        {scholar.isLoading && (
          <LoadingState />
        )}

        {/* Error State */}
        {scholar.error && (
          <ErrorState 
            error={scholar.error}
            onRetry={onRetry}
          />
        )}

        {/* Episodes List */}
        {!scholar.isLoading && !scholar.error && (
          <>
            {/* Display when no episodes */}
            {paginatedEpisodes.length === 0 ? (
              <EmptyState 
                message="Không tìm thấy bài giảng nào phù hợp"
              />
            ) : (
              <>
                {/* Display paginated episodes list */}
                {paginatedEpisodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    scholar={scholar}
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