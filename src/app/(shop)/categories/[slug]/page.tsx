export const revalidate = 604800; //7 dias
import { Pagination, ProductBreadcrumbs, ProductGrid, Title } from "@/components";
// import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsForCategory, getCategories } from '@/api'

type Props = {
  params: Promise<{ slug: number }>;
  searchParams: { page?: string };
};

export default async function ProductPage({
  params,
  searchParams
}: Props) {
  const { slug } = await params;
  const page = +(searchParams.page || 1);

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
    category_id: +slug,
  });

  // if (!product) {
  //   notFound();
  // }

  return (
    <>
      <div className="flex items-start gap-7">
        <ProductBreadcrumbs
          product_categories={categories}
          className="relative"
        />
        <div>
          <Title
            title={"Категории"}
            subtitle={category?.title || "Продукты"}
            total={total}
          />
          <ProductGrid products={products} />
          <div className="grid grid-cols-6 gap-3">
            {children_categories?.length > 0 && children_categories?.map((category) => (
              <Link
                key={category.id}
                className="text-xs p-6 flex items-center justify-center border rounded shadow-lg hover:opacity-50 transition-all duration-300 ease-in-out cursor-pointer"
                href={`/categories/${category.id}`}
              >
                {category.title}
              </Link>
            ))}
          </div>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
