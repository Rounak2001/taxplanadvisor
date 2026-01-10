import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  matched: { label: 'Matched', variant: 'success' },
  unmatched: { label: 'Unmatched', variant: 'destructive' },
  missing_in_books: { label: 'Missing in Books', variant: 'warning' },
  missing_in_gstr2b: { label: 'Missing in GSTR-2B', variant: 'secondary' },
};

export function GSTRecoTable({ records, compactMode, consultantId }) {
  const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Supplier</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Invoice No</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Date</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3', 'text-right')}>Books</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3', 'text-right')}>GSTR-2B</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3', 'text-right')}>Diff</TableHead>
            <TableHead className={cn(compactMode ? 'py-2' : 'py-3')}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const config = statusConfig[record.status];
            return (
              <TableRow key={record.id} className={cn(record.status !== 'matched' && 'bg-destructive/5')}>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3', 'font-medium')}>{record.supplierName}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>{record.invoiceNo}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}>{record.invoiceDate}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3', 'text-right')}>{formatCurrency(record.booksValue)}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3', 'text-right')}>{formatCurrency(record.gstr2bValue)}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3', 'text-right', record.difference !== 0 && 'text-destructive font-medium')}>{formatCurrency(record.difference)}</TableCell>
                <TableCell className={cn(compactMode ? 'py-2' : 'py-3')}><Badge variant={config.variant}>{config.label}</Badge></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
