import { useState, useCallback } from 'react';
import type { MasjidViet, ViTriNguoiDung, UseMasjidDataReturn, OverpassResponse } from '../types';
import { VIETNAMESE_TEXT, OVERPASS_API_URL, OVERPASS_QUERY_TEMPLATE, MAP_CONFIG, DEFAULT_MASJID_NAMES } from '../constants';

/**
 * Custom hook để quản lý dữ liệu masjid với Vietnamese interface
 */
export const useMasjidData = (): UseMasjidDataReturn => {
  const [masjids, setMasjids] = useState<MasjidViet[]>([]);
  const [dangTai, setDangTai] = useState<boolean>(false);
  const [loi, setLoi] = useState<string>('');

  // Tính khoảng cách giữa hai điểm
  const tinhKhoangCach = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Chuyển đổi amenities sang tiếng Việt
  const chuyenDoiTienNghi = useCallback((tags: any): string[] => {
    const tienNghi: string[] = [];
    
    if (tags?.wheelchair === 'yes') {
      tienNghi.push(VIETNAMESE_TEXT.tienNghiXeInvalid);
    }
    
    if (tags?.parking) {
      tienNghi.push(VIETNAMESE_TEXT.tienNghiBaiDauXe);
    }
    
    if (tags?.['addr:postcode']) {
      tienNghi.push(`Mã bưu điện: ${tags['addr:postcode']}`);
    }
    
    return tienNghi;
  }, []);

  // Lấy tên masjid với ưu tiên tiếng Việt
  const layTenMasjid = useCallback((tags: any, index: number): string => {
    return tags?.['name:vi'] || 
           tags?.name || 
           tags?.['name:en'] || 
           DEFAULT_MASJID_NAMES[index % DEFAULT_MASJID_NAMES.length];
  }, []);

  // Tạo địa chỉ từ tags
  const taodiaChi = useCallback((tags: any): string => {
    const cacThanhPhan = [
      tags?.['addr:street'] && tags?.['addr:housenumber'] 
        ? `${tags['addr:housenumber']} ${tags['addr:street']}`
        : tags?.['addr:street'],
      tags?.['addr:district'],
      tags?.['addr:city'] || tags?.['addr:province']
    ].filter(Boolean);
    
    return cacThanhPhan.length > 0 ? cacThanhPhan.join(', ') : 'Địa chỉ không có sẵn';
  }, []);

  const timKiemMasjidGanDay = useCallback(async (viTri: ViTriNguoiDung): Promise<void> => {
    setDangTai(true);
    setLoi('');

    try {
      const overpassQuery = OVERPASS_QUERY_TEMPLATE(viTri.lat, viTri.lng);

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error(VIETNAMESE_TEXT.khongTheTaiDuLieu);
      }

      const data: OverpassResponse = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const danhSachMasjid: MasjidViet[] = data.elements
          .filter((element) => element.lat && element.lon)
          .map((element, index) => {
            const lat = element.lat || (element.center ? element.center.lat : 0);
            const lng = element.lon || (element.center ? element.center.lon : 0);
            
            return {
              id: element.id?.toString() || `masjid-${index}`,
              ten: layTenMasjid(element.tags, index),
              diaChi: taodiaChi(element.tags),
              lat,
              lng,
              khoangCach: tinhKhoangCach(viTri.lat, viTri.lng, lat, lng),
              soDienThoai: element.tags?.phone,
              website: element.tags?.website,
              gioMoCua: element.tags?.opening_hours,
              tienNghi: chuyenDoiTienNghi(element.tags)
            };
          })
          .sort((a, b) => a.khoangCach - b.khoangCach)
          .slice(0, MAP_CONFIG.maxResults);

        setMasjids(danhSachMasjid);
        
        if (danhSachMasjid.length === 0) {
          setLoi(VIETNAMESE_TEXT.khongCoMasjidTrongBanKinh5km);
        }
      } else {
        setLoi(VIETNAMESE_TEXT.khongCoMasjidTrongKhuVuc);
      }
    } catch (apiError) {
      console.error('Lỗi khi tải dữ liệu masjid:', apiError);
      setLoi(VIETNAMESE_TEXT.kiemTraKetNoiMang);
    } finally {
      setDangTai(false);
    }
  }, [tinhKhoangCach, chuyenDoiTienNghi, layTenMasjid, taodiaChi]);

  const xoaLoi = useCallback(() => {
    setLoi('');
  }, []);

  return {
    masjids,
    dangTai,
    loi,
    timKiemMasjidGanDay,
    xoaLoi,
  };
};
