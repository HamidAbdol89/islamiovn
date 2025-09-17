import { Calculator, DollarSign, Coins, Building2, TrendingUp } from 'lucide-react';
import type { BuocTinhZakat } from './types';

// Islamic Zakat constants
export const NISAB_VANG_GRAM = 87.48;
export const NISAB_BAC_GRAM = 612.36;
export const TY_LE_ZAKAT = 0.025;

// Vietnamese Zakat calculation steps
export const BUOC_TINH_ZAKAT: readonly BuocTinhZakat[] = [
  {
    id: 1,
    tieuDe: 'Tiền mặt & Tiết kiệm',
    moTa: 'Nhập số tiền mặt và tiết kiệm ngân hàng',
    icon: DollarSign,
    loai: 'tienMat'
  },
  {
    id: 2,
    tieuDe: 'Kim loại quý',
    moTa: 'Nhập khối lượng vàng và bạc sở hữu',
    icon: Coins,
    loai: 'kimLoai'
  },
  {
    id: 3,
    tieuDe: 'Tài sản khác',
    moTa: 'Đầu tư, cổ phiếu và tài sản kinh doanh',
    icon: TrendingUp,
    loai: 'taiSan'
  },
  {
    id: 4,
    tieuDe: 'Công nợ',
    moTa: 'Tổng số nợ và nghĩa vụ tài chính',
    icon: Building2,
    loai: 'congNo'
  },
  {
    id: 5,
    tieuDe: 'Kết quả Zakat',
    moTa: 'Xem kết quả tính toán Zakat của bạn',
    icon: Calculator,
    loai: 'ketQua'
  }
] as const;

// Quick amount presets for Vietnamese currency
export const SO_TIEN_NHANH = [
  { nhan: '100K', giaTri: 100000 },
  { nhan: '500K', giaTri: 500000 },
  { nhan: '1TR', giaTri: 1000000 },
  { nhan: '5TR', giaTri: 5000000 },
  { nhan: '10TR', giaTri: 10000000 },
  { nhan: '50TR', giaTri: 50000000 }
] as const;

// Default gold/silver prices (VND per gram)
export const GIA_KIM_LOAI_MAC_DINH = {
  giaVangMoiGram: 1650000,
  giaBacMoiGram: 21500
} as const;

// Validation messages
export const THONG_BAO_LOI = {
  SO_AM: 'Giá trị không được âm',
  QUA_LON: 'Giá trị quá lớn',
  KHONG_HOP_LE: 'Vui lòng nhập số hợp lệ',
  BAT_BUOC: 'Trường này là bắt buộc'
} as const;

// localStorage keys
export const STORAGE_KEYS = {
  ZAKAT_DATA: 'zakat_calculator_data',
  ZAKAT_HISTORY: 'zakat_calculation_history',
  GOLD_SILVER_PRICES: 'gold_silver_prices_cache'
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

// Chart colors for asset visualization
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16'  // lime
] as const;
