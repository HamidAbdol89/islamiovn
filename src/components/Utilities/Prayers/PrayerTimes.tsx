import { useState, useEffect } from 'react';
import {
  Header,
  CurrentTimeCard,
  NextPrayerCard,
  PrayerTimesGrid,
  SettingsModal,
  InfoModal,
  LocationPermissionModal
} from './components';
import AdhanPlaylist from '@/components/Utilities/Prayers/AdhanPlaylist'; // Import component mới
import { useLocation, usePrayerTimes, useNextPrayer } from './hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/context/ThemeContext';

export default function PrayerTimesCalculator() {
  // Sử dụng theme context thay vì localStorage riêng
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculationMethod, setCalculationMethod] = useLocalStorage('prayer-calculation-method', 1);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);

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

  const { currentTime, nextPrayerInfo } = useNextPrayer(prayerTimes);

  // Kiểm tra xem đã hỏi quyền vị trí chưa
  const [hasAskedLocation, setHasAskedLocation] = useLocalStorage('prayer-has-asked-location', false);

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
    // Lưu tên vị trí để có thể khôi phục sau
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
        onDarkModeToggle={toggleTheme} // Sử dụng toggleTheme từ context
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