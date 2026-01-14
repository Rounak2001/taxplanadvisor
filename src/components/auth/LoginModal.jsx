import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/useAuthStore';
import { PhoneVerificationModal } from './PhoneVerificationModal';

export function LoginModal({ trigger, variant = 'default' }) {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(username, password);

        if (result.success) {
            // Check if phone needs verification
            if (result.role === 'CLIENT' && !result.is_phone_verified) {
                setOpen(false);
                setShowVerification(true);
            } else {
                setOpen(false);
                // Redirect based on role
                if (result.role === 'CLIENT') {
                    navigate('/client');
                } else {
                    navigate('/dashboard');
                }
            }
        } else {
            setError(result.error);
        }
    };

    const handleVerificationComplete = () => {
        setShowVerification(false);
        navigate('/client');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant={variant}>Login</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">Welcome Back</DialogTitle>
                    <DialogDescription>
                        Sign in to access your dashboard
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </DialogContent>

            <PhoneVerificationModal
                open={showVerification}
                onClose={() => setShowVerification(false)}
                onVerified={handleVerificationComplete}
            />
        </Dialog>
    );
}
