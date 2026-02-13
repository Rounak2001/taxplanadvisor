import api from './axios';

export const consultantService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await api.get('/consultants/profile/dashboard-stats/');
        return response.data;
    },

    // Get service requests (optionally filtered by status)
    getServiceRequests: async (status = null) => {
        const params = status ? { status } : {};
        const response = await api.get('/consultants/service-requests/', { params });
        return response.data;
    },

    // Get consultant dashboard data (existing endpoint)
    getDashboard: async () => {
        const response = await api.get('/consultants/profile/dashboard/');
        return response.data;
    },

    // Get activity timeline
    getActivities: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.date) params.append('date', filters.date);
        if (filters.client) params.append('client', filters.client);

        const response = await api.get(`/activity/activities/?${params.toString()}`);
        return response.data;
    },

    // Get activity stats
    getActivityStats: async () => {
        const response = await api.get('/activity/activities/stats/');
        return response.data;
    },

    /**
     * Update the status of a service request
     */
    updateRequestStatus: async (requestId, status) => {
        const response = await api.patch(`/consultants/requests/${requestId}/update-status/`, { status });
        return response.data;
    },

    /**
     * Get all clients assigned to the logged-in consultant
     */
    getAssignedClients: async () => {
        const response = await api.get('/consultant/clients/');
        return response.data;
    }
};

export default consultantService;
