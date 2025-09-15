import React, { useMemo, useCallback, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, SkipForward as NextTrack, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PodcastEpisode, Scholar } from '../types';

interface MiniPlayerProps {
  currentEpisode: PodcastEpisode;
  currentScholar: Scholar | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  autoPlayNext: boolean;
  onTogglePlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  onSeekToPercentage: (percentage: number) => void;
  onToggleAutoPlayNext: () => void;
  onPlayNext?: () => void;
  formatTime: (seconds: number) => string;
}

// Vietnamese UI text constants
const UI_TEXT = {
  NOW_PLAYING: 'Đang phát',
  PLAY: 'Phát',
  PAUSE: 'Tạm dừng',
  REWIND: 'Tua lại 10 giây',
  FORWARD: 'Tua tiến 10 giây',
  NEXT_EPISODE: 'Bài tiếp theo',
  AUTO_PLAY: 'Tự động phát tiếp',
  AUTO_PLAY_OFF: 'Tắt tự động phát',
  SEEK_TO: 'Tua đến',
} as const;

const MiniPlayer: React.FC<MiniPlayerProps> = React.memo(({
  currentEpisode,
  currentScholar,
  isPlaying,
  currentTime,
  duration,
  autoPlayNext,
  onTogglePlayPause,
  onRewind,
  onForward,
  onSeekToPercentage,
  onToggleAutoPlayNext,
  onPlayNext,
  formatTime
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  // Memoized progress percentage for better performance
  const progressPercentage = useMemo(() => 
    duration > 0 ? (currentTime / duration) * 100 : 0, 
    [currentTime, duration]
  );

  // Memoized handlers
  const handleRewind = useCallback(() => {
    onRewind();
  }, [onRewind]);

  const handleTogglePlayPause = useCallback(() => {
    onTogglePlayPause();
  }, [onTogglePlayPause]);

  const handleForward = useCallback(() => {
    onForward();
  }, [onForward]);

  const handleNextEpisode = useCallback(() => {
    if (onPlayNext) {
      onPlayNext();
    }
  }, [onPlayNext]);

  const handleToggleAutoPlay = useCallback(() => {
    onToggleAutoPlayNext();
  }, [onToggleAutoPlayNext]);

  // Handle progress bar click for seeking
  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration <= 0) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    
    onSeekToPercentage(clampedPercentage);
  }, [duration, onSeekToPercentage]);

  // Memoized container classes
  const containerClasses = useMemo(() => 
    'fixed bottom-0 left-0 right-0 border-t backdrop-blur-sm bg-background/95 border-border transition-smooth', 
    []
  );

  return (
    <div className={containerClasses}>
      <Card className="border-0 rounded-none shadow-none bg-transparent">
        <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          {/* Rewind button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRewind}
            className="p-2 rounded-full"
            aria-label={UI_TEXT.REWIND}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* Main play/pause button */}
          <Button
            onClick={handleTogglePlayPause}
            className={`w-10 h-10 rounded-full ${currentScholar?.color.replace('bg-gradient-to-r', 'bg-gradient-to-br') || 'bg-blue-500'} hover:opacity-90`}
            aria-label={isPlaying ? UI_TEXT.PAUSE : UI_TEXT.PLAY}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </Button>

          {/* Forward button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleForward}
            className="p-2 rounded-full"
            aria-label={UI_TEXT.FORWARD}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* Next episode button */}
          {onPlayNext && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextEpisode}
              className="p-2 rounded-full"
              aria-label={UI_TEXT.NEXT_EPISODE}
            >
              <NextTrack className="w-4 h-4" />
            </Button>
          )}

          {/* Episode info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {UI_TEXT.NOW_PLAYING}: {currentEpisode.title}
            </p>
            <p className="text-xs truncate text-muted-foreground">
              {currentScholar?.name}
            </p>
          </div>

          {/* Auto-play toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAutoPlay}
            className={`p-2 rounded-full ${autoPlayNext ? 'text-primary' : 'text-muted-foreground'}`}
            aria-label={autoPlayNext ? UI_TEXT.AUTO_PLAY_OFF : UI_TEXT.AUTO_PLAY}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>

          {/* Clickable Progress bar */}
          <div className="mt-3">
            <div 
              ref={progressRef}
              className="relative w-full h-2 bg-secondary rounded-full cursor-pointer group"
              onClick={handleProgressClick}
              aria-label={UI_TEXT.SEEK_TO}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Hover indicator */}
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
          </div>
          
          {duration > 0 && (
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <span className="text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

MiniPlayer.displayName = 'MiniPlayer';

export default MiniPlayer;
