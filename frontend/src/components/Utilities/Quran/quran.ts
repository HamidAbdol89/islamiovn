// types/quran.ts
export interface SurahInfo {
    index: string;
    title: string;
    titleAr: string;
    count: number;
    juz: number[];
    type: string;
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
  
  export interface TajweedRule {
    rule: 'hamzat_wasl' | 'lam_shamsiyyah' | 'madd_2' | 'madd_246' | 'madd_6' | 'ghunnah' | 'ikhfa' | 'idgham' | 'iqlab' | 'qalqalah' | 'waqf' | 'sakt';
    start: number;
    end: number;
  }

  export interface TajweedVerseData {
    [key: string]: TajweedRule[]; // verse_1, verse_2, etc.
  }

  export interface TajweedSurah {
    index: string;
    verse: TajweedVerseData;
    count: number;
  }

  export interface TajweedVerse {
    index: number;
    verse: string;
    rules?: TajweedRule[];
  }
  
  export interface Translation {
    index: number;
    text: string;
    footnotes?: string;
  }
  
  export interface AudioIndex {
    [key: string]: {
      url: string;
      duration?: number;
    };
  }
  
  