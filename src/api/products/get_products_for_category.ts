import { Product } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
  category_id: number;
}

export const getProductsForCategory = async ({
  page = 1,
  limit = 9,
  category_id,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 9;

  try {
    // Реальный запрос к API
    const response = await fetch(`http://localhost:8080/products/categories/${category_id}?limit=${limit}&page=${page}`, {
      cache: 'no-store', // Отключаем кеширование для получения актуальных данных
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const { category, products, children_categories, total, totalPages } = await response.json();

    return {
      category,
      products,
      children_categories,
      total,
      totalPages
    };
  } catch (error) {
    console.error('Ошибка при загрузке продуктов по категории:', error);
    
    // В случае ошибки возвращаем пустые данные
    return {
      category: null,
      products: [],
      children_categories: [],
      total: 0,
      totalPages: 0
    };
  }
};
