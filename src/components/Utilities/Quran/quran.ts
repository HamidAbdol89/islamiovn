// types/quran.ts
export interface SurahInfo {
    index: string;
    title: string;
    titleAr: string;
    count: number;
    juz: number[];
  }
  
  export interface JuzInfo {
    index: number;
    verse: {
      start: string;
      end: string;
    };
  }
  
  export interface Verse {
    index: number;
    verse: string;
    translation?: string;
  }
  
  export interface Surah {
    index: number;
    title: string;
    titleAr: string;
    count: number;
    verses: Verse[];
  }
  
  export interface TajweedVerse {
    index: number;
    verse: string;
  }
  
  export interface AudioIndex {
    [key: string]: {
      url: string;
      duration?: number;
    };
  }
  
  export interface Translation {
    index: number;
    text: string;
  }
  
  