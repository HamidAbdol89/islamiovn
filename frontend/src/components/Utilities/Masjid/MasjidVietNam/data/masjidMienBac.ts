// Dữ liệu Masjid Miền Bắc - Vietnamese Localized Data
import type { MasjidViet } from '../types';

export const masjidMienBac: MasjidViet[] = [
  // HÀ NỘI
  {
    id: 'n1',
    ten: 'Masjid Al-Noor Hà Nội',
    diaChi: '12 Hàng Lược, Phường Hàng Mã, Quận Hoàn Kiếm',
    thanhPho: 'Hà Nội',
    vung: 'Miền Bắc',
    soDienThoai: '+84 24 3825 1919',
    sucChua: 500,
    namThanhLap: 1890,
    hinhAnh: '/images/masjid/hanoi-alnoor.webp',
    moTa: 'Masjid duy nhất tại trung tâm Hà Nội, phục vụ cộng đồng Muslim nhỏ tại thủ đô và du khách Hồi giáo từ khắp nơi trên thế giới.',
    tienIch: ['Bếp Halal', 'Khu vực wudu', 'Thư viện nhỏ', 'Wifi miễn phí'],
    thoiGianCau: {
      fajr: '04:30',
      dhuhr: '11:45',
      asr: '15:00',
      maghrib: '17:45',
      isha: '19:15'
    }
  },
  {
    id: 'n2',
    ten: 'Masjid Al-Islam',
    diaChi: '44 Phố Hàng Cót, Quận Hoàn Kiếm',
    thanhPho: 'Hà Nội',
    vung: 'Miền Bắc',
    sucChua: 300,
    namThanhLap: 1950,
    moTa: 'Một trong số ít masjid tại Hà Nội, chủ yếu phục vụ người nước ngoài và cộng đồng Chăm nhỏ tại thủ đô.',
    tienIch: ['Khu vực cầu nguyện', 'Thư viện', 'Khu vực wudu']
  },

  // HẢI PHÒNG
  {
    id: 'n3',
    ten: 'Masjid Hải Phòng',
    diaChi: 'Đường Lạch Tray, Quận Ngô Quyền',
    thanhPho: 'Hải Phòng',
    vung: 'Miền Bắc',
    sucChua: 200,
    namThanhLap: 1980,
    moTa: 'Masjid chính tại Hải Phòng, phục vụ cộng đồng Muslim địa phương và lao động nước ngoài làm việc tại cảng.',
    tienIch: ['Khu vực cầu nguyện', 'Bãi đậu xe', 'Khu vực wudu']
  },

  // NAM ĐỊNH
  {
    id: 'n4',
    ten: 'Masjid Nam Định',
    diaChi: 'Đường Bến Ngự, Phường Lộc Vượng',
    thanhPho: 'Nam Định',
    vung: 'Miền Bắc',
    sucChua: 150,
    moTa: 'Masjid nhỏ phục vụ cộng đồng Muslim tại Nam Định, với kiến trúc đơn giản nhưng trang nghiêm.',
    tienIch: ['Khu vực cầu nguyện', 'Thư viện nhỏ']
  },

  // THÁI BÌNH
  {
    id: 'n5',
    ten: 'Masjid Thái Bình',
    diaChi: 'Đường Trần Hưng Đạo, Phường Quang Trung',
    thanhPho: 'Thái Bình',
    vung: 'Miền Bắc',
    sucChua: 100,
    moTa: 'Masjid nhỏ phục vụ cộng đồng Muslim địa phương tại Thái Bình.',
    tienIch: ['Khu vực wudu', 'Khu vực cầu nguyện']
  },

  // SURAU (Phòng cầu nguyện nhỏ)
  {
    id: 'n6',
    ten: 'Surau Al-Iman (Hà Nội)',
    diaChi: 'Khu đô thị Mỹ Đình, Quận Nam Từ Liêm',
    thanhPho: 'Hà Nội',
    vung: 'Miền Bắc',
    sucChua: 50,
    moTa: 'Phòng cầu nguyện nhỏ phục vụ cộng đồng Indonesia và Malaysia làm việc tại Hà Nội.',
    tienIch: ['Khu vực wudu', 'Wifi miễn phí']
  },
  {
    id: 'n7',
    ten: 'Surau Al-Taqwa (Hải Phòng)',
    diaChi: 'Khu công nghiệp Nomura, Quận Hải An',
    thanhPho: 'Hải Phòng',
    vung: 'Miền Bắc',
    sucChua: 40,
    moTa: 'Phòng cầu nguyện trong khu công nghiệp, chủ yếu phục vụ công nhân Muslim.',
    tienIch: ['Khu vực wudu', 'Tủ để giày dép']
  },
  {
    id: 'n8',
    ten: 'Surau Al-Rahma (Quảng Ninh)',
    diaChi: 'Khu đô thị Hạ Long, Phường Bãi Cháy',
    thanhPho: 'Hạ Long',
    vung: 'Miền Bắc',
    sucChua: 30,
    moTa: 'Phòng cầu nguyện nhỏ cho khách du lịch Muslim và cộng đồng địa phương.',
    tienIch: ['Khu vực wudu', 'Hướng dẫn tiếng Anh']
  },
  {
    id: 'n9',
    ten: 'Surau Al-Nur (Bắc Ninh)',
    diaChi: 'Khu công nghiệp VSIP, Thuận Thành',
    thanhPho: 'Bắc Ninh',
    vung: 'Miền Bắc',
    sucChua: 35,
    moTa: 'Phòng cầu nguyện trong khu công nghiệp, phục vụ công nhân nước ngoài.',
    tienIch: ['Khu vực wudu', 'Tủ để đồ cá nhân']
  },
  {
    id: 'n10',
    ten: 'Surau Al-Huda (Hưng Yên)',
    diaChi: 'Khu công nghiệp Phố Nối, Văn Lâm',
    thanhPho: 'Hưng Yên',
    vung: 'Miền Bắc',
    sucChua: 25,
    moTa: 'Phòng cầu nguyện nhỏ trong khu công nghiệp.',
    tienIch: ['Khu vực wudu']
  },

  // KHU CÔNG NGHIỆP MIỀN BẮC
  {
    id: 'n11',
    ten: 'Surau Al-Falah (Vĩnh Phúc)',
    diaChi: 'Khu công nghiệp Khai Quang, Vĩnh Tường',
    thanhPho: 'Vĩnh Phúc',
    vung: 'Miền Bắc',
    sucChua: 45,
    moTa: 'Phòng cầu nguyện phục vụ công nhân Muslim tại các nhà máy trong khu công nghiệp.',
    tienIch: ['Khu vực wudu', 'Bãi đậu xe nhỏ']
  },
  {
    id: 'n12',
    ten: 'Surau Al-Barakah (Hà Nam)',
    diaChi: 'Khu công nghiệp Đồng Văn, Duy Tiên',
    thanhPho: 'Hà Nam',
    vung: 'Miền Bắc',
    sucChua: 30,
    moTa: 'Phòng cầu nguyện trong khu công nghiệp, phục vụ lao động Muslim.',
    tienIch: ['Khu vực wudu', 'Điều hòa']
  },
  {
    id: 'n13',
    ten: 'Surau An-Noor (Thái Nguyên)',
    diaChi: 'Khu công nghiệp Điềm Thụy, Thái Nguyên',
    thanhPho: 'Thái Nguyên',
    vung: 'Miền Bắc',
    sucChua: 20,
    moTa: 'Phòng cầu nguyện nhỏ tại khu công nghiệp miền núi phía Bắc.',
    tienIch: ['Khu vực wudu']
  },
  {
    id: 'n14',
    ten: 'Surau Al-Hidayah (Phú Thọ)',
    diaChi: 'Khu công nghiệp Thụy Vân, Việt Trì',
    thanhPho: 'Phú Thọ',
    vung: 'Miền Bắc',
    sucChua: 25,
    moTa: 'Phòng cầu nguyện phục vụ công nhân Muslim tại các nhà máy dệt may.',
    tienIch: ['Khu vực wudu', 'Quạt trần']
  },
  {
    id: 'n15',
    ten: 'Surau Al-Karim (Ninh Bình)',
    diaChi: 'Khu du lịch Tràng An, Hoa Lư',
    thanhPho: 'Ninh Bình',
    vung: 'Miền Bắc',
    sucChua: 15,
    moTa: 'Phòng cầu nguyện nhỏ phục vụ khách du lịch Muslim tại khu vực Tràng An.',
    tienIch: ['Khu vực wudu', 'Hướng dẫn đa ngôn ngữ']
  }
];

export default masjidMienBac;
