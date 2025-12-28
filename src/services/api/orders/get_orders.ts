import api from "../axios";
import type { IOrder } from "@/lib/legacy";

export const getOrders = async (): Promise<IOrder[]> => {
  const { data } = await api.get<IOrder[]>("/orders");
  return data;
};
