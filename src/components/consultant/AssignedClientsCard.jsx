import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Mail, Phone, CreditCard, CheckCircle, Clock } from 'lucide-react';
import api from '@/api/axios';

export function AssignedClientsCard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/consultant/clients/');
            setClients(response.data.clients);
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
                                className="p-4 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium">{client.full_name}</h4>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5" />
                                                {client.email || 'No email'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3.5 w-3.5" />
                                                {client.phone_number || 'No phone'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CreditCard className="h-3.5 w-3.5" />
                                                {client.pan_number || 'PAN pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant={client.is_onboarded ? 'default' : 'outline'}>
                                        {client.is_onboarded ? (
                                            <><CheckCircle className="h-3 w-3 mr-1" /> Onboarded</>
                                        ) : (
                                            <><Clock className="h-3 w-3 mr-1" /> Pending</>
                                        )}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
