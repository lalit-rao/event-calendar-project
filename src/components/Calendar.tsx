import { useState } from 'react';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { MONTHS, WEEKDAYS, getMonthDays, isToday, isSameMonth, formatDate } from '../lib/calendar-utils';
import { useCalendar } from '../hooks/useCalendar';
import { ThemeToggle } from './ThemeToggle';
import EventModal from './EventModal';
// import EventList from "./EventList.tsx";


export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendar = useCalendar();
  const { state, setState, selectDate } = calendar;

  const days = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    selectDate(date);
  };

  const handleAddEvent = () => {
    setState(prev => ({
      ...prev,
      selectedEvent: null,
      isEventModalOpen: true,
    }));
  };


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-purple-400 dark:to-purple-600">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex rounded-lg bg-muted p-1">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {state.viewMode === 'month' && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="text-center py-2 text-sm font-semibold text-muted-foreground hidden md:block"
              >
                {day}
              </div>
            ))}
            {/* Mobile weekday labels */}
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="text-center py-2 text-sm font-semibold text-muted-foreground md:hidden"
              >
                {day.charAt(0)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map((date, index) => {
              const dateStr = formatDate(date);
              const events = calendar.getFilteredEvents(dateStr);
              const isSelected = formatDate(state.selectedDate) === dateStr;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] md:min-h-[120px] p-1 md:p-2 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50 cursor-pointer",
                    "border border-border/50 backdrop-blur-sm",
                    isToday(date) && "bg-primary/5 border-primary/20 dark:bg-primary/10",
                    !isSameMonth(date, currentMonth) && "opacity-40",
                    isSelected && "ring-2 ring-primary dark:ring-primary/60 scale-[1.02]",
                    isWeekend && "bg-muted/30",
                  )}
                  onClick={() => handleDayClick(date)}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    isToday(date) && "text-primary font-bold"
                  )}>
                    {date.getDate()}
                  </div>
                  {events.length > 0 && (
                    <div className="space-y-1">
                      {events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs p-1 rounded-md truncate transition-colors",
                            "hover:opacity-90",
                            event.color === 'work' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
                            event.color === 'personal' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
                            event.color === 'other' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
                            (!event.color || event.color === 'default') && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          )}
                        >
                          {event.title}
                          {event.recurrence && '🔄'}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleAddEvent}
          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
        >
          Add Event
        </Button>
      </div>

      <EventModal calendar={calendar} />
      {/*<EventList  calendar={calendar}/>*/}
    </div>
  );
}
