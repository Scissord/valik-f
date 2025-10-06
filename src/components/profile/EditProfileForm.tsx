"use client";

import { useState } from "react";
import { useUserStore } from "@/store";
import { User } from "@/interfaces/user";
import { UserAPI } from "@/api";
import { IoSaveOutline, IoCloseOutline } from "react-icons/io5";

interface EditProfileFormProps {
  onClose: () => void;
}

export type UpdateProfileData = Partial<User>;

interface FormData {
  email?: string;
  full_name?: string;
  phone?: string;
  birth_date?: string; // В форме дата хранится как строка
  gender?: 'male' | 'female' | 'other';
  address?: string;
}

export const EditProfileForm = ({ onClose }: EditProfileFormProps) => {
  const user = useUserStore((state) => state.user);
  const getProfile = useUserStore((state) => state.getProfile);

  const [formData, setFormData] = useState<FormData>({
    email: user?.email ?? "",
    full_name: user?.full_name ?? "",
    phone: user?.phone ?? "",
    birth_date: user?.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : "",
    gender: user?.gender as 'male' | 'female' | 'other' | undefined,
    address: user?.address ?? "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Валидация email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    // Валидация full_name
    if (formData.full_name && (formData.full_name.length < 1 || formData.full_name.length > 255)) {
      newErrors.full_name = "Имя должно быть от 1 до 255 символов";
    }

    // Валидация phone
    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Номер телефона слишком длинный";
    }

    // Валидация birth_date
    if (formData.birth_date && isNaN(Date.parse(formData.birth_date))) {
      newErrors.birth_date = "Неверный формат даты";
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
      const dataToSend: UpdateProfileData = {};

      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          const formValue = formData[key as keyof FormData];
          const userValue = user ? user[key as keyof User] : undefined;

          let transformedUserValue: any = userValue;

          if (key === 'birth_date' && userValue) {
            transformedUserValue = new Date(userValue as number).toISOString().split('T')[0];
          }

          if (formValue !== transformedUserValue) {
            if (key === 'birth_date' && formValue) {
              // Преобразуем строку даты в timestamp для отправки на сервер
              (dataToSend as any)[key] = new Date(formValue).getTime();
            } else {
              (dataToSend as any)[key] = formValue;
            }
          }
        }
      }

      if (user && Object.keys(dataToSend).length > 0) {
        await UserAPI.update(user.id, dataToSend);
        await getProfile(); // Обновляем данные пользователя в сторе
        onClose();
      } else {
        onClose(); // Если нет изменений, просто закрываем форму
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Произошла неизвестная ошибка";
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

    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Редактировать профиль</h2>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email адрес
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите email или оставьте пустым для очистки"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Полное имя
            </label>
            <input
              type="text"
              value={formData.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите полное имя или оставьте пустым для очистки"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите номер телефона или оставьте пустым для очистки"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата рождения
            </label>
            <input
              type="date"
              value={formData.birth_date || ""}
              onChange={(e) => handleInputChange("birth_date", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.birth_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.birth_date && (
              <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пол
            </label>
            <select
              value={formData.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value as 'male' | 'female' | 'other')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Не указан</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Адрес доставки
            </label>
            <textarea
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Введите адрес доставки или оставьте пустым для очистки"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <IoSaveOutline className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};