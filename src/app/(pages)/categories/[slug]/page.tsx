export const revalidate = 604800; //7 dias
import { Pagination, ProductGrid, Title } from "@/components";
// import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsForCategory, getCategories } from '@/api'

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ProductPage({
  params,
  searchParams
}: Props) {
  const { slug } = await params;
  const localPage = await searchParams;
  const page = +(localPage.page || 1);

  const categories = await getCategories();
  const {
    category,
    products,
    children_categories,
    total,
    totalPages
  } = await getProductsForCategory({
    page,
    limit: 9,
    category_id: slug,
  });

  // if (!product) {
  //   notFound();
  // }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start gap-7">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          {/* <ProductBreadcrumbs
            product_categories={categories}
            className="w-full md:w-auto"
          /> */}
        </div>
        <div className="flex-1">
          <Title
            title={"Категории"}
            subtitle={category?.title || "Продукты"}
            total={total}
          />
          
          {children_categories?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3 text-gray-600">Подкатегории</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {/* {children_categories?.map((category) => (
                  <Link
                    key={category.id}
                    className="p-3 flex items-center justify-center border border-gray-100 rounded
                              bg-white hover:bg-orange-50 hover:border-orange-100
                              text-gray-700 hover:text-gray-700 transition-all duration-200 ease-in-out cursor-pointer"
                    href={`/categories/${category.id}`}
                  >
                    <span className="text-sm">{category.title}</span>
                  </Link>
                ))} */}
              </div>
            </div>
          )}
          
          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
