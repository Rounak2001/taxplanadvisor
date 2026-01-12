import { useState, useMemo } from 'react';
import { Search, Download, RefreshCw, Maximize2, Minimize2, Shield, Loader2, FileSpreadsheet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { GSTAuthModal } from '@/components/gst/GSTAuthModal';
import { useAppStore } from '@/stores/useAppStore';
import { useClients } from '@/hooks/useClients';
import { useReconcileGstr, useDownloadGstrExcel } from '@/hooks/useGST';
import { mockGSTRecords } from '@/lib/mockData';
import { toast } from 'sonner';

export default function GSTReco() {
  const { consultantId, tableCompactMode, toggleTableCompactMode } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [gstAuthOpen, setGstAuthOpen] = useState(false);
  const [authenticatedGstins, setAuthenticatedGstins] = useState({});
  const [reconcileData, setReconcileData] = useState(null);

  // Fetch clients from API
  const { data: apiClients, isLoading: clientsLoading } = useClients();
  
  // GST API hooks
  const reconcileMutation = useReconcileGstr();
  const downloadMutation = useDownloadGstrExcel();

  // Use reconciled data if available, otherwise use mock data
  const gstRecords = reconcileData || mockGSTRecords;

  // Filter GST records
  const filteredRecords = useMemo(() => {
    return gstRecords
      .filter((record) => {
        // Filter by consultantId for mock data
        if (!reconcileData && record.consultantId !== consultantId) return false;
        if (selectedClientId !== 'all' && record.clientId !== selectedClientId) return false;
        if (statusFilter !== 'all' && record.status !== statusFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            record.supplierName?.toLowerCase().includes(query) ||
            record.invoiceNo?.toLowerCase().includes(query)
          );
        }
        return true;
      });
  }, [gstRecords, reconcileData, consultantId, searchQuery, statusFilter, selectedClientId]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const matched = filteredRecords.filter((r) => r.status === 'matched');
    const unmatched = filteredRecords.filter((r) => r.status === 'unmatched');
    const missingInBooks = filteredRecords.filter((r) => r.status === 'missing_in_books');
    const missingInGstr2b = filteredRecords.filter((r) => r.status === 'missing_in_gstr2b');

    const totalBooksValue = filteredRecords.reduce((sum, r) => sum + (r.booksValue || 0), 0);
    const totalGstr2bValue = filteredRecords.reduce((sum, r) => sum + (r.gstr2bValue || 0), 0);

    return {
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      missingInBooksCount: missingInBooks.length,
      missingInGstr2bCount: missingInGstr2b.length,
      totalBooksValue,
      totalGstr2bValue,
      matchPercentage: filteredRecords.length > 0
        ? Math.round((matched.length / filteredRecords.length) * 100)
        : 0,
    };
  }, [filteredRecords]);

  const clients = apiClients || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleGstAuthenticated = (authData) => {
    setAuthenticatedGstins(prev => ({
      ...prev,
      [authData.gstin]: authData
    }));
    toast.success(`Authenticated for ${authData.gstin}`);
  };

  const handleSyncData = async () => {
    if (Object.keys(authenticatedGstins).length === 0) {
      setGstAuthOpen(true);
      return;
    }

    // Get the first authenticated GSTIN
    const gstin = Object.keys(authenticatedGstins)[0];
    const authData = authenticatedGstins[gstin];

    reconcileMutation.mutate({
      gstin,
      auth_token: authData.token,
      period: 'current', // You might want to make this configurable
    }, {
      onSuccess: (data) => {
        setReconcileData(data.records || data);
        toast.success('Data synced from GST portal');
      }
    });
  };

  const handleExport = () => {
    if (Object.keys(authenticatedGstins).length === 0) {
      // Export mock data as fallback
      toast.info('Exporting local data. Authenticate with GST portal for live data.');
      return;
    }

    const gstin = Object.keys(authenticatedGstins)[0];
    const authData = authenticatedGstins[gstin];

    downloadMutation.mutate({
      gstin,
      auth_token: authData.token,
      period: 'current',
    });
  };

  const isAuthenticated = Object.keys(authenticatedGstins).length > 0;

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
          <Button 
            variant={isAuthenticated ? "outline" : "default"}
            onClick={() => setGstAuthOpen(true)}
          >
            <Shield size={16} strokeWidth={1.5} className="mr-2" />
            {isAuthenticated ? 'Authenticated' : 'Authenticate GST'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSyncData}
            disabled={reconcileMutation.isPending}
          >
            {reconcileMutation.isPending ? (
              <Loader2 size={16} strokeWidth={1.5} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} strokeWidth={1.5} className="mr-2" />
            )}
            Sync Data
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={downloadMutation.isPending}
          >
            {downloadMutation.isPending ? (
              <Loader2 size={16} strokeWidth={1.5} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} strokeWidth={1.5} className="mr-2" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Auth Status Banner */}
      {isAuthenticated && (
        <Card className="bg-success/5 border-success/20">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">
                Connected to GST Portal: {Object.keys(authenticatedGstins).join(', ')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* GST Auth Modal */}
      <GSTAuthModal
        open={gstAuthOpen}
        onClose={() => setGstAuthOpen(false)}
        onAuthenticated={handleGstAuthenticated}
      />
    </div>
  );
}
