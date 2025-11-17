"use client";
// import { useSession } from "next-auth/react";
import Link from "next/link";
// import { redirect } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

export default function EmptyPage() {
  // const {  status } = useSession();
  // console.log(status)

  // if (status === "loading") {
  //   return <p>Cargando...</p>;
  // }
  // if (status === "unauthenticated") {
  //   redirect("/auth/login"); // Redirigir si no tiene sesión
  // }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-100/60 rounded-full blur-3xl scale-125" />
            <div className="relative bg-white border border-gray-200 rounded-full p-8">
              <IoCartOutline className="w-20 h-20 text-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ваша корзина пуста
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg">
            Добавьте понравившиеся товары, чтобы увидеть их здесь и оформить заказ в несколько кликов.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 font-medium shadow-sm transition hover:from-orange-600 hover:to-orange-500"
          >
            <FaArrowLeft className="w-4 h-4" />
            Вернуться к покупкам
          </Link>
        </div>
      </div>
    </div>
  );
}
