import React, { useMemo, useCallback } from 'react';
import { Play, Pause, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PodcastEpisode, Scholar } from '../types';

interface EpisodeCardProps {
  episode: PodcastEpisode;
  scholar: Scholar;
  isCurrentEpisode: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  formatDate: (dateString: string) => string;
}

// Vietnamese UI text constants
const UI_TEXT = {
  PLAYING: 'Đang phát',
  PAUSED: 'Tạm dừng',
  PLAY_EPISODE: 'Phát bài giảng',
} as const;

const EpisodeCard: React.FC<EpisodeCardProps> = React.memo(({
  episode,
  scholar,
  isCurrentEpisode,
  isPlaying,
  onPlay,
  formatDate
}) => {
  // Memoized card classes for better performance
  const cardClasses = useMemo(() => 
    `transition-smooth hover:shadow-xl cursor-pointer bg-card border-border hover:bg-accent ${
      isCurrentEpisode ? 'ring-2 ring-primary' : ''
    }`, [isCurrentEpisode]
  );

  // Memoized play button handler
  const handlePlay = useCallback(() => {
    onPlay();
  }, [onPlay]);

  // Memoized status text
  const statusText = useMemo(() => 
    isPlaying ? UI_TEXT.PLAYING : UI_TEXT.PAUSED, 
    [isPlaying]
  );

  return (
    <Card className={cardClasses} onClick={handlePlay}>
      <CardContent className="p-4">
        <div className="flex">
          {/* Thumbnail section */}
          <div className="relative mr-4 flex-shrink-0">
            {episode.thumbnail ? (
              <div className="relative">
                <img 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className={`absolute inset-0 flex items-center justify-center w-full h-full rounded-lg ${
                  isCurrentEpisode ? 'bg-black bg-opacity-30' : ''
                }`}>
                  {isCurrentEpisode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto bg-transparent hover:bg-transparent"
                      aria-label={UI_TEXT.PLAY_EPISODE}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isCurrentEpisode && isPlaying
                  ? 'bg-red-500'
                  : scholar.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
              }`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto bg-transparent hover:bg-transparent"
                  aria-label={UI_TEXT.PLAY_EPISODE}
                >
                  {isCurrentEpisode && isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2">
              {episode.title}
            </h3>
            <p className="text-xs mb-3 line-clamp-2 text-muted-foreground">
              {episode.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="flex items-center space-x-1 text-muted-foreground">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{formatDate(episode.publishDate)}</span>
              </span>
              <span className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{episode.duration}</span>
              </span>
              {isCurrentEpisode && (
                <span className="flex items-center space-x-1 text-primary font-medium">
                  <span>•</span>
                  <span>{statusText}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EpisodeCard.displayName = 'EpisodeCard';

export default EpisodeCard;
