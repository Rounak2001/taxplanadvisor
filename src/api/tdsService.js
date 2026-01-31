import api from './axios';

const TDS_BASE = '/tds';

export const tdsApi = {
    /**
     * Calculate bulk TDS from uploaded Excel file
     */
    async calculateBulkTDS(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`${TDS_BASE}/calculate/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Download sample Excel template
     */
    async downloadTemplate() {
        const response = await api.get(`${TDS_BASE}/template/`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TDS_Template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    /**
     * Download calculation results as Excel
     */
    async downloadResults(results) {
        const response = await api.post(`${TDS_BASE}/download-results/`, { results }, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TDS_Calculation_Results.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    /**
     * Get TDS section reference data
     */
    async getBulkSections() {
        const response = await api.get(`${TDS_BASE}/sections/`);
        return response.data;
    },

    // ================= Individual Calculator Methods =================

    /**
     * Get all TDS sections for dropdown (Individual Calculator)
     */
    async getSections() {
        const response = await api.get('/calculator/sections/');
        return response.data;
    },

    /**
     * Calculate TDS for one or more transactions (Individual Calculator)
     */
    async calculateTDS(deductor, transactions) {
        const response = await api.post('/calculator/calculate/', {
            deductor,
            transactions
        });
        return response.data;
    },

    /**
     * Download Excel report for TDS calculations (Individual Calculator)
     */
    async downloadExcel(deductor, results) {
        const response = await api.post('/calculator/generate-excel/', {
            deductor,
            results
        }, {
            responseType: 'blob'
        });

        // Create filename from entity name or default
        const filename = deductor?.entity_name
            ? `TDS_Computation_${deductor.entity_name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`
            : 'TDS_Computation_Report.xlsx';

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};

export default tdsApi;
