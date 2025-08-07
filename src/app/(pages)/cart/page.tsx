'use client';

import { Title } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegTrashCan, FaArrowLeft } from "react-icons/fa6";
import { IoSyncOutline } from "react-icons/io5";
import { IoCartOutline, IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { currencyFormat } from "@/util";
import { useShallow } from 'zustand/react/shallow';

export default function CartPage() {
  const [loaded, setLoaded] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  
  // Используем useShallow для предотвращения лишних ререндеров
  const { cart, updateProductQuantity, deleteProduct } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      updateProductQuantity: state.updateProductQuantity,
      deleteProduct: state.deleteProduct
    }))
  );
  
  // Вычисляем summary только когда корзина загружена и только при изменении cart
  const summary = loaded ? {
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: cart.reduce((count, item) => count + item.quantity, 0)
  } : { total: 0, count: 0 };

  // Функция для обновления цен товаров из бэкенда
  const updatePricesFromBackend = async () => {
    if (isUpdatingPrices || cart.length === 0) return;
    
    setIsUpdatingPrices(true);
    try {
      // Получаем актуальные цены для всех товаров в корзине
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          try {
            // Запрос к бэкенду для получения актуальной цены
            const response = await fetch(`http://localhost:8080/products/${item.id}`);
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
        if (item.price !== cart.find(cartItem => cartItem.id === item.id)?.price) {
          updateProductQuantity(item, item.quantity);
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  // Загружаем данные из localStorage только один раз при монтировании
  useEffect(() => {
    // Небольшая задержка для гарантии гидратации
    const timer = setTimeout(() => {
    setLoaded(true);
      // После загрузки корзины обновляем цены с бэкенда
      updatePricesFromBackend();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Показываем загрузку, пока не получим данные из localStorage
  if (!loaded) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-gray-600">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  // Показываем пустую корзину
  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="bg-gray-50 p-8 rounded-full mb-6">
          <IoCartOutline className="w-24 h-24 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ваша корзина пуста</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Добавьте товары в корзину, чтобы оформить заказ
        </p>
        <Link 
          href="/products" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FaArrowLeft />
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-orange-500 pl-4">Корзина</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка с товарами */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Товары в корзине ({summary.count})</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={updatePricesFromBackend} 
                  disabled={isUpdatingPrices}
                  className="text-gray-500 hover:text-orange-500 flex items-center gap-1"
                >
                  <IoSyncOutline className={`w-4 h-4 ${isUpdatingPrices ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Обновить цены</span>
                </button>
              <Link href="/products" className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
                <FaArrowLeft className="w-4 h-4" />
                Продолжить покупки
              </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cart.map((product) => (
                <div key={product.id} className="py-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      width={80}
                      height={80}
                      alt={product.title}
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <Link href={`/product/${product.slug}`} className="text-lg font-medium text-gray-900 hover:text-orange-500 transition-colors">
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
                          <span className="px-3 py-1 font-medium">{product.quantity}</span>
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
                <span className="text-green-600">Бесплатно</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Итого</span>
                <span className="text-xl font-bold">{currencyFormat(summary.total)}</span>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
