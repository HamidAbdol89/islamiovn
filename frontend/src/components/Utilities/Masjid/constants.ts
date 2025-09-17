/**
 * Vietnamese constants cho Masjid Locator
 */

export const VIETNAMESE_TEXT = {
  // Header
  title: 'Tìm Masjid Gần Bạn',
  subtitle: 'Tìm kiếm các masjid xung quanh vị trí của bạn',
  
  // Buttons
  layViTriHienTai: 'Lấy Vị Trí Hiện Tại',
  dangLayViTri: 'Đang lấy vị trí...',
  hienThiBanDo: 'Hiển Thị Bản Đồ',
  anBanDo: 'Ẩn Bản Đồ',
  layHuongDan: 'Lấy Hướng Dẫn',
  chia_se: 'Chia Sẻ',
  dong: 'Đóng',
  thuLai: 'Thử Lại',
  
  // Search
  timKiemPlaceholder: 'Tìm kiếm masjid...',
  timKiemMasjid: 'Tìm kiếm masjid',
  
  // Location
  viTriHienTai: 'Vị trí hiện tại',
  khoangCach: 'Khoảng cách',
  kmTuViTriBan: 'km từ vị trí của bạn',
  
  // Map
  tieuDeBanDo: 'Bản Đồ Masjid',
  viTriCuaBan: 'Vị trí của bạn',
  masjidDuocChon: 'Masjid được chọn',
  dangTaiBanDo: 'Đang tải bản đồ...',
  
  // Results
  timThay: 'Tìm thấy',
  masjid: 'masjid',
  cho: 'cho',
  khongTimThayMasjid: 'Không tìm thấy masjid nào',
  khongCoKetQua: 'Không có kết quả',
  thuTuKhoaKhac: 'Thử từ khóa khác',
  khongCoMasjidTrongBanKinh: 'Không có masjid nào trong bán kính 5km từ vị trí của bạn',
  
  // Loading messages
  dangTimKiemMasjid: 'Đang tìm kiếm masjid từ OpenStreetMap...',
  
  // Error messages
  khongHoTroViTri: 'Trình duyệt không hỗ trợ định vị',
  khongTheLayViTri: 'Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.',
  khongTheTaiDuLieu: 'Không thể tải dữ liệu masjid từ OpenStreetMap',
  kiemTraKetNoiMang: 'Không thể tải danh sách masjid. Vui lòng kiểm tra kết nối mạng và thử lại.',
  khongCoMasjidTrongKhuVuc: 'Không có masjid nào trong khu vực này.',
  khongCoMasjidTrongBanKinh5km: 'Không có masjid nào trong bán kính 5km.',
  
  // Welcome message
  assalamuAlaikum: 'Assalamu Alaikum!',
  chaoMung: 'Chào mừng đến với Tìm Kiếm Masjid',
  moTaChaoMung: 'Nhấn "Lấy Vị Trí Hiện Tại" để bắt đầu khám phá các masjid gần bạn.',
  nguonDuLieu: 'Dữ liệu được lấy từ OpenStreetMap.',
  
  // Modal details
  diaChi: 'Địa chỉ',
  soDienThoai: 'Số điện thoại',
  gioMoCua: 'Giờ mở cửa',
  website: 'Website',
  danhGia: 'Đánh giá',
  tienNghi: 'Tiện nghi',
  toaDo: 'Tọa độ',
  sao: 'sao',
  
  // Map apps
  banDoApple: 'Apple Maps',
  waze: 'Waze',
  openStreetMap: 'OpenStreetMap',
  layHuongDanOpenStreetMap: 'Lấy Hướng Dẫn (OpenStreetMap)',
  
  // Share
  daSaoChep: 'Đã sao chép vào clipboard!',
  
  // Amenities (Vietnamese translations)
  tienNghiXeInvalid: 'Hỗ trợ xe lăn',
  tienNghiBaiDauXe: 'Có bãi đậu xe',
  tienNghiWifi: 'Có WiFi',
  tienNghiNhaVeSinh: 'Có nhà vệ sinh',
  tienNghiKhuVucPhuNu: 'Có khu vực phụ nữ',
  tienNghiKhuVucTreEm: 'Có khu vực trẻ em',
  
  // Days of week
  thu2: 'Thứ 2',
  thu3: 'Thứ 3', 
  thu4: 'Thứ 4',
  thu5: 'Thứ 5',
  thu6: 'Thứ 6',
  thu7: 'Thứ 7',
  chuNhat: 'Chủ nhật',
} as const;

export const MAP_CONFIG = {
  defaultZoom: 13,
  searchRadius: 5000, // meters
  maxResults: 20,
  tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
  leafletCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  leafletJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
} as const;

export const GEOLOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
} as const;

export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const OVERPASS_QUERY_TEMPLATE = (lat: number, lng: number, radius: number = MAP_CONFIG.searchRadius) => `
  [out:json][timeout:25];
  (
    node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
    way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
    relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
  );
  out geom;
`;

export const MAP_URLS = {
  openStreetMap: (lat: number, lng: number, userLat?: number, userLng?: number) => 
    userLat && userLng 
      ? `https://www.openstreetmap.org/directions?from=${userLat},${userLng}&to=${lat},${lng}`
      : `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`,
  
  appleMaps: (lat: number, lng: number, userLat?: number, userLng?: number) =>
    userLat && userLng
      ? `https://maps.apple.com/?daddr=${lat},${lng}&saddr=${userLat},${userLng}`
      : `https://maps.apple.com/?ll=${lat},${lng}&z=16`,
  
  waze: (lat: number, lng: number) =>
    `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
} as const;

// Amenity mappings from English to Vietnamese
export const AMENITY_TRANSLATIONS: Record<string, string> = {
  'Wheelchair accessible': VIETNAMESE_TEXT.tienNghiXeInvalid,
  'Parking available': VIETNAMESE_TEXT.tienNghiBaiDauXe,
  'WiFi available': VIETNAMESE_TEXT.tienNghiWifi,
  'Restroom available': VIETNAMESE_TEXT.tienNghiNhaVeSinh,
  'Women area': VIETNAMESE_TEXT.tienNghiKhuVucPhuNu,
  'Children area': VIETNAMESE_TEXT.tienNghiKhuVucTreEm,
} as const;

// Default masjid names if no name is provided
export const DEFAULT_MASJID_NAMES = [
  'Masjid không tên',
  'Masjid địa phương',
  'Nhà thờ Hồi giáo',
] as const;
