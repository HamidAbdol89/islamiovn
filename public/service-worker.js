// public/service-worker.js
import { precacheAndRoute } from 'workbox-precaching';

const APP_PREFIX = 'muslim-viet';

// ⚡ Workbox sẽ inject các file assets vào đây
precacheAndRoute(self.__WB_MANIFEST || []);

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log(`${APP_PREFIX}: Service Worker installed`);
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log(`${APP_PREFIX}: Service Worker activated`);
  event.waitUntil(self.clients.claim());
});

// Message event handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    handleScheduleNotification(event);
  } else if (event.data && event.data.type === 'CLEAR_SCHEDULED_NOTIFICATIONS') {
    handleClearScheduledNotifications();
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/utilities/prayers')
    );
  }

  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].postMessage({
          type: 'NOTIFICATION_CLICK',
          action: event.action,
          notificationData: event.notification.data
        });
      }
    })
  );
});

// Handle scheduled notifications
const scheduledNotifications = new Map();

function handleScheduleNotification(event) {
  const { notification } = event.data;
  const { id, time, ...notificationOptions } = notification;

  const currentTime = Date.now();
  const timeout = time - currentTime;

  if (timeout > 0) {
    const timeoutId = setTimeout(() => {
      self.registration.showNotification(
        notificationOptions.title,
        notificationOptions
      );
      scheduledNotifications.delete(id);
    }, timeout);

    scheduledNotifications.set(id, timeoutId);

    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        type: 'SCHEDULED',
        id: id
      });
    }
  }
}

function handleClearScheduledNotifications() {
  scheduledNotifications.forEach((timeoutId, id) => {
    clearTimeout(timeoutId);
    scheduledNotifications.delete(id);
  });
  console.log(`${APP_PREFIX}: Cleared all scheduled notifications`);
}
