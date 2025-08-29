import api from "../axios";
import { IOrder } from "@/interfaces";

export const getOrders = async (): Promise<IOrder[]> => {
  const { data } = await api.get<IOrder[]>("/orders");
  return data;
};