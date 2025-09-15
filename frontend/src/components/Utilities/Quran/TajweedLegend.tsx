// TajweedLegend.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import './globals.css';

interface TajweedLegendProps {
  className?: string;
}

const TAJWEED_RULES = [
  { type: 'ghunnah', name: 'Ghunnah', description: 'Âm mũi (2 harakat)', color: '#DC2626' }, // đỏ
  { type: 'ikhfa', name: 'Ikhfāʼ', description: 'Đọc ẩn (nửa rõ nửa giấu)', color: '#22C55E' }, // xanh lá
  { type: 'idgham', name: 'Idghām', description: 'Hòa âm (nhập âm)', color: '#3B82F6' }, // xanh dương
  { type: 'iqlab', name: 'Iqlāb', description: 'Chuyển âm N thành M (trước B)', color: '#2563EB' }, // xanh lam đậm
  { type: 'qalqalah', name: 'Qalqalah', description: 'Âm bật/tách (rung nhẹ)', color: '#EF4444' }, // đỏ tươi
  { type: 'madd', name: 'Madd', description: 'Kéo dài 2–6 harakat (tùy loại)', color: '#EC4899' }, // hồng
  { type: 'lam_shamsiyyah', name: 'Lam Shamsiyyah', description: 'Lâm Mặt Trời (âm Lâm đồng hóa)', color: '#F59E0B' }, // cam
  { type: 'hamzat_wasl', name: 'Hamzat Wasl', description: 'Âm nối (không đọc khi đứng đầu câu)', color: '#10B981' } // xanh lá nhạt
] as const;


const TajweedLegend: React.FC<TajweedLegendProps> = React.memo(({ className = '' }) => {
  return (
    <Card className={`bg-card border-border shadow-luxury dark:shadow-luxury-dark ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg text-gradient">Hướng dẫn Tajweed</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="tajweed-legend">
          {TAJWEED_RULES.map((rule) => (
            <div key={rule.type} className="tajweed-legend-item">
              <div 
                className="tajweed-legend-color"
                style={{ backgroundColor: rule.color }}
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{rule.name}</div>
                <div className="text-sm text-muted-foreground">{rule.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Mẹo:</strong> Di chuột qua các từ được tô màu để xem chi tiết quy tắc Tajweed
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

TajweedLegend.displayName = 'TajweedLegend';

export default TajweedLegend;
