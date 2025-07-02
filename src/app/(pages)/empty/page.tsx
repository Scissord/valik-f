"use client";

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

export default function EmptyPage() {
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
