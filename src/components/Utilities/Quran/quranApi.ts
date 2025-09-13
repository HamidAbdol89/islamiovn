// quranApi.ts
import type { SurahInfo, JuzInfo, Surah, TajweedVerse, TajweedSurah, TajweedRule, AudioIndex, Translation } from './quran';

class QuranAPI {
    private baseUrl = 'https://quranvietapp.pages.dev';
    private cache = new Map<string, any>();
  
    // Fetch và cache JSON data
    private async fetchJSON<T>(path: string): Promise<T> {
      if (this.cache.has(path)) {
        return this.cache.get(path);
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/${path}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        this.cache.set(path, data);
        return data;
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
        throw error;
      }
    }
  
    // Lấy danh sách tất cả surah
    async getAllSurah(): Promise<SurahInfo[]> {
      return this.fetchJSON<SurahInfo[]>('surah.json');
    }
  
    // Lấy thông tin juz
    async getAllJuz(): Promise<JuzInfo[]> {
      return this.fetchJSON<JuzInfo[]>('juz.json');
    }
  
    // Lấy nội dung surah (Arabic)
    async getSurah(surahNumber: number): Promise<Surah> {
      const rawData = await this.fetchJSON<any>(`surah/surah_${surahNumber}.json`);
      
      // Transform data to match expected Surah interface
      const verses = Object.entries(rawData.verse).map(([key, value]) => ({
        index: parseInt(key.replace('verse_', '')),
        verse: value as string
      }));
      
      return {
        index: parseInt(rawData.index),
        title: rawData.name,
        titleAr: rawData.name, // Use name as titleAr for now
        count: rawData.count,
        verses
      };
    }
  
    // Lấy tajweed của surah
    async getTajweed(surahNumber: number): Promise<TajweedVerse[]> {
      try {
        const tajweedSurah = await this.fetchJSON<TajweedSurah>(`tajweed/surah_${surahNumber}.json`);
        
        // Transform data structure to match TajweedVerse[]
        const tajweedVerses: TajweedVerse[] = [];
        
        Object.entries(tajweedSurah.verse).forEach(([verseKey, rules]) => {
          const verseIndex = parseInt(verseKey.replace('verse_', ''));
          tajweedVerses.push({
            index: verseIndex,
            verse: '', // Will be filled from surah data
            rules: rules as TajweedRule[]
          });
        });
        
        return tajweedVerses;
      } catch (error) {
        console.warn(`Tajweed not available for surah ${surahNumber}`);
        return [];
      }
    }

    // Lấy surah với tajweed data (nếu có)
    async getSurahWithTajweed(surahNumber: number): Promise<{ surah: Surah; tajweed: TajweedVerse[] }> {
      try {
        const [surahData, tajweedData] = await Promise.all([
          this.getSurah(surahNumber),
          this.getTajweed(surahNumber).catch(() => [])
        ]);

        return {
          surah: surahData,
          tajweed: tajweedData
        };
      } catch (error) {
        console.error(`Error loading surah ${surahNumber} with tajweed:`, error);
        throw error;
      }
    }
  
    // Lấy translation
    async getTranslation(language: string, surahNumber: number): Promise<Translation[]> {
      try {
        const rawData = await this.fetchJSON<any>(
          `translation/${language}/${language}_translation_${surahNumber}.json`
        );
        
        // Handle different possible data structures
        if (Array.isArray(rawData)) {
          return rawData;
        } else if (rawData.verse) {
          // Transform object format to array
          return Object.entries(rawData.verse).map(([key, value]) => ({
            index: parseInt(key.replace('verse_', '')),
            text: value as string
          }));
        }
        
        return [];
      } catch (error) {
        console.warn(`Translation not available for ${language} surah ${surahNumber}`);
        return [];
      }
    }
  
    // Lấy audio index
    async getAudioIndex(surahNumber: number): Promise<AudioIndex> {
      try {
        const paddedNumber = surahNumber.toString().padStart(3, '0');
        return this.fetchJSON<AudioIndex>(`audio/${paddedNumber}/index.json`);
      } catch (error) {
        console.warn(`Audio index not available for surah ${surahNumber}`);
        return {};
      }
    }
  
    // Tạo URL audio stream (không cache, stream trực tiếp)
    getAudioUrl(surahNumber: number, verseNumber: number): string {
      const paddedSurah = surahNumber.toString().padStart(3, '0');
      const paddedVerse = verseNumber.toString().padStart(3, '0');
      return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
    }
  
    // Clear cache khi cần
    clearCache(): void {
      this.cache.clear();
    }
  
    // Preload critical data
    async preloadEssentialData(): Promise<void> {
      try {
        await Promise.all([
          this.getAllSurah(),
          this.getAllJuz()
        ]);
        console.log('Essential Quran data preloaded');
      } catch (error) {
        console.error('Failed to preload essential data:', error);
      }
    }
  }
  
  export const quranApi = new QuranAPI();

// Re-export types for convenience
export type { SurahInfo, JuzInfo, Surah, TajweedVerse, TajweedRule, AudioIndex, Translation, Verse } from './quran';