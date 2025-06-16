"use client";
import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(6, "Минимум 6 символов"),
  email: z
    .string()
    .length(6, "Минимум 6 символов")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Неверный формат почты"
    ),
  password: z.string().min(6, "Минимум 6 символов"),
});

export const AccountForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorDb, setErrorDb] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDb("");
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      // Mapear los errores
      const newErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    const resp = await registerUser(
      formData.name,
      formData.email,
      formData.password
    );
    if (!resp.ok) {
        setErrorDb(resp.message ?? "")
        return;
    };
    const resp2=await login(formData.email,formData.password);
    if (resp2){
        window.location.replace("/")
    }
    console.log("Datos enviados:", formData);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label htmlFor="name">ФИО</label>
      <input
        id="name"
        name="name"
        className={clsx(
          "px-5 py-2 border border-slate-400 bg-gray-200 rounded mb-2",
          { "border-red-500": !!errors.name }
        )}
        type="text"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && (
        <span className="text-red-500 text-sm">{errors.name}</span>
      )}

      <label htmlFor="email">Почта</label>
      <input
        id="email"
        name="email"
        className={clsx(
          "px-5 py-2 border border-slate-400 bg-gray-200 rounded mb-2",
          { "border-red-500": !!errors.email }
        )}
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && (
        <span className="text-red-500 text-sm">{errors.email}</span>
      )}

      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        name="password"
        className={clsx(
          "px-5 py-2 border border-slate-400 bg-gray-200 rounded mb-2",
          { "border-red-500": !!errors.password }
        )}
        type="password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password}</span>
      )}
      {errorDb}
      <button type="submit" className="btn-primary">
        Зарегестрироваться
      </button>

      {/* Divisor */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      {/* Enlace a login */}
      <Link href="/auth/login" className="btn-secondary text-center">
        Login
      </Link>
    </form>
  );
};
