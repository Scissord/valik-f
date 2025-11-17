/**
 * Cart store using new architecture
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, Product } from '../../types/domain/product.types';
import { AsyncState, AppError } from '../../types/common.types';
import { CartService, ICartService } from '../../application/services/cart.service';
import { globalErrorHandler } from '../../infrastructure/error/error-handler';
import { APP_CONFIG } from '../../config/app.config';

interface CartStore extends AsyncState<Cart> {
  // Actions
  addItem: (product: Product, quantity: number, notes?: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => void;
  clearError: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  hasItem: (productId: string) => boolean;
}

// Initialize cart service
const cartService: ICartService = new CartService();

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      data: cartService.getCart(),
      loading: 'idle',
      error: null,

      // Actions
      addItem: async (product: Product, quantity: number, notes?: string) => {
        set({ loading: 'loading', error: null });
        
        try {
          await cartService.addItem(product, quantity, notes);
          const updatedCart = cartService.getCart();
          
          set({
            data: updatedCart,
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

      removeItem: async (productId: string) => {
        set({ loading: 'loading', error: null });
        
        try {
          await cartService.removeItem(productId);
          const updatedCart = cartService.getCart();
          
          set({
            data: updatedCart,
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

      updateQuantity: async (productId: string, quantity: number) => {
        set({ loading: 'loading', error: null });
        
        try {
          await cartService.updateQuantity(productId, quantity);
          const updatedCart = cartService.getCart();
          
          set({
            data: updatedCart,
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

      clearCart: () => {
        cartService.clearCart();
        const updatedCart = cartService.getCart();
        
        set({
          data: updatedCart,
          loading: 'success',
          error: null,
        });
      },

      refreshCart: () => {
        const currentCart = cartService.getCart();
        set({
          data: currentCart,
          loading: 'success',
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Computed values
      getTotalItems: () => {
        const { data } = get();
        return data?.totalItems || 0;
      },

      getTotalPrice: () => {
        const { data } = get();
        return data?.totalPrice || 0;
      },

      getItemCount: (productId: string) => {
        const { data } = get();
        const item = data?.items.find(item => item.productId === productId);
        return item?.quantity || 0;
      },

      hasItem: (productId: string) => {
        const { data } = get();
        return data?.items.some(item => item.productId === productId) || false;
      },
    }),
    {
      name: APP_CONFIG.storage.cart,
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
);
