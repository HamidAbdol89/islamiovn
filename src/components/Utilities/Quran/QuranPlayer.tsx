// D:\Projects\muslimviet\src\components\Utilities\Quran\QuranPlayer.tsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { quranApi } from '@/components/Utilities/Quran/quranApi';

interface QuranPlayerProps {
  surahNumber: number;
  verseNumber: number;
  surahTitle: string;
  onVerseChange?: (newVerse: number) => void;
  maxVerses: number;
}

export const QuranPlayer: React.FC<QuranPlayerProps> = ({
  surahNumber,
  verseNumber,
  surahTitle,
  onVerseChange,
  maxVerses
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Vietnamese UI text constants
  const UI_TEXT = useMemo(() => ({
    verse: 'Câu',
    of: 'của',
    failedToLoad: 'Không thể tải âm thanh',
    failedToPlay: 'Không thể phát âm thanh'
  }), []);

  // Load audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = quranApi.getAudioUrl(surahNumber, verseNumber);
    setLoading(true);
    setError(null);

    audio.src = audioUrl;
    audio.load();

    const handleLoadedData = () => {
      setLoading(false);
      setDuration(audio.duration);
    };

    const handleError = () => {
      setLoading(false);
      setError(UI_TEXT.failedToLoad);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next verse
      if (verseNumber < maxVerses && onVerseChange) {
        onVerseChange(verseNumber + 1);
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [surahNumber, verseNumber, maxVerses, onVerseChange, UI_TEXT.failedToLoad]);

  // Memoized handlers
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || loading) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      setError(UI_TEXT.failedToPlay);
      setIsPlaying(false);
    }
  }, [isPlaying, loading, UI_TEXT.failedToPlay]);

  const playPrevious = useCallback(() => {
    if (verseNumber > 1 && onVerseChange) {
      onVerseChange(verseNumber - 1);
    }
  }, [verseNumber, onVerseChange]);

  const playNext = useCallback(() => {
    if (verseNumber < maxVerses && onVerseChange) {
      onVerseChange(verseNumber + 1);
    }
  }, [verseNumber, maxVerses, onVerseChange]);

  const handleSeek = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Memoized time formatter
  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Memoized progress percentage
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  return (
    <Card className="w-full bg-card border-border shadow-luxury dark:shadow-luxury-dark">
      <CardContent className="p-4">
        <audio ref={audioRef} preload="metadata" />
        
        {/* Title */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg text-gradient">{surahTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {UI_TEXT.verse} {verseNumber} {UI_TEXT.of} {maxVerses}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={loading || duration === 0}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 dark:text-red-400 text-sm mb-4 p-2 bg-red-50 dark:bg-red-950/20 rounded">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={playPrevious}
            disabled={verseNumber <= 1 || loading}
            className="transition-smooth hover:bg-luxury-gradient/10"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
            disabled={loading}
            className="h-12 w-12 bg-luxury-gradient hover:bg-luxury-gradient/90 transition-smooth"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={playNext}
            disabled={verseNumber >= maxVerses || loading}
            className="transition-smooth hover:bg-luxury-gradient/10"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Add display name for debugging
QuranPlayer.displayName = 'QuranPlayer';

// Export as default
export default QuranPlayer;