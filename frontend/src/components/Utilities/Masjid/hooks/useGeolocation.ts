import { useState, useCallback } from 'react';
import type { ViTriNguoiDung, UseGeolocationReturn } from '../types';
import { VIETNAMESE_TEXT, GEOLOCATION_CONFIG } from '../constants';

/**
 * Custom hook để quản lý geolocation với Vietnamese interface
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [viTriNguoiDung, setViTriNguoiDung] = useState<ViTriNguoiDung | null>(null);
  const [dangTaiViTri, setDangTaiViTri] = useState<boolean>(false);
  const [loi, setLoi] = useState<string>('');

  const layViTriHienTai = useCallback((): void => {
    setDangTaiViTri(true);
    setLoi('');
    
    if (!navigator.geolocation) {
      setLoi(VIETNAMESE_TEXT.khongHoTroViTri);
      setDangTaiViTri(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const viTri: ViTriNguoiDung = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setViTriNguoiDung(viTri);
        setDangTaiViTri(false);
        setLoi('');
      },
      (_error) => {
        setLoi(VIETNAMESE_TEXT.khongTheLayViTri);
        setDangTaiViTri(false);
      },
      GEOLOCATION_CONFIG
    );
  }, []);

  return {
    viTriNguoiDung,
    dangTaiViTri,
    loi,
    layViTriHienTai,
  };
};
