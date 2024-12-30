import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';
import type { Event, RecurrencePattern } from '../types/calendar';

export function generateRecurringEvents(
  event: Event,
  pattern: RecurrencePattern,
  startDate: Date,
  endDate: Date
): Event[] {
  const events: Event[] = [];
  const seriesId = crypto.randomUUID();
  let currentDate = new Date(startDate);

  while (isBefore(currentDate, endDate)) {
    if (shouldCreateEventOnDate(currentDate, pattern)) {
      events.push({
        ...event,
        id: crypto.randomUUID(),
        date: currentDate.toISOString().split('T')[0],
        seriesId,
      });
    }

    currentDate = getNextDate(currentDate, pattern);
  }

  return events;
}

function shouldCreateEventOnDate(date: Date, pattern: RecurrencePattern): boolean {
  switch (pattern.frequency) {
    case 'daily':
      return true;
    case 'weekly':
      return pattern.daysOfWeek?.includes(date.getDay()) ?? false;
    case 'monthly':
      return date.getDate() === pattern.dayOfMonth;
    case 'yearly':
      return date.getMonth() === pattern.monthOfYear && date.getDate() === pattern.dayOfMonth;
    default:
      return false;
  }
}

function getNextDate(date: Date, pattern: RecurrencePattern): Date {
  switch (pattern.frequency) {
    case 'daily':
      return addDays(date, pattern.interval);
    case 'weekly':
      return addWeeks(date, pattern.interval);
    case 'monthly':
      return addMonths(date, pattern.interval);
    case 'yearly':
      return addYears(date, pattern.interval);
    default:
      return date;
  }
}
