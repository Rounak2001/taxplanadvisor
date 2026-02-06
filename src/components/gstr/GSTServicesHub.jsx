import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGstStore } from '@/stores/useGstStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { gstService } from '@/api/gstService';
import { clientService } from '@/api/clientService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileSpreadsheet,
    Download,
    RefreshCw,
    FileText,
    Shield,
    CheckCircle,
    AlertCircle,
    LogOut,
    Clock,
    ArrowRight,
    Lock,
    Unlock,
    Key,
    ExternalLink,
    TrendingUp,
    Users
} from 'lucide-react';
import { toast } from 'sonner';

const services = [
    {
        id: 'comprehensive',
        title: 'GSTR-3B vs R1 & 2B',
        description: 'Compare GSTR-3B with GSTR-1 and 2B data',
        icon: RefreshCw,
        path: '/gst/comprehensive',
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10',
        requiresAuth: true
    },
    {
        id: '3b-books',
        title: 'GSTR-3B vs Books',
        description: 'Reconcile GSTR-3B with your books',
        icon: FileText,
        path: '/gst/3b-books',
        color: 'text-orange-600',
        bgColor: 'bg-orange-500/10',
        requiresAuth: true
    },
    {
        id: '2b-books',
        title: 'GSTR-2B vs Books',
        description: 'Reconcile GSTR-2B with your books',
        icon: FileSpreadsheet,
        path: '/gst/2b-manual',
        color: 'text-teal-600',
        bgColor: 'bg-teal-500/10',
        requiresAuth: false
    },
    {
        id: 'get-2b',
        title: 'Get GSTR-2B Data',
        description: 'Fetch GSTR-2B data from portal',
        icon: Download,
        path: '/gst/get-2b',
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
        requiresAuth: true
    },
    {
        id: 'get-1',
        title: 'GSTR-1 to Excel',
        description: 'Download GSTR-1 data in Excel format',
        icon: FileSpreadsheet,
        path: '/gst/get-1',
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
        requiresAuth: true
    },
    {
        id: 'get-2a',
        title: 'Get GSTR-2A Data',
        description: 'Fetch real-time GSTR-2A with names',
        icon: Download,
        path: '/gst/get-2a',
        color: 'text-pink-600',
        bgColor: 'bg-pink-500/10',
        requiresAuth: true
    },
    {
        id: '1-books',
        title: 'GSTR-1 vs Books',
        description: 'Reconcile GSTR-1 with your books data',
        icon: FileText,
        path: '/gst/1-books',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-500/10',
        requiresAuth: true
    },
    {
        id: 'get-3b',
        title: 'Get GSTR-3B Data',
        description: 'Download GSTR-3B summary returns',
        icon: Download,
        path: '/gst/get-3b',
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10',
        requiresAuth: true
    }
];

