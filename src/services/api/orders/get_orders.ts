import api from "../axios";
import type { IOrder } from "@/lib/legacy";

export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const buyerId = typeof window !== "undefined" ? localStorage.getItem("buyerId") : null;
    
    if (!buyerId) {
      console.warn("Buyer ID not found in localStorage");
      return [];
    }

    console.log("Fetching orders for buyer:", buyerId);
    const { data } = await api.get<{ results: IOrder[] } | IOrder[]>(`/sell/orders/buyer/${buyerId}/`);
    console.log("Orders fetched successfully:", data);
    
    // Обрабатываем оба формата: с пагинацией и без
    if (data && typeof data === 'object' && 'results' in data) {
      return data.results || [];
    } else if (Array.isArray(data)) {
      return data;
    }
    
    console.warn("Unexpected response format:", data);
    return [];
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};
