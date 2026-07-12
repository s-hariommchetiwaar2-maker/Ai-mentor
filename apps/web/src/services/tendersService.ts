import { TenderListing } from '../types/index.js';
import { MOCK_TENDERS } from '../data/mockData.js';
import { API_CONFIG } from './apiConfig.js';

export const tendersService = {
  /**
   * Simulates fetching of Tender listings from a REST API endpoint.
   * Resolves asynchronously to prepare the application for real production backend connections.
   */
  async fetchTenders(): Promise<TenderListing[]> {
    console.log(`[API integration] Fetching tenders from endpoint: ${API_CONFIG.baseUrl}/tenders`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_TENDERS]);
      }, 100);
    });
  },

  /**
   * Simulates placing a procurement bid.
   */
  async placeBid(tenderId: string): Promise<{ success: boolean; tenderId: string }> {
    console.log(`[API integration] Submitting procurement bid to endpoint: ${API_CONFIG.baseUrl}/tenders/${tenderId}/bid`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, tenderId });
      }, 100);
    });
  },
};
