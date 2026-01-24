import api from './axios';

const GST_BASE = '/gst';

export const gstService = {
  // ==================== Authentication ====================
  generateOTP: async (gstin, username) => {
    const response = await api.post(`${GST_BASE}/auth/generate-otp/`, { gstin, username });
    return response.data;
  },

  verifyOTP: async (sessionId, otp, username) => {
    const response = await api.post(`${GST_BASE}/auth/verify-otp/`, {
      session_id: sessionId,
      otp,
      username
    });
    return response.data;
  },

  getSessionStatus: async (sessionId) => {
    const response = await api.get(`${GST_BASE}/auth/session-status/`, {
      params: { session_id: sessionId }
    });
    return response.data;
  },

  // ==================== Downloads ====================
  downloadGSTR1: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/download/gstr1/`, {
      session_id: sessionId,
      ...params
    }, {
      responseType: 'blob'
    });
    return response;
  },

  downloadGSTR2B: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/download/gstr2b/`, {
      session_id: sessionId,
      ...params
    }, {
      responseType: 'blob'
    });
    return response;
  },

  downloadGSTR2A: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/download/gstr2a/`, {
      session_id: sessionId,
      ...params
    }, {
      responseType: 'blob'
    });
    return response;
  },

  downloadGSTR3B: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/download/gstr3b/`, {
      session_id: sessionId,
      ...params
    }, {
      responseType: 'blob'
    });
    return response;
  },

  // ==================== Reconciliations ====================

  // Comprehensive Reconciliation (GSTR-1 vs GSTR-3B vs GSTR-2B)
  reconcileComprehensive: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/reconcile/comprehensive/`, {
      session_id: sessionId,
      ...params
    });
    return response.data;
  },

  // GSTR-1 vs GSTR-3B Reconciliation
  reconcile1vs3b: async (sessionId, params) => {
    const response = await api.post(`${GST_BASE}/reconcile/1vs3b/`, {
      session_id: sessionId,
      ...params
    });
    return response.data;
  },

  // GSTR-1 vs Books Reconciliation
  reconcile1vsBooks: async (sessionId, formData) => {
    formData.append('session_id', sessionId);
    const response = await api.post(`${GST_BASE}/reconcile/1vsbooks/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // GSTR-3B vs Books Reconciliation
  reconcile3BvsBooks: async (sessionId, formData) => {
    formData.append('session_id', sessionId);
    const response = await api.post(`${GST_BASE}/reconcile/3bvsbooks/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // GSTR-2B vs Books Reconciliation (Portal data)
  reconcile2BvsBooks: async (sessionId, formData) => {
    formData.append('session_id', sessionId);
    const response = await api.post(`${GST_BASE}/reconcile/2bvsbooks/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // GSTR-2B vs Books Manual Reconciliation (Uploaded files)
  reconcile2BManual: async (formData, exportExcel = false) => {
    const url = exportExcel
      ? `${GST_BASE}/reconcile/2b-manual/?export=excel`
      : `${GST_BASE}/reconcile/2b-manual/`;
    const config = exportExcel
      ? { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' }
      : { headers: { 'Content-Type': 'multipart/form-data' } };

    const response = await api.post(url, formData, config);
    return exportExcel ? response : response.data;
  },

  // ==================== Download Reconciliation Results ====================

  downloadReco1vs3b: async (params) => {
    const response = await api.post(`${GST_BASE}/download/reco-1vs3b/`, params, {
      responseType: 'blob'
    });
    return response;
  },

  downloadReco1vsBooks: async (params) => {
    const response = await api.post(`${GST_BASE}/download/reco-1vsbooks/`, params, {
      responseType: 'blob'
    });
    return response;
  },

  downloadReco3BvsBooks: async (params) => {
    const response = await api.post(`${GST_BASE}/download/reco-3bvsbooks/`, params, {
      responseType: 'blob'
    });
    return response;
  },

  // ==================== Cache Management ====================
  clearCache: async () => {
    const response = await api.post(`${GST_BASE}/cache/clear/`);
    return response.data;
  },

  // ==================== Client Management ====================
  getClients: async () => {
    const response = await api.get('/consultant/clients/');
    return response.data;
  },

  getClientProfile: async () => {
    const response = await api.get('/client/profile/');
    return response.data;
  }
};