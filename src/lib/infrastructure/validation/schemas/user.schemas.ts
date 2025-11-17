/**
 * User validation schemas using Zod
 */
import { z } from 'zod';

// Base user schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  isEmailVerified: z.boolean(),
  role: z.enum(['customer', 'admin', 'manager']),
  preferences: z.object({
    language: z.string().min(2).max(5),
    currency: z.string().length(3),
    notifications: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
    }),
    theme: z.enum(['light', 'dark', 'system']),
  }),
  addresses: z.array(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Login credentials schema
export const loginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

// Registration data schema
export const registerDataSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
});

// Address schema
export const addressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['home', 'work', 'other']),
  isDefault: z.boolean(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  building: z.string().min(1, 'Building is required'),
  apartment: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Create address schema (without id, userId, createdAt, updatedAt)
export const createAddressSchema = addressSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  preferences: z.object({
    language: z.string().min(2).max(5).optional(),
    currency: z.string().length(3).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    }).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

// Password change schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Export types
export type User = z.infer<typeof userSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterData = z.infer<typeof registerDataSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CreateAddress = z.infer<typeof createAddressSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
