import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, User, Phone, CreditCard } from 'lucide-react';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/useAuthStore';

export function ClientProfileCard() {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        pan_number: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/client/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Split full_name into first and last name
            const nameParts = profile.full_name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const response = await api.patch('/client/profile/', {
                first_name: firstName,
                last_name: lastName,
                phone_number: profile.phone_number,
                pan_number: profile.pan_number,
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });

                // Refresh auth store to update dashboard
                const dashboardResponse = await api.get('/auth/dashboard/');
                useAuthStore.setState({
                    user: dashboardResponse.data,
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
            console.error('Failed to save profile:', error);
        } finally {
            setSaving(false);
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
                    <User className="h-5 w-5" />
                    My Profile
                </CardTitle>
                <CardDescription>
                    Update your personal details. This data is visible only to you and your assigned CA.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {message.text && (
                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="full_name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                className="pl-10"
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email (Google)</Label>
                        <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="bg-muted/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone_number"
                                value={profile.phone_number || ''}
                                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                className="pl-10"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pan_number">PAN Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="pan_number"
                                value={profile.pan_number || ''}
                                onChange={(e) => setProfile({ ...profile, pan_number: e.target.value.toUpperCase() })}
                                className="pl-10"
                                placeholder="ABCDE1234F"
                                maxLength={10}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
