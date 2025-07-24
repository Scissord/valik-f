import api from "../axios";
import { CartItem, IOrder } from "@/interfaces";

interface Params {
  cart: CartItem[];
  phone: string;
  name: string;
}

export const createOrder = async ({
  cart, phone, name
}: Params): Promise<IOrder | null> => {
  try {
    const response = await api.post('/orders', {
      cart,
      phone,
      name,
    });
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    return null;
  }
};
