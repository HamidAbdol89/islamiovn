import { useMemo } from 'react';
import type { GiaTriTaiSan, KhoiLuongKimLoai, GiaVangBac, KetQuaZakat } from '../types';
import { NISAB_VANG_GRAM, NISAB_BAC_GRAM, TY_LE_ZAKAT } from '../constants';

export const useZakatCalculation = (
  taiSan: GiaTriTaiSan,
  khoiLuongKimLoai: KhoiLuongKimLoai,
  giaKimLoai: GiaVangBac
): KetQuaZakat => {
  return useMemo(() => {
    // Calculate nisab values in VND
    const nisabVangVND = NISAB_VANG_GRAM * giaKimLoai.giaVangMoiGram;
    const nisabBacVND = NISAB_BAC_GRAM * giaKimLoai.giaBacMoiGram;
    const nguongNisab = Math.min(nisabVangVND, nisabBacVND);

    // Calculate precious metals value
    const giaTriVangVND = khoiLuongKimLoai.vangGram * giaKimLoai.giaVangMoiGram;
    const giaTriBacVND = khoiLuongKimLoai.bacGram * giaKimLoai.giaBacMoiGram;

    // Calculate total assets
    const tongTaiSan = 
      taiSan.tienMat + 
      taiSan.tietKiem + 
      taiSan.vang + 
      taiSan.bac + 
      taiSan.dauTu + 
      taiSan.kinhDoanh + 
      giaTriVangVND + 
      giaTriBacVND;

    // Calculate net assets
    const taiSanRong = tongTaiSan - taiSan.congNo;

    // Check if eligible for zakat
    const duDieuKienZakat = taiSanRong >= nguongNisab;
    const soTienZakat = duDieuKienZakat ? taiSanRong * TY_LE_ZAKAT : 0;

    return {
      tongTaiSan,
      taiSanRong,
      soTienZakat,
      duDieuKienZakat,
      nguongNisab,
      nisabVangVND,
      nisabBacVND
    };
  }, [taiSan, khoiLuongKimLoai, giaKimLoai]);
};
