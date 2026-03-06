"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoSaveOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { OrderHistory } from "@/components";
import { useUserStore, UserAPI, User } from "@/lib/legacy";

type FormState = {
  name: string;
  phone: string;
};

type StatusMessage = {
  type: "success" | "error";
  text: string;
};

const buildFormState = (user: User | null): FormState => ({
  name: user?.name ?? "",
  phone: user?.phone ?? "",
});

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const getProfile = useUserStore((state) => state.getProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormState>(() =>
    buildFormState(user)
  );
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );

  useEffect(() => {
    const checkUser = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (token && !user) {
        await getProfile();
      }

      setIsLoading(false);
    };

    void checkUser();
  }, [user, getProfile]);

  useEffect(() => {
    setFormData(buildFormState(user));
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await UserAPI.updateProfile(user.id, formData);
      await getProfile();

      setStatusMessage({ type: "success", text: "Изменения сохранены" });
    } catch {
      console.error("Failed to update profile");
      setStatusMessage({
        type: "error",
        text: "Не удалось сохранить изменения",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-4 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-4 lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoPersonOutline className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Войдите в аккаунт
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Личный кабинет доступен только авторизованным пользователям
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Войти
              <IoChevronForwardOutline className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 transition-colors";

  return (
    <div className="bg-white min-h-screen pt-24 pb-4 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Личные данные</h2>

              {statusMessage && (
                <div
                  className={`rounded-xl p-4 mb-4 text-sm ${statusMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                    }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Имя</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Введите ваше имя"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="7XXXXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <IoSaveOutline className="w-5 h-5" />
                    {isSaving ? "Сохраняем..." : "Сохранить"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Order history */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <OrderHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
