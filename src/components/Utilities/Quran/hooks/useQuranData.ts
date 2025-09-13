// hooks/useQuranData.ts - Custom hook for managing Quran data loading
import { useState, useEffect, useCallback } from 'react';
import { quranApi, type SurahInfo, type Verse, type Translation, type TajweedVerse } from '../quranApi';
import { GIA_TRI_MAC_DINH } from '../constants';

export const useQuranData = () => {
  const [surahList, setSurahList] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [tajweedData, setTajweedData] = useState<TajweedVerse[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(GIA_TRI_MAC_DINH.NGON_NGU_MAC_DINH);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load surah list on mount
  useEffect(() => {
    const loadSurahList = async () => {
      try {
        const surahs = await quranApi.getAllSurah();
        setSurahList(surahs);
      } catch (err) {
        setError('Không thể tải danh sách Surah');
      }
    };
    
    loadSurahList();
  }, []);

  // Load surah content when selected
// In useQuranData.ts
const loadSurahContent = useCallback(async (surahNumber: number, language: string) => {
  setLoading(true);
  setError(null);
  
  try {
    const [content, translationData] = await Promise.all([
      quranApi.getSurahWithTajweed(surahNumber),
      quranApi.getTranslation(language, surahNumber)
    ]);
    
    setVerses(content.surah.verses);
    setTajweedData(content.tajweed || []);
    setTranslations(translationData);
    
    // Preload audio for better performance
    quranApi.preloadSurahAudio(surahNumber, content.surah.verses);
    
    return content.surah.verses;
  } catch (err) {
    setError('Lỗi khi tải nội dung Quran');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);  // No dependencies since we're using state setters

  // Handle surah selection
  const handleSurahChange = useCallback((surahNumber: number) => {
    setSelectedSurah(surahNumber);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((languageCode: string) => {
    setSelectedLanguage(languageCode);
  }, []);

  // Get verse translation
  const getVerseTranslation = useCallback((verseIndex: number): string => {
    const translation = translations.find(t => t.index === verseIndex + 1);
    return translation?.text || '';
  }, [translations]);

  // Get tajweed rules for verse
  const getTajweedRules = useCallback((verseIndex: number) => {
    return tajweedData.find(t => t.index === verseIndex + 1)?.rules || [];
  }, [tajweedData]);

  // Reset data
  const resetData = useCallback(() => {
    setSelectedSurah(null);
    setVerses([]);
    setTranslations([]);
    setTajweedData([]);
    setError(null);
    quranApi.clearAudioCache();
  }, []);

  return {
    // State
    surahList,
    selectedSurah,
    verses,
    translations,
    tajweedData,
    selectedLanguage,
    loading,
    error,
    
    // Actions
    handleSurahChange,
    handleLanguageChange,
    loadSurahContent,
    getVerseTranslation,
    getTajweedRules,
    resetData
  };
};
