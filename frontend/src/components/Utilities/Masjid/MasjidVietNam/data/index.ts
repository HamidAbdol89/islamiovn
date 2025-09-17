// Main data export with lazy loading support
import type { MasjidViet } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

// Static imports for immediate availability
import masjidMienNam from './masjidMienNam';
import masjidMienBac from './masjidMienBac';
import masjidMienTrung from './masjidMienTrung';

// Combined data
export const allMasjidData: MasjidViet[] = [
  ...masjidMienNam,
  ...masjidMienBac,
  ...masjidMienTrung
];

// Data by region for lazy loading
export const masjidDataByRegion = {
  [VIETNAMESE_TEXT.regions.southern]: masjidMienNam,
  [VIETNAMESE_TEXT.regions.northern]: masjidMienBac,
  [VIETNAMESE_TEXT.regions.central]: masjidMienTrung,
  [VIETNAMESE_TEXT.regions.all]: allMasjidData
};

// Async loaders for future API integration
export const loadMasjidByRegion = async (region: string): Promise<MasjidViet[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  switch (region) {
    case VIETNAMESE_TEXT.regions.southern:
      return masjidMienNam;
    case VIETNAMESE_TEXT.regions.northern:
      return masjidMienBac;
    case VIETNAMESE_TEXT.regions.central:
      return masjidMienTrung;
    default:
      return allMasjidData;
  }
};

// Statistics
export const masjidStatistics = {
  total: allMasjidData.length,
  byRegion: {
    [VIETNAMESE_TEXT.regions.southern]: masjidMienNam.length,
    [VIETNAMESE_TEXT.regions.northern]: masjidMienBac.length,
    [VIETNAMESE_TEXT.regions.central]: masjidMienTrung.length
  },
  withPrayerTimes: allMasjidData.filter(m => m.thoiGianCau).length,
  withFacilities: allMasjidData.filter(m => m.tienIch && m.tienIch.length > 0).length,
  withPhone: allMasjidData.filter(m => m.soDienThoai).length,
  withWebsite: allMasjidData.filter(m => m.website).length
};

// Export individual region data
export { masjidMienNam, masjidMienBac, masjidMienTrung };

// Default export
export default allMasjidData;
