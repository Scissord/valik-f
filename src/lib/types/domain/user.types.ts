/**
 * User domain types
 */
import { BaseEntity } from '../common.types';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: UserRole;
  preferences: UserPreferences;
  addresses: Address[];
}

export type UserRole = 'customer' | 'admin' | 'manager';

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export interface Address extends BaseEntity {
  userId: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  agreeToTerms: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
