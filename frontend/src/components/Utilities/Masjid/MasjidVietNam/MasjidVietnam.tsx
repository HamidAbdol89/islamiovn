// Enhanced MasjidVietnam Component with favorites, share, skeleton loading, and analytics
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import type { MasjidViet } from './types';
import { 
  useMasjidData, 
  useMasjidSearch, 
  useShare, 
  // usePullToRefresh, // Removed - no longer needed
  useSearchAnalytics,
  // useMasjidFavoritesBackend, // Replaced with optimistic version
  useOptimisticFavorites
  // useMobileFriendlyRefresh // Removed - no longer needed
} from './hooks';
import {
  MasjidHeader,
  MasjidSearch,
  MasjidCard,
  MasjidSheet,
  EmptyState,
  MasjidSkeletonGrid,
} from './components';

const MasjidVietnamDirectory: React.FC = React.memo(() => {
  // State management
  const [masjidDuocChon, setMasjidDuocChon] = useState<MasjidViet | null>(null);
  const [isLoading] = useState(false); // For future API integration

  // Custom hooks
  const { filterMasjids, statistics } = useMasjidData();
  const {
    trangThaiTimKiem,
    ketQuaTimKiem,
    thongKeTimKiem,
    handleSearchChange,
    handleRegionChange,
    clearSearch
  } = useMasjidSearch(filterMasjids);
  
  // 🚀 Optimistic favorites hook with instant UI updates
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
  const { shareMasjid } = useShare();
  
  // Analytics hook
  const { trackSearch } = useSearchAnalytics();
  
  // Refresh functionality removed - no longer needed for smooth scrolling

  // Event handlers
  const handleMasjidClick = useCallback((masjid: MasjidViet) => {
    setMasjidDuocChon(masjid);
  }, []);

  const handleCloseModal = useCallback(() => {
    setMasjidDuocChon(null);
  }, []);

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

  // Handle share
  const handleShare = useCallback(async (masjid: MasjidViet) => {
    const result = await shareMasjid(masjid);
    
    if (result.success) {
      const message = result.method === 'native' 
        ? 'Đã chia sẻ thành công' 
        : 'Đã sao chép thông tin vào clipboard';
      
      toast.success(message, {
        duration: 2000,
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

  const isModalOpen = useMemo(() => {
    return masjidDuocChon !== null;
  }, [masjidDuocChon]);

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
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto relative">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {thongKeTimKiem.isEmpty ? (
          <EmptyState
            onClearSearch={handleClearSearch}
            hasActiveFilters={hasActiveFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Sheet */}
      <MasjidSheet
        masjid={masjidDuocChon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
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
