// src/components/Utilities/Prayers/components.tsx

import React, { memo, useMemo, useCallback } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Định nghĩa ảnh nền cho từng giờ cầu nguyện - Extract static data outside component
const PRAYER_BACKGROUNDS: Record<string, string> = {
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

export const Modal: React.FC<ModalProps> = memo(({ isOpen, onClose, title, children, description }) => {
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100%-1rem)] mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
});

Modal.displayName = 'Modal';

interface HeaderProps {
  selectedLocation: Location;
  isLoadingLocation: boolean;
  onSettingsPress: () => void;
  onInfoPress: () => void;
  onBackPress: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  selectedLocation,
  isLoadingLocation,
  onSettingsPress,
  onInfoPress,
  onBackPress
}) => {
  const headerClassName = useMemo(() => 
    "sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b", []);
  
  const containerClassName = useMemo(() => 
    "flex justify-between items-center px-4 py-3 gap-2", []);
  
  const locationClassName = useMemo(() => 
    "flex items-center justify-center gap-1 text-sm", []);

  return (
    <div className={headerClassName}>
      <div className={containerClassName}>
        <Button variant="ghost" size="icon" onClick={onBackPress}>
          ←
        </Button>
        
        <div className="flex-1 min-w-0 text-center">
          <div className={locationClassName}>
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="truncate font-medium">{selectedLocation.name}</span>
            {isLoadingLocation && (
              <Badge variant="secondary" className="ml-1 text-xs">
                đang cập nhật...
              </Badge>
            )}
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
});

Header.displayName = 'Header';

interface CurrentTimeCardProps {
  currentTime: Date;
  selectedLocation: Location;
  selectedDate: string;
  qiblaDirection: number;
}

export const CurrentTimeCard: React.FC<CurrentTimeCardProps> = memo(({
  currentTime,
  selectedLocation,
  selectedDate,
  qiblaDirection
}) => {
  const timeString = useMemo(() => 
    currentTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    }), [currentTime]);
  
  const dateString = useMemo(() => 
    new Date(selectedDate).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }), [selectedDate]);

  return (
    <Card className="mb-6 relative overflow-hidden text-white border-0 rounded-2xl shadow-lg">
      {/* Background */}
      <img
        src="/images/praytime/vietnammosque.jpg"
        alt="Vietnam Mosque"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      <div className="relative p-6 flex flex-col items-center">
        {/* Time */}
        <h2 className="text-5xl font-mono font-bold drop-shadow-md">
          {timeString}
        </h2>
        {/* Date */}
        <p className="text-sm text-white/80 mt-1">
          {dateString}
        </p>

        {/* Location & Qibla */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm w-full">
          <div className="flex flex-col items-center">
            <MapPin size={18} className="text-emerald-300 mb-1" />
            <span className="text-center">{selectedLocation.name}</span>
          </div>
          <div className="flex flex-col items-center">
            <Compass size={18} className="text-amber-300 mb-1" />
            <span>{qiblaDirection}° Qibla</span>
          </div>
        </div>

        {/* Timezone */}
        <p className="text-xs text-white/60 mt-4 italic">
          Múi giờ: {selectedLocation.timezone}
        </p>
      </div>
    </Card>
  );
});

CurrentTimeCard.displayName = 'CurrentTimeCard';


interface NextPrayerCardProps {
  nextPrayer: string; // Đây sẽ là tên prayer (fajr, dhuhr, asr, maghrib, isha)
  timeToNext: string;
  progressPercentage: number;
}

export const NextPrayerCard: React.FC<NextPrayerCardProps> = memo(({
  nextPrayer,
  timeToNext,
  progressPercentage
}) => {
  if (!nextPrayer) return null;

  // Memoize expensive calculations
  const prayerName = useMemo(() => 
    nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1), [nextPrayer]);
  
  const backgroundImage = useMemo(() => 
    PRAYER_BACKGROUNDS[prayerName] || PRAYER_BACKGROUNDS.default, [prayerName]);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = PRAYER_BACKGROUNDS.default;
  }, []);
  
  const roundedProgress = useMemo(() => Math.round(progressPercentage), [progressPercentage]);

  return (
    <Card className="mb-6 relative overflow-hidden text-white border-0">
      <img
        src={backgroundImage}
        alt={prayerName}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleImageError}
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
            {roundedProgress}% hoàn thành
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

