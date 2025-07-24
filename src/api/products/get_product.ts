import api from "../axios";
import { Product } from "@/interfaces";

interface Params {
  id: string; // В данном случае id используется как slug
}

export const getProduct = async ({ id }: Params): Promise<Product | null> => {
  if (!id) {
    console.error('[API] Ошибка: ID продукта не определен');
    return null;
  }
  
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('[API] Ошибка при загрузке продукта:', error);
    return null;
  }
};
