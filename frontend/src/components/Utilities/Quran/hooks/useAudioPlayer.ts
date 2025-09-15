// hooks/useAudioPlayer.ts - Custom hook for managing audio playback
import {useRef, useState, useCallback, useEffect } from 'react';
import { quranApi } from '../quranApi';
import { type CacTrangThaiAudio } from '../types';
import { GIA_TRI_MAC_DINH } from '../constants';

export const useAudioPlayer = (selectedSurah: number | null, versesLength: number) => {
  const [audioStates, setAudioStates] = useState<CacTrangThaiAudio>({});
  const [globalVolume, setGlobalVolume] = useState<number>(GIA_TRI_MAC_DINH.AM_LUONG_MAC_DINH);
  const [isPlayingSequentially, setIsPlayingSequentially] = useState<boolean>(false);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const [lastPlayedVerse, setLastPlayedVerse] = useState<number>(0);

  // Get cached audio element
  const getCachedAudio = useCallback((verseIndex: number): HTMLAudioElement | null => {
    if (!selectedSurah) return null;
    
    const audio = quranApi.getCachedAudio(selectedSurah, verseIndex);
    audio.volume = globalVolume;
    
    return audio;
  }, [selectedSurah, globalVolume]);

  // Play/pause audio for a specific verse
  const toggleAudio = useCallback(async (verseIndex: number) => {
    if (!selectedSurah) return;
    
    const audio = getCachedAudio(verseIndex);
    if (!audio) return;
    
    const currentState = audioStates[verseIndex] || {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      loading: false,
      error: null
    };
    
    try {
      if (currentState.isPlaying) {
        // User explicitly paused
        audio.pause();
        setIsPausedByUser(true);
        setIsPlayingSequentially(false);
        setCurrentPlayingVerse(null);
        setAudioStates(prev => ({
          ...prev,
          [verseIndex]: { ...currentState, isPlaying: false, loading: false }
        }));
      } else {
        // User wants to play
        setIsPausedByUser(false);
        setIsPlayingSequentially(true);
        setLastPlayedVerse(verseIndex);
        
        // Pause all other audios first
        Object.keys(audioStates).forEach(key => {
          const idx = parseInt(key);
          if (idx !== verseIndex && audioStates[idx]?.isPlaying) {
            const otherAudio = getCachedAudio(idx);
            if (otherAudio) {
              otherAudio.pause();
              setAudioStates(prev => ({
                ...prev,
                [idx]: { ...prev[idx], isPlaying: false, loading: false }
              }));
            }
          }
        });
        
        // Set loading state
        setAudioStates(prev => ({
          ...prev,
          [verseIndex]: { ...currentState, loading: true, error: null, isPlaying: false }
        }));
        
        // Wait for audio to be ready if needed
        if (audio.readyState < 4) {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              audio.removeEventListener('canplaythrough', handleLoad);
              audio.removeEventListener('error', handleError);
              reject(new Error('Audio load timeout'));
            }, GIA_TRI_MAC_DINH.TIMEOUT_TAI_AUDIO);
            
            const handleLoad = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', handleLoad);
              audio.removeEventListener('error', handleError);
              resolve(void 0);
            };
            
            const handleError = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplaythrough', handleLoad);
              audio.removeEventListener('error', handleError);
              reject(new Error('Failed to load audio'));
            };
            
            audio.addEventListener('canplaythrough', handleLoad);
            audio.addEventListener('error', handleError);
            
            if (audio.src) {
              audio.load();
            }
          });
        }
        
        // Play the audio
        await audio.play();
        
        // Update state to playing
        setAudioStates(prev => ({
          ...prev,
          [verseIndex]: { 
            ...currentState, 
            isPlaying: true, 
            loading: false, 
            error: null,
            duration: audio.duration || 0
          }
        }));
        
        setCurrentPlayingVerse(verseIndex);
        setLastPlayedVerse(verseIndex);
        
        // Auto scroll to verse
        const verseElement = document.getElementById(`verse-${verseIndex}`);
        if (verseElement) {
          verseElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        
        // Set up event listeners for sequential playback
        const handleEnded = () => {
          audio.removeEventListener('ended', handleEnded);
          
          setAudioStates(prev => ({
            ...prev,
            [verseIndex]: { ...prev[verseIndex], isPlaying: false, loading: false }
          }));
          
          // Handle sequential playback
          if (isPlayingSequentially && !isPausedByUser) {
            if (verseIndex < versesLength - 1) {
              const nextVerse = verseIndex + 1;
              setLastPlayedVerse(nextVerse);
              setTimeout(() => {
                toggleAudio(nextVerse);
              }, GIA_TRI_MAC_DINH.THOI_GIAN_CHO_CHUYEN_CAU);
            } else {
              // Auto-advance to next surah
              if (selectedSurah && selectedSurah < GIA_TRI_MAC_DINH.SO_SURAH_TOI_DA) {
                setTimeout(() => {
                  // This will be handled by parent component
                  setIsPlayingSequentially(false);
                  setCurrentPlayingVerse(null);
                }, GIA_TRI_MAC_DINH.THOI_GIAN_CHO_CHUYEN_SURAH);
              } else {
                setIsPlayingSequentially(false);
                setCurrentPlayingVerse(null);
              }
            }
          } else {
            setCurrentPlayingVerse(null);
          }
        };
        
        audio.addEventListener('ended', handleEnded);
      }
    } catch (error) {
      console.error('Audio error:', error);
      setAudioStates(prev => ({
        ...prev,
        [verseIndex]: { 
          ...currentState, 
          error: 'Không thể phát audio', 
          isPlaying: false, 
          loading: false 
        }
      }));
      setCurrentPlayingVerse(null);
    }
  }, [selectedSurah, getCachedAudio, audioStates, isPlayingSequentially, isPausedByUser, versesLength]);

  // Update volume for all cached audio elements
  const updateGlobalVolume = useCallback((newVolume: number) => {
    setGlobalVolume(newVolume);
    if (selectedSurah && versesLength > 0) {
      for (let i = 0; i < versesLength; i++) {
        const audio = getCachedAudio(i);
        if (audio) {
          audio.volume = newVolume;
        }
      }
    }
  }, [selectedSurah, versesLength, getCachedAudio]);

  // Auto-start playback after surah loads
