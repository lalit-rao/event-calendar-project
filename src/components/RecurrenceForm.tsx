import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { Input } from './ui/input.tsx';
import { Label } from './ui/label.tsx';
import { Checkbox } from './ui/checkbox.tsx';
import type { RecurrencePattern } from '../types/calendar';

interface RecurrenceFormProps {
  value: RecurrencePattern | undefined;
  onChange: (pattern: RecurrencePattern | undefined) => void;
}

export default function RecurrenceForm({ value, onChange }: RecurrenceFormProps) {
  const [isRecurring, setIsRecurring] = useState(!!value);

  const handleFrequencyChange = (frequency: RecurrencePattern['frequency']) => {
    onChange({
      frequency,
      interval: 1,
      ...(frequency === 'weekly' && { daysOfWeek: [new Date().getDay()] }),
      ...(frequency === 'monthly' && { dayOfMonth: new Date().getDate() }),
      ...(frequency === 'yearly' && {
        dayOfMonth: new Date().getDate(),
        monthOfYear: new Date().getMonth(),
      }),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRecurring"
          checked={isRecurring}
          onCheckedChange={(checked) => {
            setIsRecurring(!!checked);
            if (!checked) onChange(undefined);
          }}
        />
        <Label htmlFor="isRecurring">Repeat this event</Label>
      </div>

      {isRecurring && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={value?.frequency}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interval</Label>
              <Input
                type="number"
                min="1"
                value={value?.interval}
                onChange={(e) =>
                  onChange(value && {
                    ...value,
                    interval: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>

          {value?.frequency === 'weekly' && (
            <div className="space-y-2">
              <Label>Repeat on</Label>
              <div className="flex gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <Checkbox
                      key={day}
                      id={day}
                      checked={value.daysOfWeek?.includes(index)}
                      onCheckedChange={(checked) => {
                        const days = new Set(value.daysOfWeek);
                        checked ? days.add(index) : days.delete(index);
                        onChange({
                          ...value,
                          daysOfWeek: Array.from(days).sort(),
                        });
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
