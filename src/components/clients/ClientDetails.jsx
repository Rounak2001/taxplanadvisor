import { Mail, Phone, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ClientDetails({ client, consultantId }) {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-primary text-xl font-semibold">
            {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <h3 className="font-semibold">{client.name}</h3>
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="mt-1">
          {client.status}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Mail size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span>{client.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FileText size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span>PAN: {client.pan}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FileText size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span className="truncate">GSTIN: {client.gstin}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span>Since {new Date(client.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full">View Full Profile</Button>
    </div>
  );
}
