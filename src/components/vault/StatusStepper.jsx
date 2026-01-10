import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'checker_review', label: 'Review' },
  { id: 'approved', label: 'Approved' },
];

export function StatusStepper({ currentStatus, onStatusChange }) {
  const currentIndex = steps.findIndex(s => s.id === currentStatus);

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={cn(
            'h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors',
            index < currentIndex && 'bg-success border-success text-success-foreground',
            index === currentIndex && 'border-primary text-primary',
            index > currentIndex && 'border-muted text-muted-foreground'
          )}>
            {index < currentIndex ? <Check size={14} /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={cn('w-8 h-0.5 mx-1', index < currentIndex ? 'bg-success' : 'bg-muted')} />
          )}
        </div>
      ))}
    </div>
  );
}
