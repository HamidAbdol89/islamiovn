// quranApi.ts - Correct version with proper Vietnamese translation mapping
import type { SurahInfo, JuzInfo, Surah, TajweedVerse, TajweedSurah, TajweedRule, AudioIndex, Translation } from './quran';

// Interface for quranenc.com API response
interface QuranEncTranslationResponse {
  result: Array<{
    id: string;
    sura: string;
    aya: string;
    arabic_text: string;
    translation: string;
    footnotes: string;
  }>;
}

class QuranAPI {
    private baseUrl = 'https://quranvietapp.pages.dev';
    private quranEncUrl = 'https://quranenc.com/api/v1';
    private cache = new Map<string, any>();
    private audioCache = new Map<string, HTMLAudioElement>();
    private audioPreloadQueue = new Set<string>();
  
    // Fetch và cache JSON data
    private async fetchJSON<T>(path: string, baseUrl: string = this.baseUrl): Promise<T> {
      const fullPath = baseUrl === this.baseUrl ? path : `${baseUrl}/${path}`;
      
      if (this.cache.has(fullPath)) {
        return this.cache.get(fullPath);
      }
  
      try {
        const response = await fetch(baseUrl === this.baseUrl ? `${this.baseUrl}/${path}` : fullPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        this.cache.set(fullPath, data);
        return data;
      } catch (error) {
        console.error(`Error fetching ${fullPath}:`, error);
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
        titleAr: rawData.name,
        count: verses.length,
        verses
      };
    }
  
    // Lấy tajweed của surah
    async getTajweed(surahNumber: number): Promise<TajweedVerse[]> {
      try {
        const tajweedSurah = await this.fetchJSON<TajweedSurah>(`tajweed/surah_${surahNumber}.json`);
        
        const tajweedVerses: TajweedVerse[] = [];
        
        Object.entries(tajweedSurah.verse).forEach(([verseKey, rules]) => {
          const verseIndex = parseInt(verseKey.replace('verse_', ''));
          tajweedVerses.push({
            index: verseIndex,
            verse: '',
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
  
    // Lấy Vietnamese translation từ quranenc.com với mapping chính xác
    async getVietnameseTranslation(surahNumber: number): Promise<Translation[]> {
      try {
        const response = await fetch(
          `${this.quranEncUrl}/translation/sura/vietnamese_rwwad/${surahNumber}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data: QuranEncTranslationResponse = await response.json();
        const translations: Translation[] = [];
        
        if (surahNumber === 1) {
          // AL-FATIHA: 
          // API cũ: verse_1 (index 0), verse_2 (index 1), ..., verse_7 (index 6)
          // quranenc: aya 1, aya 2, ..., aya 7
          // Mapping: aya N → index (N-1)
          
          data.result.forEach((item) => {
            const ayaNumber = parseInt(item.aya);
            translations.push({
              index: ayaNumber - 1, // aya 1 → index 0, aya 2 → index 1, etc.
              text: item.translation,
              footnotes: item.footnotes || undefined
            });
          });
          
        } else if (surahNumber === 9) {
          // AL-TAWBA: Không có Bismillah
          // API cũ: verse_1 (index 0), verse_2 (index 1), ..., verse_129 (index 128)
          // quranenc: aya 1, aya 2, ..., aya 129  
          // Mapping: aya N → index (N-1)
          
          data.result.forEach((item) => {
            const ayaNumber = parseInt(item.aya);
            translations.push({
              index: ayaNumber - 1, // aya 1 → index 0, aya 2 → index 1, etc.
              text: item.translation,
              footnotes: item.footnotes || undefined
            });
          });
          
        } else {
          // CÁC SURAH KHÁC: Có Bismillah riêng
          // API cũ: verse_0 (Bismillah, index 0), verse_1 (index 1), verse_2 (index 2), etc.
          // quranenc: aya 1 (tương ứng verse_1), aya 2 (tương ứng verse_2), etc.
          // Mapping: Bismillah manual + aya N → index N
          
          // Thêm Bismillah tại index 0 (tương ứng verse_0 từ API cũ)
          translations.push({
            index: 0,
            text: "Với danh nghĩa Allah, Đấng Rất thương xót, Rất từ bi",
            footnotes: undefined
          });
          
          // Thêm các verse còn lại
          data.result.forEach((item) => {
            const ayaNumber = parseInt(item.aya);
            translations.push({
              index: ayaNumber, // aya 1 → index 1, aya 2 → index 2, etc.
              text: item.translation,
              footnotes: item.footnotes || undefined
            });
          });
        }
        
        // Sắp xếp theo index để đảm bảo thứ tự đúng
        translations.sort((a, b) => a.index - b.index);
        
        console.log(`Vietnamese translation loaded for surah ${surahNumber}:`, {
          totalVerses: translations.length,
          indexRange: `${translations[0]?.index}-${translations[translations.length - 1]?.index}`,
          sample: translations.slice(0, 3).map(t => `${t.index}: ${t.text.substring(0, 30)}...`)
        });
        
        return translations;
      } catch (error) {
        console.error(`Error fetching Vietnamese translation for surah ${surahNumber}:`, error);
        throw error;
      }
    }

    // Lấy translation từ API cũ (cho các ngôn ngữ khác)
    async getOtherLanguageTranslation(language: string, surahNumber: number): Promise<Translation[]> {
      try {
        const rawData = await this.fetchJSON<any>(
          `translation/${language}/${language}_translation_${surahNumber}.json`
        );
        
        let translations: Translation[] = [];
        
        if (Array.isArray(rawData)) {
          translations = rawData.map((item, index) => ({
            index: index,
            text: typeof item === 'string' ? item : item.text || '',
            footnotes: undefined
          }));
        } else if (rawData.verse) {
          // Transform object format - giữ nguyên structure từ API cũ
          translations = Object.entries(rawData.verse).map(([_, value], idx) => ({
            index: idx, // Sequential index: 0, 1, 2, 3...
            text: value as string,
            footnotes: undefined
          }));
        } else if (rawData.translation) {
          translations = Object.entries(rawData.translation).map(([_, value], idx) => ({
            index: idx,
            text: value as string,
            footnotes: undefined
          }));
        }
        
        return translations;
      } catch (error) {
        console.error(`Error fetching ${language} translation for surah ${surahNumber}:`, error);
        throw error;
      }
    }

    // Main translation method
    async getTranslation(language: string, surahNumber: number): Promise<Translation[]> {
      try {
        // Tiếng Việt: dùng API quranenc.com
        if (language === 'vi' || language === 'vietnamese') {
          return await this.getVietnameseTranslation(surahNumber);
        }
        
        // Các ngôn ngữ khác: dùng API cũ
        return await this.getOtherLanguageTranslation(language, surahNumber);
        
      } catch (error) {
        console.warn(`Translation not available for ${language} surah ${surahNumber}:`, error);
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
  
    // Tạo URL audio stream
    getAudioUrl(surahNumber: number, verseIndex: number): string {
      const paddedSurah = surahNumber.toString().padStart(3, '0');
    
      if (surahNumber === 1) {
        const paddedVerse = (verseIndex + 1).toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      } else if (surahNumber === 9) {
        const paddedVerse = (verseIndex + 1).toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      } else {
        const paddedVerse = verseIndex.toString().padStart(3, '0');
        return `${this.baseUrl}/audio/${paddedSurah}/${paddedVerse}.mp3`;
      }
    }

    // Get cached audio element
    getCachedAudio(surahNumber: number, verseIndex: number): HTMLAudioElement {
      const audioKey = `${surahNumber}-${verseIndex}`;
      
      if (this.audioCache.has(audioKey)) {
        return this.audioCache.get(audioKey)!;
      }
      
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.src = this.getAudioUrl(surahNumber, verseIndex);
      
      this.audioCache.set(audioKey, audio);
      return audio;
    }

    // Preload audio
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
              console.warn(`Failed to preload audio for verse ${i + 1} of surah ${surahNumber}`);
              resolve();
            };
            
            if (audio.readyState >= 4) {
              resolve();
            } else {
              audio.addEventListener('canplaythrough', handleCanPlay);
              audio.addEventListener('error', handleError);
              
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

    // Clear caches
    clearAudioCache(): void {
      this.audioCache.forEach(audio => {
        audio.pause();
        audio.src = '';
        audio.load();
      });
      this.audioCache.clear();
      this.audioPreloadQueue.clear();
    }
  
    clearCache(): void {
      this.cache.clear();
    }
  
    // Preload essential data
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

    // Test method để verify mapping
    async testTranslationMapping(surahNumber: number): Promise<void> {
      try {
        const [arabicData, vietnameseData] = await Promise.all([
          this.getSurah(surahNumber),
          this.getVietnameseTranslation(surahNumber)
        ]);
        
        console.log(`\n=== SURAH ${surahNumber} MAPPING TEST ===`);
        console.log(`Arabic verses: ${arabicData.verses.length}`);
        console.log(`Vietnamese translations: ${vietnameseData.length}`);
        
        // Test first few verses
        for (let i = 0; i < Math.min(3, arabicData.verses.length); i++) {
          const arabicVerse = arabicData.verses[i];
          const translation = vietnameseData.find(t => t.index === i);
          
          console.log(`\nIndex ${i}:`);
          console.log(`Arabic: ${arabicVerse?.verse?.substring(0, 50)}...`);
          console.log(`Vietnamese: ${translation?.text?.substring(0, 50)}...`);
          console.log(`Match: ${translation ? '✅' : '❌'}`);
        }
      } catch (error) {
        console.error(`Test failed for surah ${surahNumber}:`, error);
      }
    }
  }
  
  export const quranApi = new QuranAPI();

// Re-export types for convenience
export type { SurahInfo, JuzInfo, Surah, TajweedVerse, TajweedRule, AudioIndex, Translation, Verse } from './quran';