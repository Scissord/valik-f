import { ProductItem } from "@/interfaces/product";

interface Params {
  id: string; // В данном случае id используется как slug
}

// Временные данные для заглушки API
const mockProducts: ProductItem[] = [
  {
    id: "1",
    title: "Футболка базовая",
    description: "Базовая футболка из хлопка",
    price: 1999,
    images: ["/products/1473809-00-A_1_2000.jpg", "/products/1473809-00-A_alt.jpg"],
    slug: "basic-tshirt",
    inStock: 10,
    brand: "BrandName",
    brand_id: 1,
    unit: "шт",
    unit_id: 1,
    category: "Футболки",
    category_id: 1,
    rating: 4.5,
    article: 10001,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "базовая", "хлопок"],
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
    brand: "BrandName",
    brand_id: 1,
    unit: "шт",
    unit_id: 1,
    category: "Брюки",
    category_id: 2,
    rating: 4.2,
    article: 10002,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L", "XL"],
    tags: ["джинсы", "классические", "деним"],
    gender: "men"
  },
  {
    id: "3",
    title: "Кроссовки спортивные",
    description: "Легкие спортивные кроссовки",
    price: 5999,
    images: ["/products/1549268-00-A_0_2000.jpg", "/products/1549268-00-A_2.jpg"],
    slug: "sport-shoes",
    inStock: 8,
    brand: "BrandName",
    brand_id: 1,
    unit: "пара",
    unit_id: 2,
    category: "Обувь",
    category_id: 3,
    rating: 4.7,
    article: 10003,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L", "XL"],
    tags: ["обувь", "кроссовки", "спорт"],
    gender: "unisex"
  },
  {
    id: "4",
    title: "Шапка зимняя",
    description: "Теплая зимняя шапка",
    price: 1499,
    images: ["/products/1657915-00-A_0_2000.jpg", "/products/1657915-00-A_1.jpg"],
    slug: "winter-hat",
    inStock: 15,
    brand: "BrandName",
    brand_id: 1,
    unit: "шт",
    unit_id: 1,
    category: "Аксессуары",
    category_id: 4,
    rating: 4.3,
    article: 10004,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L"],
    tags: ["шапка", "зимняя", "аксессуары"],
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
    brand: "BrandName",
    brand_id: 1,
    unit: "шт",
    unit_id: 1,
    category: "Футболки",
    category_id: 1,
    rating: 4.6,
    article: 10005,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L", "XL"],
    tags: ["футболка", "принт", "хлопок"],
    gender: "unisex"
  },
  {
    id: "6",
    title: "Брюки чиносы",
    description: "Повседневные брюки чиносы",
    price: 3499,
    images: ["/products/1740211-00-A_0_2000.jpg", "/products/1740211-00-A_1.jpg"],
    slug: "chinos",
    inStock: 12,
    brand: "BrandName",
    brand_id: 1,
    unit: "шт",
    unit_id: 1,
    category: "Брюки",
    category_id: 2,
    rating: 4.4,
    article: 10006,
    created_at: Date.now(),
    updated_at: Date.now(),
    deleted_at: 0,
    sizes: ["S", "M", "L", "XL"],
    tags: ["брюки", "чиносы", "повседневные"],
    gender: "men"
  }
];

export const getProduct = async ({
  id,
}: Params) => {
  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`http://localhost:8080/products/${id}`);
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const product = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 100));

    // Поиск продукта по slug или ID
    const product = mockProducts.find(p => p.slug === id || p.id === id);
    
    if (!product) {
      throw new Error(`Продукт с ID ${id} не найден`);
    }

    return product;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении информации о продукте!");
  }
};
