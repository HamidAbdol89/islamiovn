// components/QuranReader.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Languages, RefreshCw, Palette, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/ui/BackButton';
import QuranPlayer from './QuranPlayer';
import TajweedVerse from './TajweedVerse';
import TajweedLegend from './TajweedLegend';
import { quranApi, type SurahInfo, type Verse, type Translation, type TajweedVerse as TajweedVerseType } from './quranApi';

const QuranReader: React.FC = () => {
  const [surahList, setSurahList] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [tajweedData, setTajweedData] = useState<TajweedVerseType[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('id');
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showTajweed, setShowTajweed] = useState<boolean>(false);
  const [showTajweedLegend, setShowTajweedLegend] = useState<boolean>(false);
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
    tajweed: 'Tajweed',
    tajweedGuide: 'Hướng dẫn Tajweed',
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
        const [surahWithTajweed, translationData] = await Promise.all([
          quranApi.getSurahWithTajweed(selectedSurah),
          showTranslation 
            ? quranApi.getTranslation(selectedLanguage, selectedSurah).catch(() => [])
            : Promise.resolve([])
        ]);

        setVerses(surahWithTajweed.surah.verses || []);
        setTajweedData(surahWithTajweed.tajweed || []);
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

  const toggleTajweed = useCallback(() => {
    setShowTajweed(prev => !prev);
  }, []);

  const toggleTajweedLegend = useCallback(() => {
    setShowTajweedLegend(prev => !prev);
  }, []);

  const handleVerseClick = useCallback((verseIndex: number) => {
    setCurrentVerse(verseIndex);
  }, []);

  // Get tajweed rules for a specific verse
  const getTajweedRules = useCallback((verseIndex: number) => {
    const tajweedVerse = tajweedData.find(t => t.index === verseIndex);
    return tajweedVerse?.rules || [];
  }, [tajweedData]);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header - Mobile First */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <BackButton 
              className="flex-shrink-0"
              size="sm"
              variant="ghost"
            />
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-gradient truncate">{UI_TEXT.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="transition-smooth hover:bg-luxury-gradient/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousSurah}
              disabled={selectedSurah <= 1}
              className="transition-smooth"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextSurah}
              disabled={selectedSurah >= 114}
              className="transition-smooth"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-safe">
        {/* Controls Section - Mobile Optimized */}
        <Card className="m-4 bg-card border-border shadow-luxury dark:shadow-luxury-dark">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-center text-gradient">Cài đặt đọc Quran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Surah Selection - Full Width on Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Chọn Surah</label>
              <Select
                value={selectedSurah.toString()}
                onValueChange={handleSurahChange}
              >
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue placeholder={UI_TEXT.selectSurah} />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-60">
                    {surahList.map((surah) => (
                      <SelectItem key={surah.index} value={surah.index}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{parseInt(surah.index)}. {surah.title}</span>
                          <Badge variant="secondary" className="ml-2 bg-luxury-gradient text-white text-xs">
                            {surah.count} {UI_TEXT.verses}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Ngôn ngữ dịch</label>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="h-12 bg-background border-border">
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
            </div>

            {/* Toggle Buttons - Mobile Optimized */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={showTranslation ? "default" : "outline"}
                onClick={toggleTranslation}
                className={`h-12 transition-smooth ${
                  showTranslation ? 'bg-luxury-gradient hover:bg-luxury-gradient/90' : 'hover:bg-luxury-gradient/10'
                }`}
              >
                <Languages className="h-4 w-4 mr-2" />
                <span className="text-sm">{UI_TEXT.translation}</span>
              </Button>

              <Button
                variant={showTajweed ? "default" : "outline"}
                onClick={toggleTajweed}
                className={`h-12 transition-smooth ${
                  showTajweed ? 'bg-luxury-gradient hover:bg-luxury-gradient/90' : 'hover:bg-luxury-gradient/10'
                }`}
              >
                <Palette className="h-4 w-4 mr-2" />
                <span className="text-sm">{UI_TEXT.tajweed}</span>
              </Button>
            </div>

            {/* Tajweed Guide Toggle */}
            {showTajweed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTajweedLegend}
                className="w-full text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Info className="h-4 w-4 mr-2" />
                {UI_TEXT.tajweedGuide}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Current Surah Info - Mobile Optimized */}
        {currentSurahInfo && (
          <Card className="mx-4 mb-4 bg-card border-border shadow-luxury dark:shadow-luxury-dark">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold mb-2 font-arabic text-gradient">
                {currentSurahInfo.titleAr}
              </h2>
              <p className="text-base text-muted-foreground mb-3">
                {currentSurahInfo.title}
              </p>
              <div className="flex items-center justify-center space-x-3 text-sm">
                <Badge className="bg-luxury-gradient text-white px-3 py-1">
                  {currentSurahInfo.count} {UI_TEXT.verses}
                </Badge>
                <Badge variant="outline" className="border-border px-3 py-1">
                  Juz {currentSurahInfo.juz?.join(', ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tajweed Legend - Mobile Optimized */}
        {showTajweed && showTajweedLegend && (
          <div className="mx-4 mb-4">
            <TajweedLegend />
          </div>
        )}

        {/* Audio Player - Mobile Optimized */}
        {currentSurahInfo && (
          <div className="mx-4 mb-4">
            <QuranPlayer
              surahNumber={selectedSurah}
              verseNumber={currentVerse}
              surahTitle={currentSurahInfo.title}
              maxVerses={currentSurahInfo.count}
              onVerseChange={setCurrentVerse}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mx-4 mb-4 border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Verses - Mobile First Design */}
        <div className="mx-4 mb-4">
          <Card className="bg-card border-border shadow-luxury dark:shadow-luxury-dark">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center text-gradient">
                Nội dung Surah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="p-4 space-y-4">
                  {verses.map((verse) => (
                    <div
                      key={verse.index}
                      className={`p-4 rounded-xl transition-all duration-200 cursor-pointer touch-manipulation ${
                        verse.index === currentVerse
                          ? 'bg-luxury-gradient/10 border-2 border-primary/30 shadow-lg scale-[1.02]'
                          : 'hover:bg-muted/30 active:bg-muted/50 hover:shadow-md active:scale-[0.98]'
                      }`}
                      onClick={() => handleVerseClick(verse.index)}
                    >
                      <div className="flex items-start space-x-3">
                        <Badge
                          variant={verse.index === currentVerse ? "default" : "secondary"}
                          className={`mt-1 min-w-[2rem] h-8 flex items-center justify-center transition-all ${
                            verse.index === currentVerse 
                              ? 'bg-luxury-gradient text-white shadow-md' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {verse.index}
                        </Badge>
                        <div className="flex-1 space-y-3">
                          {/* Arabic Text with Tajweed - Mobile Optimized */}
                          <div className="text-right leading-loose">
                            {showTajweed ? (
                              <TajweedVerse
                                verse={verse.verse}
                                tajweedRules={getTajweedRules(verse.index)}
                                className="font-arabic text-lg sm:text-xl"
                              />
                            ) : (
                              <span className="font-arabic text-lg sm:text-xl">{verse.verse}</span>
                            )}
                          </div>
                          
                          {/* Translation - Mobile Optimized */}
                          {showTranslation && (
                            <>
                              <Separator className="my-3" />
                              <div className="text-left text-muted-foreground leading-relaxed text-sm sm:text-base">
                                {getVerseTranslation(verse.index)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;