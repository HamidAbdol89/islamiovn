// Enhanced MasjidVietnam Component with deep linking support
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from '@/lib/toast';
import type { MasjidViet } from './types';
import { 
  useMasjidData, 
  useMasjidSearch, 
  useShare, 
  useSearchAnalytics,
  useOptimisticFavoritesEnterprise
} from './hooks';
import {
  MasjidHeader,
  MasjidSearch,
  MasjidCard,
  EmptyState,
  MasjidSkeletonGrid,
  MasjidSheet
} from './components';
import EnterpriseStatusPanel from './components/EnterpriseStatusPanel';

const MasjidVietnamDirectory: React.FC = React.memo(() => {
  // State management
  const [isLoading] = useState(false); 
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidViet | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
  
  // 🚀 ENTERPRISE FAVORITES HOOK with advanced features
  const {
    isFavorited,
    toggleFavorite,
    totalUserFavorites,
    initializeMasjid,
    getFavoriteUsers,
    getFavoriteCount,
    isLoadingMasjid,
    isPendingSync,
    loadBatchMasjidData,
    // Enterprise features (available but not used yet)
    getSyncStatus,
    getRecentActivity,
    analyticsTracker,
    isOnline
  } = useOptimisticFavoritesEnterprise();

  // Simple share functionality
  const { shareMasjid } = useShare();
  
  // Analytics hook
  const { trackSearch } = useSearchAnalytics();

  // Event handlers
  const handleMasjidClick = useCallback((masjid: MasjidViet) => {
    setSelectedMasjid(masjid);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  
    // Delay xoá data sau khi anim close chạy xong
    setTimeout(() => {
      setSelectedMasjid(null);
    }, 300); // 300ms = duration anim của Radix/Tailwind
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

  // Navigation tracking is now handled by NavigationProvider

  // Simple share handler
  const handleShare = useCallback(async (masjid: MasjidViet) => {
    const result = await shareMasjid(masjid);
    
    if (result.success) {
      const message = result.method === 'native' 
        ? '🔗 Đã chia sẻ thành công' 
        : '📋 Đã sao chép link vào clipboard';
      
      toast.success(message, {
        description: 'Bạn có thể chia sẻ link này với bạn bè',
        duration: 2000,
      });
    } else {
      toast.error('❌ Không thể chia sẻ', {
        description: result.error || 'Vui lòng thử lại',
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
        <div className="flex gap-6">
          {/* Masjid Grid */}
          <div className="flex-1">
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

          {/* 🚀 ENTERPRISE STATUS PANEL - Desktop only */}
          <div className="hidden xl:block w-80">
            <div className="sticky top-4">
              <EnterpriseStatusPanel
                getSyncStatus={getSyncStatus}
                getRecentActivity={getRecentActivity}
                analyticsTracker={analyticsTracker}
                isOnline={isOnline}
                selectedMasjidId={selectedMasjid?.id}
              />
            </div>
          </div>
        </div>
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