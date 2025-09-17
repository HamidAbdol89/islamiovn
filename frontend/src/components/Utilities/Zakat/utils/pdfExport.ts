import type { GiaTriTaiSan, KhoiLuongKimLoai, GiaVangBac, KetQuaZakat } from '../types';

interface ZakatPDFData {
  taiSan: GiaTriTaiSan;
  khoiLuongKimLoai: KhoiLuongKimLoai;
  giaKimLoai: GiaVangBac;
  ketQua: KetQuaZakat;
  ngayTinh: string;
}

export const generateZakatPDF = async (data: ZakatPDFData): Promise<void> => {
  // Dynamic import for better performance
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  
  // Vietnamese font support (fallback to default if not available)
  try {
    // You would need to add Vietnamese font here for proper display
    // doc.addFont('path/to/vietnamese-font.ttf', 'vietnamese', 'normal');
    // doc.setFont('vietnamese');
  } catch (error) {
    console.warn('Vietnamese font not available, using default font');
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  let yPosition = 20;
  const lineHeight = 8;
  const sectionSpacing = 15;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 100, 200);
  doc.text('BÁO CÁO TÍNH TOÁN ZAKAT', 105, yPosition, { align: 'center' });
  
  yPosition += sectionSpacing;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Ngày tính: ${data.ngayTinh}`, 105, yPosition, { align: 'center' });
  
  yPosition += sectionSpacing * 1.5;

  // Reset color for content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

  // Assets Section
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text('1. THÔNG TIN TÀI SẢN', 20, yPosition);
  yPosition += lineHeight + 5;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const assetItems = [
    ['Tiền mặt:', formatCurrency(data.taiSan.tienMat)],
    ['Tiết kiệm ngân hàng:', formatCurrency(data.taiSan.tietKiem)],
    ['Vàng (khác):', formatCurrency(data.taiSan.vang)],
    ['Bạc (khác):', formatCurrency(data.taiSan.bac)],
    ['Đầu tư/Cổ phiếu:', formatCurrency(data.taiSan.dauTu)],
    ['Tài sản kinh doanh:', formatCurrency(data.taiSan.kinhDoanh)],
    ['Tổng công nợ:', formatCurrency(data.taiSan.congNo)]
  ];

  assetItems.forEach(([label, value]) => {
    doc.text(label, 25, yPosition);
    doc.text(value, 120, yPosition);
    yPosition += lineHeight;
  });

  yPosition += sectionSpacing;

  // Precious Metals Section
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text('2. KIM LOẠI QUÝ', 20, yPosition);
  yPosition += lineHeight + 5;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const metalItems = [
    ['Giá vàng hiện tại:', `${data.giaKimLoai.giaVangMoiGram.toLocaleString('vi-VN')} VND/gram`],
    ['Khối lượng vàng:', `${data.khoiLuongKimLoai.vangGram} gram`],
    ['Giá trị vàng:', formatCurrency(data.khoiLuongKimLoai.vangGram * data.giaKimLoai.giaVangMoiGram)],
    ['', ''],
    ['Giá bạc hiện tại:', `${data.giaKimLoai.giaBacMoiGram.toLocaleString('vi-VN')} VND/gram`],
    ['Khối lượng bạc:', `${data.khoiLuongKimLoai.bacGram} gram`],
    ['Giá trị bạc:', formatCurrency(data.khoiLuongKimLoai.bacGram * data.giaKimLoai.giaBacMoiGram)]
  ];

  metalItems.forEach(([label, value]) => {
    if (label) {
      doc.text(label, 25, yPosition);
      doc.text(value, 120, yPosition);
    }
    yPosition += lineHeight;
  });

  yPosition += sectionSpacing;

  // Nisab Information
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text('3. THÔNG TIN NISAB', 20, yPosition);
  yPosition += lineHeight + 5;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const nisabItems = [
    ['Nisab vàng (87.48g):', formatCurrency(data.ketQua.nisabVangVND)],
    ['Nisab bạc (612.36g):', formatCurrency(data.ketQua.nisabBacVND)],
    ['Ngưỡng áp dụng:', formatCurrency(data.ketQua.nguongNisab)]
  ];

  nisabItems.forEach(([label, value]) => {
    doc.text(label, 25, yPosition);
    doc.text(value, 120, yPosition);
    yPosition += lineHeight;
  });

  yPosition += sectionSpacing;

  // Calculation Results
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text('4. KẾT QUẢ TÍNH TOÁN', 20, yPosition);
  yPosition += lineHeight + 5;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const resultItems = [
    ['Tổng tài sản:', formatCurrency(data.ketQua.tongTaiSan)],
    ['Tài sản ròng:', formatCurrency(data.ketQua.taiSanRong)],
    ['Đủ điều kiện Zakat:', data.ketQua.duDieuKienZakat ? 'Có' : 'Không']
  ];

  resultItems.forEach(([label, value]) => {
    doc.text(label, 25, yPosition);
    doc.text(value, 120, yPosition);
    yPosition += lineHeight;
  });

  yPosition += lineHeight;

  // Zakat Amount (highlighted)
  doc.setFillColor(240, 248, 255);
  doc.rect(20, yPosition - 3, 170, 12, 'F');
  doc.setFontSize(12);
  doc.setTextColor(0, 100, 200);
  doc.text('SỐ TIỀN ZAKAT CẦN NỘP:', 25, yPosition + 5);
  doc.setFontSize(14);
  doc.setTextColor(200, 0, 0);
  doc.text(formatCurrency(data.ketQua.soTienZakat), 120, yPosition + 5);

  yPosition += sectionSpacing * 2;

  // Important Notes
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text('5. LƯU Ý QUAN TRỌNG', 20, yPosition);
  yPosition += lineHeight + 5;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const notes = [
    '• Zakat phải được tính cho tài sản nắm giữ ít nhất 1 năm Hijri',
    '• Tỷ lệ Zakat là 2.5% tài sản ròng vượt ngưỡng nisab',
    '• Giá kim loại quý có thể biến động theo thị trường',
    '• Nên tham khảo ý kiến học giả Hồi giáo để đảm bảo chính xác',
    '• Báo cáo này chỉ mang tính chất tham khảo'
  ];

  notes.forEach(note => {
    doc.text(note, 25, yPosition);
    yPosition += lineHeight;
  });

  // Footer
  yPosition = 280;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Được tạo bởi Muslim Việt - Máy tính Zakat', 105, yPosition, { align: 'center' });
  doc.text(`Tạo lúc: ${new Date().toLocaleString('vi-VN')}`, 105, yPosition + 5, { align: 'center' });

  // Save the PDF
  const fileName = `zakat-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateZakatSummaryPDF = async (data: ZakatPDFData): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Simple summary version
  let yPosition = 40;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 100, 200);
  doc.text('PHIẾU ZAKAT', 105, yPosition, { align: 'center' });
  
  yPosition += 30;

  // Main result box
  doc.setFillColor(240, 248, 255);
  doc.rect(30, yPosition - 10, 150, 40, 'F');
  doc.setDrawColor(0, 100, 200);
  doc.rect(30, yPosition - 10, 150, 40, 'S');

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Tài sản ròng:', 40, yPosition + 5);
  doc.text(formatCurrency(data.ketQua.taiSanRong), 140, yPosition + 5);

  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text('Zakat cần nộp:', 40, yPosition + 20);
  doc.text(formatCurrency(data.ketQua.soTienZakat), 140, yPosition + 20);

  yPosition += 60;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tính ngày: ${data.ngayTinh}`, 105, yPosition, { align: 'center' });

  // Save
  const fileName = `zakat-summary-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
