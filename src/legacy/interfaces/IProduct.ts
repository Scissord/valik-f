export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category_id: number | null;
}