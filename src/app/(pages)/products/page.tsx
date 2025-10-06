import { Pagination, ProductGrid } from "@/components";
import { getProductsForMainPage } from '@/api';
import { Product } from "@/interfaces/product.interface";

type SearchParams = { [page: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams);
  const page = params.page ? Number(params.page) : 1;

  // Добавляем обработку ошибок
  let products: Product[] = [];
  let totalPages = 0;

  try {
    const result = await getProductsForMainPage({
      page,
      limit: 20, // Показываем больше товаров на странице категории
    });

    products = result.products || [];
    const _total = result.total || 0;
    totalPages = result.totalPages || 0;
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    // В случае ошибки значения остаются по умолчанию
  }

  return (
    <div className="bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Наши товары</h1>
        <ProductGrid products={products} />
        {totalPages > 0 && (
          <div className="mt-8">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
