// MasjidCard Component - Preview card, full details in MasjidSheet
import React from 'react';
import { MapPin, Heart, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MasjidViet } from '../types';
import { REGION_BADGE_COLORS } from '../constants';
import AnimatedFavoriteAvatars from './AnimatedFavoriteAvatars';

interface MasjidCardProps {
  masjid: MasjidViet;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (masjid: MasjidViet) => void;
  onShare?: (masjid: MasjidViet) => void;
  // Backend integration props
  onInitializeMasjid?: (masjidId: string) => void;
  favoriteUsers?: any[];
  favoriteCount?: number;
  isLoadingFavorites?: boolean;
  isPendingSync?: boolean;
}

const MasjidCard: React.FC<MasjidCardProps> = React.memo(({ 
  masjid, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite, 
  onShare,
  onInitializeMasjid: _onInitializeMasjid, // Prefix with _ to indicate intentionally unused
  favoriteUsers = [],
  favoriteCount = 0,
  isPendingSync = false
}) => {
  // Get region badge color with type safety
  const regionBadgeColor = masjid.vung && masjid.vung in REGION_BADGE_COLORS 
    ? REGION_BADGE_COLORS[masjid.vung as keyof typeof REGION_BADGE_COLORS] 
    : REGION_BADGE_COLORS['Tất cả'];

  // PERFORMANCE: Individual card initialization disabled - using batch loading instead
  // This prevents N individual API calls and uses 1 batch call instead

  // Handle action button clicks
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(masjid);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(masjid);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className="w-full overflow-hidden bg-card border-border hover:shadow-luxury transition-smooth cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Image */}
      {masjid.hinhAnh && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={masjid.hinhAnh}
            alt={masjid.ten}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        </div>
      )}

      <CardContent className="p-4">
        {/* Region badge */}
        {masjid.vung && (
          <Badge
            variant="secondary"
            className={cn('text-xs border mb-2', regionBadgeColor)}
          >
            {masjid.vung}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-smooth line-clamp-1">
          {masjid.ten}
        </h3>

        {/* Address */}
        {(masjid.diaChi || masjid.thanhPho) && (
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground line-clamp-2">
              {[masjid.diaChi, masjid.thanhPho].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Favorite avatars */}
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <AnimatedFavoriteAvatars
            favoriteUsers={favoriteUsers}
            totalFavorites={favoriteCount}
            isFavorited={isFavorite}
            isPending={isPendingSync}
            maxDisplay={10}
            size="sm"
            showCount={false}
            masjidName={masjid.ten}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteClick}
                  className={cn(
                    'h-8 w-8 p-0 transition-colors',
                    isFavorite
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                  <span className="sr-only">{isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}</span>
                </Button>
                {favoriteCount > 0 && (
                  <span className="text-xs text-muted-foreground">{favoriteCount}</span>
                )}
              </div>
            )}

            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareClick}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Chia sẻ</span>
              </Button>
            )}
          </div>

          <span className="text-xs text-muted-foreground">Xem chi tiết →</span>
        </div>
      </CardContent>
    </Card>
  );
});

MasjidCard.displayName = 'MasjidCard';

export default MasjidCard;
