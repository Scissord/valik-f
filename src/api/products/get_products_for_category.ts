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

  const url = `http://localhost:8080/products/categories/${category_id}?limit=${limit}&page=${page}`;
  console.log(`[API] Запрос товаров для категории ${category_id}: ${url}`);
  
  try {
    // Реальный запрос к API
    const response = await fetch(url, {
      cache: 'no-store', // Отключаем кеширование для получения актуальных данных
    });
    
    if (!response.ok) {
      console.error(`[API] Ошибка при запросе товаров для категории ${category_id}: ${response.status}`);
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const { category, products, children_categories, total, totalPages } = await response.json();
    console.log(`[API] Получено ${products.length} товаров из ${total} для категории "${category?.name || category_id}" (страница ${page}/${totalPages})`);
    console.log(`[API] Дочерние категории: ${children_categories.length}`);
    
    // Логируем структуру категории
    console.log('[API] Структура категории:');
    console.log(JSON.stringify(category, null, 2));
    
    // Логируем структуру товаров категории
    if (products.length > 0) {
      console.log('[API] Структура товара категории:');
      console.log(JSON.stringify(products[0], null, 2));
      
      // Выводим ключи всех полей товара
      const productKeys = Object.keys(products[0]);
      console.log('[API] Поля товара категории:', productKeys.join(', '));
    }
    
    // Логируем структуру дочерних категорий
    if (children_categories.length > 0) {
      console.log('[API] Структура дочерней категории:');
      console.log(JSON.stringify(children_categories[0], null, 2));
    }

    return {
      category,
      products,
      children_categories,
      total,
      totalPages
    };
  } catch (error) {
    console.error('[API] Ошибка при загрузке продуктов по категории:', error);
    
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
