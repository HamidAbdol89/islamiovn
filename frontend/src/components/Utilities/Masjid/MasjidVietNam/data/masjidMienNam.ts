// Dữ liệu Masjid Miền Nam - Vietnamese Localized Data
import type { MasjidViet } from '../types';

export const masjidMienNam: MasjidViet[] = [
  // TP. HỒ CHÍ MINH
  {
    id: '1',
    ten: 'Masjid Jamiul Muslimin',
    diaChi: '66 Đường Trần Hưng Đạo, Quận 1',
    thanhPho: 'TP. Hồ Chí Minh',
    vung: 'Miền Nam',
    soDienThoai: '+84 28 3838 1919',
    sucChua: 2000,
    namThanhLap: 1932,
    hinhAnh: '/images/masjid/jamiul-muslimin.webp',
    moTa: 'Masjid trung tâm của cộng đồng Muslim tại TP. Hồ Chí Minh, là nơi sinh hoạt tôn giáo quan trọng nhất của người Hồi giáo ở miền Nam.',
    tienIch: ['Thư viện Hồi giáo', 'Lớp học Quran', 'Bếp Halal', 'Bãi đậu xe']
  },
  {
    id: '2',
    ten: 'Masjid Al-Noor',
    diaChi: '123 Đường Nguyễn Văn Cừ, Quận 5',
    thanhPho: 'TP. Hồ Chí Minh',
    vung: 'Miền Nam',
    soDienThoai: '+84 28 3835 1234',
    website: 'https://masjid-alnoor.vn',
    sucChua: 1500,
    namThanhLap: 1935,
    hinhAnh: '/images/masjid/al-noor.webp',
    thoiGianCau: {
      fajr: '04:45',
      dhuhr: '12:00',
      asr: '15:30',
      maghrib: '18:15',
      isha: '19:30'
    },
    moTa: 'Một trong những masjid lâu đời nhất tại TP. Hồ Chí Minh, phục vụ cộng đồng Muslim từ năm 1935 với kiến trúc truyền thống đẹp mắt.',
    tienIch: ['Thư viện Hồi giáo', 'Lớp học Quran', 'Bếp Halal', 'Khu vực đậu xe']
  },
  {
    id: '3',
    ten: 'Masjid Al-Rahim',
    diaChi: '45 Đường Hùng Vương, Quận 5',
    thanhPho: 'TP. Hồ Chí Minh',
    vung: 'Miền Nam',
    sucChua: 800,
    namThanhLap: 1960,
    moTa: 'Masjid phục vụ cộng đồng Muslim tại khu vực Quận 5, nơi tập trung đông đảo người Hoa Hồi giáo.',
    tienIch: ['Khu vực wudu', 'Lớp học tiếng Ả Rập']
  },
  {
    id: '4',
    ten: 'Masjid An-Nahdhah',
    diaChi: '12 Đường Lê Văn Sỹ, Phường 13, Quận 3',
    thanhPho: 'TP. Hồ Chí Minh',
    vung: 'Miền Nam',
    soDienThoai: '+84 28 3930 4545',
    sucChua: 500,
    moTa: 'Masjid nhỏ phục vụ cộng đồng Muslim tại khu vực Quận 3, với không gian ấm cúng và thân thiện.',
    tienIch: ['Khu vực cầu nguyện', 'Thư viện nhỏ']
  },

  // VŨNG TÀU
  {
    id: '5',
    ten: 'Masjid Al-Ehsan',
    diaChi: 'Đường 30/4, Phường 1',
    thanhPho: 'Vũng Tàu',
    vung: 'Miền Nam',
    sucChua: 300,
    namThanhLap: 1985,
    moTa: 'Masjid phục vụ cộng đồng Muslim tại thành phố biển Vũng Tàu, nơi có nhiều lao động nước ngoài làm việc.',
    tienIch: ['Khu vực wudu', 'Bãi đậu xe']
  },

  // BIÊN HÒA
  {
    id: '6',
    ten: 'Masjid Al-Huda',
    diaChi: 'Ấp Bàu Lách, Xã Tân Hòa',
    thanhPho: 'Biên Hòa',
    vung: 'Miền Nam',
    sucChua: 200,
    moTa: 'Masjid phục vụ cộng đồng Muslim tại khu vực Biên Hòa, gần các khu công nghiệp lớn.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học Quran']
  },
  {
    id: '7',
    ten: 'Masjid Al-Iman',
    diaChi: 'Khu phố 4, Phường Long Bình',
    thanhPho: 'Biên Hòa',
    vung: 'Miền Nam',
    sucChua: 150,
    moTa: 'Masjid nhỏ tại khu vực Long Bình, phục vụ công nhân Muslim làm việc tại các khu công nghiệp.',
    tienIch: ['Khu vực wudu', 'Thư viện nhỏ']
  },

  // CÁC TỈNH ĐỒNG BẰNG SÔNG CỬU LONG
  {
    id: '8',
    ten: 'Masjid Al-Taqwa',
    diaChi: 'Đường Nguyễn Trãi, Phường 1',
    thanhPho: 'Mỹ Tho',
    vung: 'Miền Nam',
    sucChua: 250,
    moTa: 'Masjid tại Mỹ Tho, phục vụ cộng đồng Muslim tại tỉnh Tiền Giang.',
    tienIch: ['Khu vực cầu nguyện', 'Bãi đậu xe']
  },
  {
    id: '9',
    ten: 'Masjid Al-Falah',
    diaChi: 'Phường 2, TP. Bạc Liêu',
    thanhPho: 'Bạc Liêu',
    vung: 'Miền Nam',
    sucChua: 400,
    namThanhLap: 1950,
    moTa: 'Masjid lớn nhất tại Bạc Liêu, phục vụ cộng đồng Chăm Muslim địa phương.',
    tienIch: ['Thư viện Hồi giáo', 'Lớp học Quran', 'Khu vực wudu']
  },
  {
    id: '10',
    ten: 'Masjid Al-Karim',
    diaChi: 'Phường 5, TP. Sóc Trăng',
    thanhPho: 'Sóc Trăng',
    vung: 'Miền Nam',
    sucChua: 600,
    namThanhLap: 1940,
    moTa: 'Masjid quan trọng tại Sóc Trăng, nơi có cộng đồng Chăm Muslim đông đảo.',
    tienIch: ['Thư viện lớn', 'Lớp học tiếng Ả Rập', 'Bếp Halal', 'Bãi đậu xe']
  },
  {
    id: '11',
    ten: 'Masjid Al-Nur',
    diaChi: 'Phường 3, TP. Cần Thơ',
    thanhPho: 'Cần Thơ',
    vung: 'Miền Nam',
    sucChua: 350,
    moTa: 'Masjid tại thành phố Cần Thơ, trung tâm của vùng Đồng bằng sông Cửu Long.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học Quran', 'Khu vực wudu']
  },
  {
    id: '12',
    ten: 'Masjid Al-Amin',
    diaChi: 'Phường 8, TP. Vĩnh Long',
    thanhPho: 'Vĩnh Long',
    vung: 'Miền Nam',
    sucChua: 200,
    moTa: 'Masjid nhỏ tại Vĩnh Long, phục vụ cộng đồng Muslim địa phương.',
    tienIch: ['Khu vực cầu nguyện', 'Thư viện nhỏ']
  },
  {
    id: '13',
    ten: 'Masjid Al-Hidayah',
    diaChi: 'Phường 1, TP. Trà Vinh',
    thanhPho: 'Trà Vinh',
    vung: 'Miền Nam',
    sucChua: 300,
    moTa: 'Masjid tại Trà Vinh, nơi có cộng đồng Chăm và Khmer Muslim sinh sống.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học Quran']
  },
  {
    id: '14',
    ten: 'Masjid Al-Ikhlas',
    diaChi: 'Phường 2, TP. Bến Tre',
    thanhPho: 'Bến Tre',
    vung: 'Miền Nam',
    sucChua: 180,
    moTa: 'Masjid nhỏ tại Bến Tre, phục vụ cộng đồng Muslim trong tỉnh.',
    tienIch: ['Khu vực wudu', 'Thư viện nhỏ']
  },
  {
    id: '15',
    ten: 'Masjid Al-Muhajirin',
    diaChi: 'Phường 4, TP. Long Xuyên',
    thanhPho: 'Long Xuyên',
    vung: 'Miền Nam',
    sucChua: 220,
    moTa: 'Masjid tại Long Xuyên, An Giang, phục vụ cộng đồng Muslim địa phương.',
    tienIch: ['Khu vực cầu nguyện', 'Bãi đậu xe']
  },
  {
    id: '16',
    ten: 'Masjid Al-Muttaqin',
    diaChi: 'Phường 3, TP. Rạch Giá',
    thanhPho: 'Rạch Giá',
    vung: 'Miền Nam',
    sucChua: 280,
    moTa: 'Masjid tại Rạch Giá, Kiên Giang, gần biên giới Campuchia.',
    tienIch: ['Khu vực cầu nguyện', 'Lớp học tiếng Ả Rập']
  },
  {
    id: '17',
    ten: 'Masjid Al-Rahma',
    diaChi: 'Phường 5, TP. Cao Lãnh',
    thanhPho: 'Cao Lãnh',
    vung: 'Miền Nam',
    sucChua: 150,
    moTa: 'Masjid nhỏ tại Cao Lãnh, Đồng Tháp, phục vụ cộng đồng Muslim địa phương.',
    tienIch: ['Khu vực wudu', 'Thư viện nhỏ']
  },
  {
    id: '18',
    ten: 'Masjid Al-Salam',
    diaChi: 'Phường 1, TP. Sa Đéc',
    thanhPho: 'Sa Đéc',
    vung: 'Miền Nam',
    sucChua: 120,
    moTa: 'Masjid nhỏ tại Sa Đéc, Đồng Tháp, với kiến trúc đơn giản nhưng trang nghiêm.',
    tienIch: ['Khu vực cầu nguyện']
  },
  {
    id: '19',
    ten: 'Masjid Al-Tawhid',
    diaChi: 'Phường 2, TP. Hà Tiên',
    thanhPho: 'Hà Tiên',
    vung: 'Miền Nam',
    sucChua: 100,
    moTa: 'Masjid nhỏ tại Hà Tiên, Kiên Giang, gần biên giới Campuchia.',
    tienIch: ['Khu vực wudu']
  },
  {
    id: '20',
    ten: 'Masjid Al-Ummah',
    diaChi: 'Phường 4, TP. Châu Đốc',
    thanhPho: 'Châu Đốc',
    vung: 'Miền Nam',
    sucChua: 500,
    namThanhLap: 1975,
    moTa: 'Masjid quan trọng cho cộng đồng Chăm tại Châu Đốc, An Giang, nơi có truyền thống Hồi giáo lâu đời.',
    tienIch: ['Thư viện Hồi giáo', 'Lớp học Quran', 'Bếp Halal', 'Bãi đậu xe']
  }
];

export default masjidMienNam;
