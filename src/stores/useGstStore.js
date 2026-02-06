import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gstService } from '@/api/gstService';

export const useGstStore = create(
    persist(
        (set, get) => ({
            // State
            sessions: {}, // { [gstin]: { sessionId, username, isVerified, expiresAt } }
            activeGstin: '',

            // Current Active Session (Synced with activeGstin)
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
            getSessionForGstin: (gstin) => get().sessions[gstin] || null,

            // Actions
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            setActiveGstin: (gstin) => {
                const session = get().sessions[gstin] || null;
                set({
                    activeGstin: gstin,
                    gstin: gstin,
                    sessionId: session?.sessionId || null,
                    username: session?.username || '',
                    isVerified: session?.isVerified || false,
                    expiresAt: session?.expiresAt || null,
                });
            },

            updateSessionInMap: (gstin, data) => {
                const { sessions } = get();
                const updatedSessions = {
                    ...sessions,
                    [gstin]: {
                        ...(sessions[gstin] || {}),
                        ...data
                    }
                };

                const update = { sessions: updatedSessions };

                // If this is the active GSTIN, also update top-level state
                if (gstin === get().activeGstin) {
                    Object.assign(update, data);
                }

                set(update);
            },

            generateOTP: async (gstUsername, gstinInput) => {
                set({ isLoading: true, error: null, activeGstin: gstinInput });
                try {
                    const response = await gstService.generateOTP(gstinInput, gstUsername);

                    const sessionData = {
                        sessionId: response.session_id,
                        gstin: gstinInput,
                        username: gstUsername,
                        isVerified: false,
                        expiresAt: null,
                    };

                    get().updateSessionInMap(gstinInput, sessionData);
                    set({ isLoading: false });

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
                    const { sessionId, username, gstin } = get();
                    const response = await gstService.verifyOTP(sessionId, otp, username);

                    const sessionData = {
                        isVerified: true,
                        expiresAt: Date.now() + (6 * 60 * 60 * 1000), // 6 hours
                    };

                    get().updateSessionInMap(gstin, sessionData);
                    set({ isLoading: false });

                    return { success: true, ...response };
                } catch (err) {
                    const errorMsg = err.response?.data?.error || 'OTP verification failed';
                    set({ error: errorMsg, isLoading: false });
                    return { success: false, error: errorMsg };
                }
            },

            initializeSession: async (gstinInput) => {
                // 1. Check if we already have a valid session in the store map
                const state = get();
                const localSession = state.sessions[gstinInput];

                if (localSession && localSession.isVerified && localSession.expiresAt > Date.now()) {
                    get().setActiveGstin(gstinInput);
                    return { success: true, alreadyActive: true };
                }

                set({ isLoading: true, error: null, activeGstin: gstinInput });
                try {
                    const response = await gstService.checkActiveSession(gstinInput);
                    if (response.has_active_session) {
                        const sessionData = {
                            sessionId: response.session_id,
                            gstin: response.gstin,
                            username: response.username,
                            isVerified: true,
                            expiresAt: Date.now() + (response.expires_in_seconds * 1000),
                        };

                        get().updateSessionInMap(gstinInput, sessionData);
                        set({ isLoading: false });
                        return { success: true, restored: true };
                    }

                    // No valid session found - clear active state but keep gstin
                    set({
                        sessionId: null,
                        gstin: gstinInput,
                        username: '',
                        isVerified: false,
                        expiresAt: null,
                        isLoading: false
                    });
                    return { success: false, restored: false };
                } catch (err) {
                    console.error('Failed to search for active session:', err);
                    set({ isLoading: false });
                    return { success: false, error: 'Search failed' };
                }
            },

            checkSessionStatus: async (gstinToCheck) => {
                const targetGstin = gstinToCheck || get().activeGstin;
                const session = get().sessions[targetGstin];

                if (!session?.sessionId) return;

                set({ isCheckingSession: true });
                try {
                    const status = await gstService.getSessionStatus(session.sessionId);
                    if (status.is_valid) {
                        const updatedData = {
                            isVerified: status.is_verified,
                            expiresAt: Date.now() + (status.expires_in_seconds * 1000),
                            username: status.username || session.username,
                        };
                        get().updateSessionInMap(targetGstin, updatedData);
                    } else {
                        get().clearSession(targetGstin);
                        if (targetGstin === get().activeGstin) {
                            set({ error: status.error || 'Session expired' });
                        }
                    }
                } catch (err) {
                    console.error('Failed to check session status:', err);
                } finally {
                    set({ isCheckingSession: false });
                }
            },

            clearSession: (gstinToClear) => {
                const targetGstin = gstinToClear || get().activeGstin;
                const { sessions } = get();
                const newSessions = { ...sessions };
                delete newSessions[targetGstin];

                const update = { sessions: newSessions };

                if (targetGstin === get().activeGstin) {
                    Object.assign(update, {
                        sessionId: null,
                        username: '',
                        isVerified: false,
                        expiresAt: null,
                        error: null,
                    });
                }

                set(update);
            },

            logout: () => set({
                sessions: {},
                activeGstin: '',
                sessionId: null,
                gstin: '',
                username: '',
                isVerified: false,
                expiresAt: null,
                error: null,
            }),
        }),
        {
            name: 'taxplan-gst-auth-store',
            partialize: (state) => ({
                sessions: state.sessions,
                activeGstin: state.activeGstin,
                // We also persist the active one for instant hydration on reload
                sessionId: state.sessionId,
                gstin: state.gstin,
                username: state.username,
                isVerified: state.isVerified,
                expiresAt: state.expiresAt,
            }),
        }
    )
);
