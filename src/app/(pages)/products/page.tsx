import { Pagination, ProductGrid } from "@/components";
import { getProductsForMainPage, Product } from '@/lib/legacy';
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

type SearchParams = { [page: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await Promise.resolve(searchParams);
  const page = params.page ? Number(params.page) : 1;

  // Ð”Ð¾Ð±Ð°Ð²Ð»ÑÐµÐ¼ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÑƒ Ð¾ÑˆÐ¸Ð±Ð¾Ðº
  let products: Product[] = [];
  let totalPages = 0;

  try {
    const result = await getProductsForMainPage({
      page,
      limit: 20, // ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÐ¼ Ð±Ð¾Ð»ÑŒÑˆÐµ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸
    });

    products = result.products || [];
    const _total = result.total || 0;
    totalPages = result.totalPages || 0;
  } catch (error) {
    console.error("ÐžÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð²:", error);
    // Ð’ ÑÐ»ÑƒÑ‡Ð°Ðµ Ð¾ÑˆÐ¸Ð±ÐºÐ¸ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ Ð¾ÑÑ‚Ð°ÑŽÑ‚ÑÑ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ
  }

  const showEmptyState = products.length === 0;

  if (showEmptyState) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange-100/60 rounded-full blur-3xl scale-125" />
              <div className="relative bg-white border border-gray-200 rounded-full p-8">
                <IoCartOutline className="w-20 h-20 text-orange-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Товары временно недоступны
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg">
              Мы обновляем ассортимент. Попробуйте заглянуть позже или вернитесь к каталогу, чтобы продолжить покупки.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 font-medium shadow-sm transition hover:from-orange-600 hover:to-orange-500"
            >
              <FaArrowLeft className="w-4 h-4" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ProductGrid products={products} />
        {totalPages > 0 && (
          <div className="mt-10">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

