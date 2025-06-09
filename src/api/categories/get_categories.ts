import { GoodCategory } from "@/interfaces";

// Временные данные для заглушки API
const mockCategories: GoodCategory[] = [
  { 
    id: 1, 
    name: "Футболки", 
    parent_id: null,
    _count: { goods: 5 },
    children: [
      { 
        id: 11, 
        name: "Футболки с принтом", 
        parent_id: 1,
        _count: { goods: 3 },
        children: []
      },
      { 
        id: 12, 
        name: "Футболки базовые", 
        parent_id: 1,
        _count: { goods: 2 },
        children: []
      }
    ]
  },
  { 
    id: 2, 
    name: "Брюки", 
    parent_id: null,
    _count: { goods: 4 },
    children: [
      { 
        id: 21, 
        name: "Джинсы", 
        parent_id: 2,
        _count: { goods: 2 },
        children: []
      },
      { 
        id: 22, 
        name: "Чиносы", 
        parent_id: 2,
        _count: { goods: 2 },
        children: []
      }
    ]
  },
  { 
    id: 3, 
    name: "Обувь", 
    parent_id: null,
    _count: { goods: 3 },
    children: []
  },
  { 
    id: 4, 
    name: "Аксессуары", 
    parent_id: null,
    _count: { goods: 2 },
    children: []
  }
];

export const getCategories = async (): Promise<GoodCategory[]> => {
  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch('http://localhost:8080/categories');
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const categories = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 100));

    return mockCategories;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
