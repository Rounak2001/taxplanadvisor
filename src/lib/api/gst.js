// GST API - TaxPlan Advisor
import { apiRequest, API_BASE_URL, getHeaders } from './config';

/**
 * Generate GST OTP for authentication
 * POST /gst-auth/generate-otp/
 */
export async function generateGstOtp(gstin, username) {
  return apiRequest('/gst-auth/generate-otp/', {
    method: 'POST',
    body: JSON.stringify({ gstin, username }),
  });
}

/**
 * Verify GST OTP
 * POST /gst-auth/verify-otp/
 */
export async function verifyGstOtp(gstin, otp) {
  return apiRequest('/gst-auth/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ gstin, otp }),
  });
}

/**
 * Reconcile GSTR2A vs Books
 * POST /gstr/reconcile/
 */
export async function reconcileGstr(data) {
  return apiRequest('/gstr/reconcile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Download GSTR reconciliation as Excel
 * POST /gstr/download-excel/
 */
export async function downloadGstrExcel(data) {
  const response = await fetch(`${API_BASE_URL}/gstr/download-excel/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to download Excel file');
  }
  
  return response.blob();
}

/**
 * Download GSTR3B reconciliation as Excel
 * POST /gstr/download-3b-excel/
 */
export async function downloadGstr3bExcel(data) {
  const response = await fetch(`${API_BASE_URL}/gstr/download-3b-excel/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to download Excel file');
  }
  
  return response.blob();
}

/**
 * Download GSTR1
 * POST /gstr1/download/
 */
export async function downloadGstr1(data) {
  return apiRequest('/gstr1/download/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Reconcile GSTR1 vs Books
 * POST /gstr1vsbook/reconcile/
 */
export async function reconcileGstr1VsBook(data) {
  return apiRequest('/gstr1vsbook/reconcile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Download GSTR1 vs Books as Excel
 * POST /gstr1vsbook/download-excel/
 */
export async function downloadGstr1VsBookExcel(data) {
  const response = await fetch(`${API_BASE_URL}/gstr1vsbook/download-excel/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to download Excel file');
  }
  
  return response.blob();
}

/**
 * Reconcile GSTR3B
 * POST /gstr3b/reconcile/
 */
export async function reconcileGstr3b(data) {
  return apiRequest('/gstr3b/reconcile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Download GSTR3B as Excel
 * POST /gstr3b/download-excel/
 */
export async function downloadGstr3bExcelDirect(data) {
  const response = await fetch(`${API_BASE_URL}/gstr3b/download-excel/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to download Excel file');
  }
  
  return response.blob();
}

/**
 * General reconcile endpoint
 * POST /reconcile/
 */
export async function reconcile(data) {
  return apiRequest('/reconcile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
