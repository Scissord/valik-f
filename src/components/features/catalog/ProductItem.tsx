"use client";
import { ProductImage } from "@/components";
import { Product, CartItem, currencyFormat } from "@/lib/legacy";
import Link from "next/link";
import React, { useState, memo, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore } from "@/lib/legacy";

interface Props {
  product: Product;
}

export const ProductItem = memo(({ product }: Props) => {
  const getValidImageUrl = (url: string | undefined) => {
    if (!url || url.trim() === '' || url === 'h' || url.length < 3) {
      return "/imgs/placeholder.png";
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/')) {
      return url;
    }

    return `/${url}`;
  };

  const defaultImage = getValidImageUrl(product.images?.[0]);
  const hoverImage = getValidImageUrl(product.images?.[1]) !== "/imgs/placeholder.png"
    ? getValidImageUrl(product.images?.[1])
    : defaultImage;

  const [displayImage, setDisplayImage] = useState(defaultImage);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addProductToCart = useCartStore((state) => state.addProductToCart);

  useEffect(() => {
    setDisplayImage(defaultImage);
  }, [defaultImage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    const cartProduct: CartItem = {
      ...product,
      quantity: 1
    };

    addProductToCart(cartProduct);

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage
            url={displayImage}
            name={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={300}
            height={300}
            onMouseEnter={() => setDisplayImage(hoverImage)}
            onMouseLeave={() => setDisplayImage(defaultImage)}
          />
        </div>
      </Link>

      <div className="p-4">
        <Link
          href={`/product/${product.id}`}
          className="block mb-2.5"
        >
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
            {product.name || 'Без названия'}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Цена</span>
            <div className="text-lg font-semibold text-gray-900">
              {currencyFormat(Number(product.price) || 0)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="text-orange-500 hover:text-orange-600 transition-colors p-1"
          >
            {isAddingToCart ? (
              <svg
                className="animate-spin h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <IoCartOutline className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="mt-1">
          <div className="space-y-1 text-xs text-gray-500">
            {(product.article !== undefined && product.article !== null) && (
              <div className="flex justify-between">
                <span>Артикул:</span>
                <span className="font-mono">{String(product.article)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductItem.displayName = "ProductItem";

// ✅ ДОБАВЛЕНО: Функция сравнения для оптимизации memo
export const MemoizedProductItem = memo(ProductItem, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.images?.[0] === nextProps.product.images?.[0]
  );
});