// Track lastPlayedVerse bằng ref
const lastPlayedVerseRef = useRef(lastPlayedVerse);
useEffect(() => {
  lastPlayedVerseRef.current = lastPlayedVerse;
}, [lastPlayedVerse]);

// Track toggleAudio bằng ref
const toggleAudioRef = useRef(toggleAudio);
useEffect(() => {
  toggleAudioRef.current = toggleAudio;
}, [toggleAudio]);

// Giờ autoStartPlayback không còn phụ thuộc vào lastPlayedVerse và toggleAudio nữa
const autoStartPlayback = useCallback(async () => {
  if (versesLength > 0) {
    console.log('Auto-starting surah playback...');
    setIsPlayingSequentially(true);
    setIsPausedByUser(false);

    try {
      const startVerse = lastPlayedVerseRef.current || 0;
      await toggleAudioRef.current(startVerse);
    } catch (error) {
      console.error('Failed to start auto-play:', error);
    }
  }
}, [versesLength]);


  // Reset audio states
  const resetAudioStates = useCallback(() => {
    setAudioStates({});
    setCurrentPlayingVerse(null);
    setIsPlayingSequentially(false);
    setIsPausedByUser(false);
    setLastPlayedVerse(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      quranApi.clearAudioCache();
    };
  }, []);

  return {
    // State
    audioStates,
    globalVolume,
    isPlayingSequentially,
    currentPlayingVerse,
    isPausedByUser,
    lastPlayedVerse,
    
    // Actions
    toggleAudio,
    updateGlobalVolume,
    autoStartPlayback,
    resetAudioStates,
    
    // Setters for parent component
    setIsPlayingSequentially,
    setCurrentPlayingVerse,
    setLastPlayedVerse
  };
};
