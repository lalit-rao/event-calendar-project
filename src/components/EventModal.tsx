import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form.tsx';
import { Input } from './ui/input.tsx';
import { Textarea } from './ui/textarea.tsx';
import { Button } from './ui/button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { formatDate, hasEventOverlap } from '../lib/calendar-utils';
import { useReminders } from '../hooks/useReminders';
import RecurrenceForm from '../components/RecurrenceForm';
import type { Event } from '../types/calendar';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  color: z.enum(['default', 'work', 'personal', 'other']).default('default'),
  timezone: z.string().optional(),
  recurrence: z.any().optional(),
  reminders: z.array(z.number()).default([]),
});

export default function EventModal({ calendar }: { calendar: any }) {
  const { state, setState, addEvent, updateEvent, deleteEvent } = calendar;
  const { selectedDate, selectedEvent, isEventModalOpen } = state;
  const { hasPermission, addReminder } = useReminders();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      color: 'default',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reminders: [],
    },
  });

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        ...selectedEvent,
        reminders: selectedEvent.reminders?.map((r: { minutes: any; }) => r.minutes) || [],
      });
    } else {
      form.reset({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        color: 'default',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminders: [],
      });
    }
  }, [selectedEvent, form]);

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    const date = formatDate(selectedDate);
    const dateEvents = state.events[date] || [];

    if (hasEventOverlap(
      values.startTime,
      values.endTime,
      dateEvents,
      selectedEvent?.id
    )) {
      form.setError('startTime', {
        type: 'manual',
        message: 'This time slot overlaps with another event',
      });
      return;
    }

    const eventData = {
      ...values,
      date,
      reminders: values.reminders.map(minutes => ({
        id: crypto.randomUUID(),
        minutes,
        notified: false,
      })),
    };

    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        ...eventData,
      });
    } else {
      addEvent(eventData);
    }

    // Schedule reminders for the event
    if (hasPermission) {
      values.reminders.forEach(minutes => {
        addReminder(eventData as Event, minutes);
      });
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent);
    }
  };

  return (
    <Dialog
      open={isEventModalOpen}
      onOpenChange={(open) =>
        setState((prev: any) => ({ ...prev, isEventModalOpen: open }))
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Add Event'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence</FormLabel>
                  <FormControl>
                    <RecurrenceForm
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasPermission && (
              <FormField
                control={form.control}
                name="reminders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminders</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const minutes = parseInt(value);
                        if (!field.value.includes(minutes)) {
                          field.onChange([...field.value, minutes]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add reminder" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 space-y-2">
                      {field.value.map((minutes) => (
                        <div
                          key={minutes}
                          className="flex items-center justify-between bg-muted p-2 rounded-md"
                        >
                          <span>{minutes} minutes before</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((m) => m !== minutes)
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className={selectedEvent ? '' : 'invisible'}
              >
                Delete
              </Button>
              <Button type="submit">
                {selectedEvent ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
