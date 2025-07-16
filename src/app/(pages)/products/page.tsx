import { Pagination, ProductGrid } from "@/components";
import { getProductsForMainPage } from '@/api';

type SearchParams = { [page: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams);
  const page = params.page ? Number(params.page) : 1;

  // Добавляем обработку ошибок
  let products = [];
  let total = 0;
  let totalPages = 0;

  try {
    const result = await getProductsForMainPage({
      page,
      limit: 12, // Показываем больше товаров на странице категории
    });

    products = result.products || [];
    total = result.total || 0;
    totalPages = result.totalPages || 0;
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    // В случае ошибки значения остаются по умолчанию
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductGrid products={products} />
      {totalPages > 0 && <Pagination totalPages={totalPages} />}
    </div>
  );
}
