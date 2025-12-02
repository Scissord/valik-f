'use client'
import { RegistrationForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-12 py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className={`${titleFont.className} text-3xl sm:text-4xl text-gray-900`}>
            Создание аккаунта
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Введите данные, чтобы зарегистрироваться и отслеживать заказы
          </p>
        </header>

        <RegistrationForm idPrefix="desktop" />
      </div>
    </div>
  );
}
