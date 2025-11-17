import api from "../axios";
import type { IOrder } from "@/lib/legacy";

interface Params {
  order_id: string;
}

export const findOrder = async ({ order_id }: Params): Promise<IOrder | null> => {
  try {
    const response = await api.post('/orders/find', { order_id });
    return response.data;
  } catch (error) {
    console.error('Ошибка при поиске заказа:', error);
    return null;
  }
};
