// Optimized version of MasjidVietnam component for better mobile performance
import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { devLog } from '@/utils/performance';
import { useOptimisticFavorites } from './hooks/useOptimisticFavorites';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

// Lazy load components for better performance
const SimpleMasjidCard = lazy(() => import('./components/SimpleMasjidCard'));
const MasjidModal = lazy(() => import('./components/MasjidModal'));
const MasjidSearch = lazy(() => import('./components/MasjidSearch'));

// Import types and data
import type { MasjidViet } from './types';
import allMasjidData from './data';

// Loading component
const LoadingCard = memo(() => (
  <div className="bg-card rounded-lg p-4 space-y-3 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
      <div className="w-8 h-8 bg-muted rounded"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 bg-muted rounded w-16"></div>
      <div className="h-6 bg-muted rounded w-20"></div>
    </div>
    <div className="h-3 bg-muted rounded w-full"></div>
    <div className="flex gap-1">
      <div className="w-6 h-6 bg-muted rounded-full"></div>
      <div className="w-6 h-6 bg-muted rounded-full"></div>
      <div className="w-6 h-6 bg-muted rounded-full"></div>
    </div>
  </div>
));

LoadingCard.displayName = 'LoadingCard';

// Main optimized component
const MasjidVietnamOptimized = memo(() => {
  const [masjids, setMasjids] = useState<MasjidViet[]>([]);
  const [filteredMasjids, setFilteredMasjids] = useState<MasjidViet[]>([]);
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidViet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const mobileSettings = { shouldOptimize: false, batchSize: 10 };
  const { loadBatchMasjidData } = useOptimisticFavorites();
  
  // Smooth scroll optimization for mobile
  const { scrollContainerRef, shouldRenderItem } = useSmoothScroll({
    itemHeight: 180, // Approximate card height
    overscan: 2 // Render 2 extra items above/below viewport
  });

  // Load masjids data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        devLog.log('Loading masjids data...');
        
        // Use imported data directly (no async needed for static data)
        const allMasjids = allMasjidData;
        setMasjids(allMasjids);
        setFilteredMasjids(allMasjids);

        // Preload favorite data for first batch (mobile-optimized)
        const firstBatch = allMasjids.slice(0, mobileSettings.batchSize);
        const masjidIds = firstBatch.map((m: MasjidViet) => m.id);
        await loadBatchMasjidData(masjidIds);

        devLog.log(`Loaded ${allMasjids.length} masjids`);
      } catch (error) {
        devLog.error('Error loading masjids:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadBatchMasjidData, mobileSettings.batchSize]);

  // Memoized search handlers
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    
    const filtered = masjids.filter(masjid => {
      const matchesSearch = term === '' || 
        (masjid.ten?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
        (masjid.thanhPho?.toLowerCase().includes(term.toLowerCase()) ?? false) ||
        (masjid.diaChi?.toLowerCase().includes(term.toLowerCase()) ?? false);

      const matchesRegion = selectedRegion === '' || masjid.vung === selectedRegion;

      return matchesSearch && matchesRegion;
    });

    setFilteredMasjids(filtered);
  }, [masjids, selectedRegion]);

  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
    
    const filtered = masjids.filter(masjid => {
      const matchesSearch = searchTerm === '' || 
        (masjid.ten?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (masjid.thanhPho?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (masjid.diaChi?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesRegion = region === '' || masjid.vung === region;

      return matchesSearch && matchesRegion;
    });

    setFilteredMasjids(filtered);
  }, [masjids, searchTerm]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setSelectedRegion('');
    setFilteredMasjids(masjids);
  }, [masjids]);

  // Memoized handlers
  const handleViewDetails = useCallback((masjid: MasjidViet) => {
    setSelectedMasjid(masjid);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMasjid(null);
  }, []);

  // Memoized display count for mobile optimization
  const displayCount = useMemo(() => {
    return mobileSettings.shouldOptimize ? 20 : filteredMasjids.length;
  }, [mobileSettings.shouldOptimize, filteredMasjids.length]);

  const displayedMasjids = useMemo(() => {
    return filteredMasjids.slice(0, displayCount);
  }, [filteredMasjids, displayCount]);

  // Load more function for mobile
  const loadMore = useCallback(() => {
    if (mobileSettings.shouldOptimize && displayCount < filteredMasjids.length) {
      // This would be implemented with intersection observer
      devLog.log('Load more masjids...');
    }
  }, [mobileSettings.shouldOptimize, displayCount, filteredMasjids.length]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Masjid Việt Nam</h1>
          <p className="text-muted-foreground">Đang tải danh sách masjid...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: mobileSettings.shouldOptimize ? 6 : 9 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-6 ${mobileSettings.shouldOptimize ? 'mobile-optimized' : ''}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Masjid Việt Nam</h1>
        <p className="text-muted-foreground">
          Khám phá {masjids.length} masjid trên khắp Việt Nam
        </p>
      </div>

      {/* Search */}
      <Suspense fallback={<div className="h-16 bg-muted rounded-lg animate-pulse mb-6"></div>}>
        <MasjidSearch
          tuKhoa={searchTerm}
          vungDuocChon={selectedRegion}
          soKetQua={filteredMasjids.length}
          onSearchChange={handleSearchChange}
          onRegionChange={handleRegionChange}
          onClearSearch={handleClearSearch}
        />
      </Suspense>

      {/* Results - Optimized scroll container */}
      <div 
        ref={scrollContainerRef}
        className={`
          ${mobileSettings.shouldOptimize 
            ? 'mobile-scroll-container flex flex-col gap-2' 
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          } 
          max-h-[70vh] overflow-y-auto
        `}
      >
        {displayedMasjids.map((masjid, index) => {
          // Virtual scrolling: only render visible items on mobile
          if (mobileSettings.shouldOptimize && !shouldRenderItem(index)) {
            return (
              <div 
                key={masjid.id} 
                style={{ height: '180px' }} 
                className="bg-muted rounded animate-pulse"
              />
            );
          }

          return (
            <Suspense 
              key={masjid.id} 
              fallback={<LoadingCard />}
            >
              <SimpleMasjidCard
                masjid={masjid}
                onViewDetails={handleViewDetails}
                index={index}
              />
            </Suspense>
          );
        })}
      </div>

      {/* Load more indicator for mobile */}
      {mobileSettings.shouldOptimize && displayCount < filteredMasjids.length && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Xem thêm ({filteredMasjids.length - displayCount} masjid)
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredMasjids.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Không tìm thấy masjid nào phù hợp với tìm kiếm của bạn.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedMasjid && (
        <Suspense fallback={null}>
          <MasjidModal
            masjid={selectedMasjid}
            isOpen={!!selectedMasjid}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}
    </div>
  );
});

MasjidVietnamOptimized.displayName = 'MasjidVietnamOptimized';

export default MasjidVietnamOptimized;
