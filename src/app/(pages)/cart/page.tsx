'use client';

import { Title } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { FaRegTrashCan, FaArrowLeft } from "react-icons/fa6";
import { IoCartOutline, IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { currencyFormat } from "@/util";
import { useShallow } from 'zustand/react/shallow';

export default function CartPage() {
  const [loaded, setLoaded] = useState(false);
  
  // Используем shallow для предотвращения лишних ререндеров
  const { cart, updateProductQuantity, deleteProduct, summary } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      updateProductQuantity: state.updateProductQuantity,
      deleteProduct: state.deleteProduct,
      summary: state.getSummaryInformation()
    }))
  );
  
  // Деструктурируем summary только когда он нужен
  const { total, count } = summary;

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-gray-600">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

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
              <h2 className="text-xl font-semibold text-gray-800">Товары в корзине ({count})</h2>
              <Link href="/products" className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
                <FaArrowLeft className="w-4 h-4" />
                Продолжить покупки
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cart.map((product) => (
                <div key={product.id} className="py-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                    <Image
                      src={product.image || "/imgs/placeholder.png"}
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
                      Артикул: {product.id.substring(0, 8)}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => updateProductQuantity(product, product.quantity - 1)}
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
                        {currencyFormat(product.price * product.quantity)}
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
                <span className="text-gray-600">Товары ({count})</span>
                <span>{currencyFormat(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка</span>
                <span className="text-green-600">Бесплатно</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Итого</span>
                <span className="text-xl font-bold">{currencyFormat(total)}</span>
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
