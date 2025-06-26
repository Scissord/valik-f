import { ProductItem } from "@/interfaces/product";

interface Params {
  id: string; // В данном случае id используется как slug
}

export const getProduct = async ({
  id,
}: Params) => {
  // Проверка на undefined или пустое значение
  if (!id) {
    console.error('[API] Ошибка: ID продукта не определен');
    throw new Error("ID продукта не определен");
  }
  
  const url = `http://localhost:8080/products/${id}`;
  console.log(`[API] Запрос информации о продукте: ${url}`);
  
  try {
    // Реальный запрос к API
    const response = await fetch(url, {
      cache: 'no-store', // Отключаем кеширование для получения актуальных данных
    });
    
    if (!response.ok) {
      console.error(`[API] Ошибка при запросе продукта ${id}: ${response.status}`);
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const product = await response.json();

    if (!product) {
      console.error(`[API] Продукт с ID ${id} не найден`);
      throw new Error(`Продукт с ID ${id} не найден`);
    }
    
    console.log(`[API] Получена информация о продукте: ${product.title || id}`);
    
    // Детальное логирование структуры продукта
    console.log('[API] Полная структура продукта:');
    console.log(JSON.stringify(product, null, 2));
    
    // Выводим ключи всех полей продукта
    const productKeys = Object.keys(product);
    console.log('[API] Все поля продукта:', productKeys.join(', '));
    
    // Проверяем соответствие интерфейсу ProductItem
    const productItemFields = [
      'id', 'title', 'description', 'brand', 'brand_id', 'unit', 'unit_id', 
      'category', 'category_id', 'rating', 'article', 'price', 'created_at', 
      'updated_at', 'deleted_at', 'images', 'slug', 'inStock', 'sizes', 
      'tags', 'gender'
    ];
    
    const missingFields = productItemFields.filter(field => !productKeys.includes(field));
    if (missingFields.length > 0) {
      console.warn('[API] Отсутствуют поля из интерфейса ProductItem:', missingFields.join(', '));
    }
    
    const additionalFields = productKeys.filter(key => !productItemFields.includes(key));
    if (additionalFields.length > 0) {
      console.log('[API] Дополнительные поля продукта:', additionalFields.join(', '));
    }

    return product;
  } catch (error) {
    console.error('[API] Ошибка при загрузке продукта:', error);
    throw new Error("Ошибка при получении информации о продукте!");
  }
};
