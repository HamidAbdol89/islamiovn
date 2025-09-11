import React from 'react';
import { usePWAContext } from '@/hooks/PWAContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const PWAStatus: React.FC = () => {
  const { needRefresh, offlineAlertVisible, isOnline, updateApp } = usePWAContext();

  if (needRefresh) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-blue-50 border-blue-200">
        <Download className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Có phiên bản mới! Cập nhật để sử dụng tính năng mới nhất.</span>
          <Button onClick={updateApp} size="sm" className="ml-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Cập nhật
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (offlineAlertVisible) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-green-50 border-green-200">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          App sẵn sàng hoạt động offline! Bạn có thể sử dụng ngay cả khi không có mạng.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isOnline) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-yellow-50 border-yellow-200">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          Bạn đang offline. Một số tính năng có thể không khả dụng.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
