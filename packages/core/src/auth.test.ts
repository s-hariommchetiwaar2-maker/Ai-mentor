import assert from 'assert';
import { AuthService } from './auth-service.js';
import { db } from './database.js';

function runTests() {
  console.log('Running AI Mentor Authentication Tests...');

  // Reset database state
  db.clear();

  // Test 1: SignUp requires email verification
  const signUpRes = AuthService.signUp(
    'test@user.com',
    'securepass123',
    'John Doe',
    'student'
  );
  assert.strictEqual(signUpRes.success, true, 'Sign up should succeed');
  assert.strictEqual(signUpRes.user?.email, 'test@user.com');
  assert.strictEqual(
    signUpRes.user?.isVerified,
    false,
    'User should be unverified initially'
  );

  // Login should be blocked for unverified users
  const loginBlocked = AuthService.login('test@user.com', 'securepass123');
  assert.strictEqual(
    loginBlocked.success,
    false,
    'Login should be blocked for unverified users'
  );
  assert.match(
    loginBlocked.message,
    /verify your email/,
    'Should return verify email message'
  );

  // Test 2: Verification enables successful login
  const user = db.findUserByEmail('test@user.com');
  assert.ok(user, 'User should be found in db');

  const verifyRes = AuthService.verifyEmail(user.verificationToken!);
  assert.strictEqual(verifyRes.success, true, 'Verification should succeed');

  const loginRes = AuthService.login('test@user.com', 'securepass123');
  assert.strictEqual(
    loginRes.success,
    true,
    'Login should succeed after verification'
  );
  assert.ok(loginRes.token, 'A valid token should be generated');
  assert.strictEqual(loginRes.user?.fullName, 'John Doe');
  assert.strictEqual(loginRes.user?.role, 'student');

  // Test 3: Password Recovery
  const forgotRes = AuthService.forgotPassword('test@user.com');
  assert.strictEqual(forgotRes.success, true);

  const userWithReset = db.findUserByEmail('test@user.com');
  assert.ok(userWithReset?.resetToken, 'Reset token should exist');

  const resetRes = AuthService.resetPassword(
    userWithReset.resetToken!,
    'newpassword123'
  );
  assert.strictEqual(resetRes.success, true, 'Password reset should succeed');

  const loginWithNew = AuthService.login('test@user.com', 'newpassword123');
  assert.strictEqual(
    loginWithNew.success,
    true,
    'Login with new password should succeed'
  );

  console.log('✓ All AI Mentor Authentication Tests Passed successfully!');
}

try {
  runTests();
} catch (error) {
  console.error('✗ Test failed:', error);
  process.exit(1);
}
