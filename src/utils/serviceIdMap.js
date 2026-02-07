// Auto-generated Service ID Map
// Run: python generate_service_map.py > ../frontend/src/utils/serviceIdMap.js

export const SERVICE_ID_MAP = {
    // Capital Gains & Tax Planning
    "Filing 26QB": 52,
    "Tax Planning Consultation": 53,

    // Certification Services
    "15CA/15CB (FEMA Remittance)": 56,
    "Capital Contribution Certificate": 57,
    "Net Worth Certificate": 54,
    "Turnover Certificate": 55,

    // Compliance
    "Business Plan": 48,
    "ESI Registration": 50,
    "ESI Return Filing": 40,
    "FDI Filing with RBI": 42,
    "FLA Return Filing": 43,
    "FSSAI Renewal": 44,
    "FSSAI Return Filing": 45,
    "PF Registration": 49,
    "PF Return Filing": 39,
    "Partnership Compliance": 46,
    "Professional Tax Registration": 51,
    "Professional Tax Return Filing": 41,
    "Proprietorship Compliance": 47,

    // GST
    "GST Amendment": 15,
    "GST Annual Return Filing (GSTR-9)": 19,
    "GST LUT Form": 17,
    "GST NIL Return Filing": 14,
    "GST Registration": 11,
    "GST Registration for Foreigners": 12,
    "GST Return Filing by Accountant": 13,
    "GST Revocation": 16,
    "GSTR-10 (Final Return)": 18,

    // Income Tax
    "15CA - 15CB Filing": 7,
    "Business Tax Filing": 3,
    "Capital Gains Tax Planning": 1,
    "Company ITR Filing": 5,
    "Income Tax E-Filing": 2,
    "Partnership Firm / LLP ITR": 4,
    "Revised ITR Return (ITR-U)": 10,
    "TAN Registration": 8,
    "TDS Return Filing": 9,
    "Trust / NGO Tax Filing": 6,

    // Registration
    "DSC Signature": 22,
    "FSSAI Registration": 24,
    "IEC Certificate": 21,
    "PAN Registration (Individual/Company)": 20,
    "Startup India Registration": 23,
    "Trade License": 25,
    "Udyam Registration": 26,

    // Startup & Advisory
    "Business Structure Selection": 27,
    "Indian Subsidiary": 38,
    "Limited Liability Partnership": 32,
    "One Person Company": 31,
    "Partnership": 30,
    "Private Limited Company": 33,
    "Producer Company": 37,
    "Proprietorship": 29,
    "Public Limited Company": 36,
    "Section 8 Company": 34,
    "Startup Certificate": 28,
    "Trust Registration": 35,
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

