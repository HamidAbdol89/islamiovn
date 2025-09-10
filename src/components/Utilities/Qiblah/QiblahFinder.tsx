import { useState, useEffect } from 'react';
import BackButton from "@/components/ui/BackButton"; 
import { 
  MapPin, 
  Sun, 
  Moon, 
  RefreshCw, 
  Compass,
  AlertCircle,
  Check,
  ArrowUp
} from 'lucide-react';

// Type definitions
interface Position {
  lat: number;
  lng: number;
}

interface LocationInfo {
  city: string;
  country: string;
  region: string;
  distance: number;
}

interface LocationResponse {
  city?: string;
  locality?: string;
  countryName?: string;
  principalSubdivision?: string;
}

const QiblahCompass = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [qiblahDirection, setQiblahDirection] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [compassPermission, setCompassPermission] = useState<string>('pending');
  const [calibrationNeeded, setCalibrationNeeded] = useState<boolean>(false);

  // Kaaba coordinates (Mecca)
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // Convert degrees to radians
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  const toDegrees = (radians: number): number => radians * (180 / Math.PI);

  // Calculate Qiblah direction using Great Circle formula
  const calculateQiblahDirection = (lat: number, lng: number): number => {
    const lat1 = toRadians(lat);
    const lng1 = toRadians(lng);
    const lat2 = toRadians(KAABA_LAT);
    const lng2 = toRadians(KAABA_LNG);

    const deltaLng = lng2 - lng1;

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = toDegrees(Math.atan2(y, x));
    
    // Normalize angle to 0-360 range
    bearing = (bearing + 360) % 360;
    
    return bearing;
  };

  // Calculate distance to Mecca
  const calculateDistance = (lat: number, lng: number): number => {
    const R = 6371; // Earth's radius (km)
    const dLat = toRadians(KAABA_LAT - lat);
    const dLng = toRadians(KAABA_LNG - lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(lat)) * Math.cos(toRadians(KAABA_LAT)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
  };

  // Reverse geocoding
  const getLocationInfo = async (lat: number, lng: number): Promise<LocationInfo> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data: LocationResponse = await response.json();
      return {
        city: data.city || data.locality || 'Unknown',
        country: data.countryName || 'Unknown',
        region: data.principalSubdivision || '',
        distance: calculateDistance(lat, lng)
      };
    } catch (err) {
      return {
        city: 'Unknown',
        country: 'Unknown',
        region: '',
        distance: calculateDistance(lat, lng)
      };
    }
  };

  // Get GPS position
  const getCurrentPosition = (): void => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Browser does not support GPS');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newPosition = { lat: latitude, lng: longitude };
        setPosition(newPosition);
        setAccuracy(Math.round(accuracy));
        
        const qiblah = calculateQiblahDirection(latitude, longitude);
        setQiblahDirection(qiblah);
        
        const locationData = await getLocationInfo(latitude, longitude);
        setLocationInfo(locationData);
        
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = 'Unable to get location';
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  };

  // Request compass permission
  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setCompassPermission(permission);
        return permission === 'granted';
      } catch (error) {
        console.error('Compass permission error:', error);
        setCompassPermission('denied');
        return false;
      }
    }
    return true; // Android or other browsers
  };

  // Get compass heading from device sensor
  useEffect(() => {
    let isActive = true;

    const handleOrientation = (event: DeviceOrientationEvent): void => {
      if (!isActive) return;

      if (event.alpha !== null) {
        const compassHeading = (event as DeviceOrientationEvent & {
          webkitCompassHeading?: number;
        }).webkitCompassHeading;

        let heading = event.alpha;

        if (typeof compassHeading === "number") {
          heading = compassHeading;
        } else {
          heading = 360 - heading;
        }

        setCompassHeading(heading);

        if (
          event.alpha === 0 &&
          event.beta === 0 &&
          event.gamma === 0
        ) {
          setCalibrationNeeded(true);
        } else {
          setCalibrationNeeded(false);
        }
      }
    };

    const initCompass = async () => {
      if (window.DeviceOrientationEvent) {
        const hasPermission = await requestCompassPermission();
        if (hasPermission) {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setCompassPermission("granted");
        } else {
          setCompassPermission("denied");
        }
      } else {
        setError("Device does not support compass");
      }
    };

    initCompass();

    return () => {
      isActive = false;
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  const relativeQiblahAngle = qiblahDirection - compassHeading;
  const normalizedAngle = ((relativeQiblahAngle % 360) + 360) % 360;
  const accuracy_degrees = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
  const isAccurate = accuracy_degrees < 15;

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800';

  return (
    <div className={`min-h-screen p-4 transition-all duration-300 ${themeClasses}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <div className="w-10"></div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🕋</span>
            <h1 className="text-xl font-bold">Qiblah Finder</h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white/70 hover:bg-white/90'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={getCurrentPosition}
              disabled={isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white/70 hover:bg-white/90'
              } ${isLoading ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Accuracy indicator */}
        {position && compassPermission === 'granted' && (
          <div className={`p-3 rounded-xl mb-4 text-center ${
            isAccurate 
              ? (isDarkMode ? 'bg-green-900/40 border border-green-700' : 'bg-green-100 border border-green-300')
              : (isDarkMode ? 'bg-yellow-900/40 border border-yellow-700' : 'bg-yellow-100 border border-yellow-300')
          }`}>
            <div className={`font-bold ${isAccurate ? 'text-green-600' : 'text-yellow-600'}`}>
              {isAccurate ? '✓ ACCURATE DIRECTION' : '⚠ CALIBRATING'}
            </div>
            <div className="text-sm opacity-80 mt-1">
              Deviation: {Math.round(accuracy_degrees)}°
            </div>
          </div>
        )}

        {/* Location info */}
        {locationInfo && (
          <div className={`p-4 rounded-2xl mb-6 ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white/60'
          } backdrop-blur-sm`}>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Current Location</span>
            </div>
            <p className="text-sm opacity-80">
              {locationInfo.city}, {locationInfo.country}
            </p>
            <p className="text-xs opacity-60 mt-1">
              Distance to Mecca: {locationInfo.distance.toLocaleString()} km
            </p>
            <p className="text-xs opacity-60">
              Qiblah Direction: {Math.round(qiblahDirection)}° (from North)
            </p>
            {accuracy && (
              <p className="text-xs opacity-60">
                GPS Accuracy: ±{accuracy}m
              </p>
            )}
          </div>
        )}

        {/* Qiblah compass */}
        <div className="relative mb-6">
          <div className={`w-80 h-80 mx-auto rounded-full border-8 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white/70 border-white/50'
          } backdrop-blur-sm shadow-2xl relative overflow-hidden`}>
            
            <div className="relative w-full h-full">
              {/* Cardinal directions */}
              {[
                { angle: 0, label: 'N', color: 'bg-red-500' },
                { angle: 90, label: 'E', color: 'bg-gray-400' },
                { angle: 180, label: 'S', color: 'bg-gray-400' },
                { angle: 270, label: 'W', color: 'bg-gray-400' }
              ].map(({ angle, label, color }) => (
                <div key={angle}>
                  <div
                    className={`absolute w-1 h-8 ${color}`}
                    style={{
                      top: '8px',
                      left: '50%',
                      transformOrigin: '50% 148px',
                      transform: `translateX(-50%) rotate(${angle}deg)`
                    }}
                  />
                  <div
                    className="absolute text-sm font-bold"
                    style={{
                      top: angle === 0 ? '20px' : angle === 180 ? 'calc(100% - 35px)' : '50%',
                      left: angle === 90 ? 'calc(100% - 25px)' : angle === 270 ? '10px' : '50%',
                      transform: angle === 0 || angle === 180 ? 'translateX(-50%)' : 'translateY(-50%)'
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}

              {isAccurate && (
                <div className="absolute inset-8 rounded-full border-2 border-green-400 opacity-50 animate-pulse" />
              )}

              {/* Qiblah arrow */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: '4px',
                  height: '140px',
                  top: '20px',
                  left: '50%',
                  transformOrigin: '50% 140px',
                  transform: `translateX(-50%) rotate(${relativeQiblahAngle}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-green-600 to-green-400 rounded-full shadow-lg relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <ArrowUp className="w-4 h-4 text-green-600 drop-shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Compass needle (North) */}
              <div
                className="absolute"
                style={{
                  width: '2px',
                  height: '100px',
                  top: '40px',
                  left: '50%',
                  transformOrigin: '50% 120px',
                  transform: `translateX(-50%) rotate(${-compassHeading}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className="w-full h-full bg-red-500 rounded-full opacity-60" />
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2" />
              </div>

              {/* Compass center */}
              <div className={`absolute top-1/2 left-1/2 w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'
              } shadow-lg`} />

              {/* Kaaba icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs">
                  ⌂
                </div>
              </div>
            </div>
          </div>

          {/* Angle and instructions */}
          <div className="text-center mt-4 space-y-2">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'
            } backdrop-blur-sm`}>
              <Compass className="w-4 h-4 text-green-600" />
              <span className="font-bold text-lg">
                {Math.round(qiblahDirection)}°
              </span>
            </div>
            
            <div className="text-sm opacity-80">
              <p className="font-medium text-green-600">Green arrow → Qiblah</p>
              <p className="text-red-500">Red dot → Magnetic North</p>
            </div>
          </div>
        </div>

        {/* Calibration warning */}
        {calibrationNeeded && (
          <div className={`p-4 rounded-2xl mb-4 ${
            isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100/70'
          }`}>
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Compass needs calibration</span>
            </div>
            <p className="text-sm mt-1 opacity-80">
              Move your phone in a figure-8 motion to calibrate the sensor.
            </p>
          </div>
        )}

        {/* Compass permission denied */}
        {compassPermission === 'denied' && (
          <div className={`p-4 rounded-2xl mb-4 ${
            isDarkMode ? 'bg-red-900/30' : 'bg-red-100/70'
          }`}>
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Compass permission denied</span>
            </div>
            <p className="text-sm mt-1 opacity-80">
              Please enable sensor access in your browser settings.
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className={`p-4 rounded-2xl text-center ${
            isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100/70'
          }`}>
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p>Determining location...</p>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-2xl ${
            isDarkMode ? 'bg-red-900/30' : 'bg-red-100/70'
          }`}>
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm mt-1 opacity-80">{error}</p>
            <button
              onClick={getCurrentPosition}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {position && !isLoading && !error && compassPermission === 'granted' && (
          <div className={`p-4 rounded-2xl ${
            isDarkMode ? 'bg-green-900/30' : 'bg-green-100/70'
          }`}>
            <div className="flex items-center space-x-2 text-green-600 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-medium">Ready</span>
            </div>
            <p className="text-sm opacity-80">
              Rotate your phone until you see "ACCURATE DIRECTION". The Qiblah is in front of you.
            </p>
          </div>
        )}

        {/* Usage instructions */}
        <div className={`mt-6 p-4 rounded-2xl ${
          isDarkMode ? 'bg-gray-800/30' : 'bg-white/40'
        } backdrop-blur-sm`}>
          <h3 className="font-semibold mb-3">📱 Usage Guide:</h3>
          <ul className="text-sm space-y-2 opacity-80">
            <li>• <strong>Step 1:</strong> Place phone flat with screen facing up</li>
            <li>• <strong>Step 2:</strong> Rotate yourself following the green arrow</li>
            <li>• <strong>Step 3:</strong> When "ACCURATE DIRECTION" appears → Qiblah is in front</li>
            <li>• <strong>Note:</strong> Avoid electronics and metal objects</li>
            <li>• <strong>Best accuracy:</strong> Use outdoors</li>
          </ul>
        </div>

        {/* Technical info */}
        <div className={`mt-4 p-3 rounded-xl text-xs ${
          isDarkMode ? 'bg-gray-800/20' : 'bg-white/30'
        } backdrop-blur-sm opacity-60`}>
          <p>🧭 Compass: {compassHeading.toFixed(1)}° | 🎯 Qiblah: {qiblahDirection.toFixed(1)}° | 📍 GPS: ±{accuracy}m</p>
        </div>
      </div>
    </div>
  );
};

export default QiblahCompass;