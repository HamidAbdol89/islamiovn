// Quran module exports
export { default as QuranApp } from './QuranApp';
export { default as QuranReader } from './QuranReader';
export { default as QuranPlayer } from './QuranPlayer';
export { default as TajweedVerse } from './TajweedVerse';
export { default as TajweedLegend } from './TajweedLegend';

// API and types
export { quranApi } from './quranApi';
export type {
  SurahInfo,
  JuzInfo,
  Surah,
  Verse,
  Translation,
  TajweedVerse as TajweedVerseType,
  TajweedRule,
  AudioIndex
} from './quran';

// Re-export types from components
export type { TajweedVerseProps, TajweedRule as TajweedRuleComponent } from './TajweedVerse';
