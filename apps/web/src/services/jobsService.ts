import { JobListing } from '../types/index.js';
import { MOCK_JOBS } from '../data/mockData.js';
import { API_CONFIG } from './apiConfig.js';

export const jobsService = {
  /**
   * Simulates fetching of Job listings from a REST API endpoint.
   * Resolves asynchronously to prepare the application for real production backend connections.
   */
  async fetchJobs(): Promise<JobListing[]> {
    console.log(`[API integration] Fetching jobs from endpoint: ${API_CONFIG.baseUrl}/jobs`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_JOBS]);
      }, 100);
    });
  },

  /**
   * Simulates posting or applying for a career opening.
   */
  async applyForJob(jobId: string): Promise<{ success: boolean; jobId: string }> {
    console.log(`[API integration] Submitting job application to endpoint: ${API_CONFIG.baseUrl}/jobs/${jobId}/apply`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, jobId });
      }, 100);
    });
  },
};
