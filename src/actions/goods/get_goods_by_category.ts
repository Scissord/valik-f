import { prisma } from "@/lib/prisma";
import { buildTree } from "@/util";

interface PaginationOptions {
  page?: number;
  take?: number;
  category_id: number;
}

export const getGoodsByCategory = async ({
  page = 1,
  take = 12,
  category_id
}: PaginationOptions) => {
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(take) || page < 1) take = 12;

  try {
    const category = await prisma.goodCategory.findFirst({
      where: {
        id: category_id
      },
    });

    // GET ALL CATEGORIES
    const categories = await prisma.goodCategory.findMany({
      include: {
        _count: {
          select: { goods: true },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // TREE OF CHILDREN
    const children_categories = buildTree(categories, category_id);

    // GET CURRENT PRODUCTS
    const products = await prisma.good.findMany({
      take: take,
      skip: (page - 1) * take,
      where: {
        category_id
      },
      include: {
        images: true
      }
    });

    const total_count = await prisma.good.count({
      where: {
        category_id,
      },
    });

    return {
      current_page: page,
      total_pages: Math.ceil(total_count / take),
      products,
      children_categories,
      category
    };

  } catch (error) {
    console.log(error);
    throw new Error("Ocurrio un problema");
  }
};
