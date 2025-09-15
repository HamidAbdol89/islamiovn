// Quran module exports
export { default as QuranApp } from './QuranApp';
export { default as QuranReader } from './QuranReader';
export { default as QuranPlayer } from './QuranPlayer';
export { default as TajweedVerse } from './TajweedVerse';
export { default as TajweedLegend } from './TajweedLegend';

// Refactored components
export { default as SurahSelectionScreen } from './SurahSelectionScreen';
export { default as QuranReaderHeader } from './QuranReaderHeader';
export { default as SettingsPanel } from './SettingsPanel';
export { default as VerseCard } from './VerseCard';
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';

// Custom hooks
export { useQuranData, useAudioPlayer, useQuranSettings } from './hooks';

// Types and constants
export type * from './types';
export { NGON_NGU, VAN_BAN_GIAO_DIEN, GIA_TRI_MAC_DINH } from './constants';

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
