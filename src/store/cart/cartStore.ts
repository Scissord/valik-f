import { CartItem } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartItem[];
  addProductToCart: (product: CartItem) => void;
  getTotalItems: () => number;
  getSummaryInformation: () => {
    total: number;
    count: number;
  };
  updateProductQuantity: (product: CartItem, quantity: number) => void;
  deleteProduct: (product: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getSummaryInformation: () => {
        const { cart } = get();
        const total = cart.reduce(
          (subtotal, product) => product.quantity * product.price + subtotal,
          0
        );
        const count = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return {
          total,
          count,
        };
      },

      deleteProduct: (product: CartItem) => {
        const { cart } = get();

        const updatedCartItems = cart.filter(
          (item) => item.id != product.id
        );

        set({ cart: updatedCartItems });
      },

      updateProductQuantity: (product: CartItem, quantity: number) => {
        const { cart } = get();

        const updatedCartItems = cart
          .map((item) => {
            if (item.id === product.id) {
              return { ...item, quantity: quantity };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);

        set({ cart: updatedCartItems });
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      clearCart: () => {
        set({ cart: [] });
      },

      addProductToCart: (product: CartItem) => {
        const { cart } = get();

        const productInCart = cart.some(
          (item) => item.id === product.id
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCart = cart.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });

        set({ cart: updatedCart });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
