# Vietnamese Masjid Data - Comprehensive Database

## 🎯 **Tổng quan**

Đây là cơ sở dữ liệu hoàn chỉnh về các masjid trên toàn quốc Việt Nam, được viết bằng tiếng Việt và tối ưu cho hiệu suất.

## 📊 **Thống kê dữ liệu**

### **Tổng quan:**
- **Tổng số masjid**: 50+ masjid và surau
- **Miền Nam**: 20 masjid (chủ yếu TP.HCM và ĐBSCL)
- **Miền Bắc**: 15 masjid/surau (Hà Nội, Hải Phòng, các KCN)
- **Miền Trung**: 15 masjid/surau (Ninh Thuận, Bình Thuận, Đà Nẵng)

### **Phân loại:**
- **Masjid lớn**: 15 masjid (>300 người)
- **Masjid trung bình**: 20 masjid (100-300 người)  
- **Surau/Phòng cầu nguyện**: 15 địa điểm (<100 người)

## 📁 **Cấu trúc Files**

```
data/
├── masjidMienNam.ts      # 20 masjid Miền Nam
├── masjidMienBac.ts      # 15 masjid Miền Bắc  
├── masjidMienTrung.ts    # 15 masjid Miền Trung
├── index.ts              # Tổng hợp và lazy loading
└── README.md             # Documentation
```

## 🌍 **Phân bố địa lý**

### **Miền Nam (masjidMienNam.ts)**
- **TP. Hồ Chí Minh**: 4 masjid chính + các surau
- **Đồng bằng sông Cửu Long**: 16 masjid
  - Cần Thơ, Sóc Trăng, Bạc Liêu (cộng đồng Chăm)
  - An Giang: Châu Đốc, Long Xuyên
  - Kiên Giang: Rạch Giá, Hà Tiên
  - Các tỉnh khác: Vĩnh Long, Trà Vinh, Bến Tre...

### **Miền Bắc (masjidMienBac.ts)**  
- **Hà Nội**: 2 masjid + 1 surau
- **Hải Phòng**: 1 masjid + 1 surau
- **Các tỉnh khác**: Nam Định, Thái Bình
- **Khu công nghiệp**: 10 surau (Bắc Ninh, Hưng Yên, Vĩnh Phúc...)

### **Miền Trung (masjidMienTrung.ts)**
- **Ninh Thuận**: 3 masjid (trung tâm cộng đồng Chăm)
- **Bình Thuận**: 2 masjid Chăm
- **Đà Nẵng**: 1 masjid + 2 surau
- **Các tỉnh khác**: Phú Yên, Khánh Hòa, Huế
- **Khu du lịch**: Hội An, Nha Trang, Đà Lạt

## 🏗️ **Cấu trúc dữ liệu**

### **Interface MasjidViet**
```typescript
interface MasjidViet {
  id: string;                    // Unique identifier
  ten?: string;                  // Tên masjid (Vietnamese)
  diaChi?: string;              // Địa chỉ đầy đủ
  thanhPho?: string;            // Thành phố/tỉnh
  vung?: string;                // Miền Bắc/Trung/Nam
  soDienThoai?: string;         // Số điện thoại liên hệ
  website?: string;             // Website (nếu có)
  sucChua?: number;             // Sức chứa (số người)
  namThanhLap?: number;         // Năm thành lập
  hinhAnh?: string;             // Đường dẫn hình ảnh
  thoiGianCau?: {               // Thời gian cầu nguyện
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  moTa?: string;                // Mô tả bằng tiếng Việt
  tienIch?: string[];           // Danh sách tiện ích
}
```

## 🎨 **Đặc điểm Vietnamese Localization**

### **Tên masjid:**
- Giữ nguyên tên Ả Rập: "Masjid Al-Noor", "Masjid Jamiul Muslimin"
- Thêm địa danh Việt: "Masjid Al-Noor Hà Nội"

### **Địa chỉ:**
- Hoàn toàn bằng tiếng Việt
- Cấu trúc: Số nhà + Đường + Phường/Xã + Quận/Huyện

### **Mô tả:**
- 100% tiếng Việt
- Ngữ cảnh văn hóa Việt Nam
- Thông tin về cộng đồng địa phương

### **Tiện ích:**
- "Thư viện Hồi giáo" thay vì "Islamic library"
- "Lớp học Quran" thay vì "Quran classes"  
- "Bếp Halal" thay vì "Halal kitchen"
- "Khu vực wudu" thay vì "Wudu area"

## 🚀 **Performance Features**

### **Lazy Loading Support**
```typescript
// Load theo vùng
const loadMasjidByRegion = async (region: string): Promise<MasjidViet[]>

// Data by region
const masjidDataByRegion = {
  'Miền Nam': masjidMienNam,
  'Miền Bắc': masjidMienBac,
  'Miền Trung': masjidMienTrung
}
```

### **Statistics Pre-calculated**
```typescript
const masjidStatistics = {
  total: 50,
  byRegion: { /* counts by region */ },
  withPrayerTimes: 8,
  withFacilities: 45,
  withPhone: 25,
  withWebsite: 5
}
```

## 📱 **Usage Examples**

### **Import toàn bộ data:**
```typescript
import { allMasjidData } from './data';
```

### **Import theo vùng:**
```typescript
import { masjidMienNam, masjidMienBac, masjidMienTrung } from './data';
```

### **Lazy loading:**
```typescript
const masjids = await loadMasjidByRegion('Miền Nam');
```

### **Statistics:**
```typescript
import { masjidStatistics } from './data';
console.log(`Tổng số: ${masjidStatistics.total} masjid`);
```

## 🔄 **Migration từ data cũ**

### **Trước (mosqueData.ts):**
- 552 lines trong 1 file
- Dữ liệu tiếng Anh
- Không tối ưu performance
- Khó maintain

### **Sau (data/ folder):**
- Tách thành 3 files theo vùng
- 100% Vietnamese localization
- Lazy loading support
- Pre-calculated statistics
- Type-safe với MasjidViet interface

## 🎯 **Lợi ích**

### **Maintainability:**
- Dễ cập nhật data theo vùng
- Cấu trúc rõ ràng, dễ hiểu
- Type safety với TypeScript

### **Performance:**
- Lazy loading theo vùng
- Pre-calculated statistics
- Tree shaking friendly

### **User Experience:**
- 100% tiếng Việt
- Thông tin chi tiết và chính xác
- Phù hợp với người dùng Việt Nam

### **Scalability:**
- Dễ thêm masjid mới
- Hỗ trợ future API integration
- Extensible data structure

## 🔮 **Future Enhancements**

1. **Real-time Prayer Times**: Tích hợp API thời gian cầu nguyện
2. **Images**: Thêm hình ảnh thực tế cho từng masjid
3. **Reviews**: Hệ thống đánh giá và nhận xét
4. **Navigation**: Tích hợp Google Maps directions
5. **Events**: Thông tin sự kiện và hoạt động
6. **Multilingual**: Hỗ trợ tiếng Anh cho du khách quốc tế

Dữ liệu này cung cấp foundation vững chắc cho ứng dụng Muslim Việt với thông tin chính xác và cập nhật về các masjid trên toàn quốc! 🕌🇻🇳
