import {DayEvents, Event} from "../types/calendar.ts";

export const DAYS_IN_WEEK = 7;
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add previous month's days
  for (let i = firstDay.getDay(); i > 0; i--) {
    days.push(new Date(year, month, -i + 1));
  }

  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month's days
  const remainingDays = DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK);
  if (remainingDays < DAYS_IN_WEEK) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export function isSameMonth(date: Date, currentMonth: Date): boolean {
  return date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear();
}

export function hasEventOverlap(
  startTime: string,
  endTime: string,
  existingEvents: Event[],
  excludeEventId?: string
): boolean {
  const newStart = new Date(`1970-01-01T${startTime}`).getTime();
  const newEnd = new Date(`1970-01-01T${endTime}`).getTime();

  return existingEvents.some(event => {
    if (event.id === excludeEventId) return false;

    const eventStart = new Date(`1970-01-01T${event.startTime}`).getTime();
    const eventEnd = new Date(`1970-01-01T${event.endTime}`).getTime();

    return (newStart < eventEnd && newEnd > eventStart);
  });
}

export function exportEventsToJson(events: DayEvents): void {
  const dataStr = JSON.stringify(events, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

  const exportName = `calendar-events-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportName);
  linkElement.click();
}
