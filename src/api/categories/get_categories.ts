import api from "../axios";
import { GoodCategory } from "@/interfaces";

// Временные данные для заглушки API - будут использованы только если API недоступен
const mockCategories: GoodCategory[] = [
  { 
    id: "1", 
    title: "Категория 1", 
    slug: "category_1",
    parent_id: null,
    children: [
      { 
        id: "11", 
        title: "Подкатегория 1-1", 
        slug: "subcategory_1_1",
        parent_id: "1",
        totalProductCount: 30,
        created_at: "1750934812775",
        updated_at: "1750934812775",
        deleted_at: null,
        children: []
      },
      { 
        id: "12", 
        title: "Подкатегория 1-2", 
        slug: "subcategory_1_2",
        parent_id: "1",
        totalProductCount: 20,
        created_at: "1750934812775",
        updated_at: "1750934812775",
        deleted_at: null,
        children: []
      }
    ],
    totalProductCount: 50,
    created_at: "1750934812775",
    updated_at: "1750934812775",
    deleted_at: null
  },
  { 
    id: "2", 
    title: "Категория 2", 
    slug: "category_2",
    parent_id: null,
    children: [
      { 
        id: "21", 
        title: "Подкатегория 2-1", 
        slug: "subcategory_2_1",
        parent_id: "2",
        totalProductCount: 25,
        created_at: "1750934812775",
        updated_at: "1750934812775",
        deleted_at: null,
        children: []
      },
      { 
        id: "22", 
        title: "Подкатегория 2-2", 
        slug: "subcategory_2_2",
        parent_id: "2",
        totalProductCount: 15,
        created_at: "1750934812775",
        updated_at: "1750934812775",
        deleted_at: null,
        children: []
      }
    ],
    totalProductCount: 40,
    created_at: "1750934812775",
    updated_at: "1750934812775",
    deleted_at: null
  },
  { 
    id: "3", 
    title: "Категория 3", 
    slug: "category_3",
    parent_id: null,
    totalProductCount: 30,
    created_at: "1750934812775",
    updated_at: "1750934812775",
    deleted_at: null,
    children: []
  },
  { 
    id: "4", 
    title: "Категория 4", 
    slug: "category_4",
    parent_id: null,
    totalProductCount: 20,
    created_at: "1750934812775",
    updated_at: "1750934812775",
    deleted_at: null,
    children: []
  }
];

export const getCategories = async (): Promise<GoodCategory[]> => {
  try {
    console.log('Начинаем запрос категорий с API через axios');
    const response = await api.get('/categories/tree');
    
    console.log('Категории успешно получены:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка категорий:', error);
    console.log('Возвращаем тестовые данные категорий');
    // В случае ошибки возвращаем пустой массив или тестовые данные
    return [];
  }
};
