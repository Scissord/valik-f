/**
 * Centralized error handling system
 */
import { AppError } from '../../types/common.types';

export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
}

export interface IErrorHandler {
  handleError(error: Error | AppError): void;
  handleApiError(error: any): AppError;
  showNotification(notification: ErrorNotification): void;
}

export class ErrorHandler implements IErrorHandler {
  private notificationCallback?: (notification: ErrorNotification) => void;

  constructor(notificationCallback?: (notification: ErrorNotification) => void) {
    this.notificationCallback = notificationCallback;
  }

  handleError(error: Error | AppError): void {
    // Log error for debugging
    console.error('Application Error:', error);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error);
    }

    // Show user-friendly notification
    const notification = this.createUserNotification(error);
    this.showNotification(notification);
  }

  handleApiError(error: any): AppError {
    // Transform various error types to AppError
    if (error instanceof AppError) {
      return error;
    }

    // Axios error
    if (error.response) {
      return new AppError({
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        message: error.response.data?.message || this.getHttpErrorMessage(error.response.status),
        details: error.response.data,
        timestamp: new Date().toISOString(),
      });
    }

    // Network error
    if (error.request) {
      return new AppError({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.',
        timestamp: new Date().toISOString(),
      });
    }

    // Generic error
    return new AppError({
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }

  showNotification(notification: ErrorNotification): void {
    if (this.notificationCallback) {
      this.notificationCallback(notification);
    } else {
      // Fallback to console if no notification system is set up
      console.warn('No notification system configured:', notification);
    }
  }

  private createUserNotification(error: Error | AppError): ErrorNotification {
    if (error instanceof AppError) {
      return {
        title: this.getErrorTitle(error.code),
        message: error.message,
        type: this.getNotificationType(error.code),
        duration: this.getNotificationDuration(error.code),
      };
    }

    return {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error',
      duration: 5000,
    };
  }

  private getErrorTitle(code: string): string {
    const titles: Record<string, string> = {
      'NETWORK_ERROR': 'Connection Error',
      'VALIDATION_ERROR': 'Validation Error',
      'AUTHENTICATION_ERROR': 'Authentication Error',
      'AUTHORIZATION_ERROR': 'Access Denied',
      'NOT_FOUND': 'Not Found',
      'SERVER_ERROR': 'Server Error',
      'RATE_LIMIT_EXCEEDED': 'Too Many Requests',
    };

    return titles[code] || 'Error';
  }

  private getNotificationType(code: string): 'error' | 'warning' | 'info' {
    const warningCodes = ['VALIDATION_ERROR', 'RATE_LIMIT_EXCEEDED'];
    const infoCodes = ['NOT_FOUND'];

    if (warningCodes.includes(code)) return 'warning';
    if (infoCodes.includes(code)) return 'info';
    return 'error';
  }

  private getNotificationDuration(code: string): number {
    const longDurationCodes = ['NETWORK_ERROR', 'SERVER_ERROR'];
    return longDurationCodes.includes(code) ? 8000 : 5000;
  }

  private getHttpErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request. Please check your input.',
      401: 'Authentication required. Please log in.',
      403: 'Access denied. You don\'t have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'Conflict. The resource already exists or is in use.',
      422: 'Validation failed. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Internal server error. Please try again later.',
      502: 'Bad gateway. The server is temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. The request took too long to process.',
    };

    return messages[status] || `HTTP Error ${status}`;
  }

  private sendToMonitoring(error: Error | AppError): void {
    // Implement monitoring service integration (e.g., Sentry, LogRocket)
    // This is a placeholder for actual monitoring implementation
    try {
      // Example: Sentry.captureException(error);
      console.log('Sending error to monitoring service:', error);
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring service:', monitoringError);
    }
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler();

// Global error event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    globalErrorHandler.handleError(new Error(event.message));
  });

  window.addEventListener('unhandledrejection', (event) => {
    globalErrorHandler.handleError(new Error(event.reason));
  });
}
