import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Users, Mail, PhoneCall, CreditCard, CheckCircle, Clock, ClipboardList, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';
import consultantService from '@/api/consultantService';

export function AssignedClientsCard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [callingClientId, setCallingClientId] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // Statuses that a Consultant is allowed to manually set
    const STATUSES = [
        { value: 'doc_pending', label: 'Docs Pending', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'under_review', label: 'Under Review', color: 'bg-purple-100 text-purple-700' },
        { value: 'wip', label: 'Work In Progress', color: 'bg-orange-100 text-orange-700' },
        { value: 'under_query', label: 'Query Pending', color: 'bg-red-100 text-red-700' },
        { value: 'final_review', label: 'Final Review', color: 'bg-indigo-100 text-indigo-700' },
        { value: 'filed', label: 'Filed/Submitted', color: 'bg-emerald-100 text-emerald-700' },
        { value: 'revision_pending', label: 'Revision Requested', color: 'bg-rose-100 text-rose-700' },
    ];

    const getFullStatusLabel = (status) => {
        const labels = {
            'pending': 'Pending',
            'assigned': 'Assigned',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        const manualStatus = STATUSES.find(s => s.value === status);
        return manualStatus ? manualStatus.label : (labels[status] || status);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await consultantService.getAssignedClients();
            setClients(data);
        } catch (err) {
            setError('Failed to load clients');
            console.error('Failed to fetch clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        setUpdatingStatusId(requestId);
        try {
            await consultantService.updateRequestStatus(requestId, newStatus);
            toast.success('Status updated successfully');
            // Re-fetch to get updated list (could also update local state for better UX)
            fetchClients();
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleCall = async (clientId, clientName) => {
        setCallingClientId(clientId);
        try {
            const response = await api.post('/calls/initiate/', { client_id: clientId });
            if (response.data.success) {
                toast.success(response.data.message || `Calling ${clientName}...`);
            } else {
                toast.error(response.data.error || 'Failed to initiate call');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to initiate call. Please try again.';
            toast.error(errorMsg);
            console.error('Call initiation failed:', err);
        } finally {
            setCallingClientId(null);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Assigned Clients
                    <Badge variant="secondary" className="ml-2">{clients.length}</Badge>
                </CardTitle>
                <CardDescription>
                    Clients currently assigned to you. Manage their service status here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <p className="text-destructive text-sm">{error}</p>
                ) : clients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No clients assigned yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                            >
                                <div className="space-y-4">
                                    {/* Combined Row for Info, Services and Button */}
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Left: Client Info */}
                                        <div className="space-y-1 min-w-[240px]">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-lg">{client.name}</h4>
                                                <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                                                    {client.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="h-4 w-4" />
                                                    {client.email || 'No email'}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <CreditCard className="h-4 w-4" />
                                                    {client.pan || 'PAN pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Middle-Right: Active Services and Call Button */}
                                        <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
                                            {/* Compact Services List */}
                                            {client.active_requests?.length > 0 && (
                                                <div className="flex flex-wrap gap-3 items-center justify-end flex-1">
                                                    {client.active_requests.map((req) => (
                                                        <div key={req.id} className="flex items-center gap-2 p-3 px-1 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted transition-colors">
                                                            <span className="text-xs font-semibold whitespace-nowrap">{req.service_title}</span>
                                                            <Select
                                                                disabled={updatingStatusId === req.id}
                                                                value={req.status}
                                                                onValueChange={(val) => handleStatusUpdate(req.id, val)}
                                                            >
                                                                <SelectTrigger className="h-8 w-[160px] text-[14px] bg-background">
                                                                    <SelectValue>{getFullStatusLabel(req.status)}</SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {STATUSES.map((s) => (
                                                                        <SelectItem key={s.value} value={s.value} className="text-xs">
                                                                            {s.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {updatingStatusId === req.id && (
                                                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Call Button */}
                                            <div className="shrink-0 border-l pl-4 border-border/40 ml-2 h-10 flex items-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCall(client.id, client.name)}
                                                    disabled={callingClientId === client.id}
                                                    className="gap-2 h-9"
                                                >
                                                    {callingClientId === client.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <PhoneCall className="h-4 w-4" />
                                                    )}
                                                    Call Client
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

