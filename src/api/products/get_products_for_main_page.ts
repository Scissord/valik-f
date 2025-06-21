import { Product } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getProductsForMainPage = async ({
  page = 1,
  limit = 9,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 9;

  try {
    // Реальный запрос к API
    const response = await fetch(`http://localhost:8080/products/main?limit=${limit}&page=${page}`, {
      cache: 'no-store', // Отключаем кеширование для получения актуальных данных
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const { products, total, totalPages } = await response.json();

    return {
      products,
      total,
      totalPages
    };
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
    
    // В случае ошибки возвращаем пустые данные
    return {
      products: [],
      total: 0,
      totalPages: 0
    };
  }
};
