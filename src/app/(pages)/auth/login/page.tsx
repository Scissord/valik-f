import { LoginForm } from "@/components";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-12 py-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Вход в аккаунт
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Введите учётные данные, чтобы продолжить покупки
          </p>
        </header>

        <LoginForm idPrefix="desktop" />
      </div>
    </div>
  );
}
