import { Product } from "./product.interface";

export interface CartItem extends Product {
  quantity: number; // В корзине это поле означает количество выбранного товара
  image?: string;
  added_at?: string; // Дата добавления в корзину
}