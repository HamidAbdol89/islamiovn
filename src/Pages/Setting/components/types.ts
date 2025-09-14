export interface ThemeOption {
  readonly id: string;
  readonly name: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

export interface SavedItemCounts {
  readonly hadithFavorites: number;
  readonly hadithBookmarks: number;
  readonly quranFavorites: number;
  readonly quranBookmarks: number;
}

export interface SettingItemProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly label: string;
  readonly onClick?: () => void;
  readonly rightContent?: React.ReactNode;
  readonly showChevron?: boolean;
}

export interface SectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

export type ViewType = 'main' | 'saved-hadiths' | 'saved-quran';

export interface SettingNavigationProps {
  readonly currentView: ViewType;
  readonly onViewChange: (view: ViewType) => void;
}
