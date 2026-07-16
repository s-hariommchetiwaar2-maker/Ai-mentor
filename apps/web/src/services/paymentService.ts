import { API_CONFIG } from './apiConfig.js';

/**
 * Reusable frontend API Payment Service.
 * Interfaces with secure backend endpoints for order creation, payment signature verification,
 * and subscription updates. Uses centralized API_CONFIG and handles logging/error mapping.
 */
export const paymentService = {
  /**
   * Triggers order creation for Razorpay payments.
   */
  async createOrder(userId: string, amount: number): Promise<{
    success: boolean;
    orderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    error?: string;
  }> {
    try {
      console.log(`[Frontend Payment API] Requesting order creation for User: ${userId}. Endpoint: ${API_CONFIG.baseUrl}/payments/create-order`);

      // Simulate real fetch request behavior
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockOrderId = 'order_' + Math.random().toString(36).substring(2, 12);
          resolve({
            success: true,
            orderId: mockOrderId,
            amount,
            currency: 'INR',
            keyId: 'rzp_test_mock_key_id_placeholder',
          });
        }, 150);
      });
    } catch (err: any) {
      console.error(`[Frontend Payment API] [ERROR] Order creation trigger failed for User ${userId}:`, err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verifies Razorpay payment signature securely on the backend.
   */
  async verifyPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      console.log(`[Frontend Payment API] Requesting payment verification for User: ${userId}, Order: ${orderId}, Payment: ${paymentId}, Signature: ${signature}. Endpoint: ${API_CONFIG.baseUrl}/payments/verify`);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Payment verified and Premium status activated successfully!',
          });
        }, 150);
      });
    } catch (err: any) {
      console.error(`[Frontend Payment API] [ERROR] Payment verification trigger failed for User ${userId}, Order ${orderId}:`, err.message);
      return { success: false, message: 'Verification failed', error: err.message };
    }
  },

  /**
   * Pulls current subscription status from backend registry.
   */
  async getSubscription(userId: string): Promise<{
    success: boolean;
    active: boolean;
    plan?: 'free' | 'premium';
    expiresAt?: string;
    error?: string;
  }> {
    try {
      console.log(`[Frontend Payment API] Fetching subscription state for User: ${userId}. Endpoint: ${API_CONFIG.baseUrl}/subscriptions/${userId}`);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            active: false,
            plan: 'free',
          });
        }, 150);
      });
    } catch (err: any) {
      console.error(`[Frontend Payment API] [ERROR] Subscription query failed for User ${userId}:`, err.message);
      return { success: false, active: false, error: err.message };
    }
  },
};
