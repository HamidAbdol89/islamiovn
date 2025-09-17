// Vietnamese interfaces cho Dua component
export interface DuaTextViet {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  TRANSLATED_TEXT: string;
  REPEAT: number;
  AUDIO: string;
}

export interface DuaCategoryViet {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: DuaTextViet[];
}

export interface DuaDataViet {
  Vietnamese: DuaCategoryViet[];
}

// Const object cho các nguồn dua
export const DuaSource = {
  HUSN_MUSLIM_VN: 'husn_vn',
  // Có thể thêm các nguồn khác sau này
  // QURAN_HADITH_VN: 'quran_hadith_vn',
  // CUSTOM_API: 'custom_api'
} as const;

export type DuaSource = typeof DuaSource[keyof typeof DuaSource];

// Interface cho thông tin nguồn dua
export interface DuaSourceInfo {
  id: DuaSource;
  tenNguon: string;
  moTa: string;
  tacGia: string;
  soLuongDua: number;
  ngonNgu: string;
  phienBan: string;
  duongDanFile?: string;
  apiUrl?: string;
  bieuTuong: string;
}

// Interface cho settings
export interface DuaSettings {
  coChuPhong: number;
  tuDongPhat: boolean;
  docLienTuc: boolean;
  amThanh: boolean;
  nguonDuaHienTai: DuaSource;
}

// Interface cho search result
export interface KetQuaTimKiem {
  danhMuc: DuaCategoryViet;
  dua: DuaTextViet;
  viTriDanhMuc: number;
  viTriDua: number;
}

// Interface cho favorite
export interface DuaYeuThich {
  danhMuc: DuaCategoryViet;
  dua: DuaTextViet;
  viTriDanhMuc: number;
  viTriDua: number;
  ngayThem: string;
}

// Const object cho các view
export const DuaView = {
  CHON_NGUON: 'chon_nguon',
  DANH_MUC: 'danh_muc',
  DUA: 'dua',
  YEU_THICH: 'yeu_thich',
  TIM_KIEM: 'tim_kiem'
} as const;

export type DuaView = typeof DuaView[keyof typeof DuaView];

// Interface cho audio player state
export interface AudioPlayerState {
  dangPhat: boolean;
  amLuong: number;
  tatTieng: boolean;
  thoiGianHienTai: number;
  tongThoiGian: number;
}
