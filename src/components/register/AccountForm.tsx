"use client";
import { login, registerUser } from "@/actions";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline, IoInformationOutline } from "react-icons/io5";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDb("");
    setIsSubmitting(true);
    
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      // Mapear los errores
      const newErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const resp = await registerUser(
        formData.name,
        formData.email,
        formData.password
      );
      
      if (!resp.ok) {
        setErrorDb(resp.message ?? "Ошибка при регистрации");
        setIsSubmitting(false);
        return;
      }
      
      const resp2 = await login(formData.email, formData.password);
      if (resp2) {
        window.location.replace("/");
      }
      
      setErrors({});
    } catch (error) {
      setErrorDb("Произошла ошибка при регистрации");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !!formData.name && !!formData.email && !!formData.password;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IoPersonOutline className="h-5 w-5" />
          </div>
          <input
            id="name"
            name="name"
            className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            type="text"
            placeholder="ФИО"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div className="mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IoMailOutline className="h-5 w-5" />
          </div>
          <input
            id="email"
            name="email"
            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            type="email"
            placeholder="Почта"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IoLockClosedOutline className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {errorDb && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5 rounded-md">
          <div className="flex items-center">
            <IoInformationOutline className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{errorDb}</p>
          </div>
        </div>
      )}

      <button 
        type="submit" 
        className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${(!isFormValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isFormValid || isSubmitting}
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
        Уже есть аккаунт? Войти
      </Link>
      
      <div className="mt-4 text-center">
        <Link href="/" className="text-orange-500 hover:text-orange-600 text-sm">
          Вернуться на главную
        </Link>
      </div>
    </form>
  );
};
