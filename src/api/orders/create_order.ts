import api from "../axios";
import { CartItem, IOrder } from "@/interfaces";

interface OrderItem {
  id: number;
  quantity: number;
}

interface Params {
  cart: CartItem[];
  address: string;
}

export const createOrder = async ({
  cart,
  // address
}: Params): Promise<IOrder | null> => {
  try {
    // Преобразуем корзину в формат для API
    const orderItems: OrderItem[] = cart.map(item => ({
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
      quantity: item.quantity
    }));

    const response = await api.post('/orders', {
      cart: orderItems
      // address
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};
