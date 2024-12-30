export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission === 'denied') {
    return Promise.resolve(false);
  }

  return Notification.requestPermission().then(permission => permission === 'granted');
}

export function scheduleNotification(
  title: string,
  description: string,
  scheduledTime: Date
): void {
  const now = new Date();
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  if (timeUntilNotification <= 0) return;

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: description,
        icon: '/calendar-icon.png',
      });
    }
  }, timeUntilNotification);
}