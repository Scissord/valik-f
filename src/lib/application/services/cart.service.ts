/**
 * Cart service - manages cart business logic
 */
import { Cart, CartItem, Product } from '../../types/domain/product.types';
import { AppError } from '../../types/common.types';
import { AddToCartUseCase, AddToCartRequest } from '../use-cases/cart/add-to-cart.use-case';

export interface ICartService {
  addItem(product: Product, quantity: number, notes?: string): Promise<CartItem>;
  removeItem(productId: string): Promise<void>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  getCart(): Cart;
  clearCart(): void;
  calculateTotals(): { totalItems: number; totalPrice: number };
}

export class CartService implements ICartService {
  private cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    currency: 'KZT',
    updatedAt: new Date().toISOString(),
  };

  private addToCartUseCase = new AddToCartUseCase();

  constructor() {
    this.loadCartFromStorage();
  }

  async addItem(product: Product, quantity: number, notes?: string): Promise<CartItem> {
    const request: AddToCartRequest = { product, quantity, notes };
    const cartItem = await this.addToCartUseCase.execute(request);

    // Check if item already exists in cart
    const existingItemIndex = this.cart.items.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const existingItem = this.cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      // Validate new quantity
      this.validateQuantity(product, newQuantity);
      
      this.cart.items[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        notes: notes || existingItem.notes,
      };
    } else {
      // Add new item
      this.cart.items.push(cartItem);
    }

    this.updateCartTotals();
    this.saveCartToStorage();
    
    return cartItem;
  }

  async removeItem(productId: string): Promise<void> {
    const itemIndex = this.cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      throw new AppError({
        code: 'ITEM_NOT_FOUND',
        message: 'Item not found in cart',
        timestamp: new Date().toISOString(),
      });
    }

    this.cart.items.splice(itemIndex, 1);
    this.updateCartTotals();
    this.saveCartToStorage();
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(productId);
      return;
    }

    const itemIndex = this.cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      throw new AppError({
        code: 'ITEM_NOT_FOUND',
        message: 'Item not found in cart',
        timestamp: new Date().toISOString(),
      });
    }

    const item = this.cart.items[itemIndex];
    this.validateQuantity(item.product, quantity);

    this.cart.items[itemIndex] = {
      ...item,
      quantity,
    };

    this.updateCartTotals();
    this.saveCartToStorage();
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  clearCart(): void {
    this.cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      currency: 'KZT',
      updatedAt: new Date().toISOString(),
    };
    this.saveCartToStorage();
  }

  calculateTotals(): { totalItems: number; totalPrice: number } {
    const totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return { totalItems, totalPrice };
  }

  private validateQuantity(product: Product, quantity: number): void {
    if (quantity > 100) {
      throw new AppError({
        code: 'QUANTITY_LIMIT_EXCEEDED',
        message: 'Maximum quantity per item is 100',
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
  }

  private updateCartTotals(): void {
    const totals = this.calculateTotals();
    this.cart.totalItems = totals.totalItems;
    this.cart.totalPrice = totals.totalPrice;
    this.cart.updatedAt = new Date().toISOString();
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('shopping-cart');
        if (stored) {
          const parsedCart = JSON.parse(stored);
          if (parsedCart.state?.cart) {
            this.cart = parsedCart.state.cart;
          }
        }
      } catch (error) {
        console.warn('Failed to load cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const cartData = {
          state: { cart: this.cart },
          version: 0,
        };
        localStorage.setItem('shopping-cart', JSON.stringify(cartData));
      } catch (error) {
        console.warn('Failed to save cart to storage:', error);
      }
    }
  }
}
