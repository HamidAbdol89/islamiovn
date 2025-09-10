import React, { useState, useEffect } from 'react';
import BackButton from "@/components/ui/BackButton";
import {
  Header,
  CurrentTimeCard,
  NextPrayerCard,
  PrayerTimesGrid,
  SettingsModal,
  InfoModal,
  LocationPermissionModal
} from './components';
import { useLocation, usePrayerTimes, useNextPrayer } from './hooks';

export default function PrayerTimesCalculator() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculationMethod, setCalculationMethod] = useState(1); // Vietnamese Muslim Community
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

  // Auto request location permission on first load
  useEffect(() => {
    setShowLocationPermission(true);
  }, []);

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

      <div className="px-4 py-6 max-w-md mx-auto">
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

        {/* Prayer Times Grid */}
        {prayerTimes && <PrayerTimesGrid prayerTimes={prayerTimes} />}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        calculationMethod={calculationMethod}
        onMethodChange={setCalculationMethod}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
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