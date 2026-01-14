import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api/axios';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false, // Set to false initially, will be true during login/checkAuth

            login: async (username, password) => {
                set({ isLoading: true });
                try {
                    // Step 1: Get tokens (they will be set as HttpOnly cookies by the backend)
                    await api.post('/auth/token/', { username, password });

                    // Step 2: Fetch user dashboard data to confirm auth and get role
                    const response = await api.get('/auth/dashboard/');
                    const userData = response.data;

                    set({
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true, role: userData.role, is_phone_verified: userData.is_phone_verified };
                } catch (error) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
                    return { success: false, error: errorMessage };
                }
            },

            logout: async () => {
                try {
                    // Call backend to clear HttpOnly cookies
                    await api.post('/auth/logout/');
                } catch (error) {
                    console.error('Logout error:', error);
                }
                // Clear local state regardless
                set({ user: null, isAuthenticated: false, isLoading: false });
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const response = await api.get('/auth/dashboard/');
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return true;
                } catch (error) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    return false;
                }
            },
        }),
        {
            name: 'taxplan-auth-store',
            partialize: (state) => ({
                // We only persist minimal info, as the real auth is in HttpOnly cookies
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);
