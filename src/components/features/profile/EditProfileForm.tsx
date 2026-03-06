"use client";

import { useState } from "react";
import { useUserStore, UserAPI } from "@/lib/legacy";
import type { User } from "@/lib/legacy";
import { IoSaveOutline, IoCloseOutline } from "react-icons/io5";

interface EditProfileFormProps {
  onClose: () => void;
}

export type UpdateProfileData = Partial<User>;

interface FormData {
  name?: string;
  phone?: string;
}

export const EditProfileForm = ({ onClose }: EditProfileFormProps) => {
  const user = useUserStore((state) => state.user);
  const getProfile = useUserStore((state) => state.getProfile);

  const [formData, setFormData] = useState<FormData>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name && (formData.name.length < 1 || formData.name.length > 255)) {
      newErrors.name = "Имя должно быть от 1 до 255 символов";
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Номер должен содержать от 10 до 15 цифр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (user) {
        await UserAPI.updateProfile(user.id, formData);
        await getProfile();
        onClose();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Не удалось сохранить изменения";
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Личные данные</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoCloseOutline className="text-2xl text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                }`}
              placeholder="Введите ваше имя"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.phone ? "border-red-500" : "border-gray-200"
                }`}
              placeholder="7XXXXXXXXXX"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center transform active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <IoSaveOutline className="mr-2" />
                  Сохранить
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

