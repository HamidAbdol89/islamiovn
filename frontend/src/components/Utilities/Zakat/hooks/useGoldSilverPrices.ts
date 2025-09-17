import { useState, useCallback, useEffect } from 'react';
import type { GiaVangBac } from '../types';
import { GIA_KIM_LOAI_MAC_DINH, STORAGE_KEYS } from '../constants';

interface PriceUpdateStatus {
  isLoading: boolean;
  lastUpdated: string | null;
  error: string | null;
}

export const useGoldSilverPrices = () => {
  const [prices, setPrices] = useState<GiaVangBac>(GIA_KIM_LOAI_MAC_DINH);
  const [status, setStatus] = useState<PriceUpdateStatus>({
    isLoading: false,
    lastUpdated: null,
    error: null
  });

  // Load cached prices on mount
  useEffect(() => {
    const loadCachedPrices = () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEYS.GOLD_SILVER_PRICES);
        if (cached) {
          const { prices: cachedPrices, timestamp } = JSON.parse(cached);
          const oneHourAgo = Date.now() - (60 * 60 * 1000);
          
          if (timestamp > oneHourAgo) {
            setPrices(cachedPrices);
            setStatus(prev => ({
              ...prev,
              lastUpdated: new Date(timestamp).toLocaleString('vi-VN')
            }));
          }
        }
      } catch (err) {
        console.error('Error loading cached prices:', err);
      }
    };

    loadCachedPrices();
  }, []);

  // Update prices (simulate API call)
  const updatePrices = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Simulate price fluctuation (±3% from base price)
      const fluctuation = 0.03;
      const newPrices: GiaVangBac = {
        giaVangMoiGram: Math.round(
          GIA_KIM_LOAI_MAC_DINH.giaVangMoiGram * 
          (1 + (Math.random() - 0.5) * 2 * fluctuation)
        ),
        giaBacMoiGram: Math.round(
          GIA_KIM_LOAI_MAC_DINH.giaBacMoiGram * 
          (1 + (Math.random() - 0.5) * 2 * fluctuation)
        )
      };

      setPrices(newPrices);
      
      const timestamp = Date.now();
      const cacheData = {
        prices: newPrices,
        timestamp
      };
      
      localStorage.setItem(STORAGE_KEYS.GOLD_SILVER_PRICES, JSON.stringify(cacheData));
      
      setStatus({
        isLoading: false,
        lastUpdated: new Date(timestamp).toLocaleString('vi-VN'),
        error: null
      });
      
    } catch (error) {
      console.error('Error updating prices:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Không thể cập nhật giá. Sử dụng giá mặc định.'
      }));
    }
  }, []);

  // Auto-update prices every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updatePrices]);

  return {
    prices,
    status,
    updatePrices,
    setPrices
  };
};
