// Custom hook for Masjid data management
import { useMemo } from 'react';
import type { MasjidViet } from '../types';
import { allMasjidData, masjidStatistics } from '../data';
import { VIETNAMESE_TEXT } from '../constants';

export const useMasjidData = () => {
  // Use Vietnamese data directly
  const masjidData = useMemo(() => {
    return allMasjidData;
  }, []);

  // Filter function
  const filterMasjids = useMemo(() => {
    return (tuKhoa: string, vungDuocChon: string): MasjidViet[] => {
      return masjidData.filter(masjid => {
        const matchesSearch = 
          masjid.ten?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          masjid.thanhPho?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
          masjid.diaChi?.toLowerCase().includes(tuKhoa.toLowerCase());
        
        const matchesRegion = vungDuocChon === VIETNAMESE_TEXT.regions.all || masjid.vung === vungDuocChon;
        
        return matchesSearch && matchesRegion;
      });
    };
  }, [masjidData]);

  // Get statistics
  const statistics = useMemo(() => {
    return {
      total: masjidStatistics.total,
      byRegion: masjidStatistics.byRegion,
      withPrayerTimes: masjidStatistics.withPrayerTimes,
      withFacilities: masjidStatistics.withFacilities,
      withPhone: masjidStatistics.withPhone,
      withWebsite: masjidStatistics.withWebsite
    };
  }, []);

  return {
    masjidData,
    filterMasjids,
    statistics
  };
};
