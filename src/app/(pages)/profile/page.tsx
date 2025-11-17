"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoChevronDownOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { OrderHistory } from "@/components";
import { useUserStore, UserAPI, User } from "@/lib/legacy";

type FormState = {
  email: string;
  full_name: string;
  phone: string;
  birth_date: string;
  gender: "male" | "female" | "";
  address: string;
};

type StatusMessage = {
  type: "success" | "error";
  text: string;
};

const genderOptions: Array<{ value: FormState["gender"]; label: string }> = [
  { value: "", label: "Не указан" },
  { value: "male", label: "Мужской" },
  { value: "female", label: "Женский" },
];

const buildFormState = (user: User | null): FormState => ({
  email: user?.email ?? "",
  full_name: user?.full_name ?? "",
  phone: user?.phone ?? "",
  birth_date: user?.birth_date
    ? new Date(user.birth_date).toISOString().split("T")[0]
    : "",
  gender: (user?.gender as FormState["gender"]) ?? "",
  address: user?.address ?? "",
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
      const payload = {
        ...formData,
        birth_date: formData.birth_date
          ? new Date(formData.birth_date).getTime()
          : null,
      };

      await UserAPI.update(user.id, payload);
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

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-center min-h-[60vh]">
          <div className="space-y-3 text-center text-gray-400">
            <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto animate-pulse" />
            <p className="text-sm">Загружаем профиль...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-10 text-center space-y-6 max-w-md w-full">
            <div className="mx-auto h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <IoPersonCircleOutline className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Войдите в аккаунт
            </h2>
            <p className="text-sm text-gray-600">
              Личный кабинет доступен только авторизованным пользователям. После
              входа вы сможете просматривать и редактировать свои данные.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white text-sm font-medium transition hover:bg-orange-600"
            >
              Перейти к авторизации
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
          <p className="mt-2 text-gray-600">Профиль и история заказов</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col gap-6">
            <div className="space-y-6">
              {statusMessage && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    statusMessage.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">ФИО</span>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Введите ФИО"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.ru"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Телефон
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Например, +7 900 000-00-00"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Дата рождения
                  </span>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">Пол</span>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </label>

                <label className="sm:col-span-2 flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Адрес доставки
                  </span>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Укажите город, улицу, дом и квартиру"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600 disabled:opacity-70"
                >
                  <IoSaveOutline className="h-4 w-4" />
                  {isSaving ? "Сохраняем..." : "Сохранить"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <OrderHistory />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
          >
            <IoLogOutOutline className="h-4 w-4" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
