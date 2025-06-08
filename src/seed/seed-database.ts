import { initialData } from "./seed";
import { prisma } from "../lib/prisma";
import { countries } from "./seed-countries";
import { goods } from './seed_good';
import { good_categories } from './seed_good_categories';

async function main() {
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.country.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.goodImage.deleteMany();
  await prisma.goodCategory.deleteMany();
  await prisma.good.deleteMany();

  const { categories, products, users } = initialData;

  // Пользователи
  await prisma.user.createMany({ data: users });

  // Категории
  const categoriesData = categories.map((category) => ({ name: category }));
  await prisma.category.createMany({ data: categoriesData });

  const categoriesDb = await prisma.category.findMany();
  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name] = category.id;
    return map;
  }, {} as Record<string, string>);

  // Страны
  await prisma.country.createMany({
    data: countries
  })

  // Продукты
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: { ...rest, categoryId: categoriesMap[type] },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));
    await prisma.productImage.createMany({ data: imagesData });
  });

  // Мои категории
  await prisma.goodCategory.createMany({ data: good_categories });

  // Товары
  await prisma.good.createMany({ data: goods });

  console.log("Seed successfully updated!");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
