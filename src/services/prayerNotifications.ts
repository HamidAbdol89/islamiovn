import { addMinutes, format, isAfter, isBefore, parseISO } from 'date-fns';

export interface PrayerTime {
  name: string;
  time: string;
  nameVi: string;
}

export class PrayerNotificationService {
  private static instance: PrayerNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): PrayerNotificationService {
    if (!PrayerNotificationService.instance) {
      PrayerNotificationService.instance = new PrayerNotificationService();
    }
    return PrayerNotificationService.instance;
  }

  async initialize() {
    if ('serviceWorker' in navigator) {
      this.registration = await navigator.serviceWorker.ready;
    }
  }

  async schedulePrayerNotifications(prayerTimes: PrayerTime[]) {
    if (!this.registration) return;

    // Clear existing notifications
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

    const notificationData = {
      title: `Sắp đến giờ ${prayer.nameVi}`,
      body: `${prayer.nameVi} sẽ bắt đầu lúc ${prayer.time}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      tag: `prayer-${prayer.name}-${format(date, 'yyyy-MM-dd')}`,
      data: {
        prayer: prayer.name,
        time: prayer.time,
        type: 'prayer-reminder'
      },
      showTrigger: new Date(notificationTime.getTime())
    };

    try {
      // Use Notification API with delay
      setTimeout(() => {
        this.registration?.showNotification(notificationData.title, {
          body: notificationData.body,
          icon: notificationData.icon,
          badge: notificationData.badge,
          tag: notificationData.tag,
          data: notificationData.data,
          requireInteraction: true,
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
        });
      }, notificationTime.getTime() - Date.now());
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async clearScheduledNotifications() {
    if (!this.registration) return;

    const notifications = await this.registration.getNotifications();
    notifications.forEach(notification => {
      if (notification.data?.type === 'prayer-reminder') {
        notification.close();
      }
    });
  }
}

export const prayerNotificationService = PrayerNotificationService.getInstance();