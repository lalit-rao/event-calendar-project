export type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
};

export type Reminder = {
  id: string;
  eventId: string;
  minutes: number;
  notified: boolean;
};

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color?: 'default' | 'work' | 'personal' | 'other';
  timezone?: string;
  recurrence?: RecurrencePattern;
  reminders?: Reminder[];
  seriesId?: string; // For recurring events
}


export type ViewMode = 'month' | 'week' | 'day';

export interface DayEvents {
  [date: string]: Event[];
}

export interface CalendarState {
  // events: Event[];
  selectedDate: Date;
  events: DayEvents;
  selectedEvent: Event | null;
  isEventModalOpen: boolean;
  isEventListOpen: boolean;
  filterKeyword: string;
  viewMode: ViewMode;
}
