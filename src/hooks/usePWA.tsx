/// <reference types="vite-plugin-pwa/client" />

import  { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from '@/hooks/use-toast';

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Thêm updateApp trước để dùng trong toast action
  const updateApp = () => {
    updateServiceWorker(true);
  };

  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: any) {
      console.log('SW registration error:', error);
    },
    onNeedRefresh() {
      toast({
        title: 'Có phiên bản mới!',
        description: 'Nhấn cập nhật để sử dụng tính năng mới nhất.',
        action: (
          <button
            onClick={() => updateApp()}
            className="ml-2 px-2 py-1 bg-white text-blue-500 rounded"
          >
            Cập nhật
          </button>
        ),
      });
    },
    onOfflineReady() {
      toast({
        title: 'App sẵn sàng offline!',
        description: 'Bạn có thể sử dụng ngay cả khi không có mạng.',
      });
    },
  });

  // Monitor online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Bạn đang offline',
        description: 'Một số tính năng có thể không khả dụng.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    needRefresh,
    offlineReady,
    isOnline,
    updateApp,
  };
};
