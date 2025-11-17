/**
 * Login use case
 */
import { IUserRepository } from '../../../infrastructure/repositories/user.repository';
import { LoginCredentials, User, AuthTokens } from '../../../types/domain/user.types';
import { AppError } from '../../../types/common.types';
import { APP_CONFIG } from '../../../config/app.config';

export interface LoginUseCaseResult {
  user: User;
  tokens: AuthTokens;
}

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(credentials: LoginCredentials): Promise<LoginUseCaseResult> {
    // Validate input
    this.validateCredentials(credentials);

    try {
      // Attempt login
      const result = await this.userRepository.login(credentials);

      // Store tokens if remember me is enabled
      if (credentials.rememberMe && typeof window !== 'undefined') {
        localStorage.setItem(APP_CONFIG.storage.accessToken, result.tokens.accessToken);
        localStorage.setItem(APP_CONFIG.storage.refreshToken, result.tokens.refreshToken);
      }

      return result;
    } catch (error: any) {
      // Transform repository errors to domain errors
      throw this.transformError(error);
    }
  }

  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.password) {
      throw new AppError({
        code: 'INVALID_CREDENTIALS',
        message: 'Email and password are required',
        timestamp: new Date().toISOString(),
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new AppError({
        code: 'INVALID_EMAIL',
        message: 'Please enter a valid email address',
        timestamp: new Date().toISOString(),
      });
    }

    if (credentials.password.length < 6) {
      throw new AppError({
        code: 'INVALID_PASSWORD',
        message: 'Password must be at least 6 characters long',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private transformError(error: any): AppError {
    if (error.code === 'INVALID_CREDENTIALS') {
      return new AppError({
        code: 'LOGIN_FAILED',
        message: 'Invalid email or password',
        timestamp: new Date().toISOString(),
      });
    }

    if (error.code === 'ACCOUNT_LOCKED') {
      return new AppError({
        code: 'ACCOUNT_LOCKED',
        message: 'Your account has been temporarily locked. Please try again later.',
        timestamp: new Date().toISOString(),
      });
    }

    // Default error
    return new AppError({
      code: 'LOGIN_ERROR',
      message: 'An error occurred during login. Please try again.',
      timestamp: new Date().toISOString(),
    });
  }
}
