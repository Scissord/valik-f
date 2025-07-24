import api from "../axios";
import { Product } from "@/interfaces/product.interface";
import { GoodCategory } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
  category_id: string | number;
}

interface CategoryResponse {
  category: GoodCategory | null;
  products: Product[];
  children_categories: GoodCategory[];
  total: number;
  totalPages: number;
}

export const getProductsForCategory = async ({
  page = 1,
  limit = 9,
  category_id,
}: PaginationOptions): Promise<CategoryResponse> => {
  if (isNaN(Number(page)) || page < 1) page = 1;
  if (isNaN(Number(limit)) || limit < 1) limit = 9;

  try {
    const response = await api.get(`/categories/${category_id}`, {
      params: { limit, page }
    });
    
    // Проверка на корректность ответа
    const data = response.data;
    return {
      category: data?.category || null,
      products: Array.isArray(data?.products) ? data.products : [],
      children_categories: Array.isArray(data?.children_categories) ? data.children_categories : [],
      total: typeof data?.total === 'number' ? data.total : 0,
      totalPages: typeof data?.totalPages === 'number' ? data.totalPages : 0,
    };
  } catch (error) {
    console.error('[API] Ошибка при загрузке продуктов по категории:', error);
    
    return {
      category: null,
      products: [],
      children_categories: [],
      total: 0,
      totalPages: 0
    };
  }
};
