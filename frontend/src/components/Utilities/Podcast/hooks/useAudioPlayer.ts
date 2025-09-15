import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PodcastEpisode, Scholar } from '../types';

// Memoized constants outside component
const SKIP_SECONDS = 10;
const AUDIO_PRELOAD = 'auto';

// Vietnamese error messages
const AUDIO_ERRORS = {
  PLAYBACK_FAILED: 'Không thể phát âm thanh. Vui lòng thử lại.',
  LOAD_FAILED: 'Không thể tải file âm thanh.',
  NETWORK_ERROR: 'Lỗi kết nối. Vui lòng kiểm tra internet.',
} as const;

export const useAudioPlayer = () => {
  // Lazy initial states for better performance
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(() => 0);
  const [duration, setDuration] = useState(() => 0);
  const [isPlaying, setIsPlaying] = useState(() => false);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(() => null);
  const [autoPlayNext, setAutoPlayNext] = useState(() => true);
  const [currentScholarId, setCurrentScholarId] = useState<string | null>(() => null);
  const [allScholars, setAllScholars] = useState<Scholar[]>(() => []);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    let isMounted = true;

    const handleLoadedMetadata = () => {
      if (isMounted) setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (isMounted) setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isMounted) {
        setIsPlaying(false);
        // Auto-play next episode if enabled
        if (autoPlayNext && currentScholarId && allScholars.length > 0) {
          setTimeout(() => {
            playNextEpisodeAuto();
          }, 1000); // 1 second delay before auto-play
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    setAudioRef(audio);

    return () => {
      isMounted = false;
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playEpisode = useCallback(async (episode: PodcastEpisode, scholarId?: string) => {
    if (!audioRef) return;

    try {
      // Stop current audio before switching to new episode
      audioRef.pause();
      audioRef.currentTime = 0;
      
      setCurrentEpisode(episode);
      if (scholarId) {
        setCurrentScholarId(scholarId);
      }
      
      if (episode.audioUrl && episode.audioUrl !== '#') {
        audioRef.src = episode.audioUrl;
        audioRef.preload = AUDIO_PRELOAD;
        
        const playPromise = audioRef.play();
        
        if (playPromise !== undefined) {
          await playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error(AUDIO_ERRORS.PLAYBACK_FAILED, error);
              setIsPlaying(false);
            });
        }
      } else {
        // Fallback for demo
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(AUDIO_ERRORS.LOAD_FAILED, error);
      setIsPlaying(false);
    }
  }, [audioRef]);

  // Auto-play next episode function
  const playNextEpisodeAuto = useCallback(async () => {
    if (!currentScholarId || !currentEpisode || !audioRef || allScholars.length === 0) return;

    const scholar = allScholars.find(s => s.id === currentScholarId);
    if (!scholar || scholar.episodes.length === 0) return;

    const currentIndex = currentEpisode.index ?? scholar.episodes.findIndex(ep => ep.id === currentEpisode.id);
    const nextIndex = currentIndex + 1;

    // Stop if reached end of list
    if (nextIndex >= scholar.episodes.length) {
      setIsPlaying(false);
      return;
    }

    const nextEpisode = scholar.episodes[nextIndex];
    
    try {
      // Update state before playing
      setCurrentEpisode({ ...nextEpisode, index: nextIndex });
      
      // Reset audio element
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.src = nextEpisode.audioUrl;
      
      // Add preload to ensure audio is ready
      audioRef.preload = 'auto';
      audioRef.load();

      const playPromise = audioRef.play();

      if (playPromise !== undefined) {
        await playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Auto-play failed:', error);
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error('Error auto-playing next episode:', error);
      setIsPlaying(false);
    }
  }, [audioRef, currentEpisode, currentScholarId, allScholars]);

  const playNextEpisode = useCallback(async (scholars: Scholar[], currentScholar: string | null) => {
    if (!currentScholar || !currentEpisode || !audioRef) return;

    const scholar = scholars.find(s => s.id === currentScholar);
    if (!scholar || scholar.episodes.length === 0) return;

    const currentIndex = currentEpisode.index ?? scholar.episodes.findIndex(ep => ep.id === currentEpisode.id);
    const nextIndex = currentIndex + 1;

    // Stop if reached end of list
    if (nextIndex >= scholar.episodes.length) {
      setIsPlaying(false);
      return;
    }

    const nextEpisode = scholar.episodes[nextIndex];
    
    try {
      // Update state before playing
      setCurrentEpisode({ ...nextEpisode, index: nextIndex });
      
      // Reset audio element
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.src = nextEpisode.audioUrl;
      
      // Add preload to ensure audio is ready
      audioRef.preload = 'auto';
      audioRef.load();

      const playPromise = audioRef.play();

      if (playPromise !== undefined) {
        await playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Playback failed:', error);
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error('Error playing next episode:', error);
      setIsPlaying(false);
    }
  }, [audioRef, currentEpisode]);

  const togglePlayPause = useCallback(() => {
    if (audioRef && currentEpisode?.audioUrl && currentEpisode.audioUrl !== '#') {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } else {
      // Demo toggle for episodes without real audio
      setIsPlaying(!isPlaying);
    }
  }, [audioRef, currentEpisode, isPlaying]);

  const forward = useCallback(() => {
    if (audioRef) {
      audioRef.currentTime = Math.min(audioRef.currentTime + SKIP_SECONDS, audioRef.duration);
      setCurrentTime(audioRef.currentTime);
    }
  }, [audioRef]);

  const rewind = useCallback(() => {
    if (audioRef) {
      audioRef.currentTime = Math.max(audioRef.currentTime - SKIP_SECONDS, 0);
      setCurrentTime(audioRef.currentTime);
    }
  }, [audioRef]);

  // Seek to specific time
  const seekTo = useCallback((time: number) => {
    if (audioRef && duration > 0) {
      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  }, [audioRef, duration]);

  // Seek by percentage (0-100)
  const seekToPercentage = useCallback((percentage: number) => {
    if (audioRef && duration > 0) {
      const time = (percentage / 100) * duration;
      seekTo(time);
    }
  }, [audioRef, duration, seekTo]);

  // Toggle auto-play next episode
  const toggleAutoPlayNext = useCallback(() => {
    setAutoPlayNext(prev => !prev);
  }, []);

  // Update scholars data for auto-play
  const updateScholarsData = useCallback((scholars: Scholar[]) => {
    setAllScholars(scholars);
  }, []);

  // Memoized time formatting function
  const formatTime = useMemo(() => 
    (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []
  );

  return {
    audioRef,
    currentTime,
    duration,
    isPlaying,
    currentEpisode,
    autoPlayNext,
    setCurrentEpisode,
    playEpisode,
    playNextEpisode,
    togglePlayPause,
    forward,
    rewind,
    seekTo,
    seekToPercentage,
    toggleAutoPlayNext,
    updateScholarsData,
    formatTime
  };
};
