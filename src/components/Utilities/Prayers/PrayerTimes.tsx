import { useState, useEffect } from 'react';
import * as React from "react";
import { prayerNotificationService } from '@/services/prayerNotifications';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Header,
  CurrentTimeCard,
  NextPrayerCard,
  PrayerTimesGrid,
  SettingsModal,
  InfoModal,
  LocationPermissionModal
} from './components';
import AdhanPlaylist from '@/components/Utilities/Prayers/AdhanPlaylist';
import { useLocation, usePrayerTimes, useNextPrayer } from './hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/context/ThemeContext';
import { registerServiceWorker } from '@/utils/registerServiceWorker';

// Import SEOHead với dynamic import để tránh lỗi nếu component có vấn đề
const SEOHead = React.lazy(() => import('@/components/SEO/SEOHead'));

export default function PrayerTimesCalculator() {
  // Sử dụng theme context thay vì localStorage riêng
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculationMethod, setCalculationMethod] = useLocalStorage('prayer-calculation-method', 1);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const { permission, requestPermission } = useNotifications();
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  // Custom hooks
  const {
    selectedLocation,
    setSelectedLocation,
    isLoadingLocation,
    requestUserLocation
  } = useLocation();

  const { prayerTimes, qiblaDirection } = usePrayerTimes(
    selectedLocation,
    selectedDate,
    calculationMethod
  );

  // Convert PrayerTimes object to array for notifications
  const prayerTimesArray = prayerTimes
    ? [
        { name: 'fajr', time: prayerTimes.fajr, nameVi: 'Fajr' },
        { name: 'sunrise', time: prayerTimes.sunrise, nameVi: 'Bình minh' },
        { name: 'dhuhr', time: prayerTimes.dhuhr, nameVi: 'Dhuhr' },
        { name: 'asr', time: prayerTimes.asr, nameVi: 'Asr' },
        { name: 'maghrib', time: prayerTimes.maghrib, nameVi: 'Maghrib' },
        { name: 'isha', time: prayerTimes.isha, nameVi: 'Isha' }
      ]
    : [];

  const { currentTime, nextPrayerInfo } = useNextPrayer(prayerTimes);

  // Kiểm tra xem đã hỏi quyền vị trí chưa
  const [hasAskedLocation, setHasAskedLocation] = useLocalStorage('prayer-has-asked-location', false);

  // Khởi tạo service worker và notification service - CHỈ MỘT LẦN
  useEffect(() => {
    const initializeServiceWorkerAndNotifications = async () => {
      try {
        // Đăng ký service worker
        await registerServiceWorker();
        
        // Khởi tạo notification service
        await prayerNotificationService.initialize();
        setIsServiceWorkerReady(true);
        
        // Yêu cầu quyền thông báo
        if (permission === 'default') {
          await requestPermission();
        }
      } catch (error) {
        console.error('Failed to initialize service worker:', error);
      }
    };
    
    initializeServiceWorkerAndNotifications();
    
    return () => {
      prayerNotificationService.destroy();
    };
  }, [permission, requestPermission]);

  // Lên lịch thông báo khi prayerTimes thay đổi và service worker đã sẵn sàng
  useEffect(() => {
    if (prayerTimesArray.length > 0 && isServiceWorkerReady && permission === 'granted') {
      prayerNotificationService.schedulePrayerNotifications(prayerTimesArray);
    }
  }, [prayerTimesArray, isServiceWorkerReady, permission]);

  // Auto request location permission on first load
  useEffect(() => {
    if (!hasAskedLocation) {
      setShowLocationPermission(true);
      setHasAskedLocation(true);
    }
  }, [hasAskedLocation, setHasAskedLocation]);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLocationRequest = () => {
    setShowLocationPermission(false);
    requestUserLocation();
  };

  const handleLocationSkip = () => {
    setShowLocationPermission(false);
  };

  const handleBackPress = () => {
    window.history.back();
  };

  // Lưu vị trí đã chọn vào localStorage
  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
    localStorage.setItem('prayer-selected-location', JSON.stringify(location));
  };

  // Khôi phục vị trí đã lưu khi component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('prayer-selected-location');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setSelectedLocation(location);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-smooth">
      {/* SEO Head với Error Boundary */}
      <React.Suspense fallback={null}>
        <SEOHead
          title="Giờ cầu nguyện"
          description="Xem giờ giấc cầu nguyện chính xác theo vị trí của bạn. Bao gồm Fajr, Dhuhr, Asr, Maghrib, Isha với thời gian chính xác."
          url="https://muslimviet.vercel.app/utilities/prayers"
          keywords={['lịch cầu nguyện', 'prayer times', 'salah', 'namaz']}
        />
      </React.Suspense>
      
      {/* Header */}
      <Header
        selectedLocation={selectedLocation}
        isLoadingLocation={isLoadingLocation}
        onSettingsPress={() => setShowSettings(true)}
        onInfoPress={() => setShowInfo(true)}
        onBackPress={handleBackPress}
      />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Current Time & Location Card */}
        <CurrentTimeCard
          currentTime={currentTime}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          qiblaDirection={qiblaDirection}
        />

        {/* Next Prayer Alert with Progress Bar */}
        <NextPrayerCard
          nextPrayer={nextPrayerInfo.nextPrayer}
          timeToNext={nextPrayerInfo.timeToNext}
          progressPercentage={nextPrayerInfo.progressPercentage}
        />
      
        {/* Adhan Playlist */}
        <AdhanPlaylist />

        {/* Prayer Times Grid */}
        {prayerTimes && <PrayerTimesGrid prayerTimes={prayerTimes} />}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        calculationMethod={calculationMethod}
        onMethodChange={setCalculationMethod}
        isDarkMode={isDarkMode}
        onDarkModeToggle={toggleTheme}
        onLocationRequest={() => setShowLocationPermission(true)}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        selectedLocation={selectedLocation}
        calculationMethod={calculationMethod}
        qiblaDirection={qiblaDirection}
      />

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationPermission}
        onClose={() => setShowLocationPermission(false)}
        onAllow={handleLocationRequest}
        onSkip={handleLocationSkip}
      />
    </div>
  );
}