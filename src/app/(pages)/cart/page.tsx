'use client';

import { CheckoutModal } from "@/components";
import { EmptyCartState } from "@/components/features/cart/EmptyCartState";
import { useCartStore, CartItem } from "@/lib/legacy";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FaRegTrashCan, FaArrowLeft } from "react-icons/fa6";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { currencyFormat } from "@/lib/legacy";
import { useShallow } from 'zustand/react/shallow';

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CartItemRowProps {
  product: CartItem;
  updateProductQuantity: (product: CartItem, quantity: number) => void;
  deleteProduct: (product: CartItem) => void;
}

const CartItemRow = ({ product, updateProductQuantity, deleteProduct }: CartItemRowProps) => {
  const [localQuantity, setLocalQuantity] = useState(product.quantity.toString());

  useEffect(() => {
    setLocalQuantity(product.quantity.toString());
  }, [product.quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLocalQuantity(value);
    }
  };

  const handleBlur = () => {
    let newQuantity = parseInt(localQuantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    setLocalQuantity(newQuantity.toString());
    if (newQuantity !== product.quantity) {
      updateProductQuantity(product, newQuantity);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="py-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          width={80}
          height={80}
          alt={product.title}
          className="object-contain"
        />
      </div>
      <div className="flex-grow">
        <Link href={`/product/${product.id}`} className="text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors">
          {product.title}
        </Link>
        <div className="mt-1 text-sm text-gray-500">
          Артикул: {product.articul}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => updateProductQuantity(product, Math.max(1, product.quantity - 1))}
                className="p-2 text-gray-500 hover:text-orange-500"
                disabled={product.quantity <= 1}
              >
                <IoRemoveCircleOutline className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={localQuantity}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="w-12 text-center border-x border-gray-200 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                onClick={() => updateProductQuantity(product, product.quantity + 1)}
                className="p-2 text-gray-500 hover:text-orange-500"
              >
                <IoAddCircleOutline className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => deleteProduct(product)}
              className="text-red-500 hover:text-red-600 p-2"
            >
              <FaRegTrashCan className="w-4 h-4" />
            </button>
          </div>
          <div className="font-semibold text-lg">
            <div className="text-right">
              {currencyFormat(product.price * product.quantity)}
            </div>
            <div className="text-xs text-gray-500 text-right">
              {currencyFormat(product.price)} за шт.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const [loaded, setLoaded] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Используем useShallow для предотвращения лишних ререндеров
  const { cart, updateProductQuantity, deleteProduct } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      updateProductQuantity: state.updateProductQuantity,
      deleteProduct: state.deleteProduct
    }))
  );

  // Группируем товары по дате добавления
  const groupedCart = cart.reduce((acc, product) => {
    const date = product.added_at ? new Date(product.added_at).toLocaleDateString('ru-RU') : 'Без даты';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(product);
    return acc;
  }, {} as Record<string, typeof cart>);

  // Вычисляем summary только когда корзина загружена и только при изменении cart
  const summary = loaded ? {
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: cart.reduce((count, item) => count + item.quantity, 0)
  } : { total: 0, count: 0 };

  const updatePricesFromBackend = useCallback(async () => {
    if (isUpdatingPrices || cart.length === 0) return;

    setIsUpdatingPrices(true);
    try {
      // Получаем актуальные цены для всех товаров в корзине
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            // Запрос к бэкенду для получения актуальной цены
            const response = await fetch(`${baseURL}/products/${item.id}`);
            if (!response.ok) return item;

            const productData = await response.json();
            // Если цена изменилась, обновляем её
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

      // Обновляем корзину с актуальными ценами
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

  // Загружаем данные из localStorage только один раз при монтировании
  useEffect(() => {
    // Небольшая задержка для гарантии гидратации
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

  // Показываем загрузку, пока не получим данные из localStorage
  if (!loaded) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg text-gray-600">Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем пустую корзину
  if (!cart || cart.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка с товарами */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Товары в корзине ({summary.count})</h2>
                <div className="flex items-center gap-4">
                  <Link href="/products" className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
                    <FaArrowLeft className="w-4 h-4" />
                    Продолжить покупки
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedCart).map(([date, products]) => (
                  <div key={date}>
                    <h3 className="text-md font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200">
                      Добавлено: {date}
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <CartItemRow
                          key={`${product.id}-${product.added_at}`}
                          product={product}
                          updateProductQuantity={updateProductQuantity}
                          deleteProduct={deleteProduct}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка с итогами */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Сводка заказа</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Товары ({summary.count})</span>
                  <span>{currencyFormat(summary.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка</span>
                  <span className="text-blue-600">По согласованию</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого</span>
                  <span className="text-xl font-bold">{currencyFormat(summary.total)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                disabled={cart.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      </div>
    </div>
  );
}
