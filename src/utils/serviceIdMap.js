// Service ID mapping utility
// Maps service titles to their database IDs from the consultants app

export const SERVICE_ID_MAP = {
    // Income Tax
    "Capital Gains Tax Planning": null, // Parent service with variants
    "Reinvestment Planning as per IT Act": 1,
    "Property Revaluation": null, // Needs ID
    "Income Tax E-Filing": 2,
    "Business Tax Filing": 3,
    "Partnership Firm / LLP ITR": 4,
    "Company ITR Filing": 5,
    "Trust / NGO Tax Filing": 6,
    "15CA - 15CB Filing": 7,
    "TAN Registration": 8,
    "TDS Return Filing": 9,
    "Revised ITR Return (ITR-U)": 10,

    // GST
    "GST Registration": 11,
    "GST Return Filing": 12,
    "GST Annual Return": 13,
    "GST Refund Claim": 14,
    "GST Cancellation": 15,
    "GST Amendment": 16,
    "E-Way Bill Generation": 17,
    "GST Audit": 18,
    "GST LUT Filing": 19,

    // Registration
    "PAN Registration": 20,
    "Aadhaar-PAN Linking": 21,
    "Udyam Registration (MSME)": 22,
    "Import Export Code (IEC)": 23,
    "FSSAI License": 24,
    "Shop Act License": 25,
    "Professional Tax Registration": 26,
    "ESI Registration": 27,
    "PF Registration": 28,

    // Compliance
    "ROC Annual Filing": 29,
    "DIR-3 KYC Filing": 30,
    "MCA Compliance": 31,
    "Statutory Audit": 32,
    "Internal Audit": 33,
    "Tax Audit": 34,
    "GST Audit": 35,
    "Secretarial Audit": 36,
    "Stock Audit": 37,

    // Startup & Advisory
    "Sole Proprietorship Registration": 38,
    "Partnership Firm Registration": 39,
    "LLP Registration": 40,
    "Private Limited Company": 41,
    "One Person Company (OPC)": 42,
    "Section 8 Company (NGO)": 43,
    "Nidhi Company": 44,
    "Producer Company": 45,
    "Business Plan Preparation": 46,
    "Financial Projections": 47,
    "Pitch Deck Creation": 48,
    "Startup India Registration": 49,
    "Trademark Registration": 50,
    "Copyright Registration": 51,
    "Patent Filing": 52,

    // Accounting
    "Monthly Bookkeeping": 53,
    "Payroll Processing": 54,
    "Financial Statement Preparation": 55,
    "MIS Reporting": 56,
    "Budgeting & Forecasting": 57,
};

/**
 * Get service ID by title
 * @param {string} title - Service title
 * @param {string} variantName - Optional variant name
 * @returns {number|null} Service ID or null if not found
 */
export function getServiceId(title, variantName = null) {
    // If variant exists, try to match variant name first
    if (variantName) {
        const variantId = SERVICE_ID_MAP[variantName];
        if (variantId) return variantId;
    }

    // Otherwise match by title
    return SERVICE_ID_MAP[title] || null;
}
