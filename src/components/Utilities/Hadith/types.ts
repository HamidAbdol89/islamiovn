// Hadith Types
export interface Category {
  id: number;
  title: string;
  hadeeths_count: number;
}

export interface HadithSummary {
  id: number;
  title: string;
  hadeeth: string;
}

export interface HadithDetail {
  id: number;
  title: string;
  hadeeth: string;
  explanation: string;
  fawaed: string[];
  attribution: string;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

// Component Props
export interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
}

export interface HadithCardProps {
  hadith: HadithSummary;
  isFavorite: boolean;
  isBookmarked: boolean;
  onClick: (hadith: HadithSummary) => void;
}

export interface HadithHeaderProps {
  selectedCategory: Category | null;
  currentPage?: number;
  totalPages?: number;
  onBack: () => void;
  onLoadAll?: () => void;
  isLoadingAll?: boolean;
  cachedCount?: number;
  isFullyCached?: boolean;
}

export interface HadithDetailSheetProps {
  selectedHadith: HadithDetail | null;
  isLoading: boolean;
  favorites: number[];
  bookmarks: number[];
  onClose: () => void;
  onToggleFavorite: (hadithId: number) => void;
  onToggleBookmark: (hadithId: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LoadingSkeletonProps {
  count?: number;
}
