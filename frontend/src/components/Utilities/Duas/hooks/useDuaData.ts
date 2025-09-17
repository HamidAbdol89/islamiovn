import { useState, useEffect, useCallback, useMemo } from 'react';
import { type DuaDataViet, DuaSource, type KetQuaTimKiem } from '../types';
import { DUA_SOURCES } from '../constants';

// Import JSON data
import duaDataViet from '@/assets/dua/husn_vn.json';

export const useDuaData = (nguonDua: DuaSource) => {
  const [duLieu, setDuLieu] = useState<DuaDataViet | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);

  // Load data based on source
  useEffect(() => {
    const taiDuLieu = async () => {
      setDangTai(true);
      setLoi(null);

      try {
        switch (nguonDua) {
          case DuaSource.HUSN_MUSLIM_VN:
            setDuLieu(duaDataViet as DuaDataViet);
            break;
          // Có thể thêm các nguồn khác sau này
          default:
            setDuLieu(duaDataViet as DuaDataViet);
        }
      } catch (error) {
        setLoi('Không thể tải dữ liệu dua');
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setDangTai(false);
      }
    };

    taiDuLieu();
  }, [nguonDua]);

  // Search function
  const timKiem = useCallback((tuKhoa: string): KetQuaTimKiem[] => {
    if (!duLieu || !tuKhoa.trim()) return [];

    const tuKhoaLower = tuKhoa.toLowerCase().trim();
    const ketQua: KetQuaTimKiem[] = [];

    duLieu.Vietnamese.forEach((danhMuc, viTriDanhMuc) => {
      if (!danhMuc || !Array.isArray(danhMuc.TEXT)) return;

      danhMuc.TEXT.forEach((dua, viTriDua) => {
        if (!dua) return;

        const timThay = 
          dua.ARABIC_TEXT?.toLowerCase().includes(tuKhoaLower) ||
          dua.TRANSLATED_TEXT?.toLowerCase().includes(tuKhoaLower) ||
          dua.LANGUAGE_ARABIC_TRANSLATED_TEXT?.toLowerCase().includes(tuKhoaLower) ||
          danhMuc.TITLE?.toLowerCase().includes(tuKhoaLower);

        if (timThay) {
          ketQua.push({
            danhMuc,
            dua,
            viTriDanhMuc,
            viTriDua
          });
        }
      });
    });

    return ketQua;
  }, [duLieu]);

  // Memoized source info
  const thongTinNguon = useMemo(() => 
    DUA_SOURCES[nguonDua],
    [nguonDua]
  );

  return {
    duLieu,
    dangTai,
    loi,
    timKiem,
    thongTinNguon
  };
};
