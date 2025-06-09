import { Product } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
  category_id: number;
}

// Временные данные для заглушки API
const mockCategories = [
  { id: 1, name: "Футболки", slug: "t-shirts" },
  { id: 2, name: "Брюки", slug: "pants" },
  { id: 3, name: "Обувь", slug: "shoes" },
  { id: 4, name: "Аксессуары", slug: "accessories" },
  { id: 11, name: "Футболки с принтом", slug: "print-t-shirts", parent_id: 1 },
  { id: 12, name: "Футболки базовые", slug: "basic-t-shirts", parent_id: 1 },
  { id: 21, name: "Джинсы", slug: "jeans", parent_id: 2 },
  { id: 22, name: "Чиносы", slug: "chinos", parent_id: 2 }
];

const mockChildrenCategories = [
  { id: 11, name: "Футболки с принтом", slug: "print-t-shirts", parent_id: 1 },
  { id: 12, name: "Футболки базовые", slug: "basic-t-shirts", parent_id: 1 },
  { id: 21, name: "Джинсы", slug: "jeans", parent_id: 2 },
  { id: 22, name: "Чиносы", slug: "chinos", parent_id: 2 }
];

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Футболка базовая",
    description: "Базовая футболка из хлопка",
    price: 1999,
    images: ["/products/1473809-00-A_1_2000.jpg", "/products/1473809-00-A_alt.jpg"],
    slug: "basic-tshirt",
    inStock: 10,
    category_id: 12,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "базовая", "хлопок"],
    gender: "unisex"
  },
  {
    id: "5",
    title: "Футболка с принтом",
    description: "Хлопковая футболка с оригинальным принтом",
    price: 2499,
    images: ["/products/1473814-00-A_1_2000.jpg", "/products/1473814-00-A_alt.jpg"],
    slug: "print-tshirt",
    inStock: 7,
    category_id: 11,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "принт", "хлопок"],
    gender: "unisex"
  },
  {
    id: "2",
    title: "Джинсы классические",
    description: "Классические джинсы прямого кроя",
    price: 3999,
    images: ["/products/1740176-00-A_0_2000.jpg", "/products/1740176-00-A_1.jpg"],
    slug: "classic-jeans",
    inStock: 5,
    category_id: 21,
    sizes: ["S", "M", "L", "XL"],
    tags: ["джинсы", "классические", "деним"],
    gender: "men"
  },
  {
    id: "6",
    title: "Брюки чиносы",
    description: "Повседневные брюки чиносы",
    price: 3499,
    images: ["/products/1740211-00-A_0_2000.jpg", "/products/1740211-00-A_1.jpg"],
    slug: "chinos",
    inStock: 12,
    category_id: 22,
    sizes: ["S", "M", "L", "XL"],
    tags: ["брюки", "чиносы", "повседневные"],
    gender: "men"
  },
  {
    id: "7",
    title: "Футболка с логотипом",
    description: "Футболка с логотипом бренда",
    price: 2199,
    images: ["/products/1473819-00-A_1_2000.jpg", "/products/1473819-00-A_alt.jpg"],
    slug: "logo-tshirt",
    inStock: 8,
    category_id: 11,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "логотип", "бренд"],
    gender: "unisex"
  },
  {
    id: "8",
    title: "Футболка однотонная",
    description: "Базовая однотонная футболка",
    price: 1799,
    images: ["/products/1473824-00-A_2_2000.jpg", "/products/1473829-00-A_2_2000.jpg"],
    slug: "plain-tshirt",
    inStock: 15,
    category_id: 12,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "однотонная", "базовая"],
    gender: "unisex"
  }
];

export const getProductsForCategory = async ({
  page = 1,
  limit = 9,
  category_id,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || page < 1) limit = 9;

  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`http://localhost:8080/products/categories/${category_id}?limit=${limit}&page=${page}`);
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const { category, products, children_categories, total, totalPages } = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 100));

    // Находим категорию
    const category = mockCategories.find(c => c.id === category_id);
    if (!category) {
      throw new Error(`Категория с ID ${category_id} не найдена`);
    }

    // Находим дочерние категории
    const children_categories = mockChildrenCategories.filter(c => c.parent_id === category_id);

    // Находим продукты по категории
    let categoryProducts = mockProducts.filter(p => p.category_id === category_id);
    
    // Если это родительская категория и у неё нет своих продуктов, 
    // показываем продукты из дочерних категорий
    if (categoryProducts.length === 0 && children_categories.length > 0) {
      const childrenIds = children_categories.map(c => c.id);
      categoryProducts = mockProducts.filter(p => {
        // Проверяем, что category_id определен и находится в списке childrenIds
        return p.category_id !== undefined && childrenIds.includes(p.category_id);
      });
    }
    
    // Пагинация
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
    const total = categoryProducts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      category,
      products: paginatedProducts,
      children_categories,
      total,
      totalPages
    };
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении продуктов по категории!");
  }
};
