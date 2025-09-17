import React from 'react';
import { MapPin, Navigation, Clock, Star, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type MasjidCardProps } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

/**
 * Card component cho từng Masjid với Vietnamese UI và shadcn components
 */
const MasjidCard = React.memo<MasjidCardProps>(({ 
  masjid, 
  duocChon, 
  onClick, 
  onGetDirections 
}) => {
  const handleDirectionsClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onGetDirections(masjid);
  }, [masjid, onGetDirections]);

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
        duocChon 
          ? 'border-primary shadow-luxury' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 pr-2">
            {masjid.ten}
            {duocChon && (
              <span className="ml-2 text-primary">●</span>
            )}
          </h3>
          {masjid.danhGia && (
            <div className="flex items-center space-x-1 text-yellow-500 flex-shrink-0">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{masjid.danhGia}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {masjid.diaChi}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {masjid.khoangCach.toFixed(1)} km
            </span>
          </div>

          {masjid.gioMoCua && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {masjid.gioMoCua}
              </span>
            </div>
          )}

          {masjid.soDienThoai && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {masjid.soDienThoai}
              </span>
            </div>
          )}

          {masjid.tienNghi && masjid.tienNghi.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {masjid.tienNghi.slice(0, 2).map((tienNghi, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary"
                >
                  {tienNghi}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleDirectionsClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
        >
          {VIETNAMESE_TEXT.layHuongDan}
        </Button>
      </CardContent>
    </Card>
  );
});

MasjidCard.displayName = 'MasjidCard';

export default MasjidCard;
