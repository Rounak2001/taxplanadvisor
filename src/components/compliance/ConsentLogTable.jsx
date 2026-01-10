import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, XCircle } from 'lucide-react';
import { mockClients } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { label: 'Active', variant: 'success' },
  expired: { label: 'Expired', variant: 'destructive' },
  revoked: { label: 'Revoked', variant: 'secondary' },
};

export function ConsentLogTable({ records, compactMode, consultantId }) {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Client</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Purpose</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Consent Date</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Expiry</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Status</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const client = mockClients.find(c => c.id === record.clientId);
            const config = statusConfig[record.status];
            return (
              <TableRow key={record.id}>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3', 'font-medium')}>{client?.name || '-'}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>{record.purpose}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>{new Date(record.consentDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>{new Date(record.expiryDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}><Badge variant={config.variant}>{config.label}</Badge></TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye size={14} strokeWidth={1.5} /></Button>
                    {record.status === 'active' && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><XCircle size={14} strokeWidth={1.5} /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
