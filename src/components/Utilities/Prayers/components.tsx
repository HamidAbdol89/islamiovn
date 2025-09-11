// src/components/Utilities/Prayers/components.tsx

import React from 'react';
import { MapPin, Settings, Compass, Info } from 'lucide-react';
import type { Location, PrayerTimes } from './types';
import { INTERNATIONAL_LOCATIONS, CALCULATION_METHODS, PRAYER_NAMES_VIETNAMESE, PRAYER_ICONS } from './constants';

// Import các component từ shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Định nghĩa ảnh nền cho từng giờ cầu nguyện
const prayerBackgrounds: Record<string, string> = {
  Fajr: "/images/praytime/fajr.webp",
  Dhuhr: "/images/praytime/dhuhr.jpg", 
  Asr: "/images/praytime/asr.jpg",
  Maghrib: "/images/praytime/maghrib.jpg",
  Isha: "/images/praytime/isha.jpg",
  default: "/images/makkah/makkah1.webp" // Ảnh mặc định
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, description }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-w-[calc(100%-1rem)] mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface HeaderProps {
  selectedLocation: Location;
  isLoadingLocation: boolean;
  onSettingsPress: () => void;
  onInfoPress: () => void;
  onBackPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLocation,
  isLoadingLocation,
  onSettingsPress,
  onInfoPress,
  onBackPress
}) => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b">
      <div className="flex justify-between items-center px-4 py-3 gap-2">
        <Button variant="ghost" size="icon" onClick={onBackPress}>
          ←
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span className="truncate text-muted-foreground">{selectedLocation.name}</span>
              {isLoadingLocation && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  đang cập nhật...
                </Badge>
              )}
            </div>
            <span className="opacity-70 hidden xs:inline">•</span>
            <p className="text-xs text-muted-foreground truncate">
              Múi giờ: {selectedLocation.timezone}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onInfoPress}>
            <Info size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettingsPress}>
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface CurrentTimeCardProps {
  currentTime: Date;
  selectedLocation: Location;
  selectedDate: string;
  qiblaDirection: number;
}

