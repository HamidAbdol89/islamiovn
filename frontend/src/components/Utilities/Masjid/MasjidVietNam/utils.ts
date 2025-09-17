// Utility functions for MasjidVietnam Component
import type { Mosque } from './mosque.types';
import type { MasjidViet } from './types';
import { REGION_MAPPING } from './constants';

// Transform English mosque data to Vietnamese interface
export const transformMosqueToVietnamese = (mosque: Mosque): MasjidViet => {
  return {
    id: mosque.id,
    ten: mosque.name,
    diaChi: mosque.address,
    thanhPho: mosque.city,
    vung: mosque.region ? REGION_MAPPING[mosque.region as keyof typeof REGION_MAPPING] : undefined,
    soDienThoai: mosque.phone,
    website: mosque.website,
    sucChua: mosque.capacity,
    namThanhLap: mosque.foundedYear,
    hinhAnh: mosque.image,
    thoiGianCau: mosque.prayerTimes,
    moTa: mosque.description,
    tienIch: mosque.facilities
  };
};

// Transform array of mosques to Vietnamese
export const transformMosqueArrayToVietnamese = (mosques: Mosque[]): MasjidViet[] => {
  return mosques.map(transformMosqueToVietnamese);
};

// Format number with Vietnamese locale
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN');
};

// Format text with placeholders
export const formatText = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
};
