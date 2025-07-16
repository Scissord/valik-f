// import { Product } from "@/interfaces";

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

  // azamat добавь .env в корень тоже на уровень с package.json
  // там добавь переменную как ниже BACKEND_URL=http://localhost:8080
  // это надо когда на проде запускаю билд он делает этот запрос
  // как ты понимаешь там нет бэка поэтому там стоит url на прод бек
  // в твоих проектах советую тоже url с localhost,
  // или любые другие держать в .env
  // как прочтешь и поймешь делитни этот блок комментов, буду такие оставлять
  const url = `${process.env.BACKEND_URL}/products/main?limit=${limit}&page=${page}`;
  console.log(`[API] Запрос товаров для главной страницы: ${url}`);

  try {
    // Реальный запрос к API
    const response = await fetch(url, {
      next: {
        revalidate: 60
      } // Отключаем кеширование для получения актуальных данных
    });

    if (!response.ok) {
      console.error(`[API] Ошибка при запросе товаров для главной: ${response.status}`);
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const { products, total, totalPages } = await response.json();
    console.log(`[API] Получено ${products.length} товаров из ${total} (страница ${page}/${totalPages})`);

    // Логируем структуру первого товара для анализа
    if (products.length > 0) {
      console.log('[API] Структура товара с главной страницы:');
      console.log(JSON.stringify(products[0], null, 2));

      // Выводим ключи всех полей товара
      const productKeys = Object.keys(products[0]);
      console.log('[API] Поля товара:', productKeys.join(', '));

      // Проверяем наличие основных полей
      const requiredFields = ['id', 'title', 'price', 'images'];
      const missingFields = requiredFields.filter(field => !productKeys.includes(field));
      if (missingFields.length > 0) {
        console.warn('[API] Отсутствуют важные поля товара:', missingFields.join(', '));
      }
    }

    return {
      products,
      total,
      totalPages
    };
  } catch (error) {
    console.error('[API] Ошибка при загрузке продуктов:', error);

    // В случае ошибки возвращаем пустые данные
    return {
      products: [],
      total: 0,
      totalPages: 0
    };
  }
};
