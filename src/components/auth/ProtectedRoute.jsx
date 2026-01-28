import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user, checkAuth, logout } = useAuthStore();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // Always verify with backend on mount
        const verifySession = async () => {
            setIsVerifying(true);
            try {
                const isValid = await checkAuth();
                if (!isValid) {
                    // Session is invalid, clear state
                    await logout();
                }
            } catch (error) {
                // Auth check failed, clear state
                await logout();
            } finally {
                setIsVerifying(false);
            }
        };

        verifySession();
    }, [location.pathname]); // Re-verify when route changes

    // Show loading state while verifying with backend
    if (isVerifying) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="animate-pulse text-muted-foreground">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Redirect to landing if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Check role if requiredRole is specified
    if (requiredRole && user?.role !== requiredRole) {
        const redirectPath = user?.role === 'CLIENT' ? '/client' : '/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}
