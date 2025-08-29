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
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Ищем товар в корзине по ID, артикулу и сегодняшней дате
        const productInCart = cart.find(
          (item) => item.id === product.id && item.articul === product.articul && item.added_at === today
        );

        if (productInCart) {
          // Если такой товар, добавленный сегодня, уже есть, обновляем его количество
          const updatedCart = cart.map((item) => {
            if (item.id === product.id && item.articul === product.articul && item.added_at === today) {
              return { ...item, quantity: item.quantity + (product.quantity || 1) };
            }
            return item;
          });
          set({ cart: updatedCart });
        } else {
          // Если товара нет или он был добавлен в другой день, добавляем его как новый
          const newProduct = {
            ...product,
            quantity: product.quantity || 1,
            added_at: today,
          };
          set({ cart: [...cart, newProduct] });
        }
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
