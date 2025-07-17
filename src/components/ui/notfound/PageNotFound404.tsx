'use client';

import { titleFont } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBackOutline, IoHomeOutline } from 'react-icons/io5';

export const PageNotFound404 = () => {
  return (
    <div id="page-not-found" className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      
      <div className="relative mb-8">
        <Image 
          src="/404.svg" 
          alt="Иллюстрация 404 - Страница не найдена" 
          width={350} 
          height={350} 
          className="mx-auto"
        />
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
      </div>

      <h1 className={`${titleFont.className} text-4xl md:text-5xl font-bold text-gray-800 mb-2`}>
        Ой, страница потерялась!
      </h1>

      <p className="text-gray-600 text-lg max-w-md mb-8">
        Кажется, вы свернули не туда. Страница, которую вы ищете, не существует или была перемещена.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-300"
        >
          <IoArrowBackOutline className="w-5 h-5" />
          Вернуться назад
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
        >
          <IoHomeOutline className="w-5 h-5" />
          На главную
        </Link>
      </div>

    </div>
  );
};
