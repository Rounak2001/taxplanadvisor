import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Search, Filter, Clock, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

const mockRecordings = [
  { id: 1, date: '2025-01-08', client: 'Rounak Patel', topic: 'GST Filing Review', duration: '28:45', size: '156 MB', status: 'processed' },
  { id: 2, date: '2025-01-07', client: 'Priya Sharma', topic: 'Tax Planning Session', duration: '42:12', size: '234 MB', status: 'processed' },
  { id: 3, date: '2025-01-06', client: 'Amit Kumar', topic: 'CMA Statement Review', duration: '35:30', size: '189 MB', status: 'processing' },
  { id: 4, date: '2025-01-05', client: 'Neha Gupta', topic: 'ITR Consultation', duration: '22:18', size: '121 MB', status: 'processed' },
  { id: 5, date: '2025-01-04', client: 'Rounak Patel', topic: 'Document Verification', duration: '18:55', size: '98 MB', status: 'processed' },
  { id: 6, date: '2025-01-03', client: 'Vikash Singh', topic: 'Business Tax Query', duration: '31:20', size: '167 MB', status: 'processed' },
];

export function RecordingArchive({ onViewRecording }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const { tableCompactMode } = useAppStore();

  const filteredRecordings = mockRecordings.filter((rec) => {
    const matchesSearch =
      rec.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = filterClient === 'all' || rec.client === filterClient;
    return matchesSearch && matchesClient;
  });

  const uniqueClients = [...new Set(mockRecordings.map((r) => r.client))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold">Recording Archive</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-40">
              <Filter size={14} strokeWidth={1.5} className="mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(tableCompactMode && 'py-2')}>Date</TableHead>
              <TableHead className={cn(tableCompactMode && 'py-2')}>Client</TableHead>
              <TableHead className={cn(tableCompactMode && 'py-2')}>Topic</TableHead>
              <TableHead className={cn(tableCompactMode && 'py-2')}>Duration</TableHead>
              <TableHead className={cn(tableCompactMode && 'py-2')}>Size</TableHead>
              <TableHead className={cn(tableCompactMode && 'py-2')}>Status</TableHead>
              <TableHead className={cn('text-right', tableCompactMode && 'py-2')}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecordings.map((recording, index) => (
              <motion.tr
                key={recording.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-muted/50"
              >
                <TableCell className={cn('font-medium', tableCompactMode && 'py-2')}>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    {new Date(recording.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </TableCell>
                <TableCell className={cn(tableCompactMode && 'py-2')}>
                  <div className="flex items-center gap-2">
                    <User size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    {recording.client}
                  </div>
                </TableCell>
                <TableCell className={cn('max-w-[200px] truncate', tableCompactMode && 'py-2')}>
                  {recording.topic}
                </TableCell>
                <TableCell className={cn(tableCompactMode && 'py-2')}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} strokeWidth={1.5} className="text-muted-foreground" />
                    {recording.duration}
                  </div>
                </TableCell>
                <TableCell className={cn('text-muted-foreground', tableCompactMode && 'py-2')}>
                  {recording.size}
                </TableCell>
                <TableCell className={cn(tableCompactMode && 'py-2')}>
                  <Badge
                    variant={recording.status === 'processed' ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      recording.status === 'processed' && 'bg-success/10 text-success hover:bg-success/20'
                    )}
                  >
                    {recording.status === 'processed' ? 'Ready' : 'Processing'}
                  </Badge>
                </TableCell>
                <TableCell className={cn('text-right', tableCompactMode && 'py-2')}>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewRecording?.(recording)}
                      disabled={recording.status !== 'processed'}
                    >
                      <Play size={16} strokeWidth={1.5} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={recording.status !== 'processed'}
                    >
                      <Download size={16} strokeWidth={1.5} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredRecordings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search size={32} strokeWidth={1.5} className="mb-3 opacity-50" />
          <p className="text-sm">No recordings found</p>
        </div>
      )}
    </motion.div>
  );
}
