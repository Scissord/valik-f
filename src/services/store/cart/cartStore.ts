import type { CartItem } from "@/lib/legacy";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartAPI } from "../../api";

export interface ExtendedCartItem extends CartItem {
  cartItemId?: number;
}

interface State {
  cart: ExtendedCartItem[];
  addProductToCart: (product: ExtendedCartItem) => Promise<void>;
  updateProductQuantity: (product: ExtendedCartItem, quantity: number) => Promise<void>;
  deleteProduct: (product: ExtendedCartItem) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getSummaryInformation: () => {
    total: number;
    count: number;
  };
  fetchCart: () => Promise<void>;
}

const getBuyerId = (): number | null => {
  try {
    const userStr = localStorage.getItem("user-storage");
    if (!userStr) return null;
    const userState = JSON.parse(userStr);
    return userState?.state?.user?.buyer_id || null;
  } catch (e) {
    return null;
  }
};

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      fetchCart: async () => {
        const buyerId = getBuyerId();
        if (!buyerId) return;
        try {
          const response = await CartAPI.getCart(buyerId);
          if (response && Array.isArray(response)) {
            const remoteCart: ExtendedCartItem[] = response.map((item: any) => ({
              ...(item.product_original || item.product || {}),
              quantity: item.quantity,
              cartItemId: item.id,
              added_at: new Date().toISOString().split('T')[0]
            }));
            if (remoteCart.length > 0) {
              set({ cart: remoteCart });
            }
          }
        } catch (e) {
          console.error("Failed to fetch cart from backend", e);
        }
      },

      getSummaryInformation: () => {
        const { cart } = get();
        const total = cart.reduce(
          (subtotal, product) => product.quantity * Number(product.price) + subtotal,
          0
        );
        const count = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return { total, count };
      },

      deleteProduct: async (product: ExtendedCartItem) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== product.id) });

        const buyerId = getBuyerId();
        if (buyerId && product.cartItemId) {
          try {
            await CartAPI.removeFromCart(Number(product.cartItemId));
          } catch (e) {
            console.error("Failed to delete product from backend cart", e);
          }
        }
      },

      updateProductQuantity: async (product: ExtendedCartItem, quantity: number) => {
        const { cart } = get();
        set({
          cart: cart.map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity };
            }
            return item;
          }).filter((item) => item.quantity > 0)
        });

        const buyerId = getBuyerId();
        if (buyerId && product.cartItemId) {
          try {
            if (quantity > 0) {
              await CartAPI.updateQuantity(Number(product.cartItemId), { quantity });
            } else {
              await CartAPI.removeFromCart(Number(product.cartItemId));
            }
          } catch (e) {
            console.error("Failed to update product quantity on backend", e);
          }
        }
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addProductToCart: async (product: ExtendedCartItem) => {
        const { cart } = get();
        const today = new Date().toISOString().split('T')[0];
        
        let existingItem = cart.find(
          (item) => item.id === product.id && item.article === product.article
        );

        if (existingItem) {
          set({
            cart: cart.map((item) => {
              if (item.id === product.id) {
                return { ...item, quantity: item.quantity + (product.quantity || 1) };
              }
              return item;
            })
          });
          const buyerId = getBuyerId();
          if (buyerId && existingItem.cartItemId) {
              try {
                  await CartAPI.updateQuantity(Number(existingItem.cartItemId), { quantity: existingItem.quantity + (product.quantity || 1) });
              } catch(e) {}
          }
        } else {
          const newProduct = { ...product, quantity: product.quantity || 1, added_at: today };
          set({ cart: [...cart, newProduct] });
          
          const buyerId = getBuyerId();
          if (buyerId) {
             try {
                const res = await CartAPI.addToCart({
                  buyer: buyerId,
                  product_original: Number(product.id),
                  quantity: newProduct.quantity
                });
                if (res && res.id) {
                    set({
                        cart: get().cart.map(i => i.id === product.id ? { ...i, cartItemId: res.id } : i)
                    });
                }
             } catch(e) {
                 console.error("Failed to sync add to cart", e);
             }
          }
        }
      },
    }),
    {
      name: "shopping-cart",
      // Remove sync methods from persist to avoid issues, we only want to store the state array
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
