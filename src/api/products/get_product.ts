import { ProductItem } from "@/interfaces/product";

interface Params {
  id: string; // В данном случае id используется как slug
}

export const getProduct = async ({
  id,
}: Params) => {
  try {
    // Реальный запрос к API
    const response = await fetch(`http://localhost:8080/products/${id}`, {
      cache: 'no-store', // Отключаем кеширование для получения актуальных данных
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const product = await response.json();

    if (!product) {
      throw new Error(`Продукт с ID ${id} не найден`);
    }

    return product;
  } catch (error) {
    console.error('Ошибка при загрузке продукта:', error);
    throw new Error("Ошибка при получении информации о продукте!");
  }
};
