import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GiaVangBac } from '../types';
import AnimatedCard from './AnimatedCard';
import LoadingSpinner from './LoadingSpinner';

interface GoldSilverPricesProps {
  prices: GiaVangBac;
  isLoading: boolean;
  lastUpdated: string | null;
  error: string | null;
  onUpdate: () => void;
}

const GoldSilverPrices = React.memo<GoldSilverPricesProps>(({
  prices,
  isLoading,
  lastUpdated,
  error,
  onUpdate
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatShortPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString('vi-VN');
  };

  return (
    <AnimatedCard 
      title="Giá kim loại hiện tại" 
      icon={RefreshCw}
      description={error || (lastUpdated ? `Cập nhật lần cuối: ${lastUpdated}` : 'Chưa cập nhật')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Vàng</span>
            </div>
            <div className="font-bold text-lg text-yellow-800 dark:text-yellow-200">
              {formatShortPrice(prices.giaVangMoiGram)}/g
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              {formatPrice(prices.giaVangMoiGram)} VND
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bạc</span>
            </div>
            <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
              {formatShortPrice(prices.giaBacMoiGram)}/g
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatPrice(prices.giaBacMoiGram)} VND
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={onUpdate} 
          disabled={isLoading}
          className="w-full hover:scale-[1.02] transition-transform duration-200"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" text="Đang cập nhật..." />
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Cập nhật giá
            </>
          )}
        </Button>

        {error && (
          <Badge variant="destructive" className="w-full justify-center animate-in slide-in-from-top-1">
            {error}
          </Badge>
        )}
      </div>
    </AnimatedCard>
  );
});

GoldSilverPrices.displayName = 'GoldSilverPrices';

export default GoldSilverPrices;
