import { FundingScheme } from '../types/index.js';
import { MOCK_FUNDING } from '../data/mockData.js';

export const fundingService = {
  /**
   * Simulates fetching of Funding Schemes from a REST API endpoint.
   * Resolves asynchronously to prepare the application for real production backend connections.
   */
  async fetchFunding(): Promise<FundingScheme[]> {
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, fundId });
      }, 100);
    });
  },
};
