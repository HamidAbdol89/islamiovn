// Dữ liệu Masjid Miền Trung - Vietnamese Localized Data
import type { MasjidViet } from '../types';

export const masjidMienTrung: MasjidViet[] = [
  // NINH THUẬN - Trung tâm cộng đồng Chăm
  {
    id: 'c1',
    ten: 'Masjid Al-Rahman',
    diaChi: 'Làng Bàu Trúc, Xã Phước Dân, Huyện Ninh Phước',
    thanhPho: 'Ninh Thuận',
    vung: 'Miền Trung',
    sucChua: 800,
    namThanhLap: 1960,
    hinhAnh: '/images/masjid/al-rahman-ninh-thuan.webp',
    moTa: 'Trung tâm tôn giáo của cộng đồng Chăm Muslim tại Ninh Thuận, nơi có truyền thống Hồi giáo lâu đời và văn hóa Chăm đặc sắc.',
    tienIch: ['Lớp học Quran', 'Khu vực wudu', 'Bãi đậu xe', 'Thư viện Chăm-Ả Rập'],
    thoiGianCau: {
      fajr: '04:50',
      dhuhr: '12:10',
      asr: '15:45',
      maghrib: '18:00',
      isha: '19:20'
    }
  },
  {
    id: 'c2',
    ten: 'Masjid Al-Ihsan',
    diaChi: 'Làng Vân Lâm, Xã An Hải, Huyện Ninh Phước',
    thanhPho: 'Ninh Thuận',
    vung: 'Miền Trung',
    sucChua: 400,
    namThanhLap: 1970,
    moTa: 'Masjid phục vụ cộng đồng Chăm tại vùng nông thôn Ninh Thuận, nơi duy trì truyền thống văn hóa và tôn giáo Chăm.',
    tienIch: ['Lớp học tiếng Chăm', 'Khu vực cầu nguyện', 'Khu vực wudu']
  },
  {
    id: 'c3',
    ten: 'Masjid Al-Noor Phan Rang',
    diaChi: 'Đường 16 Tháng 4, Phường Đô Vinh',
    thanhPho: 'Phan Rang - Tháp Chàm',
    vung: 'Miền Trung',
    sucChua: 500,
    namThanhLap: 1965,
    moTa: 'Masjid chính tại thành phố Phan Rang, phục vụ cộng đồng Chăm đô thị và du khách Muslim.',
    tienIch: ['Thư viện Hồi giáo', 'Lớp học Quran', 'Bãi đậu xe', 'Khu vực wudu']
  },

  // BÌNH THUẬN
  {
    id: 'c4',
    ten: 'Masjid Jamiul Anwar',
    diaChi: 'Làng Chăm, Phan Ri Cửa, Huyện Tuy Phong',
    thanhPho: 'Bình Thuận',
    vung: 'Miền Trung',
    sucChua: 600,
    namThanhLap: 1975,
    moTa: 'Masjid chính của cộng đồng Chăm Muslim tại Bình Thuận, với kiến trúc truyền thống Chăm đặc trưng.',
    tienIch: ['Thư viện Chăm', 'Lớp học Quran', 'Khu vực cầu nguyện rộng', 'Bãi đậu xe']
  },
  {
    id: 'c5',
    ten: 'Masjid Al-Barakah',
    diaChi: 'Làng Hamu Tanran, Huyện Bắc Bình',
    thanhPho: 'Bình Thuận',
    vung: 'Miền Trung',
    sucChua: 300,
    moTa: 'Masjid phục vụ cộng đồng Chăm tại vùng nông thôn Bình Thuận, nơi có nhiều làng Chăm truyền thống.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học tiếng Chăm', 'Khu vực wudu']
  },

  // PHÚ YÊN
  {
    id: 'c6',
    ten: 'Masjid Al-Taqwa',
    diaChi: 'Làng Hòa Lạc, Xã An Dân, Huyện Tuy An',
    thanhPho: 'Phú Yên',
    vung: 'Miền Trung',
    sucChua: 300,
    moTa: 'Phục vụ cộng đồng Chăm Muslim địa phương tại Phú Yên, nơi có cộng đồng Chăm nhỏ nhưng gắn kết.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học Quran', 'Khu vực wudu']
  },

  // KHÁNH HÒA
  {
    id: 'c7',
    ten: 'Masjid Al-Hidayah',
    diaChi: 'Làng Phú Trường, Xã Suối Tân, Huyện Cam Lâm',
    thanhPho: 'Khánh Hòa',
    vung: 'Miền Trung',
    sucChua: 200,
    moTa: 'Masjid nhỏ phục vụ cộng đồng Chăm tại Khánh Hòa, gần thành phố biển Nha Trang.',
    tienIch: ['Khu vực cầu nguyện', 'Khu vực wudu']
  },

  // ĐÀ NẴNG
  {
    id: 'c8',
    ten: 'Masjid Al-Ehsan',
    diaChi: '156 Đường Trần Phú, Quận Hải Châu',
    thanhPho: 'Đà Nẵng',
    vung: 'Miền Trung',
    soDienThoai: '+84 236 3821 567',
    sucChua: 150,
    namThanhLap: 1995,
    hinhAnh: '/images/masjid/al-ehsan-danang.webp',
    moTa: 'Masjid duy nhất tại Đà Nẵng, phục vụ khách du lịch Muslim và cộng đồng Indonesia, Malaysia nhỏ làm việc tại thành phố.',
    tienIch: ['Bếp Halal', 'Thư viện nhỏ', 'Wifi miễn phí', 'Hướng dẫn đa ngôn ngữ'],
    thoiGianCau: {
      fajr: '04:45',
      dhuhr: '12:00',
      asr: '15:30',
      maghrib: '18:10',
      isha: '19:25'
    }
  },

  // HUẾ
  {
    id: 'c9',
    ten: 'Masjid Al-Furqan',
    diaChi: 'Đường Nguyễn Huệ, Phường Vĩnh Ninh',
    thanhPho: 'Huế',
    vung: 'Miền Trung',
    sucChua: 100,
    moTa: 'Masjid nhỏ tại cố đô Huế, phục vụ du khách Muslim và cộng đồng nhỏ tại thành phố.',
    tienIch: ['Khu vực cầu nguyện', 'Khu vực wudu', 'Thông tin du lịch Halal']
  },

  // SURAU (Phòng cầu nguyện) tại các khu công nghiệp
  {
    id: 'c10',
    ten: 'Surau Al-Iman',
    diaChi: 'Khu công nghiệp An Đồn, Quận Sơn Trà',
    thanhPho: 'Đà Nẵng',
    vung: 'Miền Trung',
    sucChua: 50,
    moTa: 'Phòng cầu nguyện cho công nhân Muslim làm việc tại Khu công nghiệp An Đồn.',
    tienIch: ['Khu vực wudu', 'Tủ để giày dép']
  },
  {
    id: 'c11',
    ten: 'Surau Al-Falah',
    diaChi: 'Khu công nghiệp Hòa Khánh, Quận Liên Chiểu',
    thanhPho: 'Đà Nẵng',
    vung: 'Miền Trung',
    sucChua: 40,
    moTa: 'Phòng cầu nguyện trong khu công nghiệp, phục vụ lao động nước ngoài.',
    tienIch: ['Khu vực wudu', 'Điều hòa']
  },
  {
    id: 'c12',
    ten: 'Surau Al-Nur',
    diaChi: 'Khu công nghiệp Đông Nam, TP. Quy Nhon',
    thanhPho: 'Bình Định',
    vung: 'Miền Trung',
    sucChua: 30,
    moTa: 'Phòng cầu nguyện nhỏ tại khu công nghiệp Quy Nhon.',
    tienIch: ['Khu vực wudu']
  },

  // KHU DU LỊCH
  {
    id: 'c13',
    ten: 'Surau Al-Rahma (Hội An)',
    diaChi: 'Phố cổ Hội An, Quảng Nam',
    thanhPho: 'Hội An',
    vung: 'Miền Trung',
    sucChua: 25,
    moTa: 'Phòng cầu nguyện nhỏ phục vụ du khách Muslim tại phố cổ Hội An.',
    tienIch: ['Khu vực wudu', 'Hướng dẫn tiếng Anh', 'Thông tin du lịch Halal']
  },
  {
    id: 'c14',
    ten: 'Surau Al-Salam (Nha Trang)',
    diaChi: 'Khu du lịch Vinpearl, Nha Trang',
    thanhPho: 'Nha Trang',
    vung: 'Miền Trung',
    sucChua: 35,
    moTa: 'Phòng cầu nguyện tại khu du lịch, phục vụ khách du lịch Muslim quốc tế.',
    tienIch: ['Khu vực wudu', 'Hướng dẫn đa ngôn ngữ', 'Wifi miễn phí']
  },
  {
    id: 'c15',
    ten: 'Surau Al-Mubarak (Đà Lạt)',
    diaChi: 'Trung tâm thành phố Đà Lạt',
    thanhPho: 'Đà Lạt',
    vung: 'Miền Trung',
    sucChua: 20,
    moTa: 'Phòng cầu nguyện nhỏ tại thành phố ngàn hoa, phục vụ du khách Muslim.',
    tienIch: ['Khu vực wudu', 'Sưởi ấm mùa đông']
  }
];

export default masjidMienTrung;
