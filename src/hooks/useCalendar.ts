import { useState, useEffect } from 'react';
import { Event, DayEvents, CalendarState } from '../types/calendar';
import { useLocalStorage } from './useLocalStorage.ts';

export function useCalendar() {
  const [events, setEvents] = useLocalStorage<DayEvents>('calendar-events', {});
  const [state, setState] = useState<Omit<CalendarState, 'events'>>({
    selectedDate: new Date(),
    selectedEvent: null,
    isEventModalOpen: false,
    isEventListOpen: false,
    filterKeyword: '',
    viewMode: 'month',
  });

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };

    setEvents(prev => ({
      ...prev,
      [event.date]: [...(prev[event.date] || []), newEvent],
    }));

    setState(prev => ({
      ...prev,
      isEventModalOpen: false,
    }));
  };

  const updateEvent = (event: Event) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      const dateEvents = newEvents[event.date] || [];
      const eventIndex = dateEvents.findIndex(e => e.id === event.id);

      if (eventIndex !== -1) {
        dateEvents[eventIndex] = event;
        newEvents[event.date] = dateEvents;
      }

      return newEvents;
    });

    setState(prev => ({
      ...prev,
      isEventModalOpen: false,
      selectedEvent: null,
    }));
  };

  const deleteEvent = (event: Event) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      newEvents[event.date] = newEvents[event.date].filter(e => e.id !== event.id);

      if (newEvents[event.date].length === 0) {
        delete newEvents[event.date];
      }

      return newEvents;
    });

    setState(prev => ({
      ...prev,
      isEventModalOpen: false,
      selectedEvent: null,
    }));
  };

  const selectDate = (date: Date) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      isEventListOpen: true,
    }));
  };

  const getFilteredEvents = (date: string) => {
    const dateEvents = events[date] || [];
    if (!state.filterKeyword) return dateEvents;

    const keyword = state.filterKeyword.toLowerCase();
    return dateEvents.filter(event =>
      event.title.toLowerCase().includes(keyword) ||
      event.description?.toLowerCase().includes(keyword)
    );
  };

  return {
    state: { ...state, events },
    setState: (updater: (prev: CalendarState) => CalendarState) => {
      const newState = updater({ ...state, events });
      const { events: newEvents, ...rest } = newState;
      setEvents(newEvents);
      setState(rest);
    },
    addEvent,
    updateEvent,
    deleteEvent,
    selectDate,
    getFilteredEvents,
  };
}
