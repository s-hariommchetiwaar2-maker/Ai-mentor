interface User {
    id: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    role: 'student' | 'mentor' | 'admin';
    isVerified: boolean;
    rememberMe: boolean;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExp?: number;
}
interface Profile {
    id: string;
    userId: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    createdAt: string;
}
declare class MockDatabase {
    private users;
    private profiles;
    constructor();
    private seed;
    getUsers(): User[];
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    saveUser(user: User): User;
    getProfiles(): Profile[];
    findProfileByUserId(userId: string): Profile | undefined;
    saveProfile(profile: Profile): Profile;
    clear(): void;
}
declare const db: MockDatabase;

interface PasswordHash {
    hash: string;
    salt: string;
}
/**
 * Hashes a plaintext password using PBKDF2 with 100,000 iterations.
 */
declare function hashPassword(password: string, salt?: string): PasswordHash;
/**
 * Verifies a plaintext password against a stored hash and salt.
 */
declare function verifyPassword(password: string, hash: string, salt: string): boolean;
interface UserSession {
    userId: string;
    role: 'student' | 'mentor' | 'admin';
    email: string;
    exp: number;
}
/**
 * Generates a mock JWT/Token session with an HMAC SHA256 signature to prevent tampering.
 */
declare function generateToken(payload: Omit<UserSession, 'exp'>, expiresInHours?: number): string;
/**
 * Decodes and cryptographically verifies a simulated JWT token.
 */
declare function verifyToken(token: string): UserSession | null;

interface AuthResponse {
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
declare class AuthService {
    /**
     * Registers a brand new user and user profile.
     */
    static signUp(email: string, password: string, fullName: string, role?: 'student' | 'mentor' | 'admin'): AuthResponse;
    /**
     * Authenticates a user with email and password.
     */
    static login(email: string, password: string, rememberMe?: boolean): AuthResponse;
    /**
     * Initiates forgot password flow, generating reset token.
     */
    static forgotPassword(email: string): AuthResponse;
    /**
     * Resets password using valid reset token.
     */
    static resetPassword(token: string, newPassword: string): AuthResponse;
    /**
     * Verifies user email via token.
     */
    static verifyEmail(token: string): AuthResponse;
    /**
     * Simulates OAuth flow with Google
     */
    static googleLoginPlaceholder(): AuthResponse;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
}
declare function greetUser(user: UserProfile): string;
declare const API_VERSION = "v1";

export { API_VERSION, type AuthResponse, AuthService, type PasswordHash, type Profile, type User, type UserProfile, type UserSession, db, generateToken, greetUser, hashPassword, verifyPassword, verifyToken };
