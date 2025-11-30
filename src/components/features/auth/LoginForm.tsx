"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { login, UserLogin } from "@/lib/legacy";
import { useUserStore } from "@/lib/legacy";

export const LoginForm = () => {
  const router = useRouter();
  const [responseErrors, setResponseErrors] = useState<{ msg: string }[] | null>([]);
  const [showPassword, setShowPassword] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [user, router]);

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
  } = useForm<UserLogin>({ mode: "onChange" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col space-y-6"
    >
      <div className="space-y-5">
        <div className="relative">
          <input
            id="login"
            type="text"
            placeholder=" "
            className="peer w-full rounded-2xl border border-gray-200 bg-transparent px-4 pt-6 pb-2 text-base text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0"
            {...register("login", { required: "Укажите ваш логин" })}
          />
          <label
            htmlFor="login"
            className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-900"
          >
            Логин
          </label>
        </div>
        {errors.login && (
          <p className="text-sm text-red-500">{errors.login.message}</p>
        )}

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            className="peer w-full rounded-2xl border border-gray-200 bg-transparent px-4 pt-6 pb-2 text-base text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-0"
            {...register("password", { required: "Укажите пароль" })}
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-4 top-2 text-xs text-gray-500 transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-gray-900"
          >
            Пароль
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 transition hover:text-gray-900"
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {responseErrors && responseErrors.length > 0 && (
        <p className="text-sm text-red-500" aria-live="polite">
          Неверно введенные данные
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-2xl border border-orange-500 bg-orange-500 py-3 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!isValid}
      >
        Войти
      </button>

      <p className="text-center text-sm text-gray-600">
        Нет аккаунта?{' '}
        <Link href="/auth/registration" className="text-orange-500 underline">
          Зарегистрируйтесь
        </Link>
      </p>

    </form>
  );
};
