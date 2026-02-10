import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Mail, PhoneCall, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';

export function AssignedClientsCard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [callingClientId, setCallingClientId] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/consultant/clients/');
            setClients(response.data);
        } catch (err) {
            setError('Failed to load clients');
            console.error('Failed to fetch clients:', err);
        } finally {
            setLoading(false);
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Assigned Clients
                    <Badge variant="secondary" className="ml-2">{clients.length}</Badge>
                </CardTitle>
                <CardDescription>
                    Clients currently assigned to you. Only you can see this list.
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
                    <div className="space-y-3">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="p-4 rounded-lg border /30 hover:bg-gray-200 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium">{client.name}</h4>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                {client.email || 'No email'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="h-3.5 w-3.5" />
                                                {client.pan || 'PAN pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleCall(client.id, client.name)}
                                            disabled={callingClientId === client.id}
                                            className="gap-1"
                                        >
                                            {callingClientId === client.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <PhoneCall className="h-3.5 w-3.5" />
                                            )}
                                            Call
                                        </Button>
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
