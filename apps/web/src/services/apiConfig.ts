/**
 * Production-ready API centralized configuration.
 * Reads endpoints and keys dynamically from loaded environment variables.
 */
export const API_CONFIG = {
  baseUrl: (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL)
    || 'https://api.govportal.org/v1',
  apiKey: (typeof process !== 'undefined' && process.env && process.env.API_KEY)
    || 'dummy-civic-gateway-token-placeholder',
};
