import { Product } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
  category_id: string | number;
}

export const getProductsForCategory = async ({
  page = 1,
  limit = 9,
  category_id,
}: PaginationOptions) => {
  if (isNaN(Number(page)) || page < 1) page = 1;
  if (isNaN(Number(limit)) || limit < 1) limit = 9;

  const url = `http://localhost:8080/categories/${category_id}?limit=${limit}&page=${page}`;
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
    
    const data = await response.json();
    
    // Проверяем наличие необходимых свойств в ответе
    const products = Array.isArray(data?.products) ? data.products : [];
    const children_categories = Array.isArray(data?.children_categories) ? data.children_categories : [];
    const total = typeof data?.total === 'number' ? data.total : 0;
    const totalPages = typeof data?.totalPages === 'number' ? data.totalPages : 0;
    
    console.log(`[API] Получено ${products.length} товаров из ${total} для категории "${data?.category?.title || category_id}" (страница ${page}/${totalPages})`);
    console.log(`[API] Дочерние категории: ${children_categories.length}`);
    
    // Логируем структуру категории
    if (data?.category) {
      console.log('[API] Структура категории:');
      console.log(JSON.stringify(data.category, null, 2));
    } else {
      console.log('[API] Категория не найдена в ответе');
    }
    
    // Логируем структуру товаров категории
    if (products.length > 0) {
      console.log('[API] Структура товара категории:');
      console.log(JSON.stringify(products[0], null, 2));
      
      // Выводим ключи всех полей товара
      const productKeys = Object.keys(products[0]);
      console.log('[API] Поля товара категории:', productKeys.join(', '));
    } else {
      console.log('[API] В категории нет товаров');
    }
    
    // Логируем структуру дочерних категорий
    if (children_categories.length > 0) {
      console.log('[API] Структура дочерней категории:');
      console.log(JSON.stringify(children_categories[0], null, 2));
    } else {
      console.log('[API] У категории нет дочерних категорий');
    }

    return {
      category: data?.category || null,
      products: products,
      children_categories: children_categories,
      total: total,
      totalPages: totalPages
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
