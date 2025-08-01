import { ProductItem } from "@/components";
import { Product } from "@/interfaces";
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
      <div className="w-full py-16 flex flex-col items-center justify-center rounded-2xl bg-gray-50">
        <div className="bg-orange-50 p-6 rounded-full mb-6">
          <IoCartOutline className="w-16 h-16 text-orange-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Товары отсутствуют</h3>
        <p className="text-gray-500 text-center max-w-md">
          В данный момент товары недоступны. Пожалуйста, загляните позже или свяжитесь с нами для получения информации.
        </p>
        <RefreshButton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
});

ProductGrid.displayName = "ProductGrid";
