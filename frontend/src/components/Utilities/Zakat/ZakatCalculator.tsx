import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Check, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BackButton from "@/components/ui/BackButton";

// Import modular components and hooks
import { 
  CurrencyInput, 
  WeightInput, 
  ZakatResult, 
  GoldSilverPrices 
} from './components';
import { 
  useZakatCalculation, 
  useZakatValidation, 
  useZakatStorage, 
  useGoldSilverPrices 
} from './hooks';
import type { GiaTriTaiSan, KhoiLuongKimLoai } from './types';
import { BUOC_TINH_ZAKAT } from './constants';
import { generateZakatPDF, generateZakatSummaryPDF } from './utils/pdfExport';

// Memoized Progress Indicator Component
const ProgressIndicator = memo(({ current, total, percentage }: {
  current: number;
  total: number;
  percentage: number;
}) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">
        Tiến độ: {current}/{total}
      </span>
      <span className="text-sm text-muted-foreground">
        {percentage}%
      </span>
    </div>
    <Progress value={(current / total) * 100} className="h-2" />
  </div>
));
ProgressIndicator.displayName = 'ProgressIndicator';

// Memoized Step Indicator Component
const StepIndicator = memo(({ steps, currentStep }: {
  steps: typeof BUOC_TINH_ZAKAT;
  currentStep: number;
}) => (
  <div className="flex gap-2">
    {steps.map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-colors ${
          index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
        }`}
      />
    ))}
  </div>
));
StepIndicator.displayName = 'StepIndicator';

// Memoized Navigation Buttons Component
const NavigationButtons = memo(({ 
  onPrevious, 
  onNext, 
  isFirstStep, 
  isLastStep 
}: {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) => (
  <>
    <Button
      variant="outline"
      onClick={onPrevious}
      disabled={isFirstStep}
      className="flex items-center gap-2"
    >
      <ChevronLeft className="w-4 h-4" />
      Trước
    </Button>
    <Button
      onClick={onNext}
      disabled={isLastStep}
      className="flex items-center gap-2"
    >
      Tiếp
      <ChevronRight className="w-4 h-4" />
    </Button>
  </>
));
NavigationButtons.displayName = 'NavigationButtons';

const ZakatCalculator: React.FC = () => {
  // State management
  const [buocHienTai, setBuocHienTai] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Asset state
  const [taiSan, setTaiSan] = useState<GiaTriTaiSan>({
    tienMat: 0,
    tietKiem: 0,
    vang: 0,
    bac: 0,
    dauTu: 0,
    kinhDoanh: 0,
    congNo: 0
  });

  const [khoiLuongKimLoai, setKhoiLuongKimLoai] = useState<KhoiLuongKimLoai>({
    vangGram: 0,
    bacGram: 0
  });

  // Custom hooks
  const { prices, status, updatePrices } = useGoldSilverPrices();
  const { validateTaiSanField, validateKimLoaiField } = useZakatValidation();
  const { saveZakatData, loadZakatData } = useZakatStorage();
  const ketQuaZakat = useZakatCalculation(taiSan, khoiLuongKimLoai, prices);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleTaiSanChange = useCallback((field: keyof GiaTriTaiSan, value: number) => {
    const validation = validateTaiSanField(field, value);
    if (!validation) {
      setTaiSan(prev => ({ ...prev, [field]: value }));
    }
  }, [validateTaiSanField]);

  const handleKimLoaiChange = useCallback((field: keyof KhoiLuongKimLoai, value: number) => {
    const validation = validateKimLoaiField(field, value);
    if (!validation) {
      setKhoiLuongKimLoai(prev => ({ ...prev, [field]: value }));
    }
  }, [validateKimLoaiField]);

  const handleSaveData = useCallback(async () => {
    try {
      saveZakatData({
        taiSan,
        khoiLuongKimLoai,
        giaKimLoai: prices
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [taiSan, khoiLuongKimLoai, prices, saveZakatData]);

  const handleExportPDF = useCallback(async (type: 'detailed' | 'summary' = 'detailed') => {
    try {
      if (type === 'detailed') {
        await generateZakatPDF({
          taiSan,
          khoiLuongKimLoai,
          ketQua: ketQuaZakat,
          giaKimLoai: prices,
          ngayTinh: new Date().toISOString()
        });
      } else {
        await generateZakatSummaryPDF({
          taiSan,
          khoiLuongKimLoai,
          ketQua: ketQuaZakat,
          giaKimLoai: prices,
          ngayTinh: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, [taiSan, khoiLuongKimLoai, ketQuaZakat, prices]);

  // Memoized calculations
  const tienDoHoanThanh = useMemo(() => 
    (buocHienTai / BUOC_TINH_ZAKAT.length) * 100, 
    [buocHienTai]
  );

  const buocHienTaiData = useMemo(() => 
    BUOC_TINH_ZAKAT[buocHienTai - 1], 
    [buocHienTai]
  );

  const isFirstStep = useMemo(() => buocHienTai === 1, [buocHienTai]);
  const isLastStep = useMemo(() => buocHienTai === BUOC_TINH_ZAKAT.length, [buocHienTai]);

  // Memoized class names
  const progressPercentage = useMemo(() => Math.round(tienDoHoanThanh), [tienDoHoanThanh]);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadZakatData();
    if (savedData) {
      setTaiSan(savedData.taiSan);
      setKhoiLuongKimLoai(savedData.khoiLuongKimLoai);
    }
  }, [loadZakatData]);

  // Memoized handlers with optimized dependencies
  const chuyenBuocTiep = useCallback(() => {
    setBuocHienTai(prev => prev < BUOC_TINH_ZAKAT.length ? prev + 1 : prev);
  }, []);

  const chuyenBuocTruoc = useCallback(() => {
    setBuocHienTai(prev => prev > 1 ? prev - 1 : prev);
  }, []);

  // Memoized step navigation handler
  const handleStepClick = useCallback((stepId: number) => {
    setBuocHienTai(stepId);
  }, []);

  // Render step content based on current step
  const renderBuocHienTai = useCallback(() => {
    const buoc = BUOC_TINH_ZAKAT[buocHienTai - 1];
    
    switch (buoc.loai) {
      case 'tienMat':
        return (
          <div className="space-y-6">
            <CurrencyInput
              label="Tiền mặt"
              value={taiSan.tienMat}
              onChange={(value) => handleTaiSanChange('tienMat', value)}
              fieldKey="tienMat"
            />
            <CurrencyInput
              label="Tiết kiệm ngân hàng"
              value={taiSan.tietKiem}
              onChange={(value) => handleTaiSanChange('tietKiem', value)}
              fieldKey="tietKiem"
            />
          </div>
        );
        
      case 'kimLoai':
        return (
          <div className="space-y-6">
            <GoldSilverPrices
              prices={prices}
              isLoading={status.isLoading}
              lastUpdated={status.lastUpdated}
              error={status.error}
              onUpdate={updatePrices}
            />
            
            <WeightInput
              label="Vàng (gram)"
              value={khoiLuongKimLoai.vangGram}
              onChange={(value) => handleKimLoaiChange('vangGram', value)}
              calculatedValue={khoiLuongKimLoai.vangGram * prices.giaVangMoiGram}
              fieldKey="vangGram"
            />
            <WeightInput
              label="Bạc (gram)"
              value={khoiLuongKimLoai.bacGram}
              onChange={(value) => handleKimLoaiChange('bacGram', value)}
              calculatedValue={khoiLuongKimLoai.bacGram * prices.giaBacMoiGram}
              fieldKey="bacGram"
            />
            <CurrencyInput
              label="Vàng/bạc khác (VND)"
              value={taiSan.vang}
              onChange={(value) => handleTaiSanChange('vang', value)}
              fieldKey="vang"
            />
          </div>
        );
        
      case 'taiSan':
        return (
          <div className="space-y-6">
            <CurrencyInput
              label="Đầu tư/Cổ phiếu"
              value={taiSan.dauTu}
              onChange={(value) => handleTaiSanChange('dauTu', value)}
              fieldKey="dauTu"
            />
            <CurrencyInput
              label="Tài sản kinh doanh"
              value={taiSan.kinhDoanh}
              onChange={(value) => handleTaiSanChange('kinhDoanh', value)}
              fieldKey="kinhDoanh"
            />
          </div>
        );
        
      case 'congNo':
        return (
          <div className="space-y-6">
            <CurrencyInput
              label="Tổng công nợ"
              value={taiSan.congNo}
              onChange={(value) => handleTaiSanChange('congNo', value)}
              fieldKey="congNo"
              showQuickButtons={false}
            />
          </div>
        );
        
      case 'ketQua':
        return (
          <ZakatResult
            ketQua={ketQuaZakat}
            onSave={handleSaveData}
            onExportPDF={handleExportPDF}
          />
        );
        
      default:
        return null;
    }
  }, [buocHienTai, taiSan, khoiLuongKimLoai, prices, status, ketQuaZakat, handleTaiSanChange, handleKimLoaiChange, updatePrices, handleSaveData, handleExportPDF]);

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
                {React.createElement(buocHienTaiData.icon, { className: "w-5 h-5" })}
                {buocHienTaiData.tieuDe}
              </CardTitle>
              <CardDescription>
                {buocHienTaiData.moTa}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBuocHienTai()}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <NavigationButtons
              onPrevious={chuyenBuocTruoc}
              onNext={chuyenBuocTiep}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
            <StepIndicator 
              steps={BUOC_TINH_ZAKAT} 
              currentStep={buocHienTai} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop interface - show all steps
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BackButton />
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Máy tính Zakat</h1>
          </div>
          <p className="text-muted-foreground">
            Tính toán Zakat theo chuẩn Hồi giáo một cách chính xác
          </p>
        </div>

        {/* Progress */}
        <ProgressIndicator
          current={buocHienTai}
          total={BUOC_TINH_ZAKAT.length}
          percentage={progressPercentage}
        />

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {BUOC_TINH_ZAKAT.map((buoc) => (
            <Card 
              key={buoc.id}
              className={`cursor-pointer transition-all ${
                buocHienTai === buoc.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleStepClick(buoc.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {React.createElement(buoc.icon, { className: "w-6 h-6 text-primary mr-2" })}
                  <CardTitle className="text-lg">{buoc.tieuDe}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {buoc.moTa}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBuocHienTai()}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Asset Chart - Commented out until AssetChart component is properly typed */}
        {/* <div className="mb-8">
          <AssetChart 
            taiSan={taiSan}
            khoiLuongKimLoai={khoiLuongKimLoai}
            giaVang={prices.giaVangMoiGram}
            giaBac={prices.giaBacMoiGram}
          />
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSaveData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Lưu dữ liệu
          </Button>
          
          <Button
            onClick={() => handleExportPDF('detailed')}
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Xuất PDF chi tiết
          </Button>
          
          <Button
            onClick={() => handleExportPDF('summary')}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Xuất tóm tắt
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export memoized component for performance optimization
export default memo(ZakatCalculator);