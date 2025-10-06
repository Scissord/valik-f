"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { IoLogOutOutline, IoPersonCircleOutline, IoMailOutline, IoPhonePortraitOutline, IoCalendarOutline, IoMaleFemaleOutline, IoLocationOutline, IoSettingsOutline, IoShieldCheckmarkOutline, IoTimeOutline, IoPersonOutline, IoChevronDownOutline, IoSaveOutline } from "react-icons/io5";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { UserAPI } from "@/api";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const getProfile = useUserStore((state) => state.getProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    birth_date: user?.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : "",
    gender: user?.gender || "",
    address: user?.address || "",
  });

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

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        phone: user.phone || "",
        birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : "",
        gender: user.gender || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      // Преобразуем birth_date из строки в число (timestamp) перед отправкой
      const updatedData = {
        ...formData,
        birth_date: formData.birth_date ? new Date(formData.birth_date).getTime() : null
      };
      await UserAPI.update(user.id, updatedData);
      await getProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gradient-to-r from-orange-200 to-orange-300 h-32 w-32"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-64"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-48"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-56"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <IoPersonCircleOutline className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Добро пожаловать!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Пожалуйста, войдите в систему, чтобы просмотреть свой профиль и управлять заказами.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 w-full transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Войти в аккаунт
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-8">
      {/* Контейнер с правильными отступами под хедер */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Профиль карточка */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 mb-8">
          {/* Шапка профиля с градиентом */}
          <div className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 p-8 md:p-12">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                {/* Аватар */}
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                  <div className="bg-white rounded-full p-4">
                    <IoPersonCircleOutline className="h-16 w-16 text-orange-500" />
                  </div>
                </div>
                
                {/* Информация о пользователе */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.full_name}</h1>
                  <p className="text-white/90 text-lg">@{user.login}</p>
                  <div className="flex items-center mt-2 text-white/80">
                    <IoTimeOutline className="mr-2" />
                    <span className="text-sm">
                      Аккаунт создан: {user.created_at ? new Date(parseInt(user.created_at)).toLocaleDateString('ru-RU') : 'Нет данных'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Кнопки действий */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
                >
                  <IoSettingsOutline className="mr-2 text-xl" />
                  {isEditing ? 'Отмена' : 'Редактировать'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-white/20 hover:bg-red-500/80 backdrop-blur-sm text-white py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
                >
                  <IoLogOutOutline className="mr-2 text-xl" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
          
          {/* Основная информация профиля */}
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8">
              <IoShieldCheckmarkOutline className="text-orange-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Личная информация</h2>
            </div>
            
            {isEditing ? (
              <div className="bg-white rounded-xl p-8 mb-12 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Редактирование профиля</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMailOutline className="text-orange-500" />
                    </div>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="Email" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPersonOutline className="text-orange-500" />
                    </div>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleInputChange} 
                      placeholder="Полное имя" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPhonePortraitOutline className="text-orange-500" />
                    </div>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="Телефон" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoCalendarOutline className="text-orange-500" />
                    </div>
                    <input 
                      type="date" 
                      name="birth_date" 
                      value={formData.birth_date} 
                      onChange={handleInputChange} 
                      placeholder="Дата рождения" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPersonCircleOutline className="text-orange-500" />
                    </div>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleInputChange} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none appearance-none"
                    >
                      <option value="">Выберите пол</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                      <option value="other">Другой</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <IoChevronDownOutline className="text-gray-400" />
                    </div>
                  </div>
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-orange-500" />
                    </div>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="Адрес" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none" 
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-8 space-x-4">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
                  >
                    Отмена
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    <IoSaveOutline className="mr-2" />
                    Сохранить
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Email */}
                  <div className="hover:bg-gray-100 p-4 rounded-lg transition-colors">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4 flex-shrink-0">
                        <IoMailOutline className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Email адрес</p>
                        <p className="text-lg font-semibold text-gray-800 break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Телефон */}
                  <div className="hover:bg-gray-100 p-4 rounded-lg transition-colors">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4 flex-shrink-0">
                        <IoPhonePortraitOutline className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Номер телефона</p>
                        <p className="text-lg font-semibold text-gray-800">{user.phone || 'Не указан'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Дата рождения */}
                  <div className="hover:bg-gray-100 p-4 rounded-lg transition-colors">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4 flex-shrink-0">
                        <IoCalendarOutline className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Дата рождения</p>
                        <p className="text-lg font-semibold text-gray-800">{formatDate(user.birth_date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Пол */}
                  <div className="hover:bg-gray-100 p-4 rounded-lg transition-colors">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4 flex-shrink-0">
                        <IoMaleFemaleOutline className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Пол</p>
                        <p className="text-lg font-semibold text-gray-800">{formatGender(user.gender)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Адрес */}
                  <div className="hover:bg-gray-100 p-4 rounded-lg transition-colors md:col-span-2 xl:col-span-2">
                    <div className="flex items-start">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4 flex-shrink-0">
                        <IoLocationOutline className="text-orange-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Адрес доставки</p>
                        <p className="text-lg font-semibold text-gray-800">{user.address || 'Не указан'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* История заказов */}
            <div className="border-t border-gray-200 pt-8">
              <OrderHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
