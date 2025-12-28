'use client';

import { CheckoutModal } from "@/components";
import { EmptyCartState } from "@/components/features/cart/EmptyCartState";
import { useCartStore, CartItem } from "@/lib/legacy";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoAddOutline, IoRemoveOutline, IoTrashOutline, IoChevronForwardOutline } from "react-icons/io5";
import { currencyFormat } from "@/lib/legacy";
import { useShallow } from 'zustand/react/shallow';

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CartItemCardProps {
  product: CartItem;
  updateProductQuantity: (product: CartItem, quantity: number) => void;
  deleteProduct: (product: CartItem) => void;
}

const CartItemCard = ({ product, updateProductQuantity, deleteProduct }: CartItemCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = startX.current - e.touches[0].clientX;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 80));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swipeOffset > 60) {
      setSwipeOffset(80);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleDelete = () => {
    deleteProduct(product);
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-3">
      {/* Delete button behind - mobile only */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center sm:hidden"
        onClick={handleDelete}
      >
        <IoTrashOutline className="w-6 h-6 text-white" />
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className="relative bg-white border border-gray-100 rounded-xl p-4 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-4">
          {/* Image */}
          <Link href={`/product/${product.id}`} className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                width={80}
                height={80}
                alt={product.title}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <Link
              href={`/product/${product.id}`}
              className="text-sm font-medium text-gray-900 hover:text-orange-500 transition-colors line-clamp-2"
            >
              {product.title}
            </Link>

            <div className="mt-2 flex items-center justify-between">
              {/* Quantity controls */}
              <div className="flex items-center bg-gray-50 rounded-lg">
                <button
                  onClick={() => updateProductQuantity(product, Math.max(1, product.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                  disabled={product.quantity <= 1}
                >
                  <IoRemoveOutline className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{product.quantity}</span>
                <button
                  onClick={() => updateProductQuantity(product, product.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <IoAddOutline className="w-4 h-4" />
                </button>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {currencyFormat(product.price * product.quantity)}
                </div>
                {product.quantity > 1 && (
                  <div className="text-xs text-gray-500">
                    {currencyFormat(product.price)} / шт
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop delete button */}
          <button
            onClick={handleDelete}
            className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center text-gray-400 hover:text-red-500 transition-colors self-center"
          >
            <IoTrashOutline className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const [loaded, setLoaded] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const { cart, updateProductQuantity, deleteProduct } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      updateProductQuantity: state.updateProductQuantity,
      deleteProduct: state.deleteProduct
    }))
  );

  const summary = loaded ? {
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: cart.reduce((count, item) => count + item.quantity, 0)
  } : { total: 0, count: 0 };

  const updatePricesFromBackend = useCallback(async () => {
    if (isUpdatingPrices || cart.length === 0) return;

    setIsUpdatingPrices(true);
    try {
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await fetch(`${baseURL}/products/${item.id}`);
            if (!response.ok) return item;

            const productData = await response.json();
            if (productData.price !== item.price) {
              return { ...item, price: productData.price };
            }
            return item;
          } catch (error) {
            console.error(`Ошибка при обновлении цены товара ${item.id}:`, error);
            return item;
          }
        })
      );

      updatedCart.forEach(item => {
        const originalItem = cart.find(cartItem => cartItem.id === item.id);
        if (originalItem && item.price !== originalItem.price) {
          updateProductQuantity(item, item.quantity);
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
    } finally {
      setIsUpdatingPrices(false);
    }
  }, [cart, isUpdatingPrices, updateProductQuantity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      updatePricesFromBackend();
    }
  }, [loaded, updatePricesFromBackend]);

  if (!loaded) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-4 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
          <span className="text-sm text-gray-500">{summary.count} товаров</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Cart items */}
          <div className="lg:col-span-2">
            {cart.map((product) => (
              <CartItemCard
                key={`${product.id}-${product.added_at}`}
                product={product}
                updateProductQuantity={updateProductQuantity}
                deleteProduct={deleteProduct}
              />
            ))}

            {/* Continue shopping link */}
            <Link
              href="/products"
              className="inline-block mt-4 text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              Продолжить покупки
            </Link>
          </div>

          {/* Right column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Сводка заказа</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Товары ({summary.count})</span>
                  <span className="text-gray-900">{currencyFormat(summary.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Доставка</span>
                  <span className="text-orange-500">Рассчитывается</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого</span>
                  <span className="text-xl font-bold text-gray-900">{currencyFormat(summary.total)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                Оформить заказ
                <IoChevronForwardOutline className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
}
