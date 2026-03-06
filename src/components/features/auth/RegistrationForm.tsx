'use client'
import { registerUser } from '@/lib/legacy';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { IoAlertCircleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Введите ваше имя' }),
  phone: z.string()
    .min(10, { message: 'Введите корректный номер телефона (от 10 цифр)' })
    .max(15, { message: 'Номер не должен превышать 15 цифр' })
    .regex(/^\d{10,15}$/, { message: 'Номер должен содержать только от 10 до 15 цифр' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }).refine(s => !s.includes(' '), 'Пароль не должен содержать пробелы'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegistrationFormProps {
  idPrefix?: string;
}

const makeId = (prefix: string, field: string) => (prefix ? `${prefix}-${field}` : field);

export const RegistrationForm = ({ idPrefix = "" }: RegistrationFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
        <p className="font-bold">Успешно!</p>
        <p>Вы успешно зарегистрированы. Перенаправляем на страницу входа...</p>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5 rounded-md">
          <div className="flex items-center">
            <IoAlertCircleOutline className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col space-y-6">
        <div className="space-y-5">
          <div className="relative">
            <input
              id={makeId(idPrefix, "phone")}
              type="text"
              inputMode="numeric"
              placeholder=" "
              className="peer w-full rounded-2xl border border-gray-200 bg-transparent px-4 pt-6 pb-2 text-base text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0"
              {...register("phone")}
            />
            <label
              htmlFor={makeId(idPrefix, "phone")}
              className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-900"
            >
              Номер телефона
            </label>
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}

          <div className="relative">
            <input
              id={makeId(idPrefix, "name")}
              type="text"
              placeholder=" "
              className="peer w-full rounded-2xl border border-gray-200 bg-transparent px-4 pt-6 pb-2 text-base text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0"
              {...register("name")}
            />
            <label
              htmlFor={makeId(idPrefix, "name")}
              className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-900"
            >
              Ваше имя
            </label>
          </div>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}




          <div className="relative">
            <input
              id={makeId(idPrefix, "password")}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              className="peer w-full rounded-2xl border border-gray-200 bg-transparent px-4 pt-6 pb-2 text-base text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0"
              {...register("password")}
            />
            <label
              htmlFor={makeId(idPrefix, "password")}
              className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-900"
            >
              Пароль
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:text-gray-900"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full rounded-2xl border border-orange-500 bg-orange-500 py-3 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-orange-500 underline">
            Войдите
          </Link>
        </p>

      </form>
    </>
  );
}
