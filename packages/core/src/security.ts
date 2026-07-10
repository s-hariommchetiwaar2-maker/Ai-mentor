import { pbkdf2Sync, randomBytes, createHmac } from 'crypto';

// -----------------------------------------------------------------------------
// Core Encryption and Security Utilities
// -----------------------------------------------------------------------------

export interface PasswordHash {
  hash: string;
  salt: string;
}

const ITERATIONS = 100000;
const HASH_LENGTH = 64;
const DIGEST = 'sha512';
const SECRET_SIGN_KEY = process.env.JWT_SECRET || 'fallback-super-secure-hmac-signing-key-32-chars';

/**
 * Hashes a plaintext password using PBKDF2 with 100,000 iterations.
 */
export function hashPassword(password: string, salt?: string): PasswordHash {
  const finalSalt = salt || randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, finalSalt, ITERATIONS, HASH_LENGTH, DIGEST).toString('hex');
  return { hash, salt: finalSalt };
}

/**
 * Verifies a plaintext password against a stored hash and salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const result = hashPassword(password, salt);
  return result.hash === hash;
}

// -----------------------------------------------------------------------------
// JWT Token Simulation with Cryptographic HMAC Signature
// -----------------------------------------------------------------------------

export interface UserSession {
  userId: string;
  role: 'student' | 'mentor' | 'admin';
  email: string;
  exp: number;
}

/**
 * Generates a mock JWT/Token session with an HMAC SHA256 signature to prevent tampering.
 */
export function generateToken(payload: Omit<UserSession, 'exp'>, expiresInHours = 24): string {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const session: UserSession = { ...payload, exp };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(session)).toString('base64url');

  // Create cryptographic HMAC-SHA256 signature
  const hmac = createHmac('sha256', SECRET_SIGN_KEY);
  hmac.update(`${header}.${body}`);
  const signature = hmac.digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Decodes and cryptographically verifies a simulated JWT token.
 */
export function verifyToken(token: string): UserSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    // Cryptographically verify signature
    const hmac = createHmac('sha256', SECRET_SIGN_KEY);
    hmac.update(`${header}.${body}`);
    const expectedSignature = hmac.digest('base64url');

    if (signature !== expectedSignature) {
      console.warn('[Security Warning] Token signature verification failed! Tampering detected.');
      return null;
    }

    const decodedBody = Buffer.from(body, 'base64url').toString('utf-8');
    const session: UserSession = JSON.parse(decodedBody);

    if (Date.now() > session.exp) {
      return null; // Expired
    }
    return session;
  } catch {
    return null; // Invalid token
  }
}
