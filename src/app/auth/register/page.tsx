'use client'
import { registerUser } from '@/api/auth/register';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { IoAlertCircleOutline, IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { titleFont } from "@/config/fonts";

// Схема валидации Zod
const registerSchema = z.object({
  login: z.string().min(4, { message: 'Логин должен содержать минимум 4 символа' }).refine(s => !s.includes(' '), 'Логин не должен содержать пробелы'),
  email: z.string().email({ message: 'Неверный формат email' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }).refine(s => !s.includes(' '), 'Пароль не должен содержать пробелы'),
  full_name: z.string().min(2, { message: 'Введите ваше полное имя' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setSuccess(false);

    const result = await registerUser(data);

    if (!result.success) {
      setError(result.errors?.map((e: { msg: string }) => e.msg).join(', ') || 'Произошла ошибка');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-100 rounded-full opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-50 rounded-full opacity-70 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gray-100 rounded-full opacity-60"></div>
      </div>

      {/* Модальное окно регистрации */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full z-10 relative">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-6 px-8">
          <h1 className={`${titleFont.className} text-3xl text-white`}>
            Создание аккаунта
          </h1>
          <p className="text-white/80 mt-1">Зарегистрируйтесь, чтобы начать покупки</p>
        </div>

        <div className="p-8">
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
              <p className="font-bold">Успешно!</p>
              <p>Вы успешно зарегистрированы. Теперь вы можете <Link href="/auth/login" className="font-medium underline">войти</Link>.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5 rounded-md">
              <div className="flex items-center">
                <IoAlertCircleOutline className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="mb-5">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoPersonOutline className="h-5 w-5" />
                </div>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  type="text"
                  placeholder="Логин"
                  {...register("login")}
                />
              </div>
              {errors.login && (
                <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>
              )}
            </div>

            <div className="mb-5">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoMailOutline className="h-5 w-5" />
                </div>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-5">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoPersonOutline className="h-5 w-5" />
                </div>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  type="text"
                  placeholder="Полное имя"
                  {...register("full_name")}
                />
              </div>
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div className="mb-5">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoLockClosedOutline className="h-5 w-5" />
                </div>
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  type="password"
                  placeholder="Пароль"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              <IoArrowForwardOutline className="w-5 h-5" />
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 bg-gray-200 h-0.5 rounded"></div>
              <div className="px-3 text-gray-500 text-sm">Или</div>
              <div className="flex-1 bg-gray-200 h-0.5 rounded" />
            </div>

            <Link
              href="/auth/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              У меня уже есть аккаунт
            </Link>

            <div className="mt-4 text-center">
              <Link href="/" className="text-orange-500 hover:text-orange-600 text-sm">
                Вернуться на главную
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
