// Custom hook for Masjid search functionality
import { useState, useCallback, useMemo } from 'react';
import type { MasjidViet, TrangThaiTimKiem } from '../types';
import { VIETNAMESE_TEXT } from '../constants';

export const useMasjidSearch = (
  filterFunction: (tuKhoa: string, vung: string) => MasjidViet[]
) => {
  const [trangThaiTimKiem, setTrangThaiTimKiem] = useState<TrangThaiTimKiem>({
    tuKhoa: '',
    vungDuocChon: VIETNAMESE_TEXT.regions.all
  });

  // Handle search term change
  const handleSearchChange = useCallback((tuKhoa: string) => {
    setTrangThaiTimKiem(prev => ({
      ...prev,
      tuKhoa
    }));
  }, []);

  // Handle region change
  const handleRegionChange = useCallback((vung: string) => {
    setTrangThaiTimKiem(prev => ({
      ...prev,
      vungDuocChon: vung
    }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setTrangThaiTimKiem({
      tuKhoa: '',
      vungDuocChon: VIETNAMESE_TEXT.regions.all
    });
  }, []);

  // Filtered results
  const ketQuaTimKiem = useMemo(() => {
    return filterFunction(trangThaiTimKiem.tuKhoa, trangThaiTimKiem.vungDuocChon);
  }, [filterFunction, trangThaiTimKiem.tuKhoa, trangThaiTimKiem.vungDuocChon]);

  // Search statistics
  const thongKeTimKiem = useMemo(() => {
    const total = ketQuaTimKiem.length;
    const hasSearch = trangThaiTimKiem.tuKhoa.length > 0;
    const hasRegionFilter = trangThaiTimKiem.vungDuocChon !== VIETNAMESE_TEXT.regions.all;
    
    return {
      total,
      hasSearch,
      hasRegionFilter,
      isEmpty: total === 0
    };
  }, [ketQuaTimKiem.length, trangThaiTimKiem.tuKhoa, trangThaiTimKiem.vungDuocChon]);

  return {
    trangThaiTimKiem,
    ketQuaTimKiem,
    thongKeTimKiem,
    handleSearchChange,
    handleRegionChange,
    clearSearch
  };
};
