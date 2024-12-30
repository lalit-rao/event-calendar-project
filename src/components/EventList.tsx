import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet.tsx';
import { Input } from './ui/input.tsx';
import { Button } from './ui/button.tsx';
import { ScrollArea } from './ui/scroll-area.tsx';
import { formatDate, exportEventsToJson } from '../lib/calendar-utils';
import { Download, Search } from 'lucide-react';

type Event = {
  id: string | number;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  [key: string]: any;
};

type CalendarState = {
  selectedDate: Date;
  events: Event[];
  isEventListOpen: boolean;
  filterKeyword: string;
  [key: string]: any;
};

type Calendar = {
  state: CalendarState;
  setState: React.Dispatch<React.SetStateAction<CalendarState>>;
  getFilteredEvents: (dateStr: string) => Event[];
};

export default function EventList({ calendar }: { calendar: any }) {
  const { state, setState } = calendar;
  const { selectedDate, events, isEventListOpen, filterKeyword } = state;

  const dateStr = formatDate(selectedDate);
  const dateEvents = calendar.getFilteredEvents(dateStr);

  const handleEventClick = (event: Event) => {
    setState(prev => ({
      ...prev,
      selectedEvent: event,
      isEventModalOpen: true,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      filterKeyword: e.target.value,
    }));
  };

  return (
    <Sheet
      open={isEventListOpen}
      onOpenChange={(open) =>
        setState(prev => ({ ...prev, isEventListOpen: open }))
      }
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Events for {selectedDate ? selectedDate.toLocaleDateString() : "Unknown Date"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={filterKeyword}
              onChange={handleFilterChange}
              className="pl-8"
            />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => exportEventsToJson(events)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Events
          </Button>

          <ScrollArea className="h-[500px] pr-4">
            {dateEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No events for this day
              </p>
            ) : (
              <div className="space-y-2">
                {dateEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.description && (
                      <div className="text-sm mt-1">{event.description}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
