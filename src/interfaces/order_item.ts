import { IOrderProduct } from "./order_product";

export interface IOrderItem {
  id: number;
  order_id: string;
  product_id: string;
  quantity: number;
  total: string;
  created_at: string;
  updated_at: string;
  product: IOrderProduct;
}
