/**
 * Centralized type exports
 */

// Common types
export * from './common.types';

// Domain types
export * from './domain/user.types';
export * from './domain/product.types';
export * from './domain/order.types';
export * from './domain/ai.types';

// Re-export for backward compatibility (temporary)
export type { User } from './domain/user.types';
export type { Product, CartItem, Cart } from './domain/product.types';
export type { Order } from './domain/order.types';
export type { Chat, ChatMessage } from './domain/ai.types';
