import React from 'react';
import { usePWAContext } from '@/hooks/PWAContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const PWAStatus: React.FC = () => {
  const { needRefresh, offlineAlertVisible, isOnline, updateApp } = usePWAContext();

  if (needRefresh) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-blue-50 border-blue-200 dark:bg-blue-950/80 dark:border-blue-800 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mt-0.5">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-base font-semibold text-blue-900 dark:text-blue-100">
              Có bản cập nhật mới
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-300 mt-1">
              Cập nhật để sử dụng tính năng mới nhất.
            </AlertDescription>
          </div>
          <Button 
            onClick={updateApp} 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Cập nhật
          </Button>
        </div>
      </Alert>
    );
  }

  if (offlineAlertVisible) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-800 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full mt-0.5">
            <Wifi className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
              Sẵn sàng hoạt động offline
            </AlertTitle>
            <AlertDescription className="text-emerald-800 dark:text-emerald-300 mt-1">
              Bạn có thể sử dụng ngay cả khi không có mạng.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  if (!isOnline) {
    return (
      <Alert className="fixed top-4 left-4 right-4 z-50 bg-amber-50 border-amber-200 dark:bg-amber-950/80 dark:border-amber-800 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full mt-0.5">
            <WifiOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-base font-semibold text-amber-900 dark:text-amber-100">
              Bạn đang offline
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-300 mt-1">
              Một số tính năng có thể không khả dụng.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
};