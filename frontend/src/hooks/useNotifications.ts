import { useState, useEffect } from 'react';

export interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
}

export const useNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    supported: 'Notification' in window && 'serviceWorker' in navigator
  });

  useEffect(() => {
    if (state.supported) {
      setState(prev => ({
        ...prev,
        permission: Notification.permission
      }));
    }
  }, [state.supported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!state.supported) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    setState(prev => ({ ...prev, permission }));
    return permission;
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (!state.supported) return;

    if (state.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-64x64.png',
          ...options
        });
      } else {
        new Notification(title, {
          icon: '/pwa-192x192.png',
          ...options
        });
      }
    }
  };

  return {
    ...state,
    requestPermission,
    showNotification
  };
};