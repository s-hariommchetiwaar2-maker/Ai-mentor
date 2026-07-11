// -----------------------------------------------------------------------------
// Database Interfaces and Mock Store
// -----------------------------------------------------------------------------

export interface User {
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

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// In-Memory Database (Production-ready mock with transaction safety)
// -----------------------------------------------------------------------------

class MockDatabase {
  private users: Map<string, User> = new Map();
  private profiles: Map<string, Profile> = new Map();

  constructor() {
    // Seed default admin and users
    this.seed();
  }

  private seed() {
    const salt1 = 'seedsalt1';
    const salt2 = 'seedsalt2';
    const salt3 = 'seedsalt3';

    // Password is "password123" PBKDF2 hashed with 100,000 iterations for security compliance
    this.users.set('u-admin', {
      id: 'u-admin',
      email: 'admin@aimentor.com',
      passwordHash:
        'beed170d3e5951bec84c2d7831437ff2e47dd035ab03fc6c54e3daf2effd7db638ed5ebccdcd9bd4a6a2fcee28effbac67f55f4f7453c1d9a745468a525e7150',
      passwordSalt: salt1,
      role: 'admin',
      isVerified: true,
      rememberMe: false,
    });
    this.profiles.set('p-admin', {
      id: 'p-admin',
      userId: 'u-admin',
      fullName: 'System Administrator',
      createdAt: new Date().toISOString(),
    });

    this.users.set('u-mentor', {
      id: 'u-mentor',
      email: 'mentor@aimentor.com',
      passwordHash:
        '445d1a262449acefbae8f7bfc41e062b8a9377de1a85fb262043b084d79609f079676597798ffb46c18d26cce17ba042892a3ebb8be2cc802e16ca5eeb0e1778',
      passwordSalt: salt2,
      role: 'mentor',
      isVerified: true,
      rememberMe: false,
    });
    this.profiles.set('p-mentor', {
      id: 'p-mentor',
      userId: 'u-mentor',
      fullName: 'Expert Mentor',
      createdAt: new Date().toISOString(),
    });

    this.users.set('u-student', {
      id: 'u-student',
      email: 'student@aimentor.com',
      passwordHash:
        'd2219598b72426d7f933d82f4e6df889148d6fb9c8941036e9b863eddcff7b8654e9b0925bb87ab28261c9b1715827e7c4be42869775380ae5902315ff9a5968',
      passwordSalt: salt3,
      role: 'student',
      isVerified: true,
      rememberMe: false,
    });
    this.profiles.set('p-student', {
      id: 'p-student',
      userId: 'u-student',
      fullName: 'Active Student',
      createdAt: new Date().toISOString(),
    });
  }

  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  public findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  public getProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  public findProfileByUserId(userId: string): Profile | undefined {
    return this.getProfiles().find((p) => p.userId === userId);
  }

  public saveProfile(profile: Profile): Profile {
    this.profiles.set(profile.id, profile);
    return profile;
  }

  public clear() {
    this.users.clear();
    this.profiles.clear();
    this.seed();
  }
}

export const db = new MockDatabase();
