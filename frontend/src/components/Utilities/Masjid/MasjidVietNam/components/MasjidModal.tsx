// MasjidModal Component with Vietnamese localization and shadcn UI
import React from 'react';
import { MapPin, Phone, Globe, Calendar, Users, Clock, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { MasjidViet } from '../types';
import { VIETNAMESE_TEXT, DEFAULT_IMAGE } from '../constants';
import { formatText, formatNumber } from '../utils';

interface MasjidModalProps {
  masjid: MasjidViet | null;
  isOpen: boolean;
  onClose: () => void;
}

const MasjidModal: React.FC<MasjidModalProps> = React.memo(({ masjid, isOpen, onClose }) => {
  const sucChuaText = React.useMemo(() => {
    if (!masjid?.sucChua) return null;
    return formatText(VIETNAMESE_TEXT.card.capacity, { 
      count: formatNumber(masjid.sucChua) 
    });
  }, [masjid?.sucChua]);

  const namThanhLapText = React.useMemo(() => {
    if (!masjid?.namThanhLap) return null;
    return formatText(VIETNAMESE_TEXT.card.established, { 
      year: masjid.namThanhLap.toString() 
    });
  }, [masjid?.namThanhLap]);

  const thoiGianCauEntries = React.useMemo(() => {
    if (!masjid?.thoiGianCau) return [];
    return Object.entries(masjid.thoiGianCau).filter(([_, time]) => time);
  }, [masjid?.thoiGianCau]);

  if (!masjid) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-6">
          <img 
            src={masjid.hinhAnh || DEFAULT_IMAGE} 
            alt={masjid.ten || 'Masjid'}
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 bg-background/90 hover:bg-background border-border"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground mb-4">
            {masjid.ten}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            {/* Address */}
            {(masjid.diaChi || masjid.thanhPho) && (
              <div className="flex items-start text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  {masjid.diaChi && <p>{masjid.diaChi}</p>}
                  {masjid.thanhPho && masjid.vung && (
                    <p>{masjid.thanhPho}, {masjid.vung}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Phone */}
            {masjid.soDienThoai && (
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-5 h-5 mr-3" />
                <a 
                  href={`tel:${masjid.soDienThoai}`} 
                  className="hover:text-primary transition-colors"
                >
                  {masjid.soDienThoai}
                </a>
              </div>
            )}
            
            {/* Website */}
            {masjid.website && (
              <div className="flex items-center text-muted-foreground">
                <Globe className="w-5 h-5 mr-3" />
                <a 
                  href={masjid.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {VIETNAMESE_TEXT.modal.website}
                </a>
              </div>
            )}
            
            {/* Capacity */}
            {sucChuaText && (
              <div className="flex items-center text-muted-foreground">
                <Users className="w-5 h-5 mr-3" />
                <span>{sucChuaText}</span>
              </div>
            )}
            
            {/* Established Year */}
            {namThanhLapText && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-5 h-5 mr-3" />
                <span>{namThanhLapText}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          {masjid.moTa && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {VIETNAMESE_TEXT.modal.description}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {masjid.moTa}
              </p>
            </div>
          )}
          
          {/* Prayer Times */}
          {thoiGianCauEntries.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {VIETNAMESE_TEXT.modal.prayerTimes}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {thoiGianCauEntries.map(([prayer, time]) => (
                  <Card key={prayer} className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 mr-1 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground capitalize mb-1">
                        {VIETNAMESE_TEXT.prayers[prayer as keyof typeof VIETNAMESE_TEXT.prayers] || prayer}
                      </div>
                      <div className="font-bold text-primary text-sm">
                        {time}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Facilities */}
          {masjid.tienIch && masjid.tienIch.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {VIETNAMESE_TEXT.modal.facilities}
              </h3>
              <div className="flex flex-wrap gap-2">
                {masjid.tienIch.map((tienIch, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {tienIch}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

MasjidModal.displayName = 'MasjidModal';

export default MasjidModal;
