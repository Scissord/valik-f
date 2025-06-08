"use server"
import { prisma } from "@/lib/prisma";

export const getStockBySlug = async (slug: string): Promise<number> => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
    select: { inStock: true },
  });
  if (!product) return 0;
  return product.inStock;
};
