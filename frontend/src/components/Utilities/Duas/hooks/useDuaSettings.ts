import { useState, useCallback, useEffect } from 'react';
import type { DuaSettings, DuaSource } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';

export const useDuaSettings = () => {
  const [caiDat, setCaiDat] = useState<DuaSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const taiCaiDat = () => {
      try {
        const coChuPhong = localStorage.getItem(STORAGE_KEYS.CO_CHU_PHONG);
        const tuDongPhat = localStorage.getItem(STORAGE_KEYS.TU_DONG_PHAT);
        const docLienTuc = localStorage.getItem(STORAGE_KEYS.DOC_LIEN_TUC);
        const tatTieng = localStorage.getItem(STORAGE_KEYS.TAT_TIENG);
        const nguonDua = localStorage.getItem(STORAGE_KEYS.NGUON_DUA);

        setCaiDat({
          coChuPhong: coChuPhong ? parseInt(coChuPhong) : DEFAULT_SETTINGS.coChuPhong,
          tuDongPhat: tuDongPhat === 'true',
          docLienTuc: docLienTuc === 'true',
          amThanh: tatTieng !== 'true',
          nguonDuaHienTai: (nguonDua as DuaSource) || DEFAULT_SETTINGS.nguonDuaHienTai
        });
      } catch (error) {
        console.error('Lỗi tải cài đặt:', error);
        setCaiDat(DEFAULT_SETTINGS);
      }
    };

    taiCaiDat();
  }, []);

  // Update font size
  const capNhatCoChuPhong = useCallback((coChuMoi: number) => {
    setCaiDat(prev => ({ ...prev, coChuPhong: coChuMoi }));
    localStorage.setItem(STORAGE_KEYS.CO_CHU_PHONG, coChuMoi.toString());
  }, []);

  // Update auto play
  const capNhatTuDongPhat = useCallback((tuDongPhat: boolean) => {
    setCaiDat(prev => ({ ...prev, tuDongPhat }));
    localStorage.setItem(STORAGE_KEYS.TU_DONG_PHAT, tuDongPhat.toString());
  }, []);

  // Update continuous reading
  const capNhatDocLienTuc = useCallback((docLienTuc: boolean) => {
    setCaiDat(prev => ({ ...prev, docLienTuc }));
    localStorage.setItem(STORAGE_KEYS.DOC_LIEN_TUC, docLienTuc.toString());
  }, []);

  // Update sound
  const capNhatAmThanh = useCallback((amThanh: boolean) => {
    setCaiDat(prev => ({ ...prev, amThanh }));
    localStorage.setItem(STORAGE_KEYS.TAT_TIENG, (!amThanh).toString());
  }, []);

  // Update dua source
  const capNhatNguonDua = useCallback((nguonDua: DuaSource) => {
    setCaiDat(prev => ({ ...prev, nguonDuaHienTai: nguonDua }));
    localStorage.setItem(STORAGE_KEYS.NGUON_DUA, nguonDua);
  }, []);

  // Reset to defaults
  const datLaiMacDinh = useCallback(() => {
    setCaiDat(DEFAULT_SETTINGS);
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  // Update multiple settings at once
  const capNhatCaiDat = useCallback((caiDatMoi: Partial<DuaSettings>) => {
    setCaiDat(prev => ({ ...prev, ...caiDatMoi }));
    
    // Save to localStorage
    if (caiDatMoi.coChuPhong !== undefined) {
      localStorage.setItem(STORAGE_KEYS.CO_CHU_PHONG, caiDatMoi.coChuPhong.toString());
    }
    if (caiDatMoi.tuDongPhat !== undefined) {
      localStorage.setItem(STORAGE_KEYS.TU_DONG_PHAT, caiDatMoi.tuDongPhat.toString());
    }
    if (caiDatMoi.docLienTuc !== undefined) {
      localStorage.setItem(STORAGE_KEYS.DOC_LIEN_TUC, caiDatMoi.docLienTuc.toString());
    }
    if (caiDatMoi.amThanh !== undefined) {
      localStorage.setItem(STORAGE_KEYS.TAT_TIENG, (!caiDatMoi.amThanh).toString());
    }
    if (caiDatMoi.nguonDuaHienTai !== undefined) {
      localStorage.setItem(STORAGE_KEYS.NGUON_DUA, caiDatMoi.nguonDuaHienTai);
    }
  }, []);

  return {
    caiDat,
    capNhatCoChuPhong,
    capNhatTuDongPhat,
    capNhatDocLienTuc,
    capNhatAmThanh,
    capNhatNguonDua,
    capNhatCaiDat,
    datLaiMacDinh
  };
};
