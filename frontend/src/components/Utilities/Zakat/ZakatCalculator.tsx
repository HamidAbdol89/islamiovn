import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calculator, Info, DollarSign, Coins, CreditCard, Building2, TrendingUp, ChevronLeft, ChevronRight, Check, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BackButton from "@/components/ui/BackButton";

interface ZakatCalculatorProps {}

interface GiaTriTaiSan {
  tienMat: number;
  tietKiem: number;
  vang: number;
  bac: number;
  dauTu: number;
  kinhDoanh: number;
  congNo: number;
}

interface GiaVangBac {
  giaVangMoiGram: number;
  giaBacMoiGram: number;
}

interface BuocTinhZakat {
  id: number;
  tieuDe: string;
  moTa: string;
  icon: React.ComponentType<any>;
  loai: 'tienMat' | 'kimLoai' | 'taiSan' | 'congNo' | 'ketQua';
}

// Vietnamese constants
const BUOC_TINH_ZAKAT: BuocTinhZakat[] = [
  {
    id: 1,
    tieuDe: 'Tiền mặt & Tiết kiệm',
    moTa: 'Nhập số tiền mặt và tiết kiệm ngân hàng',
    icon: DollarSign,
    loai: 'tienMat'
  },
  {
    id: 2,
    tieuDe: 'Kim loại quý',
    moTa: 'Nhập khối lượng vàng và bạc sở hữu',
    icon: Coins,
    loai: 'kimLoai'
  },
  {
    id: 3,
    tieuDe: 'Tài sản khác',
    moTa: 'Đầu tư, cổ phiếu và tài sản kinh doanh',
    icon: TrendingUp,
    loai: 'taiSan'
  },
  {
    id: 4,
    tieuDe: 'Công nợ',
    moTa: 'Tổng số nợ và nghĩa vụ tài chính',
    icon: Building2,
    loai: 'congNo'
  },
  {
    id: 5,
    tieuDe: 'Kết quả Zakat',
    moTa: 'Xem kết quả tính toán Zakat của bạn',
    icon: Calculator,
    loai: 'ketQua'
  }
];

const SO_TIEN_NHANH = [
  { nhan: '100K', giaTri: 100000 },
  { nhan: '500K', giaTri: 500000 },
  { nhan: '1TR', giaTri: 1000000 },
  { nhan: '5TR', giaTri: 5000000 },
  { nhan: '10TR', giaTri: 10000000 },
  { nhan: '50TR', giaTri: 50000000 }
];

