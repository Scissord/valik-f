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
    const { data } = await api.get<IOrder[]>(`/sell/orders/buyer/${buyerId}/`);
    console.log("Orders fetched successfully:", data);
    return data;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};
