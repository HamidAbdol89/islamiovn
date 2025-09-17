// Refactored MasjidVietnam Component with Vietnamese localization, shadcn UI, and React best practices
import React, { useState, useCallback, useMemo } from 'react';
import type { MasjidViet } from './types';
import { useMasjidData, useMasjidSearch } from './hooks';
import {
  MasjidHeader,
  MasjidSearch,
  MasjidCard,
  MasjidSheet,
  EmptyState,
  LoadingState
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

  // Memoized values
  const hasActiveFilters = useMemo(() => {
    return thongKeTimKiem.hasSearch || thongKeTimKiem.hasRegionFilter;
  }, [thongKeTimKiem.hasSearch, thongKeTimKiem.hasRegionFilter]);

  const isModalOpen = useMemo(() => {
    return masjidDuocChon !== null;
  }, [masjidDuocChon]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <MasjidHeader tongSoMasjid={statistics.total} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <MasjidHeader tongSoMasjid={statistics.total} />

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
