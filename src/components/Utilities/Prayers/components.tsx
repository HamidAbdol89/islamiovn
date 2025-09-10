// src/components/Utilities/Prayers/components.tsx

import React from 'react';
import { MapPin, Moon, Settings, Compass, X, Info } from 'lucide-react';
import type { Location, PrayerTimes } from './types';
import { INTERNATIONAL_LOCATIONS, CALCULATION_METHODS, PRAYER_NAMES_VIETNAMESE, PRAYER_ICONS } from './constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card dark:bg-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-luxury dark:shadow-luxury-dark">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
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
    <div className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="flex justify-between items-center px-4 py-3 gap-2">
        <button
          onClick={onBackPress}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-muted shadow-sm transition-colors"
        >
          ←
        </button>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate text-foreground">Lịch Cầu Nguyện</h1>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-accent flex-shrink-0" />
              <span className="truncate text-muted-foreground">{selectedLocation.name}</span>
              {isLoadingLocation && (
                <span className="ml-1 text-xs opacity-70">(đang cập nhật...)</span>
              )}
            </div>
            <span className="opacity-70 hidden xs:inline">•</span>
            <p className="text-xs opacity-70 truncate">
              Múi giờ: {selectedLocation.timezone}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <button
            onClick={onInfoPress}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-muted shadow-sm transition-colors"
          >
            <Info size={18} />
          </button>
          <button
            onClick={onSettingsPress}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-muted shadow-sm transition-colors"
          >
            <Settings size={18} />
          </button>
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
    <div className="p-4 rounded-2xl mb-6 bg-card shadow-luxury dark:shadow-luxury-dark backdrop-blur-sm">
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold mb-1 text-foreground">
          {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(selectedDate).toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="text-accent" />
          <span className="text-muted-foreground">{selectedLocation.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Compass size={16} className="text-yellow-500" />
          <span className="text-muted-foreground">{qiblaDirection}° Qibla</span>
        </div>
      </div>
    </div>
  );
};

interface NextPrayerCardProps {
  nextPrayer: string;
  timeToNext: string;
  progressPercentage: number;
}

export const NextPrayerCard: React.FC<NextPrayerCardProps> = ({
  nextPrayer,
  timeToNext,
  progressPercentage
}) => {
  if (!nextPrayer) return null;

  return (
    <div className="p-4 rounded-2xl mb-6 bg-luxury-gradient text-white shadow-luxury dark:shadow-luxury-dark">
      <div className="text-center mb-3">
        <div className="text-sm opacity-90 mb-1">Cầu nguyện tiếp theo</div>
        <div className="text-xl font-bold mb-1">{nextPrayer}</div>
        <div className="text-lg font-mono">{timeToNext}</div>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-white rounded-full h-2 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-center text-xs opacity-75 mt-1">
        {Math.round(progressPercentage)}% hoàn thành
      </div>
    </div>
  );
};

interface PrayerTimesGridProps {
  prayerTimes: PrayerTimes;
}

export const PrayerTimesGrid: React.FC<PrayerTimesGridProps> = ({ prayerTimes }) => {
  return (
    <div className="space-y-3">
      {Object.entries(prayerTimes).map(([prayer, time]) => (
        <div
          key={prayer}
          className="p-4 rounded-2xl bg-card shadow-luxury dark:shadow-luxury-dark hover:shadow-xl transition-all duration-300 active:scale-95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {PRAYER_ICONS[prayer as keyof typeof PRAYER_ICONS]}
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {PRAYER_NAMES_VIETNAMESE[prayer as keyof typeof PRAYER_NAMES_VIETNAMESE]}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{prayer}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-foreground">{time}</div>
            </div>
          </div>
        </div>
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
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Địa điểm</label>
          <select
            value={selectedLocation.name}
            onChange={(e) => {
              const newLocation = INTERNATIONAL_LOCATIONS.find(loc => loc.name === e.target.value) || INTERNATIONAL_LOCATIONS[0];
              onLocationChange(newLocation);
            }}
            className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            {INTERNATIONAL_LOCATIONS.map((location) => (
              <option key={location.name} value={location.name}>{location.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Ngày</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Phương pháp tính toán</label>
          <select
            value={calculationMethod}
            onChange={(e) => onMethodChange(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            {CALCULATION_METHODS.map((method, index) => (
              <option key={index} value={index}>{method.name}</option>
            ))}
          </select>
        </div>
        
        <div className="pt-4 border-t border-border">
          <button
            onClick={onLocationRequest}
            className="w-full py-2 px-4 rounded-xl border border-border bg-muted hover:bg-muted/80 transition-colors mb-4 flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            <span>Cập nhật vị trí hiện tại</span>
          </button>
          
          <div className="flex items-center justify-between py-3 px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Moon size={18} className="text-muted-foreground" />
              <span className="text-foreground">Chế độ tối</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={onDarkModeToggle} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            </label>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 px-4 rounded-xl transition-colors mt-4"
          >
            Hoàn thành
          </button>
        </div>
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
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Vị trí hiện tại</h4>
          <p className="text-muted-foreground">{selectedLocation.name}</p>
          <p className="text-xs text-muted-foreground">
            {selectedLocation.latitude.toFixed(4)}°B, {selectedLocation.longitude.toFixed(4)}°Đ
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Phương pháp tính toán</h4>
          <p className="text-muted-foreground">{CALCULATION_METHODS[calculationMethod].name}</p>
          <p className="text-xs text-muted-foreground">
            Fajr: {CALCULATION_METHODS[calculationMethod].fajrAngle}° | 
            Isha: {CALCULATION_METHODS[calculationMethod].ishaAngle}°
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-foreground">Hướng Qibla</h4>
          <p className="text-muted-foreground">{qiblaDirection}° về phía bắc</p>
          <p className="text-xs text-muted-foreground">Hướng về Makkah từ vị trí của bạn</p>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
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
    <Modal isOpen={isOpen} onClose={onClose} title="Truy cập vị trí">
      <div className="space-y-4">
        <div className="text-center py-4">
          <MapPin size={48} className="mx-auto text-accent mb-3" />
          <p className="text-sm text-muted-foreground">
            Cho phép ứng dụng sử dụng vị trí của bạn để hiển thị thời gian cầu nguyện chính xác nhất.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onAllow}
            className="py-2 px-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl transition-colors"
          >
            Cho phép
          </button>
          <button
            onClick={onSkip}
            className="py-2 px-4 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl transition-colors"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </Modal>
  );
};