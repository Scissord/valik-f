"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { IoLogOutOutline, IoPersonCircleOutline, IoMailOutline, IoPhonePortraitOutline, IoCalendarOutline, IoMaleFemaleOutline, IoLocationOutline } from "react-icons/io5";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const getProfile = useUserStore((state) => state.getProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token && !user) {
        await getProfile();
      }
      
      setIsLoading(false);
    };

    checkUser();
  }, [user, getProfile]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Функция для форматирования даты без библиотеки date-fns
  const formatDate = (timestamp: number | null | undefined): string => {
    if (!timestamp) return 'Не указана';
    
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Функция для перевода пола
  const formatGender = (gender: string | null | undefined): string => {
    if (gender === 'male') return 'Мужской';
    if (gender === 'female') return 'Женский';
    return 'Не указан';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <IoPersonCircleOutline className="mx-auto h-24 w-24 text-orange-500 mb-4" />
          <p className="text-lg mb-6 text-gray-700">Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pt-20 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Шапка профиля */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 relative">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{user.full_name}</h1>
              <p className="text-white/80">@{user.login}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all"
            >
              <IoLogOutOutline className="mr-2 text-xl" />
              Выйти
            </button>
          </div>
        </div>
        
        {/* Информация профиля */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Личная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <IoMailOutline className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <IoPhonePortraitOutline className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="text-lg font-medium">{user.phone || 'Не указан'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <IoCalendarOutline className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Дата рождения</p>
                <p className="text-lg font-medium">{formatDate(user.birth_date)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <IoMaleFemaleOutline className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Пол</p>
                <p className="text-lg font-medium">{formatGender(user.gender)}</p>
              </div>
            </div>
            
            <div className="flex items-start md:col-span-2">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <IoLocationOutline className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Адрес</p>
                <p className="text-lg font-medium">{user.address || 'Не указан'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Аккаунт создан: {user.created_at ? new Date(parseInt(user.created_at)).toLocaleDateString() : 'Нет данных'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
