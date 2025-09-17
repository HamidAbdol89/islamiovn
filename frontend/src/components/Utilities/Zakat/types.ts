export interface GiaTriTaiSan {
  tienMat: number;
  tietKiem: number;
  vang: number;
  bac: number;
  dauTu: number;
  kinhDoanh: number;
  congNo: number;
}

export interface GiaVangBac {
  giaVangMoiGram: number;
  giaBacMoiGram: number;
}

export interface KhoiLuongKimLoai {
  vangGram: number;
  bacGram: number;
}

export interface BuocTinhZakat {
  id: number;
  tieuDe: string;
  moTa: string;
  icon: React.ComponentType<any>;
  loai: 'tienMat' | 'kimLoai' | 'taiSan' | 'congNo' | 'ketQua';
}

export interface KetQuaZakat {
  tongTaiSan: number;
  taiSanRong: number;
  soTienZakat: number;
  duDieuKienZakat: boolean;
  nguongNisab: number;
  nisabVangVND: number;
  nisabBacVND: number;
}

export interface ZakatHistory {
  id: string;
  ngayTinh: string;
  taiSan: GiaTriTaiSan;
  kimLoai: KhoiLuongKimLoai;
  giaKimLoai: GiaVangBac;
  ketQua: KetQuaZakat;
}

export interface ValidationError {
  field: keyof GiaTriTaiSan | keyof KhoiLuongKimLoai;
  message: string;
}

export interface ZakatFormData {
  taiSan: GiaTriTaiSan;
  khoiLuongKimLoai: KhoiLuongKimLoai;
  giaKimLoai: GiaVangBac;
}

export type TaiSanKey = keyof GiaTriTaiSan;
export type KimLoaiKey = keyof KhoiLuongKimLoai;
