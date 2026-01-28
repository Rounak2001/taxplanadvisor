import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGstStore } from '@/stores/useGstStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { gstService } from '@/api/gstService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    FileSpreadsheet,
    Download,
    RefreshCw,
    Shield,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    Key,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';

const downloadServices = [
    {
        id: 'gstr-1',
        title: 'GSTR-1 Report',
        description: 'Download your sales return data',
        icon: FileSpreadsheet,
        path: '/client/gst/get-1',
        color: 'text-green-600',
        bgColor: 'bg-green-500/10'
    },
    {
        id: 'gstr-2a',
        title: 'GSTR-2A Report',
        description: 'Auto-drafted purchases (real-time)',
        icon: Download,
        path: '/client/gst/get-2a',
        color: 'text-pink-600',
        bgColor: 'bg-pink-500/10'
    },
    {
        id: 'gstr-2b',
        title: 'GSTR-2B Report',
        description: 'ITC statement from portal',
        icon: Download,
        path: '/client/gst/get-2b',
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'gstr-3b',
        title: 'GSTR-3B Report',
        description: 'Monthly summary return',
        icon: FileText,
        path: '/client/gst/get-3b',
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10'
    }
];

export default function ClientGSTServices() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
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
        clearError
    } = useGstStore();

    const isAuthenticated = isVerified && !!sessionId;

    const [step, setStep] = useState('credentials');
    const [gstUsername, setGstUsername] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [, setTick] = useState(0);

    // Auto-fill from user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await gstService.getClientProfile();
                if (response.gstin) setGstNumber(response.gstin);
                if (response.gst_username) setGstUsername(response.gst_username);
            } catch (err) {
                // Profile might not have GST details yet - that's okay
            }
        };
        if (!isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

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
        logout();
        setStep('credentials');
        setOtp('');
        toast.success('Logged out successfully');
    };

    const handleServiceClick = (service) => {
        if (!isAuthenticated) {
            toast.error('Please authenticate with GST portal first');
            return;
        }
        navigate(service.path);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">My GST Reports</h1>
                    <p className="text-muted-foreground">
                        Download your GST returns and reconciliation reports
                    </p>
                </div>
                {isAuthenticated && (
                    <Button variant="outline" onClick={handleLogout}>
                        Logout GST Session
                    </Button>
                )}
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <CheckCircle size={20} className="text-success" />
                            ) : (
                                <AlertCircle size={20} className="text-muted-foreground" />
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">Session Status</p>
                                <p className="font-semibold">{isAuthenticated ? 'Active' : 'Not Connected'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Time Remaining</p>
                                <p className="font-semibold">{getRemainingTime() || '--'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Your GSTIN</p>
                                <p className="font-semibold">{gstin || gstNumber || '--'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Authentication Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key size={20} strokeWidth={1.5} />
                            GST Portal Login
                        </CardTitle>
                        <CardDescription>
                            {isAuthenticated
                                ? 'Connected to GST portal'
                                : 'Authenticate to download your reports'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAuthenticated ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                                    <CheckCircle size={20} className="text-success" />
                                    <div>
                                        <p className="font-medium text-success">Connected</p>
                                        <p className="text-sm text-muted-foreground">Session expires in {getRemainingTime()}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Username:</span>
                                        <span className="font-medium">{username}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">GSTIN:</span>
                                        <span className="font-medium">{gstin}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
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
                    </CardContent>
                </Card>

                {/* Download Services */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Available Reports</CardTitle>
                        <CardDescription>
                            {isAuthenticated
                                ? 'Click on a report to download'
                                : 'Please authenticate first to access reports'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {downloadServices.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => handleServiceClick(service)}
                                        className={`p-4 rounded-lg border transition-all cursor-pointer ${isAuthenticated
                                            ? 'bg-card border-border hover:border-primary hover:shadow-md'
                                            : 'bg-muted/30 border-border opacity-60 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`h-10 w-10 rounded-lg ${service.bgColor} flex items-center justify-center`}>
                                                <Icon size={20} strokeWidth={1.5} className={service.color} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{service.title}</h3>
                                                <p className="text-sm text-muted-foreground">{service.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enable API Access Instructions */}
            <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle size={20} className="text-amber-600" />
                        Enable API Access
                    </CardTitle>
                    <CardDescription>
                        API access must be enabled on the GST portal to use these services
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <span className="text-amber-700 font-semibold text-sm">1</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Login & Profile</p>
                                <p className="text-xs text-muted-foreground">
                                    Login to gst.gov.in and click 'View Profile' from Dashboard.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <span className="text-amber-700 font-semibold text-sm">2</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Manage API Access</p>
                                <p className="text-xs text-muted-foreground">
                                    Go to 'Quick Links' in sidebar and click 'Manage API Access'.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <span className="text-amber-700 font-semibold text-sm">3</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Enable & Save</p>
                                <p className="text-xs text-muted-foreground">
                                    Set 'Enable API Request' to Yes, select 30 days duration.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
