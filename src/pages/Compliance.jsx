import { useState, useMemo } from 'react';
import { Search, Download, Shield, Eye, XCircle, Filter, Maximize2, Minimize2 } from 'lucide-react';
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
import { ConsentLogTable } from '@/components/compliance/ConsentLogTable';
import { useAppStore } from '@/stores/useAppStore';
import { mockConsentRecords, mockClients } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Compliance() {
  const { consultantId, tableCompactMode, toggleTableCompactMode } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter consent records based on consultantId (RLS-ready)
  const filteredRecords = useMemo(() => {
    return mockConsentRecords
      .filter((record) => record.consultantId === consultantId)
      .filter((record) => {
        if (statusFilter !== 'all' && record.status !== statusFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const client = mockClients.find((c) => c.id === record.clientId);
          return (
            record.purpose.toLowerCase().includes(query) ||
            client?.name.toLowerCase().includes(query)
          );
        }
        return true;
      });
  }, [consultantId, searchQuery, statusFilter]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const all = mockConsentRecords.filter((r) => r.consultantId === consultantId);
    const active = all.filter((r) => r.status === 'active');
    const expired = all.filter((r) => r.status === 'expired');
    const revoked = all.filter((r) => r.status === 'revoked');

    // Count consents expiring in next 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = active.filter((r) => {
      const expiryDate = new Date(r.expiryDate);
      return expiryDate <= thirtyDaysFromNow;
    });

    return {
      total: all.length,
      active: active.length,
      expired: expired.length,
      revoked: revoked.length,
      expiringSoon: expiringSoon.length,
    };
  }, [consultantId]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">DPDP Compliance</h1>
          <p className="text-muted-foreground">
            Digital Personal Data Protection Act 2023 - Consent Management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download size={16} strokeWidth={1.5} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Compliance Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield size={20} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">DPDP Act 2023 Compliance</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Under the Digital Personal Data Protection Act 2023, you must obtain and maintain records of consent
                from all data principals (clients) before processing their personal data. This dashboard helps you
                track consent status, renewals, and revocations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Consents</p>
            <p className="text-3xl font-semibold">{summaryStats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-semibold text-success">{summaryStats.active}</p>
              </div>
              <Badge variant="outline" className="border-success text-success">
                Valid
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-3xl font-semibold text-warning">{summaryStats.expiringSoon}</p>
              </div>
              <Badge variant="outline" className="border-warning text-warning">
                30 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Expired</p>
            <p className="text-3xl font-semibold text-destructive">{summaryStats.expired}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Revoked</p>
            <p className="text-3xl font-semibold text-muted-foreground">{summaryStats.revoked}</p>
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
                placeholder="Search by client or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
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

      {/* Consent Records Table */}
      <Card>
        <CardContent className="p-0">
          <ConsentLogTable
            records={filteredRecords}
            compactMode={tableCompactMode}
            consultantId={consultantId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
