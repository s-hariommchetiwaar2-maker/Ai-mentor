import { db, User, Profile } from './database.js';
import { hashPassword, verifyPassword, generateToken } from './security.js';

// -----------------------------------------------------------------------------
// Authentication Service Logic
// -----------------------------------------------------------------------------

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    fullName: string;
    isVerified: boolean;
  };
}

export class AuthService {
  /**
   * Registers a brand new user and user profile.
   */
  static signUp(
    email: string,
    password: string,
    fullName: string,
    role: 'student' | 'mentor' | 'admin' = 'student'
  ): AuthResponse {
    // Check if user already exists
    if (db.findUserByEmail(email)) {
      return { success: false, message: 'Email already registered.' };
    }

    // Hash the password securely
    const { hash, salt } = hashPassword(password);
    const userId = 'u-' + Math.random().toString(36).substring(2, 9);
    const profileId = 'p-' + Math.random().toString(36).substring(2, 9);

    // Create verification token
    const verificationToken =
      'token-' + Math.random().toString(36).substring(2, 15);

    const newUser: User = {
      id: userId,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      role,
      isVerified: false,
      rememberMe: false,
      verificationToken,
    };

    const newProfile: Profile = {
      id: profileId,
      userId,
      fullName,
      createdAt: new Date().toISOString(),
    };

    db.saveUser(newUser);
    db.saveProfile(newProfile);

    // Generate Verification Token URL simulator
    console.log(
      `[Simulator Service] Verification Email sent to ${email}. Token URL: http://localhost:3000/verify-email?token=${verificationToken}`
    );

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
      user: {
        id: userId,
        email,
        role,
        fullName,
        isVerified: false,
      },
    };
  }

  /**
   * Authenticates a user with email and password.
   */
  static login(
    email: string,
    password: string,
    rememberMe = false
  ): AuthResponse {
    const user = db.findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const isValid = verifyPassword(
      password,
      user.passwordHash,
      user.passwordSalt
    );
    if (!isValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (!user.isVerified) {
      return {
        success: false,
        message: 'Please verify your email address before logging in.',
      };
    }

    user.rememberMe = rememberMe;
    db.saveUser(user);

    const profile = db.findProfileByUserId(user.id);
    const fullName = profile ? profile.fullName : 'AI User';

    // Generate JWT/Token session
    const expiryHours = rememberMe ? 720 : 24; // 30 days vs 1 day
    const token = generateToken(
      { userId: user.id, email: user.email, role: user.role },
      expiryHours
    );

    return {
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName,
        isVerified: user.isVerified,
      },
    };
  }

  /**
   * Initiates forgot password flow, generating reset token.
   */
  static forgotPassword(email: string): AuthResponse {
    const user = db.findUserByEmail(email);
    if (!user) {
      // Security best practice: don't reveal if user exists, but here we can return success with simulated message
      return {
        success: true,
        message: 'If this email is registered, a recovery link has been sent.',
      };
    }

    const resetToken = 'reset-' + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExp = Date.now() + 60 * 60 * 1000; // 1 hour expiration
    db.saveUser(user);

    console.log(
      `[Simulator Service] Password recovery Email sent to ${email}. Recovery URL: http://localhost:3000/reset-password?token=${resetToken}`
    );

    return {
      success: true,
      message: 'If this email is registered, a recovery link has been sent.',
    };
  }

  /**
   * Resets password using valid reset token.
   */
  static resetPassword(token: string, newPassword: string): AuthResponse {
    const user = db.getUsers().find((u) => u.resetToken === token);
    if (!user || !user.resetTokenExp || Date.now() > user.resetTokenExp) {
      return {
        success: false,
        message: 'Password recovery token is invalid or has expired.',
      };
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    db.saveUser(user);

    return {
      success: true,
      message: 'Your password has been successfully reset. You can now login.',
    };
  }

  /**
   * Verifies user email via token.
   */
  static verifyEmail(token: string): AuthResponse {
    const user = db.getUsers().find((u) => u.verificationToken === token);
    if (!user) {
      return { success: false, message: 'Invalid verification token.' };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    db.saveUser(user);

    return {
      success: true,
      message: 'Email successfully verified! You can now log in.',
    };
  }

  /**
   * Simulates OAuth flow with Google
   */
  static googleLoginPlaceholder(): AuthResponse {
    const token = generateToken({
      userId: 'u-google',
      email: 'google.user@gmail.com',
      role: 'student',
    });
    return {
      success: true,
      message: 'Successfully authenticated with Google.',
      token,
      user: {
        id: 'u-google',
        email: 'google.user@gmail.com',
        role: 'student',
        fullName: 'Google Authenticated User',
        isVerified: true,
      },
    };
  }
}
