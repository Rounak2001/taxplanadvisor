import api from './axios';

export const clientService = {
    /**
     * Get all clients assigned to the logged-in consultant
     * GET /consultant/clients/
     */
    getClients: async () => {
        const response = await api.get('/consultant/clients/');
        const data = response.data;
        return Array.isArray(data) ? data : (data.clients || []);
    },

    /**
     * Create a new client (Consultant only)
     * POST /consultant/clients/
     */
    createClient: async (clientData) => {
        const response = await api.post('/consultant/clients/', clientData);
        return response.data;
    },

    /**
     * Get current client profile details
     * GET /client/profile/
     */
    getClientProfile: async () => {
        const response = await api.get('/client/profile/');
        return response.data;
    },

    /**
     * Update current client profile details
     * PATCH /client/profile/
     */
    updateClientProfile: async (profileData) => {
        const response = await api.patch('/client/profile/', profileData);
        return response.data;
    },

    onboardClient: async (onboardingData) => {
        const response = await api.post('/onboard/', onboardingData);
        return response.data;
    },

    /**
     * Acknowledge service completion (Client)
     */
    confirmService: async (requestId) => {
        const response = await api.post(`/consultants/requests/${requestId}/acknowledge-completion/`);
        return response.data;
    },

    /**
     * Request service revision (Client)
     */
    requestRevision: async (requestId, notes = '') => {
        const response = await api.post(`/consultants/requests/${requestId}/request-revision/`, { notes });
        return response.data;
    }
};

export default clientService;
