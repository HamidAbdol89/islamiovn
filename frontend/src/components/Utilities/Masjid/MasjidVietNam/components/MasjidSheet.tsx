import React from 'react';
import { MapPin, Users, Phone, Calendar, Clock, Globe, ExternalLink, Heart, Share2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { MasjidViet } from '../types';
import { VIETNAMESE_TEXT, REGION_BADGE_COLORS } from '../constants';

interface MasjidSheetProps {
  masjid: MasjidViet | null;
  isOpen: boolean;
  onClose: () => void;
  favoriteUsers?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  favoriteCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (masjid: MasjidViet) => void;
  onShare?: (masjid: MasjidViet) => void;
}

const MasjidSheet: React.FC<MasjidSheetProps> = React.memo(({
  masjid,
  isOpen,
  onClose,
  favoriteUsers = [],
  favoriteCount = 0,
  isFavorite = false,
  onToggleFavorite,
  onShare,
}) => {
  if (!masjid) return null;

  const regionBadgeColor = masjid.vung && masjid.vung in REGION_BADGE_COLORS
    ? REGION_BADGE_COLORS[masjid.vung as keyof typeof REGION_BADGE_COLORS]
    : REGION_BADGE_COLORS['Tất cả'];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DrawerContent className="h-[90vh] max-h-[90vh] flex flex-col lg:max-w-3xl lg:mx-auto">
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
          <DrawerHeader className="px-0 pt-2 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {masjid.vung && (
                  <Badge
                    variant="accent"
                    className={cn('text-sm border mb-3', regionBadgeColor)}
                  >
                    {masjid.vung}
                  </Badge>
                )}
                <DrawerTitle className="text-2xl sm:text-3xl font-bold text-left">
                  {masjid.ten}
                </DrawerTitle>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-6">
            {/* Image */}
            {masjid.hinhAnh && (
              <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden">
                <img
                  src={masjid.hinhAnh}
                  alt={masjid.ten}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              {masjid.diaChi && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-foreground font-medium">{masjid.diaChi}</div>
                    {masjid.thanhPho && (
                      <div className="text-lg font-semibold text-primary">{masjid.thanhPho}</div>
                    )}
                  </div>
                </div>
              )}

              {masjid.sucChua && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    Sức chứa: <span className="font-semibold">{masjid.sucChua}</span> người
                  </span>
                </div>
              )}

              {masjid.soDienThoai && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={`tel:${masjid.soDienThoai}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {masjid.soDienThoai}
                  </a>
                </div>
              )}

              {masjid.namThanhLap && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    Thành lập năm: <span className="font-semibold">{masjid.namThanhLap}</span>
                  </span>
                </div>
              )}

              {masjid.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={masjid.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Prayer Times */}
            {masjid.thoiGianCau && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {VIETNAMESE_TEXT.prayerTimes.title}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(masjid.thoiGianCau).map(([prayer, time]) => (
                      <div key={prayer} className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-sm text-muted-foreground capitalize">
                          {VIETNAMESE_TEXT.prayerTimes[prayer as keyof typeof VIETNAMESE_TEXT.prayerTimes]}
                        </div>
                        <div className="text-lg font-bold text-foreground">{time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            {masjid.moTa && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Mô tả</h3>
                  <p className="text-muted-foreground leading-relaxed">{masjid.moTa}</p>
                </div>
              </>
            )}

            {/* Facilities */}
            {masjid.tienIch && masjid.tienIch.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Tiện ích</h3>
                  <div className="flex flex-wrap gap-2">
                    {masjid.tienIch.map((tienIch, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tienIch}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Favorite Users */}
            {favoriteCount > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Người đã yêu thích ({favoriteCount})
                  </h3>
                  {favoriteUsers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {favoriteUsers.slice(0, 10).map((user) => (
                        <div key={user.id} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-foreground">{user.name}</span>
                        </div>
                      ))}
                      {favoriteUsers.length > 10 && (
                        <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                          <span className="text-sm text-muted-foreground">
                            +{favoriteUsers.length - 10} người khác
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {favoriteCount} người đã yêu thích masjid này
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                {onToggleFavorite && (
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => onToggleFavorite(masjid)}
                  >
                    <Heart className={cn('w-4 h-4 mr-2', isFavorite && 'fill-current')} />
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </Button>
                )}
                {onShare && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onShare(masjid)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {masjid.diaChi && (
                  <Button
                    variant="sacred"
                    onClick={() => {
                      const query = encodeURIComponent(`${masjid.ten} ${masjid.diaChi} ${masjid.thanhPho}`);
                      window.open(`https://www.google.com/maps/search/${query}`, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Xem trên bản đồ
                  </Button>
                )}
                {masjid.soDienThoai && (
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`tel:${masjid.soDienThoai}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi điện
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
});

MasjidSheet.displayName = 'MasjidSheet';

export default MasjidSheet;
