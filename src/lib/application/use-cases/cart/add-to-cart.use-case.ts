/**
 * Add to cart use case
 */
import { Product, CartItem } from '../../../types/domain/product.types';
import { AppError } from '../../../types/common.types';

export interface AddToCartRequest {
  product: Product;
  quantity: number;
  notes?: string;
}

export class AddToCartUseCase {
  async execute(request: AddToCartRequest): Promise<CartItem> {
    // Validate input
    this.validateRequest(request);

    // Check product availability
    this.validateProductAvailability(request.product, request.quantity);

    // Create cart item
    const cartItem: CartItem = {
      productId: request.product.id,
      product: request.product,
      quantity: request.quantity,
      price: request.product.price.current,
      addedAt: new Date().toISOString(),
      notes: request.notes,
    };

    return cartItem;
  }

  private validateRequest(request: AddToCartRequest): void {
    if (!request.product) {
      throw new AppError({
        code: 'INVALID_PRODUCT',
        message: 'Product is required',
        timestamp: new Date().toISOString(),
      });
    }

    if (!request.quantity || request.quantity <= 0) {
      throw new AppError({
        code: 'INVALID_QUANTITY',
        message: 'Quantity must be greater than 0',
        timestamp: new Date().toISOString(),
      });
    }

    if (request.quantity > 100) {
      throw new AppError({
        code: 'QUANTITY_LIMIT_EXCEEDED',
        message: 'Maximum quantity per item is 100',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private validateProductAvailability(product: Product, quantity: number): void {
    if (product.status !== 'active') {
      throw new AppError({
        code: 'PRODUCT_UNAVAILABLE',
        message: 'This product is currently unavailable',
        timestamp: new Date().toISOString(),
      });
    }

    if (product.inventory.trackQuantity && product.inventory.available < quantity) {
      throw new AppError({
        code: 'INSUFFICIENT_STOCK',
        message: `Only ${product.inventory.available} items available in stock`,
        timestamp: new Date().toISOString(),
      });
    }

    if (!product.inventory.allowBackorder && product.inventory.available <= 0) {
      throw new AppError({
        code: 'OUT_OF_STOCK',
        message: 'This product is currently out of stock',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
