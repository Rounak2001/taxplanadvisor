import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ClientList({ clients, activeClientId, onSelectClient, consultantId }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'inactive': return 'bg-muted-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="divide-y divide-border">
      {clients.map((client) => (
        <button
          key={client.id}
          onClick={() => onSelectClient(client.id)}
          className={cn(
            'w-full p-4 text-left hover:bg-muted/50 transition-colors',
            activeClientId === client.id && 'bg-muted'
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{client.name}</p>
                <div className={cn('h-2 w-2 rounded-full', getStatusColor(client.status))} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{client.pan}</p>
            </div>
          </div>
        </button>
      ))}
      {clients.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">No clients found</div>
      )}
    </div>
  );
}
