import React from 'react';
import { MapPin, Navigation, Clock, Star, Phone, ExternalLink, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MasjidModalProps } from '../types';
import { VIETNAMESE_TEXT, MAP_URLS } from '../constants';

/**
 * Modal component để hiển thị chi tiết Masjid với Vietnamese UI
 */
const MasjidModal = React.memo<MasjidModalProps>(({ 
  masjid, 
  onClose, 
  onGetDirections, 
  onOpenInApp,
  viTriNguoiDung: _ 
}) => {
  const handleDirectionsClick = React.useCallback(() => {
    if (masjid) {
      onGetDirections(masjid);
    }
  }, [masjid, onGetDirections]);

  const handleAppClick = React.useCallback((app: string) => {
    if (masjid) {
      onOpenInApp(masjid, app);
    }
  }, [masjid, onOpenInApp]);

  const handleShare = React.useCallback(async () => {
    if (!masjid) return;

    const shareText = `${masjid.ten}\n${masjid.diaChi}\n${MAP_URLS.openStreetMap(masjid.lat, masjid.lng)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: masjid.ten,
          text: `${masjid.ten} - ${masjid.diaChi}`,
          url: MAP_URLS.openStreetMap(masjid.lat, masjid.lng)
        });
      } catch (error) {
        console.log('Chia sẻ bị hủy');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert(VIETNAMESE_TEXT.daSaoChep);
      } catch (error) {
        console.error('Không thể sao chép:', error);
      }
    }
  }, [masjid]);

  if (!masjid) return null;

  return (
    <Dialog open={!!masjid} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground pr-8">
            {masjid.ten}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Địa chỉ */}
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.diaChi}</p>
              <p className="text-sm text-muted-foreground">{masjid.diaChi}</p>
            </div>
          </div>

          {/* Khoảng cách */}
          <div className="flex items-center space-x-3">
            <Navigation className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.khoangCach}</p>
              <p className="text-sm text-muted-foreground">
                {masjid.khoangCach.toFixed(1)} {VIETNAMESE_TEXT.kmTuViTriBan}
              </p>
            </div>
          </div>

          {/* Số điện thoại */}
          {masjid.soDienThoai && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.soDienThoai}</p>
                <a 
                  href={`tel:${masjid.soDienThoai}`}
                  className="text-sm text-primary hover:underline"
                >
                  {masjid.soDienThoai}
                </a>
              </div>
            </div>
          )}

          {/* Giờ mở cửa */}
          {masjid.gioMoCua && (
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.gioMoCua}</p>
                <p className="text-sm text-muted-foreground">{masjid.gioMoCua}</p>
              </div>
            </div>
          )}

          {/* Website */}
          {masjid.website && (
            <div className="flex items-center space-x-3">
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.website}</p>
                <a 
                  href={masjid.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {masjid.website}
                </a>
              </div>
            </div>
          )}

          {/* Đánh giá */}
          {masjid.danhGia && (
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <div>
                <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.danhGia}</p>
                <p className="text-sm text-muted-foreground">
                  {masjid.danhGia}/5 {VIETNAMESE_TEXT.sao}
                </p>
              </div>
            </div>
          )}

          {/* Tiện nghi */}
          {masjid.tienNghi && masjid.tienNghi.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{VIETNAMESE_TEXT.tienNghi}</p>
              <div className="flex flex-wrap gap-2">
                {masjid.tienNghi.map((tienNghi, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    {tienNghi}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tọa độ */}
          <Separator />
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              {VIETNAMESE_TEXT.toaDo}: {masjid.lat.toFixed(6)}, {masjid.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleDirectionsClick}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth flex items-center justify-center space-x-2"
          >
            <Navigation className="h-5 w-5" />
            <span>{VIETNAMESE_TEXT.layHuongDanOpenStreetMap}</span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleAppClick('apple')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <span>🍎</span>
              <span>{VIETNAMESE_TEXT.banDoApple}</span>
            </Button>

            <Button
              onClick={() => handleAppClick('waze')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <span>🚗</span>
              <span>{VIETNAMESE_TEXT.waze}</span>
            </Button>
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span>{VIETNAMESE_TEXT.chia_se}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

MasjidModal.displayName = 'MasjidModal';

export default MasjidModal;
