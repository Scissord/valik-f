export const revalidate = 604800; //7 dias
import { Pagination, ProductGrid } from "@/components";
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

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Минималистичный заголовок категории */}
      {category?.title && (
        <h1 className="text-xl font-medium text-gray-900 mb-4">{category.title}</h1>
      )}

      {/* Простые чипсы подкатегорий */}
      {children_categories?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {children_categories.map((child) => (
            <Link
              key={child.id}
              href={`/categories/${child.id}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-orange-100 transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}

      {/* Товары */}
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
