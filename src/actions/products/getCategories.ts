"use server";

import { prisma } from "@/lib";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "desc",
      },
    });
    return {
      ok: true,
      categories,
    };
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    return {
      ok: false,
      categories:[],
      message: "Ошибка при получении списка категорий"
    };
  }
};
