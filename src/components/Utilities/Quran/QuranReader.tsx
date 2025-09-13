// components/QuranReader.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Languages, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import QuranPlayer from './QuranPlayer';
import { quranApi, type SurahInfo, type Verse, type Translation } from './quranApi';

const QuranReader: React.FC = () => {
  const [surahList, setSurahList] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('id');
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Available languages - moved outside component to prevent recreation
  const LANGUAGES = useMemo(() => [
    { code: 'id', name: 'Tiếng Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'Tiếng Anh', flag: '🇺🇸' },
    { code: 'ms', name: 'Tiếng Malay', flag: '🇲🇾' },
  ], []);

  // Vietnamese UI text constants
  const UI_TEXT = useMemo(() => ({
    title: 'Đọc Quran',
    loading: 'Đang tải Quran...',
    selectSurah: 'Chọn Surah',
    translation: 'Bản dịch',
    verses: 'câu',
    translationNotAvailable: 'Bản dịch không có sẵn',
    errorLoadingSurah: 'Lỗi khi tải danh sách surah',
    errorLoadingContent: 'Lỗi khi tải nội dung surah',
    refresh: 'Làm mới'
  }), []);

  // Load surah list on mount
  useEffect(() => {
    const loadSurahList = async () => {
      try {
        const list = await quranApi.getAllSurah();
        setSurahList(list);
      } catch (err) {
        setError(UI_TEXT.errorLoadingSurah);
      }
    };

    loadSurahList();
    // Preload essential data
    quranApi.preloadEssentialData();
  }, []);

  // Load surah content when selection changes
  useEffect(() => {
    const loadSurahContent = async () => {
      if (!selectedSurah) return;

      setLoading(true);
      setError(null);

      try {
        const [surahData, translationData] = await Promise.all([
          quranApi.getSurah(selectedSurah),
          showTranslation 
            ? quranApi.getTranslation(selectedLanguage, selectedSurah).catch(() => [])
            : Promise.resolve([])
        ]);

        setVerses(surahData.verses || []);
        setTranslations(translationData);
        setCurrentVerse(1);
      } catch (err) {
        setError(UI_TEXT.errorLoadingContent);
        console.error('Error loading surah:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahContent();
  }, [selectedSurah, selectedLanguage, showTranslation]);

  // Get current surah info
  const currentSurahInfo = surahList.find(s => parseInt(s.index) === selectedSurah);

  // Memoized navigation handlers
  const goToPreviousSurah = useCallback(() => {
    if (selectedSurah > 1) {
      setSelectedSurah(selectedSurah - 1);
    }
  }, [selectedSurah]);

  const goToNextSurah = useCallback(() => {
    if (selectedSurah < 114) {
      setSelectedSurah(selectedSurah + 1);
    }
  }, [selectedSurah]);

  // Memoized refresh handler
  const handleRefresh = useCallback(async () => {
    quranApi.clearCache();
    setError(null);
    try {
      const list = await quranApi.getAllSurah();
      setSurahList(list);
    } catch (err) {
      setError(UI_TEXT.errorLoadingSurah);
    }
  }, [UI_TEXT.errorLoadingSurah]);

  // Memoized translation getter
  const getVerseTranslation = useCallback((verseIndex: number): string => {
    const translation = translations.find(t => t.index === verseIndex);
    return translation ? translation.text : UI_TEXT.translationNotAvailable;
  }, [translations, UI_TEXT.translationNotAvailable]);

  // Memoized handlers
  const handleSurahChange = useCallback((value: string) => {
    setSelectedSurah(parseInt(value));
  }, []);

  const handleLanguageChange = useCallback((value: string) => {
    setSelectedLanguage(value);
  }, []);

  const toggleTranslation = useCallback(() => {
    setShowTranslation(prev => !prev);
  }, []);

  const handleVerseClick = useCallback((verseIndex: number) => {
    setCurrentVerse(verseIndex);
  }, []);

  if (loading && verses.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-foreground">{UI_TEXT.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-background text-foreground">
      {/* Header Controls */}
      <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-gradient">{UI_TEXT.title}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="transition-smooth hover:bg-luxury-gradient"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousSurah}
                disabled={selectedSurah <= 1}
                className="transition-smooth"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextSurah}
                disabled={selectedSurah >= 114}
                className="transition-smooth"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Surah Selection */}
            <Select
              value={selectedSurah.toString()}
              onValueChange={handleSurahChange}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder={UI_TEXT.selectSurah} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-60">
                  {surahList.map((surah) => (
                    <SelectItem key={surah.index} value={surah.index}>
                      <div className="flex items-center justify-between w-full">
                        <span>{parseInt(surah.index)}. {surah.title}</span>
                        <Badge variant="secondary" className="ml-2 bg-luxury-gradient text-white">
                          {surah.count} {UI_TEXT.verses}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            {/* Language Selection */}
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Translation Toggle */}
            <Button
              variant={showTranslation ? "default" : "outline"}
              onClick={toggleTranslation}
              className={`w-full transition-smooth ${
                showTranslation ? 'bg-luxury-gradient hover:bg-luxury-gradient/90' : 'hover:bg-luxury-gradient/10'
              }`}
            >
              <Languages className="h-4 w-4 mr-2" />
              {UI_TEXT.translation}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Surah Info */}
      {currentSurahInfo && (
        <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2 font-arabic text-gradient">
              {currentSurahInfo.titleAr}
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              {currentSurahInfo.title}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <Badge className="bg-luxury-gradient text-white">
                {currentSurahInfo.count} {UI_TEXT.verses}
              </Badge>
              <Badge variant="outline" className="border-border">
                Juz {currentSurahInfo.juz?.join(', ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Player */}
      {currentSurahInfo && (
        <QuranPlayer
          surahNumber={selectedSurah}
          verseNumber={currentVerse}
          surahTitle={currentSurahInfo.title}
          maxVerses={currentSurahInfo.count}
          onVerseChange={setCurrentVerse}
        />
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Verses */}
      <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark">
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-6">
              {verses.map((verse) => (
                <div
                  key={verse.index}
                  className={`p-4 rounded-lg transition-smooth cursor-pointer ${
                    verse.index === currentVerse
                      ? 'bg-luxury-gradient/10 border border-primary/30 shadow-md'
                      : 'hover:bg-muted/50 hover:shadow-sm'
                  }`}
                  onClick={() => handleVerseClick(verse.index)}
                >
                  <div className="flex items-start space-x-4">
                    <Badge
                      variant={verse.index === currentVerse ? "default" : "secondary"}
                      className={`mt-1 transition-smooth ${
                        verse.index === currentVerse 
                          ? 'bg-luxury-gradient text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {verse.index}
                    </Badge>
                    <div className="flex-1 space-y-3">
                      {/* Arabic Text */}
                      <div className="text-right text-xl leading-relaxed font-arabic">
                        {verse.verse}
                      </div>
                      
                      {/* Translation */}
                      {showTranslation && (
                        <>
                          <Separator />
                          <div className="text-left text-muted-foreground leading-relaxed">
                            {getVerseTranslation(verse.index)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuranReader;