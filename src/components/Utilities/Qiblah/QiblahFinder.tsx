import { useState, useEffect } from 'react';
import BackButton from "@/components/ui/BackButton"; 
import { 
  MapPin, 
  RefreshCw, 
  Compass,
  AlertCircle,
  Check,
  ArrowUp
} from 'lucide-react';
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { theme } = useTheme();
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
        city: data.city || data.locality || 'Không xác định',
        country: data.countryName || 'Không xác định',
        region: data.principalSubdivision || '',
        distance: calculateDistance(lat, lng)
      };
    } catch (err) {
      return {
        city: 'Không xác định',
        country: 'Không xác định',
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
      setError('Trình duyệt không hỗ trợ GPS');
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
        let errorMessage = 'Không thể lấy vị trí';
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Quyền truy cập vị trí bị từ chối';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case err.TIMEOUT:
            errorMessage = 'Yêu cầu vị trí đã hết thời gian';
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
        console.error('Lỗi quyền la bàn:', error);
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
        setError("Thiết bị không hỗ trợ la bàn");
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

  const relativeQiblahAngle = qiblahDirection - compassHeading;
  const normalizedAngle = ((relativeQiblahAngle % 360) + 360) % 360;
  const accuracy_degrees = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
  const isAccurate = accuracy_degrees < 15;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <div className="w-10"></div>
 <div className="w-full flex justify-center">
  <div className="flex items-center gap-2 p-2 -translate-x-2">
    <span className="text-xl md:text-2xl">🕋</span>
    <h1 className="text-lg md:text-xl font-semibold text-center">
      Tìm Hướng Qiblah
    </h1>
  </div>
</div>


          
          <div className="flex space-x-2">

            <Button
              onClick={getCurrentPosition}
              disabled={isLoading}
              variant="outline"
              size="icon"
              className="h-10 w-10"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Accuracy indicator */}
        {position && compassPermission === 'granted' && (
          <Card className={`mb-4 text-center ${
            isAccurate ? 'border-green-500' : 'border-yellow-500'
          }`}>
            <CardContent className="p-3">
              <div className={`font-bold ${isAccurate ? 'text-green-600' : 'text-yellow-600'}`}>
                {isAccurate ? '✓ HƯỚNG CHÍNH XÁC' : '⚠ ĐANG HIỆU CHUẨN'}
              </div>
              <div className="text-sm opacity-80 mt-1">
                Độ lệch: {Math.round(accuracy_degrees)}°
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location info */}
        {locationInfo && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base">Vị trí hiện tại</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {locationInfo.city}, {locationInfo.country}
              </p>
              <p className="text-xs opacity-60 mt-1">
                Khoảng cách đến Mecca: {locationInfo.distance.toLocaleString()} km
              </p>
              <p className="text-xs opacity-60">
                Hướng Qiblah: {Math.round(qiblahDirection)}° (từ Bắc)
              </p>
              {accuracy && (
                <p className="text-xs opacity-60">
                  Độ chính xác GPS: ±{accuracy}m
                </p>
              )}
            </CardContent>
          </Card>
        )}

    {/* Qiblah compass */}
<div className="relative mb-6">
  <div className={`w-80 h-80 mx-auto rounded-full border-8 ${
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'
  } shadow-2xl relative overflow-hidden`}>
            
            <div className="relative w-full h-full">
              {/* Cardinal directions */}
              {[
                { angle: 0, label: 'B', color: 'bg-red-500' },
                { angle: 90, label: 'Đ', color: 'bg-gray-400' },
                { angle: 180, label: 'N', color: 'bg-gray-400' },
                { angle: 270, label: 'T', color: 'bg-gray-400' }
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
                theme === 'dark' ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'
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
            <Badge className="px-4 py-2 text-lg">
              <Compass className="w-4 h-4 text-green-600 mr-2" />
              {Math.round(qiblahDirection)}°
            </Badge>
            
            <div className="text-sm opacity-80">
              <p className="font-medium text-green-600">Mũi tên xanh → Hướng Qiblah</p>
              <p className="text-red-500">Chấm đỏ → Hướng Bắc từ trường</p>
            </div>
          </div>
        </div>

   {/* Calibration warning - placed right below the compass */}
  {calibrationNeeded && (
    <Card className="mt-4 border-yellow-500">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 text-yellow-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Cần hiệu chuẩn la bàn</span>
        </div>
        <p className="text-sm opacity-80">
          Di chuyển điện thoại theo hình số 8 để hiệu chuẩn cảm biến.
        </p>
      </CardContent>
    </Card>
  )}

        {/* Compass permission denied */}
        {compassPermission === 'denied' && (
          <Card className="mb-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Quyền truy cập la bàn bị từ chối</span>
              </div>
              <p className="text-sm opacity-80">
                Vui lòng cho phép truy cập cảm biến trong cài đặt trình duyệt.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isLoading && (
          <Card className="mb-4 border-blue-500">
            <CardContent className="p-4 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p>Đang xác định vị trí...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-4 border-red-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Lỗi</span>
              </div>
              <p className="text-sm opacity-80 mb-3">{error}</p>
              <Button
                onClick={getCurrentPosition}
                variant="destructive"
                size="sm"
              >
                Thử lại
              </Button>
            </CardContent>
          </Card>
        )}

        {position && !isLoading && !error && compassPermission === 'granted' && (
          <Card className="mb-4 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-600 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">Sẵn sàng</span>
              </div>
              <p className="text-sm opacity-80">
                Xoay điện thoại cho đến khi thấy "HƯỚNG CHÍNH XÁC". Qiblah ở phía trước bạn.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Usage instructions */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Hướng dẫn sử dụng:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 opacity-80">
              <li><strong>Bước 1:</strong> Đặt điện thoại nằm ngang, màn hình hướng lên</li>
              <li><strong>Bước 2:</strong> Xoay người theo hướng mũi tên xanh</li>
              <li><strong>Bước 3:</strong> Khi "HƯỚNG CHÍNH XÁC" xuất hiện → Qiblah ở phía trước</li>
              <li><strong>Lưu ý:</strong> Tránh xa thiết bị điện tử và vật kim loại</li>
              <li><strong>Độ chính xác tốt nhất:</strong> Sử dụng ngoài trời</li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical info */}
        <div className={`p-3 rounded-xl text-xs ${
          theme === 'dark' ? 'bg-muted' : 'bg-muted/50'
        } opacity-60`}>
          <p>🧭 La bàn: {compassHeading.toFixed(1)}° | 🎯 Qiblah: {qiblahDirection.toFixed(1)}° | 📍 GPS: ±{accuracy}m</p>
        </div>
      </div>
    </div>
  );
};

export default QiblahCompass;