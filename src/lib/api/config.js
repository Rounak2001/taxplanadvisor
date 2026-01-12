// API Configuration for TaxPlan Advisor Django Backend
export const API_BASE_URL = 'https://api.taxplanadvisor.co/api';

// Auth token management
const TOKEN_KEY = 'taxplan_auth_token';
const USER_KEY = 'taxplan_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

// Default headers for API requests
export const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request handler
export async function apiRequest(endpoint, options = {}) {
  const { includeAuth = true, ...fetchOptions } = options;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...getHeaders(includeAuth),
      ...fetchOptions.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.detail || errorData.message || 'Request failed', errorData);
  }
  
  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}
