export * from './database.js';
export * from './security.js';
export * from './auth-service.js';
export * from './payment-service.js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
}

export function greetUser(user: UserProfile): string {
  return `Welcome back, ${user.name}! Your role is: ${user.role}.`;
}

export const API_VERSION = 'v1';
