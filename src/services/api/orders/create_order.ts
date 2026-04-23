import api from "../axios";
import type { IOrder } from "@/lib/legacy";

interface CreateOrderParams {
  payment_type: number;
  delevery_date: string;
  address: string;
}

export const createOrder = async (params: CreateOrderParams): Promise<IOrder | null> => {
  try {
    console.log('Creating order with params:', params);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    console.log('Token exists:', !!token);
    
    const response = await api.post('/sell/order/create/', params);
    console.log('Order created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};
