// quranApi.ts
import type { SurahInfo, JuzInfo, Surah, TajweedVerse, TajweedSurah, TajweedRule, AudioIndex, Translation } from './quran';

class QuranAPI {
    private baseUrl = 'https://quranvietapp.pages.dev';
    private cache = new Map<string, any>();
    private audioCache = new Map<string, HTMLAudioElement>();
    private audioPreloadQueue = new Set<string>();
  
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
      
      // Re-index all verses to start from 0 (verse_1 becomes index 0, verse_2 becomes index 1, etc.)
      verses.forEach((verse, idx) => {
        verse.index = idx;
      });
      
      return {
        index: parseInt(rawData.index),
        title: rawData.name,
        titleAr: rawData.name, // Use name as titleAr for now
        count: verses.length, // Update count to include Bismillah
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
    getAudioUrl(surahNumber: number, verseIndex: number): string {
      const paddedSurah = surahNumber.toString().padStart(3, '0');
    
      if (surahNumber === 1) {
        // Al-Fatiha
        const paddedVerse = (verseIndex + 1).toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      } else if (surahNumber === 9) {
        // Al-Tawba: không có verse_0
        const paddedVerse = (verseIndex + 1).toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      } else {
        // Các surah khác
        const paddedVerse = verseIndex.toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      }
    }
    

    // Get cached audio element or create new one
    getCachedAudio(surahNumber: number, verseIndex: number): HTMLAudioElement {
      const audioKey = `${surahNumber}-${verseIndex}`;
      
      if (this.audioCache.has(audioKey)) {
        return this.audioCache.get(audioKey)!;
      }
      
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.src = this.getAudioUrl(surahNumber, verseIndex);
      
      // Cache the audio element
      this.audioCache.set(audioKey, audio);
      
      return audio;
    }

    // Preload audio for entire surah with error handling
    async preloadSurahAudio(surahNumber: number, verses: any[]): Promise<void> {
      const preloadPromises: Promise<void>[] = [];
      const actualVerseCount = verses.length;
      
      for (let i = 0; i < actualVerseCount; i++) {
        const audioKey = `${surahNumber}-${i}`;
        
        if (!this.audioPreloadQueue.has(audioKey)) {
          this.audioPreloadQueue.add(audioKey);
          
          const preloadPromise = new Promise<void>((resolve) => {
            const audio = this.getCachedAudio(surahNumber, i);
            
            const handleCanPlay = () => {
              audio.removeEventListener('canplaythrough', handleCanPlay);
              audio.removeEventListener('error', handleError);
              resolve();
            };
            
            const handleError = () => {
              audio.removeEventListener('canplaythrough', handleCanPlay);
              audio.removeEventListener('error', handleError);
              console.warn(`Failed to preload audio for verse ${i + 1} of surah ${surahNumber}: ${audio.src}`);
              resolve(); // Don't fail the whole process
            };
            
            if (audio.readyState >= 4) {
              resolve();
            } else {
              audio.addEventListener('canplaythrough', handleCanPlay);
              audio.addEventListener('error', handleError);
              
              // Add timeout to prevent hanging
              setTimeout(() => {
                if (audio.readyState < 4) {
                  audio.removeEventListener('canplaythrough', handleCanPlay);
                  audio.removeEventListener('error', handleError);
                  console.warn(`Timeout preloading verse ${i + 1} of surah ${surahNumber}`);
                  resolve();
                }
              }, 5000);
              
              audio.load();
            }
          });
          
          preloadPromises.push(preloadPromise);
        }
      }
      
      try {
        await Promise.all(preloadPromises);
        console.log(`Preloaded audio for surah ${surahNumber} (${actualVerseCount} verses)`);
      } catch (error) {
        console.error(`Error preloading surah ${surahNumber} audio:`, error);
      }
    }

    // Clear audio cache for memory management
    clearAudioCache(): void {
      this.audioCache.forEach(audio => {
        audio.pause();
        audio.src = '';
        audio.load();
      });
      this.audioCache.clear();
      this.audioPreloadQueue.clear();
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