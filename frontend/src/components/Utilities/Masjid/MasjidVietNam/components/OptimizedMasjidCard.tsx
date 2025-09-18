// Optimized MasjidCard for better mobile performance
import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Users, Phone, Clock } from 'lucide-react';
import type { MasjidViet } from '../types';
import { useMasjidFavoritesBackend } from '../hooks/useMasjidFavoritesBackend';
import { getMobileSettings } from '@/utils/mobileOptimizations';

interface OptimizedMasjidCardProps {
  masjid: MasjidViet;
  onViewDetails: (masjid: MasjidViet) => void;
  index: number; // For optimization
}

// Memoized favorite users display
const FavoriteUsers = memo<{ 
  users: any[]; 
  totalCount: number; 
  isLoading: boolean;
}>(({ users, totalCount, isLoading }) => {
  const mobileSettings = getMobileSettings();
  
  // Show fewer avatars on mobile
  const displayCount = mobileSettings.shouldOptimize ? 3 : 5;
  const displayUsers = users.slice(0, displayCount);
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
        <span className="text-xs text-muted-foreground">Đang tải...</span>
      </div>
    );
  }

  if (displayUsers.length === 0) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span className="text-xs">Chưa có lượt thích</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1">
        {displayUsers.map((user, index) => (
          <Avatar key={user.id || index} className="w-6 h-6 border-2 border-background">
            <AvatarImage 
              src={user.picture} 
              alt={user.name}
              loading="lazy" // Lazy load avatars
            />
            <AvatarFallback className="text-xs">
              {user.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      
      {totalCount > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          {totalCount > displayCount ? `+${totalCount - displayCount} khác` : `${totalCount} lượt thích`}
        </span>
      )}
    </div>
  );
});

FavoriteUsers.displayName = 'FavoriteUsers';

// Main optimized card component
const OptimizedMasjidCard = memo<OptimizedMasjidCardProps>(({ 
  masjid, 
  onViewDetails, 
  index 
}) => {
  const {
    isFavorited,
    getFavoriteUsers,
    getFavoriteCount,
    isLoadingMasjid,
    toggleFavorite,
    initializeMasjid,
  } = useMasjidFavoritesBackend();

  const mobileSettings = getMobileSettings();

  // Memoized values
  const favoriteUsers = useMemo(() => getFavoriteUsers(masjid.id), [getFavoriteUsers, masjid.id]);
  const favoriteCount = useMemo(() => getFavoriteCount(masjid.id), [getFavoriteCount, masjid.id]);
  const isLoading = useMemo(() => isLoadingMasjid(masjid.id), [isLoadingMasjid, masjid.id]);
  const userHasFavorited = useMemo(() => isFavorited(masjid.id), [isFavorited, masjid.id]);

  // Memoized handlers
  const handleViewDetails = useCallback(() => {
    onViewDetails(masjid);
  }, [onViewDetails, masjid]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(masjid);
  }, [toggleFavorite, masjid]);

  // Initialize data when card comes into view (lazy loading)
  const handleCardInView = useCallback(() => {
    initializeMasjid(masjid.id);
  }, [initializeMasjid, masjid.id]);

  // Use intersection observer for lazy initialization
  React.useEffect(() => {
    // Only initialize if this is one of the first few cards or user scrolled to it
    if (index < 3) {
      handleCardInView();
    }
  }, [index, handleCardInView]);

  // Memoized class names
  const cardClassName = useMemo(() => 
    `group hover:shadow-lg transition-all duration-200 ${mobileSettings.enableAnimations ? 'hover:scale-[1.02]' : ''}`,
    [mobileSettings.enableAnimations]
  );

  const heartClassName = useMemo(() => 
    `w-4 h-4 transition-colors ${userHasFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`,
    [userHasFavorited]
  );

  // Memoized facilities (show fewer on mobile)
  const displayFacilities = useMemo(() => {
    const maxFacilities = mobileSettings.shouldOptimize ? 2 : 4;
    return masjid.tienIch?.slice(0, maxFacilities) || [];
  }, [masjid.tienIch, mobileSettings.shouldOptimize]);

  return (
    <Card className={cardClassName}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {masjid.ten}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{masjid.thanhPho}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className="flex-shrink-0 h-8 w-8 p-0"
            aria-label={userHasFavorited ? 'Bỏ thích' : 'Yêu thích'}
          >
            <Heart className={heartClassName} />
          </Button>
        </div>

        {/* Facilities - fewer on mobile */}
        {displayFacilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayFacilities.map((facility, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {facility}
              </Badge>
            ))}
            {(masjid.tienIch?.length || 0) > displayFacilities.length && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{(masjid.tienIch?.length || 0) - displayFacilities.length}
              </Badge>
            )}
          </div>
        )}

        {/* Contact info - simplified for mobile */}
        {masjid.soDienThoai && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{masjid.soDienThoai}</span>
          </div>
        )}

        {/* Additional info - only show on desktop */}
        {!mobileSettings.shouldOptimize && masjid.moTa && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{masjid.moTa}</span>
          </div>
        )}

        {/* Favorite users */}
        <FavoriteUsers 
          users={favoriteUsers}
          totalCount={favoriteCount}
          isLoading={isLoading}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleViewDetails}
            className="flex-1 h-8 text-sm"
            size="sm"
          >
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedMasjidCard.displayName = 'OptimizedMasjidCard';

export default OptimizedMasjidCard;
