import api from './axios';

export const documentService = {
    // List documents (filtered by user role on backend)
    list: async () => {
        const response = await api.get('/vault/documents/');
        return response.data;
    },

    // Create a document request (Consultant only)
    createRequest: async (clientId, title, description) => {
        const response = await api.post('/vault/documents/', {
            client: clientId,
            title,
            description
        });
        return response.data;
    },

    // Client proactively uploads a file
    uploadProactive: async (formData) => {
        const response = await api.post('/vault/documents/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Client uploads a file to a pending request
    uploadToRequest: async (documentId, formData, onProgress) => {
        const response = await api.post(`/vault/documents/${documentId}/upload/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    // Consultant reviews a document
    review: async (documentId, status) => {
        const response = await api.post(`/vault/documents/${documentId}/review/`, { status });
        return response.data;
    },

    // Get assigned clients (Consultant only)
    getAssignedClients: async () => {
        const response = await api.get('/consultant/clients/');
        return response.data.clients;
    },

    // ========== Shared Reports ==========

    // List shared reports (role-based: consultant sees theirs, client sees received)
    listSharedReports: async () => {
        const response = await api.get('/vault/shared-reports/');
        return response.data;
    },

    // Share a report with a client (Consultant only)
    shareReport: async (formData, onProgress) => {
        const response = await api.post('/vault/shared-reports/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    // Delete a shared report (Consultant only)
    deleteSharedReport: async (reportId) => {
        const response = await api.delete(`/vault/shared-reports/${reportId}/`);
        return response.data;
    },
};