export default function GSTServicesHub() {
    const navigate = useNavigate();
    const {
        sessionId,
        gstin,
        username,
        isVerified,
        expiresAt,
        isLoading: loading,
        error,
        generateOTP,
        verifyOTP,
        logout,
        clearSession,
        clearError,
        initializeSession
    } = useGstStore();
    const { user } = useAuthStore();

    const isAuthenticated = isVerified && !!sessionId;

    const [step, setStep] = useState('credentials');
    const [gstUsername, setGstUsername] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [, setTick] = useState(0);

    // Client selection state
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [loadingClients, setLoadingClients] = useState(false);

    // Fetch clients on mount
    useEffect(() => {
        const fetchClients = async () => {
            if (user?.role !== 'CONSULTANT') return;
            setLoadingClients(true);
            try {
                const data = await clientService.getClients();
                setClients(data);
            } catch (err) {
                console.error('Failed to fetch clients:', err);
            } finally {
                setLoadingClients(false);
            }
        };

        const fetchProfileAndInit = async () => {
            if (user?.role !== 'CLIENT') return;
            try {
                const profile = await clientService.getClientProfile();
                if (profile.gstin) {
                    setGstNumber(profile.gstin);
                    setGstUsername(profile.gst_username || '');

                    // Only try to initialize if not already authenticated in store
                    if (!isAuthenticated) {
                        const result = await initializeSession(profile.gstin);
                        if (result.success && result.restored) {
                            toast.success('Active GST session restored');
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch client profile:', err);
            }
        };

        fetchClients();
        fetchProfileAndInit();
    }, [user, isAuthenticated, initializeSession]);

    // Auto-fill when client selected
    const handleClientSelect = async (clientId) => {
        if (!clientId || clientId === '_none') return;

        setSelectedClientId(clientId);
        const client = clients.find(c => String(c.id) === clientId);
        if (client) {
            const gstinValue = client.gstin || '';
            setGstNumber(gstinValue);
            setGstUsername(client.gst_username || '');

            // Proactively check if there's an active session for this GSTIN
            if (gstinValue) {
                const { initializeSession } = useGstStore.getState();
                const result = await initializeSession(gstinValue);
                if (result.success && result.restored) {
                    toast.success('Active GST session restored for client');
                } else if (!result.success) {
                    // If no session to restore, we stay on credentials step
                    setStep('credentials');
                }
            }
        }
    };

    // Update timer every minute
    useEffect(() => {
        const interval = setInterval(() => {
            if (isAuthenticated) setTick(t => t + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const getRemainingTime = () => {
        if (!expiresAt) return null;
        const remaining = expiresAt - Date.now();
        if (remaining <= 0) return null;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const handleSendOTP = async () => {
        if (!gstUsername || !gstNumber) {
            toast.error('Please enter both username and GSTIN');
            return;
        }
        if (gstNumber.length !== 15) {
            toast.error('GSTIN must be 15 characters');
            return;
        }
        clearError();
        const result = await generateOTP(gstUsername, gstNumber);
        if (result.success) {
            setStep('otp');
            toast.success('OTP sent successfully');
        } else {
            toast.error(result.error || 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter 6-digit OTP');
            return;
        }
        clearError();
        const result = await verifyOTP(otp);
        if (result.success) {
            toast.success('Authentication successful');
            setStep('credentials');
            setOtp('');
        } else {
            toast.error(result.error || 'Failed to verify OTP');
        }
    };

    const handleLogout = () => {
        clearSession(gstin); // Clear only current client's session
        setStep('credentials');
        setGstUsername('');
        setGstNumber('');
        setOtp('');
        setSelectedClientId('');
        toast.success('Session cleared for current client');
    };

    const handleServiceClick = (service) => {
        if (service.requiresAuth && !isAuthenticated) {
            toast.error('Please authenticate with GST portal first');
            return;
        }
        navigate(service.path);
    };

    const stats = [
        {
            title: 'Session Status',
            value: isAuthenticated ? 'Active' : 'Inactive',
            icon: isAuthenticated ? CheckCircle : AlertCircle,
            color: isAuthenticated ? 'text-success' : 'text-muted-foreground'
        },
        {
            title: 'Time Remaining',
            value: getRemainingTime() || '--',
            icon: Clock,
            color: 'text-primary'
        },
        {
            title: 'GSTIN',
            value: gstin || '--',
            icon: Shield,
            color: 'text-blue-600'
        },
        {
            title: 'Services Available',
            value: isAuthenticated ? '6' : '1',
            icon: TrendingUp,
            color: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">GST Services</h1>
                    <p className="text-muted-foreground">
                        Authenticate and access GST portal services
                    </p>
                </div>
                {isAuthenticated && (
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut size={16} strokeWidth={1.5} className="mr-2" />
                        Logout
                    </Button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-xl font-semibold truncate">{stat.value}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon size={24} strokeWidth={1.5} className={stat.color} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Authentication Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key size={20} strokeWidth={1.5} />
                            GST Portal Authentication
                        </CardTitle>
                        <CardDescription>
                            {isAuthenticated
                                ? 'You are authenticated with GST portal'
                                : 'Enter your credentials to access GST services'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Client Selection (For Consultants) */}
                            {user?.role === 'CONSULTANT' && (
                                <div className="space-y-2">
                                    <Label>Active Client</Label>
                                    <Select value={selectedClientId} onValueChange={handleClientSelect}>
                                        <SelectTrigger className="w-full">
                                            <Users size={14} className="mr-2 text-primary" />
                                            <SelectValue placeholder={loadingClients ? "Loading clients..." : "Select a client"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.filter(c => c.gstin).map(client => (
                                                <SelectItem key={client.id} value={String(client.id)}>
                                                    {client.name || client.email} - {client.gstin}
                                                </SelectItem>
                                            ))}
                                            {clients.filter(c => c.gstin).length === 0 && (
                                                <SelectItem value="_none" disabled>No clients with GSTIN found</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {isAuthenticated ? (
                                <div className="space-y-4 border-t pt-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                                        <CheckCircle size={20} className="text-success" />
                                        <div className="flex-1">
                                            <p className="font-medium text-success">Authenticated</p>
                                            <p className="text-sm text-muted-foreground">Session expires in {getRemainingTime() || '6h'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Portal User:</span>
                                            <span className="font-medium">{username}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">GSTIN:</span>
                                            <span className="font-medium">{gstin}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleLogout}
                                        className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout & Switch Client
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    {step === 'credentials' ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="username">GST Username</Label>
                                                <Input
                                                    id="username"
                                                    placeholder="Enter GST portal username"
                                                    value={gstUsername}
                                                    onChange={(e) => setGstUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="gstin">GSTIN (15 characters)</Label>
                                                <Input
                                                    id="gstin"
                                                    placeholder="e.g., 27AABCU9603R1ZM"
                                                    value={gstNumber}
                                                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                                    maxLength={15}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleSendOTP}
                                                disabled={loading}
                                                className="w-full"
                                            >
                                                {loading ? 'Sending...' : 'Send OTP'}
                                                <ArrowRight size={16} className="ml-2" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="otp">Enter OTP</Label>
                                                <Input
                                                    id="otp"
                                                    placeholder="6-digit OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    maxLength={6}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setStep('credentials')}
                                                    className="flex-1"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handleVerifyOTP}
                                                    disabled={loading}
                                                    className="flex-1"
                                                >
                                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {error && (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* API Access Info */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ExternalLink size={20} strokeWidth={1.5} />
                            Enable API Access
                        </CardTitle>
                        <CardDescription>
                            API access must be enabled on the GST portal to use these services
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="font-semibold mb-2">1. Login & Profile</div>
                                <p className="text-sm text-muted-foreground">
                                    Login to{' '}
                                    <a href="https://gst.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        gst.gov.in
                                    </a>
                                    {' '}and click on 'View Profile' from Dashboard.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="font-semibold mb-2">2. Manage API Access</div>
                                <p className="text-sm text-muted-foreground">
                                    Go to 'Quick Links' in the sidebar and click 'Manage API Access'.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <div className="font-semibold mb-2">3. Enable & Save</div>
                                <p className="text-sm text-muted-foreground">
                                    Set 'Enable API Request' to <strong>Yes</strong> and select <strong>30 days</strong> duration.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Services Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Services</CardTitle>
                    <CardDescription>
                        Click on a service to get started. Auth required services are marked with a lock icon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => {
                            const Icon = service.icon;
                            const isLocked = service.requiresAuth && !isAuthenticated;
                            return (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceClick(service)}
                                    className={`p-4 rounded-lg border transition-all cursor-pointer ${isLocked
                                        ? 'bg-muted/30 border-border hover:bg-muted/50'
                                        : 'bg-card border-border hover:border-primary hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`h-10 w-10 rounded-lg ${service.bgColor} flex items-center justify-center`}>
                                            <Icon size={20} strokeWidth={1.5} className={service.color} />
                                        </div>
                                        {isLocked ? (
                                            <Badge variant="secondary" className="text-xs">
                                                <Lock size={10} className="mr-1" />
                                                Auth Required
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs text-success border-success/30">
                                                <Unlock size={10} className="mr-1" />
                                                Available
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="font-semibold mb-1">{service.title}</h3>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-primary" />
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Session Info:</strong> Authentication is valid for 6 hours.
                            For services marked as "Auth Required", please authenticate first using your GST portal credentials.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
