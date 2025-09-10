import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Moon, Sun, Search, Phone, Clock, Star, Loader, ExternalLink, Map } from 'lucide-react';
import BackButton from "@/components/ui/BackButton"; 
import MasjidVietnam from '@/components/Utilities/Masjid/MasjidVietnam';

interface Masjid {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  phone?: string;
  rating?: number;
  openingHours?: string;
  website?: string;
  amenities?: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
}

// Add Leaflet types and global declaration
declare global {
  interface Window {
    L: any;
  }
}

const MasjidLocator: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => setLeafletLoaded(true);
        document.head.appendChild(script);
      } else {
        setLeafletLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (userLocation && !showMap) {
      setShowMap(true); // Automatically show map when location is available
    }
  }, [userLocation]);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Initialize map when Leaflet is loaded and user location is available
  useEffect(() => {
    if (leafletLoaded && userLocation && showMap && mapContainerRef.current && !mapRef.current) {
      initializeMap();
    }
  }, [leafletLoaded, userLocation, showMap]);

  // Update map when masjids change
  useEffect(() => {
    if (mapRef.current && masjids.length > 0) {
      updateMapMarkers();
    }
  }, [masjids, selectedMasjid]);

  const initializeMap = () => {
    if (!window.L || !userLocation || !mapContainerRef.current) return;

    try {
      // Initialize map
      mapRef.current = window.L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add user location marker
      const userIcon = window.L.divIcon({
        html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        className: 'custom-user-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('Your location')
        .openPopup();

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateMapMarkers = () => {
    if (!mapRef.current || !window.L) return;

    // Clear existing masjid markers (keep user marker)
    mapRef.current.eachLayer((layer: any) => {
      if (layer.options && layer.options.masjidMarker) {
        mapRef.current.removeLayer(layer);
      }
    });

    // Add masjid markers
    const bounds = window.L.latLngBounds();
    
    // Add user location to bounds
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    filteredMasjids.forEach((masjid) => {
      const isSelected = selectedMasjid?.id === masjid.id;
      
      const masjidIcon = window.L.divIcon({
        html: `
          <div class="masjid-marker ${isSelected ? 'selected' : ''}">
            🕌
          </div>
        `,
        className: '', // Remove default class to use custom class
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });

      const marker = window.L.marker([masjid.lat, masjid.lng], { 
        icon: masjidIcon,
        masjidMarker: true
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${masjid.name}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${masjid.address}</p>
            <p style="margin: 0 0 8px 0; color: #16a34a; font-weight: 500;">${masjid.distance.toFixed(1)} km away</p>
            ${masjid.phone ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">📞 ${masjid.phone}</p>` : ''}
            ${masjid.openingHours ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">🕐 ${masjid.openingHours}</p>` : ''}
            <button onclick="window.open('https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${masjid.lat},${masjid.lng}', '_blank')" 
                    style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 4px;">
              Get Directions
            </button>
          </div>
        `);

      // Add click event to select masjid
      marker.on('click', () => {
        setSelectedMasjid(masjid);
      });

      bounds.extend([masjid.lat, masjid.lng]);
    });

    // Fit map to show all markers
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // Toggle theme
  const toggleTheme = (): void => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getUserLocation = (): void => {
    setIsLocationLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Browser does not support geolocation');
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLocationLoading(false);
        // Automatically search for nearby masjids when location is available
        searchNearbyMasjids(location);
      },
      (_) => {
        setError('Unable to retrieve your current location. Please allow location access.');
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Search nearby masjids using OpenStreetMap Overpass API
  const searchNearbyMasjids = async (location: UserLocation): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      // Use Overpass API to find mosques
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${location.lat},${location.lng});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${location.lat},${location.lng});
          relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${location.lat},${location.lng});
        );
        out geom;
      `;

      const response = await fetch(
        'https://overpass-api.de/api/interpreter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`
        }
      );

      if (!response.ok) {
        throw new Error('Unable to load masjid data from OpenStreetMap');
      }

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const masjidList: Masjid[] = data.elements
          .filter((element: any) => element.lat && element.lon)
          .map((element: any, index: number) => {
            const lat = element.lat || (element.center ? element.center.lat : 0);
            const lng = element.lon || (element.center ? element.center.lon : 0);
            
            return {
              id: element.id?.toString() || `masjid-${index}`,
              name: element.tags?.name || element.tags?.['name:vi'] || element.tags?.['name:en'] || 'Unnamed Masjid',
              address: [
                element.tags?.['addr:street'] && element.tags?.['addr:housenumber'] 
                  ? `${element.tags['addr:housenumber']} ${element.tags['addr:street']}`
                  : element.tags?.['addr:street'],
                element.tags?.['addr:district'],
                element.tags?.['addr:city'] || element.tags?.['addr:province']
              ].filter(Boolean).join(', ') || 'Address not available',
              lat,
              lng,
              distance: calculateDistance(location.lat, location.lng, lat, lng),
              phone: element.tags?.phone,
              website: element.tags?.website,
              openingHours: element.tags?.opening_hours,
              amenities: [
                element.tags?.wheelchair === 'yes' ? 'Wheelchair accessible' : null,
                element.tags?.parking ? 'Parking available' : null,
                element.tags?.['addr:postcode'] ? `Postal code: ${element.tags['addr:postcode']}` : null
              ].filter(Boolean)
            };
          })
          .sort((a: Masjid, b: Masjid) => a.distance - b.distance)
          .slice(0, 20); // Limit to 20 results

        setMasjids(masjidList);
        
        if (masjidList.length === 0) {
          setError('No masjids found within 5km radius.');
        }
      } else {
        setError('No masjids found in this area.');
      }
    } catch (apiError) {
      console.error('Error fetching masjids:', apiError);
      setError('Unable to load masjid list. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter masjids based on search query
  const filteredMasjids = masjids.filter(masjid =>
    masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open in maps (using OpenStreetMap)
  const openInMaps = (masjid: Masjid): void => {
    const osmUrl = `https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${masjid.lat},${masjid.lng}`;
    window.open(osmUrl, '_blank');
  };

  // Open location in various map apps
  const openInMapApp = (masjid: Masjid, app: string): void => {
    let url = '';
    
    switch (app) {
      case 'osm':
        url = `https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${masjid.lat},${masjid.lng}`;
        break;
      case 'apple':
        url = `https://maps.apple.com/?daddr=${masjid.lat},${masjid.lng}&saddr=${userLocation?.lat},${userLocation?.lng}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${masjid.lat},${masjid.lng}&navigate=yes`;
        break;
      default:
        url = `https://www.openstreetmap.org/?mlat=${masjid.lat}&mlon=${masjid.lng}&zoom=16`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BackButton />
            
            <span className="text-2xl">🕌</span>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Masjids Near You
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-80 transition-all"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Control Panel */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={getUserLocation}
              disabled={isLocationLoading}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
            >
              {isLocationLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5" />
              )}
              <span>
                {isLocationLoading ? 'Locating...' : 'Get Current Location'}
              </span>
            </button>

            {/* Show toggle map button only if map is available */}
            {userLocation && masjids.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Map className="h-5 w-5" />
                <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          {userLocation && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search masjids..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Current Location Info */}
        {userLocation && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-300">
                Current location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        {/* Map Container */}
        {showMap && userLocation && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Masjid Map
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  🔵 Your location | 🕌 Masjid {selectedMasjid && '| 🔴 Selected'}
                </div>
              </div>
              <div
                ref={mapContainerRef}
                className="w-full h-96 rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ minHeight: '400px' }}
              />
              {!leafletLoaded && (
                <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Searching for masjids from OpenStreetMap...
            </span>
          </div>
        )}

        {/* Results Counter */}
        {!isLoading && filteredMasjids.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredMasjids.length} masjid{filteredMasjids.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Masjid List */}
        {!isLoading && filteredMasjids.length > 0 && (
          <div className="relative z-[10000]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMasjids.map((masjid) => (
                <div
                  key={masjid.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border-2 ${
                    selectedMasjid?.id === masjid.id 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedMasjid(selectedMasjid?.id === masjid.id ? null : masjid)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 pr-2">
                      {masjid.name}
                      {selectedMasjid?.id === masjid.id && (
                        <span className="ml-2 text-red-500">●</span>
                      )}
                    </h3>
                    {masjid.rating && (
                      <div className="flex items-center space-x-1 text-yellow-500 flex-shrink-0">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{masjid.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {masjid.address}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {masjid.distance.toFixed(1)} km away
                      </span>
                    </div>

                    {masjid.openingHours && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {masjid.openingHours}
                        </span>
                      </div>
                    )}

                    {masjid.amenities && masjid.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {masjid.amenities.slice(0, 2).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(masjid);
                    }}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Get Directions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && userLocation && filteredMasjids.length === 0 && !error && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No masjids found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? 'Try a different search term'
                : 'No masjids found within 5km radius of your location'}
            </p>
          </div>
        )}

        {/* Welcome State */}
        {!userLocation && !error && (
          <div className="text-center py-14 px-4">
            <div className="p-5 bg-green-100 dark:bg-green-900 rounded-full w-24 h-24 mx-auto mb-6 shadow-md flex items-center justify-center">
              <MapPin className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Assalamu Alaikum!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base max-w-md mx-auto mb-4">
              Welcome to the Masjid Finder. Click "Get Current Location" to start discovering masjids near you.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Data is sourced from OpenStreetMap.
            </p>
          </div>
        )}
      </div>
      <MasjidVietnam />

      {/* Selected Masjid Modal */}
      {selectedMasjid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white pr-4">
                  {selectedMasjid.name}
                </h2>
                <button
                  onClick={() => setSelectedMasjid(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMasjid.address}</p>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-center space-x-3">
                  <Navigation className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMasjid.distance.toFixed(1)} km from your location
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {selectedMasjid.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                      <a 
                        href={`tel:${selectedMasjid.phone}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedMasjid.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Opening Hours */}
                {selectedMasjid.openingHours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Opening Hours</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMasjid.openingHours}</p>
                    </div>
                  </div>
                )}

                {/* Website */}
                {selectedMasjid.website && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</p>
                      <a 
                        href={selectedMasjid.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedMasjid.website}
                      </a>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {selectedMasjid.rating && (
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMasjid.rating}/5 stars
                      </p>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {selectedMasjid.amenities && selectedMasjid.amenities.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMasjid.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordinates */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Coordinates: {selectedMasjid.lat.toFixed(6)}, {selectedMasjid.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => openInMaps(selectedMasjid)}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="h-5 w-5" />
                  <span>Get Directions (OpenStreetMap)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openInMapApp(selectedMasjid, 'apple')}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🍎</span>
                    <span>Apple Maps</span>
                  </button>

                  <button
                    onClick={() => openInMapApp(selectedMasjid, 'waze')}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🚗</span>
                    <span>Waze</span>
                  </button>
                </div>

                {/* Share Location */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedMasjid.name,
                        text: `${selectedMasjid.name} - ${selectedMasjid.address}`,
                        url: `https://www.openstreetmap.org/?mlat=${selectedMasjid.lat}&mlon=${selectedMasjid.lng}&zoom=16`
                      });
                    } else {
                      // Fallback: copy to clipboard
                      const shareText = `${selectedMasjid.name}\n${selectedMasjid.address}\nhttps://www.openstreetmap.org/?mlat=${selectedMasjid.lat}&mlon=${selectedMasjid.lng}&zoom=16`;
                      navigator.clipboard.writeText(shareText).then(() => {
                        alert('Copied to clipboard!');
                      });
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasjidLocator;