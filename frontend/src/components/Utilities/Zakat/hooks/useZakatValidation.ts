import { useCallback } from 'react';
import type { GiaTriTaiSan, KhoiLuongKimLoai, ValidationError, TaiSanKey, KimLoaiKey } from '../types';
import { THONG_BAO_LOI } from '../constants';

const MAX_VALUE = 999999999999; // 999 billion VND
const MAX_WEIGHT = 99999; // 99,999 grams

export const useZakatValidation = () => {
  const validateTaiSanField = useCallback((key: TaiSanKey, value: number): ValidationError | null => {
    if (value < 0) {
      return { field: key, message: THONG_BAO_LOI.SO_AM };
    }
    if (value > MAX_VALUE) {
      return { field: key, message: THONG_BAO_LOI.QUA_LON };
    }
    if (isNaN(value)) {
      return { field: key, message: THONG_BAO_LOI.KHONG_HOP_LE };
    }
    return null;
  }, []);

  const validateKimLoaiField = useCallback((key: KimLoaiKey, value: number): ValidationError | null => {
    if (value < 0) {
      return { field: key, message: THONG_BAO_LOI.SO_AM };
    }
    if (value > MAX_WEIGHT) {
      return { field: key, message: THONG_BAO_LOI.QUA_LON };
    }
    if (isNaN(value)) {
      return { field: key, message: THONG_BAO_LOI.KHONG_HOP_LE };
    }
    return null;
  }, []);

  const validateAllTaiSan = useCallback((taiSan: GiaTriTaiSan): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    (Object.keys(taiSan) as TaiSanKey[]).forEach(key => {
      const error = validateTaiSanField(key, taiSan[key]);
      if (error) errors.push(error);
    });

    return errors;
  }, [validateTaiSanField]);

  const validateAllKimLoai = useCallback((kimLoai: KhoiLuongKimLoai): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    (Object.keys(kimLoai) as KimLoaiKey[]).forEach(key => {
      const error = validateKimLoaiField(key, kimLoai[key]);
      if (error) errors.push(error);
    });

    return errors;
  }, [validateKimLoaiField]);

  const isValidNumber = useCallback((value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num >= 0;
  }, []);

  const sanitizeInput = useCallback((value: string): number => {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.max(0, num);
  }, []);

  return {
    validateTaiSanField,
    validateKimLoaiField,
    validateAllTaiSan,
    validateAllKimLoai,
    isValidNumber,
    sanitizeInput
  };
};
