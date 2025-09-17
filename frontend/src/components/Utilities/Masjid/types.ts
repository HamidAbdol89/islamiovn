/**
 * Types và interfaces cho Masjid Locator với Vietnamese naming conventions
 */

export interface MasjidViet {
  id: string;
  ten: string;
  diaChi: string;
  lat: number;
  lng: number;
  khoangCach: number;
  soDienThoai?: string;
  danhGia?: number;
  gioMoCua?: string;
  website?: string;
  tienNghi?: string[];
}

export interface ViTriNguoiDung {
  lat: number;
  lng: number;
}

export interface TrangThaiMasjid {
  masjids: MasjidViet[];
  masjidDuocChon: MasjidViet | null;
  tuKhoaTimKiem: string;
  dangTai: boolean;
  loi: string;
  dangTaiViTri: boolean;
  hienThiBanDo: boolean;
  leafletDaTai: boolean;
}

export interface CauHinhBanDo {
  zoom: number;
  banKinhTimKiem: number; // km
  soLuongKetQuaToiDa: number;
}

export interface TienNghiMasjid {
  coXeInvalid: boolean;
  coBaiDauXe: boolean;
  coWifi: boolean;
  coNhaVeSinh: boolean;
  coKhuVucPhuNu: boolean;
  coKhuVucTreEm: boolean;
}

export interface ThongTinLienLac {
  soDienThoai?: string;
  email?: string;
  website?: string;
  facebook?: string;
}

export interface GioHoatDong {
  thu2: string;
  thu3: string;
  thu4: string;
  thu5: string;
  thu6: string;
  thu7: string;
  chuNhat: string;
}

// Hook return types
export interface UseMasjidDataReturn {
  masjids: MasjidViet[];
  dangTai: boolean;
  loi: string;
  timKiemMasjidGanDay: (viTri: ViTriNguoiDung) => Promise<void>;
  xoaLoi: () => void;
}

export interface UseGeolocationReturn {
  viTriNguoiDung: ViTriNguoiDung | null;
  dangTaiViTri: boolean;
  loi: string;
  layViTriHienTai: () => void;
}

export interface UseMapManagerReturn {
  mapRef: React.MutableRefObject<any>;
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  leafletDaTai: boolean;
  khoiTaoBanDo: (viTri: ViTriNguoiDung) => void;
  capNhatMarkers: (masjids: MasjidViet[], masjidDuocChon: MasjidViet | null, viTriNguoiDung: ViTriNguoiDung | null) => void;
}

// Component props
export interface MasjidHeaderProps {
  onToggleTheme: () => void;
}

export interface MasjidSearchProps {
  tuKhoa: string;
  onChange: (tuKhoa: string) => void;
  placeholder?: string;
}

export interface MasjidCardProps {
  masjid: MasjidViet;
  duocChon: boolean;
  onClick: () => void;
  onGetDirections: (masjid: MasjidViet) => void;
}

export interface MasjidMapProps {
  hienThi: boolean;
  onToggle: () => void;
  masjids: MasjidViet[];
  masjidDuocChon: MasjidViet | null;
  viTriNguoiDung: ViTriNguoiDung | null;
}

export interface MasjidModalProps {
  masjid: MasjidViet | null;
  onClose: () => void;
  onGetDirections: (masjid: MasjidViet) => void;
  onOpenInApp: (masjid: MasjidViet, app: string) => void;
  viTriNguoiDung: ViTriNguoiDung | null;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// API Response types
export interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    'name:vi'?: string;
    'name:en'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:district'?: string;
    'addr:city'?: string;
    'addr:province'?: string;
    'addr:postcode'?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    wheelchair?: string;
    parking?: string;
  };
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
