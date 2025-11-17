/**
 * Application configuration
 * Centralized configuration management for different environments
 */

export const APP_CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Application Settings
  app: {
    name: 'Valik.kz',
    version: '1.0.0',
    description: 'Интернет-магазин строительных материалов',
    defaultLanguage: 'ru',
  },
  
  // Storage Keys
  storage: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    userPreferences: 'userPreferences',
    cart: 'shopping-cart',
    aiAssistant: {
      currentChat: 'ai-assistant-current-chat',
      creatingNewChat: 'ai-assistant-creating-new-chat',
    },
  },
  
  // Feature Flags
  features: {
    aiAssistant: true,
    paypal: true,
    analytics: process.env.NODE_ENV === 'production',
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Validation
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
