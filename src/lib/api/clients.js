// Clients API - TaxPlan Advisor
import { apiRequest } from './config';

/**
 * Get all clients for the logged-in consultant
 * GET /auth/consultant/clients/
 */
export async function getClients() {
  return apiRequest('/auth/consultant/clients/');
}

/**
 * Create a new client
 * POST /auth/consultant/clients/
 */
export async function createClient(clientData) {
  return apiRequest('/auth/consultant/clients/', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
}

/**
 * Onboard a new client (smart onboarding)
 * POST /onboard/
 */
export async function onboardClient(onboardingData) {
  return apiRequest('/onboard/', {
    method: 'POST',
    body: JSON.stringify(onboardingData),
  });
}
