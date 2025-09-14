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

export interface GoogleUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly picture?: string;
  readonly verified_email: boolean;
}

export interface AuthContextType {
  readonly user: GoogleUser | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly login: () => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly error: string | null;
  readonly setUser: (user: GoogleUser | null) => void;
  readonly setError: (error: string | null) => void;
  readonly exchangeCodeForToken: (code: string) => Promise<GoogleUser>;
}

export interface GoogleLoginButtonProps {
  readonly onSuccess?: (user: GoogleUser) => void;
  readonly onError?: (error: string) => void;
  readonly disabled?: boolean;
}
