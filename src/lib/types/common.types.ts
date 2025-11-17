/**
 * Common types used across the application
 */

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error types
export interface IAppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class AppError extends Error implements IAppError {
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: string;

  constructor(error: IAppError) {
    super(error.message);
    this.name = 'AppError';
    this.code = error.code;
    this.details = error.details;
    this.timestamp = error.timestamp;
  }
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic async state
export interface AsyncState<T = any> {
  data: T | null;
  loading: LoadingState;
  error: AppError | null;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

// File upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}
