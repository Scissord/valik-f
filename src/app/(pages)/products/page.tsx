import { Pagination, ProductGrid, Title } from "@/components";
import { getProductsForMainPage } from '@/api';

type SearchParams = { [page: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const localSearchParams = await searchParams;
  const page = localSearchParams.page ? Number(localSearchParams.page) : 1;

  const {
    products,
    total,
    totalPages
  } = await getProductsForMainPage({
    page,
    limit: 12, // Показываем больше товаров на странице категории
  });

  return (
    <div>
      <Title
        title="Каталог товаров"
        subtitle="Все товары"
        total={total}
      />

      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
