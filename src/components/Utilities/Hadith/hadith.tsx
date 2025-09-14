import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Internal imports
import { useCategories, useHadithDetail, useBatchHadiths } from './hooks';
import { storageUtils } from './utils';
import {
  LoadingSkeleton,
  CategoryCard,
  HadithCard,
  HadithHeader,
  HadithDetailSheet,
  Pagination,
  ErrorDisplay,
} from './components';
import type { Category, HadithSummary } from './types';

const HadithApp = memo(() => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedHadithId, setSelectedHadithId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>(() => storageUtils.getFavorites());
  const [bookmarks, setBookmarks] = useState<number[]>(() => storageUtils.getBookmarks());
  // React Query hooks
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: selectedHadith, isLoading: hadithDetailLoading } = useHadithDetail(selectedHadithId);
  
  // Batch loading hook - auto load all hadiths for selected category
  const {
    hadiths: allHadiths,
    isLoading: isLoadingHadiths,
    error: hadithsError,
    loadAllHadiths,
  } = useBatchHadiths();

  // Auto load all hadiths when category is selected
  useEffect(() => {
    if (selectedCategory) {
      console.log(`Loading all hadiths for category: ${selectedCategory.title} (ID: ${selectedCategory.id})`);
      loadAllHadiths(selectedCategory.id);
    }
  }, [selectedCategory, loadAllHadiths]);

  // Pagination for displaying hadiths
  const HADITHS_PER_PAGE = 20;
  const totalHadiths = allHadiths.length;
  const totalPages = Math.ceil(totalHadiths / HADITHS_PER_PAGE);
  
  const displayHadiths = useMemo(() => {
    const startIndex = (currentPage - 1) * HADITHS_PER_PAGE;
    const endIndex = startIndex + HADITHS_PER_PAGE;
    console.log(`Displaying hadiths: ${startIndex + 1}-${Math.min(endIndex, totalHadiths)} of ${totalHadiths} total`);
    return allHadiths.slice(startIndex, endIndex);
  }, [allHadiths, currentPage, totalHadiths]);

  const loading = categoriesLoading || isLoadingHadiths;
  const error = categoriesError?.message || hadithsError || null;

  // Memoized handlers
  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    setSelectedHadithId(null);
    setCurrentPage(1);
  }, []);

  const handleHadithSelect = useCallback((hadith: HadithSummary) => {
    setSelectedHadithId(hadith.id);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const toggleFavorite = useCallback((hadithId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(hadithId)
        ? prev.filter(id => id !== hadithId)
        : [...prev, hadithId];
      storageUtils.setFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const toggleBookmark = useCallback((hadithId: number) => {
    setBookmarks(prev => {
      const newBookmarks = prev.includes(hadithId)
        ? prev.filter(id => id !== hadithId)
        : [...prev, hadithId];
      storageUtils.setBookmarks(newBookmarks);
      return newBookmarks;
    });
  }, []);

  const goBack = useCallback(() => {
    if (selectedHadithId) {
      setSelectedHadithId(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  }, [selectedHadithId, selectedCategory]);

  const retryCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['hadith-categories'] });
  }, [queryClient]);



  // Error display component
  if (error && !loading) {
    return (
      <ErrorDisplay error={error} onRetry={retryCategories} />
    );
  }

  // Categories view
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
          <HadithHeader selectedCategory={null} onBack={goBack} />
          
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categories?.map((category) => (
                <CategoryCard 
                  key={category.id}
                  category={category}
                  onClick={handleCategorySelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }


  // Hadiths list view
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        <HadithHeader 
          selectedCategory={selectedCategory} 
          currentPage={currentPage}
          totalPages={totalPages}
          onBack={goBack}
        />

        {loading ? (
          <LoadingSkeleton count={9} />
        ) : (
          <>
            {/* Hadith Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
              {displayHadiths.map((hadith) => (
                <HadithCard 
                  key={hadith.id}
                  hadith={hadith}
                  isFavorite={favorites.includes(hadith.id)}
                  isBookmarked={bookmarks.includes(hadith.id)}
                  onClick={handleHadithSelect}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* Show total count */}
            {totalHadiths > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {displayHadiths.length} trong tổng số {totalHadiths} hadith
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <HadithDetailSheet 
        selectedHadith={selectedHadith || null}
        isLoading={hadithDetailLoading}
        favorites={favorites}
        bookmarks={bookmarks}
        onClose={() => setSelectedHadithId(null)}
        onToggleFavorite={toggleFavorite}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
});
HadithApp.displayName = 'HadithApp';

export default HadithApp;