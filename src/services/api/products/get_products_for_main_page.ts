import api from "../axios";
import type { Product } from "@/lib/legacy";

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
    const response = await api.get('/product/opt-products/', {
      params: { limit, page }
    });

    const data = response.data;
    const products = Array.isArray(data) ? data : (data.results || data.products || []);
    const normalizedProducts = products.map((p: any) => ({
      ...p,
      price: Number(p.price) || 0
    }));
    const total = typeof data.count === 'number' ? data.count : (data.total || products.length);
    const totalPages = data.totalPages || Math.ceil(total / limit) || 1;

    return {
      products: normalizedProducts,
      total,
      totalPages
    };
  } catch (error) {
    console.error('[API] Ошибка при загрузке продуктов:', error);
    return {
      products: [],
      total: 0,
      totalPages: 0
    };
  }
};
