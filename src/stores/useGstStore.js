import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gstService } from '@/api/gstService';

export const useGstStore = create(
    persist(
        (set, get) => ({
            // State
            sessionId: null,
            gstin: '',
            username: '',
            isVerified: false,
            expiresAt: null,
            isLoading: false,
            isCheckingSession: false,
            error: null,

            // Computed
            getIsAuthenticated: () => get().isVerified && !!get().sessionId,

            // Actions
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            generateOTP: async (gstUsername, gstinInput) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await gstService.generateOTP(gstinInput, gstUsername);
                    set({
                        sessionId: response.session_id,
                        gstin: gstinInput,
                        username: gstUsername,
                        isVerified: false,
                        isLoading: false,
                    });
                    return { success: true, ...response };
                } catch (err) {
                    const errorMsg = err.response?.data?.error || 'Failed to generate OTP';
                    set({ error: errorMsg, isLoading: false });
                    return { success: false, error: errorMsg };
                }
            },

            verifyOTP: async (otp) => {
                set({ isLoading: true, error: null });
                try {
                    const { sessionId, username } = get();
                    const response = await gstService.verifyOTP(sessionId, otp, username);
                    set({
                        isVerified: true,
                        expiresAt: Date.now() + (6 * 60 * 60 * 1000), // 6 hours
                        isLoading: false,
                    });
                    return { success: true, ...response };
                } catch (err) {
                    const errorMsg = err.response?.data?.error || 'OTP verification failed';
                    set({ error: errorMsg, isLoading: false });
                    return { success: false, error: errorMsg };
                }
            },

            checkSessionStatus: async () => {
                const { sessionId, gstin } = get();
                if (!sessionId) return;

                set({ isCheckingSession: true });
                try {
                    const status = await gstService.getSessionStatus(sessionId);
                    if (status.is_valid) {
                        set({
                            isVerified: status.is_verified,
                            expiresAt: Date.now() + (status.expires_in_seconds * 1000),
                            username: status.username || get().username,
                            error: null,
                        });
                    } else {
                        get().clearSession();
                        set({ error: status.error || 'Session expired' });
                    }
                } catch (err) {
                    console.error('Failed to check session status:', err);
                } finally {
                    set({ isCheckingSession: false });
                }
            },

            clearSession: () => {
                set({
                    sessionId: null,
                    gstin: '',
                    username: '',
                    isVerified: false,
                    expiresAt: null,
                    error: null,
                });
            },

            logout: () => get().clearSession(),
        }),
        {
            name: 'taxplan-gst-auth-store',
            // Only persist specific fields
            partialize: (state) => ({
                sessionId: state.sessionId,
                gstin: state.gstin,
                username: state.username,
                isVerified: state.isVerified,
                expiresAt: state.expiresAt,
            }),
        }
    )
);
