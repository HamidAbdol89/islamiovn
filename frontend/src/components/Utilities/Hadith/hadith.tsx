import { useEffect, useMemo, useCallback, memo } from 'react';

import { useCategories, useHadithDetail, useBatchHadiths } from './hooks';
import { useAuth } from '@/hooks/useAuth';
import { useHadithStore } from '@/stores/hadithStore';
import { useUiStore } from '@/stores/uiStore';
import { useHadithActions } from '@/hooks/useHadithActions';
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
  const { isAuthenticated } = useAuth();
  const { toggleFavoriteOptimistic, toggleBookmarkOptimistic } = useHadithActions();

  const favorites = useHadithStore((s) => s.favorites);
  const bookmarks = useHadithStore((s) => s.bookmarks);
  const hydratedUserId = useHadithStore((s) => s.hydratedUserId);
  const loadingBookmarks = isAuthenticated && hydratedUserId === null;

  const selectedCategoryId = useUiStore((s) => s.hadithSelectedCategoryId);
  const selectedHadithId = useUiStore((s) => s.hadithSelectedHadithId);
  const currentPage = useUiStore((s) => s.hadithCurrentPage);
  const setHadithSelectedCategoryId = useUiStore((s) => s.setHadithSelectedCategoryId);
  const setHadithSelectedHadithId = useUiStore((s) => s.setHadithSelectedHadithId);
  const setHadithCurrentPage = useUiStore((s) => s.setHadithCurrentPage);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();
  const { data: selectedHadith, isLoading: hadithDetailLoading } =
    useHadithDetail(selectedHadithId);

  const selectedCategory = useMemo(
    () => categories?.find((c) => c.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  const {
    hadiths: allHadiths,
    isLoading: isLoadingHadiths,
    error: hadithsError,
    loadAllHadiths,
  } = useBatchHadiths();

  useEffect(() => {
    if (selectedCategory) {
      loadAllHadiths(selectedCategory.id);
    }
  }, [selectedCategory, loadAllHadiths]);

  const HADITHS_PER_PAGE = 20;
  const totalHadiths = allHadiths.length;
  const totalPages = Math.ceil(totalHadiths / HADITHS_PER_PAGE);

  const displayHadiths = useMemo(() => {
    const startIndex = (currentPage - 1) * HADITHS_PER_PAGE;
    const endIndex = startIndex + HADITHS_PER_PAGE;
    return allHadiths.slice(startIndex, endIndex);
  }, [allHadiths, currentPage]);

  const loading = categoriesLoading || isLoadingHadiths;
  const error = categoriesError?.message || hadithsError || null;

  const handleCategorySelect = useCallback(
    (category: Category) => {
      setHadithSelectedCategoryId(category.id);
      setHadithSelectedHadithId(null);
      setHadithCurrentPage(1);
    },
    [setHadithSelectedCategoryId, setHadithSelectedHadithId, setHadithCurrentPage]
  );

  const handleHadithSelect = useCallback(
    (hadith: HadithSummary) => {
      setHadithSelectedHadithId(hadith.id);
    },
    [setHadithSelectedHadithId]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setHadithCurrentPage(page);
    },
    [setHadithCurrentPage]
  );

  const resolveHadith = useCallback(
    (normalizedHadithId: number) => {
      let hadith = allHadiths.find((h) => Number(h.id) === normalizedHadithId);
      if (
        !hadith &&
        selectedHadith &&
        Number(selectedHadith.id) === normalizedHadithId
      ) {
        hadith = selectedHadith;
      }
      return hadith;
    },
    [allHadiths, selectedHadith]
  );

  const toggleFavorite = useCallback(
    async (hadithId: number | string) => {
      const normalizedHadithId = Number(hadithId);

      if (Number.isNaN(normalizedHadithId)) return;

      if (!isAuthenticated) {
        alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
        return;
      }

      const hadith = resolveHadith(normalizedHadithId);
      if (!hadith) return;

      const ok = await toggleFavoriteOptimistic(normalizedHadithId, {
        type: 'hadith',
        itemId: normalizedHadithId.toString(),
        title: hadith.title || `Hadith ${normalizedHadithId}`,
        content: hadith.hadeeth || hadith.title || `Hadith ${normalizedHadithId}`,
        metadata: {
          category: selectedCategory?.title || 'Unknown',
          hadithNumber: normalizedHadithId.toString(),
        },
      });

      if (!ok) {
        console.error('Failed to toggle favorite');
      }
    },
    [isAuthenticated, resolveHadith, selectedCategory, toggleFavoriteOptimistic]
  );

  const toggleBookmark = useCallback(
    async (hadithId: number | string) => {
      const normalizedHadithId = Number(hadithId);

      if (Number.isNaN(normalizedHadithId)) return;

      if (!isAuthenticated) {
        alert('Vui lòng đăng nhập để sử dụng chức năng đánh dấu');
        return;
      }

      const hadith = resolveHadith(normalizedHadithId);
      if (!hadith) return;

      const ok = await toggleBookmarkOptimistic(normalizedHadithId, {
        type: 'hadith',
        itemId: normalizedHadithId.toString(),
        title: hadith.title || `Hadith ${normalizedHadithId}`,
        content: hadith.hadeeth || hadith.title || `Hadith ${normalizedHadithId}`,
        category: selectedCategory?.title || 'Unknown',
        metadata: {
          hadithNumber: normalizedHadithId.toString(),
        },
      });

      if (!ok) {
        console.error('Failed to toggle bookmark');
      }
    },
    [isAuthenticated, resolveHadith, selectedCategory, toggleBookmarkOptimistic]
  );

  const goBack = useCallback(() => {
    if (selectedHadithId) {
      setHadithSelectedHadithId(null);
    } else if (selectedCategoryId) {
      setHadithSelectedCategoryId(null);
    }
  }, [
    selectedHadithId,
    selectedCategoryId,
    setHadithSelectedHadithId,
    setHadithSelectedCategoryId,
  ]);

  const retryCategories = useCallback(() => {
    refetchCategories();
  }, [refetchCategories]);

  if (error && !loading) {
    return <ErrorDisplay error={error} onRetry={retryCategories} />;
  }

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
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
              {displayHadiths.map((hadith) => (
                <HadithCard
                  key={hadith.id}
                  hadith={hadith}
                  isFavorite={favorites.includes(Number(hadith.id))}
                  isBookmarked={bookmarks.includes(Number(hadith.id))}
                  isAuthenticated={isAuthenticated}
                  loadingBookmarks={loadingBookmarks}
                  onClick={handleHadithSelect}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {totalHadiths > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {displayHadiths.length} trong tổng số {totalHadiths}{' '}
                  hadith
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
        onClose={() => setHadithSelectedHadithId(null)}
        onToggleFavorite={toggleFavorite}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
});
HadithApp.displayName = 'HadithApp';

export default HadithApp;
