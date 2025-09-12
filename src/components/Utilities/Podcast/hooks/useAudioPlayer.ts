import { useState, useEffect, useCallback } from 'react';
import type { PodcastEpisode, Scholar } from '../types';

export const useAudioPlayer = () => {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);

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

  const playEpisode = useCallback(async (episode: PodcastEpisode) => {
    if (!audioRef) return;

    try {
      // Stop current audio before switching to new episode
      audioRef.pause();
      audioRef.currentTime = 0;
      
      setCurrentEpisode(episode);
      
      if (episode.audioUrl && episode.audioUrl !== '#') {
        audioRef.src = episode.audioUrl;
        audioRef.preload = 'auto';
        
        const playPromise = audioRef.play();
        
        if (playPromise !== undefined) {
          await playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Playback failed:', error);
              setIsPlaying(false);
            });
        }
      } else {
        // Fallback for demo
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing episode:', error);
      setIsPlaying(false);
    }
  }, [audioRef]);

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
      audioRef.currentTime = Math.min(audioRef.currentTime + 10, audioRef.duration);
      setCurrentTime(audioRef.currentTime);
    }
  }, [audioRef]);

  const rewind = useCallback(() => {
    if (audioRef) {
      audioRef.currentTime = Math.max(audioRef.currentTime - 10, 0);
      setCurrentTime(audioRef.currentTime);
    }
  }, [audioRef]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    audioRef,
    currentTime,
    duration,
    isPlaying,
    currentEpisode,
    setCurrentEpisode,
    playEpisode,
    playNextEpisode,
    togglePlayPause,
    forward,
    rewind,
    formatTime
  };
};
