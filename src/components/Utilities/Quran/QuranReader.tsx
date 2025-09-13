// components/QuranReader.tsx - Refactored main component
import React, { useEffect, useMemo } from 'react';
import TajweedLegend from './TajweedLegend';
import SurahSelectionScreen from './SurahSelectionScreen';
import QuranReaderHeader from './QuranReaderHeader';
import SettingsPanel from './SettingsPanel';
import VerseCard from './VerseCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useQuranData, useAudioPlayer, useQuranSettings } from './hooks';
import { NGON_NGU, VAN_BAN_GIAO_DIEN, GIA_TRI_MAC_DINH } from './constants';

const QuranReader: React.FC = () => {
  // Custom hooks for state management
  const {
    surahList,
    selectedSurah,
    verses,
    selectedLanguage,
    loading,
    error,
    handleSurahChange,
    handleLanguageChange,
    loadSurahContent,
    getVerseTranslation,
    getTajweedRules,
    resetData
  } = useQuranData();

  const {
    audioStates,
    globalVolume,
    currentPlayingVerse,
    toggleAudio,
    updateGlobalVolume,
    autoStartPlayback,
    resetAudioStates
  } = useAudioPlayer(selectedSurah, verses.length);

  const {
    showTranslation,
    showTajweed,
    showTajweedLegend,
    settingsOpen,
    showSurahSelection,
    toggleTranslation,
    toggleTajweed,
    toggleTajweedLegend,
    setSettingsOpen,
    hideSurahSelectionScreen,
    showSurahSelectionScreen
  } = useQuranSettings();
  
  // Memoized constants
  const uiText = useMemo(() => VAN_BAN_GIAO_DIEN, []);
  const languages = useMemo(() => NGON_NGU, []);


  // Load surah content when selected
// Load surah content khi đổi surah / ngôn ngữ
useEffect(() => {
    if (!selectedSurah) return;
  
    const loadContent = async () => {
      try {
        resetAudioStates();
        await loadSurahContent(selectedSurah, selectedLanguage);
      } catch (error) {
        console.error("Failed to load surah content:", error);
      }
    };
  
    loadContent();
  }, [selectedSurah, selectedLanguage, loadSurahContent]);
  
  // Auto-play khi verses đã sẵn sàng
// Auto-play khi verses đã sẵn sàng
useEffect(() => {
    if (verses.length > 0) {
      const timer = setTimeout(() => {
        autoStartPlayback();
      }, GIA_TRI_MAC_DINH.THOI_GIAN_CHO_AUTO_PLAY);
  
      return () => clearTimeout(timer);
    }
  }, [verses.length, autoStartPlayback]);
  
  
  
  
  // Event handlers
  const handleBackToSurahSelection = React.useCallback(() => {
    resetData();
    showSurahSelectionScreen();
  }, [resetData, showSurahSelectionScreen]);

  const handleSurahSelect = React.useCallback((surahNumber: number) => {
    handleSurahChange(surahNumber);
    hideSurahSelectionScreen();
  }, [handleSurahChange, hideSurahSelectionScreen]);

  const handleRefresh = React.useCallback(() => {
    window.location.reload();
  }, []);

  // Get current surah info
  const currentSurahInfo = React.useMemo(() => 
    surahList.find(s => selectedSurah && parseInt(s.index) === selectedSurah),
    [surahList, selectedSurah]
  );
  // Render surah selection screen
  if (showSurahSelection) {
    return (
      <SurahSelectionScreen 
        surahList={surahList}
        onSurahSelect={handleSurahSelect}
        uiText={uiText}
      />
    );
  }

  // Render main reading interface
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <QuranReaderHeader 
        currentSurahInfo={currentSurahInfo}
        selectedSurah={selectedSurah}
        versesCount={verses.length}
        onBackClick={handleBackToSurahSelection}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsOpen}
        onOpenChange={setSettingsOpen}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        showTranslation={showTranslation}
        onToggleTranslation={toggleTranslation}
        showTajweed={showTajweed}
        onToggleTajweed={toggleTajweed}
        showTajweedLegend={showTajweedLegend}
        onToggleTajweedLegend={toggleTajweedLegend}
        globalVolume={globalVolume}
        onVolumeChange={updateGlobalVolume}
        languages={languages}
        uiText={uiText}
      />

      {/* Tajweed Legend */}
      {showTajweedLegend && (
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <TajweedLegend />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading && (
          <LoadingState message={uiText.loading} />
        )}

        {error && (
          <ErrorState 
            error={error}
            onRefresh={handleRefresh}
            refreshText={uiText.refresh}
          />
        )}

        {!loading && !error && verses.length > 0 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {verses.map((verse, index) => {
              const isCurrentlyPlaying = currentPlayingVerse === index;
              const verseState = audioStates[index];
              const translation = getVerseTranslation(index);
              const tajweedRules = getTajweedRules(index);

              return (
                <VerseCard
                  key={index}
                  verse={verse}
                  index={index}
                  isCurrentlyPlaying={isCurrentlyPlaying}
                  verseState={verseState}
                  translation={translation}
                  tajweedRules={tajweedRules}
                  showTranslation={showTranslation}
                  showTajweed={showTajweed}
                  onToggleAudio={toggleAudio}
                  uiText={uiText}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranReader;