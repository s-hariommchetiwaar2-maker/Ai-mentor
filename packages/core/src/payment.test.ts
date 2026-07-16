import { PaymentService } from './payment-service.js';
import { db } from './database.js';
import { createHmac } from 'crypto';

console.log('Running AI Mentor Payment & Razorpay Tests...');

async function runTests() {
  try {
    const users = db.getUsers();
    const testUser = users[0];
    if (!testUser) {
      throw new Error('Database is empty, no seed users found.');
    }

    console.log(`Using test seed user: ${testUser.email} (ID: ${testUser.id})`);

    // 1. Test Order Creation
    const orderRes = await PaymentService.createOrder(testUser.id, 999);
    if (!orderRes.success || !orderRes.orderId) {
      throw new Error('Order creation test failed.');
    }
    console.log('✓ Order creation test passed. ID:', orderRes.orderId);

    // 2. Test Payment Verification (Success Scenario)
    const paymentId = 'pay_' + Math.random().toString(36).substring(2, 10);
    const secret = 'rzp_test_mock_key_secret_placeholder'; // Match default mock secret
    const payload = `${orderRes.orderId}|${paymentId}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const correctSignature = hmac.digest('hex');

    const verifyRes = await PaymentService.verifyPayment(
      testUser.id,
      orderRes.orderId,
      paymentId,
      correctSignature
    );

    if (!verifyRes.success) {
      throw new Error(`Payment verification failed: ${verifyRes.message}`);
    }
    console.log('✓ Cryptographic payment signature verification test passed.');

    // Check plan upgrade
    const subRes = await PaymentService.getSubscription(testUser.id);
    if (!subRes.success || subRes.plan !== 'premium' || !subRes.active) {
      throw new Error('Subscription status upgrade test failed.');
    }
    console.log('✓ Subscription status upgrade test passed. Plan is:', subRes.plan);

    // 3. Test Signature Mismatch Protection (Security Test)
    const badVerifyRes = await PaymentService.verifyPayment(
      testUser.id,
      orderRes.orderId,
      paymentId,
      'invalid-spoofed-signature'
    );

    if (badVerifyRes.success) {
      throw new Error('Security test failed: Spoofed signature was accepted!');
    }
    console.log('✓ Security test passed: Invalid signature was successfully blocked.');

    console.log('✓ All AI Mentor Payment Service Tests Passed successfully!\n');
  } catch (err: any) {
    console.error('❌ Payment test suite failed with error:', err.message);
    process.exit(1);
  }
}

runTests();
