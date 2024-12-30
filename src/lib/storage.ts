import type { DayEvents } from '../types/calendar';

const STORAGE_KEY = 'calendar-events';

export function loadEvents(): DayEvents {
  try {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    return savedEvents ? JSON.parse(savedEvents) : {};
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return {};
  }
}

export function saveEvents(events: DayEvents): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to localStorage:', error);
  }
}
