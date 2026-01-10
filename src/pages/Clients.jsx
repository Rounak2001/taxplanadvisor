import { useState, useMemo } from 'react';
import { Search, Plus, Phone, MessageSquare, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientList } from '@/components/clients/ClientList';
import { ActivityTimeline } from '@/components/clients/ActivityTimeline';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { WhatsAppChat } from '@/components/clients/WhatsAppChat';
import { CallDialer } from '@/components/clients/CallDialer';
import { useAppStore } from '@/stores/useAppStore';
import { mockClients, mockActivities } from '@/lib/mockData';

export default function Clients() {
  const { 
    consultantId, 
    activeClientId, 
    setActiveClientId,
    chatOpen,
    setChatOpen,
    dialerOpen,
    setDialerOpen,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  // Filter clients based on consultantId (RLS-ready)
  const filteredClients = useMemo(() => {
    return mockClients
      .filter((client) => client.consultantId === consultantId)
      .filter((client) => {
        if (statusFilter !== 'all' && client.status !== statusFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            client.name.toLowerCase().includes(query) ||
            client.pan.toLowerCase().includes(query) ||
            client.gstin?.toLowerCase().includes(query)
          );
        }
        return true;
      });
  }, [consultantId, searchQuery, statusFilter]);

  const activeClient = activeClientId
    ? mockClients.find((c) => c.id === activeClientId)
    : filteredClients[0];

  const clientActivities = useMemo(() => {
    if (!activeClient) return [];
    return mockActivities
      .filter((a) => a.clientId === activeClient.id)
      .filter((a) => activityFilter === 'all' || a.type === activityFilter);
  }, [activeClient, activityFilter]);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Client 360</h1>
          <p className="text-muted-foreground">
            Unified view of client communications and activities
          </p>
        </div>
        <Button>
          <Plus size={16} strokeWidth={1.5} className="mr-2" />
          Add Client
        </Button>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left Column - Client List */}
        <div className="col-span-3 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <Filter size={14} strokeWidth={1.5} className="mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ClientList
              clients={filteredClients}
              activeClientId={activeClient?.id}
              onSelectClient={setActiveClientId}
              consultantId={consultantId}
            />
          </div>
        </div>

        {/* Center Column - Activity Timeline */}
        <div className="col-span-5 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Activity Timeline</h2>
              <p className="text-sm text-muted-foreground">
                {activeClient?.name || 'Select a client'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="call">Calls</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ActivityTimeline
              activities={clientActivities}
              clientId={activeClient?.id}
            />
          </div>
          {/* Quick Action Bar */}
          {activeClient && (
            <div className="p-4 border-t border-border flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setChatOpen(true);
                }}
              >
                <MessageSquare size={16} strokeWidth={1.5} className="mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDialerOpen(true);
                }}
              >
                <Phone size={16} strokeWidth={1.5} className="mr-2" />
                Call
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Client Details */}
        <div className="col-span-4 flex flex-col bg-card rounded-lg border border-border overflow-hidden">
          {activeClient ? (
            <ClientDetails
              client={activeClient}
              consultantId={consultantId}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a client to view details
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Chat Drawer */}
      <WhatsAppChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        client={activeClient}
        consultantId={consultantId}
      />

      {/* Call Dialer Drawer */}
      <CallDialer
        open={dialerOpen}
        onClose={() => setDialerOpen(false)}
        client={activeClient}
      />
    </div>
  );
}
