// Ultra-simplified MasjidCard for smooth mobile scrolling
import { memo, useCallback, useMemo } from 'react';
import { Heart, MapPin, Users } from 'lucide-react';
import type { MasjidViet } from '../types';
import { getMobileSettings } from '@/utils/mobileOptimizations';

interface SimpleMasjidCardProps {
  masjid: MasjidViet;
  onViewDetails: (masjid: MasjidViet) => void;
  index: number;
}

// Ultra-simple favorite display (no avatars to reduce complexity)
const SimpleFavoriteCount = memo<{ 
  count: number; 
  isLoading: boolean;
}>(({ count, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Users className="w-3 h-3" />
      <span>{count > 0 ? `${count} lượt thích` : 'Chưa có lượt thích'}</span>
    </div>
  );
});

SimpleFavoriteCount.displayName = 'SimpleFavoriteCount';

// Main ultra-simple card component
const SimpleMasjidCard = memo<SimpleMasjidCardProps>(({ 
  masjid, 
  onViewDetails, 
  index 
}) => {
  // TODO: Replace with useOptimisticFavorites when needed
  // For now, using dummy values to prevent errors
  const isFavorited = (_id: string) => false;
  // const getFavoriteUsers = (_id: string) => []; // Not used in SimpleMasjidCard
  const getFavoriteCount = (_id: string) => 0;
  const isLoadingMasjid = (_id: string) => false;
  const toggleFavorite = (_masjid: any) => {};
  const initializeMasjid = (_id: string) => {};

  const mobileSettings = getMobileSettings();

  // Memoized values (minimal)
  const favoriteCount = useMemo(() => getFavoriteCount(masjid.id), [getFavoriteCount, masjid.id]);
  const isLoading = useMemo(() => isLoadingMasjid(masjid.id), [isLoadingMasjid, masjid.id]);
  const userHasFavorited = useMemo(() => isFavorited(masjid.id), [isFavorited, masjid.id]);

  // Simplified handlers (no complex logic)
  const handleViewDetails = useCallback(() => {
    onViewDetails(masjid);
  }, [onViewDetails, masjid]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toggleFavorite(masjid);
  }, [toggleFavorite, masjid]);

  // Initialize only first few cards immediately
  useMemo(() => {
    if (index < 5) {
      initializeMasjid(masjid.id);
    }
  }, [index, initializeMasjid, masjid.id]);

  // Ultra-simple styling (no complex transitions)
  const cardStyle = useMemo(() => ({
    // Use inline styles for better performance on mobile
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    // NO transitions, transforms, or complex animations
  }), []);

  const heartStyle = useMemo(() => ({
    color: userHasFavorited ? '#ef4444' : 'var(--muted-foreground)',
    fill: userHasFavorited ? '#ef4444' : 'none',
    transition: 'none', // Remove all transitions
  }), [userHasFavorited]);

  // Show only essential facilities on mobile
  const essentialFacilities = useMemo(() => {
    if (!mobileSettings.shouldOptimize || !masjid.tienIch) return [];
    return masjid.tienIch.slice(0, 1); // Only show 1 facility on mobile
  }, [masjid.tienIch, mobileSettings.shouldOptimize]);

  return (
    <div 
      style={cardStyle}
      onClick={handleViewDetails}
      className="mobile-card select-none scroll-optimized" // Use optimized CSS classes
    >
      {/* Header - simplified */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1 text-foreground">
            {masjid.ten}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{masjid.thanhPho}</span>
          </div>
        </div>
        
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="flex-shrink-0 p-1 rounded"
          style={{ background: 'none', border: 'none' }}
          aria-label={userHasFavorited ? 'Bỏ thích' : 'Yêu thích'}
        >
          <Heart 
            className="w-4 h-4" 
            style={heartStyle}
          />
        </button>
      </div>

      {/* Essential facilities only */}
      {essentialFacilities.length > 0 && (
        <div className="mb-2">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
            {essentialFacilities[0]}
            {(masjid.tienIch?.length || 0) > 1 && ` +${(masjid.tienIch?.length || 0) - 1}`}
          </span>
        </div>
      )}

      {/* Favorite count - no avatars */}
      <SimpleFavoriteCount 
        count={favoriteCount}
        isLoading={isLoading}
      />

      {/* Simple action button */}
      <div className="mt-2">
        <button
          onClick={handleViewDetails}
          className="w-full text-xs py-1.5 px-3 bg-primary text-primary-foreground rounded"
          style={{ 
            border: 'none',
            transition: 'none' // No transitions
          }}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
});

SimpleMasjidCard.displayName = 'SimpleMasjidCard';

export default SimpleMasjidCard;
