import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, Shield, CheckCircle } from 'lucide-react';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/useAuthStore';

export function PhoneVerificationModal({ open, onClose, onVerified }) {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { checkAuth } = useAuthStore();

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');

        // Validate phone number (Basic 10 digit check after +91)
        const phoneRegex = /^\+91[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Please enter a valid Indian mobile number (+91XXXXXXXXXX)');
            setLoading(false);
            return;
        }

        try {
            // Dummy delay to simulate network request
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStep('otp');
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            setLoading(false);
            return;
        }

        // Dummy OTP check: accept '123456' or any 6 digits for development
        if (otp !== '123456') {
            setError('Invalid OTP. Use 123456 for testing.');
            setLoading(false);
            return;
        }

        try {
            // Update backend with verified phone number
            await api.patch('/client/profile/', {
                phone_number: phoneNumber,
                is_phone_verified: true,
            });

            // Refresh auth state
            await checkAuth();

            setStep('success');

            // Auto-close and callback after success
            setTimeout(() => {
                onVerified?.();
                onClose();
            }, 1000);
        } catch (err) {
            console.error('Verify OTP error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        setStep('phone');
        setOtp('');
        setError('');
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        Verify Your Phone Number
                    </DialogTitle>
                    <DialogDescription>
                        We need to verify your phone number for secure communication with your CA.
                    </DialogDescription>
                </DialogHeader>

                {step === 'phone' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+91 9876543210"
                                className="text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter your 10-digit Indian mobile number
                            </p>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <Button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="text-2xl text-center tracking-widest"
                                maxLength={6}
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                OTP sent to {phoneNumber}
                            </p>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}

                        <Button
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                            className="w-full"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                            ) : (
                                <><Shield className="mr-2 h-4 w-4" /> Verify OTP</>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="w-full"
                        >
                            Resend OTP
                        </Button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="py-8 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <div>
                            <p className="font-medium text-lg">Phone Verified!</p>
                            <p className="text-sm text-muted-foreground">
                                Redirecting to your dashboard...
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
