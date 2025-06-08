import { IOrderItem } from "./order_item";

export interface IOrder {
  id: string;
  name: string;
  phone: string,
  total: number,
  status: number,
  created_at: number,
  updated_at: number,
  deleted_at: number | null,
  items: IOrderItem[],
}

