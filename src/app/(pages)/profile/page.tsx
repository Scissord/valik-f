"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg mb-4">Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Войти
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Профиль пользователя</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-red-500 hover:text-red-700"
        >
          <IoLogOutOutline className="mr-2" />
          Выйти
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Имя:</p>
          <p className="text-lg">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email:</p>
          <p className="text-lg">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
