import { useState, useCallback, useEffect, useMemo } from 'react';
import { type DuaYeuThich, type DuaDataViet } from '../types';
import { STORAGE_KEYS } from '../constants';

export const useDuaFavorites = (duLieu: DuaDataViet | null) => {
  const [danhSachYeuThich, setDanhSachYeuThich] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const taiYeuThich = () => {
      try {
        const yeuThichDaLuu = localStorage.getItem(STORAGE_KEYS.YEU_THICH);
        if (yeuThichDaLuu) {
          const danhSach = JSON.parse(yeuThichDaLuu);
          setDanhSachYeuThich(new Set(danhSach));
        }
      } catch (error) {
        console.error('Lỗi tải danh sách yêu thích:', error);
        setDanhSachYeuThich(new Set());
      }
    };

    taiYeuThich();
  }, []);

  // Save favorites to localStorage
  const luuYeuThich = useCallback((danhSach: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEYS.YEU_THICH, JSON.stringify([...danhSach]));
    } catch (error) {
      console.error('Lỗi lưu danh sách yêu thích:', error);
    }
  }, []);

  // Toggle favorite status
  const toggleYeuThich = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    const khoaYeuThich = `${viTriDanhMuc}-${viTriDua}`;
    
    setDanhSachYeuThich(prev => {
      const danhSachMoi = new Set(prev);
      
      if (danhSachMoi.has(khoaYeuThich)) {
        danhSachMoi.delete(khoaYeuThich);
      } else {
        danhSachMoi.add(khoaYeuThich);
      }
      
      luuYeuThich(danhSachMoi);
      return danhSachMoi;
    });
  }, [luuYeuThich]);

  // Check if dua is favorite
  const laYeuThich = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    const khoaYeuThich = `${viTriDanhMuc}-${viTriDua}`;
    return danhSachYeuThich.has(khoaYeuThich);
  }, [danhSachYeuThich]);

  // Add to favorites
  const themYeuThich = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    const khoaYeuThich = `${viTriDanhMuc}-${viTriDua}`;
    
    setDanhSachYeuThich(prev => {
      if (prev.has(khoaYeuThich)) return prev;
      
      const danhSachMoi = new Set(prev);
      danhSachMoi.add(khoaYeuThich);
      luuYeuThich(danhSachMoi);
      return danhSachMoi;
    });
  }, [luuYeuThich]);

  // Remove from favorites
  const xoaYeuThich = useCallback((viTriDanhMuc: number, viTriDua: number) => {
    const khoaYeuThich = `${viTriDanhMuc}-${viTriDua}`;
    
    setDanhSachYeuThich(prev => {
      if (!prev.has(khoaYeuThich)) return prev;
      
      const danhSachMoi = new Set(prev);
      danhSachMoi.delete(khoaYeuThich);
      luuYeuThich(danhSachMoi);
      return danhSachMoi;
    });
  }, [luuYeuThich]);

  // Clear all favorites
  const xoaTatCaYeuThich = useCallback(() => {
    setDanhSachYeuThich(new Set());
    localStorage.removeItem(STORAGE_KEYS.YEU_THICH);
  }, []);

  // Get detailed favorites list
  const danhSachYeuThichChiTiet = useMemo((): DuaYeuThich[] => {
    if (!duLieu) return [];

    const danhSach: DuaYeuThich[] = [];

    danhSachYeuThich.forEach((khoaYeuThich) => {
      const [viTriDanhMuc, viTriDua] = khoaYeuThich.split('-').map(Number);
      const danhMuc = duLieu.Vietnamese[viTriDanhMuc];
      const dua = danhMuc?.TEXT[viTriDua];

      if (danhMuc && dua) {
        danhSach.push({
          danhMuc,
          dua,
          viTriDanhMuc,
          viTriDua,
          ngayThem: new Date().toISOString() // Có thể cải thiện bằng cách lưu thời gian thực tế
        });
      }
    });

    return danhSach;
  }, [duLieu, danhSachYeuThich]);

  // Get favorites count
  const soLuongYeuThich = useMemo(() => 
    danhSachYeuThich.size,
    [danhSachYeuThich]
  );

  return {
    danhSachYeuThich,
    danhSachYeuThichChiTiet,
    soLuongYeuThich,
    toggleYeuThich,
    laYeuThich,
    themYeuThich,
    xoaYeuThich,
    xoaTatCaYeuThich
  };
};
