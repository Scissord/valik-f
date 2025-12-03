export const revalidate = 604800; //7 dias
import { Pagination, ProductGrid, Breadcrumbs, BreadcrumbItem } from "@/components";
// import { notFound } from "next/navigation";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { getProductsForCategory, getCategories } from '@/lib/legacy'

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
    total: _total,
    totalPages
  } = await getProductsForCategory({
    page,
    limit: 9,
    category_id: slug,
  });

  // Создаем хлебные крошки
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Каталог",
      href: "/categories"
    }
  ];

  // Если есть родительская категория, добавляем её
  if (category?.parent_id) {
    const parentCategory = categories.find(cat => cat.id === category.parent_id);
    if (parentCategory) {
      breadcrumbItems.push({
        label: parentCategory.title,
        href: `/categories/${parentCategory.id}`
      });
    }
  }

  // Добавляем текущую категорию как активную
  if (category?.title) {
    breadcrumbItems.push({
      label: category.title,
      isActive: true
    });
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Хлебные крошки */}
      <Breadcrumbs items={breadcrumbItems} className="mb-4" />

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
      {products && products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-start text-center min-h-[55vh] translate-y-[40%]">
          <div className="mb-6 sm:mb-8">
            <IoCartOutline className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Товары временно недоступны
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-md text-sm sm:text-base">
            Мы уже работаем над обновлением ассортимента. Попробуйте заглянуть позже или вернитесь к общему каталогу.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
