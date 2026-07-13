import { ContactInquiry } from '../types/index.js';

export const contactService = {
  /**
   * Simulates submitting an electronic citizen inquiry to the helpdesk.
   */
  async submitInquiry(inquiry: ContactInquiry): Promise<{ success: boolean; referenceId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate inquiry parameter usage to satisfy compiler
        const nameLength = inquiry.name.length;
        const mockRef = `TKT-${nameLength}-${Math.floor(100000 + Math.random() * 900000)}`;
        resolve({ success: true, referenceId: mockRef });
      }, 100);
    });
  },
};
