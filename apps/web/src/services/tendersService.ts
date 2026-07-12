import { TenderListing } from '../types/index.js';
import { MOCK_TENDERS } from '../data/mockData.js';

export const tendersService = {
  /**
   * Simulates fetching of Tender listings from a REST API endpoint.
   * Resolves asynchronously to prepare the application for real production backend connections.
   */
  async fetchTenders(): Promise<TenderListing[]> {
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, tenderId });
      }, 100);
    });
  },
};
