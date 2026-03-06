import api from "../axios";
import type { User } from "@/lib/legacy";

interface UpdateProfileInput {
    name?: string;
    phone?: string;
    avatar?: File;
}

/**
 * PATCH /buyer/profile/update/{id}/
 * Обновляет профиль покупателя. Поддерживает загрузку аватара (multipart/form-data).
 */
export const updateProfile = async (
    id: string | number,
    data: UpdateProfileInput
): Promise<User | null> => {
    try {
        const formData = new FormData();
        if (data.name !== undefined) formData.append("name", data.name);
        if (data.phone !== undefined) formData.append("phone", data.phone);
        if (data.avatar) formData.append("avatar", data.avatar);

        const response = await api.patch<User>(`/buyer/profile/update/${id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении профиля:", error);
        return null;
    }
};
