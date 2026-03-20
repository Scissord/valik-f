import api from "../axios";
import type { IOrder } from "@/lib/legacy";

interface CreateOrderParams {
  buyer: number;
  sell_product: number[]; // Array of IDs in cart
  payment_type: number;
  address: string;
  delevery_date: string; // YYYY-MM-DD
}

export const createOrder = async (params: CreateOrderParams): Promise<IOrder | null> => {
  try {
    const response = await api.post('/sell/order/create/', params);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};
