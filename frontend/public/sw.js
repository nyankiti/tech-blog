self.addEventListener('push', (event) => {
  console.log('push event received');
  console.log('push event', event);
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/favicon.png',
      // badge: "/favicon.png", // badgeをfaviconと同じものを指定すると、androidで黒いよくわからないものになってしまう。現在はデフォルトのものを利用する方針とする。
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('notificationclick event received');
  console.log('notificationclick event', event);
  event.notification.close();
  event.waitUntil(clients.openWindow('https://sokes-nook.net/'));
});
