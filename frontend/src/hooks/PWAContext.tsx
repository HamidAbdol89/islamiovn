import React, { createContext, useContext } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface PWAContextValue {
  needRefresh: boolean;
  offlineReady: boolean;
  offlineAlertVisible: boolean;
  isOnline: boolean;
  updateApp: () => void;
}

const PWAContext = createContext<PWAContextValue | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offlineAlertVisible, setOfflineAlertVisible] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) { console.log('SW Registered:', r); },
    onRegisterError(e) { console.log('SW registration error:', e); },
    onOfflineReady() {
      setOfflineReady(true);
      setOfflineAlertVisible(true);
    },
  });

  // auto hide offline alert
  React.useEffect(() => {
    if (offlineAlertVisible) {
      const timer = setTimeout(() => setOfflineAlertVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [offlineAlertVisible]);

  // online/offline listener
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateApp = () => {
    updateServiceWorker(true);
  };

  return (
    <PWAContext.Provider value={{ needRefresh, offlineReady, offlineAlertVisible, isOnline, updateApp }}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWAContext = () => {
  const context = useContext(PWAContext);
  if (!context) throw new Error('usePWAContext must be used within PWAProvider');
  return context;
};