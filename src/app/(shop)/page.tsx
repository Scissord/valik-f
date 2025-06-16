import { Pagination, ProductGrid, Title, ProductBreadcrumbs } from "@/components";
import { getProductsForMainPage, getCategories } from '@/api'

type SearchParams = Promise<{ [page: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const page = params.page ? Number(params.page) : 1;

  const categories = await getCategories();
  const {
    products,
    total,
    totalPages
  } = await getProductsForMainPage({
    page,
    limit: 9,
  });

  // Отладочная информация
  console.log('Home Page Debug:', {
    page,
    productsCount: products?.length || 0,
    total,
    totalPages
  });

  return (
    <>
      <div className="flex flex-col md:flex-row items-start gap-7">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <ProductBreadcrumbs
            product_categories={categories}
            className="w-full md:w-auto"
          />
        </div>
        <div className="flex-1">
          <Title
            title={"Магазин"}
            subtitle="Все продукты"
            total={total}
          />

          {/* Отладочная информация (только в режиме разработки) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
              <p>Debug Info:</p>
              <p>Page: {page}</p>
              <p>Products: {products?.length || 0}</p>
              <p>Total: {total}</p>
              <p>Total Pages: {totalPages}</p>
            </div>
          )}

          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
