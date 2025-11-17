import { ProductItem } from "@/components";
import { Product } from "@/lib/legacy";
import { IoCartOutline } from "react-icons/io5";
import { RefreshButton } from "@/components";
import { memo } from "react";

interface Props {
  products: Product[];
}

export const ProductGrid = memo(({ products }: Props) => {
  // Проверяем, есть ли товары
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-100/60 rounded-full blur-3xl scale-125" />
          <div className="relative bg-white border border-gray-200 rounded-full p-7">
            <IoCartOutline className="w-16 h-16 text-orange-400" />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Товары временно недоступны</h3>
        <p className="text-gray-600 max-w-lg mb-6">
          Мы уже работаем над обновлением ассортимента. Попробуйте обновить страницу или загляните позже — новые предложения появятся совсем скоро.
        </p>
        <RefreshButton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
});

ProductGrid.displayName = "ProductGrid";
