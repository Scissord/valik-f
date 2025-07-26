"use client";

import Link from "next/link";
import clsx from 'clsx';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRegister } from "@/interfaces";
import { IoInformationOutline, IoMailOutline, IoLockClosedOutline, IoPersonOutline } from "react-icons/io5";
import { useUserStore } from "@/store";
import { registerUser } from "@/api/auth/registration";

export const RegistrationForm = () => {
  const router = useRouter();
  const [responseErrors, setResponseErrors] = useState<{ msg: string }[] | null>([]);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [user]);

  const onSubmit = async (data: UserRegister) => {
    setResponseErrors([]);
    const { user, accessToken, errors } = await registerUser(data);
    if (user && accessToken) {
      setUser(user, accessToken);
      router.push(`/`);
    } else {
      if(errors && errors.length > 0) {
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
  } = useForm<UserRegister>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col"
    >
      <div className='flex flex-col'>
        <label htmlFor="login">Логин</label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2"
          type="text"
          {...register("login", { required: "Укажите ваше логин!" })}
        />
        {errors.login && (
          <p className="text-red-500 text-sm">{errors.login.message}</p>
        )}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="email">
          Пароль
        </label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2 "
          type="password"
          {...register("password", { required: "Укажите ваш пароль!" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="name">
          ФИО
        </label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2 "
          type="text"
          {...register("name", { required: "Укажите ваше ФИО!" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="full_name">
          Почта
        </label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2 "
          type="email"
          {...register("email", { required: "Укажите вашу почту!" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="phone">
          Телефон
        </label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2 "
          type="text"
          {...register("phone", { required: "Укажите ваш  телефон!" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className='flex flex-col'>
        <label htmlFor="gender">
          Пол
        </label>
        <input
          className="p-2 border border-slate-300 rounded-md mt-2 "
          type="text"
          {...register("gender", { required: "Укажите ваш  пол!" })}
        />
        {errors.gender && (
          <p className="text-red-500 text-sm">
            {errors.gender.message}
          </p>
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
            <p className="text-sm text-red-500">
              Неверно введенные данные!
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className={clsx({
          "btn-primary": isValid,
          "btn-disabled": !isValid
        })}
        disabled={!isValid}
      >
        Зарегистрироваться
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 bg-slate-300 h-0.5 rounded"></div>
        <div className="px-2 text-slate-800">Или</div>
        <div className="flex-1 bg-slate-300 h-0.5 rounded " />
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Войти в учетную запись
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
