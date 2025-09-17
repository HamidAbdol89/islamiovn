// Vietnamese Types for MasjidVietnam Component
export interface MasjidViet {
  id: string;
  ten?: string;
  diaChi?: string;
  thanhPho?: string;
  vung?: string;
  soDienThoai?: string;
  website?: string;
  sucChua?: number;
  namThanhLap?: number;
  hinhAnh?: string;
  thoiGianCau?: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  moTa?: string;
  tienIch?: string[];
}

export interface TrangThaiTimKiem {
  tuKhoa: string;
  vungDuocChon: string;
}

export interface TrangThaiModal {
  masjidDuocChon: MasjidViet | null;
}

export type VungVietNam = 'Tất cả' | 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';

export interface ThongTinVung {
  ten: VungVietNam;
  moTa: string;
  soLuongMasjid: number;
}
