/**
 * Заглушка для Prisma с фиктивными данными
 * Временное решение до интеграции с внешним API
 */

// Экспорт типов из @prisma/client
export enum Gender {
  men = "men",
  women = "women",
  kid = "kid",
  unisex = "unisex"
}

export enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
  XXXL = "XXXL"
}

export enum Role {
  admin = "admin",
  user = "user"
}

export interface Product {
  id: string;
  title: string;
  description: string;
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  gender: Gender;
  categoryId: string;
  ProductImage: ProductImage[];
}

export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  emailVerified: Date | null;
}

export interface Country {
  id: string;
  name: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: Size;
  orderId: string;
  productId: string;
}

export interface Order {
  id: string;
  subTotal: number;
  taxt: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  userId: string;
  transactionId?: string | null;
}

// Типы для параметров функций
interface WhereUser {
  id?: string;
  email?: string;
}

interface WhereProduct {
  id?: string;
  slug?: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  emailVerified?: Date | null;
  [key: string]: any;
}

// Интерфейс для пользователя в хранилище
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  emailVerified: Date | null;
}

// Фиктивные данные для демонстрации
const mockData = {
  users: [
    {
      id: "1",
      name: "Администратор",
      email: "admin@example.com",
      password: "$2a$10$Qka1.EtdnQGnQTCVvlAFUOu.7ByBcSpqpP/Xjc3KaGHQ9h7LIkp9m", // password: 123456
      role: "admin",
      emailVerified: new Date(),
    },
    {
      id: "2",
      name: "Пользователь",
      email: "user@example.com",
      password: "$2a$10$Qka1.EtdnQGnQTCVvlAFUOu.7ByBcSpqpP/Xjc3KaGHQ9h7LIkp9m", // password: 123456
      role: "user",
      emailVerified: new Date(),
    },
  ] as StoredUser[],
  products: [
    {
      id: "1",
      title: "Футболка",
      description: "Базовая футболка",
      inStock: 10,
      price: 19.99,
      sizes: ["S", "M", "L"],
      slug: "basic-tshirt",
      tags: ["футболка", "базовая"],
      gender: "unisex",
      categoryId: "1",
      ProductImage: [
        { id: 1, url: "https://example.com/image1.jpg", productId: "1" },
        { id: 2, url: "https://example.com/image2.jpg", productId: "1" }
      ]
    },
  ] as Product[],
  categories: [
    { id: "1", name: "Футболки" },
    { id: "2", name: "Брюки" },
  ],
  countries: [
    { id: "RU", name: "Россия" },
    { id: "US", name: "США" },
  ],
};

// Заглушка для Prisma Client
export const prisma = {
  user: {
    findUnique: async ({ where }: { where: WhereUser }) => {
      return mockData.users.find(user => user.email === where.email || user.id === where.id) || null;
    },
    findMany: async () => {
      return mockData.users;
    },
    create: async ({ data }: { data: UserData }) => {
      const newUser: StoredUser = { 
        id: `${mockData.users.length + 1}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || "user",
        emailVerified: data.emailVerified || null,
      };
      mockData.users.push(newUser);
      return newUser;
    },
    update: async ({ where, data }: { where: WhereUser; data: Partial<UserData> }) => {
      const userIndex = mockData.users.findIndex(user => user.id === where.id);
      if (userIndex >= 0) {
        mockData.users[userIndex] = { ...mockData.users[userIndex], ...data };
        return mockData.users[userIndex];
      }
      return null;
    },
  },
  product: {
    findUnique: async ({ where }: { where: WhereProduct }) => {
      return mockData.products.find(product => product.slug === where.slug || product.id === where.id) || null;
    },
    findMany: async ({ take, skip, include, where }: { 
      take?: number, 
      skip?: number, 
      include?: any,
      where?: any 
    } = {}) => {
      let filteredProducts = [...mockData.products];
      
      // Фильтрация по gender, если указано
      if (where && where.gender) {
        filteredProducts = filteredProducts.filter(p => p.gender === where.gender);
      }
      
      // Пагинация
      if (skip !== undefined) {
        filteredProducts = filteredProducts.slice(skip);
      }
      
      if (take !== undefined) {
        filteredProducts = filteredProducts.slice(0, take);
      }
      
      return filteredProducts;
    },
    count: async ({ where }: { where?: any } = {}) => {
      let count = mockData.products.length;
      
      // Фильтрация по gender, если указано
      if (where && where.gender) {
        count = mockData.products.filter(p => p.gender === where.gender).length;
      }
      
      return count;
    },
    create: async ({ data }: { data: any }) => {
      const newProduct = {
        id: `${mockData.products.length + 1}`,
        ...data,
        ProductImage: []
      };
      mockData.products.push(newProduct as Product);
      return newProduct;
    },
    update: async ({ where, data }: { where: WhereProduct; data: any }) => {
      const productIndex = mockData.products.findIndex(product => product.id === where.id);
      if (productIndex >= 0) {
        mockData.products[productIndex] = { ...mockData.products[productIndex], ...data };
        return mockData.products[productIndex];
      }
      return null;
    },
  },
  productImage: {
    createMany: async ({ data }: { data: any[] }) => {
      // Создаем изображения для продукта
      return { count: data.length };
    },
  },
  category: {
    findMany: async (options: { orderBy?: any } = {}) => {
      // Если нужно сортировать по имени
      if (options.orderBy && options.orderBy.name === "desc") {
        return [...mockData.categories].sort((a, b) => b.name.localeCompare(a.name));
      } else if (options.orderBy && options.orderBy.name === "asc") {
        return [...mockData.categories].sort((a, b) => a.name.localeCompare(b.name));
      }
      return mockData.categories;
    },
  },
  country: {
    findMany: async () => {
      return mockData.countries;
    },
  },
  // Транзакции
  $transaction: async (callback: () => Promise<any>) => {
    return await callback();
  }
};

// Заглушка для глобального объекта Prisma
const globalForPrisma = global as unknown as { prisma: typeof prisma };
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 