export const CurrentTimeCard: React.FC<CurrentTimeCardProps> = ({
  currentTime,
  selectedLocation,
  selectedDate,
  qiblaDirection
}) => {
  return (
   <Card className="mb-6 relative overflow-hidden text-white border-0">
  {/* Ảnh nền */}
  <img
    src="/images/praytime/vietnammosque.jpg"
    alt="Vietnam Mosque"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Overlay để chữ nổi bật */}
  <div className="absolute inset-0 bg-black/40" />

  <CardHeader className="relative pb-3">
    <CardTitle className="text-3xl font-mono text-center">
      {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
    </CardTitle>
    <CardDescription className="text-center text-white/80">
      {new Date(selectedDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </CardDescription>
  </CardHeader>

  <CardContent className="relative">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-1">
        <MapPin size={16} className="text-white" />
        <span>{selectedLocation.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <Compass size={16} className="text-amber-300" />
        <span>{qiblaDirection}° Qibla</span>
      </div>
    </div>
  </CardContent>
</Card>

  );
};

interface NextPrayerCardProps {
  nextPrayer: string; // Đây sẽ là tên prayer (fajr, dhuhr, asr, maghrib, isha)
  timeToNext: string;
  progressPercentage: number;
}

export const NextPrayerCard: React.FC<NextPrayerCardProps> = ({
  nextPrayer,
  timeToNext,
  progressPercentage
}) => {
  if (!nextPrayer) return null;

  // Chuyển đổi tên prayer thành dạng viết hoa chữ cái đầu để khớp với keys trong prayerBackgrounds
  const prayerName = nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1);
  const backgroundImage = prayerBackgrounds[prayerName] || prayerBackgrounds.default;

  return (
    <Card className="mb-6 relative overflow-hidden text-white border-0">
      <img
        src={backgroundImage}
        alt={prayerName}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback nếu ảnh không tải được
          const target = e.target as HTMLImageElement;
          target.src = prayerBackgrounds.default;
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <CardHeader className="relative pb-3">
        <CardDescription className="text-center text-white/90">
          Cầu nguyện tiếp theo
        </CardDescription>
        <CardTitle className="text-xl text-center">
          {PRAYER_NAMES_VIETNAMESE[nextPrayer as keyof typeof PRAYER_NAMES_VIETNAMESE] || prayerName}
        </CardTitle>
        <div className="text-lg font-mono text-center">{timeToNext}</div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
          <div className="text-center text-xs text-white/80">
            {Math.round(progressPercentage)}% hoàn thành
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


interface PrayerTimesGridProps {
  prayerTimes: PrayerTimes;
}

export const PrayerTimesGrid: React.FC<PrayerTimesGridProps> = ({ prayerTimes }) => {
  return (
    <div className="space-y-3">
      {Object.entries(prayerTimes).map(([prayer, time]) => (
        <Card key={prayer} className="transition-all duration-300 hover:shadow-md active:scale-95">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {PRAYER_ICONS[prayer as keyof typeof PRAYER_ICONS]}
                </div>
                <div>
                  <div className="font-semibold">
                    {PRAYER_NAMES_VIETNAMESE[prayer as keyof typeof PRAYER_NAMES_VIETNAMESE]}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{prayer}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold">{time}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  calculationMethod: number;
  onMethodChange: (method: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onLocationRequest: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onLocationChange,
  selectedDate,
  onDateChange,
  calculationMethod,
  onMethodChange,
  isDarkMode,
  onDarkModeToggle,
  onLocationRequest
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cài Đặt">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Địa điểm</Label>
          <Select
            value={selectedLocation.name}
            onValueChange={(value) => {
              const newLocation = INTERNATIONAL_LOCATIONS.find(loc => loc.name === value) || INTERNATIONAL_LOCATIONS[0];
              onLocationChange(newLocation);
            }}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Chọn địa điểm" />
            </SelectTrigger>
            <SelectContent>
              {INTERNATIONAL_LOCATIONS.map((location) => (
                <SelectItem key={location.name} value={location.name}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Ngày</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="method">Phương pháp tính toán</Label>
          <Select
            value={calculationMethod.toString()}
            onValueChange={(value) => onMethodChange(Number(value))}
          >
            <SelectTrigger id="method">
              <SelectValue placeholder="Chọn phương pháp" />
            </SelectTrigger>
            <SelectContent>
              {CALCULATION_METHODS.map((method, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <Button
          onClick={onLocationRequest}
          variant="outline"
          className="w-full"
        >
          <MapPin size={16} className="mr-2" />
          Cập nhật vị trí hiện tại
        </Button>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
            <span>Chế độ tối</span>
            <span className="font-normal text-muted-foreground">
              Giao diện tối cho trải nghiệm ban đêm
            </span>
          </Label>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={onDarkModeToggle}
          />
        </div>
        
        <Button onClick={onClose} className="w-full">
          Hoàn thành
        </Button>
      </div>
    </Modal>
  );
};

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: Location;
  calculationMethod: number;
  qiblaDirection: number;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  calculationMethod,
  qiblaDirection
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thông Tin">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Vị trí hiện tại</h4>
          <p className="text-muted-foreground">{selectedLocation.name}</p>
          <p className="text-xs text-muted-foreground">
            {selectedLocation.latitude.toFixed(4)}°B, {selectedLocation.longitude.toFixed(4)}°Đ
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">Phương pháp tính toán</h4>
          <p className="text-muted-foreground">{CALCULATION_METHODS[calculationMethod].name}</p>
          <p className="text-xs text-muted-foreground">
            Fajr: {CALCULATION_METHODS[calculationMethod].fajrAngle}° | 
            Isha: {CALCULATION_METHODS[calculationMethod].ishaAngle}°
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">Hướng Qibla</h4>
          <p className="text-muted-foreground">{qiblaDirection}° về phía bắc</p>
          <p className="text-xs text-muted-foreground">Hướng về Makkah từ vị trí của bạn</p>
        </div>
        
        <Separator />
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Thời gian cầu nguyện được tính toán bằng thuật toán thiên văn học
          </p>
        </div>
      </div>
    </Modal>
  );
};

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onSkip: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onAllow,
  onSkip
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Truy cập vị trí"
      description="Cho phép ứng dụng sử dụng vị trí của bạn để hiển thị thời gian cầu nguyện chính xác nhất"
    >
      <div className="flex flex-col items-center py-4">
        <MapPin size={48} className="text-primary mb-3" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={onAllow}>
          Cho phép
        </Button>
        <Button variant="outline" onClick={onSkip}>
          Bỏ qua
        </Button>
      </div>
    </Modal>
  );
};