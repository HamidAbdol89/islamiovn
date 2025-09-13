// types.ts - Vietnamese interfaces and types for QuranReader
export interface NgonNgu {
  code: string;
  name: string;
  flag: string;
}

export interface TrangThaiAudio {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  error: string | null;
}

export interface CacTrangThaiAudio {
  [verseIndex: number]: TrangThaiAudio;
}

export interface VanBanGiaoDien {
  readonly title: string;
  readonly loading: string;
  readonly errorLoadingContent: string;
  readonly errorLoadingTranslation: string; // NEW: For translation-specific errors
  readonly  retryTranslation: string; 
  readonly translationUnavailable: string; // NEW: When translation is not available
  readonly footnotes: string; 
  readonly settings: string;
  readonly settingsDescription: string;
  readonly translation: string;
  readonly tajweed: string;
  readonly tajweedGuide: string;
  readonly tajweedLegend: string;
  readonly language: string;
  readonly languageLabel: string;
  readonly displayOptions: string;
  readonly volume: string;
  readonly verses: string;
  readonly failedToPlay: string;
  readonly failedToLoad: string;
  readonly refresh: string;
  readonly back: string;
  readonly verse: string;
  readonly surah: string;
  readonly play: string;
  readonly pause: string;
  readonly next: string;
  readonly previous: string;
}

export interface QuranReaderProps {
  // Main component props if needed
}

export interface SurahSelectionProps {
  surahList: import('./quranApi').SurahInfo[];
  onSurahSelect: (surahNumber: number) => void;
  uiText: VanBanGiaoDien;
}

export interface QuranReaderHeaderProps {
  currentSurahInfo: import('./quranApi').SurahInfo | undefined;
  selectedSurah: number | null;
  versesCount: number;
  onBackClick: () => void;
  onSettingsClick: () => void;
}

export interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
  showTajweed: boolean;
  onToggleTajweed: () => void;
  showTajweedLegend: boolean;
  onToggleTajweedLegend: () => void;
  globalVolume: number;
  onVolumeChange: (volume: number) => void;
  languages: readonly NgonNgu[];
  uiText: VanBanGiaoDien;
}

export interface VerseCardProps {
  verse: import('./quranApi').Verse;
  index: number;
  isCurrentlyPlaying: boolean;
  verseState: TrangThaiAudio | undefined;
  translation: string;
  tajweedRules: import('./quranApi').TajweedRule[];
  showTranslation: boolean;
  showTajweed: boolean;
  onToggleAudio: (index: number) => void;
  uiText: VanBanGiaoDien;
}

export interface LoadingStateProps {
  message: string;
}

export interface ErrorStateProps {
  error: string;
  onRefresh: () => void;
  refreshText: string;
}
