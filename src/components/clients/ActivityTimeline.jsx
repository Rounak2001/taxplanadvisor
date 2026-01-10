import { MessageSquare, Phone, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  whatsapp: MessageSquare,
  call: Phone,
  document: FileText,
  system: Settings,
};

export function ActivityTimeline({ activities, clientId }) {
  if (!activities.length) {
    return <div className="text-center text-muted-foreground py-8">No activities yet</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = iconMap[activity.type] || Settings;
        return (
          <div key={activity.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
              activity.type === 'whatsapp' && 'bg-success/20 text-success',
              activity.type === 'call' && 'bg-info/20 text-info',
              activity.type === 'document' && 'bg-warning/20 text-warning',
              activity.type === 'system' && 'bg-muted text-muted-foreground'
            )}>
              <Icon size={14} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(activity.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
