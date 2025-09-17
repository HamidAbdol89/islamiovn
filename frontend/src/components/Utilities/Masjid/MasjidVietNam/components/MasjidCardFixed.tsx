// MasjidCard Component with Vietnamese localization, region colors, favorites, share and user avatars
import React from 'react';
import { MapPin, Users, Phone, Calendar, Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MasjidViet } from '../types';
import { REGION_BADGE_COLORS } from '../constants';
import FavoriteUsersAvatars from './FavoriteUsersAvatars';

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
  isLoadingFavorites = false
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

  return (
    <Card 
      className="overflow-hidden bg-card border-border hover:shadow-luxury transition-smooth cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Image */}
      {masjid.hinhAnh && (
        <div className="h-48 sm:h-56 overflow-hidden">
          <img
            src={masjid.hinhAnh}
            alt={masjid.ten}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        </div>
      )}
      
      <CardContent className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-smooth">
          {masjid.ten}
        </h3>
        
        {/* Address */}
        {masjid.diaChi && (
          <div className="flex items-start mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <div>{masjid.diaChi}</div>
              {masjid.thanhPho && (
                <div className="font-medium text-foreground">{masjid.thanhPho}</div>
              )}
            </div>
          </div>
        )}
        
        {/* Capacity */}
        {masjid.sucChua && (
          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">
              Sức chứa: <span className="font-medium text-foreground">{masjid.sucChua}</span> người
            </span>
          </div>
        )}
        
        {/* Phone */}
        {masjid.soDienThoai && (
          <div className="flex items-center mb-3">
            <Phone className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">{masjid.soDienThoai}</span>
          </div>
        )}
        
        {/* Founded Year */}
        {masjid.namThanhLap && (
          <div className="flex items-center mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">
              Thành lập: <span className="font-medium text-foreground">{masjid.namThanhLap}</span>
            </span>
          </div>
        )}
        
        {/* Description */}
        {masjid.moTa && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {masjid.moTa}
          </p>
        )}
        
        {/* Badges with Region Colors */}
        <div className="flex flex-wrap gap-2 mb-4">
          {masjid.vung && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs border", regionBadgeColor)}
            >
              {masjid.vung}
            </Badge>
          )}
          {masjid.tienIch && masjid.tienIch.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {masjid.tienIch.length} tiện ích
            </Badge>
          )}
        </div>

        {/* Favorite Users Avatars */}
        {(favoriteCount > 0 || isLoadingFavorites) && (
          <div className="mb-3">
            <FavoriteUsersAvatars
              users={favoriteUsers}
              totalCount={favoriteCount}
              isLoading={isLoadingFavorites}
              maxDisplay={4}
              size="sm"
              showCount={true}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className={cn(
                  "h-8 w-8 p-0 transition-colors",
                  isFavorite 
                    ? "text-red-500 hover:text-red-600" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart 
                  className={cn("h-4 w-4", isFavorite && "fill-current")} 
                />
                <span className="sr-only">
                  {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                </span>
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareClick}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Chia sẻ</span>
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Nhấn để xem chi tiết
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MasjidCard.displayName = 'MasjidCard';

export default MasjidCard;
