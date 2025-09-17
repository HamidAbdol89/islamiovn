import React from 'react';
import { Star, Info, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { KetQuaZakat } from '../types';
import AnimatedCard from './AnimatedCard';

interface ZakatResultProps {
  ketQua: KetQuaZakat;
  onSave?: () => void;
  onExportPDF?: () => void;
  className?: string;
}

const ZakatResult = React.memo<ZakatResultProps>(({ 
  ketQua, 
  onSave, 
  onExportPDF,
  className 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
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
  };

  return (
    <div className={className}>
      {/* Nisab Information */}
      <AnimatedCard 
        title="Thông tin Nisab" 
        icon={Info}
        delay={0}
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Nisab Vàng:</span>
            <span className="font-medium">{formatShortCurrency(ketQua.nisabVangVND)} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Nisab Bạc:</span>
            <span className="font-medium">{formatShortCurrency(ketQua.nisabBacVND)} VND</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Ngưỡng áp dụng:</span>
            <span className="text-primary">{formatShortCurrency(ketQua.nguongNisab)} VND</span>
          </div>
        </div>
      </AnimatedCard>

      {/* Wealth Summary */}
      <AnimatedCard 
        title="Tổng kết tài sản" 
        delay={100}
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Tổng tài sản:</span>
            <span className="font-medium">{formatShortCurrency(ketQua.tongTaiSan)} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Tài sản ròng:</span>
            <span className="font-medium text-primary">{formatShortCurrency(ketQua.taiSanRong)} VND</span>
          </div>
        </div>
      </AnimatedCard>

      {/* Zakat Result */}
      <AnimatedCard 
        className={ketQua.duDieuKienZakat ? "border-primary bg-primary/5" : "border-muted"}
        delay={200}
      >
        <div className="text-center">
          {ketQua.duDieuKienZakat && (
            <Star className="w-8 h-8 mx-auto mb-3 text-primary animate-pulse" />
          )}
          <h3 className="text-xl font-semibold mb-3">
            {ketQua.duDieuKienZakat ? 'Bạn cần nộp Zakat' : 'Bạn chưa đủ điều kiện nộp Zakat'}
          </h3>
          <div className="text-3xl font-bold mb-2 text-primary">
            {formatCurrency(ketQua.soTienZakat)}
          </div>
          {ketQua.duDieuKienZakat && (
            <p className="text-sm text-muted-foreground mb-4">
              (2.5% của {formatShortCurrency(ketQua.taiSanRong)} VND)
            </p>
          )}
          
          {/* Action Buttons */}
          {ketQua.duDieuKienZakat && (
            <div className="flex gap-2 justify-center mt-4">
              {onSave && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSave}
                  className="hover:scale-105 transition-transform"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu kết quả
                </Button>
              )}
              {onExportPDF && (
                <Button 
                  size="sm"
                  onClick={onExportPDF}
                  className="hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất PDF
                </Button>
              )}
            </div>
          )}
        </div>
      </AnimatedCard>

      {/* Important Notes */}
      <Alert className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
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
});

ZakatResult.displayName = 'ZakatResult';

export default ZakatResult;
