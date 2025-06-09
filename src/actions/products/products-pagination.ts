import { prisma, Gender, Product, ProductImage } from "@/lib";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: string;
}

export const getPaginatedProductWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(take) || page < 1) take = 12;

  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: gender ? {
        gender: gender as Gender,
      } : undefined,
    });

    // Получаем общее количество продуктов
    const totalCount = await prisma.product.count({
      where: gender ? {
        gender: gender as Gender,
      } : undefined,
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(totalCount / take),
      products: products.map((product: Product) => ({
        ...product,
        images: product.ProductImage.map((image: ProductImage) => image.url),
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error("Произошла ошибка при получении продуктов");
  }
};
