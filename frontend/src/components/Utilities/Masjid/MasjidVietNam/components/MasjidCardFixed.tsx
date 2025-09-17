// MasjidCard Component with Vietnamese localization, region colors and shadcn UI
import React from 'react';
import { MapPin, Users, Phone, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MasjidViet } from '../types';
import { REGION_BADGE_COLORS } from '../constants';

interface MasjidCardProps {
  masjid: MasjidViet;
  onClick: () => void;
}

const MasjidCard: React.FC<MasjidCardProps> = React.memo(({ masjid, onClick }) => {
  // Get region badge color with type safety
  const regionBadgeColor = masjid.vung && masjid.vung in REGION_BADGE_COLORS 
    ? REGION_BADGE_COLORS[masjid.vung as keyof typeof REGION_BADGE_COLORS] 
    : REGION_BADGE_COLORS['Tất cả'];

  return (
    <Card 
      className="overflow-hidden bg-card border-border hover:shadow-luxury transition-smooth cursor-pointer group"
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
        <div className="flex flex-wrap gap-2">
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
      </CardContent>
    </Card>
  );
});

MasjidCard.displayName = 'MasjidCard';

export default MasjidCard;
