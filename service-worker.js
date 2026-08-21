// PhySoc IIT Kharagpur - PWA Service Worker & Push Notification Handler
const CACHE_NAME = 'physoc-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/events/index.html',
  '/resources/index.html',
  '/about/index.html',
  '/manifest.webmanifest',
  '/images/logo2_hu_20f6f98a0862d010.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Push Notification Event Listener
self.addEventListener('push', (event) => {
  let data = { title: 'PhySoc IIT Kharagpur', body: 'New physics event updated! Check calendar for details.', icon: '/images/logo2_hu_20f6f98a0862d010.png', url: '/events/index.html' };
  
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/logo2_hu_20f6f98a0862d010.png',
    badge: '/images/logo2_hu_20f6f98a0862d010.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/events/index.html'
    },
    actions: [
      { action: 'open_events', title: '📅 View Events' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/events/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
