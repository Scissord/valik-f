import { IOrderProduct } from "./order_product";

export interface IOrderItem {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  total: number;
  created_at: string;
  updated_at: string;
  product: IOrderProduct;
}
