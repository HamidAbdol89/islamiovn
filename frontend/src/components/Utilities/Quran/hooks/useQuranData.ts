// hooks/useQuranData.ts - Updated custom hook for managing Quran data loading
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
  const [translationError, setTranslationError] = useState<string | null>(null);

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
  const loadSurahContent = useCallback(async (surahNumber: number, language: string) => {
    setLoading(true);
    setError(null);
    setTranslationError(null);
    
    try {
      // Load surah content and tajweed data
      const content = await quranApi.getSurahWithTajweed(surahNumber);
      setVerses(content.surah.verses);
      setTajweedData(content.tajweed || []);
      
      // Load translation separately with error handling
      try {
        const translationData = await quranApi.getTranslation(language, surahNumber);
        setTranslations(translationData);
      } catch (translationErr) {
        console.error('Translation loading failed:', translationErr);
        setTranslationError(
          language === 'vi' || language === 'vietnamese' 
            ? 'Không thể tải bản dịch tiếng Việt. Vui lòng thử lại sau.'
            : `Không thể tải bản dịch ${language}. Vui lòng thử lại sau.`
        );
        setTranslations([]);
      }
      
      // Preload audio for better performance
      quranApi.preloadSurahAudio(surahNumber, content.surah.verses);
      
      return content.surah.verses;
    } catch (err) {
      setError('Lỗi khi tải nội dung Quran');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload translation only (useful when translation fails but surah content is loaded)
  const reloadTranslation = useCallback(async (surahNumber: number, language: string) => {
    if (!surahNumber) return;
    
    setTranslationError(null);
    try {
      const translationData = await quranApi.getTranslation(language, surahNumber);
      setTranslations(translationData);
    } catch (err) {
      setTranslationError(
        language === 'vi' || language === 'vietnamese' 
          ? 'Không thể tải bản dịch tiếng Việt. Vui lòng kiểm tra kết nối mạng.'
          : `Không thể tải bản dịch ${language}. Vui lòng kiểm tra kết nối mạng.`
      );
    }
  }, []);

  // Handle surah selection
  const handleSurahChange = useCallback((surahNumber: number) => {
    setSelectedSurah(surahNumber);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((languageCode: string) => {
    setSelectedLanguage(languageCode);
  }, []);

  // Get verse translation - FIXED: Now using direct index matching
  const getVerseTranslation = useCallback((verseIndex: number): string => {
    const translation = translations.find(t => t.index === verseIndex);
    return translation?.text || '';
  }, [translations]);

  // Get verse footnotes (useful for Vietnamese translation)
  const getVerseFootnotes = useCallback((verseIndex: number): string => {
    const translation = translations.find(t => t.index === verseIndex);
    return translation?.footnotes || '';
  }, [translations]);

  // Get tajweed rules for verse - FIXED: Now using direct index matching  
  const getTajweedRules = useCallback((verseIndex: number) => {
    return tajweedData.find(t => t.index === verseIndex)?.rules || [];
  }, [tajweedData]);

  // Reset data
  const resetData = useCallback(() => {
    setSelectedSurah(null);
    setVerses([]);
    setTranslations([]);
    setTajweedData([]);
    setError(null);
    setTranslationError(null);
    quranApi.clearAudioCache();
  }, []);

  // Check if current language is Vietnamese
  const isVietnamese = useCallback(() => {
    return selectedLanguage === 'vi' || selectedLanguage === 'vietnamese';
  }, [selectedLanguage]);

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
    translationError,
    
    // Actions
    handleSurahChange,
    handleLanguageChange,
    loadSurahContent,
    reloadTranslation,
    getVerseTranslation,
    getVerseFootnotes,
    getTajweedRules,
    resetData,
    isVietnamese
  };
};