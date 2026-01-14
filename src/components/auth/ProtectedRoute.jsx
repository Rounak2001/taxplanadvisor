import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Check auth status when the component mounts
        if (!isAuthenticated && !isLoading) {
            checkAuth();
        }
    }, [isAuthenticated, isLoading, checkAuth]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-pulse text-muted-foreground">
                    Verifying session...
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Check role if requiredRole is specified
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to the correct dashboard based on their actual role
        const redirectPath = user?.role === 'CLIENT' ? '/client' : '/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}
