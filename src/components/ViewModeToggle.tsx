import { Button } from './ui/button.tsx';
import { ViewMode } from '../types/calendar';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex rounded-lg bg-muted p-1">
      <Button
        variant={value === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('month')}
      >
        Month
      </Button>
      <Button
        variant={value === 'week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('week')}
      >
        Week
      </Button>
      <Button
        variant={value === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('day')}
      >
        Day
      </Button>
    </div>
  );
}
