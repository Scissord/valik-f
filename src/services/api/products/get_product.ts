import api from "../axios";
import type { Product } from "@/lib/legacy";

interface Params {
  id: string; // В данном случае id используется как slug
}

export const getProduct = async ({ id }: Params): Promise<Product | null> => {
  if (!id) {
    console.error('[API] Ошибка: ID продукта не определен');
    return null;
  }

  console.log(`[API] Запрос товара с ID: ${id}`);

  try {
    const response = await api.get(`/products/${id}`);

    console.log('[API] Товар успешно получен с бэкенда:', {
      id: response.data?.id,
      title: response.data?.title,
      price: response.data?.price,
      category: response.data?.category,
      brand: response.data?.brand,
      images_count: response.data?.images?.length || 0,
      has_description: !!response.data?.description,
      article: response.data?.article
    });

    return response.data;
  } catch (error) {
    console.error('[API] Ошибка при загрузке продукта:', error);
    return null;
  }
};
