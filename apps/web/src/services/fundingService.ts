import { FundingScheme } from '../types/index.js';
import { MOCK_FUNDING } from '../data/mockData.js';
import { API_CONFIG } from './apiConfig.js';

export const fundingService = {
  /**
   * Simulates fetching of Funding Schemes from a REST API endpoint.
   * Resolves asynchronously to prepare the application for real production backend connections.
   */
  async fetchFunding(): Promise<FundingScheme[]> {
    console.log(`[API integration] Fetching funding schemes from endpoint: ${API_CONFIG.baseUrl}/funding`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_FUNDING]);
      }, 100);
    });
  },

  /**
   * Simulates applying for a specific grant/subsidy scheme.
   */
  async applyScheme(fundId: string): Promise<{ success: boolean; fundId: string }> {
    console.log(`[API integration] Submitting grant application to endpoint: ${API_CONFIG.baseUrl}/funding/${fundId}/apply`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, fundId });
      }, 100);
    });
  },
};
