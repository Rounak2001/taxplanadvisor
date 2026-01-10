import { useState, useMemo } from 'react';
import { Search, Download, Filter, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GSTRecoTable } from '@/components/financial/GSTRecoTable';
import { useAppStore } from '@/stores/useAppStore';
import { mockGSTRecords, mockClients } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function GSTReco() {
  const { consultantId, tableCompactMode, toggleTableCompactMode } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClientId, setSelectedClientId] = useState('all');

  // Filter GST records based on consultantId (RLS-ready)
  const filteredRecords = useMemo(() => {
    return mockGSTRecords
      .filter((record) => record.consultantId === consultantId)
      .filter((record) => {
        if (selectedClientId !== 'all' && record.clientId !== selectedClientId) return false;
        if (statusFilter !== 'all' && record.status !== statusFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            record.supplierName.toLowerCase().includes(query) ||
            record.invoiceNo.toLowerCase().includes(query)
          );
        }
        return true;
      });
  }, [consultantId, searchQuery, statusFilter, selectedClientId]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const matched = filteredRecords.filter((r) => r.status === 'matched');
    const unmatched = filteredRecords.filter((r) => r.status === 'unmatched');
    const missingInBooks = filteredRecords.filter((r) => r.status === 'missing_in_books');
    const missingInGstr2b = filteredRecords.filter((r) => r.status === 'missing_in_gstr2b');

    const totalBooksValue = filteredRecords.reduce((sum, r) => sum + r.booksValue, 0);
    const totalGstr2bValue = filteredRecords.reduce((sum, r) => sum + r.gstr2bValue, 0);
    const totalDifference = filteredRecords.reduce((sum, r) => sum + Math.abs(r.difference), 0);

    return {
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      missingInBooksCount: missingInBooks.length,
      missingInGstr2bCount: missingInGstr2b.length,
      totalBooksValue,
      totalGstr2bValue,
      totalDifference,
      matchPercentage: filteredRecords.length > 0
        ? Math.round((matched.length / filteredRecords.length) * 100)
        : 0,
    };
  }, [filteredRecords]);

  const clients = mockClients.filter((c) => c.consultantId === consultantId);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">GST Reconciliation</h1>
          <p className="text-muted-foreground">
            Compare Books vs GSTR-2B data and identify discrepancies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw size={16} strokeWidth={1.5} className="mr-2" />
            Sync Data
          </Button>
          <Button variant="outline">
            <Download size={16} strokeWidth={1.5} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Match Rate</p>
                <p className="text-3xl font-semibold">{summaryStats.matchPercentage}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success text-lg font-semibold">
                  {summaryStats.matchedCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Discrepancies</p>
                <p className="text-3xl font-semibold">{summaryStats.unmatchedCount}</p>
              </div>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {summaryStats.unmatchedCount + summaryStats.missingInBooksCount + summaryStats.missingInGstr2bCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Books Value</p>
            <p className="text-2xl font-semibold">{formatCurrency(summaryStats.totalBooksValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total GSTR-2B Value</p>
            <p className="text-2xl font-semibold">{formatCurrency(summaryStats.totalGstr2bValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search by supplier or invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="unmatched">Unmatched</SelectItem>
                <SelectItem value="missing_in_books">Missing in Books</SelectItem>
                <SelectItem value="missing_in_gstr2b">Missing in GSTR-2B</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Switch
                id="compact-mode"
                checked={tableCompactMode}
                onCheckedChange={toggleTableCompactMode}
              />
              <Label htmlFor="compact-mode" className="text-sm cursor-pointer">
                {tableCompactMode ? (
                  <Minimize2 size={16} strokeWidth={1.5} />
                ) : (
                  <Maximize2 size={16} strokeWidth={1.5} />
                )}
              </Label>
              <span className="text-sm text-muted-foreground">Compact</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GST Records Table */}
      <Card>
        <CardContent className="p-0">
          <GSTRecoTable
            records={filteredRecords}
            compactMode={tableCompactMode}
            consultantId={consultantId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
