/**
 * Main library exports - Clean Architecture implementation
 */

// Configuration
export { APP_CONFIG } from './config/app.config';

// Types
export * from './types';

// Infrastructure
export { HttpClient, httpClient } from './infrastructure/http/http-client';
export { BaseRepository } from './infrastructure/repositories/base.repository';
export { UserRepository } from './infrastructure/repositories/user.repository';
export { ProductRepository } from './infrastructure/repositories/product.repository';
export { ErrorHandler, globalErrorHandler } from './infrastructure/error/error-handler';
export { Validator, formatValidationErrors, getFirstValidationError } from './infrastructure/validation/validator';

// Application Layer
export { LoginUseCase } from './application/use-cases/auth/login.use-case';
export { AddToCartUseCase } from './application/use-cases/cart/add-to-cart.use-case';
export { CartService } from './application/services/cart.service';

// Presentation Layer
export { useAuthStore } from './presentation/stores/auth.store';
export { useCartStore } from './presentation/stores/cart.store';

// Validation Schemas (with explicit naming to avoid conflicts)
export {
  userSchema,
  loginCredentialsSchema,
  registerDataSchema,
  addressSchema,
  createAddressSchema,
  updateProfileSchema,
  changePasswordSchema,
} from './infrastructure/validation/schemas/user.schemas';
