"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login } from "@/api";
import { UserLogin } from "@/interfaces";
import { IoInformationOutline, IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline } from "react-icons/io5";
import { useUserStore } from "@/store";

export const LoginForm = () => {
  const router = useRouter();
  const [responseErrors, setResponseErrors] = useState<{ msg: string }[] | null>([]);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [user]);

  const onSubmit = async (data: UserLogin) => {
    setResponseErrors([]);
    const { user, accessToken, errors } = await login(data);
    if (user && accessToken) {
      setUser(user, accessToken);
      router.push(`/`);
    } else {
      if (errors && errors.length > 0) {
        setResponseErrors(errors);
        reset();
      }
    };
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<UserLogin>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full"
    >
      <div className="mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IoMailOutline className="h-5 w-5" />
          </div>
          <input
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            type="email"
            placeholder="Email"
            {...register("email", { required: "Укажите ваш email!" })}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
            {...register("password", { required: "Укажите ваш пароль!" })}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>


      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {responseErrors && responseErrors.length > 0 && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500 ml-1">
              Неверно введенные данные!
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isValid}
      >
        Войти
        <IoArrowForwardOutline className="w-5 h-5" />
      </button>

      <div className="flex items-center my-6">
        <div className="flex-1 bg-gray-200 h-0.5 rounded"></div>
        <div className="px-3 text-gray-500 text-sm">Или</div>
        <div className="flex-1 bg-gray-200 h-0.5 rounded" />
      </div>

      <Link 
        href="/auth/register" 
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors text-center"
      >
        Создать новую учетную запись
      </Link>

      {/* Кнопка "Вернуться на главную" только для десктопной версии */}
      <div className="mt-4 text-center hidden lg:block">
        <Link href="/" className="text-orange-500 hover:text-orange-600 text-sm">
          Вернуться на главную
        </Link>
      </div>
    </form>
  );
};
