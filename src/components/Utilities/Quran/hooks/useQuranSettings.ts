// hooks/useQuranSettings.ts - Custom hook for managing Quran reader settings
import { useState, useCallback } from 'react';
import { GIA_TRI_MAC_DINH } from '../constants';

export const useQuranSettings = () => {
  const [showTranslation, setShowTranslation] = useState<boolean>(GIA_TRI_MAC_DINH.HIEN_THI_BAN_DICH);
  const [showTajweed, setShowTajweed] = useState<boolean>(GIA_TRI_MAC_DINH.HIEN_THI_TAJWEED);
  const [showTajweedLegend, setShowTajweedLegend] = useState<boolean>(GIA_TRI_MAC_DINH.HIEN_THI_HUONG_DAN_TAJWEED);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [showSurahSelection, setShowSurahSelection] = useState<boolean>(true);

  const toggleTranslation = useCallback(() => {
    setShowTranslation(prev => !prev);
  }, []);

  const toggleTajweed = useCallback(() => {
    setShowTajweed(prev => !prev);
  }, []);

  const toggleTajweedLegend = useCallback(() => {
    setShowTajweedLegend(prev => !prev);
  }, []);

  const openSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  const showSurahSelectionScreen = useCallback(() => {
    setShowSurahSelection(true);
  }, []);

  const hideSurahSelectionScreen = useCallback(() => {
    setShowSurahSelection(false);
  }, []);

  return {
    // State
    showTranslation,
    showTajweed,
    showTajweedLegend,
    settingsOpen,
    showSurahSelection,
    
    // Actions
    toggleTranslation,
    toggleTajweed,
    toggleTajweedLegend,
    openSettings,
    closeSettings,
    setSettingsOpen,
    showSurahSelectionScreen,
    hideSurahSelectionScreen
  };
};
