import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Internal imports
import { useCategories, useHadithDetail, useBatchHadiths } from './hooks';
import { useSimpleBookmarkService } from '@/services/simpleBookmarkService';
import { useSimpleFavoriteService } from '@/services/simpleFavoriteService';
import { useAuth } from '@/context/AuthContext';
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
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedHadithId, setSelectedHadithId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  
  // Use simple services
  const favoriteService = useSimpleFavoriteService();
  const bookmarkService = useSimpleBookmarkService();
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

  // Load bookmarks and favorites (only for authenticated users)
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setBookmarks([]);
        return;
      }
      
      setLoadingBookmarks(true);
      try {
        const [favoritesData, bookmarksData] = await Promise.all([
          favoriteService.getFavorites('hadith'),
          bookmarkService.getBookmarks('hadith')
        ]);
        
        const favoriteIds = favoritesData.map(f => parseInt(f.itemId));
        const bookmarkIds = bookmarksData.map(b => parseInt(b.itemId));
        
        console.log('🔴 Favorites loaded:', favoriteIds);
        console.log('🔵 Bookmarks loaded:', bookmarkIds);
        
        setFavorites(favoriteIds);
        setBookmarks(bookmarkIds);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        // Set empty arrays on error to avoid showing stale data
        setFavorites([]);
        setBookmarks([]);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [isAuthenticated]); // Only depend on isAuthenticated

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

  const toggleFavorite = useCallback(async (hadithId: number) => {
    console.log('🔴 Toggle favorite called for hadith:', hadithId);
    
    if (!isAuthenticated) {
      // Show login message
      alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      return;
    }
    
    try {
      // Try to find hadith from allHadiths first, then from selectedHadith
      let hadith = allHadiths.find(h => h.id === hadithId);
      if (!hadith && selectedHadith && selectedHadith.id === hadithId) {
        hadith = selectedHadith;
      }
      
      if (!hadith) {
        console.error('Hadith not found for ID:', hadithId);
        return;
      }

      const hadithData = {
        type: 'hadith' as const,
        itemId: hadithId.toString(),
        title: hadith.title || `Hadith ${hadithId}`,
        content: hadith.hadeeth || hadith.title || `Hadith ${hadithId}`,
        metadata: {
          category: selectedCategory?.title || 'Unknown',
          hadithNumber: hadithId.toString()
        }
      };

      const result = await favoriteService.toggleFavorite(hadithData);
      console.log('🔴 Toggle favorite result:', result);
      
      // Update local state based on result
      const isNowFavorited = result?.isFavorited || false;
      console.log('🔴 Is now favorited:', isNowFavorited);
      
      setFavorites(prev => {
        const newFavorites = isNowFavorited 
          ? [...prev, hadithId]
          : prev.filter(id => id !== hadithId);
        console.log('🔴 New favorites state:', newFavorites);
        return newFavorites;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      if (error instanceof Error && error.message.includes('đăng nhập')) {
        alert(error.message);
      }
    }
  }, [allHadiths, selectedCategory, selectedHadith, isAuthenticated]);

  const toggleBookmark = useCallback(async (hadithId: number) => {
    if (!isAuthenticated) {
      // Show login message
      alert('Vui lòng đăng nhập để sử dụng chức năng đánh dấu');
      return;
    }
    
    try {
      // Try to find hadith from allHadiths first, then from selectedHadith
      let hadith = allHadiths.find(h => h.id === hadithId);
      if (!hadith && selectedHadith && selectedHadith.id === hadithId) {
        hadith = selectedHadith;
      }
      
      if (!hadith) {
        console.error('Hadith not found for ID:', hadithId);
        return;
      }

      const hadithData = {
        type: 'hadith' as const,
        itemId: hadithId.toString(),
        title: hadith.title || `Hadith ${hadithId}`,
        content: hadith.hadeeth || hadith.title || `Hadith ${hadithId}`,
        category: selectedCategory?.title || 'Unknown',
        metadata: {
          hadithNumber: hadithId.toString()
        }
      };

      const isNowBookmarked = await bookmarkService.toggleBookmark(hadithData);
      
      // Update local state based on result
      setBookmarks(prev => {
        const newBookmarks = isNowBookmarked 
          ? [...prev, hadithId]
          : prev.filter(id => id !== hadithId);
        return newBookmarks;
      });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      if (error instanceof Error && error.message.includes('đăng nhập')) {
        alert(error.message);
      }
    }
  }, [allHadiths, selectedCategory, selectedHadith, isAuthenticated]);

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
                  isAuthenticated={isAuthenticated}
                  loadingBookmarks={loadingBookmarks}
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
        key={`${selectedHadith?.id}-${favorites.length}-${bookmarks.length}`}
        selectedHadith={selectedHadith || null}
        isLoading={hadithDetailLoading}
        favorites={favorites}
        bookmarks={bookmarks}
        isAuthenticated={isAuthenticated}
        loadingBookmarks={loadingBookmarks}
        onClose={() => setSelectedHadithId(null)}
        onToggleFavorite={toggleFavorite}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
});
HadithApp.displayName = 'HadithApp';

export default HadithApp;