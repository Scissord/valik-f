"use client";
import { ProductImage } from "@/components";
import { Product } from "@/lib/legacy";
import Link from "next/link";
import React, { useState, memo, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useCartStore } from "@/lib/legacy";
import { CartItem } from "@/lib/legacy";

interface Props {
  product: Product;
}

export const ProductItem = memo(({ product }: Props) => {
  // Проверяем и очищаем URL изображений
  const getValidImageUrl = (url: string | undefined) => {
    if (!url || url.trim() === '' || url === 'h' || url.length < 3) {
      return "/placeholder.jpg";
    }

    // Если это уже полный URL (http/https), возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Если URL начинается с /, возвращаем как есть
    if (url.startsWith('/')) {
      return url;
    }

    // Если это относительный путь, добавляем /
    return `/${url}`;
  };

  const defaultImage = getValidImageUrl(product.images?.[0]);
  const hoverImage = getValidImageUrl(product.images?.[1]) !== "/placeholder.jpg"
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
      quantity: 1,
      image: getValidImageUrl(product.images?.[0])
    };

    addProductToCart(cartProduct);

    setTimeout(() => {
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Изображение товара */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage
            url={displayImage}
            title={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={300}
            height={300}
            onMouseEnter={() => setDisplayImage(hoverImage)}
            onMouseLeave={() => setDisplayImage(defaultImage)}
          />

          {/* Бейдж бренда */}
          {product.brand && (
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.brand}
            </div>
          )}
        </div>
      </Link>

      {/* Контент карточки */}
      <div className="p-4">
        {/* Название товара */}
        <Link
          href={`/product/${product.id}`}
          className="block mb-3"
        >
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Цена и кнопка */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Цена</span>
            <div className="text-lg font-semibold text-gray-900">
              {typeof product.price === "number"
                ? product.price.toLocaleString("ru-RU")
                : "0"}{" "}
              ₸
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`inline-flex items-center justify-center gap-1 rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${isAddingToCart
                ? "bg-green-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
          >
            {isAddingToCart ? (
              <svg
                className="animate-spin h-4 w-4"
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
              <>
                <IoCartOutline className="h-4 w-4" />
                <span className="hidden sm:inline">В корзину</span>
              </>
            )}
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-3 pt-3 border-t border-gray-100 hidden group-hover:block">
          <div className="space-y-1 text-xs text-gray-500">
            {product.category && (
              <div className="flex justify-between">
                <span>Категория:</span>
                <span className="font-medium">{product.category}</span>
              </div>
            )}
            {product.unit && (
              <div className="flex justify-between">
                <span>Единица:</span>
                <span className="font-medium">{product.unit}</span>
              </div>
            )}
            {product.articul && (
              <div className="flex justify-between">
                <span>Артикул:</span>
                <span className="font-mono">{product.articul}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductItem.displayName = "ProductItem";
