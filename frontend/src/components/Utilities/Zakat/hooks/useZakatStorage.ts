import { useState, useCallback } from 'react';
import type { GiaTriTaiSan, KhoiLuongKimLoai, GiaVangBac, ZakatHistory, ZakatFormData } from '../types';
import { STORAGE_KEYS } from '../constants';

export const useZakatStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save current calculation data
  const saveZakatData = useCallback((data: ZakatFormData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ZAKAT_DATA, JSON.stringify(data));
      setError(null);
    } catch (err) {
      setError('Không thể lưu dữ liệu');
      console.error('Error saving zakat data:', err);
    }
  }, []);

  // Load saved calculation data
  const loadZakatData = useCallback((): ZakatFormData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZAKAT_DATA);
      if (saved) {
        const data = JSON.parse(saved);
        setError(null);
        return data;
      }
    } catch (err) {
      setError('Không thể tải dữ liệu đã lưu');
      console.error('Error loading zakat data:', err);
    }
    return null;
  }, []);

  // Save calculation to history
  const saveToHistory = useCallback((
    taiSan: GiaTriTaiSan,
    kimLoai: KhoiLuongKimLoai,
    giaKimLoai: GiaVangBac,
    ketQua: any
  ) => {
    try {
      const historyItem: ZakatHistory = {
        id: Date.now().toString(),
        ngayTinh: new Date().toISOString(),
        taiSan,
        kimLoai,
        giaKimLoai,
        ketQua
      };

      const existingHistory = getHistory();
      const newHistory = [historyItem, ...existingHistory.slice(0, 9)]; // Keep last 10 calculations
      
      localStorage.setItem(STORAGE_KEYS.ZAKAT_HISTORY, JSON.stringify(newHistory));
      setError(null);
    } catch (err) {
      setError('Không thể lưu lịch sử tính toán');
      console.error('Error saving to history:', err);
    }
  }, []);

  // Get calculation history
  const getHistory = useCallback((): ZakatHistory[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZAKAT_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
    return [];
  }, []);

  // Clear all saved data
  const clearAllData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ZAKAT_DATA);
      localStorage.removeItem(STORAGE_KEYS.ZAKAT_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.GOLD_SILVER_PRICES);
      setError(null);
    } catch (err) {
      setError('Không thể xóa dữ liệu');
      console.error('Error clearing data:', err);
    }
  }, []);

  // Export data as JSON
  const exportData = useCallback(() => {
    try {
      const currentData = loadZakatData();
      const history = getHistory();
      
      const exportObject = {
        currentData,
        history,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportObject, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zakat-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setError(null);
    } catch (err) {
      setError('Không thể xuất dữ liệu');
      console.error('Error exporting data:', err);
    }
  }, [loadZakatData, getHistory]);

  // Import data from JSON file
  const importData = useCallback((file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.currentData) {
          saveZakatData(importedData.currentData);
        }
        
        if (importedData.history && Array.isArray(importedData.history)) {
          localStorage.setItem(STORAGE_KEYS.ZAKAT_HISTORY, JSON.stringify(importedData.history));
        }
        
        setError(null);
      } catch (err) {
        setError('File không hợp lệ hoặc bị lỗi');
        console.error('Error importing data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Không thể đọc file');
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  }, [saveZakatData]);

  return {
    saveZakatData,
    loadZakatData,
    saveToHistory,
    getHistory,
    clearAllData,
    exportData,
    importData,
    isLoading,
    error,
    setError
  };
};
