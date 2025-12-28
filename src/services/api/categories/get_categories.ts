import api from "../axios";
import type { GoodCategory } from "@/lib/legacy";

// Временные данные для заглушки API - будут использованы только если API недоступен
const mockCategories: GoodCategory[] = [
  {
    id: "1",
    title: "Инструменты",
    slug: "instruments",
    parent_id: null,
    children: [],
    totalProductCount: 150,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  },
  {
    id: "2",
    title: "Строительные материалы",
    slug: "building-materials",
    parent_id: null,
    children: [],
    totalProductCount: 200,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  },
  {
    id: "3",
    title: "Отделочные материалы",
    slug: "finishing-materials",
    parent_id: null,
    children: [],
    totalProductCount: 120,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  },
  {
    id: "4",
    title: "Сантехника",
    slug: "plumbing",
    parent_id: null,
    children: [],
    totalProductCount: 80,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  },
  {
    id: "5",
    title: "Электрика и освещение",
    slug: "electrical",
    parent_id: null,
    children: [],
    totalProductCount: 90,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  },
  {
    id: "6",
    title: "Крепёжные изделия",
    slug: "fasteners",
    parent_id: null,
    children: [],
    totalProductCount: 60,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,

  }
];

export const getCategories = async (): Promise<GoodCategory[]> => {
  try {
    console.log('Начинаем запрос категорий с API через axios');
    const response = await api.get('/categories/tree');

    console.log('Категории успешно получены:', response.data);

    // Проверяем, что данные корректны
    if (response.data && Array.isArray(response.data)) {
      // Фильтруем категории, у которых есть id и title
      const validCategories = response.data.filter(category =>
        category && category.id && category.title
      );

      if (validCategories.length > 0) {
        return validCategories;
      }
    }

    // Если данные некорректны, возвращаем тестовые данные
    console.log('Данные категорий некорректны, возвращаем тестовые данные');
    return mockCategories;
  } catch (error) {
    console.error('Ошибка при получении списка категорий:', error);
    console.log('Возвращаем тестовые данные категорий');
    // В случае ошибки возвращаем тестовые данные для демонстрации
    return mockCategories;
  }
};
