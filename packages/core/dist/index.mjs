// src/database.ts
var MockDatabase = class {
  users = /* @__PURE__ */ new Map();
  profiles = /* @__PURE__ */ new Map();
  constructor() {
    this.seed();
  }
  seed() {
    const salt1 = "seedsalt1";
    const salt2 = "seedsalt2";
    const salt3 = "seedsalt3";
    this.users.set("u-admin", {
      id: "u-admin",
      email: "admin@aimentor.com",
      passwordHash: "beed170d3e5951bec84c2d7831437ff2e47dd035ab03fc6c54e3daf2effd7db638ed5ebccdcd9bd4a6a2fcee28effbac67f55f4f7453c1d9a745468a525e7150",
      passwordSalt: salt1,
      role: "admin",
      isVerified: true,
      rememberMe: false
    });
    this.profiles.set("p-admin", {
      id: "p-admin",
      userId: "u-admin",
      fullName: "System Administrator",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.users.set("u-mentor", {
      id: "u-mentor",
      email: "mentor@aimentor.com",
      passwordHash: "445d1a262449acefbae8f7bfc41e062b8a9377de1a85fb262043b084d79609f079676597798ffb46c18d26cce17ba042892a3ebb8be2cc802e16ca5eeb0e1778",
      passwordSalt: salt2,
      role: "mentor",
      isVerified: true,
      rememberMe: false
    });
    this.profiles.set("p-mentor", {
      id: "p-mentor",
      userId: "u-mentor",
      fullName: "Expert Mentor",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.users.set("u-student", {
      id: "u-student",
      email: "student@aimentor.com",
      passwordHash: "d2219598b72426d7f933d82f4e6df889148d6fb9c8941036e9b863eddcff7b8654e9b0925bb87ab28261c9b1715827e7c4be42869775380ae5902315ff9a5968",
      passwordSalt: salt3,
      role: "student",
      isVerified: true,
      rememberMe: false
    });
    this.profiles.set("p-student", {
      id: "p-student",
      userId: "u-student",
      fullName: "Active Student",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  getUsers() {
    return Array.from(this.users.values());
  }
  findUserByEmail(email) {
    return this.getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }
  findUserById(id) {
    return this.users.get(id);
  }
  saveUser(user) {
    this.users.set(user.id, user);
    return user;
  }
  getProfiles() {
    return Array.from(this.profiles.values());
  }
  findProfileByUserId(userId) {
    return this.getProfiles().find((p) => p.userId === userId);
  }
  saveProfile(profile) {
    this.profiles.set(profile.id, profile);
    return profile;
  }
  clear() {
    this.users.clear();
    this.profiles.clear();
    this.seed();
  }
};
var db = new MockDatabase();

// src/security.ts
import { pbkdf2Sync, randomBytes, createHmac } from "crypto";
var ITERATIONS = 1e5;
var HASH_LENGTH = 64;
var DIGEST = "sha512";
var SECRET_SIGN_KEY = process.env.JWT_SECRET || "fallback-super-secure-hmac-signing-key-32-chars";
function hashPassword(password, salt) {
  const finalSalt = salt || randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    password,
    finalSalt,
    ITERATIONS,
    HASH_LENGTH,
    DIGEST
  ).toString("hex");
  return { hash, salt: finalSalt };
}
function verifyPassword(password, hash, salt) {
  const result = hashPassword(password, salt);
  return result.hash === hash;
}
function generateToken(payload, expiresInHours = 24) {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1e3;
  const session = { ...payload, exp };
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  const hmac = createHmac("sha256", SECRET_SIGN_KEY);
  hmac.update(`${header}.${body}`);
  const signature = hmac.digest("base64url");
  return `${header}.${body}.${signature}`;
}
function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const hmac = createHmac("sha256", SECRET_SIGN_KEY);
    hmac.update(`${header}.${body}`);
    const expectedSignature = hmac.digest("base64url");
    if (signature !== expectedSignature) {
      console.warn(
        "[Security Warning] Token signature verification failed! Tampering detected."
      );
      return null;
    }
    const decodedBody = Buffer.from(body, "base64url").toString("utf-8");
    const session = JSON.parse(decodedBody);
    if (Date.now() > session.exp) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

// src/auth-service.ts
var AuthService = class {
  /**
   * Registers a brand new user and user profile.
   */
  static signUp(email, password, fullName, role = "student") {
    if (db.findUserByEmail(email)) {
      return { success: false, message: "Email already registered." };
    }
    const { hash, salt } = hashPassword(password);
    const userId = "u-" + Math.random().toString(36).substring(2, 9);
    const profileId = "p-" + Math.random().toString(36).substring(2, 9);
    const verificationToken = "token-" + Math.random().toString(36).substring(2, 15);
    const newUser = {
      id: userId,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      role,
      isVerified: false,
      rememberMe: false,
      verificationToken
    };
    const newProfile = {
      id: profileId,
      userId,
      fullName,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.saveUser(newUser);
    db.saveProfile(newProfile);
    console.log(
      `[Simulator Service] Verification Email sent to ${email}. Token URL: http://localhost:3000/verify-email?token=${verificationToken}`
    );
    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        id: userId,
        email,
        role,
        fullName,
        isVerified: false
      }
    };
  }
  /**
   * Authenticates a user with email and password.
   */
  static login(email, password, rememberMe = false) {
    const user = db.findUserByEmail(email);
    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }
    const isValid = verifyPassword(
      password,
      user.passwordHash,
      user.passwordSalt
    );
    if (!isValid) {
      return { success: false, message: "Invalid email or password." };
    }
    if (!user.isVerified) {
      return {
        success: false,
        message: "Please verify your email address before logging in."
      };
    }
    user.rememberMe = rememberMe;
    db.saveUser(user);
    const profile = db.findProfileByUserId(user.id);
    const fullName = profile ? profile.fullName : "AI User";
    const expiryHours = rememberMe ? 720 : 24;
    const token = generateToken(
      { userId: user.id, email: user.email, role: user.role },
      expiryHours
    );
    return {
      success: true,
      message: "Logged in successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName,
        isVerified: user.isVerified
      }
    };
  }
  /**
   * Initiates forgot password flow, generating reset token.
   */
  static forgotPassword(email) {
    const user = db.findUserByEmail(email);
    if (!user) {
      return {
        success: true,
        message: "If this email is registered, a recovery link has been sent."
      };
    }
    const resetToken = "reset-" + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExp = Date.now() + 60 * 60 * 1e3;
    db.saveUser(user);
    console.log(
      `[Simulator Service] Password recovery Email sent to ${email}. Recovery URL: http://localhost:3000/reset-password?token=${resetToken}`
    );
    return {
      success: true,
      message: "If this email is registered, a recovery link has been sent."
    };
  }
  /**
   * Resets password using valid reset token.
   */
  static resetPassword(token, newPassword) {
    const user = db.getUsers().find((u) => u.resetToken === token);
    if (!user || !user.resetTokenExp || Date.now() > user.resetTokenExp) {
      return {
        success: false,
        message: "Password recovery token is invalid or has expired."
      };
    }
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.resetToken = void 0;
    user.resetTokenExp = void 0;
    db.saveUser(user);
    return {
      success: true,
      message: "Your password has been successfully reset. You can now login."
    };
  }
  /**
   * Verifies user email via token.
   */
  static verifyEmail(token) {
    const user = db.getUsers().find((u) => u.verificationToken === token);
    if (!user) {
      return { success: false, message: "Invalid verification token." };
    }
    user.isVerified = true;
    user.verificationToken = void 0;
    db.saveUser(user);
    return {
      success: true,
      message: "Email successfully verified! You can now log in."
    };
  }
  /**
   * Simulates OAuth flow with Google
   */
  static googleLoginPlaceholder() {
    const token = generateToken({
      userId: "u-google",
      email: "google.user@gmail.com",
      role: "student"
    });
    return {
      success: true,
      message: "Successfully authenticated with Google.",
      token,
      user: {
        id: "u-google",
        email: "google.user@gmail.com",
        role: "student",
        fullName: "Google Authenticated User",
        isVerified: true
      }
    };
  }
};

// src/index.ts
function greetUser(user) {
  return `Welcome back, ${user.name}! Your role is: ${user.role}.`;
}
var API_VERSION = "v1";
export {
  API_VERSION,
  AuthService,
  db,
  generateToken,
  greetUser,
  hashPassword,
  verifyPassword,
  verifyToken
};
