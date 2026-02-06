import api from './axios';

export const authService = {
    /**
     * Login for both consultant and client
     * POST /auth/token/ (or /auth/login/ if legacy)
     */
    login: async (email, password) => {
        // Current backend likely needs 'username', so we map 'email' to 'username'
        const response = await api.post('/auth/token/', { username: email, password });
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('taxplan_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('taxplan_auth_token');
    },

    /**
     * Register a new consultant
     * POST /auth/consultant/register/
     */
    registerConsultant: async (data) => {
        const response = await api.post('/auth/consultant/register/', data);
        return response.data;
    },

    /**
     * Logout - clears cookies on backend and local state
     * POST /auth/logout/
     */
    logout: async () => {
        try {
            await api.post('/auth/logout/');
        } finally {
            localStorage.removeItem('taxplan_auth_token');
            localStorage.removeItem('taxplan_user');
        }
    },

    /**
     * Get dashboard data to confirm auth
     * GET /auth/dashboard/
     */
    getDashboard: async () => {
        const response = await api.get('/auth/dashboard/');
        return response.data;
    },

    /**
     * Get client dashboard data
     * GET /auth/client/dashboard/
     */
    getClientDashboard: async () => {
        const response = await api.get('/auth/client/dashboard/');
        return response.data;
    },

    /**
     * Get consultant's view of a specific client dashboard
     * GET /auth/consultant/client/{clientId}/dashboard/
     */
    getConsultantClientDashboard: async (clientId) => {
        const response = await api.get(`/auth/consultant/client/${clientId}/dashboard/`);
        return response.data;
    },

    /**
     * Verify Google OAuth token
     * POST /auth/google/
     */
    googleAuth: async (idToken, accessToken) => {
        const response = await api.post('/auth/google/', {
            id_token: idToken,
            access_token: accessToken
        });
        return response.data;
    }
};

export default authService;
