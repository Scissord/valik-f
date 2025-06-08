"use client";

import { useActionState, useEffect } from 'react';
import Link from "next/link";
import {  useFormStatus } from "react-dom";

import { authenticate } from "@/actions";
import { IoInformationOutline } from "react-icons/io5";
import clsx from 'clsx';
// import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  // const router = useRouter();
  const [state, dispatch] = useActionState(authenticate, undefined);

  useEffect(() => {
    if ( state === 'Success' ) {
      // redireccionar
      // router.replace('/');
      window.location.replace('/');
    }

  },[state]);

  return (
    <form action={dispatch} className="flex flex-col ">
      <label htmlFor="email">Почта</label>
      <input
        className="p-2 border border-slate-300 rounded-md mt-2"
        type="email"
        name="email"
      />

      <label htmlFor="email">
        Пароль
      </label>
      <input
        className="p-2 border border-slate-300 rounded-md mt-2 "
        type="password"
        name="password"
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === "CredentialsSignin" && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">
              Credenciales no son correctas
            </p>
          </div>
        )}
      </div>

        <LoginButton />
      {/* <button type="submit" className="btn-primary">
        Ingresar
      </button> */}

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 bg-slate-300 h-0.5 rounded"></div>
        <div className="px-2 text-slate-800">Или</div>
        <div className="flex-1 bg-slate-300 h-0.5 rounded "></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Создать новую учетную запись
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={ clsx({
        "btn-primary": !pending,
        "btn-disabled": pending
      })}
      disabled={ pending }
    >
      Войти
    </button>
  );
}