import { GoodCategory } from "@/interfaces";

export const buildTree = (
  categories: GoodCategory[],
  parentId: number | null
): GoodCategory[] => {
  return categories
    .filter(cat => cat.parent_id === parentId)
    .map(cat => {
      const children = buildTree(categories, cat.id);
      const ownProductCount = cat._count.goods;
      const totalCount =
        ownProductCount + children.reduce((sum, child) => sum + (child.totalProductCount || 0), 0);

      return {
        ...cat,
        children,
        productCount: ownProductCount,
        totalProductCount: totalCount,
      };
    });
};
