// TajweedLegend.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import './globals.css';

interface TajweedLegendProps {
  className?: string;
}

const TAJWEED_RULES = [
  {
    type: 'hamzat_wasl',
    name: 'Hamzat Wasl',
    description: 'Hamzah nối',
    color: '#10B981'
  },
  {
    type: 'lam_shamsiyyah',
    name: 'Lam Shamsiyyah',
    description: 'Lam mặt trời',
    color: '#F59E0B'
  },
  {
    type: 'madd_2',
    name: 'Madd 2',
    description: 'Kéo dài 2 harakat',
    color: '#EC4899'
  },
  {
    type: 'madd_246',
    name: 'Madd 2-4-6',
    description: 'Kéo dài 2-4-6 harakat',
    color: '#F472B6'
  },
  {
    type: 'madd_6',
    name: 'Madd 6',
    description: 'Kéo dài 6 harakat',
    color: '#DB2777'
  }
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
