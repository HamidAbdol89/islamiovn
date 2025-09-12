/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
declare const __WB_MANIFEST: Array<any>;

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

const APP_PREFIX = 'muslim-viet';

// ⚡ Precache
precacheAndRoute(self.__WB_MANIFEST || []);

// Install & Activate
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Runtime caching examples
// 1. API cache
registerRoute(
  /^https:\/\/api\.aladhan\.com\/.*/i,
  new NetworkFirst({
    cacheName: 'prayer-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
);

// 2. Google Fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// 3. Images
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// Scheduled notifications
const scheduledNotifications = new Map<number, number>();

// Message handler
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (!event.data) return;

  const { type, notification } = event.data;

  if (type === 'SCHEDULE_NOTIFICATION' && notification) {
    const { id, time, ...options } = notification;
    const timeout = time - Date.now();

    if (timeout > 0) {
      const timeoutId: number = self.setTimeout(() => {
        self.registration.showNotification(options.title, options);
        scheduledNotifications.delete(id);
      }, timeout);

      scheduledNotifications.set(id, timeoutId);

      event.ports?.[0]?.postMessage({ type: 'SCHEDULED', id });
    }
  } else if (type === 'CLEAR_SCHEDULED_NOTIFICATIONS') {
    scheduledNotifications.forEach((timeoutId) => self.clearTimeout(timeoutId));
    scheduledNotifications.clear();
    console.log(`${APP_PREFIX}: Cleared all scheduled notifications`);
  }
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      clientList.forEach((client) =>
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          action: event.action,
          notificationData: event.notification.data,
        })
      );
    })
  );
});
