import api from "../axios";
import { CartItem, IOrder } from "@/interfaces";

interface OrderItem {
  id: number;
  quantity: number;
}

interface Params {
  cart: CartItem[];
<<<<<<< HEAD
  address: string;
  additional_info?: string;
=======
  // address: string;
>>>>>>> f0eed17249263e45bf0606a3b1968a190bc6a71a
}

export const createOrder = async ({
  cart,
  address,
  additional_info
}: Params): Promise<IOrder | null> => {
  try {
    // Преобразуем корзину в формат для API
    const orderItems: OrderItem[] = cart.map(item => ({
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
      quantity: item.quantity
    }));

    const response = await api.post('/orders', {
      cart: orderItems,
      address,
      additional_info
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};
