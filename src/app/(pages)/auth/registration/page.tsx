'use client'
import { RegistrationForm } from "@/components";
import { titleFont } from "@/config/fonts";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="text-left">
          <h1 className={`${titleFont.className} text-3xl text-gray-900`}>
            Создание аккаунта
          </h1>
        </header>

        <section className="rounded-[32px] border border-gray-200 p-6 sm:p-10">
          <RegistrationForm />
        </section>
      </div>
    </div>
  );
}
