/**
 * Auth store using new architecture
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, LoginCredentials, RegisterData } from '../../types/domain/user.types';
import { AsyncState, AppError } from '../../types/common.types';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { httpClient } from '../../infrastructure/http/http-client';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { globalErrorHandler } from '../../infrastructure/error/error-handler';
import { APP_CONFIG } from '../../config/app.config';

interface AuthStore extends AsyncState<User> {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Initialize dependencies
const userRepository = new UserRepository(httpClient);
const loginUseCase = new LoginUseCase(userRepository);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      data: null,
      loading: 'idle',
      error: null,
      tokens: null,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ loading: 'loading', error: null });
        
        try {
          const result = await loginUseCase.execute(credentials);
          
          set({
            data: result.user,
            tokens: result.tokens,
            isAuthenticated: true,
            loading: 'success',
            error: null,
          });
        } catch (error) {
          const appError = error instanceof AppError ? error : globalErrorHandler.handleApiError(error);
          
          set({
            data: null,
            tokens: null,
            isAuthenticated: false,
            loading: 'error',
            error: appError,
          });
          
          globalErrorHandler.handleError(appError);
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: 'loading', error: null });
        
        try {
          const result = await userRepository.register(data);
          
          // Store tokens
          if (typeof window !== 'undefined') {
            localStorage.setItem(APP_CONFIG.storage.accessToken, result.tokens.accessToken);
            localStorage.setItem(APP_CONFIG.storage.refreshToken, result.tokens.refreshToken);
          }
          
          set({
            data: result.user,
            tokens: result.tokens,
            isAuthenticated: true,
            loading: 'success',
            error: null,
          });
        } catch (error) {
          const appError = error instanceof AppError ? error : globalErrorHandler.handleApiError(error);
          
          set({
            data: null,
            tokens: null,
            isAuthenticated: false,
            loading: 'error',
            error: appError,
          });
          
          globalErrorHandler.handleError(appError);
        }
      },

      logout: async () => {
        try {
          await userRepository.logout();
        } catch (error) {
          // Log error but don't prevent logout
          console.warn('Logout API call failed:', error);
        } finally {
          // Clear local state regardless of API call result
          if (typeof window !== 'undefined') {
            localStorage.removeItem(APP_CONFIG.storage.accessToken);
            localStorage.removeItem(APP_CONFIG.storage.refreshToken);
          }
          
          set({
            data: null,
            tokens: null,
            isAuthenticated: false,
            loading: 'idle',
            error: null,
          });
        }
      },

      refreshProfile: async () => {
        const { isAuthenticated } = get();
        
        if (!isAuthenticated) {
          return;
        }

        set({ loading: 'loading' });
        
        try {
          const user = await userRepository.getProfile();
          
          set({
            data: user,
            loading: 'success',
            error: null,
          });
        } catch (error) {
          const appError = error instanceof AppError ? error : globalErrorHandler.handleApiError(error);
          
          // If unauthorized, logout user
          if (appError.code === 'AUTHENTICATION_ERROR' || appError.code === 'HTTP_401') {
            get().logout();
          } else {
            set({
              loading: 'error',
              error: appError,
            });
            
            globalErrorHandler.handleError(appError);
          }
        }
      },

      updateProfile: async (profileData: Partial<User>) => {
        set({ loading: 'loading', error: null });
        
        try {
          const updatedUser = await userRepository.updateProfile(profileData);
          
          set({
            data: updatedUser,
            loading: 'success',
            error: null,
          });
        } catch (error) {
          const appError = error instanceof AppError ? error : globalErrorHandler.handleApiError(error);
          
          set({
            loading: 'error',
            error: appError,
          });
          
          globalErrorHandler.handleError(appError);
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: APP_CONFIG.storage.accessToken,
      partialize: (state) => ({
        data: state.data,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
