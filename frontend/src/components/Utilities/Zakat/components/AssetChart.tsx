import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { GiaTriTaiSan, KhoiLuongKimLoai, GiaVangBac } from '../types';
import { CHART_COLORS } from '../constants';
import AnimatedCard from './AnimatedCard';
import { TrendingUp } from 'lucide-react';

interface AssetChartProps {
  taiSan: GiaTriTaiSan;
  khoiLuongKimLoai: KhoiLuongKimLoai;
  giaKimLoai: GiaVangBac;
}

const AssetChart = React.memo<AssetChartProps>(({ 
  taiSan, 
  khoiLuongKimLoai, 
  giaKimLoai 
}) => {
  const chartData = useMemo(() => {
    const giaTriVang = khoiLuongKimLoai.vangGram * giaKimLoai.giaVangMoiGram;
    const giaTriBac = khoiLuongKimLoai.bacGram * giaKimLoai.giaBacMoiGram;
    
    const data = [
      { name: 'Tiền mặt', value: taiSan.tienMat, color: CHART_COLORS[0] },
      { name: 'Tiết kiệm', value: taiSan.tietKiem, color: CHART_COLORS[1] },
      { name: 'Vàng', value: taiSan.vang + giaTriVang, color: CHART_COLORS[2] },
      { name: 'Bạc', value: taiSan.bac + giaTriBac, color: CHART_COLORS[3] },
      { name: 'Đầu tư', value: taiSan.dauTu, color: CHART_COLORS[4] },
      { name: 'Kinh doanh', value: taiSan.kinhDoanh, color: CHART_COLORS[5] }
    ].filter(item => item.value > 0);

    return data;
  }, [taiSan, khoiLuongKimLoai, giaKimLoai]);

  const totalAssets = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.value, 0), 
    [chartData]
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString('vi-VN');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalAssets) * 100).toFixed(1);
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(data.value)} VND ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <AnimatedCard 
        title="Biểu đồ tài sản" 
        icon={TrendingUp}
        className="h-64 flex items-center justify-center"
      >
        <p className="text-muted-foreground text-center">
          Nhập thông tin tài sản để xem biểu đồ
        </p>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard title="Biểu đồ tài sản" icon={TrendingUp}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">Tổng tài sản</p>
        <p className="text-lg font-semibold text-primary">
          {formatCurrency(totalAssets)} VND
        </p>
      </div>
    </AnimatedCard>
  );
});

AssetChart.displayName = 'AssetChart';

export default AssetChart;
