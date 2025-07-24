import api from "../axios";
import { Product } from "@/interfaces/product.interface";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getProductsForMainPage = async ({
  page = 1,
  limit = 9,
}: PaginationOptions): Promise<{ products: Product[], total: number, totalPages: number }> => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 9;

  try {
    const response = await api.get('/products/main', {
      params: { limit, page }
    });

    return response.data;
  } catch (error) {
    console.error('[API] Ошибка при загрузке продуктов:', error);
    return {
      products: [],
      total: 0,
      totalPages: 0
    };
  }
};
