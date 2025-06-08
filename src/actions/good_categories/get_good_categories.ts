import { prisma } from "@/lib/prisma";
import { buildTree } from "@/util";

// TODO: RENAME THIS FILE IN GET CATEGORIES

export const getGoodCategories = async () => {
  try {
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

    const good_categories = buildTree(categories, null);

    return {
      good_categories,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении списка категорий!");
  }
};
