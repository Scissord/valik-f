import { IOrderItem } from "./order_item";

export interface IOrder {
  id: string;
  user_id: string;
  address: string;
  additional_info: string;
  total: string;
  status: number;
  created_at: string;
  updated_at: string;
  items: IOrderItem[];
}

