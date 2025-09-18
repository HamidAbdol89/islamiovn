// Enhanced MasjidVietnam Component with deep linking support
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import type { MasjidViet } from './types';
import { 
  useMasjidData, 
  useMasjidSearch, 
  useShare, 
  useSearchAnalytics,
  useOptimisticFavorites
} from './hooks';
import {
  MasjidHeader,
  MasjidSearch,
  MasjidCard,
  EmptyState,
  MasjidSkeletonGrid,
  MasjidSheet
} from './components';

const MasjidVietnamDirectory: React.FC = React.memo(() => {
  // State management
  const [isLoading] = useState(false); 
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidViet | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Custom hooks
  const { filterMasjids, statistics, masjidData } = useMasjidData();
  const {
    trangThaiTimKiem,
    ketQuaTimKiem,
    thongKeTimKiem,
    handleSearchChange,
    handleRegionChange,
    clearSearch
  } = useMasjidSearch(filterMasjids);
  
  const {
    isFavorited,
    toggleFavorite,
    totalUserFavorites,
    initializeMasjid,
    getFavoriteUsers,
    getFavoriteCount,
    isLoadingMasjid,
    isPendingSync,
    loadBatchMasjidData
  } = useOptimisticFavorites();

  // Helper function to find masjid by ID
  const findMasjidById = useCallback((masjidId: string) => {
    return masjidData.find(masjid => masjid.id === masjidId);
  }, [masjidData]);

  // Handle deep linking when masjid is selected from URL
  const handleMasjidDeepLink = useCallback((masjidId: string) => {
    const masjid = findMasjidById(masjidId);
    if (masjid) {
      setSelectedMasjid(masjid);
      setIsSheetOpen(true);
      
      // Optional: Show toast notification
      toast.info(`Mở thông tin ${masjid.ten}`, {
        duration: 2000,
      });
    } else {
      toast.error('Không tìm thấy masjid', {
        duration: 3000,
      });
    }
  }, [findMasjidById]);

  // Enhanced useShare with deep linking
  const { 
    shareMasjid, 
    updateUrlWithMasjid, 
    clearMasjidFromUrl 
  } = useShare({
    onMasjidSelect: handleMasjidDeepLink
  });
  
  // Analytics hook
  const { trackSearch } = useSearchAnalytics();

  // Event handlers
  const handleMasjidClick = useCallback((masjid: MasjidViet) => {
    setSelectedMasjid(masjid);
    setIsSheetOpen(true);
    
    // Update URL with masjid ID for sharing
    updateUrlWithMasjid(masjid.id);
  }, [updateUrlWithMasjid]);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    
    // Clear masjid from URL when closing
    clearMasjidFromUrl();
  
    // Delay removing data after animation completes
    setTimeout(() => {
      setSelectedMasjid(null);
    }, 300);
  }, [clearMasjidFromUrl]);

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  // Track search when results change
  useEffect(() => {
    if (trangThaiTimKiem.tuKhoa) {
      trackSearch(
        trangThaiTimKiem.tuKhoa,
        trangThaiTimKiem.vungDuocChon,
        thongKeTimKiem.total
      );
    }
  }, [trangThaiTimKiem.tuKhoa, trangThaiTimKiem.vungDuocChon, thongKeTimKiem.total, trackSearch]);

  // PERFORMANCE: Batch load favorite data when search results change
  useEffect(() => {
    if (ketQuaTimKiem.length > 0) {
      const masjidIds = ketQuaTimKiem.map(masjid => masjid.id);
      loadBatchMasjidData(masjidIds);
    }
  }, [ketQuaTimKiem, loadBatchMasjidData]);

  // Handle favorites
  const handleToggleFavorite = useCallback((masjid: MasjidViet) => {
    toggleFavorite(masjid);
  }, [toggleFavorite]);

  // Enhanced share handler
  const handleShare = useCallback(async (masjid: MasjidViet) => {
    const result = await shareMasjid(masjid);
    
    if (result.success) {
      const message = result.method === 'native' 
        ? 'Đã chia sẻ thành công' 
        : 'Đã sao chép link masjid vào clipboard';
      
      toast.success(message, {
        description: 'Người khác có thể nhấn vào link để xem thông tin masjid',
        duration: 3000,
      });
    } else {
      toast.error(result.error || 'Không thể chia sẻ', {
        duration: 3000,
      });
    }
  }, [shareMasjid]);

  // Memoized values
  const hasActiveFilters = useMemo(() => {
    return thongKeTimKiem.hasSearch || thongKeTimKiem.hasRegionFilter;
  }, [thongKeTimKiem.hasSearch, thongKeTimKiem.hasRegionFilter]);

  // Render loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <MasjidHeader tongSoMasjid={statistics.total} favoritesCount={totalUserFavorites} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MasjidSkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-background transition-colors duration-300 overflow-y-auto relative">
      {/* Header */}
      <MasjidHeader tongSoMasjid={statistics.total} favoritesCount={totalUserFavorites} />

      {/* Search & Filters */}
      <MasjidSearch
        tuKhoa={trangThaiTimKiem.tuKhoa}
        vungDuocChon={trangThaiTimKiem.vungDuocChon}
        soKetQua={thongKeTimKiem.total}
        onSearchChange={handleSearchChange}
        onRegionChange={handleRegionChange}
        onClearSearch={handleClearSearch}
      />

      {/* Main Content */}
      <div className="px-2 sm:px-4 lg:px-6 pb-6">
        {thongKeTimKiem.isEmpty ? (
          <EmptyState
            onClearSearch={handleClearSearch}
            hasActiveFilters={hasActiveFilters}
          />
        ) : (
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ketQuaTimKiem.map(masjid => (
              <MasjidCard
                key={masjid.id}
                masjid={masjid}
                onClick={() => handleMasjidClick(masjid)}
                isFavorite={isFavorited(masjid.id)}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
                onInitializeMasjid={initializeMasjid}
                favoriteUsers={getFavoriteUsers(masjid.id)}
                favoriteCount={getFavoriteCount(masjid.id)}
                isLoadingFavorites={isLoadingMasjid(masjid.id)}
                isPendingSync={isPendingSync(masjid.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Masjid Detail Sheet with Enhanced Sharing */}
      <MasjidSheet 
        masjid={selectedMasjid}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
});

MasjidVietnamDirectory.displayName = 'MasjidVietnamDirectory';

// Main export component
const MasjidVietnamApp: React.FC = React.memo(() => {
  return <MasjidVietnamDirectory />;
});

MasjidVietnamApp.displayName = 'MasjidVietnamApp';

export default MasjidVietnamApp;