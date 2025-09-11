import { addMinutes, format, isAfter } from 'date-fns';

export interface PrayerTime {
  name: string;
  time: string;
  nameVi: string;
}

// Custom interface to extend NotificationOptions with 'actions' (workaround for TS lib issue)
interface ExtendedNotificationOptions extends NotificationOptions {
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  // Add icon if needed: icon?: string;
}

export class PrayerNotificationService {
  private static instance: PrayerNotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private scheduledTimeouts: Map<string, number> = new Map();

  static getInstance(): PrayerNotificationService {
    if (!PrayerNotificationService.instance) {
      PrayerNotificationService.instance = new PrayerNotificationService();
    }
    return PrayerNotificationService.instance;
  }

  async initialize() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        
        // Đăng ký message event listener để xử lý action clicks
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);
        }
      } catch (error) {
        console.error('Failed to initialize service worker:', error);
      }
    }
  }

  private handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
      const { action } = event.data;  // Removed unused notificationData
      
      if (action === 'view') {
        // Mở trang lịch cầu nguyện khi người dùng click "Xem lịch cầu nguyện"
        window.focus();
        window.location.href = '/utilities/prayers';
      }
      // Với action 'dismiss', không cần làm gì thêm
    }
  };

  async schedulePrayerNotifications(prayerTimes: PrayerTime[]) {
    if (!this.registration) {
      console.warn('Service worker not ready, skipping notification scheduling');
      return;
    }

    // Clear existing notifications và timeouts
    await this.clearScheduledNotifications();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (const prayer of prayerTimes) {
      // Schedule for today
      await this.scheduleNotification(prayer, today);
      
      // Schedule for tomorrow
      await this.scheduleNotification(prayer, tomorrow);
    }
  }

  private async scheduleNotification(prayer: PrayerTime, date: Date) {
    if (!this.registration) return;

    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDateTime = new Date(date);
    prayerDateTime.setHours(hours, minutes, 0, 0);

    // Don't schedule past times
    if (isAfter(new Date(), prayerDateTime)) return;

    // Schedule notification 5 minutes before
    const notificationTime = addMinutes(prayerDateTime, -5);
    const timeUntilNotification = notificationTime.getTime() - Date.now();

    // Nếu thời gian thông báo đã qua, bỏ qua
    if (timeUntilNotification <= 0) return;

    const notificationId = `prayer-${prayer.name}-${format(date, 'yyyy-MM-dd')}`;

    try {
      // Sử dụng service worker để lên lịch thông báo background
      // Gửi message đến service worker để lên lịch thông báo
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          notification: {
            id: notificationId,
            time: notificationTime.getTime(),
            title: `Sắp đến giờ ${prayer.nameVi}`,
            body: `${prayer.nameVi} sẽ bắt đầu lúc ${prayer.time}`,
            icon: '/pwa-192x192.png',
            badge: '/pwa-64x64.png',
            data: {
              prayer: prayer.name,
              time: prayer.time,
              type: 'prayer-reminder',
              id: notificationId
            },
            actions: [
              {
                action: 'view',
                title: 'Xem lịch cầu nguyện'
              },
              {
                action: 'dismiss',
                title: 'Đóng'
              }
            ]
          }
        });
      }

      // Fallback: vẫn sử dụng setTimeout nhưng chỉ khi tab đang active
      const timeoutId = setTimeout(() => {
        this.showNotificationNow(prayer, date);
        this.scheduledTimeouts.delete(notificationId);
      }, timeUntilNotification) as unknown as number;

      this.scheduledTimeouts.set(notificationId, timeoutId);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  private async showNotificationNow(prayer: PrayerTime, date: Date) {
    if (!this.registration || Notification.permission !== 'granted') return;

    const notificationId = `prayer-${prayer.name}-${format(date, 'yyyy-MM-dd')}`;
    const options: ExtendedNotificationOptions = {
      body: `${prayer.nameVi} sẽ bắt đầu lúc ${prayer.time}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      tag: notificationId,
      data: {
        prayer: prayer.name,
        time: prayer.time,
        type: 'prayer-reminder',
        id: notificationId
      },
      actions: [
        {
          action: 'view',
          title: 'Xem lịch cầu nguyện'
        },
        {
          action: 'dismiss',
          title: 'Đóng'
        }
      ],
      requireInteraction: true
    };

    try {
      await this.registration.showNotification(
        `Sắp đến giờ ${prayer.nameVi}`,
        options
      );
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async clearScheduledNotifications() {
    // Clear all timeouts
    this.scheduledTimeouts.forEach((timeoutId, id) => {
      clearTimeout(timeoutId);
      this.scheduledTimeouts.delete(id);
    });

    // Clear notifications từ service worker
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => {
        if (notification.data?.type === 'prayer-reminder') {
          notification.close();
        }
      });

      // Gửi message đến service worker để clear scheduled notifications
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_SCHEDULED_NOTIFICATIONS'
        });
      }
    }
  }

  // Hàm hủy đăng ký khi không cần thiết
  destroy() {
    navigator.serviceWorker.removeEventListener('message', this.handleServiceWorkerMessage);
    this.clearScheduledNotifications();
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();