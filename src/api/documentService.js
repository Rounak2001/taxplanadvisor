import api from './axios';

export const documentService = {
    // List Folders
    listFolders: async (clientId = null) => {
        const url = clientId ? `/vault/folders/?client_id=${clientId}` : '/vault/folders/';
        const response = await api.get(url);
        return response.data;
    },

    // Create Folder
    createFolder: async (name, clientId = null) => {
        const payload = { name };
        if (clientId && clientId !== 'all') payload.client = clientId;
        const response = await api.post('/vault/folders/', payload);
        return response.data;
    },

    // Delete Folder
    deleteFolder: async (id) => {
        const response = await api.delete(`/vault/folders/${id}/`);
        return response.data;
    },

    // List documents (filtered by user role on backend)
    list: async (folderId = null) => {
        const url = folderId ? `/vault/documents/?folder_id=${folderId}` : '/vault/documents/';
        const response = await api.get(url);
        return response.data;
    },

    // Create a document request (Consultant only)
    createRequest: async (clientId, title, description, folderId = null) => {
        const response = await api.post('/vault/documents/', {
            client: clientId,
            title,
            description,
            folder: folderId
        });
        return response.data;
    },

    // Client proactively uploads a file
    uploadProactive: async (formData) => {
        // formData can include 'folder' field
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

    // ========== Legal & Notices ==========

    listLegalNotices: async () => {
        const response = await api.get('/vault/legal-notices/');
        return response.data;
    },

    createLegalNotice: async (formData) => {
        const response = await api.post('/vault/legal-notices/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    toggleNoticeResolved: async (id) => {
        const response = await api.post(`/vault/legal-notices/${id}/resolve/`);
        return response.data;
    },

    deleteLegalNotice: async (id) => {
        const response = await api.delete(`/vault/legal-notices/${id}/`);
        return response.data;
    },
};
