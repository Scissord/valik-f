'use client';

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";
import { useEffect, useState } from "react";
import { IoPersonCircleOutline, IoLogOutOutline, IoCartOutline, IoHomeOutline, IoSettingsOutline, IoShieldOutline } from "react-icons/io5";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    console.log('ProfilePage: Текущий пользователь в хранилище:', user);

    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('accessToken');
    console.log('ProfilePage: Токен в localStorage:', token ? 'Присутствует' : 'Отсутствует');

    // Даём немного времени на загрузку данных из хранилища
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Если пользователь не авторизован, перенаправляем на логин
      if (!user && !token) {
        console.log('ProfilePage: Пользователь не авторизован, перенаправляем на страницу входа');
        router.push('/auth/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, router]);

  // Функция для выхода из системы
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Отправляем запрос на сервер для выхода
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Даже если запрос не удался, всё равно очищаем локальное состояние
      logout();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // В случае ошибки всё равно выходим локально
      logout();
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Пока проверяем авторизацию, показываем загрузку
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-32 h-32 flex items-center justify-center">
            <IoPersonCircleOutline className="w-full h-full text-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p className="text-white/80 mt-1">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <IoLogOutOutline className="w-5 h-5" />
                {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IoPersonCircleOutline className="w-6 h-6 text-orange-500" />
              Личная информация
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Логин</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{user.login}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Полное имя</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{user.full_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Телефон</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{user.phone || 'Не указан'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Адрес</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{user.address || 'Не указан'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Дата регистрации</p>
                <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                  {/* {user.created_at ? new Date(parseInt(user.created_at)).toLocaleDateString() : 'Неизвестно'} */}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <IoCartOutline className="w-6 h-6 text-orange-500" />
              История заказов
            </h2>

            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <IoCartOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">У вас пока нет заказов.</p>
              <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Перейти в каталог
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Навигация</h3>

            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 p-3 bg-orange-50 text-orange-600 rounded-lg font-medium">
                <IoPersonCircleOutline className="w-5 h-5" />
                Личный кабинет
              </a>
              <a href="/orders" className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                <IoCartOutline className="w-5 h-5" />
                Мои заказы
              </a>
              <a href="/settings" className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                <IoSettingsOutline className="w-5 h-5" />
                Настройки
              </a>
              <a href="/" className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                <IoHomeOutline className="w-5 h-5" />
                На главную
              </a>

              <hr className="my-4 border-gray-100" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              >
                <IoLogOutOutline className="w-5 h-5" />
                {isLoggingOut ? 'Выход...' : 'Выйти из аккаунта'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
