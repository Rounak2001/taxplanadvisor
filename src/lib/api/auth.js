// Authentication API - TaxPlan Advisor
import { 
  apiRequest, 
  setAuthToken, 
  removeAuthToken, 
  setStoredUser, 
  removeStoredUser,
  getStoredUser,
  getAuthToken 
} from './config';

/**
 * Login for both consultant and client
 * POST /auth/login/
 */
export async function login(email, password) {
  const response = await apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    includeAuth: false,
  });
  
  if (response.token) {
    setAuthToken(response.token);
    setStoredUser(response.user || { email });
  }
  
  return response;
}

/**
 * Register a new consultant
 * POST /auth/consultant/register/
 */
export async function registerConsultant(data) {
  const response = await apiRequest('/auth/consultant/register/', {
    method: 'POST',
    body: JSON.stringify(data),
    includeAuth: false,
  });
  
  if (response.token) {
    setAuthToken(response.token);
    setStoredUser(response.user || { email: data.email, role: 'consultant' });
  }
  
  return response;
}

/**
 * Logout - clear local storage
 */
export function logout() {
  removeAuthToken();
  removeStoredUser();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Get current user from storage
 */
export function getCurrentUser() {
  return getStoredUser();
}

/**
 * Get client dashboard data (for logged in clients)
 * GET /auth/client/dashboard/
 */
export async function getClientDashboard() {
  return apiRequest('/auth/client/dashboard/');
}

/**
 * Get consultant's view of a specific client dashboard
 * GET /auth/consultant/client/{client_id}/dashboard/
 */
export async function getConsultantClientDashboard(clientId) {
  return apiRequest(`/auth/consultant/client/${clientId}/dashboard/`);
}
