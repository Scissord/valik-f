/**
 * HTTP Client with interceptors and error handling
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APP_CONFIG } from '../../config/app.config';
import { ApiResponse, AppError } from '../../types/common.types';

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || APP_CONFIG.api.baseUrl,
      timeout: APP_CONFIG.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        (config as any).metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(this.createAppError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (process.env.NODE_ENV === 'development') {
          const endTime = new Date();
          const startTime = (response.config as any).metadata?.startTime;
          if (startTime) {
            console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${endTime.getTime() - startTime.getTime()}ms`);
          }
        }

        return response;
      },
      async (error) => {
        // Handle token refresh
        if (error.response?.status === 401) {
          const refreshed = await this.handleTokenRefresh();
          if (refreshed && error.config) {
            return this.client.request(error.config);
          }
        }

        return Promise.reject(this.createAppError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(APP_CONFIG.storage.accessToken);
    }
    return null;
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem(APP_CONFIG.storage.refreshToken)
        : null;

      if (!refreshToken) {
        this.clearAuthTokens();
        return false;
      }

      const response = await axios.post(`${APP_CONFIG.api.baseUrl}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem(APP_CONFIG.storage.accessToken, accessToken);
        localStorage.setItem(APP_CONFIG.storage.refreshToken, newRefreshToken);
      }

      return true;
    } catch {
      this.clearAuthTokens();
      return false;
    }
  }

  private clearAuthTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(APP_CONFIG.storage.accessToken);
      localStorage.removeItem(APP_CONFIG.storage.refreshToken);
    }
  }

  private createAppError(error: any): AppError {
    return new AppError({
      code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      details: error.response?.data?.details || error.response?.data,
      timestamp: new Date().toISOString(),
    });
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// Singleton instance
export const httpClient = new HttpClient();
