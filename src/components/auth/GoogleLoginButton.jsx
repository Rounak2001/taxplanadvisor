import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import api from '@/api/axios';

export function GoogleLoginButton({ className = '' }) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const { checkAuth } = useAuthStore();

    const handleSuccess = async (credentialResponse) => {
        setError('');

        try {
            // credentialResponse.credential is the ID token (JWT)
            const response = await api.post('/auth/google/', {
                id_token: credentialResponse.credential,
            });

            if (response.data.success) {
                // Fetch dashboard data to update auth store
                const dashboardResponse = await api.get('/auth/dashboard/');
                const userData = dashboardResponse.data;

                useAuthStore.setState({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Check if phone is verified
                if (userData.is_phone_verified) {
                    navigate('/client');
                } else {
                    setShowVerification(true);
                }
            }
        } catch (err) {
            setError('Google login failed. Please try again.');
            console.error('Google login error:', err);
        }
    };

    const handleVerificationComplete = () => {
        setShowVerification(false);
        navigate('/client');
    };

    const handleError = () => {
        setError('Google sign-in was cancelled or failed.');
    };

    return (
        <div className={className}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
            />
            {error && (
                <p className="text-destructive text-sm mt-2 text-center">{error}</p>
            )}

            <PhoneVerificationModal
                open={showVerification}
                onClose={() => setShowVerification(false)}
                onVerified={handleVerificationComplete}
            />
        </div>
    );
}
