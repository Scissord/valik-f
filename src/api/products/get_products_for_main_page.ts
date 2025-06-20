import { Product } from "@/interfaces";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Временные данные для заглушки API
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Футболка базовая",
    description: "Базовая футболка из хлопка",
    price: 1999,
    images: ["/products/1473809-00-A_1_2000.jpg", "/products/1473809-00-A_alt.jpg"],
    slug: "basic-tshirt",
    inStock: 10,
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
    sizes: ["S", "M", "L", "XL"],
    tags: ["брюки", "чиносы", "повседневные"],
    gender: "men"
  },
  {
    id: "7",
    title: "Куртка демисезонная",
    description: "Легкая куртка для прохладной погоды",
    price: 7999,
    images: ["/products/1693862-00-A_0_2000.jpg", "/products/1693862-00-A_1.jpg"],
    slug: "light-jacket",
    inStock: 6,
    sizes: ["S", "M", "L", "XL"],
    tags: ["куртка", "демисезон", "верхняя одежда"],
    gender: "unisex"
  },
  {
    id: "8",
    title: "Рубашка классическая",
    description: "Классическая рубашка для офиса",
    price: 2999,
    images: ["/products/1657921-00-A_0_2000.jpg", "/products/1657921-00-A_1.jpg"],
    slug: "classic-shirt",
    inStock: 9,
    sizes: ["S", "M", "L", "XL"],
    tags: ["рубашка", "классическая", "офис"],
    gender: "men"
  },
  {
    id: "9",
    title: "Свитер вязаный",
    description: "Теплый вязаный свитер",
    price: 3499,
    images: ["/products/1740231-00-A_0_2000.jpg", "/products/1740231-00-A_1.jpg"],
    slug: "knit-sweater",
    inStock: 11,
    sizes: ["S", "M", "L", "XL"],
    tags: ["свитер", "вязаный", "теплый"],
    gender: "unisex"
  },
  {
    id: "10",
    title: "Шорты спортивные",
    description: "Удобные шорты для спорта",
    price: 1999,
    images: ["/products/1740245-00-A_0_2000.jpg", "/products/1740245-00-A_1.jpg"],
    slug: "sport-shorts",
    inStock: 14,
    sizes: ["S", "M", "L", "XL"],
    tags: ["шорты", "спортивные", "удобные"],
    gender: "men"
  }
];

export const getProductsForMainPage = async ({
  page = 1,
  limit = 9,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || page < 1) limit = 9;

  try {
    // Заглушка API - возвращаем фиктивные данные
    // В реальном приложении здесь будет запрос к API
    // const response = await fetch(`http://localhost:8080/products/main?limit=${limit}&page=${page}`);
    // if (!response.ok) {
    //   throw new Error(`Ошибка HTTP: ${response.status}`);
    // }
    // const { products, total, totalPages } = await response.json();

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 100));

    // Пагинация для мок-данных
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = mockProducts.slice(startIndex, endIndex);
    const total = mockProducts.length;
    const totalPages = Math.ceil(total / limit);

    return {
      products: paginatedProducts,
      total,
      totalPages
    };
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении списка продуктов!");
  }
};
