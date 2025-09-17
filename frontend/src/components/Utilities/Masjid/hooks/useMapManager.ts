import { useState, useEffect, useRef, useCallback } from 'react';
import type { MasjidViet, ViTriNguoiDung, UseMapManagerReturn } from '../types';
import { MAP_CONFIG, VIETNAMESE_TEXT } from '../constants';

// Declare global Leaflet
declare global {
  interface Window {
    L: any;
  }
}

/**
 * Custom hook để quản lý bản đồ Leaflet với Vietnamese interface
 */
export const useMapManager = (): UseMapManagerReturn => {
  const [leafletDaTai, setLeafletDaTai] = useState<boolean>(false);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Load Leaflet CSS và JS
  useEffect(() => {
    const taiLeaflet = async () => {
      // Tải CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = MAP_CONFIG.leafletCssUrl;
        document.head.appendChild(link);
      }

      // Tải JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = MAP_CONFIG.leafletJsUrl;
        script.onload = () => setLeafletDaTai(true);
        document.head.appendChild(script);
      } else {
        setLeafletDaTai(true);
      }
    };

    taiLeaflet();
  }, []);

  const khoiTaoBanDo = useCallback((viTri: ViTriNguoiDung) => {
    if (!window.L || !viTri || !mapContainerRef.current || mapRef.current) return;

    try {
      // Khởi tạo bản đồ
      mapRef.current = window.L.map(mapContainerRef.current).setView([viTri.lat, viTri.lng], MAP_CONFIG.defaultZoom);

      // Thêm tile layer
      window.L.tileLayer(MAP_CONFIG.tileLayerUrl, {
        attribution: MAP_CONFIG.attribution
      }).addTo(mapRef.current);

      // Thêm marker vị trí người dùng
      const userIcon = window.L.divIcon({
        html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        className: 'custom-user-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      window.L.marker([viTri.lat, viTri.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup(VIETNAMESE_TEXT.viTriCuaBan)
        .openPopup();

    } catch (error) {
      console.error('Lỗi khởi tạo bản đồ:', error);
    }
  }, []);

  const capNhatMarkers = useCallback((
    masjids: MasjidViet[], 
    masjidDuocChon: MasjidViet | null, 
    viTriNguoiDung: ViTriNguoiDung | null
  ) => {
    if (!mapRef.current || !window.L) return;

    // Xóa các marker masjid hiện tại (giữ lại marker người dùng)
    mapRef.current.eachLayer((layer: any) => {
      if (layer.options && layer.options.masjidMarker) {
        mapRef.current.removeLayer(layer);
      }
    });

    // Thêm marker cho các masjid
    const bounds = window.L.latLngBounds();
    
    // Thêm vị trí người dùng vào bounds
    if (viTriNguoiDung) {
      bounds.extend([viTriNguoiDung.lat, viTriNguoiDung.lng]);
    }

    masjids.forEach((masjid) => {
      const duocChon = masjidDuocChon?.id === masjid.id;
      
      const masjidIcon = window.L.divIcon({
        html: `
          <div class="masjid-marker ${duocChon ? 'selected' : ''}">
            🕌
          </div>
        `,
        className: '', // Xóa class mặc định để sử dụng class tùy chỉnh
        iconSize: [60, 60],
        iconAnchor: [30, 30],
      });

      window.L.marker([masjid.lat, masjid.lng], { 
        icon: masjidIcon,
        masjidMarker: true
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${masjid.ten}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${masjid.diaChi}</p>
            <p style="margin: 0 0 8px 0; color: #16a34a; font-weight: 500;">${masjid.khoangCach.toFixed(1)} km</p>
            ${masjid.soDienThoai ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">📞 ${masjid.soDienThoai}</p>` : ''}
            ${masjid.gioMoCua ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">🕐 ${masjid.gioMoCua}</p>` : ''}
            <button onclick="window.open('https://www.openstreetmap.org/directions?from=${viTriNguoiDung?.lat},${viTriNguoiDung?.lng}&to=${masjid.lat},${masjid.lng}', '_blank')" 
                    style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 4px;">
              ${VIETNAMESE_TEXT.layHuongDan}
            </button>
          </div>
        `);

      bounds.extend([masjid.lat, masjid.lng]);
    });

    // Fit bản đồ để hiển thị tất cả markers
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, []);

  return {
    mapRef,
    mapContainerRef,
    leafletDaTai,
    khoiTaoBanDo,
    capNhatMarkers,
  };
};
