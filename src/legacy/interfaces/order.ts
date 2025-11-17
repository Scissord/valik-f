import { IOrderItem } from "./order_item";

export interface IOrder {
  id: string;
  user_id: number;
  address: string;
  additional_info: string;
  total: number;
  status: number;
  created_at: string;
  updated_at: string;
  items: IOrderItem[];
}

