import { useState, useEffect } from 'react';
import { Event, Reminder } from '../types/calendar';
import { requestNotificationPermission, scheduleNotification } from '../lib/notifications';

export function useReminders() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestNotificationPermission().then(setHasPermission);
  }, []);

  const scheduleEventReminder = (event: Event, minutes: number) => {
    if (!hasPermission) return;

    const eventDate = new Date(event.date + 'T' + event.startTime);
    const reminderTime = new Date(eventDate.getTime() - minutes * 60000);

    scheduleNotification(
      event.title,
      `Starting in ${minutes} minutes`,
      reminderTime
    );
  };

  const addReminder = (event: Event, minutes: number): Reminder => {
    const reminder = {
      id: crypto.randomUUID(),
      eventId: event.id,
      minutes,
      notified: false,
    };

    scheduleEventReminder(event, minutes);
    return reminder;
  };

  return {
    hasPermission,
    addReminder,
  };
}
