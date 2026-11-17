/* ZenChat notification service worker.
 * Provides persistent notifications and click routing for an installed/hosted app.
 * A server-side Web Push sender is still required for notifications while the app is closed.
 */
'use strict';

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  var payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    try { payload = { body: event.data ? event.data.text() : '' }; } catch (_) { payload = {}; }
  }
  var data = {
    conversationId: payload.conversationId || '',
    messageId: payload.messageId || ''
  };
  var options = {
    body: payload.body || 'You have a new message',
    icon: './zenchat-icon-192.png',
    badge: './zenchat-icon-192.png',
    tag: payload.tag || ('zenchat-' + (data.conversationId || 'general')),
    renotify: false,
    data: data
  };
  event.waitUntil(self.registration.showNotification(payload.title || 'ZenChat', options));
});

self.addEventListener('notificationclick', function (event) {
  var data = event.notification && event.notification.data ? event.notification.data : {};
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
    for (var i = 0; i < clients.length; i++) {
      var client = clients[i];
      if ('focus' in client) {
        return client.focus().then(function (focused) {
          if (focused && focused.postMessage) {
            focused.postMessage({
              type: 'ZENCHAT_NOTIFICATION_CLICK',
              conversationId: data.conversationId || '',
              messageId: data.messageId || ''
            });
          }
          return focused;
        });
      }
    }
    return self.clients.openWindow(self.registration.scope);
  }));
});
