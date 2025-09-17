import type { DuaSourceInfo } from './types';
import { DuaSource } from './types';

// Vietnamese text constants
export const VIETNAMESE_TEXT = {
  // Header
  TIEU_DE_CHINH: 'Dua - Lời Cầu Nguyện',
  TIEU_DE_DANH_MUC: 'Danh Mục Dua',
  TIEU_DE_YEU_THICH: 'Dua Yêu Thích',
  TIEU_DE_TIM_KIEM: 'Tìm Kiếm Dua',
  TIEU_DE_CAI_DAT: 'Cài Đặt Dua',
  TIEU_DE_CHON_NGUON: 'Chọn Nguồn Dua',

  // Navigation
  DANH_MUC: 'Danh Mục',
  YEU_THICH: 'Yêu Thích',
  TIM_KIEM: 'Tìm Kiếm',
  CAI_DAT: 'Cài Đặt',
  QUAY_LAI: 'Quay Lại',

  // Search
  TIM_KIEM_DUA: 'Tìm kiếm dua...',
  KHONG_TIM_THAY: 'Không tìm thấy dua nào',
  KET_QUA_TIM_KIEM: 'Kết quả tìm kiếm',

  // Audio Controls
  PHAT: 'Phát',
  TAM_DUNG: 'Tạm Dừng',
  TIEP_THEO: 'Tiếp Theo',
  TRUOC_DO: 'Trước Đó',
  TAT_TIENG: 'Tắt Tiếng',
  BAT_TIENG: 'Bật Tiếng',
  DOC_LIEN_TUC: 'Đọc Liên Tục',
  TU_DONG_PHAT: 'Tự Động Phát',

  // Favorites
  THEM_YEU_THICH: 'Thêm Yêu Thích',
  DA_YEU_THICH: 'Đã Yêu Thích',
  KHONG_CO_YEU_THICH: 'Chưa có dua yêu thích',
  HUONG_DAN_YEU_THICH: 'Thêm dua vào yêu thích bằng cách nhấn vào biểu tượng trái tim',

  // Settings
  CO_CHU_PHONG: 'Cỡ Chữ Phông',
  DIEU_CHINH_CO_CHU: 'Điều chỉnh cỡ chữ để đọc dễ hơn',
  CAI_DAT_AM_THANH: 'Cài Đặt Âm Thanh',
  CAU_HINH_PHAT_AM_THANH: 'Cấu hình cách phát âm thanh',
  HANH_DONG_NHANH: 'Hành Động Nhanh',
  TRUY_CAP_TINH_NANG_BO_SUNG: 'Truy cập tính năng bổ sung và thống kê',
  THONG_KE_DOC: 'Thống Kê Đọc',
  XEM_TIEN_DO_DOC: 'Xem tiến độ đọc của bạn',
  LICH_SU_DOC: 'Lịch Sử Đọc',
  XEM_DUA_DA_DOC: 'Xem các dua đã đọc gần đây',

  // Content
  BAN_DICH: 'Bản Dịch',
  PHIEN_AM: 'Phiên Âm',
  CHIA_SE: 'Chia Sẻ',
  SO_DUA: 'dua',
  TRANG: 'của',

  // Source Selection
  CHON_NGUON_DUA: 'Chọn Nguồn Dua',
  MO_TA_CHON_NGUON: 'Chọn nguồn dua mà bạn muốn sử dụng. Bạn có thể thay đổi nguồn bất cứ lúc nào trong cài đặt.',
  NGUON_HIEN_TAI: 'Nguồn Hiện Tại',
  CHON_NGUON: 'Chọn Nguồn',
  TIEP_TUC: 'Tiếp Tục',

  // Error Messages
  LOI_TAI_AM_THANH: 'Lỗi khi tải âm thanh',
  LOI_TAI_DU_LIEU: 'Lỗi khi tải dữ liệu',
  KHONG_CO_KET_NOI: 'Không có kết nối mạng',

  // Success Messages
  DA_THEM_YEU_THICH: 'Đã thêm vào yêu thích',
  DA_XOA_YEU_THICH: 'Đã xóa khỏi yêu thích',
  DA_CHIA_SE: 'Đã chia sẻ thành công',

  // Loading
  DANG_TAI: 'Đang tải...',
  DANG_TAI_AM_THANH: 'Đang tải âm thanh...',
  DANG_TAI_DU_LIEU: 'Đang tải dữ liệu...',
} as const;

// Thông tin các nguồn dua
export const DUA_SOURCES: Record<DuaSource, DuaSourceInfo> = {
  [DuaSource.HUSN_MUSLIM_VN]: {
    id: DuaSource.HUSN_MUSLIM_VN,
    tenNguon: 'Hisnul Muslim (Tiếng Việt)',
    moTa: 'Bộ sưu tập dua từ sách Hisnul Muslim được dịch sang tiếng Việt, bao gồm các dua hàng ngày và trong các dịp đặc biệt.',
    tacGia: 'Sa\'id bin Ali bin Wahf Al-Qahtani',
    soLuongDua: 267,
    ngonNgu: 'Tiếng Việt',
    phienBan: '1.0',
    duongDanFile: '/src/assets/dua/husn_vn.json',
    bieuTuong: '📖'
  }
};

// Default settings
export const DEFAULT_SETTINGS = {
  coChuPhong: 16,
  tuDongPhat: false,
  docLienTuc: false,
  amThanh: true,
  nguonDuaHienTai: DuaSource.HUSN_MUSLIM_VN
};

// LocalStorage keys
export const STORAGE_KEYS = {
  YEU_THICH: 'dua-yeu-thich',
  CO_CHU_PHONG: 'dua-co-chu-phong',
  TU_DONG_PHAT: 'dua-tu-dong-phat',
  DOC_LIEN_TUC: 'dua-doc-lien-tuc',
  TAT_TIENG: 'dua-tat-tieng',
  NGUON_DUA: 'dua-nguon-hien-tai',
  LICH_SU_DOC: 'dua-lich-su-doc',
  THONG_KE: 'dua-thong-ke'
} as const;

// Font size limits
export const FONT_SIZE = {
  MIN: 12,
  MAX: 24,
  DEFAULT: 16,
  STEP: 2
} as const;

// Audio settings
export const AUDIO_SETTINGS = {
  VOLUME_DEFAULT: 1,
  VOLUME_MUTED: 0,
  AUTO_NEXT_DELAY: 2000 // 2 seconds delay before auto next
} as const;

// Animation durations
export const ANIMATION = {
  TRANSITION_DURATION: 300,
  FADE_DURATION: 200,
  SLIDE_DURATION: 250
} as const;