NextPrayerCard.displayName = 'NextPrayerCard';

interface PrayerTimesGridProps {
  prayerTimes: PrayerTimes;
}

// Memoized Prayer Card Component
const PrayerCard = memo(({ prayer, time }: { prayer: string; time: string }) => {
  const cardClassName = useMemo(() => 
    "transition-all duration-300 hover:shadow-md active:scale-95", []);
  
  const icon = useMemo(() => 
    PRAYER_ICONS[prayer as keyof typeof PRAYER_ICONS], [prayer]);
  
  const vietnameseName = useMemo(() => 
    PRAYER_NAMES_VIETNAMESE[prayer as keyof typeof PRAYER_NAMES_VIETNAMESE], [prayer]);

  return (
    <Card className={cardClassName}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {icon}
            </div>
            <div>
              <div className="font-semibold">
                {vietnameseName}
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
  );
});

PrayerCard.displayName = 'PrayerCard';

export const PrayerTimesGrid: React.FC<PrayerTimesGridProps> = memo(({ prayerTimes }) => {
  const prayerEntries = useMemo(() => Object.entries(prayerTimes), [prayerTimes]);

  return (
    <div className="space-y-3">
      {prayerEntries.map(([prayer, time]) => (
        <PrayerCard key={prayer} prayer={prayer} time={time} />
      ))}
    </div>
  );
});

PrayerTimesGrid.displayName = 'PrayerTimesGrid';

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

export const SettingsModal: React.FC<SettingsModalProps> = memo(({
  isOpen,
  onClose,
  selectedLocation,
  onLocationChange,
  selectedDate,
  onDateChange,
  calculationMethod,
  onMethodChange,
  onLocationRequest
}) => {
  const handleLocationChange = useCallback((value: string) => {
    const newLocation = INTERNATIONAL_LOCATIONS.find(loc => loc.name === value) || INTERNATIONAL_LOCATIONS[0];
    onLocationChange(newLocation);
  }, [onLocationChange]);
  
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
  }, [onDateChange]);
  
  const handleMethodChange = useCallback((value: string) => {
    onMethodChange(Number(value));
  }, [onMethodChange]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cài Đặt">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Địa điểm</Label>
          <Select
            value={selectedLocation.name}
            onValueChange={handleLocationChange}
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
            onChange={handleDateChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="method">Phương pháp tính toán</Label>
          <Select
            value={calculationMethod.toString()}
            onValueChange={handleMethodChange}
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
        
     
        
        <Button onClick={onClose} className="w-full">
          Hoàn thành
        </Button>
      </div>
    </Modal>
  );
});

SettingsModal.displayName = 'SettingsModal';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: Location;
  calculationMethod: number;
  qiblaDirection: number;
}

export const InfoModal: React.FC<InfoModalProps> = memo(({
  isOpen,
  onClose,
  selectedLocation,
  calculationMethod,
  qiblaDirection
}) => {
  const locationCoords = useMemo(() => 
    `${selectedLocation.latitude.toFixed(4)}°B, ${selectedLocation.longitude.toFixed(4)}°Đ`, 
    [selectedLocation.latitude, selectedLocation.longitude]);
  
  const calculationMethodInfo = useMemo(() => 
    CALCULATION_METHODS[calculationMethod], [calculationMethod]);
  
  const methodAngles = useMemo(() => 
    `Fajr: ${calculationMethodInfo.fajrAngle}° | Isha: ${calculationMethodInfo.ishaAngle}°`, 
    [calculationMethodInfo.fajrAngle, calculationMethodInfo.ishaAngle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thông Tin">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Vị trí hiện tại</h4>
          <p className="text-muted-foreground">{selectedLocation.name}</p>
          <p className="text-xs text-muted-foreground">
            {locationCoords}
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">Phương pháp tính toán</h4>
          <p className="text-muted-foreground">{calculationMethodInfo.name}</p>
          <p className="text-xs text-muted-foreground">
            {methodAngles}
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
});

InfoModal.displayName = 'InfoModal';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onSkip: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = memo(({
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
});

LocationPermissionModal.displayName = 'LocationPermissionModal';