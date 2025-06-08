import { ProductItem, IUnit } from "@/interfaces";

export interface IOrderItem {
  id: string;
  product: ProductItem;
  unit: IUnit;
  order_id: string;
  product_id: number,
  quantity: number,
  total: number,
  created_at: number,
  updated_at: number,
  deleted_at: number | null,
}