const ZakatCalculator: React.FC<ZakatCalculatorProps> = () => {
  const [buocHienTai, setBuocHienTai] = useState(1);
  const [taiSan, setTaiSan] = useState<GiaTriTaiSan>({
    tienMat: 0,
    tietKiem: 0,
    vang: 0,
    bac: 0,
    dauTu: 0,
    kinhDoanh: 0,
    congNo: 0
  });

  const [khoiLuongKimLoai, setKhoiLuongKimLoai] = useState({
    vangGram: 0,
    bacGram: 0
  });

  const [giaKimLoai, setGiaKimLoai] = useState<GiaVangBac>({
    giaVangMoiGram: 1650000, // VND per gram
    giaBacMoiGram: 21500 // VND per gram
  });

  const [dangTai, setDangTai] = useState(false);
  const [trangThaiAPI, setTrangThaiAPI] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Nisab thresholds (Islamic standards)
  const NISAB_VANG_GRAM = 87.48;
  const NISAB_BAC_GRAM = 612.36;
  const TY_LE_ZAKAT = 0.025;

  // Calculate nisab values in VND
  const nisabVangVND = useMemo(() => NISAB_VANG_GRAM * giaKimLoai.giaVangMoiGram, [giaKimLoai.giaVangMoiGram]);
  const nisabBacVND = useMemo(() => NISAB_BAC_GRAM * giaKimLoai.giaBacMoiGram, [giaKimLoai.giaBacMoiGram]);
  const nguongNisab = useMemo(() => Math.min(nisabVangVND, nisabBacVND), [nisabVangVND, nisabBacVND]);

  const giaTriVangVND = useMemo(() => khoiLuongKimLoai.vangGram * giaKimLoai.giaVangMoiGram, [khoiLuongKimLoai.vangGram, giaKimLoai.giaVangMoiGram]);
  const giaTriBacVND = useMemo(() => khoiLuongKimLoai.bacGram * giaKimLoai.giaBacMoiGram, [khoiLuongKimLoai.bacGram, giaKimLoai.giaBacMoiGram]);

  const tongTaiSan = useMemo(() => taiSan.tienMat + taiSan.tietKiem + taiSan.vang + taiSan.bac + taiSan.dauTu + taiSan.kinhDoanh + giaTriVangVND + giaTriBacVND, [taiSan, giaTriVangVND, giaTriBacVND]);

  const taiSanRong = useMemo(() => tongTaiSan - taiSan.congNo, [tongTaiSan, taiSan.congNo]);

  // Check if eligible for zakat
  const duDieuKienZakat = taiSanRong >= nguongNisab;
  const soTienZakat = duDieuKienZakat ? taiSanRong * TY_LE_ZAKAT : 0;

  // Fetch current gold/silver prices from API
  const capNhatGiaKimLoai = useCallback(async () => {
    setDangTai(true);
    setTrangThaiAPI('Đang cập nhật giá kim loại...');
    
    try {
      // Simulate API call for Vietnamese gold/silver prices
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update with current Vietnamese market prices (example)
      setGiaKimLoai({
        giaVangMoiGram: 1650000 + Math.random() * 50000, // VND
        giaBacMoiGram: 21500 + Math.random() * 2000 // VND
      });
      
      setTrangThaiAPI('Đã cập nhật giá thành công');
    } catch (error) {
      console.error('Lỗi cập nhật giá:', error);
      setTrangThaiAPI('Lỗi kết nối - sử dụng giá mặc định');
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    capNhatGiaKimLoai();
  }, [capNhatGiaKimLoai]);

  // Memoized handlers
  const xuLyThayDoiTaiSan = useCallback((key: keyof GiaTriTaiSan, value: string) => {
    const giaTri = parseFloat(value) || 0;
    setTaiSan(prev => ({ ...prev, [key]: giaTri }));
  }, []);

  const xuLyThayDoiKhoiLuong = useCallback((key: 'vangGram' | 'bacGram', value: string) => {
    const giaTri = parseFloat(value) || 0;
    setKhoiLuongKimLoai(prev => ({ ...prev, [key]: giaTri }));
  }, []);

  const themSoTienNhanh = useCallback((key: keyof GiaTriTaiSan, soTien: number) => {
    setTaiSan(prev => ({ ...prev, [key]: prev[key] + soTien }));
  }, []);

  // Vietnamese currency formatting
  const dinhDangTienVND = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const dinhDangTienRutGon = useCallback((amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString('vi-VN');
  }, []);

  // Step navigation handlers
  const chuyenBuocTiep = useCallback(() => {
    if (buocHienTai < BUOC_TINH_ZAKAT.length) {
      setBuocHienTai(buocHienTai + 1);
    }
  }, [buocHienTai]);

  const chuyenBuocTruoc = useCallback(() => {
    if (buocHienTai > 1) {
      setBuocHienTai(buocHienTai - 1);
    }
  }, [buocHienTai]);

  // Memoized components
  const NhapLieuTienTe = React.memo(({ 
    nhan, 
    giaTri, 
    thayDoi, 
    icon: Icon,
    khoaTaiSan,
    placeholder = "0",
    hienThiNutNhanh = true
  }: {
    nhan: string;
    giaTri: number;
    thayDoi: (value: string) => void;
    icon: React.ComponentType<any>;
    khoaTaiSan?: keyof GiaTriTaiSan;
    placeholder?: string;
    hienThiNutNhanh?: boolean;
  }) => (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="w-4 h-4 text-primary" />
        {nhan}
      </Label>
      
      <div className="space-y-2">
        <Input
          type="number"
          inputMode="numeric"
          value={giaTri || ''}
          onChange={(e) => thayDoi(e.target.value)}
          placeholder={placeholder}
          className="text-lg"
        />
        
        {giaTri > 0 && (
          <Badge variant="secondary" className="text-xs">
            {dinhDangTienRutGon(giaTri)} VND
          </Badge>
        )}
        
        {hienThiNutNhanh && khoaTaiSan && (
          <div className="flex flex-wrap gap-2">
            {SO_TIEN_NHANH.map((preset) => (
              <Button
                key={preset.nhan}
                variant="outline"
                size="sm"
                onClick={() => themSoTienNhanh(khoaTaiSan, preset.giaTri)}
                className="text-xs"
              >
                +{preset.nhan}
              </Button>
            ))}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setTaiSan(prev => ({ ...prev, [khoaTaiSan]: 0 }))}
              className="text-xs"
            >
              Xóa
            </Button>
          </div>
        )}
      </div>
    </div>
  ));

  const NhapLieuKhoiLuong = React.memo(({ 
    nhan, 
    giaTri, 
    thayDoi, 
    icon: Icon,
    giaTriTinhToan,
    donVi = "gram"
  }: {
    nhan: string;
    giaTri: number;
    thayDoi: (value: string) => void;
    icon: React.ComponentType<any>;
    giaTriTinhToan: number;
    donVi?: string;
  }) => (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="w-4 h-4 text-yellow-500" />
        {nhan}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="number"
            inputMode="decimal"
            value={giaTri || ''}
            onChange={(e) => thayDoi(e.target.value)}
            placeholder="0"
            className="text-lg pr-16"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {donVi}
          </span>
        </div>
        
        {giaTri > 0 && (
          <Badge variant="secondary" className="text-xs">
            Giá trị: {dinhDangTienRutGon(giaTriTinhToan)} VND
          </Badge>
        )}
      </div>
    </div>
  ));

  // Progress calculation
  const tienDoHoanThanh = (buocHienTai / BUOC_TINH_ZAKAT.length) * 100;

  // Render step content based on current step
  const renderBuocHienTai = () => {
    const buoc = BUOC_TINH_ZAKAT[buocHienTai - 1];
    
    switch (buoc.loai) {
      case 'tienMat':
        return (
          <div className="space-y-6">
            <NhapLieuTienTe
              nhan="Tiền mặt"
              giaTri={taiSan.tienMat}
              thayDoi={(v) => xuLyThayDoiTaiSan('tienMat', v)}
              icon={DollarSign}
              khoaTaiSan="tienMat"
            />
            <NhapLieuTienTe
              nhan="Tiết kiệm ngân hàng"
              giaTri={taiSan.tietKiem}
              thayDoi={(v) => xuLyThayDoiTaiSan('tietKiem', v)}
              icon={CreditCard}
              khoaTaiSan="tietKiem"
            />
          </div>
        );
        
      case 'kimLoai':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Giá kim loại hiện tại
                </CardTitle>
                <CardDescription>
                  {trangThaiAPI}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Vàng</div>
                    <div className="font-semibold">{dinhDangTienRutGon(giaKimLoai.giaVangMoiGram)}/g</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Bạc</div>
                    <div className="font-semibold">{dinhDangTienRutGon(giaKimLoai.giaBacMoiGram)}/g</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={capNhatGiaKimLoai} 
                  disabled={dangTai}
                  className="w-full"
                >
                  {dangTai ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Cập nhật giá
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <NhapLieuKhoiLuong
              nhan="Vàng (gram)"
              giaTri={khoiLuongKimLoai.vangGram}
              thayDoi={(v) => xuLyThayDoiKhoiLuong('vangGram', v)}
              icon={Coins}
              giaTriTinhToan={giaTriVangVND}
            />
            <NhapLieuKhoiLuong
              nhan="Bạc (gram)"
              giaTri={khoiLuongKimLoai.bacGram}
              thayDoi={(v) => xuLyThayDoiKhoiLuong('bacGram', v)}
              icon={Coins}
              giaTriTinhToan={giaTriBacVND}
            />
            <NhapLieuTienTe
              nhan="Vàng/bạc khác (VND)"
              giaTri={taiSan.vang}
              thayDoi={(v) => xuLyThayDoiTaiSan('vang', v)}
              icon={Coins}
              khoaTaiSan="vang"
            />
          </div>
        );
        
      case 'taiSan':
        return (
          <div className="space-y-6">
            <NhapLieuTienTe
              nhan="Đầu tư/Cổ phiếu"
              giaTri={taiSan.dauTu}
              thayDoi={(v) => xuLyThayDoiTaiSan('dauTu', v)}
              icon={TrendingUp}
              khoaTaiSan="dauTu"
            />
            <NhapLieuTienTe
              nhan="Tài sản kinh doanh"
              giaTri={taiSan.kinhDoanh}
              thayDoi={(v) => xuLyThayDoiTaiSan('kinhDoanh', v)}
              icon={Building2}
              khoaTaiSan="kinhDoanh"
            />
          </div>
        );
        
      case 'congNo':
        return (
          <div className="space-y-6">
            <NhapLieuTienTe
              nhan="Tổng công nợ"
              giaTri={taiSan.congNo}
              thayDoi={(v) => xuLyThayDoiTaiSan('congNo', v)}
              icon={Building2}
              khoaTaiSan="congNo"
              hienThiNutNhanh={false}
            />
          </div>
        );
        
      case 'ketQua':
        return (
          <div className="space-y-6">
            {/* Nisab Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Thông tin Nisab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Nisab Vàng:</span>
                  <span className="font-medium">{dinhDangTienRutGon(nisabVangVND)} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>Nisab Bạc:</span>
                  <span className="font-medium">{dinhDangTienRutGon(nisabBacVND)} VND</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Ngưỡng áp dụng:</span>
                  <span>{dinhDangTienRutGon(nguongNisab)} VND</span>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng kết tài sản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tổng tài sản:</span>
                  <span className="font-medium">{dinhDangTienRutGon(tongTaiSan)} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng công nợ:</span>
                  <span className="font-medium text-destructive">-{dinhDangTienRutGon(taiSan.congNo)} VND</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tài sản ròng:</span>
                  <span className="text-primary">{dinhDangTienRutGon(taiSanRong)} VND</span>
                </div>
              </CardContent>
            </Card>

            {/* Zakat Result */}
            <Card className={duDieuKienZakat ? "border-primary bg-primary/5" : "border-muted"}>
              <CardContent className="pt-6 text-center">
                {duDieuKienZakat && <Star className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse" />}
                <h3 className="text-xl font-semibold mb-3">
                  {duDieuKienZakat ? 'Bạn cần nộp Zakat' : 'Bạn chưa đủ điều kiện nộp Zakat'}
                </h3>
                <div className="text-3xl font-bold mb-2 text-primary">
                  {dinhDangTienVND(soTienZakat)}
                </div>
                {duDieuKienZakat && (
                  <p className="text-sm text-muted-foreground">
                    (2.5% của {dinhDangTienRutGon(taiSanRong)} VND)
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Lưu ý quan trọng:</p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Zakat phải được tính cho tài sản nắm giữ ít nhất 1 năm Hijri</li>
                    <li>• Tỷ lệ Zakat là 2.5% tài sản ròng vượt ngưỡng nisab</li>
                    <li>• Giá kim loại quý có thể biến động theo thị trường</li>
                    <li>• Nên tham khảo ý kiến học giả Hồi giáo để đảm bảo chính xác</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isMobile) {
    // Mobile step-by-step fullscreen interface
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <BackButton />
              <div>
                <h1 className="text-lg font-semibold">Tính Zakat</h1>
                <p className="text-sm text-muted-foreground">
                  Bước {buocHienTai}/{BUOC_TINH_ZAKAT.length}
                </p>
              </div>
            </div>
          </div>
          <Progress value={tienDoHoanThanh} className="h-1" />
        </div>

        {/* Step Content */}
        <div className="p-4 pb-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(BUOC_TINH_ZAKAT[buocHienTai - 1].icon, { className: "w-5 h-5" })}
                {BUOC_TINH_ZAKAT[buocHienTai - 1].tieuDe}
              </CardTitle>
              <CardDescription>
                {BUOC_TINH_ZAKAT[buocHienTai - 1].moTa}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBuocHienTai()}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={chuyenBuocTruoc}
              disabled={buocHienTai === 1}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Trước
            </Button>
            <Button
              onClick={chuyenBuocTiep}
              disabled={buocHienTai === BUOC_TINH_ZAKAT.length}
              className="flex-1"
            >
              {buocHienTai === BUOC_TINH_ZAKAT.length ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Hoàn thành
                </>
              ) : (
                <>
                  Tiếp
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop interface - show all inputs in organized layout
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BackButton />
              <Calculator className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl">Máy tính Zakat</CardTitle>
                <CardDescription>
                  Tính toán Zakat chính xác theo tiêu chuẩn Hồi giáo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Input Forms */}
              <div className="xl:col-span-2 space-y-6">
                {/* Cash & Savings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Tiền mặt & Tiết kiệm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tienMat">Tiền mặt</Label>
                        <div className="relative">
                          <Input
                            id="tienMat"
                            type="number"
                            inputMode="decimal"
                            value={taiSan.tienMat || ''}
                            onChange={(e) => setTaiSan(prev => ({ ...prev, tienMat: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            VND
                          </span>
                        </div>
                        {taiSan.tienMat > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {dinhDangTienRutGon(taiSan.tienMat)} VND
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tietKiem">Tiết kiệm</Label>
                        <div className="relative">
                          <Input
                            id="tietKiem"
                            type="number"
                            inputMode="decimal"
                            value={taiSan.tietKiem || ''}
                            onChange={(e) => setTaiSan(prev => ({ ...prev, tietKiem: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            VND
                          </span>
                        </div>
                        {taiSan.tietKiem > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {dinhDangTienRutGon(taiSan.tietKiem)} VND
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SO_TIEN_NHANH.map((item) => (
                        <Button
                          key={item.nhan}
                          variant="outline"
                          size="sm"
                          onClick={() => setTaiSan(prev => ({ 
                            ...prev, 
                            tienMat: prev.tienMat + item.giaTri 
                          }))}
                        >
                          +{item.nhan}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Precious Metals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Kim loại quý
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Vàng</div>
                        <div className="font-semibold">{dinhDangTienRutGon(giaKimLoai.giaVangMoiGram)}/g</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Bạc</div>
                        <div className="font-semibold">{dinhDangTienRutGon(giaKimLoai.giaBacMoiGram)}/g</div>
                      </div>
                    </div>
                    <Button 
                      onClick={capNhatGiaKimLoai}
                      disabled={dangTai}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${dangTai ? 'animate-spin' : ''}`} />
                      {dangTai ? 'Đang cập nhật...' : 'Cập nhật giá'}
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vangGram">Vàng</Label>
                        <div className="relative">
                          <Input
                            id="vangGram"
                            type="number"
                            inputMode="decimal"
                            value={khoiLuongKimLoai.vangGram || ''}
                            onChange={(e) => setKhoiLuongKimLoai(prev => ({ ...prev, vangGram: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            gram
                          </span>
                        </div>
                        {khoiLuongKimLoai.vangGram > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Giá trị: {dinhDangTienRutGon(khoiLuongKimLoai.vangGram * giaKimLoai.giaVangMoiGram)} VND
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bacGram">Bạc</Label>
                        <div className="relative">
                          <Input
                            id="bacGram"
                            type="number"
                            inputMode="decimal"
                            value={khoiLuongKimLoai.bacGram || ''}
                            onChange={(e) => setKhoiLuongKimLoai(prev => ({ ...prev, bacGram: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            gram
                          </span>
                        </div>
                        {khoiLuongKimLoai.bacGram > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Giá trị: {dinhDangTienRutGon(khoiLuongKimLoai.bacGram * giaKimLoai.giaBacMoiGram)} VND
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Assets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Tài sản khác
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dauTu">Đầu tư</Label>
                        <div className="relative">
                          <Input
                            id="dauTu"
                            type="number"
                            inputMode="decimal"
                            value={taiSan.dauTu || ''}
                            onChange={(e) => setTaiSan(prev => ({ ...prev, dauTu: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            VND
                          </span>
                        </div>
                        {taiSan.dauTu > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {dinhDangTienRutGon(taiSan.dauTu)} VND
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="kinhDoanh">Kinh doanh</Label>
                        <div className="relative">
                          <Input
                            id="kinhDoanh"
                            type="number"
                            inputMode="decimal"
                            value={taiSan.kinhDoanh || ''}
                            onChange={(e) => setTaiSan(prev => ({ ...prev, kinhDoanh: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            className="text-lg pr-16"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            VND
                          </span>
                        </div>
                        {taiSan.kinhDoanh > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {dinhDangTienRutGon(taiSan.kinhDoanh)} VND
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Debts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Công nợ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="congNo">Tổng công nợ</Label>
                      <div className="relative">
                        <Input
                          id="congNo"
                          type="number"
                          inputMode="decimal"
                          value={taiSan.congNo || ''}
                          onChange={(e) => setTaiSan(prev => ({ ...prev, congNo: parseFloat(e.target.value) || 0 }))}
                          placeholder="0"
                          className="text-lg pr-16"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                          VND
                        </span>
                      </div>
                      {taiSan.congNo > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {dinhDangTienRutGon(taiSan.congNo)} VND
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {/* Nisab Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Thông tin Nisab
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Nisab Vàng:</span>
                      <span className="font-medium">{dinhDangTienRutGon(nisabVangVND)} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nisab Bạc:</span>
                      <span className="font-medium">{dinhDangTienRutGon(nisabBacVND)} VND</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Ngưỡng áp dụng:</span>
                      <span>{dinhDangTienRutGon(nguongNisab)} VND</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Wealth Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Tổng kết tài sản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tổng tài sản:</span>
                      <span className="font-medium">{dinhDangTienRutGon(tongTaiSan)} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng công nợ:</span>
                      <span className="font-medium text-destructive">-{dinhDangTienRutGon(taiSan.congNo)} VND</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Tài sản ròng:</span>
                      <span className="text-primary">{dinhDangTienRutGon(taiSanRong)} VND</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Zakat Result */}
                <Card className={duDieuKienZakat ? "border-primary bg-primary/5" : "border-muted"}>
                  <CardContent className="pt-6 text-center">
                    {duDieuKienZakat && <Star className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse" />}
                    <h3 className="text-xl font-semibold mb-3">
                      {duDieuKienZakat ? 'Bạn cần nộp Zakat' : 'Bạn chưa đủ điều kiện nộp Zakat'}
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {dinhDangTienVND(soTienZakat)} VND
                    </div>
                    {duDieuKienZakat && (
                      <p className="text-sm text-muted-foreground">
                        (2.5% của {dinhDangTienRutGon(taiSanRong)} VND)
                      </p>
                    )}
                  </CardContent>
                </Card>

                {trangThaiAPI && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{trangThaiAPI}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZakatCalculator;