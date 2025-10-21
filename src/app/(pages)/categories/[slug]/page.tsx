export const revalidate = 604800; //7 dias
import { Pagination, ProductGrid, Breadcrumbs, BreadcrumbItem } from "@/components";
// import { notFound } from "next/navigation";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
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
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 py-4">
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
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-100/60 rounded-full blur-3xl scale-125" />
            <div className="relative bg-white border border-gray-200 rounded-full p-7">
              <IoCartOutline className="w-16 h-16 text-orange-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Товары временно недоступны
          </h2>
          <p className="text-gray-600 max-w-lg">
            Мы уже работаем над обновлением ассортимента. Попробуйте заглянуть позже или вернитесь к общему каталогу.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 font-medium shadow-sm transition hover:from-orange-600 hover:to-orange-500"
          >
            Смотреть все товары
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
